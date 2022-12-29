import type Node from "./Node";

export default class Connection {
  from: Node;
  to: Node;
  weight: number = 0;
  enabled: boolean = true;

  constructor(from: Node, to: Node) {
    this.from = from;
    this.to = to;
  }
}
