import fs from "fs";
import crypto from "crypto";

const FILE = "node-id.json";

export class NodeId {
  static get(): string {
    if (fs.existsSync(FILE)) {
      return JSON.parse(fs.readFileSync(FILE, "utf-8")).nodeId;
    }

    const id = crypto.randomUUID();
    fs.writeFileSync(FILE, JSON.stringify({ nodeId: id }, null, 2));
    return id;
  }
}
