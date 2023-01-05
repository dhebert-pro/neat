import type { GenerationParams } from "@/model/neat/Generation";
import Board from "./Board";
import type Player from "./Player";

export default class GameState {
  player?: Player;
  board: Board;
  remainingActions: number = Number.MAX_SAFE_INTEGER;
  maxActions: number = Number.MAX_SAFE_INTEGER;

  constructor(player: Player, params: GenerationParams) {
    this.board = new Board(params.BOARD_PATTERN);
    this.board.placeTokens(params);
    this.board.calculateFinishDistance();
    this.player = player;
    this.board.player = player;
    this.board.placePlayer();
    this.remainingActions = params.MAX_ACTIONS;
    this.maxActions = params.MAX_ACTIONS;
  }

  isFinished = () => {
    if (this.remainingActions <= 0 || this.player?.cell?.isEnd()) {
      return true;
    }
    return false;
  };
}
