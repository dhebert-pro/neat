import Calculator from "@/model/calculation/Calculator";
import type Genome from "@/model/genome/Genome";
import type Species from "@/model/neat/Species";

export default class Client {
  genome: Genome | undefined;
  score: number = 0;
  species: Species | undefined;
  calculator: Calculator | undefined;

  generateCalculator = () => {
    if (this.genome) {
      this.calculator = new Calculator(this.genome);
    }
  };

  calculate = (inputs: number[]) => {
    if (this.calculator) {
      return this.calculator.calculate(inputs);
    }
    return [];
  };

  distance = (other: Client) => {
    if (this.genome && other.genome) {
      const distance = this.genome.distance(other.genome);
      return distance;
    }
    return 0;
  };

  mutate = () => {
    this.genome?.mutate();
  };
}
