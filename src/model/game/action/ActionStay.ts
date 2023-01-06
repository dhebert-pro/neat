import type INeatAction from "@/model/neat/simulation/INeatAction";
import type GameState from "../simulation/GameState";
import ActionEnum from "./ActionEnum";

export default class ActionStay implements INeatAction<GameState, ActionEnum> {
  isPossible = (_: GameState) => {
    return true;
  };

  getType = () => ActionEnum.STAY;

  execute = () => {};
}
