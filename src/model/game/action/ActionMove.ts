import type Action from "@/model/neat/simulation/Action";
import DirectionEnum from "../DirectionEnum";
import type GameState from "../GameState";
import type Player from "../Player";
import ActionEnum from "./ActionEnum";

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
        player.go(this.direction);
        break;
      case DirectionEnum.SOUTH:
        player.go(this.direction);
        break;
      case DirectionEnum.EAST:
        player.go(this.direction);
        break;
      case DirectionEnum.WEST:
        player.go(this.direction);
        break;
      default:
        throw new Error("No direction for move action");
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
