/**
 * Blueprint SDK for TypeScript
 */

export class Blueprint {
  private version: string;
  
  constructor() {
    this.version = '1.0.0';
  }
  
  /**
   * Hello World method
   */
  async hello(): Promise<string> {
    return 'Hello from Blueprint SDK!';
  }
  
  /**
   * Get SDK version
   */
  getVersion(): string {
    return this.version;
  }
}

export default Blueprint;
