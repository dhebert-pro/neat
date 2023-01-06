import Cell from "@/model/game/Cell";
import Position from "@/model/general/Position";
import type Generation from "@/model/game/neat/Generation";
import type Player from "@/model/game/Player";

export default class Board {
  static BOARD_WIDTH = 9;
  static BOARD_HEIGHT = 9;

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

  placeTokens = (generation: Generation) => {
    this.cells[generation.boardStartPositionY][
      generation.boardStartPositionX
    ].addStart();
    this.cells[generation.boardEndPositionY][
      generation.boardEndPositionX
    ].addEnd();
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
            if (connectedNode.distanceToEnd === undefined) {
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
