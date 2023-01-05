<script setup lang="ts">
import { reactive } from "vue";
import GenerationPanel from "@/components/GenerationPanel.vue";
import Neat from "@/model/neat/Neat";
import Generation from "@/model/neat/Generation";
import type Client from "@/model/neat/Client";
import GameState from "@/model/game/base/GameState";
import Player from "@/model/game/Player";
import Board from "@/model/game/Board";
import RandomUtil from "@/model/util/RandomUtil";
import DirectionEnum from "@/model/game/DirectionEnum";
import ActionEnum from "@/model/game/base/ActionEnum";
import type Action from "@/model/neat/simulation/Action";

interface Labyrinth {
  generationNumber: number;
  generations: Generation[];
  bestScore: number;
  meanScore: number;
  worstScore: number;
  speciesCount: number;
  enabled: boolean;
  oneStep: boolean;
}

interface Input {
  wallNorth: number;
  wallSouth: number;
  wallEast: number;
  wallWest: number;
  endNorth: number;
  endSouth: number;
  endEast: number;
  endWest: number;
  markerNorth: number;
  markerSouth: number;
  markerEast: number;
  markerWest: number;
  fromNorth: number;
  fromSouth: number;
  fromEast: number;
  fromWest: number;
  distanceToEnd: number;
  bias: number;
}

interface Output {
  NORTH: number;
  SOUTH: number;
  EAST: number;
  WEST: number;
  STAY: number;
  MARK_NORTH: number;
  MARK_SOUTH: number;
  MARK_EAST: number;
  MARK_WEST: number;
}

let NB_INPUTS: number = 18;
let NB_OUTPUTS: number = 9;
let NB_AGENTS: number = 20;

let neat = new Neat(NB_INPUTS, NB_OUTPUTS, NB_AGENTS);

let data: Labyrinth = reactive({
  generations: [],
  generationNumber: 0,
  bestScore: 0,
  meanScore: 0,
  worstScore: 0,
  speciesCount: 0,
  enabled: false,
  oneStep: false,
});

const calculateInput = (gameState: GameState) => {
  if (!gameState.player) {
    throw new Error("Le joueur n'a pas été créé");
  }
  const player: Player = gameState.player;
  const input: Input = {
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

const calculateOutput = (gameState: GameState, input: Input) => {
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
  const output: Output = {
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

const getActionFromOutput = (
  output: Output,
  possibleActions: Action<GameState, ActionEnum>[]
) => {
  const possibleOutputValues: number[] = possibleActions.map(
    (possibleAction: Action<GameState, ActionEnum>) =>
      output[possibleAction.getType()]
  );
  const betterActionValue = Math.max(...possibleOutputValues);
  const betterActions: Action<GameState, ActionEnum>[] = [];
  possibleActions.forEach((possibleAction: Action<GameState, ActionEnum>) => {
    if (betterActionValue === output[possibleAction.getType()]) {
      betterActions.push(possibleAction);
    }
  });
  const action: Action<GameState, ActionEnum> =
    RandomUtil.getElement(betterActions);

  return action;
};

const getPossibleActions = (gameState: GameState) => {
  if (!gameState.player) {
    throw new Error("Le joueur n'a pas été créé");
  }
  const player: Player = gameState.player;
  return player.getPossibleActions(gameState);
};

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
    gameState.generation.params.MAX_ACTIONS - distanceToEnd + remainingActions;
  if (distanceToEnd === 0) {
    score += 1000;
  }
  return score;
};

const calculateStats = (neat: Neat) => {
  neat.clients.sort(
    (client1: Client, client2: Client) => client1.score - client2.score
  );
  data.bestScore = neat.clients[neat.clients.length - 1].score;
  if (neat.clients.length % 2 === 1) {
    data.meanScore = neat.clients[Math.floor(neat.clients.length / 2)].score;
  } else {
    data.meanScore =
      (neat.clients[Math.floor(neat.clients.length / 2) - 1].score +
        neat.clients[Math.floor(neat.clients.length / 2)].score) /
      2;
  }
  data.worstScore = neat.clients[0].score;
};

const playGame = (gameState: GameState) => {
  if (!gameState.player) {
    throw new Error("Le joueur n'a pas été créé");
  }
  const player: Player = gameState.player;
  while (!gameState.isFinished()) {
    const input: Input = calculateInput(gameState);
    const output: Output = calculateOutput(gameState, input);
    const possibleActions: Action<GameState, ActionEnum>[] =
      getPossibleActions(gameState);
    const action: Action<GameState, ActionEnum> = getActionFromOutput(
      output,
      possibleActions
    );
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

const nextGeneration = () => {
  if (data.enabled) {
    createGeneration(data.generationNumber + 1);
  }
};

const createGeneration = (number: number) => {
  const generation: Generation = new Generation(neat);
  generation.number = number;
  data.generationNumber = number;
  if (data.generationNumber > 100) {
    data.generations.shift();
  }
  data.generations[data.generationNumber] = generation;
  neat.clients.forEach((client: Client) => {
    simulateClient(client, generation);
  });
  calculateStats(neat);
  neat.evolve();
  data.speciesCount = neat.species.length;
  if (!data.oneStep) {
    setTimeout(() => {
      nextGeneration();
    }, 10);
  }
};

const stopSimulation = () => {
  data.enabled = false;
};

const resetSimulation = () => {
  stopSimulation();
  data.generations = [];
  data.generationNumber = 0;
  data.bestScore = 0;
  data.meanScore = 0;
  data.worstScore = 0;
  data.speciesCount = 0;
  neat = new Neat(NB_INPUTS, NB_OUTPUTS, NB_AGENTS);
};

const launchSimulation = () => {
  data.enabled = true;
  data.oneStep = false;
  nextGeneration();
};

const nextStepSimulation = () => {
  data.enabled = true;
  data.oneStep = true;
  nextGeneration();
};
</script>
<template>
  <main class="main">
    <GenerationPanel
      :number="data.generationNumber"
      :bestScore="data.bestScore"
      :meanScore="data.meanScore"
      :worstScore="data.worstScore"
      :speciesCount="data.speciesCount"
    />
  </main>
  <button @click="launchSimulation">Lancer la simulation</button>
  <button @click="nextStepSimulation">Lancer une génération</button>
  <button @click="stopSimulation">Stopper la simulation</button>
  <button @click="resetSimulation">Réinitialiser la simulation</button>
</template>

<style scoped>
main {
  margin: 20px;
}
button {
  margin-left: 20px;
}
</style>
