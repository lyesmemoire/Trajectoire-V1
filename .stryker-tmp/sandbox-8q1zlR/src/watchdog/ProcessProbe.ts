// @ts-nocheck
import * as http from "http";
import * as https from "https";
import { URL } from "url";

/**
 * Simple process probe that attempts to GET the health endpoint.
 * Returns a Promise that resolves to true if the request succeeds with a 2xx status.
 * Any network error or non‑2xx status resolves to false.
 */
export class ProcessProbe {
  private url: URL;
  private client: typeof http | typeof https;

  constructor(endpoint: string) {
    this.url = new URL(endpoint);
    this.client = this.url.protocol === "https:" ? https : http;
  }

  public async ping(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const req = this.client.get(this.url, (res) => {
        // Consume data to free memory
        res.resume();
        resolve(res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300);
      });
      req.on("error", () => resolve(false));
      req.setTimeout(2000, () => {
        req.destroy();
        resolve(false);
      });
    });
  }
}
