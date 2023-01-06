import Board from "@/model/game/Board";
import type Player from "@/model/game/Player";
import type Neat from "@/model/neat/Neat";
import NeatGeneration from "@/model/neat/simulation/NeatGeneration";
import RandomUtil from "@/model/util/RandomUtil";

export default class Generation extends NeatGeneration<Player> {
  boardPattern: string[][];
  boardStartPositionX: number;
  boardStartPositionY: number;
  boardEndPositionX: number;
  boardEndPositionY: number;

  constructor(neat: Neat) {
    const maxActions = Board.BOARD_WIDTH * Board.BOARD_HEIGHT;
    super(neat, maxActions);
    this.boardPattern = [
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
    const width: number = Board.BOARD_WIDTH;
    const height: number = Board.BOARD_HEIGHT;
    const middleWidth: number = Math.floor((width - 1) / 2);
    const middleHeight: number = Math.floor((height - 1) / 2);
    this.boardStartPositionX = RandomUtil.getInt(0, middleWidth);
    this.boardStartPositionY = RandomUtil.getInt(0, middleHeight);
    this.boardEndPositionX = RandomUtil.getInt(middleWidth + 1, width - 1);
    this.boardEndPositionY = RandomUtil.getInt(middleHeight + 1, height - 1);
  }
}
