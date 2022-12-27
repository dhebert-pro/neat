import type ConnectionGene from "./ConnectionGene";
import type Neat from "./Neat";
import type NodeGene from "./NodeGene";

export default class Genome {
  connections: ConnectionGene[] = [];
  nodes: NodeGene[] = [];
  neat: Neat;

  distance = (genome: Genome) => 0;

  static crossOver = (genome1: Genome, genome2: Genome) => {
    return null;
  };

  mutate = () => { };

  constructor(neat: Neat) {
    this.neat = neat;
  }
}
