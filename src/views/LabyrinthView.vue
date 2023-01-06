<script setup lang="ts">
import { reactive } from "vue";
import GenerationPanel from "@/components/GenerationPanel.vue";
import Generation from "@/model/game/base/Generation";
import type Client from "@/model/neat/Client";
import GameState from "@/model/game/base/GameState";
import Player from "@/model/game/Player";
import type ActionEnum from "@/model/game/base/ActionEnum";
import type INeatAction from "@/model/neat/simulation/INeatAction";
import type INeatGenerationIndicateurs from "@/model/neat/simulation/INeatGenerationIndicateurs";
import type IInput from "@/model/game/base/IInput";
import type IOutput from "@/model/game/base/IOutput";
import newNeat from "@/model/game/base/GameNeat";
import type Neat from "@/model/neat/Neat";
import calculateInput from "@/model/game/base/Input";
import calculateOutput from "@/model/game/base/Output";
import getActionFromOutput from "@/model/neat/simulation/NeatOutput";

let neat: Neat = newNeat();

let data: INeatGenerationIndicateurs<Player> = reactive({
  generations: [],
  generationNumber: 0,
  bestScore: 0,
  meanScore: 0,
  worstScore: 0,
  speciesCount: 0,
  enabled: false,
  oneStep: false,
});

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
    gameState.generation.maxActions - distanceToEnd + remainingActions;
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
  neat = newNeat();
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
