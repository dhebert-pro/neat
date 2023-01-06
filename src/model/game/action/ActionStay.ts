import type INeatAction from "@/model/neat/simulation/INeatAction";
import type GameState from "../base/GameState";
import ActionEnum from "../base/ActionEnum";

export default class ActionStay implements INeatAction<GameState, ActionEnum> {
  isPossible = (_: GameState) => {
    return true;
  };

  getType = () => ActionEnum.STAY;

  execute = () => {};
}
