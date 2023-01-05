import type ActionEnum from "@/model/game/action/ActionEnum";
import type GameState from "@/model/game/GameState";

export default interface Action {
  isPossible: (_: GameState) => boolean;
  execute: (_: GameState) => void;
  getType: (_: void) => ActionEnum;
}
