import Vue from "vue";
import Router from "vue-router";
// 销售
import Sale from "@/pages/Process/view/sale/sale";
import saleTasks from "@/pages/Process/view/sale/tasks";
import customerServiceApplication from "@/pages/Process/view/sale/customerServiceApplication";
import customerServiceQuotation from "@/pages/Process/view/sale/customerServiceQuotation";
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
import afterSaleTasks from "@/pages/Process/view/afterSale/tasks";
import application from "@/pages/Process/view/afterSale/application";
import picking from "@/pages/Process/view/afterSale/picking";
import history from "@/pages/Process/view/afterSale/history";
import analysis from "@/pages/Process/view/afterSale/analysis";
import badProblem from "@/pages/Process/view/afterSale/badProblem";
import praise from "@/pages/Process/view/afterSale/praise";
import sharedFiles from "@/pages/Process/view/afterSale/sharedFiles";
// 财务
import Finance from "@/pages/Process/view/finance/finance";
// 人事
import Matters from "@/pages/Process/view/matters/matters";
import staff from "@/pages/Process/view/matters/staff";
import overtime from "@/pages/Process/view/matters/overtime";
import leave from "@/pages/Process/view/matters/leave";
import outsite from "@/pages/Process/view/matters/outsite";
import sign from "@/pages/Process/view/matters/sign";
import remember from "@/pages/Process/view/matters/remember";
import mattersBreak from "@/pages/Process/view/matters/mattersBreak";
import entry from "@/pages/Process/view/matters/entry";
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
          path: "/",
          component: saleTasks
        },
        {
          path: "/Sale",
          component: saleTasks
        },
        {
          path: "/Sale/customerServiceApplication",
          component: customerServiceApplication
        },
        {
          path: "/Sale/customerServiceQuotation",
          component: customerServiceQuotation
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
      component: AfterSale,
      children: [
        {
          path: "/AfterSale",
          component: afterSaleTasks
        },
        {
          path: "/AfterSale/application",
          component: application
        },
        {
          path: "/AfterSale/picking",
          component: picking
        },
        {
          path: "/AfterSale/history",
          component: history
        },
        {
          path: "/AfterSale/analysis",
          component: analysis
        },
        {
          path: "/AfterSale/badProblem",
          component: badProblem
        },
        {
          path: "/AfterSale/praise",
          component: praise
        },
        {
          path: "/AfterSale/sharedFiles",
          component: sharedFiles
        }
      ]
    },
    {
      path: "/Finance",
      name: "Finance",
      component: Finance
    },
    {
      path: "/Matters",
      name: "Matters",
      component: Matters,
      children: [
        {
          path: "/Matters",
          component: staff
        },
        {
          path: "/Matters/overtime",
          component: overtime
        },
        {
          path: "/Matters/leave",
          component: leave
        },
        {
          path: "/Matters/outsite",
          component: outsite
        },
        {
          path: "/Matters/sign",
          component: sign
        },
        {
          path: "/Matters/remember",
          component: remember
        },
        {
          path: "/Matters/break",
          component: mattersBreak
        },
        {
          path: "/Matters/entry",
          component: entry
        }
      ]
    }
  ]
});
