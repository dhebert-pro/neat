<script setup lang="ts">
import { Application, Assets, Sprite, type ICanvas, Ticker } from "pixi.js";
import { ref, onMounted, reactive } from "vue";
import Position from "@/model/game/Position";
import Agent from "@/model/neat/Agent";
import Neat from "@/model/neat/Neat";
import type Client from "@/model/neat/Client";

const SPEED = 10;
const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 600;
const TARGET_WIDTH = 50;
const AGENT_WIDTH = 50;
const AGENT_DELAY = 3000;

const neat: Neat = new Neat(15, 2, 10);

const canvas = ref<HTMLElement | null>(null);
let app: Application<ICanvas>;
let agent: Agent;
let agentSprite: Sprite;
let checkpoint1Sprite: Sprite;
let checkpoint2Sprite: Sprite;
let checkpoint3Sprite: Sprite;
let checkpoint4Sprite: Sprite;
let checks = [false, false, false, false];
let currentAgent: Client;
let timestampDebut: number;
let speciesNumber: number = 0;
let meanScore: number = 0;
let bestScore: number = 0;
let worstScore: number = 0;
let generation: number = 1;
let numClient: number = 1;
let indexAgent: number = 0;
let originalXAgent: number = 0;
let originalYAgent: number = 0;
let currentScore: number = Number.MIN_SAFE_INTEGER;

const loadAssets = async () => {
  const characterTexture = await Assets.load("src/assets/character.jpg");
  agentSprite = Sprite.from(characterTexture);
  const checkpointTexture = await Assets.load("src/assets/checkpoint.png");
  checkpoint1Sprite = Sprite.from(checkpointTexture);
  checkpoint2Sprite = Sprite.from(checkpointTexture);
  checkpoint3Sprite = Sprite.from(checkpointTexture);
  checkpoint4Sprite = Sprite.from(checkpointTexture);
};

const moveCurrentAgent = () => {
  checkCollision();
  const win = checks[0] && checks[1] && checks[2] && checks[3];
  const lose =
    agentSprite.y + agentSprite.height < 0 ||
    agentSprite.y > STAGE_HEIGHT ||
    agentSprite.x + agentSprite.width < 0 ||
    agentSprite.x > STAGE_WIDTH;
  const timeDiff = Date.now() - timestampDebut;
  const end = timeDiff > AGENT_DELAY;
  if (!win && !lose && !end) {
    const x = agentSprite.x;
    const y = agentSprite.y;
    const checkpoint1Distance = Math.sqrt(
      Math.pow(agentSprite.x - checkpoint1Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint1Sprite.y, 2)
    );
    const checkpoint1Angle = Math.atan2(
      checkpoint1Sprite.y - agentSprite.y,
      checkpoint1Sprite.x - agentSprite.x
    );
    const checkpoint1Found = checks[0] ? 1 : 0;
    const checkpoint2Distance = Math.sqrt(
      Math.pow(agentSprite.x - checkpoint2Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint2Sprite.y, 2)
    );
    const checkpoint2Angle = Math.atan2(
      checkpoint2Sprite.y - agentSprite.y,
      checkpoint2Sprite.x - agentSprite.x
    );
    const checkpoint2Found = checks[1] ? 1 : 0;
    const checkpoint3Distance = Math.sqrt(
      Math.pow(agentSprite.x - checkpoint3Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint3Sprite.y, 2)
    );
    const checkpoint3Angle = Math.atan2(
      checkpoint3Sprite.y - agentSprite.y,
      checkpoint3Sprite.x - agentSprite.x
    );
    const checkpoint3Found = checks[2] ? 1 : 0;
    const checkpoint4Distance = Math.sqrt(
      Math.pow(agentSprite.x - checkpoint4Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint4Sprite.y, 2)
    );
    const checkpoint4Angle = Math.atan2(
      checkpoint4Sprite.y - agentSprite.y,
      checkpoint4Sprite.x - agentSprite.x
    );
    const checkpoint4Found = checks[3] ? 1 : 0;
    const bias = 1;
    const maxDistance = Math.sqrt(
      Math.pow(STAGE_WIDTH, 2) + Math.pow(STAGE_HEIGHT, 2)
    );
    const result = currentAgent.calculate([
      x / STAGE_WIDTH,
      y / STAGE_HEIGHT,
      checkpoint1Distance / maxDistance,
      (checkpoint1Angle % (2 * Math.PI)) / (2 * Math.PI),
      checkpoint1Found,
      checkpoint2Distance / maxDistance,
      (checkpoint2Angle % (2 * Math.PI)) / (2 * Math.PI),
      checkpoint2Found,
      checkpoint3Distance / maxDistance,
      (checkpoint3Angle % (2 * Math.PI)) / (2 * Math.PI),
      checkpoint3Found,
      checkpoint4Distance / maxDistance,
      (checkpoint4Angle % (2 * Math.PI)) / (2 * Math.PI),
      checkpoint4Found,
      bias,
    ]);
    console.log("Result", result);
    const verticalOffset = result[0] * STAGE_HEIGHT;
    const horizontalOffset = result[1] * STAGE_WIDTH;
    const scale = Math.sqrt(
      Math.pow(verticalOffset, 2) + Math.pow(horizontalOffset, 2)
    );
    const position = new Position(
      agentSprite.x + (horizontalOffset * SPEED) / scale,
      agentSprite.y + (verticalOffset * SPEED) / scale
    );
    moveAgentTo(position);
  }
  if (win || lose || end) {
    currentAgent.score = currentScore;
    indexAgent++;
    currentAgent = neat.clients[indexAgent];
    if (!currentAgent) {
      generation++;
      speciesNumber = neat.species.length;
      neat.clients.sort(
        (client1: Client, client2: Client) => client1.score - client2.score
      );
      bestScore = neat.clients[neat.clients.length - 1].score;
      meanScore = neat.clients[Math.floor(neat.clients.length / 2)].score;
      worstScore = neat.clients[0].score;
      neat.evolve();
      reset();
      currentAgent = neat.clients[0];
      indexAgent = 0;
    }
    numClient = indexAgent + 1;
    newGame();
    moveCurrentAgent();
  }
};

