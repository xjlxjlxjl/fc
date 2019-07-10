import Vue from "vue";
import Router from "vue-router";

import purchaseApply from '@/pages/Print/view/purchaseApply';
import purchasePlan from '@/pages/Print/view/purchasePlan';
import purchaseOrder from '@/pages/Print/view/purchaseOrder';
import purchasEntrust from '@/pages/Print/view/purchasEntrust';
import purchasReceive from '@/pages/Print/view/purchasReceive';
import purchasBarter from '@/pages/Print/view/purchasBarter';
import purchasReturn from '@/pages/Print/view/purchasReturn';
import saleOrder from '@/pages/Print/view/saleOrder';
import IQCtemporary from '@/pages/Print/view/IQCtemporary';
import IQCunhealthy from '@/pages/Print/view/IQCunhealthy';
import IQCstore from '@/pages/Print/view/IQCstore';
import IQCchange from '@/pages/Print/view/IQCchange';
import saleNonstandard from '@/pages/Print/view/saleNonstandard';
import storeSplit from '@/pages/Print/view/storeSplit';
import storeCombination from '@/pages/Print/view/storeCombination';
Vue.use(Router);


export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/purchaseApply/:id",
      name: "purchaseApply",
      component: purchaseApply
    }, {
      path: "/purchasePlan/:id",
      name: "purchasePlan",
      component: purchasePlan
    }, {
      path: "/purchaseOrder/:id",
      name: "purchaseOrder",
      component: purchaseOrder
    }, {
      path: "/purchasEntrust/:id",
      name: "purchasEntrust",
      component: purchasEntrust
    }, {
      path: "/purchasReceive/:id",
      name: "purchasReceive",
      component: purchasReceive
    }, {
      path: "/purchasBarter/:id",
      name: "purchasBarter",
      component: purchasBarter
    }, {
      path: "/purchasReturn/:id",
      name: "purchasReturn",
      component: purchasReturn
    }, {
      path: "/saleOrder/:id",
      name: "saleOrder",
      component: saleOrder
    }, {
      path: "/IQCtemporary/:id",
      name: "IQCtemporary",
      component: IQCtemporary
    }, {
      path: "/IQCunhealthy/:id",
      name: "IQCunhealthy",
      component: IQCunhealthy
    }, {
      path: "/IQCstore/:id",
      name: "IQCstore",
      component: IQCstore
    }, {
      path: "/IQCchange/:id",
      name: "IQCchange",
      component: IQCchange
    }, {
      path: "/saleNonstandard/:id",
      name: "saleNonstandard",
      component: saleNonstandard
    }, {
      path: "/storeSplit/:id",
      name: "storeSplit",
      component: storeSplit
    }, {
      path: "/storeCombination/:id",
      name: "storeCombination",
      component: storeCombination
    }
  ]
})
