import Board from "@/model/game/Board";
import NeatGameState from "@/model/neat/simulation/NeatGameState";
import type Generation from "@/model/game/neat/Generation";
import type INeatState from "@/model/neat/simulation/INeatState";
import type Player from "@/model/game/Player";

export default class GameState
  extends NeatGameState<Player>
  implements INeatState
{
  board: Board;

  constructor(player: Player, generation: Generation) {
    super(player, generation);
    this.board = new Board(generation.boardPattern);
    this.board.placeTokens(generation);
    this.board.calculateFinishDistance();
    this.board.player = player;
    this.board.placePlayer();
  }

  isFinished = () => {
    if (!this.hasRemainingMoves()) {
      return true;
    }
    if (this.player?.cell?.isEnd()) {
      return true;
    }
    return false;
  };
}
