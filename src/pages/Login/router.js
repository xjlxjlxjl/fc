import Vue from "vue";
import Router from "vue-router";
// login
import login from "@/pages/Login/view/login";
import sign from "@/pages/Login/view/sign";
Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "login",
      component: login,
      children: [
        {
          path: "/login",
          component: login
        }
      ]
    },
    {
      path: "/sign",
      name: "sign",
      component: sign
    }
  ]
});
