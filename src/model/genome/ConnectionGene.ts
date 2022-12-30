import Gene from "./Gene";
import type NodeGene from "./NodeGene";

export default class ConnectionGene extends Gene {
  from: NodeGene;
  to: NodeGene;
  weight: number = 0;
  enabled: boolean = true;
  replaceIndex: number = 0;

  constructor(from: NodeGene, to: NodeGene) {
    super(0);
    this.from = from;
    this.to = to;
  }

  equals = (connectionGene: ConnectionGene) =>
    connectionGene.from === this.from && connectionGene.to === this.to;
}