const moveAgent = () => {
  currentAgent = neat.clients[0];
  newGame();
  moveCurrentAgent();
};

const checkCollision = () => {
  if (
    agentSprite.x - checkpoint1Sprite.x <= checkpoint1Sprite.width &&
    checkpoint1Sprite.x - agentSprite.x <= agentSprite.width &&
    agentSprite.y - checkpoint1Sprite.y <= checkpoint1Sprite.height &&
    checkpoint1Sprite.y - agentSprite.y <= agentSprite.height
  ) {
    checks[0] = true;
  }
  if (
    agentSprite.x - checkpoint2Sprite.x <= checkpoint2Sprite.width &&
    checkpoint2Sprite.x - agentSprite.x <= agentSprite.width &&
    agentSprite.y - checkpoint2Sprite.y <= checkpoint2Sprite.height &&
    checkpoint2Sprite.y - agentSprite.y <= agentSprite.height
  ) {
    checks[1] = true;
  }
  if (
    agentSprite.x - checkpoint3Sprite.x <= checkpoint3Sprite.width &&
    checkpoint3Sprite.x - agentSprite.x <= agentSprite.width &&
    agentSprite.y - checkpoint3Sprite.y <= checkpoint3Sprite.height &&
    checkpoint3Sprite.y - agentSprite.y <= agentSprite.height
  ) {
    checks[2] = true;
  }
  if (
    agentSprite.x - checkpoint4Sprite.x <= checkpoint4Sprite.width &&
    checkpoint4Sprite.x - agentSprite.x <= agentSprite.width &&
    agentSprite.y - checkpoint4Sprite.y <= checkpoint4Sprite.height &&
    checkpoint4Sprite.y - agentSprite.y <= agentSprite.height
  ) {
    checks[3] = true;
  }
};

const moveAgentTo = (position: Position) => {
  const ticker = new Ticker();
  ticker.add((delta: number) => {
    const distance = Math.sqrt(
      Math.pow(agentSprite.x - position.x, 2) +
        Math.pow(agentSprite.y - position.y, 2)
    );
    agent.setPosX(
      agentSprite.x + ((position.x - agentSprite.x) * SPEED * delta) / distance
    );
    agent.setPosY(
      agentSprite.y + ((position.y - agentSprite.y) * SPEED * delta) / distance
    );
    if (
      Math.abs(agentSprite.x - position.x) < SPEED &&
      Math.abs(agentSprite.y - position.y) < SPEED
    ) {
      ticker.destroy();
      moveCurrentAgent();
    }
  });
  ticker.start();
};

const displayAgentAt = (
  sprite: Sprite,
  posX: number,
  posY: number,
  width: number
) => {
  const originalWidth: number = sprite.width;
  sprite.width = width;
  sprite.x = posX;
  sprite.y = posY;
  sprite.height = (sprite.height * sprite.width) / originalWidth;
  app.stage.addChild(sprite);
};

