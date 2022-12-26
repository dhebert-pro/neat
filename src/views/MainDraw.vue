<script setup lang="ts">
import { Application, Assets, Sprite, type ICanvas, Ticker } from "pixi.js";
import { ref, onMounted } from "vue";

const SPEED = 10;

const canvas = ref<HTMLElement | null>(null);
let app: Application<ICanvas>;
let agent: Sprite;
let checkpoint1: Sprite;
let checkpoint2: Sprite;
let checkpoint3: Sprite;
let checkpoint4: Sprite;

interface Position {
  x: number;
  y: number;
}

const loadAssets = async () => {
  const characterTexture = await Assets.load("src/assets/character.jpg");
  agent = Sprite.from(characterTexture);
  const checkpointTexture = await Assets.load("src/assets/checkpoint.png");
  checkpoint1 = Sprite.from(checkpointTexture);
  checkpoint2 = Sprite.from(checkpointTexture);
  checkpoint3 = Sprite.from(checkpointTexture);
  checkpoint4 = Sprite.from(checkpointTexture);
};

const moveAgent = (positions: Position[]) => {
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
  displayAgentAt(checkpoint1, Math.random() * 750, Math.random() * 550, 50);
  displayAgentAt(checkpoint2, Math.random() * 750, Math.random() * 550, 50);
  displayAgentAt(checkpoint3, Math.random() * 750, Math.random() * 550, 50);
  displayAgentAt(checkpoint4, Math.random() * 750, Math.random() * 550, 50);
  displayAgentAt(agent, 0, 0, 50);
};

const reset = () => {
  //app.ticker.destroy();
  console.log(app.stage.children);
  app.stage.removeChildren();
  console.log(app.stage.children);
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
    <button
      @click="
        moveAgent([
          {
            x: checkpoint1.x,
            y: checkpoint1.y,
          },
          {
            x: checkpoint2.x,
            y: checkpoint2.y,
          },
          {
            x: checkpoint3.x,
            y: checkpoint3.y,
          },
          {
            x: checkpoint4.x,
            y: checkpoint4.y,
          },
        ])
      "
    >
      C'est parti !
    </button>
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
