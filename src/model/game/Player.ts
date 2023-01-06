import type Cell from "@/model/game/Cell";
import GameTokenEnum from "@/model/game/GameTokenEnum";
import DirectionEnum from "@/model/general/DirectionEnum";
import type Client from "@/model/neat/Client";

export default class Player {
  cell?: Cell;
  client: Client;
  fromDirection?: DirectionEnum;

  constructor(client: Client) {
    this.client = client;
  }

  getPosition = () => this.cell?.position;

  canGo = (direction: DirectionEnum) => !this.cell?.hasWall(direction);
  canEnd = (direction: DirectionEnum) =>
    this.canGo(direction) && this.cell?.getCell(direction)?.isEnd();

  hasMarker = (direction: DirectionEnum) =>
    this.canGo(direction) &&
    this.cell?.getCell(direction)?.hasToken(GameTokenEnum.MARKER);

  from = (direction: DirectionEnum) => {
    return this.fromDirection === direction;
  };

  go = (direction: DirectionEnum) => {
    if (!this.canGo(direction)) {
      throw new Error(`Player can't go ${direction}`);
    }
    if (!this.cell) {
      throw new Error("Player is not on the maze");
    }
    const destinationCell: Cell | undefined = this.cell.getCell(direction);
    if (!destinationCell) {
      throw new Error("Destination cell not exists");
    }
    switch (direction) {
      case DirectionEnum.NORTH:
        this.fromDirection = DirectionEnum.SOUTH;
        break;
      case DirectionEnum.SOUTH:
        this.fromDirection = DirectionEnum.NORTH;
        break;
      case DirectionEnum.EAST:
        this.fromDirection = DirectionEnum.WEST;
        break;
      case DirectionEnum.WEST:
        this.fromDirection = DirectionEnum.EAST;
        break;
      default:
    }
    this.cell.removePlayer();
    destinationCell.addPlayer();
  };

  placeMarker = (direction: DirectionEnum) => {
    if (!this.canGo(direction)) {
      throw new Error(`Player can't place marker in ${direction} cell`);
    }
    if (!this.cell) {
      throw new Error("Player is not on the maze");
    }
    const destinationCell: Cell | undefined = this.cell.getCell(direction);
    if (!destinationCell) {
      throw new Error("Destination cell not exists");
    }
    destinationCell.addMarker();
  };

  getDistanceToEnd = () => {
    if (!this.cell) {
      throw new Error("Player is not on the maze");
    }
    if (this.cell.distanceToEnd === undefined) {
      throw Error("Distance à l'arrivée non calculée");
    }
    return this.cell.distanceToEnd;
  };
}
