import type Generation from "./Generation";
import Board from "../Board";
import type Player from "../Player";
import State from "@/model/neat/simulation/NeatGameState";
import type IState from "@/model/neat/simulation/INeatState";

export default class GameState extends State<Player> implements IState {
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
