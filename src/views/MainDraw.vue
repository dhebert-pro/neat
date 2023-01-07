<script setup lang="ts">
import { Application, Assets, type ICanvas, Sprite, Ticker } from "pixi.js";
import { onMounted, ref } from "vue";
import Position from "@/model/general/Position";
import Agent from "@/model/neat/Agent";
import type Client from "@/model/neat/Client";
import Neat from "@/model/neat/Neat";

const SPEED = 10;
const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 600;
const TARGET_WIDTH = 50;
const AGENT_WIDTH = 50;
const AGENT_DELAY = 2000;
const NUMBER_AGENT = 1000;

const neat: Neat = new Neat(16, 2, NUMBER_AGENT);

const canvas = ref<HTMLElement | null>(null);
let app: Application<ICanvas>;
let agents: Agent[] = [];
let agentSprites: Sprite[] = [];
let checkpoint1Sprite: Sprite;
let checkpoint2Sprite: Sprite;
let checkpoint3Sprite: Sprite;
let checkpoint4Sprite: Sprite;
let checks: boolean[][] = [];
let timestampDebut: number;
let speciesNumber: number = 0;
let meanScore: number = 0;
let bestScore: number = 0;
let worstScore: number = 0;
let generation: number = 1;
let originalXAgent: number = 0;
let originalYAgent: number = 0;
let currentScores: number[] = [];
let state: string[] = [];

const loadAssets = async () => {
  const characterTexture = await Assets.load("src/assets/character.jpg");
  agentSprites = Array.from({ length: NUMBER_AGENT }, () =>
    Sprite.from(characterTexture)
  );
  const checkpointTexture = await Assets.load("src/assets/checkpoint.png");
  checkpoint1Sprite = Sprite.from(checkpointTexture);
  checkpoint2Sprite = Sprite.from(checkpointTexture);
  checkpoint3Sprite = Sprite.from(checkpointTexture);
  checkpoint4Sprite = Sprite.from(checkpointTexture);
};

const moveCurrentAgent = (indexAgent: number) => {
  const agentChecks = checks[indexAgent];
  const agentSprite = agentSprites[indexAgent];
  const agent = neat.clients[indexAgent];
  const currentAgent = neat.clients[indexAgent];
  checkCollision(indexAgent);
  const win =
    agentChecks[0] && agentChecks[1] && agentChecks[2] && agentChecks[3];
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
    const remainingTime = timeDiff / AGENT_DELAY;
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
      remainingTime,
      bias,
    ]);
    const verticalOffset = (result[0] * 2 - 1) * STAGE_HEIGHT;
    const horizontalOffset = (result[1] * 2 - 1) * STAGE_WIDTH;
    let scale = Math.sqrt(
      Math.pow(verticalOffset, 2) + Math.pow(horizontalOffset, 2)
    );
    if (scale === 0) {
      scale = 1;
    }
    const position = new Position(
      agentSprite.x + (horizontalOffset * SPEED) / scale,
      agentSprite.y + (verticalOffset * SPEED) / scale
    );
    updateScore(indexAgent);
    moveAgentTo(indexAgent, position);
  } else {
    if (win) {
      state[indexAgent] = "win";
    }
    if (lose) {
      state[indexAgent] = "lose";
    }
    if (end) {
      state[indexAgent] = "end";
    }
    updateScore(indexAgent);
    if (lose) {
      currentScores[indexAgent] = Number.MIN_SAFE_INTEGER + timeDiff;
    }
    agent.score = currentScores[indexAgent];
    if (state.filter((element: string) => !!element).length >= NUMBER_AGENT) {
      moveGeneration();
    }
  }
};

const moveGeneration = () => {
  if (generation !== 1) {
    speciesNumber = neat.species.length;
    neat.clients.sort(
      (client1: Client, client2: Client) => client1.score - client2.score
    );
    bestScore = neat.clients[neat.clients.length - 1].score;
    meanScore = neat.clients[Math.floor(neat.clients.length / 2)].score;
    worstScore = neat.clients[0].score;
    neat.evolve();
    reset();
  }
  newGame();
  for (let i: number = 0; i < neat.clients.length; i++) {
    moveCurrentAgent(i);
  }
  generation++;
};

const checkCollision = (indexAgent: number) => {
  const agentSprite: Sprite = agentSprites[indexAgent];
  const agentChecks: boolean[] = checks[indexAgent];
  if (
    agentSprite.x - checkpoint1Sprite.x <= checkpoint1Sprite.width &&
    checkpoint1Sprite.x - agentSprite.x <= agentSprite.width &&
    agentSprite.y - checkpoint1Sprite.y <= checkpoint1Sprite.height &&
    checkpoint1Sprite.y - agentSprite.y <= agentSprite.height
  ) {
    agentChecks[0] = true;
  }
  if (
    agentSprite.x - checkpoint2Sprite.x <= checkpoint2Sprite.width &&
    checkpoint2Sprite.x - agentSprite.x <= agentSprite.width &&
    agentSprite.y - checkpoint2Sprite.y <= checkpoint2Sprite.height &&
    checkpoint2Sprite.y - agentSprite.y <= agentSprite.height
  ) {
    agentChecks[1] = true;
  }
  if (
    agentSprite.x - checkpoint3Sprite.x <= checkpoint3Sprite.width &&
    checkpoint3Sprite.x - agentSprite.x <= agentSprite.width &&
    agentSprite.y - checkpoint3Sprite.y <= checkpoint3Sprite.height &&
    checkpoint3Sprite.y - agentSprite.y <= agentSprite.height
  ) {
    agentChecks[2] = true;
  }
  if (
    agentSprite.x - checkpoint4Sprite.x <= checkpoint4Sprite.width &&
    checkpoint4Sprite.x - agentSprite.x <= agentSprite.width &&
    agentSprite.y - checkpoint4Sprite.y <= checkpoint4Sprite.height &&
    checkpoint4Sprite.y - agentSprite.y <= agentSprite.height
  ) {
    agentChecks[3] = true;
  }
};

