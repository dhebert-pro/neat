import type Action from "@/model/neat/simulation/Action";
import type GameState from "../GameState";
import ActionEnum from "./ActionEnum";

export default class ActionStay implements Action<GameState, ActionEnum> {
  isPossible = (_: GameState) => {
    return true;
  };

  getType = () => ActionEnum.STAY;

  execute = () => {};
}
