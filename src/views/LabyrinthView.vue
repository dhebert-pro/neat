<script setup lang="ts">
import { reactive } from "vue";
import GenerationPanel from "@/components/GenerationPanel.vue";
import Neat from "@/model/neat/Neat";
import Generation from "@/model/neat/Generation";
import type Client from "@/model/neat/Client";
import GameState from "@/model/game/GameState";
import Player from "@/model/game/Player";
import type Action from "@/model/game/action/Action";
import { ActionEnum } from "@/model/game/action/Action";
import RandomUtil from "@/model/util/RandomUtil";

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
  bias: number;
}

interface Output {
  NORTH: number;
  SOUTH: number;
  EAST: number;
  WEST: number;
  STAY: number;
}

let NB_INPUTS: number = 9;
let NB_OUTPUTS: number = 5;
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

const getGeneration = () => {
  return data.generations[data.generationNumber];
};

const calculateInput = (gameState: GameState) => {
  if (!gameState.player) {
    throw new Error("Le joueur n'a pas été créé");
  }
  const player: Player = gameState.player;
  const input: Input = {
    wallNorth: player.canGoNorth() ? 1 : 0,
    wallSouth: player.canGoSouth() ? 1 : 0,
    wallEast: player.canGoEast() ? 1 : 0,
    wallWest: player.canGoWest() ? 1 : 0,
    endNorth: player.canEndNorth() ? 1 : 0,
    endSouth: player.canEndSouth() ? 1 : 0,
    endEast: player.canEndEast() ? 1 : 0,
    endWest: player.canEndWest() ? 1 : 0,
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
    input.bias,
  ]);
  const output: Output = {
    [ActionEnum.NORTH]: result[0],
    [ActionEnum.SOUTH]: result[1],
    [ActionEnum.EAST]: result[2],
    [ActionEnum.WEST]: result[3],
    [ActionEnum.STAY]: result[4],
  };

  return output;
};

const getActionFromOutput = (output: Output, possibleActions: Action[]) => {
  const possibleOutputValues: number[] = possibleActions.map(
    (possibleAction: Action) => output[possibleAction.getType()]
  );
  const betterActionValue = Math.max(...possibleOutputValues);
  const betterActions: Action[] = [];
  possibleActions.forEach((possibleAction: Action) => {
    if (betterActionValue === output[possibleAction.getType()]) {
      betterActions.push(possibleAction);
    }
  });
  const action: Action = RandomUtil.getElement(betterActions);

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
  if (!player.cell.distanceToEnd) {
    throw new Error("La distance à l'arrivée n'a pas été calculée");
  }
  const remainingActions: number = gameState.remainingActions;
  const distanceToEnd: number = player.cell.distanceToEnd;
  const score = 50 - distanceToEnd + remainingActions;
  return score;
};

const calculateStats = () => {
  const neat: Neat = getGeneration().neat;
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
    const possibleActions: Action[] = getPossibleActions(gameState);
    const action: Action = getActionFromOutput(output, possibleActions);
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
  const gameState: GameState = new GameState(player, generation.params);
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
  data.speciesCount = neat.species.length;
  if (data.generationNumber > 100) {
    data.generations.shift();
  }
  data.generations[data.generationNumber] = generation;
  neat.clients.forEach((client: Client) => {
    simulateClient(client, generation);
  });
  calculateStats();
  if (!data.oneStep) {
    neat.evolve();
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
