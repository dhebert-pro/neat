import ActionEnum from "@/model/game/action/ActionEnum";
import type IInput from "@/model/game/neat/IInput";
import type IOutput from "@/model/game/neat/IOutput";
import type Player from "@/model/game/simulation/Player";
import type NeatGameState from "@/model/neat/simulation/NeatGameState";

export default class Output {
  static calculateOutput = (
    gameState: NeatGameState<Player>,
    input: IInput
  ) => {
    if (!gameState.player) {
      throw new Error("Le joueur n'a pas été créé");
    }
    const player: Player = gameState.player;
    const result: number[] = player.client.calculate([
      input.wallNorth,
      input.wallSouth,
      input.wallEast,
      input.wallWest,
      input.endNorth,
      input.endSouth,
      input.endEast,
      input.endWest,
      input.markerNorth,
      input.markerSouth,
      input.markerEast,
      input.markerWest,
      input.fromNorth,
      input.fromSouth,
      input.fromEast,
      input.fromWest,
      input.distanceToEnd,
      input.bias,
    ]);
    const output: IOutput = {
      [ActionEnum.NORTH]: result[0],
      [ActionEnum.SOUTH]: result[1],
      [ActionEnum.EAST]: result[2],
      [ActionEnum.WEST]: result[3],
      [ActionEnum.STAY]: result[4],
      [ActionEnum.MARK_NORTH]: result[5],
      [ActionEnum.MARK_SOUTH]: result[6],
      [ActionEnum.MARK_EAST]: result[7],
      [ActionEnum.MARK_WEST]: result[8],
    };

    return output;
  };
}
