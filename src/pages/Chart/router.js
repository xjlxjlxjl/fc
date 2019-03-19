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
      ],
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/contrast",
      name: "contrast",
      component: contrast,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/inquiry",
      name: "inquiry",
      component: inquiry,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/message",
      name: "message",
      component: message,
      meta: {
        keepAlive: true
      }
    },
    {
      path: "/checkOrder",
      name: "checkOrder",
      component: checkOrder,
      meta: {
        keepAlive: true
      }
    }
  ]
});
