import type Client from "../neat/Client";
import type GameState from "./GameState";
import type Cell from "./Cell";
import DirectionEnum from "./DirectionEnum";
import type Action from "./action/Action";
import ActionMove from "./action/ActionMove";
import ActionMark from "./action/ActionMark";
import ActionStay from "./action/ActionStay";
import GameTokenEnum from "./GameTokenEnum";

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

  getPossibleActions = (gameState: GameState) => {
    const goNorthAction: ActionMove = new ActionMove(DirectionEnum.NORTH);
    const goSouthAction: ActionMove = new ActionMove(DirectionEnum.SOUTH);
    const goEastAction: ActionMove = new ActionMove(DirectionEnum.EAST);
    const goWestAction: ActionMove = new ActionMove(DirectionEnum.WEST);
    const stayAction: ActionStay = new ActionStay();
    const markNorthAction: ActionMark = new ActionMark(DirectionEnum.NORTH);
    const markSouthAction: ActionMark = new ActionMark(DirectionEnum.SOUTH);
    const markEastAction: ActionMark = new ActionMark(DirectionEnum.EAST);
    const markWestAction: ActionMark = new ActionMark(DirectionEnum.WEST);

    const possibleActions: Action[] = [
      goNorthAction,
      goSouthAction,
      goEastAction,
      goWestAction,
      stayAction,
      markNorthAction,
      markSouthAction,
      markEastAction,
      markWestAction,
    ].filter((action: Action) => action.isPossible(gameState));
    return possibleActions;
  };
}
