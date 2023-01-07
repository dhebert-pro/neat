import ConnectionGene from "@/model/genome/ConnectionGene";
import Gene from "@/model/genome/Gene";
import type NodeGene from "@/model/genome/NodeGene";
import Neat from "@/model/neat/Neat";

export default class Genome {
  connections: ConnectionGene[] = [];
  nodes: NodeGene[] = [];
  neat: Neat;

  distance = (g2: Genome): number => {
    const g1: Genome = this;
    let highest_innovation_gene1: number = 0;
    if (g1.connections.length !== 0) {
      highest_innovation_gene1 =
        g1.connections[g1.connections.length - 1].innovationNumber;
    }
    let highest_innovation_gene2: number = 0;
    if (g2.connections.length !== 0) {
      highest_innovation_gene2 =
        g2.connections[g2.connections.length - 1].innovationNumber;
    }
    if (highest_innovation_gene1 < highest_innovation_gene2) {
      return g2.distance(g1);
    }

    let index_g1: number = 0;
    let index_g2: number = 0;

    let similars: number = 0;
    let disjoints: number = 0;
    let excess: number = 0;
    let weight_diff: number = 0;

    while (
      index_g1 < g1.connections.length &&
      index_g2 < g2.connections.length
    ) {
      const gene1: ConnectionGene = g1.connections[index_g1];
      const gene2: ConnectionGene = g2.connections[index_g2];

      const in1: number = gene1.innovationNumber;
      const in2: number = gene2.innovationNumber;

      if (in1 === in2) {
        //similar gene
        similars++;
        weight_diff += Math.abs(gene1.weight - gene2.weight);
        index_g1++;
        index_g2++;
      } else if (in1 > in2) {
        //disjoint of g2
        disjoints++;
        index_g2++;
      } else {
        //disjoint of g1
        disjoints++;
        index_g1++;
      }
    }
    weight_diff /= Math.max(1, similars);
    excess = g1.connections.length - index_g1;

    let N: number = Math.max(g1.connections.length, g2.connections.length);
    if (N < 20) {
      N = 1;
    }
    return (
      (this.neat.DISJOINTS_FACTOR * disjoints) / N +
      (this.neat.EXCESS_FACTOR * excess) / N +
      this.neat.SIMILAR_FACTOR * weight_diff
    );
  };

  //genome1 should have the highest score
  static crossOver = (g1: Genome, g2: Genome) => {
    const neat: Neat = g1.neat;
    const genome: Genome = neat.empty_genome();

    let index_g1: number = 0;
    let index_g2: number = 0;

    while (
      index_g1 < g1.connections.length &&
      index_g2 < g2.connections.length
    ) {
      const gene1: ConnectionGene = g1.connections[index_g1];
      const gene2: ConnectionGene = g2.connections[index_g2];

      const in1: number = gene1.innovationNumber;
      const in2: number = gene2.innovationNumber;

      if (in1 === in2) {
        //similar gene
        if (Math.random() < 0.5) {
          Neat.getConnectionFromConnection(gene1).addToList(genome.connections);
        } else {
          Neat.getConnectionFromConnection(gene2).addToList(genome.connections);
        }
        index_g1++;
        index_g2++;
      } else if (in1 > in2) {
        //disjoint of g2
        index_g2++;
      } else {
        //disjoint of g1
        Neat.getConnectionFromConnection(gene1).addToList(genome.connections);
        index_g1++;
      }
    }
    while (index_g1 < g1.connections.length) {
      const gene1: ConnectionGene = g1.connections[index_g1];
      Neat.getConnectionFromConnection(gene1).addToList(genome.connections);
      index_g1++;
    }

    genome.connections.forEach((connection) => {
      connection.from.addToList(genome.nodes);
      connection.to.addToList(genome.nodes);
    });

    return genome;
  };

  mutate = () => {
    if (Math.random() < this.neat.PROBABILITY_MUTATE_LINK) {
      this.mutate_link();
    }
    if (Math.random() < this.neat.PROBABILITY_MUTATE_NODE) {
      this.mutate_node();
    }
    if (Math.random() < this.neat.PROBABILITY_MUTATE_TOGGLE_LINK) {
      this.mutate_link_toggle();
    }
    if (Math.random() < this.neat.PROBABILITY_MUTATE_WEIGHT_RANDOM) {
      this.mutate_weight_random();
    }
    if (Math.random() < this.neat.PROBABILITY_MUTATE_WEIGHT_SHIFT) {
      this.mutate_weight_shift();
    }
  };

  mutate_link = () => {
    for (let i: number = 0; i < 100; i++) {
      const a: NodeGene = Gene.getRandomElement(this.nodes) as NodeGene;
      const b: NodeGene = Gene.getRandomElement(this.nodes) as NodeGene;

      if (a.x === b.x) {
        continue;
      }

      let con: ConnectionGene;

      if (a.x < b.x) {
        con = new ConnectionGene(a, b);
      } else {
        con = new ConnectionGene(b, a);
      }

      if (con.isInList(this.connections)) {
        continue;
      }

      con = this.neat.getConnection(con.from, con.to);
      con.weight = (Math.random() * 2 - 1) * this.neat.WEIGHT_RANDOM_STRENGTH;

      con.addSortedToList(this.connections);
      return;
    }
  };

  mutate_node = () => {
    const con: ConnectionGene = Gene.getRandomElement(
      this.connections
    ) as ConnectionGene;
    if (!con) {
      return;
    }

    const from: NodeGene = con.from;
    const to: NodeGene = con.to;

    const replaceIndex: number = this.neat.getReplaceIndex(from, to);
    let middle: NodeGene;

    if (replaceIndex === 0) {
      middle = this.neat.getNode();
      middle.x = (from.x + to.x) / 2;
      middle.y = (from.y + to.y) / 2 + Math.random() * 0.1 - 0.05;
      this.neat.setReplaceIndex(from, to, middle.innovationNumber);
    } else {
      middle = this.neat.getNodeById(replaceIndex);
    }

    const con1: ConnectionGene = this.neat.getConnection(from, middle);
    const con2: ConnectionGene = this.neat.getConnection(middle, to);

    con1.weight = 1;
    con2.weight = con.weight;
    con2.enabled = con.enabled;

    con.removeFromList(this.connections);
    con1.addToList(this.connections);
    con2.addToList(this.connections);

    middle.addToList(this.nodes);
  };

  mutate_weight_shift = () => {
    const con: ConnectionGene = Gene.getRandomElement(
      this.connections
    ) as ConnectionGene;
    if (con) {
      con.weight =
        con.weight + (Math.random() * 2 - 1) * this.neat.WEIGHT_SHIFT_STRENGTH;
    }
  };

  mutate_weight_random = () => {
    const con: ConnectionGene = Gene.getRandomElement(
      this.connections
    ) as ConnectionGene;
    if (con) {
      con.weight = (Math.random() * 2 - 1) * this.neat.WEIGHT_RANDOM_STRENGTH;
    }
  };

  mutate_link_toggle = () => {
    const con: ConnectionGene = Gene.getRandomElement(
      this.connections
    ) as ConnectionGene;
    if (con) {
      con.enabled = !con.enabled;
    }
  };

  constructor(neat: Neat) {
    this.neat = neat;
  }
}
