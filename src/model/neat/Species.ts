import Genome from "../genome/Genome";
import type Client from "./Client";

export default class Species {
  clients: Client[] = [];
  representative: Client;
  score: number = 0;

  constructor(representative: Client) {
    this.representative = representative;
    this.representative.species = this;
    this.clients.push(this.representative);
  }

  addIfClose = (client: Client) => {
    if (!client.genome) {
      return false;
    }
    if (client.distance(this.representative) < client.genome.neat.cp) {
      client.species = this;
      this.clients.push(client);
      return true;
    }
    return false;
  };

  forceAdd = (client: Client) => {
    client.species = this;
    this.clients.push(client);
  };

  goExtinct = () => {
    this.clients.forEach((client: Client) => {
      client.species = undefined;
    });
  };

  evaluateScore = () => {
    let sum: number = 0;
    this.clients.forEach((client: Client) => {
      sum += client.score;
    });
    this.score = sum / this.clients.length;
  };

  reset = () => {
    if (this.clients.length) {
      this.representative =
        this.clients[Math.floor(Math.random() * this.clients.length)];
    }
    this.goExtinct();
    this.clients = [this.representative];
    this.representative.species = this;
    this.score = 0;
  };

  kill = (percentage: number) => {
    this.clients.sort(
      (client1: Client, client2: Client) => client1.score - client2.score
    );

    for (let i: number = 0; i < percentage * this.clients.length; i++) {
      this.clients[0].species = undefined;
      this.clients.shift();
    }
  };

  breed = () => {
    const client1 =
      this.clients[Math.floor(Math.random() * this.clients.length)];
    const client2 =
      this.clients[Math.floor(Math.random() * this.clients.length)];
    if (client1.genome === null || client2.genome === null) {
      throw new Error("Clients has not genome");
    }
    if (client1.score > client2.score) {
      return Genome.crossOver(
        client1.genome as Genome,
        client2.genome as Genome
      );
    }
    return Genome.crossOver(client2.genome as Genome, client1.genome as Genome);
  };

  size = () => this.clients.length;
}
