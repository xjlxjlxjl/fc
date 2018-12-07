import Vue from "vue";
import Router from "vue-router";

import project from "@/pages/Chart/view/project";
import contrast from "@/pages/Chart/view/contrast";
import inquiry from "@/pages/Chart/view/inquiry";
import message from "@/pages/Chart/view/message";
import checkOrder from "@/pages/Chart/view/checkOrder";
Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "project",
      component: project,
      children: [
        {
          path: "/project",
          component: project
        }
      ]
    },
    {
      path: "/contrast",
      name: "contrast",
      component: contrast
    },
    {
      path: "/inquiry",
      name: "inquiry",
      component: inquiry
    },
    {
      path: "/message",
      name: "message",
      component: message
    },
    {
      path: "/checkOrder",
      name: "checkOrder",
      component: checkOrder
    }
  ]
});
