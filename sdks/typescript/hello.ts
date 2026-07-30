class Blueprint {
  private version: string;
  
  constructor() {
    this.version = '1.0.0';
  }
  
  async hello(): Promise<string> {
    return 'Hello from Blueprint SDK!';
  }
  
  getVersion(): string {
    return this.version;
  }
}

async function main() {
  const bp = new Blueprint();
  const message = await bp.hello();
  console.log(message);
  console.log(`SDK Version: ${bp.getVersion()}`);
}

main().catch(console.error);
