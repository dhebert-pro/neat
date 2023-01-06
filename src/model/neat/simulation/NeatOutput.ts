import RandomUtil from "@/model/util/RandomUtil";
import type INeatAction from "@/model/neat/simulation/INeatAction";

const getActionFromOutput = <
  GameState,
  Output extends { [key in ActionEnum]: number },
  ActionEnum extends string
>(
  output: Output,
  possibleActions: INeatAction<GameState, ActionEnum>[]
) => {
  const possibleOutputValues: number[] = possibleActions.map(
    (possibleAction: INeatAction<GameState, ActionEnum>) => {
      const actionType = possibleAction.getType();
      return output[actionType];
    }
  );
  const betterActionValue = Math.max(...possibleOutputValues);
  const betterActions: INeatAction<GameState, ActionEnum>[] = [];
  possibleActions.forEach(
    (possibleAction: INeatAction<GameState, ActionEnum>) => {
      if (betterActionValue === output[possibleAction.getType()]) {
        betterActions.push(possibleAction);
      }
    }
  );
  const action: INeatAction<GameState, ActionEnum> =
    RandomUtil.getElement(betterActions);

  return action;
};

export default getActionFromOutput;
