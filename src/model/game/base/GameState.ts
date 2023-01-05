import type Generation from "@/model/neat/Generation";
import type { GenerationParams } from "@/model/neat/Generation";
import Board from "../Board";
import type Player from "../Player";
import State from "@/model/neat/simulation/State";
import type IState from "@/model/neat/simulation/IState";

export default class GameState extends State<Player> implements IState {
  board: Board;

  constructor(player: Player, generation: Generation) {
    super(player, generation);
    const params: GenerationParams = generation.params;
    this.board = new Board(params.BOARD_PATTERN);
    this.board.placeTokens(params);
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
