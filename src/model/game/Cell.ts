import type Board from "@/model/game/Board";
import GameTokenEnum from "@/model/game/GameTokenEnum";
import DirectionEnum from "@/model/general/DirectionEnum";
import type Position from "@/model/general/Position";
import ArrayUtil from "@/model/util/ArrayUtil";

export default class Cell {
  position: Position;
  board: Board;
  tokens: GameTokenEnum[] = [];
  hasWallNorth: boolean = false;
  hasWallSouth: boolean = false;
  hasWallEast: boolean = false;
  hasWallWest: boolean = false;

  northCell?: Cell;
  southCell?: Cell;
  eastCell?: Cell;
  westCell?: Cell;

  distanceToEnd?: number;

  constructor(position: Position, board: Board, walls?: string) {
    this.position = position;
    this.board = board;
    if (walls) {
      const directionWalls: DirectionEnum[] = walls.split(
        ""
      ) as DirectionEnum[];
      this.createWalls(directionWalls);
    }
  }

  getConnectedNodes = () => {
    const result: Cell[] = [];
    if (!this.hasWallNorth && this.northCell) {
      result.push(this.northCell);
    }
    if (!this.hasWallSouth && this.southCell) {
      result.push(this.southCell);
    }
    if (!this.hasWallEast && this.eastCell) {
      result.push(this.eastCell);
    }
    if (!this.hasWallWest && this.westCell) {
      result.push(this.westCell);
    }
    return result;
  };

  getNbExits = () => {
    return (
      (this.hasWallNorth ? 0 : 1) +
      (this.hasWallSouth ? 0 : 1) +
      (this.hasWallWest ? 0 : 1) +
      (this.hasWallEast ? 0 : 1)
    );
  };

  createWall = (direction: DirectionEnum) => {
    switch (direction) {
      case DirectionEnum.NORTH:
        this.hasWallNorth = true;
        break;
      case DirectionEnum.SOUTH:
        this.hasWallSouth = true;
        break;
      case DirectionEnum.WEST:
        this.hasWallWest = true;
        break;
      case DirectionEnum.EAST:
        this.hasWallEast = true;
        break;
    }
  };

  hasWall = (direction: DirectionEnum) => {
    switch (direction) {
      case DirectionEnum.NORTH:
        return this.hasWallNorth;
      case DirectionEnum.SOUTH:
        return this.hasWallSouth;
      case DirectionEnum.WEST:
        return this.hasWallWest;
      case DirectionEnum.EAST:
        return this.hasWallEast;
    }
  };

  getCell = (direction: DirectionEnum) => {
    switch (direction) {
      case DirectionEnum.NORTH:
        return this.northCell;
      case DirectionEnum.SOUTH:
        return this.southCell;
      case DirectionEnum.WEST:
        return this.westCell;
      case DirectionEnum.EAST:
        return this.eastCell;
    }
  };

  createWalls = (walls: DirectionEnum[]) => {
    walls.forEach((wall) => {
      this.createWall(wall);
    });
  };

  hasToken = (token: GameTokenEnum) => this.tokens.includes(token);

  isEnd = () => this.hasToken(GameTokenEnum.END);

  addToken = (token: GameTokenEnum) => {
    this.tokens.push(token);
  };

  removeToken = (token: GameTokenEnum) => {
    ArrayUtil.remove(this.tokens, token);
  };

  addPlayer = () => {
    if (this.board.player !== undefined) {
      this.board.player.cell = this;
      this.addToken(GameTokenEnum.PLAYER);
    }
  };

  addStart = () => {
    this.board.start = this;
    this.addToken(GameTokenEnum.START);
  };

  addEnd = () => {
    this.board.end = this;
    this.addToken(GameTokenEnum.END);
  };

  addMarker = () => {
    this.addToken(GameTokenEnum.MARKER);
  };

  removePlayer = () => {
    if (this.board.player) {
      this.board.player.cell = undefined;
      this.removeToken(GameTokenEnum.PLAYER);
    }
  };

  removeStart = () => {
    this.board.start = undefined;
    this.removeToken(GameTokenEnum.START);
  };

  removeEnd = () => {
    this.board.end = undefined;
    this.removeToken(GameTokenEnum.END);
  };

  textalize = () => {
    const result: string[] = [];
    result[0] = `8${this.hasWallNorth ? "8" : " "}8`;
    result[1] = `${this.hasWallWest ? "8" : " "}${
      this.tokens.includes(GameTokenEnum.START)
        ? "S"
        : this.tokens.includes(GameTokenEnum.END)
        ? "E"
        : " "
    }${this.hasWallEast ? "8" : " "}`;
    result[2] = `8${this.hasWallSouth ? "8" : " "}8`;
    return result;
  };

  log = () => {
    const logLines: string[] = this.textalize();
    logLines.forEach((logLine) => {
      console.log(logLine);
    });
  };
}
