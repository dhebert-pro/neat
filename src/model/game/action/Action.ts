import DirectionEnum from "@/model/general/DirectionEnum";
import type INeatAction from "@/model/neat/simulation/INeatAction";
import type GameState from "../simulation/GameState";
import type ActionEnum from "./ActionEnum";
import ActionMark from "./ActionMark";
import ActionMove from "./ActionMove";
import ActionStay from "./ActionStay";

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
