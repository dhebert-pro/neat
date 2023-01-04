import type GameState from "../GameState";

export enum ActionEnum {
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",
  STAY = "STAY",
}

export default interface Action {
  isPossible: (_: GameState) => boolean;
  execute: (_: GameState) => void;
  getType: (_: void) => ActionEnum;
}
