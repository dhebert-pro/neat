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

const canvas = ref<HTMLElement | null>(null);
let app: Application<ICanvas>;
let agent: Agent;
let agentSprite: Sprite;
let checkpoint1Sprite: Sprite;
let checkpoint2Sprite: Sprite;
let checkpoint3Sprite: Sprite;
let checkpoint4Sprite: Sprite;

const loadAssets = async () => {
  const characterTexture = await Assets.load("src/assets/character.jpg");
  agentSprite = Sprite.from(characterTexture);
  const checkpointTexture = await Assets.load("src/assets/checkpoint.png");
  checkpoint1Sprite = Sprite.from(checkpointTexture);
  checkpoint2Sprite = Sprite.from(checkpointTexture);
  checkpoint3Sprite = Sprite.from(checkpointTexture);
  checkpoint4Sprite = Sprite.from(checkpointTexture);
};

const moveAgent = () => {
  const positions = [
    new Position(checkpoint1Sprite.x, checkpoint1Sprite.y),
    new Position(checkpoint2Sprite.x, checkpoint2Sprite.y),
    new Position(checkpoint3Sprite.x, checkpoint3Sprite.y),
    new Position(checkpoint4Sprite.x, checkpoint4Sprite.y),
  ];
  moveAgentTo(positions, 0);
};

const moveAgentTo = (positions: Position[], index: number) => {
  const position: Position = positions[index];
  const ticker = new Ticker();
  ticker.add((delta: number) => {
    const distance = Math.sqrt(
      Math.pow(agent.position.x - position.x, 2) +
        Math.pow(agent.position.y - position.y, 2)
    );
    agent.setPosX(
      agent.position.x +
        ((position.x - agent.position.x) * SPEED * delta) / distance
    );
    agent.setPosY(
      agent.position.y +
        ((position.y - agent.position.y) * SPEED * delta) / distance
    );
    if (
      Math.abs(agent.position.x - position.x) < SPEED &&
      Math.abs(agent.position.y - position.y) < SPEED
    ) {
      ticker.destroy();
      if (index < positions.length - 1) {
        moveAgentTo(positions, index + 1);
      }
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
  const neat: Neat = new Neat(10, 1, 1000);
  console.log("Neat avant évolution", neat);
  const input: number[] = [];
  for (let i: number = 0; i < 10; i++) {
    input[i] = Math.random();
  }
  for (let j: number = 0; j < 1000; j++) {
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
