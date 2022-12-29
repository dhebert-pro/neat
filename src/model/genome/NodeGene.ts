import Gene from "@/model/genome/Gene";

export default class NodeGene extends Gene {
  x: number = 0;
  y: number = 0;

  constructor(innovationNumber: number) {
    super(innovationNumber);
  }

  equals = (gene: NodeGene) => gene.innovationNumber === this.innovationNumber;
}
