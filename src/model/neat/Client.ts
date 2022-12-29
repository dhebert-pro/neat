import Calculator from "../calculation/Calculator";
import type Genome from "../genome/Genome";
import type Species from "./Species";
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
    return null;
  };

  distance = (other: Client) => {
    if (this.genome && other.genome) {
      return this.genome.distance(other.genome);
    }
    return 0;
  };

  mutate = () => {
    this.genome?.mutate();
  };
}
