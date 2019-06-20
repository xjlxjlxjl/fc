import Vue from "vue";
import Router from "vue-router";

// 基础标签
// import tabs from "@/pages/Process/control/tabs";

// 销售
import Sale from "@/pages/Process/control/tabs?v=9";
// 客户地图
import customerMap from '@/pages/Process/view/sale/customerMap';
// 工程
import Engineer from "@/pages/Process/control/tabs?v=4";
// 采购
import Purchase from "@/pages/Process/control/tabs?v=1";
// IQC
import IQC from "@/pages/Process/control/tabs?v=6";
// 仓库
import store from "@/pages/Process/control/tabs?v=3";
// 生产
import Produce from "@/pages/Process/control/tabs?v=7";

// OQC
import OQC from "@/pages/Process/control/tabs?v=8";

// 物流
import Logistics from "@/pages/Process/view/logistics/logistics";
// 售后
import AfterSale from "@/pages/Process/control/tabs?v=5";
// 财务
import Finance from "@/pages/Process/control/tabs?v=2";
// 人事
import Matters from "@/pages/Process/view/matters/matters";
import staff from "@/pages/Process/view/matters/staff";
import department from "@/pages/Process/view/matters/department";
import power from "@/pages/Process/view/matters/power";
import overtime from "@/pages/Process/view/matters/overtime";
import leave from "@/pages/Process/view/matters/leave";
import outsite from "@/pages/Process/view/matters/outsite";
import sign from "@/pages/Process/view/matters/sign";
import remember from "@/pages/Process/view/matters/remember";
import mattersBreak from "@/pages/Process/view/matters/mattersBreak";
import entry from "@/pages/Process/view/matters/entry";
import approval from "@/pages/Process/view/matters/approval";
import approvalType from "@/pages/Process/view/matters/approvalType";
import userGroup from "@/pages/Process/view/matters/userGroup";
// 系统设置
import System from "@/pages/Process/view/system/system";
import basic from "@/pages/Process/view/system/basic";
import sociology from "@/pages/Process/view/system/sociology";
import enterprise from "@/pages/Process/view/system/enterprise";
// 未完成任务
Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      name: "Sale",
      component: Sale
    },
    {
      path: "/Sale",
      name: 'Sale',
      component: Sale
    },
    {
      path: "/customerMap",
      name: 'customerMap',
      component: customerMap
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
      path: "/store",
      name: "store",
      component: store
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
          path: "/Matters/department",
          component: department
        },
        {
          path: "/Matters/power",
          component: power
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
        },
        {
          path: "/Matters/approval",
          component: approval
        },
        {
          path: "/Matters/approvals/type",
          component: approvalType
        },
        {
          path: "/Matters/userGroup",
          component: userGroup
        },
      ]
    },
    {
      path: "/System",
      name: "System",
      component: System,
      children: [
        {
          path: "/System",
          component: basic
        },
        {
          path: "/System/sociology",
          component: sociology
        },
        {
          path: "/System/enterprise",
          component: enterprise
        }
      ]
    }
  ]
});
