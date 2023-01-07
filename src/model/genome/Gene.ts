import type ConnectionGene from "@/model/genome/ConnectionGene";
import type NodeGene from "@/model/genome/NodeGene";

export default class Gene {
  innovationNumber: number;

  constructor(innovationNumber: number) {
    this.innovationNumber = innovationNumber;
  }

  isInList = (genes: Gene[]): boolean => {
    if (this.constructor.name === "NodeGene") {
      return !!genes.find((gene: Gene) =>
        (this as unknown as NodeGene).equals(gene as NodeGene)
      );
    } else if (this.constructor.name === "ConnectionGene") {
      return !!genes.find((gene: Gene) =>
        (this as unknown as ConnectionGene).equals(gene as ConnectionGene)
      );
    }
    throw new Error(`${this.constructor.name} is not of type Gene`);
  };

  addToList = (genes: Gene[]) => {
    if (!this.isInList(genes)) {
      genes.push(this);
    }
  };

  addSortedToList = (genes: Gene[]) => {
    let index: number = 0;
    for (index; index < genes.length; index++) {
      const gene: Gene = genes[index];
      const innov = gene.innovationNumber;
      if (this.innovationNumber < innov) {
        break;
      }
    }
    genes.splice(index, 0, this);
  };

  removeFromList = (genes: Gene[]) => {
    let index: number = 0;
    for (index; index < genes.length; index++) {
      const gene: Gene = genes[index];
      if ((gene as unknown).equals(this)) {
        break;
      }
    }
    genes.splice(index, 1);
  };

  static getRandomElement = (genes: Gene[]) => {
    if (genes.length === 0) {
      return null;
    }
    return genes[Math.floor(Math.random() * genes.length)];
  };
}
