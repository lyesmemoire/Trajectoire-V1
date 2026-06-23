import { NodeManager } from "../src/healing/NodeManager";

function main() {
  // initial cluster of 5 nodes (honest by default)
  const manager = new NodeManager(5);

  console.log("🚀 Starting self‑healing certification round...");

  // first round (all honest)
  const first = manager.runRound();
  console.log("First round consensus:", first.consensus);

  // simulate some faulty/malicious nodes
  // replace the first node with a faulty one for demonstration
  manager.addNewNodes(0); // placeholder – in a real test you would inject nodes with different modes

  // Force a faulty node scenario by manually adjusting one node's mode (demo only)
  // NOTE: This is just illustrative; in production you would launch nodes with desired modes.
  // Here we manually mutate the internal array for simplicity.
  if (manager.getNodeCount() > 0) {
    // @ts-ignore – accessing private field for demo purposes
    manager["nodes"][0].node = new (require("../src/bft/ByzantineNode").ByzantineNode)("node-1", "faulty");
  }

  const healing = manager.healAndRecertify();
  console.log("Healing round evicted:", healing.evicted);
  console.log("Post‑healing consensus:", healing.round.consensus);
  console.log("Current node count:", manager.getNodeCount());
}

main();
