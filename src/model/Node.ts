import type Connection from "./Connection";

export default class Node {
  x: number;
  output: number = 0;
  connections: Connection[] = [];

  constructor(x: number) {
    this.x = x;
  }

  calculate = () => {
    let sum = 0;
    this.connections.forEach((connection) => {
      sum += connection.weight * connection.from.output;
    });
    this.output = this.activationFunction(sum);
  };

  activationFunction = (value: number) => 1 / (1 + Math.exp(-value));

  static sort = (nodes: Node[]) => {
    nodes.sort((node1: Node, node2: Node) => node2.x - node1.x);
  };
}
