export default interface INeatAction<GameState, ActionEnum> {
  isPossible: (_: GameState) => boolean;
  execute: (_: GameState) => void;
  getType: (_: void) => ActionEnum;
}
