import ActionMark from "@/model/game/action/ActionMark";
import ActionMove from "@/model/game/action/ActionMove";
import ActionStay from "@/model/game/action/ActionStay";
import DirectionEnum from "@/model/general/DirectionEnum";
import type ActionEnum from "@/model/game/action/ActionEnum";
import type GameState from "@/model/game/simulation/GameState";
import type INeatAction from "@/model/neat/simulation/INeatAction";

const getPossibleActions = (gameState: GameState) => {
  const goNorthAction: ActionMove = new ActionMove(DirectionEnum.NORTH);
  const goSouthAction: ActionMove = new ActionMove(DirectionEnum.SOUTH);
  const goEastAction: ActionMove = new ActionMove(DirectionEnum.EAST);
  const goWestAction: ActionMove = new ActionMove(DirectionEnum.WEST);
  const stayAction: ActionStay = new ActionStay();
  const markNorthAction: ActionMark = new ActionMark(DirectionEnum.NORTH);
  const markSouthAction: ActionMark = new ActionMark(DirectionEnum.SOUTH);
  const markEastAction: ActionMark = new ActionMark(DirectionEnum.EAST);
  const markWestAction: ActionMark = new ActionMark(DirectionEnum.WEST);

  const possibleActions: INeatAction<GameState, ActionEnum>[] = [
    goNorthAction,
    goSouthAction,
    goEastAction,
    goWestAction,
    stayAction,
    markNorthAction,
    markSouthAction,
    markEastAction,
    markWestAction,
  ].filter((action: INeatAction<GameState, ActionEnum>) =>
    action.isPossible(gameState)
  );
  return possibleActions;
};

export default getPossibleActions;
