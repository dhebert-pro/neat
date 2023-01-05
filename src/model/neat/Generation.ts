import Board from "../game/Board";
import type GameState from "../game/base/GameState";
import RandomUtil from "../util/RandomUtil";
import type Neat from "./Neat";

export interface GenerationParams {
  BOARD_PATTERN: string[][];
  BOARD_START_POSITION_X: number;
  BOARD_START_POSITION_Y: number;
  BOARD_END_POSITION_X: number;
  BOARD_END_POSITION_Y: number;
  MAX_ACTIONS: number;
}

export default class Generation {
  neat: Neat;
  number: number = 1;
  gameStates: GameState[] = [];
  params: GenerationParams;

  constructor(neat: Neat) {
    this.neat = neat;
    const boardPattern: string[][] = [
      ["NW", "NS", "NE", "NW", "N", "NE", "NW", "N", "NE"],
      ["EW", "NW", "E", "EW", "EW", "WS", "ES", "EW", "EW"],
      ["EW", "EW", "EW", "EW", "W", "NS", "NE", "WS", "E"],
      ["EW", "EW", "WS", "S", "ES", "NW", "ES", "NW", "SE"],
      ["W", "ES", "NW", "NE", "NW", "ES", "NW", "", "NE"],
      ["W", "N", "ES", "EW", "EW", "NW", "E", "EW", "EW"],
      ["EW", "WS", "NE", "W", "S", "S", "ES", "EW", "EW"],
      ["W", "NS", "E", "WS", "N", "N", "NE", "EW", "EW"],
      ["WS", "NS", "S", "NS", "ES", "WS", "S", "S", "ES"],
    ];
    const width: number = boardPattern[0].length;
    const height: number = boardPattern.length - 1;
    const middleWidth: number = Math.floor((width - 1) / 2);
    const middleHeight: number = Math.floor((height - 1) / 2);
    this.params = {
      BOARD_PATTERN: boardPattern,
      BOARD_START_POSITION_X: RandomUtil.getInt(0, middleWidth),
      BOARD_START_POSITION_Y: RandomUtil.getInt(0, middleHeight),
      BOARD_END_POSITION_X: RandomUtil.getInt(middleWidth + 1, width - 1),
      BOARD_END_POSITION_Y: RandomUtil.getInt(middleHeight + 1, height - 1),
      MAX_ACTIONS: Board.BOARD_WIDTH * Board.BOARD_HEIGHT,
    };
  }
}
