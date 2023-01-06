import type NeatGeneration from "@/model/neat/simulation/NeatGeneration";

export default class NeatGameState<Player> {
  player?: Player;
  remainingActions: number = Number.MAX_SAFE_INTEGER;
  generation: NeatGeneration<Player>;

  constructor(player: Player, generation: NeatGeneration<Player>) {
    this.generation = generation;
    this.player = player;
    this.remainingActions = generation.maxActions;
  }

  hasRemainingMoves = () => this.remainingActions > 0;
}
