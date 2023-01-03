import { createRouter, createWebHistory } from "vue-router";
import LabyrinthView from "@/views/LabyrinthView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: LabyrinthView,
    },
  ],
});

export default router;
