import Cell from "./Cell";
import Position from "./Position";
import type Player from "./Player";
import type { GenerationParams } from "../neat/Generation";

export default class Board {
  cells: Cell[][] = [];
  width: number = 0;
  height: number = 0;
  start?: Cell;
  end?: Cell;
  player?: Player;

  constructor(...args: any[]) {
    if (args.length === 2) {
      const [width, height]: [number, number] = args as [number, number];
      this.createFromSize(width, height);
    } else {
      const [cells]: [string[][]] = args as [string[][]];
      this.createFromPattern(cells);
    }
    if (this.width <= 1) {
      throw new Error("Width must be greater than 1");
    }
    if (this.height <= 1) {
      throw new Error("Height must be greater than 1");
    }
  }

  createFromSize = (width: number, height: number) => {
    this.width = width;
    this.height = height;
  };

  createFromPattern = (cells: string[][]) => {
    this.height = cells.length;
    this.width = cells[0].length;
    for (let i: number = 0; i < cells.length; i++) {
      const line: string[] = cells[i];
      const cellLine: Cell[] = [];
      for (let j: number = 0; j < line.length; j++) {
        const cellValue: string = line[j];
        const cell: Cell = new Cell(new Position(j, i), this, cellValue);
        if (i > 0) {
          const northCell: Cell = this.cells[i - 1][j];
          cell.northCell = northCell;
          northCell.southCell = cell;
        }
        if (j > 0) {
          const westCell: Cell = cellLine[j - 1];
          cell.westCell = westCell;
          westCell.eastCell = cell;
        }
        cellLine.push(cell);
      }
      this.cells.push(cellLine);
    }
  };

  getMiddleWidth = () => {
    return Math.floor((this.width - 1) / 2);
  };

  getMiddleHeight = () => {
    return Math.floor((this.height - 1) / 2);
  };

  placeTokens = (params: GenerationParams) => {
    const startPositionX: number = params.BOARD_START_POSITION_X;
    const startPositionY: number = params.BOARD_START_POSITION_Y;
    const endPositionX: number = params.BOARD_END_POSITION_X;
    const endPositionY: number = params.BOARD_END_POSITION_Y;
    this.cells[startPositionY][startPositionX].addStart();
    this.cells[endPositionY][endPositionX].addEnd();
  };

  placePlayer = () => {
    this.start?.addPlayer();
  };

  calculateFinishDistance = () => {
    if (this.end) {
      const toCalculateNodes: Cell[] = [this.end];
      this.end.distanceToEnd = 0;
      while (toCalculateNodes.length) {
        const node: Cell | undefined = toCalculateNodes.shift();
        if (node) {
          const connectedNodes: Cell[] = node.getConnectedNodes();
          connectedNodes.forEach((connectedNode: Cell) => {
            if (!connectedNode.distanceToEnd) {
              if (node.distanceToEnd === undefined) {
                throw Error("Plus possible de calculer la distance");
              }
              connectedNode.distanceToEnd = node.distanceToEnd + 1;
              toCalculateNodes.push(connectedNode);
            }
          });
        }
      }
    }
  };

  textalize = () => {
    const result: string[] = [];
    for (let i: number = 0; i < this.height; i++) {
      result.push("", "", "");
      for (let j: number = 0; j < this.width; j++) {
        const cell = this.cells[i][j];
        const cellLines = cell.textalize();
        for (let indexLine: number = 0; indexLine < 3; indexLine++) {
          result[indexLine + 3 * i] = `${result[indexLine + 3 * i]}${
            cellLines[indexLine]
          }`;
        }
      }
    }
    return result;
  };

  log = () => {
    const logLines: string[] = this.textalize();
    logLines.forEach((logLine) => {
      console.log(logLine);
    });
  };
}