const moveAgentTo = (indexAgent: number, position: Position) => {
  const agentSprite = agentSprites[indexAgent];
  const agent = agents[indexAgent];
  const ticker = new Ticker();
  ticker.add(() => {
    let distance = Math.sqrt(
      Math.pow(agentSprite.x - position.x, 2) +
        Math.pow(agentSprite.y - position.y, 2)
    );
    if (distance === 0) {
      distance = 1;
    }
    agent.setPosX(
      agentSprite.x + ((position.x - agentSprite.x) * SPEED) / distance
    );
    agent.setPosY(
      agentSprite.y + ((position.y - agentSprite.y) * SPEED) / distance
    );
    if (
      Math.abs(agentSprite.x - position.x) < SPEED &&
      Math.abs(agentSprite.y - position.y) < SPEED
    ) {
      ticker.destroy();
      moveCurrentAgent(indexAgent);
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
    (STAGE_HEIGHT -
      (agentSprites[0].height / agentSprites[0].width) * AGENT_WIDTH);
  for (let i: number = 0; i < NUMBER_AGENT; i++) {
    const agent = new Agent(
      agentSprites[i],
      new Position(originalXAgent, originalYAgent)
    );
    agents.push(agent);
    displayAgentAt(
      agent.sprite,
      agent.position.x,
      agent.position.y,
      AGENT_WIDTH
    );
  }
};

const updateScore = (indexAgent: number) => {
  const agentChecks = checks[indexAgent];
  const agentSprite = agentSprites[indexAgent];
  const checkpoint1Found = agentChecks[0] ? 1 : 0;
  const checkpoint1Distance =
    Math.sqrt(
      Math.pow(agentSprite.x - checkpoint1Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint1Sprite.y, 2)
    ) *
    (1 - checkpoint1Found);
  const checkpoint2Found = agentChecks[1] ? 1 : 0;
  const checkpoint2Distance =
    Math.sqrt(
      Math.pow(agentSprite.x - checkpoint2Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint2Sprite.y, 2)
    ) *
    (1 - checkpoint2Found);
  const checkpoint3Found = agentChecks[2] ? 1 : 0;
  const checkpoint3Distance =
    Math.sqrt(
      Math.pow(agentSprite.x - checkpoint3Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint3Sprite.y, 2)
    ) *
    (1 - checkpoint3Found);
  const checkpoint4Found = agentChecks[3] ? 1 : 0;
  const checkpoint4Distance =
    Math.sqrt(
      Math.pow(agentSprite.x - checkpoint4Sprite.x, 2) +
        Math.pow(agentSprite.y - checkpoint4Sprite.y, 2)
    ) *
    (1 - checkpoint4Found);
  const score =
    4000 -
    Math.round(
      checkpoint1Distance +
        checkpoint2Distance +
        checkpoint3Distance +
        checkpoint4Distance
    ) +
    4000 *
      (checkpoint1Found +
        checkpoint2Found +
        checkpoint3Found +
        checkpoint4Found);
  if (currentScores[indexAgent]) {
    const currentScore = Math.max(currentScores[indexAgent], score);
    currentScores[indexAgent] = currentScore;
  } else {
    const currentScore = score;
    currentScores[indexAgent] = currentScore;
  }
};

const newGame = () => {
  for (let i: number = 0; i < NUMBER_AGENT; i++) {
    checks[i] = [false, false, false, false];
    agentSprites[i].x = originalXAgent;
    agentSprites[i].y = originalYAgent;
  }

  timestampDebut = Date.now();
  console.log("Génération", generation);
  console.log("Meilleur score:", bestScore);
  console.log("Score moyen:", meanScore);
  console.log("Pire score:", worstScore);
  console.log("Nombre d'espèces:", speciesNumber);
  console.log("-----------------------");
};

const reset = () => {
  currentScores = [];
  state = [];
  app.stage.removeChildren();
  app.render();
  displayAgents();
};

onMounted(async () => {
  app = new Application({
    backgroundColor: "#ffffff",
  });
  canvas.value?.appendChild(app.view as HTMLCanvasElement);
  await loadAssets();
  displayAgents();
});
</script>

<template>
  <main>
    <div ref="canvas" class="canvas"></div>
    <button @click="moveGeneration">C'est parti !</button>
    <button @click="reset">Reset</button>
    <h1>Génération {{ generation }}</h1>
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
