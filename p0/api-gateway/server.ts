import { createGateway } from "./gateway";

const PORT = parseInt(process.env.PORT || "3000", 10);

async function main() {
  const gateway = createGateway();
  
  try {
    await gateway.start(PORT);
    console.log(`[P0] API Gateway started on port ${PORT}`);
  } catch (error) {
    console.error("Error starting Gateway", err);
    process.exit(1);
  }
}

main();
