<script setup lang="ts">
import { Application, Assets, Sprite, type ICanvas, Ticker } from "pixi.js";
import { ref, onMounted } from "vue";
import Position from "@/model/Position";

const SPEED = 10;
const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 600;
const TARGET_WIDTH = 50;
const AGENT_WIDTH = 50;

const canvas = ref<HTMLElement | null>(null);
let app: Application<ICanvas>;
let agent: Sprite;
let checkpoint1: Sprite;
let checkpoint2: Sprite;
let checkpoint3: Sprite;
let checkpoint4: Sprite;

const loadAssets = async () => {
  const characterTexture = await Assets.load("src/assets/character.jpg");
  agent = Sprite.from(characterTexture);
  const checkpointTexture = await Assets.load("src/assets/checkpoint.png");
  checkpoint1 = Sprite.from(checkpointTexture);
  checkpoint2 = Sprite.from(checkpointTexture);
  checkpoint3 = Sprite.from(checkpointTexture);
  checkpoint4 = Sprite.from(checkpointTexture);
};

const moveAgent = () => {
  const positions = [
    new Position(checkpoint1.x, checkpoint1.y),
    new Position(checkpoint2.x, checkpoint2.y),
    new Position(checkpoint3.x, checkpoint3.y),
    new Position(checkpoint4.x, checkpoint4.y),
  ];
  moveAgentTo(positions, 0);
};

const moveAgentTo = (positions: Position[], index: number) => {
  const position: Position = positions[index];
  const ticker = new Ticker();
  ticker.add((delta: number) => {
    const distance = Math.sqrt(
      Math.pow(agent.x - position.x, 2) + Math.pow(agent.y - position.y, 2)
    );
    agent.x = agent.x + ((position.x - agent.x) * SPEED * delta) / distance;
    agent.y = agent.y + ((position.y - agent.y) * SPEED * delta) / distance;
    if (
      Math.abs(agent.x - position.x) < SPEED &&
      Math.abs(agent.y - position.y) < SPEED
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
  const originalWidth = sprite.width;
  sprite.width = width;
  sprite.x = posX;
  sprite.y = posY;
  sprite.height = (sprite.height * sprite.width) / originalWidth;
  app.stage.addChild(sprite);
};

const displayAgents = () => {
  displayAgentAt(
    checkpoint1,
    Math.random() * (STAGE_WIDTH - TARGET_WIDTH),
    Math.random() *
      (STAGE_HEIGHT - (checkpoint1.height / checkpoint1.width) * TARGET_WIDTH),
    TARGET_WIDTH
  );
  displayAgentAt(
    checkpoint2,
    Math.random() * (STAGE_WIDTH - TARGET_WIDTH),
    Math.random() *
      (STAGE_HEIGHT - (checkpoint2.height / checkpoint2.width) * TARGET_WIDTH),
    TARGET_WIDTH
  );
  displayAgentAt(
    checkpoint3,
    Math.random() * (STAGE_WIDTH - TARGET_WIDTH),
    Math.random() *
      (STAGE_HEIGHT - (checkpoint3.height / checkpoint3.width) * TARGET_WIDTH),
    TARGET_WIDTH
  );
  displayAgentAt(
    checkpoint4,
    Math.random() * (STAGE_WIDTH - TARGET_WIDTH),
    Math.random() *
      (STAGE_HEIGHT - (checkpoint1.height / checkpoint1.width) * TARGET_WIDTH),
    TARGET_WIDTH
  );
  displayAgentAt(agent, 0, 0, AGENT_WIDTH);
};

const reset = () => {
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
    <button @click="moveAgent">C'est parti !</button>
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
