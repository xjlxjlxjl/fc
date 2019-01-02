import Vue from "vue";
import Router from "vue-router";
// 销售
import Sale from "@/pages/Process/view/sale/sale";
import saleTasks from "@/pages/Process/view/sale/tasks";
import customerServiceApplication from "@/pages/Process/view/sale/customerServiceApplication";
import customerServiceQuotation from "@/pages/Process/view/sale/customerServiceQuotation";
import customerProduct from "@/pages/Process/view/sale/product";
import customer from "@/pages/Process/view/sale/customer";
import saleOrder from "@/pages/Process/view/sale/order";
import saleOffer from "@/pages/Process/view/sale/offer";
import saleShipment from "@/pages/Process/view/sale/shipment";
import customerServiceMaterial from "@/pages/Process/view/sale/customerServiceMaterial";
// 工程
import Engineer from "@/pages/Process/view/engineer/engineer";
// 采购
import Purchase from "@/pages/Process/view/purchase/purchase";
// IQC
import IQC from "@/pages/Process/view/IQC/IQC";
// 仓库
import WareHouse from "@/pages/Process/view/wareHouse/wareHouse";
import wareTasks from "@/pages/Process/view/wareHouse/tasks";
import wareProduct from "@/pages/Process/view/wareHouse/product";
import wareMaterial from "@/pages/Process/view/wareHouse/material";
import wareOutStock from "@/pages/Process/view/wareHouse/outStock";
import wareShipment from "@/pages/Process/view/wareHouse/shipment";
import warehousing from "@/pages/Process/view/wareHouse/warehousing";
import wareTemporary from "@/pages/Process/view/wareHouse/temporary";
import wareCombination from "@/pages/Process/view/wareHouse/combination";
import wareSplit from "@/pages/Process/view/wareHouse/split";
import wareSparePart from "@/pages/Process/view/wareHouse/spareParts";
// 生产
import Produce from "@/pages/Process/view/produce/produce";
import produceTasks from "@/pages/Process/view/produce/tasks";
import produceProduct from "@/pages/Process/view/produce/product";
import producePicking from "@/pages/Process/view/produce/picking";
import produceMateriel from "@/pages/Process/view/produce/materiel";
import produceStore from "@/pages/Process/view/produce/store";
import produceSummary from "@/pages/Process/view/produce/summary";
import produceTime from "@/pages/Process/view/produce/time";

// OQC
import OQC from "@/pages/Process/view/OQC/OQC";
import OQCTasks from "@/pages/Process/view/OQC/tasks";
import OQCProduct from "@/pages/Process/view/OQC/product";
import OQCInspection from "@/pages/Process/view/OQC/inspection";
import OQCRules from "@/pages/Process/view/OQC/rules";
import OQCTime from "@/pages/Process/view/OQC/time";
import OQCHistory from "@/pages/Process/view/OQC/history";
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
import department from "@/pages/Process/view/matters/department";
import power from "@/pages/Process/view/matters/power";
import overtime from "@/pages/Process/view/matters/overtime";
import leave from "@/pages/Process/view/matters/leave";
import outsite from "@/pages/Process/view/matters/outsite";
import sign from "@/pages/Process/view/matters/sign";
import remember from "@/pages/Process/view/matters/remember";
import mattersBreak from "@/pages/Process/view/matters/mattersBreak";
import entry from "@/pages/Process/view/matters/entry";
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
      // name: "Sale",
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
        },
        {
          path: "/Sale/product",
          component: customerProduct
        },
        {
          path: "/Sale/customer",
          component: customer
        },
        {
          path: "/Sale/order",
          component: saleOrder
        },
        {
          path: "/Sale/offer",
          component: saleOffer
        },
        {
          path: "/Sale/shipment",
          component: saleShipment
        },
        {
          path: "/Sale/customerServiceMaterial",
          component: customerServiceMaterial
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
      component: WareHouse,
      children: [
        {
          path: "/WareHouse",
          component: wareTasks
        },
        {
          path: "/WareHouse/product",
          component: wareProduct
        },
        {
          path: "/WareHouse/material",
          component: wareMaterial
        },
        {
          path: "/WareHouse/outStock",
          component: wareOutStock
        },
        {
          path: "/WareHouse/shipment",
          component: wareShipment
        },
        {
          path: "/WareHouse/warehousing",
          component: warehousing
        },
        {
          path: "/WareHouse/temporary",
          component: wareTemporary
        },
        {
          path: "/WareHouse/combination",
          component: wareCombination
        },
        {
          path: "/WareHouse/split",
          component: wareSplit
        },
        {
          path: "/WareHouse/spareParts",
          component: wareSparePart
        }
      ]
    },
    {
      path: "/Produce",
      name: "Produce",
      component: Produce,
      children: [
        {
          path: "/Produce",
          component: produceTasks
        },
        {
          path: "/Produce/product",
          component: produceProduct
        },
        {
          path: "/Produce/picking",
          component: producePicking
        },
        {
          path: "/Produce/materiel",
          component: produceMateriel
        },
        {
          path: "/Produce/store",
          component: produceStore
        },
        {
          path: "/Produce/summary",
          component: produceSummary
        },
        {
          path: "/Produce/time",
          component: produceTime
        }
      ]
    },
    {
      path: "/OQC",
      name: "OQC",
      component: OQC,
      children: [
        {
          path: "/OQC",
          component: OQCTasks
        },
        {
          path: "/OQC/product",
          component: OQCProduct
        },
        {
          path: "/OQC/inspection",
          component: OQCInspection
        },
        {
          path: "/OQC/rules",
          component: OQCRules
        },
        {
          path: "/OQC/time",
          component: OQCTime
        },
        {
          path: "/OQC/history",
          component: OQCHistory
        }
      ]
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
        }
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
