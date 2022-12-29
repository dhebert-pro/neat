import ConnectionGene from "../genome/ConnectionGene";
import Genome from "../genome/Genome";
import NodeGene from "../genome/NodeGene";

export default class Neat {
  all_connections: ConnectionGene[] = [];
  all_nodes: NodeGene[] = [];
  input_size: number = 0;
  output_size: number = 0;
  max_clients: number = 0;

  c1: number = 1;
  c2: number = 1;
  c3: number = 1;
  weight_shift_strength: number = 0.3;
  weight_random_strength: number = 1;
  probability_mutate_link = 0.4;
  probability_mutate_node = 0.4;
  probability_mutate_weight_shift = 0.4;
  probability_mutate_weight_random = 0.4;
  probability_mutate_toggle_link = 0.4;

  constructor(input_size: number, output_size: number, clients: number) {
    this.reset(input_size, output_size, clients);
  }

  empty_genome = () => {
    const g: Genome = new Genome(this);
    for (let i = 0; i < this.input_size + this.output_size; i++) {
      this.getNodeById(i + 1).addToList(g.nodes);
    }

    return g;
  };

  reset = (input_size: number, output_size: number, clients: number) => {
    this.input_size = input_size;
    this.output_size = output_size;
    this.max_clients = clients;
    this.all_connections = [];
    this.all_nodes = [];

    for (let i = 0; i < input_size; i++) {
      const n: NodeGene = this.getNode();
      n.x = 0.1;
      n.y = (i + 1) / (input_size + 1);
    }

    for (let i = 0; i < output_size; i++) {
      const n: NodeGene = this.getNode();
      n.x = 0.9;
      n.y = (i + 1) / (output_size + 1);
    }
  };

  static getConnectionFromConnection = (conG: ConnectionGene) => {
    const c: ConnectionGene = new ConnectionGene(conG.from, conG.to);
    c.innovationNumber = conG.innovationNumber;
    c.weight = conG.weight;
    c.enabled = conG.enabled;
    return c;
  };

  getConnection = (node1: NodeGene, node2: NodeGene) => {
    const connectionGene = new ConnectionGene(node1, node2);
    const existingConnectionGene = this.all_connections.find(
      (connection: ConnectionGene) => connection.equals(connectionGene)
    );

    if (existingConnectionGene) {
      connectionGene.innovationNumber = existingConnectionGene.innovationNumber;
    } else {
      connectionGene.innovationNumber = this.all_connections.length + 1;
      connectionGene.addToList(this.all_connections);
    }

    return connectionGene;
  };

  getNode = () => {
    const nodeGene = new NodeGene(this.all_nodes.length + 1);
    nodeGene.addToList(this.all_nodes);
    return nodeGene;
  };

  getNodeById = (id: number) => {
    if (id <= this.all_nodes.length) {
      return this.all_nodes[id - 1];
    }
    return this.getNode();
  };
}
