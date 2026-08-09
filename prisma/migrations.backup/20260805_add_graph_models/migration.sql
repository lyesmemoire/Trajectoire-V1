-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create Graph table
CREATE TABLE "graphs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "graphs_pkey" PRIMARY KEY ("id")
);

-- Create indexes for Graph
CREATE INDEX "graphs_isActive_idx" ON "graphs"("isActive");
CREATE INDEX "graphs_deletedAt_idx" ON "graphs"("deleted_at");
CREATE INDEX "graphs_source_idx" ON "graphs"("source");
CREATE INDEX "graphs_createdAt_idx" ON "graphs"("created_at");
CREATE INDEX "graphs_isActive_source_idx" ON "graphs"("isActive", "source");

-- Create GraphNode table
CREATE TABLE "graph_nodes" (
    "id" TEXT NOT NULL,
    "graph_id" TEXT NOT NULL,
    "node_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "normalized_label" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "source" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "embedding" vector(1536),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "graph_nodes_pkey" PRIMARY KEY ("id")
);

-- Create indexes for GraphNode
CREATE INDEX "graph_nodes_graphId_idx" ON "graph_nodes"("graph_id");
CREATE INDEX "graph_nodes_type_idx" ON "graph_nodes"("type");
CREATE INDEX "graph_nodes_normalizedLabel_idx" ON "graph_nodes"("normalized_label");
CREATE INDEX "graph_nodes_confidence_idx" ON "graph_nodes"("confidence");
CREATE INDEX "graph_nodes_deletedAt_idx" ON "graph_nodes"("deleted_at");
CREATE INDEX "graph_nodes_graphId_type_idx" ON "graph_nodes"("graph_id", "type");
CREATE INDEX "graph_nodes_graphId_normalizedLabel_idx" ON "graph_nodes"("graph_id", "normalized_label");
CREATE INDEX "graph_nodes_graphId_type_confidence_idx" ON "graph_nodes"("graph_id", "type", "confidence");
CREATE INDEX "graph_nodes_graphId_deletedAt_idx" ON "graph_nodes"("graph_id", "deleted_at");

-- Create GraphEdge table
CREATE TABLE "graph_edges" (
    "id" TEXT NOT NULL,
    "graph_id" TEXT NOT NULL,
    "edge_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source_node_id" TEXT NOT NULL,
    "target_node_id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "reason" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "graph_edges_pkey" PRIMARY KEY ("id")
);

-- Create indexes for GraphEdge
CREATE INDEX "graph_edges_graphId_idx" ON "graph_edges"("graph_id");
CREATE INDEX "graph_edges_type_idx" ON "graph_edges"("type");
CREATE INDEX "graph_edges_sourceNodeId_idx" ON "graph_edges"("source_node_id");
CREATE INDEX "graph_edges_targetNodeId_idx" ON "graph_edges"("target_node_id");
CREATE INDEX "graph_edges_weight_idx" ON "graph_edges"("weight");
CREATE INDEX "graph_edges_confidence_idx" ON "graph_edges"("confidence");
CREATE INDEX "graph_edges_deletedAt_idx" ON "graph_edges"("deleted_at");
CREATE INDEX "graph_edges_graphId_type_idx" ON "graph_edges"("graph_id", "type");
CREATE INDEX "graph_edges_graphId_sourceNodeId_idx" ON "graph_edges"("graph_id", "source_node_id");
CREATE INDEX "graph_edges_graphId_targetNodeId_idx" ON "graph_edges"("graph_id", "target_node_id");
CREATE INDEX "graph_edges_sourceNodeId_targetNodeId_idx" ON "graph_edges"("source_node_id", "target_node_id");
CREATE INDEX "graph_edges_graphId_type_weight_idx" ON "graph_edges"("graph_id", "type", "weight");
CREATE INDEX "graph_edges_graphId_deletedAt_idx" ON "graph_edges"("graph_id", "deleted_at");

-- Create GraphVersion table
CREATE TABLE "graph_versions" (
    "id" TEXT NOT NULL,
    "graph_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "description" TEXT,
    "changeLog" JSONB NOT NULL DEFAULT '{}',
    "node_count" INTEGER NOT NULL DEFAULT 0,
    "edge_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "graph_versions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "graph_versions_graphId_version_key" UNIQUE ("graph_id", "version")
);

-- Create indexes for GraphVersion
CREATE INDEX "graph_versions_graphId_idx" ON "graph_versions"("graph_id");
CREATE INDEX "graph_versions_version_idx" ON "graph_versions"("version");
CREATE INDEX "graph_versions_createdAt_idx" ON "graph_versions"("created_at");
CREATE INDEX "graph_versions_graphId_version_idx" ON "graph_versions"("graph_id", "version");

-- Create GraphSnapshot table
CREATE TABLE "graph_snapshots" (
    "id" TEXT NOT NULL,
    "graph_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "node_data" JSONB NOT NULL,
    "edge_data" JSONB NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "graph_snapshots_pkey" PRIMARY KEY ("id")
);

-- Create indexes for GraphSnapshot
CREATE INDEX "graph_snapshots_graphId_idx" ON "graph_snapshots"("graph_id");
CREATE INDEX "graph_snapshots_version_idx" ON "graph_snapshots"("version");
CREATE INDEX "graph_snapshots_createdAt_idx" ON "graph_snapshots"("created_at");
CREATE INDEX "graph_snapshots_graphId_version_idx" ON "graph_snapshots"("graph_id", "version");

-- Add foreign key constraints
ALTER TABLE "graph_nodes" ADD CONSTRAINT "graph_nodes_graphId_fkey" FOREIGN KEY ("graph_id") REFERENCES "graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_graphId_fkey" FOREIGN KEY ("graph_id") REFERENCES "graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_sourceNodeId_fkey" FOREIGN KEY ("source_node_id") REFERENCES "graph_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "graph_edges" ADD CONSTRAINT "graph_edges_targetNodeId_fkey" FOREIGN KEY ("target_node_id") REFERENCES "graph_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "graph_versions" ADD CONSTRAINT "graph_versions_graphId_fkey" FOREIGN KEY ("graph_id") REFERENCES "graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "graph_snapshots" ADD CONSTRAINT "graph_snapshots_graphId_fkey" FOREIGN KEY ("graph_id") REFERENCES "graphs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
