import DirectionEnum from "../DirectionEnum";
import type GameState from "../GameState";
import type Player from "../Player";
import type Action from "./Action";
import { ActionEnum } from "./Action";

export default class ActionMove implements Action {
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
        return player.canGoNorth();
      case DirectionEnum.SOUTH:
        return player.canGoSouth();
      case DirectionEnum.EAST:
        return player.canGoEast();
      case DirectionEnum.WEST:
        return player.canGoWest();
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
        player.goNorth();
        break;
      case DirectionEnum.SOUTH:
        player.goSouth();
        break;
      case DirectionEnum.EAST:
        player.goEast();
        break;
      case DirectionEnum.WEST:
        player.goWest();
        break;
      default:
    }
  };

  getType = () => {
    switch (this.direction) {
      case DirectionEnum.NORTH:
        return ActionEnum.NORTH;
      case DirectionEnum.SOUTH:
        return ActionEnum.SOUTH;
      case DirectionEnum.EAST:
        return ActionEnum.EAST;
      case DirectionEnum.WEST:
        return ActionEnum.WEST;
      default:
        throw new Error("Type of action is unknown");
    }
  };
}
