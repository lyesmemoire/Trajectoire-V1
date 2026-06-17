export interface NodeIdentity {
  nodeId: string;
  region: string;
  weight: number;
}

export class StaticNodeIdentity implements NodeIdentity {
  constructor(
    public nodeId: string,
    public region: string,
    public weight: number = 1
  ) {}
}
