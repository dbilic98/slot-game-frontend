import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/crazy-pirate",
      name: "crazy-pirate",
      component: () => import("@/views/CrazyPirate.vue"),
    },
    {
      path: "/pace-and-race",
      name: "pace-and-race",
      component: () => import("@/views/PaceAndRace.vue"),
    },
  ],
});

export default router;
