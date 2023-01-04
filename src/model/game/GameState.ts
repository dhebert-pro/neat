import type { GenerationParams } from "@/model/neat/Generation";
import Board from "./Board";
import type Player from "./Player";

export default class GameState {
  player?: Player;
  board: Board;
  remainingActions: number = 50;

  constructor(player: Player, params: GenerationParams) {
    this.board = new Board(params.BOARD_PATTERN);
    this.board.placeTokens(params);
    this.board.calculateFinishDistance();
    this.player = player;
    this.board.player = player;
    this.board.placePlayer();
  }

  isFinished = () => {
    if (this.remainingActions <= 0 || this.player?.cell?.isEnd()) {
      return true;
    }
    return false;
  };
}
