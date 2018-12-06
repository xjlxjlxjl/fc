import Vue from "vue";
import Router from "vue-router";
// user
import order from "@/pages/User/view/components/order";
import contract from "@/pages/User/view/components/contract";
import contractDetail from "@/pages/User/view/contractDetail";
import account from "@/pages/User/view/components/account";
import addressManage from "@/pages/User/view/components/addressManage";
import authentication from "@/pages/User/view/components/authentication";
import collect from "@/pages/User/view/components/collect";
import security from "@/pages/User/view/components/security";
Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "order",
      component: order,
      children: [
        {
          path: "/order",
          component: order
        }
      ]
    },
    {
      path: "/contract",
      name: "contract",
      component: contract
    },
    {
      path: "/contractDetail/:slug",
      name: "contractDetail",
      component: contractDetail
    },
    {
      path: "/account",
      name: "account",
      component: account
    },
    {
      path: "/addressManage",
      name: "addressManage",
      component: addressManage
    },
    {
      path: "/authentication",
      name: "authentication",
      component: authentication
    },
    {
      path: "/collect",
      name: "collect",
      component: collect
    },
    {
      path: "/security",
      name: "security",
      component: security
    }
  ]
});