const displayAgents = () => {
  displayAgentAt(
    checkpoint1Sprite,
    Math.random() * (STAGE_WIDTH - TARGET_WIDTH),
    Math.random() *
      (STAGE_HEIGHT -
        (checkpoint1Sprite.height / checkpoint1Sprite.width) * TARGET_WIDTH),
    TARGET_WIDTH
  );
  displayAgentAt(
    checkpoint2Sprite,
    Math.random() * (STAGE_WIDTH - TARGET_WIDTH),
    Math.random() *
      (STAGE_HEIGHT -
        (checkpoint2Sprite.height / checkpoint2Sprite.width) * TARGET_WIDTH),
    TARGET_WIDTH
  );
  displayAgentAt(
    checkpoint3Sprite,
    Math.random() * (STAGE_WIDTH - TARGET_WIDTH),
    Math.random() *
      (STAGE_HEIGHT -
        (checkpoint3Sprite.height / checkpoint3Sprite.width) * TARGET_WIDTH),
    TARGET_WIDTH
  );
  displayAgentAt(
    checkpoint4Sprite,
    Math.random() * (STAGE_WIDTH - TARGET_WIDTH),
    Math.random() *
      (STAGE_HEIGHT -
        (checkpoint1Sprite.height / checkpoint1Sprite.width) * TARGET_WIDTH),
    TARGET_WIDTH
  );
  originalXAgent = Math.random() * (STAGE_WIDTH - AGENT_WIDTH);
  originalYAgent =
    Math.random() *
    (STAGE_HEIGHT - (agentSprite.height / agentSprite.width) * AGENT_WIDTH);
  agent = new Agent(agentSprite, new Position(originalXAgent, originalYAgent));
  displayAgentAt(agent.sprite, agent.position.x, agent.position.y, AGENT_WIDTH);
};

const updateScore = () => {
  const checkpoint1Found = checks[0] ? 1 : 0;
  const checkpoint1Distance =
    Math.sqrt(
      Math.pow(agentSprite.x - checkpoint1Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint1Sprite.y, 2)
    ) *
    (1 - checkpoint1Found);
  const checkpoint2Found = checks[1] ? 1 : 0;
  const checkpoint2Distance =
    Math.sqrt(
      Math.pow(agentSprite.x - checkpoint2Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint2Sprite.y, 2)
    ) *
    (1 - checkpoint2Found);
  const checkpoint3Found = checks[2] ? 1 : 0;
  const checkpoint3Distance =
    Math.sqrt(
      Math.pow(agentSprite.x - checkpoint3Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint3Sprite.y, 2)
    ) *
    (1 - checkpoint3Found);
  const checkpoint4Found = checks[3] ? 1 : 0;
  const checkpoint4Distance =
    Math.sqrt(
      Math.pow(agentSprite.x - checkpoint4Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint4Sprite.y, 2)
    ) *
    (1 - checkpoint4Found);
  return -Math.round(
    Math.pow(checkpoint1Distance, 2) +
      Math.pow(checkpoint2Distance, 2) +
      Math.pow(checkpoint3Distance, 2) +
      Math.pow(checkpoint4Distance, 2)
  );
};

const newGame = () => {
  agentSprite.x = originalXAgent;
  agentSprite.y = originalYAgent;
  checks = [false, false, false, false];
  const newScore = updateScore();
  currentScore = Math.max(currentScore, newScore);
  timestampDebut = Date.now();
  console.log("Génération", generation);
  console.log("Individu", numClient);
  console.log("Meilleur score:", bestScore);
  console.log("Score moyen:", meanScore);
  console.log("Pire score:", worstScore);
  console.log("Nombre d'espèces:", speciesNumber);
  console.log("-----------------------");
};

const reset = () => {
  currentScore = Number.MIN_SAFE_INTEGER;
  app.stage.removeChildren();
  app.render();
  displayAgents();
};

const launchAI = () => {
  console.log("Neat avant évolution", neat);
  const input: number[] = [];
  for (let i: number = 0; i < 15; i++) {
    input[i] = Math.random();
  }
  for (let j: number = 0; j < 100; j++) {
    neat.clients.forEach((client: Client) => {
      const score: number = client.calculate(input)[0];
      client.score = score;
    });
    neat.clients.sort(
      (client1: Client, client2: Client) => client1.score - client2.score
    );
    neat.evolve();
    console.log(`Etape ${j}`);
    console.log(`Nombre d'espèces`, neat.species.length);
    console.log("Meilleur individu", neat.clients[neat.clients.length - 1]);
    console.log("Réseau de neurones", neat);
  }
};

onMounted(async () => {
  app = new Application({
    backgroundColor: "#ffffff",
  });
  canvas.value?.appendChild(app.view as HTMLCanvasElement);
  await loadAssets();
  displayAgents();
  indexAgent = 0;
  numClient = 1;
});
</script>

<template>
  <main>
    <div ref="canvas" class="canvas"></div>
    <button @click="moveAgent">C'est parti !</button>
    <button @click="launchAI">Launch AI</button>
    <button @click="reset">Reset</button>
    <h1>Génération {{ generation.generation }}</h1>
    <h2>Individu {{ numClient }}</h2>
    <p>Meilleur score: {{ bestScore }}</p>
    <p>Score moyen: {{ meanScore }}</p>
    <p>Pire score: {{ worstScore }}</p>
    <p>Nombre d'espèces: {{ speciesNumber }}</p>
  </main>
</template>

<style scoped>
.canvas :deep() canvas {
  border: 1px solid #000000;
}
button {
  margin-left: 20px;
}
</style>
