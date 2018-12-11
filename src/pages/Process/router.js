import Vue from "vue";
import Router from "vue-router";
// 销售
import Sale from "@/pages/Process/view/sale/sale";
import saleTasks from "@/pages/Process/view/sale/tasks";
import customerServiceApplication from "@/pages/Process/view/sale/customerServiceApplication";
// 工程
import Engineer from "@/pages/Process/view/engineer/engineer";
// 采购
import Purchase from "@/pages/Process/view/purchase/purchase";
// IQC
import IQC from "@/pages/Process/view/IQC/IQC";
// 仓库
import WareHouse from "@/pages/Process/view/wareHouse/wareHouse";
// 生产
import Produce from "@/pages/Process/view/produce/produce";
// OQC
import OQC from "@/pages/Process/view/OQC/OQC";
// 物流
import Logistics from "@/pages/Process/view/logistics/logistics";
// 售后
import AfterSale from "@/pages/Process/view/afterSale/afterSale";
// 财务
import Finance from "@/pages/Process/view/finance/finance";
// 人事
import Matters from "@/pages/Process/view/matters/matters";
// 未完成任务
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
          component: saleTasks
        },
        {
          path: "/Sale/customerServiceApplication",
          component: customerServiceApplication
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
