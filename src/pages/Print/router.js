import Vue from "vue";
import Router from "vue-router";

import purchaseApply from '@/pages/Print/view/purchaseApply'
import purchasePlan from '@/pages/Print/view/purchasePlan'
import purchaseOrder from '@/pages/Print/view/purchaseOrder'
import purchasEntrust from '@/pages/Print/view/purchasEntrust'
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
    }
  ]
})
