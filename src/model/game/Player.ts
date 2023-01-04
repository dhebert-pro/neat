import type Client from "../neat/Client";
import type GameState from "./GameState";
import type Cell from "./Cell";
import DirectionEnum from "./DirectionEnum";
import type Action from "./action/Action";
import ActionMove from "./action/ActionMove";
import ActionStay from "./action/ActionStay";

export default class Player {
  cell?: Cell;
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  getPosition = () => this.cell?.position;

  canGoNorth = () => !this.cell?.hasWallNorth;
  canGoSouth = () => !this.cell?.hasWallSouth;
  canGoEast = () => !this.cell?.hasWallEast;
  canGoWest = () => !this.cell?.hasWallWest;

  canEndNorth = () => this.canGoNorth() && this.cell?.northCell?.isEnd();
  canEndSouth = () => this.canGoSouth() && this.cell?.southCell?.isEnd();
  canEndEast = () => this.canGoEast() && this.cell?.eastCell?.isEnd();
  canEndWest = () => this.canGoWest() && this.cell?.westCell?.isEnd();

  goNorth = () => {
    if (!this.canGoNorth()) {
      throw new Error("Player can't go north");
    }
    if (!this.cell) {
      throw new Error("Player is not on the maze");
    }
    if (!this.cell.northCell) {
      throw new Error("Destination cell not exists");
    }
    const destinationCell: Cell = this.cell?.northCell;
    this.cell.removePlayer();
    destinationCell.addPlayer();
  };

  goSouth = () => {
    if (!this.canGoSouth()) {
      throw new Error("Player can't go south");
    }
    if (!this.cell) {
      throw new Error("Player is not on the maze");
    }
    if (!this.cell.southCell) {
      throw new Error("Destination cell not exists");
    }
    const destinationCell: Cell = this.cell?.southCell;
    this.cell.removePlayer();
    destinationCell.addPlayer();
  };

  goEast = () => {
    if (!this.canGoEast()) {
      throw new Error("Player can't go east");
    }
    if (!this.cell) {
      throw new Error("Player is not on the maze");
    }
    if (!this.cell.eastCell) {
      throw new Error("Destination cell not exists");
    }
    const destinationCell: Cell = this.cell?.eastCell;
    this.cell.removePlayer();
    destinationCell.addPlayer();
  };

  goWest = () => {
    if (!this.canGoWest()) {
      throw new Error("Player can't go west");
    }
    if (!this.cell) {
      throw new Error("Player is not on the maze");
    }
    if (!this.cell.westCell) {
      throw new Error("Destination cell not exists");
    }
    const destinationCell: Cell = this.cell?.westCell;
    this.cell.removePlayer();
    destinationCell.addPlayer();
  };

  getPossibleActions = (gameState: GameState) => {
    const goNorthAction: ActionMove = new ActionMove(DirectionEnum.NORTH);
    const goSouthAction: ActionMove = new ActionMove(DirectionEnum.SOUTH);
    const goEastAction: ActionMove = new ActionMove(DirectionEnum.EAST);
    const goWestAction: ActionMove = new ActionMove(DirectionEnum.WEST);
    const stayAction: ActionStay = new ActionStay();

    const possibleActions: Action[] = [
      goNorthAction,
      goSouthAction,
      goEastAction,
      goWestAction,
      stayAction,
    ].filter((action: Action) => action.isPossible(gameState));
    return possibleActions;
  };
}
