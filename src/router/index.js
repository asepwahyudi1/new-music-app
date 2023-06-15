import { createRouter, createWebHistory } from "vue-router";
import ListMusic from "../views/ListMusic.vue";

import Player from "../components/mobile/Player.vue";
import Lirics from "../components/mobile/Lirics.vue";

const routes = [
  {
    path: "/",
    name: "ListMusic",
    component: () => ListMusic,
  },
  {
    path: "/lirik",
    name: "Lirik",
    component: Lirics,
  },
  {
    path: "/detail",
    name: "Detail",
    component: Player,
  },
  // {
  //   path: "/musik-list",
  //   name: "musiklist",
  //   component: MusikList,
  // },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
