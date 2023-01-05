import type Generation from "@/model/neat/Generation";

export default class State<Player> {
  player?: Player;
  remainingActions: number = Number.MAX_SAFE_INTEGER;
  generation: Generation;

  constructor(player: Player, generation: Generation) {
    this.generation = generation;
    this.player = player;
    this.remainingActions = generation.getMaxActions();
  }

  hasRemainingMoves = () => this.remainingActions > 0;
}
