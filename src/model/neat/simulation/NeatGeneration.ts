import type Neat from "@/model/neat/Neat";
import type NeatGameState from "@/model/neat/simulation/NeatGameState";

export default class NeatGeneration<Player> {
  neat: Neat;
  number: number = 1;
  gameStates: NeatGameState<Player>[] = [];
  maxActions: number;

  constructor(neat: Neat, maxActions: number) {
    this.neat = neat;
    this.maxActions = maxActions;
  }
}
