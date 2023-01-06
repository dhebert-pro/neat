import getPossibleActions from "@/model/game/action/Action";
import type ActionEnum from "@/model/game/action/ActionEnum";
import type Generation from "@/model/game/neat/Generation";
import type IInput from "@/model/game/neat/IInput";
import calculateInput from "@/model/game/neat/Input";
import type IOutput from "@/model/game/neat/IOutput";
import calculateOutput from "@/model/game/neat/Output";
import Player from "@/model/game/Player";
import GameState from "@/model/game/simulation/GameState";
import type Client from "@/model/neat/Client";
import type INeatAction from "@/model/neat/simulation/INeatAction";
import getActionFromOutput from "@/model/neat/simulation/NeatOutput";

const calculateScore = (gameState: GameState) => {
  if (!gameState.player) {
    throw new Error("Le joueur n'a pas été créé");
  }
  const player: Player = gameState.player;
  if (!player.cell) {
    throw new Error("Le joueur n'est pas dans le labyrinthe");
  }
  if (player.cell.distanceToEnd === undefined) {
    throw new Error("La distance à l'arrivée n'a pas été calculée");
  }
  const remainingActions: number = gameState.remainingActions;
  const distanceToEnd: number = player.getDistanceToEnd();
  let score =
    gameState.generation.maxActions - distanceToEnd + remainingActions;
  if (distanceToEnd === 0) {
    score += 1000;
  }
  return score;
};

const playGame = (gameState: GameState) => {
  if (!gameState.player) {
    throw new Error("Le joueur n'a pas été créé");
  }
  const player: Player = gameState.player;
  while (!gameState.isFinished()) {
    const input: IInput = calculateInput(gameState);
    const output: IOutput = calculateOutput(gameState, input);
    const possibleActions: INeatAction<GameState, ActionEnum>[] =
      getPossibleActions(gameState);
    const action: INeatAction<GameState, ActionEnum> = getActionFromOutput<
      GameState,
      IOutput,
      ActionEnum
    >(output, possibleActions);
    action.execute(gameState);
    gameState.remainingActions--;
  }
  const score = calculateScore(gameState);

  player.client.score = score;
};

const simulateGame = (gameState: GameState) => {
  playGame(gameState);
};

const simulateClient = (client: Client, generation: Generation) => {
  const player = new Player(client);
  const gameState: GameState = new GameState(player, generation);
  generation.gameStates.push(gameState);
  simulateGame(gameState);
};

export default simulateClient;
