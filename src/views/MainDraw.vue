<script setup lang="ts">
import { Application, Assets, Sprite } from "pixi.js";
import { ref, onMounted } from "vue";
const canvas = ref<HTMLElement | null>(null);

const loadAssets = async () => {
  const texture = await Assets.load("src/assets/character.jpg");
  const image = Sprite.from(texture);

  return image;
};

onMounted(async () => {
  const app = new Application({
    backgroundColor: "#ffffff",
  });
  canvas.value?.appendChild(app.view as HTMLCanvasElement);
  const image = await loadAssets();
  const originalWidth = image.width;
  image.width = 100;
  image.height = (image.height * image.width) / originalWidth;
  app.stage.addChild(image);
});
</script>

<template>
  <main>
    <div ref="canvas" class="canvas"></div>
  </main>
</template>

<style scoped>
.canvas :deep() canvas {
  border: 1px solid #000000;
}
</style>
