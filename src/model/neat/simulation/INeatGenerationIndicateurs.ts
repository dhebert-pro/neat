import type NeatGeneration from "@/model/neat/simulation/NeatGeneration";

export default interface INeatGenerationIndicateurs<Player> {
  generationNumber: number;
  generations: NeatGeneration<Player>[];
  bestScore: number;
  meanScore: number;
  worstScore: number;
  speciesCount: number;
  enabled: boolean;
  oneStep: boolean;
}
