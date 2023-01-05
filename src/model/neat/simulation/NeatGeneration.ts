import type Neat from "../Neat";
import type NeatGameState from "./NeatGameState";

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
