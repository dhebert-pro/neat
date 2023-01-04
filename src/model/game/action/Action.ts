import type GameState from "../GameState";

export enum ActionEnum {
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",
  STAY = "STAY",
  MARK_NORTH = "MARK_NORTH",
  MARK_SOUTH = "MARK_SOUTH",
  MARK_EAST = "MARK_EAST",
  MARK_WEST = "MARK_WEST",
}

export default interface Action {
  isPossible: (_: GameState) => boolean;
  execute: (_: GameState) => void;
  getType: (_: void) => ActionEnum;
}
