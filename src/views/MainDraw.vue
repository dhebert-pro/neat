<script setup lang="ts">
import { Application, Assets, Sprite, type ICanvas, Ticker } from "pixi.js";
import { ref, onMounted } from "vue";
import Position from "@/model/game/Position";
import Agent from "@/model/neat/Agent";
import Neat from "@/model/neat/Neat";
import type Client from "@/model/neat/Client";

const SPEED = 10;
const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 600;
const TARGET_WIDTH = 50;
const AGENT_WIDTH = 50;

const neat: Neat = new Neat(9, 1, 1000);

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
  if (win) {
    console.log("Jeu terminé");
  } else if (lose) {
    console.log("Vous avez perdu");
  } else {
    const checkpoint1Distance = Math.sqrt(
      Math.pow(agentSprite.x + checkpoint1Sprite.x, 2) +
        Math.pow(agentSprite.y + checkpoint1Sprite.y, 2)
    );
    const checkpoint1Angle = Math.atan2(
      checkpoint1Sprite.y - agentSprite.y,
      checkpoint1Sprite.x - agentSprite.x
    );
    const checkpoint2Distance = Math.sqrt(
      Math.pow(agentSprite.x + checkpoint2Sprite.x, 2) +
        Math.pow(agentSprite.y + checkpoint2Sprite.y, 2)
    );
    const checkpoint2Angle = Math.atan2(
      checkpoint2Sprite.y - agentSprite.y,
      checkpoint2Sprite.x - agentSprite.x
    );
    const checkpoint3Distance = Math.sqrt(
      Math.pow(agentSprite.x + checkpoint3Sprite.x, 2) +
        Math.pow(agentSprite.y + checkpoint3Sprite.y, 2)
    );
    const checkpoint3Angle = Math.atan2(
      checkpoint3Sprite.y - agentSprite.y,
      checkpoint3Sprite.x - agentSprite.x
    );
    const checkpoint4Distance = Math.sqrt(
      Math.pow(agentSprite.x + checkpoint4Sprite.x, 2) +
        Math.pow(agentSprite.y + checkpoint4Sprite.y, 2)
    );
    const checkpoint4Angle = Math.atan2(
      checkpoint4Sprite.y - agentSprite.y,
      checkpoint4Sprite.x - agentSprite.x
    );
    const bias = 1;
    const result = currentAgent.calculate([
      checkpoint1Distance,
      checkpoint1Angle,
      checkpoint2Distance,
      checkpoint2Angle,
      checkpoint3Distance,
      checkpoint3Angle,
      checkpoint4Distance,
      checkpoint4Angle,
      bias,
    ]);
    console.log("Angle à réaliser", result[0]);
    const angle = result[0];
    const position = new Position(
      agentSprite.x + SPEED * Math.cos(angle),
      agentSprite.y + SPEED * Math.sin(angle)
    );
    console.log("Move to", position, "from", agent.position);
    moveAgentTo(position);
  }
};

const moveAgent = () => {
  //Calculate angle depending on current position and angle
  const bestAgent: Client = neat.clients[neat.clients.length - 1];
  console.log("Move best agent", bestAgent);
  currentAgent = bestAgent;
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
  agent = new Agent(agentSprite, new Position(0, 0));
  displayAgentAt(agent.sprite, 0, 0, AGENT_WIDTH);
};

const reset = () => {
  app.stage.removeChildren();
  app.render();
  displayAgents();
};

const launchAI = () => {
  console.log("Neat avant évolution", neat);
  const input: number[] = [];
  for (let i: number = 0; i < 9; i++) {
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
});
</script>

<template>
  <main>
    <div ref="canvas" class="canvas"></div>
    <button @click="moveAgent">C'est parti !</button>
    <button @click="launchAI">Launch AI</button>
    <button @click="reset">Reset</button>
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
