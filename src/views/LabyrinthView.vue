<script setup lang="ts">
import { reactive } from "vue";
import GenerationPanel from "@/components/GenerationPanel.vue";
import Generation from "@/model/game/neat/Generation";
import type Client from "@/model/neat/Client";
import type Player from "@/model/game/Player";
import type INeatGenerationIndicateurs from "@/model/neat/simulation/INeatGenerationIndicateurs";
import newNeat from "@/model/game/neat/GameNeat";
import type Neat from "@/model/neat/Neat";
import type Score from "@/model/neat/Score";
import simulateClient from "@/model/game/simulation/Simulation";

const MAX_STORED_GENERATIONS = 100;
const GENERATION_DELAY = 10;

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

const calculateStats = (neat: Neat) => {
  const stats: Score = neat.getStats();
  data.bestScore = stats.bestScore;
  data.meanScore = stats.meanScore;
  data.worstScore = stats.worstScore;
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
  if (data.generationNumber > MAX_STORED_GENERATIONS) {
    data.generations.shift();
  }
  data.generations[data.generationNumber] = generation;
  data.speciesCount = neat.species.length;
  neat.clients.forEach((client: Client) => {
    simulateClient(client, generation);
  });
  calculateStats(neat);
  neat.evolve();
  data.speciesCount = neat.species.length;
  if (!data.oneStep) {
    setTimeout(() => {
      nextGeneration();
    }, GENERATION_DELAY);
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
