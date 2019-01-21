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
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css"; // 响应式
import "element-ui/lib/theme-chalk/base.css"; // 过渡效果 缩放 淡入
import "@/assets/css/transform.css"; // 过渡效果 左滑动 右滑动
import "@/assets/css/init.css";

import "jquery/dist/jquery.min.js";
import "tablednd/dist/jquery.tablednd.min.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-table/dist/bootstrap-table.min.css";
import "bootstrap-table/dist/bootstrap-table.min.js";

import "x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css";
import "x-editable/dist/bootstrap3-editable/js/bootstrap-editable.js";
import "bootstrap-table/dist/extensions/editable/bootstrap-table-editable.min.js";
import "bootstrap-table/dist/extensions/export/bootstrap-table-export.min.js";
import "@/assets/js/tableExport.min.js";
import "bootstrap-table/dist/extensions/reorder-rows/bootstrap-table-reorder-rows.min.js";
import "bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js";

Vue.config.productionTip = false;
Vue.use(elementUi);
Vue.use(Http);
Vue.use(Print);
Vue.use(Config);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { Index },
  template: "<Index/>"
});
