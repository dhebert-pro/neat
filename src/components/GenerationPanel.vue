<script setup lang="ts">
const props = defineProps({
  number: {
    type: Number,
    required: true,
  },
  bestScore: {
    type: Number,
    required: true,
  },
  meanScore: {
    type: Number,
    required: true,
  },
  worstScore: {
    type: Number,
    required: true,
  },
  speciesCount: {
    type: Number,
    required: true,
  },
});
</script>
<template>
  <p>Génération {{ props.number }}</p>
  <p>Meilleur score {{ props.bestScore }}</p>
  <p>Score médian {{ props.meanScore }}</p>
  <p>Pire score {{ props.worstScore }}</p>
  <p>Nombre d'espèces {{ props.speciesCount }}</p>
</template>
