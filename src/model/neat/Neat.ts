import ConnectionGene from "../genome/ConnectionGene";
import Genome from "../genome/Genome";
import NodeGene from "../genome/NodeGene";
import Client from "./Client";
import RandomSelector from "./Selector";
import Species from "./Species";

export default class Neat {
  all_connections: ConnectionGene[] = [];
  all_nodes: NodeGene[] = [];
  input_size: number = 0;
  output_size: number = 0;
  max_clients: number = 0;

  clients: Client[] = [];
  species: Species[] = [];

  DISJOINTS_FACTOR: number = 1;
  EXCESS_FACTOR: number = 1;
  SIMILAR_FACTOR: number = 1;
  MIN_SPECIATION: number = 1.5;
  WEIGHT_SHIFT_STRENGTH: number = 0.3;
  WEIGHT_RANDOM_STRENGTH: number = 1;
  SURVIVE_RATE = 0.8;
  PROBABILITY_MUTATE_LINK = 0.025;
  PROBABILITY_MUTATE_NODE = 0.015;
  PROBABILITY_MUTATE_WEIGHT_SHIFT = 0.035;
  PROBABILITY_MUTATE_WEIGHT_RANDOM = 0.035;
  PROBABILITY_MUTATE_TOGGLE_LINK = 0.005;

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

  evolve = () => {
    this.genSpecies();
    this.kill();
    this.removeExtinctSpecies();
    this.reproduce();
    this.mutate();
    this.clients.forEach((client: Client) => {
      client.generateCalculator();
    });
  };

  genSpecies = () => {
    this.species.forEach((species: Species) => {
      species.reset();
    });

    for (let i: number = 0; i < this.clients.length; i++) {
      const client = this.clients[i];
      if (client.species) {
        continue;
      }
      let found: boolean = false;
      for (let j: number = 0; j < this.species.length; j++) {
        const species = this.species[j];
        if (species.addIfClose(client)) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.species.push(new Species(client));
      }
    }
    this.species.forEach((species: Species) => {
      species.evaluateScore();
    });
  };

  kill = () => {
    this.species.forEach((species: Species) => {
      species.kill(1 - this.SURVIVE_RATE);
    });
  };

  removeExtinctSpecies = () => {
    for (let i = this.species.length - 1; i >= 0; i--) {
      const species = this.species[i];
      if (species.size() <= 1) {
        species.goExtinct();
        this.species.splice(i, 1);
      }
    }
  };

  reproduce = () => {
    const selector: RandomSelector<Species> = new RandomSelector<Species>();
    this.species.forEach((species: Species) => {
      selector.add(species, species.score);
    });
    this.clients.forEach((client: Client) => {
      if (!client.species) {
        const species: Species | null = selector.random();
        if (species) {
          client.genome = species.breed();
          species.forceAdd(client);
        }
      }
    });
  };

  mutate = () => {
    this.clients.forEach((client: Client) => {
      client.mutate();
    });
  };

  reset = (input_size: number, output_size: number, clients: number) => {
    this.input_size = input_size;
    this.output_size = output_size;
    this.max_clients = clients;
    this.all_connections = [];
    this.all_nodes = [];
    this.clients = [];

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

    for (let i = 0; i < this.max_clients; i++) {
      const client: Client = new Client();
      client.genome = this.empty_genome();
      client.generateCalculator();
      this.clients.push(client);
    }
  };

  getClient = (index: number) => this.clients[index];

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

  setReplaceIndex = (node1: NodeGene, node2: NodeGene, index: number) => {
    const existingConnectionGene: ConnectionGene | undefined =
      this.all_connections.find((connection: ConnectionGene) =>
        connection.equals(new ConnectionGene(node1, node2))
      );
    if (existingConnectionGene) {
      existingConnectionGene.replaceIndex = index;
    }
  };
  getReplaceIndex = (node1: NodeGene, node2: NodeGene) => {
    const con: ConnectionGene = new ConnectionGene(node1, node2);
    const data: ConnectionGene | undefined = this.all_connections.find(
      (connection: ConnectionGene) => connection.equals(con)
    );
    if (!data) return 0;
    return data.replaceIndex;
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
