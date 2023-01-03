<script setup lang="ts">
import { onMounted, reactive } from "vue";
import GenerationPanel from "@/components/GenerationPanel.vue";
import Neat from "@/model/neat/Neat";
import Generation from "@/model/neat/Generation";
import type Client from "@/model/neat/Client";
import GameState from "@/model/game/GameState";
import Player from "@/model/game/Player";
import ActionEnum from "@/model/game/ActionEnum";
import RandomUtil from "@/model/util/RandomUtil";

interface Labyrinth {
  generationNumber: number;
  generations: Generation[];
  bestScore: number;
  meanScore: number;
  worstScore: number;
  speciesCount: number;
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

let data: Labyrinth = reactive({
  generations: [],
  generationNumber: 1,
  bestScore: 0,
  meanScore: 0,
  worstScore: 0,
  speciesCount: 1,
});

let NB_INPUTS: number = 9;
let NB_OUTPUTS: number = 5;
let NB_AGENTS: number = 20;

const getGeneration = () => {
  return data.generations[data.generationNumber];
};

const changeGeneration = () => {
  createGeneration(++data.generationNumber);
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

const getActionFromOutput = (output: Output, possibleActions: ActionEnum[]) => {
  const possibleOutputValues: number[] = possibleActions.map(
    (possibleAction: ActionEnum) => output[possibleAction]
  );
  const betterActionValue = Math.max(...possibleOutputValues);
  const betterActions: ActionEnum[] = [];
  if (
    betterActionValue === output[ActionEnum.NORTH] &&
    possibleActions.includes(ActionEnum.NORTH)
  ) {
    betterActions.push(ActionEnum.NORTH);
  }
  if (
    betterActionValue === output[ActionEnum.SOUTH] &&
    possibleActions.includes(ActionEnum.SOUTH)
  ) {
    betterActions.push(ActionEnum.SOUTH);
  }
  if (
    betterActionValue === output[ActionEnum.EAST] &&
    possibleActions.includes(ActionEnum.EAST)
  ) {
    betterActions.push(ActionEnum.EAST);
  }
  if (
    betterActionValue === output[ActionEnum.WEST] &&
    possibleActions.includes(ActionEnum.WEST)
  ) {
    betterActions.push(ActionEnum.WEST);
  }
  if (
    betterActionValue === output[ActionEnum.STAY] &&
    possibleActions.includes(ActionEnum.STAY)
  ) {
    betterActions.push(ActionEnum.STAY);
  }
  const action: ActionEnum = RandomUtil.getElement(betterActions);

  return action;
};

const executeAction = (gameState: GameState, action: ActionEnum) => {
  if (!gameState.player) {
    throw new Error("Le joueur n'a pas été créé");
  }
  const player: Player = gameState.player;
  switch (action) {
    case ActionEnum.NORTH:
      player.goNorth();
      break;
    case ActionEnum.SOUTH:
      player.goSouth();
      break;
    case ActionEnum.EAST:
      player.goEast();
      break;
    case ActionEnum.WEST:
      player.goWest();
      break;
    default:
  }
};

const getPossibleActions = (gameState: GameState) => {
  if (!gameState.player) {
    throw new Error("Le joueur n'a pas été créé");
  }
  const player: Player = gameState.player;
  return player.getPossibleActions();
};

const calculateScore = (gameState: GameState) => {
  return 0;
};

const playGame = (gameState: GameState) => {
  if (!gameState.player) {
    throw new Error("Le joueur n'a pas été créé");
  }
  const player: Player = gameState.player;
  const input: Input = calculateInput(gameState);
  const output: Output = calculateOutput(gameState, input);
  const possibleActions: ActionEnum[] = getPossibleActions(gameState);
  const action: ActionEnum = getActionFromOutput(output, possibleActions);
  executeAction(gameState, action);
  const score = calculateScore(gameState);

  player.client.score = score;
};

const simulate = (gameState: GameState) => {
  playGame(gameState);
};

const createGeneration = (number: number) => {
  const neat = new Neat(NB_INPUTS, NB_OUTPUTS, NB_AGENTS);
  const generation: Generation = new Generation(neat);
  generation.number = number;
  data.generations[data.generationNumber] = generation;
  neat.clients.forEach((client: Client) => {
    const player = new Player(client);
    const gameState: GameState = new GameState(player, generation.params);
    generation.gameStates.push(gameState);
    simulate(gameState);
  });
};

onMounted(() => {
  createGeneration(1);
});
</script>
<template>
  <main>
    <GenerationPanel
      :number="getGeneration()?.number"
      :bestScore="data.bestScore"
      :meanScore="data.meanScore"
      :worstScore="data.worstScore"
      :speciesCount="data.speciesCount"
    />
  </main>
  <button @click="changeGeneration">Change génération</button>
</template>

<style scoped></style>
