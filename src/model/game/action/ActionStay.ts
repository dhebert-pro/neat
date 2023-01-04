import type GameState from "../GameState";
import type Action from "./Action";
import { ActionEnum } from "./Action";

export default class ActionStay implements Action {
  isPossible = (_: GameState) => {
    return true;
  };

  getType = () => ActionEnum.STAY;

  execute = () => {};
}
