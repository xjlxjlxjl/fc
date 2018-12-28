import Vue from "vue";
import Router from "vue-router";

// index
import indexMain from "@/pages/Index/view/indexMain";
import product from "@/pages/Index/view/product";
import company from "@/pages/Index/view/company";
import Presentation from "@/pages/Index/view/Presentation";
Vue.use(Router);

export default new Router({
  mode: "hash",
  routes: [
    {
      path: "/company",
      name: "company",
      component: company
    },
    {
      path: "/product/:slug/:model/:code",
      name: "product",
      component: product
    },
    {
      path: "/report/:modal",
      name: "Presentation",
      component: Presentation
    },
    {
      path: "/",
      name: "indexMain",
      component: indexMain,
      children: [
        {
          path: ":modal",
          name: "DetailMain",
          component: indexMain
        }
      ]
    }
  ]
});
