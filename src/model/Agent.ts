import type { Sprite } from "pixi.js";
import type Position from "./Position";

export default class Agent {
  sprite: Sprite;
  position: Position;
  score: number;

  constructor(sprite: Sprite, position: Position) {
    this.sprite = sprite;
    this.position = position;
    this.score = 0;
  }

  setPosX = (posX: number) => {
    this.position.x = posX;
    this.sprite.x = posX;
  };

  setPosY = (posY: number) => {
    this.position.y = posY;
    this.sprite.y = posY;
  };
}
