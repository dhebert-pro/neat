export default interface Action<GameState, ActionEnum> {
  isPossible: (_: GameState) => boolean;
  execute: (_: GameState) => void;
  getType: (_: void) => ActionEnum;
}
