import Vue from "vue";
import Router from "vue-router";

import Sale from "@/pages/Process/view/sale";
import Engineer from "@/pages/Process/view/engineer";
import Purchase from "@/pages/Process/view/purchase";
import IQC from "@/pages/Process/view/IQC";
import WareHouse from "@/pages/Process/view/wareHouse";
import Produce from "@/pages/Process/view/produce";
import OQC from "@/pages/Process/view/OQC";
import Logistics from "@/pages/Process/view/logistics";
import AfterSale from "@/pages/Process/view/afterSale";
import Finance from "@/pages/Process/view/finance";
import Matters from "@/pages/Process/view/matters";
Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "Sale",
      component: Sale,
      children: [
        {
          path: "/Sale",
          component: Sale
        }
      ]
    },
    {
      path: "/Engineer",
      name: "Engineer",
      component: Engineer
    },
    {
      path: "/Purchase",
      name: "Purchase",
      component: Purchase
    },
    {
      path: "/IQC",
      name: "IQC",
      component: IQC
    },
    {
      path: "/WareHouse",
      name: "WareHouse",
      component: WareHouse
    },
    {
      path: "/Produce",
      name: "Produce",
      component: Produce
    },
    {
      path: "/OQC",
      name: "OQC",
      component: OQC
    },
    {
      path: "/Logistics",
      name: "Logistics",
      component: Logistics
    },
    {
      path: "/AfterSale",
      name: "AfterSale",
      component: AfterSale
    },
    {
      path: "/Finance",
      name: "Finance",
      component: Finance
    },
    {
      path: "/Matters",
      name: "Matters",
      component: Matters
    }
  ]
});
