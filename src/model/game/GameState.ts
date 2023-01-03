import type { GenerationParams } from "@/model/neat/Generation";
import Board from "./Board";
import type Player from "./Player";

export default class GameState {
  player?: Player;
  board: Board;

  constructor(player: Player, params: GenerationParams) {
    this.board = new Board(params.BOARD_PATTERN);
    this.board.placeTokens(params);
    this.player = player;
    this.board.player = player;
    this.board.placePlayer();
  }
}
