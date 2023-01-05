import type Action from "@/model/neat/simulation/Action";
import DirectionEnum from "../DirectionEnum";
import type GameState from "../GameState";
import type Player from "../Player";
import ActionEnum from "./ActionEnum";

export default class ActionMark implements Action<GameState, ActionEnum> {
  direction: DirectionEnum;

  constructor(direction: DirectionEnum) {
    this.direction = direction;
  }

  isPossible = (gameState: GameState) => {
    if (!gameState.player) {
      throw new Error("Le joueur n'a pas été créé");
    }
    const player: Player = gameState.player;
    switch (this.direction) {
      case DirectionEnum.NORTH:
        return player.canGo(this.direction);
      case DirectionEnum.SOUTH:
        return player.canGo(this.direction);
      case DirectionEnum.EAST:
        return player.canGo(this.direction);
      case DirectionEnum.WEST:
        return player.canGo(this.direction);
      default:
        return false;
    }
  };

  execute = (gameState: GameState) => {
    if (!gameState.player) {
      throw new Error("Le joueur n'a pas été créé");
    }
    const player: Player = gameState.player;
    switch (this.direction) {
      case DirectionEnum.NORTH:
        player.placeMarker(DirectionEnum.NORTH);
        break;
      case DirectionEnum.SOUTH:
        player.placeMarker(DirectionEnum.SOUTH);
        break;
      case DirectionEnum.EAST:
        player.placeMarker(DirectionEnum.EAST);
        break;
      case DirectionEnum.WEST:
        player.placeMarker(DirectionEnum.WEST);
        break;
      default:
        throw new Error("No direction for mark action");
    }
  };

  getType = () => {
    switch (this.direction) {
      case DirectionEnum.NORTH:
        return ActionEnum.MARK_NORTH;
      case DirectionEnum.SOUTH:
        return ActionEnum.MARK_SOUTH;
      case DirectionEnum.EAST:
        return ActionEnum.MARK_EAST;
      case DirectionEnum.WEST:
        return ActionEnum.MARK_WEST;
      default:
        throw new Error("Type of action is unknown");
    }
  };
}
