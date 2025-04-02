import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../components/Dashboard.vue";
import Reports from "../components/Reports.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/reports",
      name: "reports",
      component: Reports,
    },
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../components/NotFound.vue"),
    },
  ],
});

export default router;
