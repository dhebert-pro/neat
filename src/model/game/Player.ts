import type Client from "../neat/Client";
import ActionEnum from "./ActionEnum";
import type Cell from "./Cell";

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

  getPossibleActions = () => {
    const possibleActions: ActionEnum[] = [];
    if (this.canGoNorth()) {
      possibleActions.push(ActionEnum.NORTH);
    }
    if (this.canGoSouth()) {
      possibleActions.push(ActionEnum.SOUTH);
    }
    if (this.canGoEast()) {
      possibleActions.push(ActionEnum.EAST);
    }
    if (this.canGoWest()) {
      possibleActions.push(ActionEnum.WEST);
    }
    possibleActions.push(ActionEnum.STAY);
    return possibleActions;
  };
}
