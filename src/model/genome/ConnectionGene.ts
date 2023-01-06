import Gene from "@/model/genome/Gene";
import type NodeGene from "@/model/genome/NodeGene";

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
