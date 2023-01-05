import type Generation from "@/model/neat/Generation";
import type { GenerationParams } from "@/model/neat/Generation";

export default class State<Player> {
  player?: Player;
  remainingActions: number = Number.MAX_SAFE_INTEGER;
  generation: Generation;

  constructor(player: Player, generation: Generation) {
    this.generation = generation;
    this.player = player;
    const params: GenerationParams = generation.params;
    this.remainingActions = params.MAX_ACTIONS;
  }

  hasRemainingMoves = () => this.remainingActions > 0;
}
