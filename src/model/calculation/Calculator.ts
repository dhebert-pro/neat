import type ConnectionGene from "../genome/ConnectionGene";
import type Genome from "../genome/Genome";
import type NodeGene from "../genome/NodeGene";
import Node from "./Node";
import Connection from "./Connection";

export default class Calculator {
  inputNodes: Node[] = [];
  hiddenNodes: Node[] = [];
  outputNodes: Node[] = [];

  constructor(genome: Genome) {
    const nodes: NodeGene[] = genome.nodes;
    const connections: ConnectionGene[] = genome.connections;

    const nodeList: Node[] = [];

    nodes.forEach((nodeGene: NodeGene) => {
      const node: Node = new Node(nodeGene.x);
      nodeList[nodeGene.innovationNumber] = node;

      if (node.x <= 0.1) {
        this.inputNodes.push(node);
      } else if (node.x >= 0.9) {
        this.outputNodes.push(node);
      } else {
        this.hiddenNodes.push(node);
      }
    });

    Node.sort(this.hiddenNodes);

    connections.forEach((connectionGene: ConnectionGene) => {
      const from: NodeGene = connectionGene.from;
      const to: NodeGene = connectionGene.to;

      const nodeFrom: Node = nodeList[from.innovationNumber];
      const nodeTo: Node = nodeList[to.innovationNumber];

      const connection = new Connection(nodeFrom, nodeTo);
      connection.weight = connectionGene.weight;
      connection.enabled = connectionGene.enabled;

      nodeTo.connections.push(connection);
    });
  }

  calculate = (inputs: number[]) => {
    if (inputs.length !== this.inputNodes.length) {
      throw new Error("Nombre d'entrée différent pour le calcul");
    }
    for (let i = 0; i < this.inputNodes.length; i++) {
      this.inputNodes[i].output = inputs[i];
    }

    this.hiddenNodes.forEach((hiddenNode: Node) => {
      hiddenNode.calculate();
    });

    const output: number[] = [];

    for (let i = 0; i < this.outputNodes.length; i++) {
      this.outputNodes[i].calculate();
      output[i] = this.outputNodes[i].output;
    }

    return output;
  };
}
