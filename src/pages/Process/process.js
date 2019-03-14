// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
if (
  JSON.parse(localStorage.getItem("user") || "{}") &&
  !JSON.parse(localStorage.getItem("user") || "{}").slug
)
  location.href = "/";

import Vue from "vue";
import Index from "./Index";
import router from "./router";
import store from "@/store";
import elementUi from "element-ui";
import Http from "@/assets/js/http";
import Print from "@/assets/js/print";
import Config from "@/assets/js/config";
import mouseMenu from "vue-mouse-menu";
import preview from "vue-photo-preview";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css"; // 响应式
import "element-ui/lib/theme-chalk/base.css"; // 过渡效果 缩放 淡入
import "@/assets/css/init.css";

Vue.config.productionTip = false;
Vue.use(elementUi);
Vue.use(Http);
Vue.use(Print);
Vue.use(Config);
Vue.use(mouseMenu);
Vue.use(preview);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: {
    Index
  },
  template: "<Index/>"
});
