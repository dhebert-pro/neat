import Board from "@/model/game/Board";
import DirectionEnum from "@/model/general/DirectionEnum";
import type IInput from "@/model/game/neat/IInput";
import type NeatGameState from "@/model/neat/simulation/NeatGameState";
import type Player from "@/model/game/simulation/Player";

export default class Input {
  static calculateInput = (gameState: NeatGameState<Player>) => {
    if (!gameState.player) {
      throw new Error("Le joueur n'a pas été créé");
    }
    const player: Player = gameState.player;
    const input: IInput = {
      wallNorth: player.canGo(DirectionEnum.NORTH) ? 0 : 1,
      wallSouth: player.canGo(DirectionEnum.SOUTH) ? 0 : 1,
      wallEast: player.canGo(DirectionEnum.EAST) ? 0 : 1,
      wallWest: player.canGo(DirectionEnum.WEST) ? 0 : 1,
      endNorth: player.canEnd(DirectionEnum.NORTH) ? 1 : 0,
      endSouth: player.canEnd(DirectionEnum.SOUTH) ? 1 : 0,
      endEast: player.canEnd(DirectionEnum.EAST) ? 1 : 0,
      endWest: player.canEnd(DirectionEnum.WEST) ? 1 : 0,
      markerNorth: player.hasMarker(DirectionEnum.NORTH) ? 1 : 0,
      markerSouth: player.hasMarker(DirectionEnum.SOUTH) ? 1 : 0,
      markerEast: player.hasMarker(DirectionEnum.EAST) ? 1 : 0,
      markerWest: player.hasMarker(DirectionEnum.WEST) ? 1 : 0,
      fromNorth: player.from(DirectionEnum.NORTH) ? 1 : 0,
      fromSouth: player.from(DirectionEnum.SOUTH) ? 1 : 0,
      fromEast: player.from(DirectionEnum.EAST) ? 1 : 0,
      fromWest: player.from(DirectionEnum.WEST) ? 1 : 0,
      distanceToEnd:
        player.getDistanceToEnd() /
        ((Board.BOARD_HEIGHT * Board.BOARD_WIDTH) / 2),
      bias: 1,
    };
    return input;
  };
}
