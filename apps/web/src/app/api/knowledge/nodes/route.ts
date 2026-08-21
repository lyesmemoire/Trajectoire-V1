import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface KnowledgeNodeResponse {
  id: string;
  name: string;
  type: string;
  connections: number;
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    /*
     * Knowledge nodes belong to graphs, and graphs belong to users.
     *
     * We therefore resolve the authenticated user's active graphs first
     * instead of querying the removed legacy `knowledge_nodes` table.
     */
    const { data: graphs, error: graphsError } = await supabase
      .from("graphs")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .is("deleted_at", null);

    if (graphsError) {
      console.error("[Knowledge] Failed to fetch graphs:", graphsError);

      return NextResponse.json(
        { error: "Failed to fetch nodes" },
        { status: 500 },
      );
    }

    const graphIds = (graphs ?? []).map((graph) => graph.id);

    if (graphIds.length === 0) {
      return NextResponse.json({ nodes: [] });
    }

    const { data: graphNodes, error: nodesError } = await supabase
      .from("graph_nodes")
      .select("id, label, type")
      .in("graph_id", graphIds)
      .is("deleted_at", null)
      .limit(50);

    if (nodesError) {
      console.error("[Knowledge] Failed to fetch graph nodes:", nodesError);

      return NextResponse.json(
        { error: "Failed to fetch nodes" },
        { status: 500 },
      );
    }

    if (!graphNodes || graphNodes.length === 0) {
      return NextResponse.json({ nodes: [] });
    }

    const nodeIds = graphNodes.map((node) => node.id);

    /*
     * Retrieve edges touching the displayed nodes so that the existing
     * frontend contract can keep exposing a connection count.
     */
    const [{ data: outgoingEdges, error: outgoingError }, {
      data: incomingEdges,
      error: incomingError,
    }] = await Promise.all([
      supabase
        .from("graph_edges")
        .select("source_node_id, target_node_id")
        .in("source_node_id", nodeIds)
        .is("deleted_at", null),

      supabase
        .from("graph_edges")
        .select("source_node_id, target_node_id")
        .in("target_node_id", nodeIds)
        .is("deleted_at", null),
    ]);

    if (outgoingError || incomingError) {
      console.error("[Knowledge] Failed to fetch graph edges:", {
        outgoingError,
        incomingError,
      });

      return NextResponse.json(
        { error: "Failed to fetch nodes" },
        { status: 500 },
      );
    }

    const connectionCounts = new Map<string, number>();

    for (const nodeId of nodeIds) {
      connectionCounts.set(nodeId, 0);
    }

    /*
     * The same edge can appear in both queries when both endpoints are in
     * nodeIds. Deduplicate by its endpoint pair before counting it.
     */
    const edgeKeys = new Set<string>();

    for (const edge of [...(outgoingEdges ?? []), ...(incomingEdges ?? [])]) {
      const edgeKey = `${edge.source_node_id}:${edge.target_node_id}`;

      if (edgeKeys.has(edgeKey)) {
        continue;
      }

      edgeKeys.add(edgeKey);

      if (connectionCounts.has(edge.source_node_id)) {
        connectionCounts.set(
          edge.source_node_id,
          (connectionCounts.get(edge.source_node_id) ?? 0) + 1,
        );
      }

      if (connectionCounts.has(edge.target_node_id)) {
        connectionCounts.set(
          edge.target_node_id,
          (connectionCounts.get(edge.target_node_id) ?? 0) + 1,
        );
      }
    }

    const nodes: KnowledgeNodeResponse[] = graphNodes.map((node) => ({
      id: node.id,
      name: node.label,
      type: node.type,
      connections: connectionCounts.get(node.id) ?? 0,
    }));

    return NextResponse.json({ nodes });
  } catch (error) {
    console.error("[Knowledge] Unexpected error:", error);

    return NextResponse.json(
      { error: "Failed to fetch nodes" },
      { status: 500 },
    );
  }
}
