import ActionEnum from "@/model/game/action/ActionEnum";
import type GameState from "@/model/game/simulation/GameState";
import type INeatAction from "@/model/neat/simulation/INeatAction";

export default class ActionStay implements INeatAction<GameState, ActionEnum> {
  isPossible = (_: GameState) => {
    return true;
  };

  getType = () => ActionEnum.STAY;

  execute = () => {};
}
