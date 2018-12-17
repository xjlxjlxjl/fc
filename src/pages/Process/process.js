// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
if (
  JSON.parse(localStorage.getItem("user") || "{}") &&
  !JSON.parse(localStorage.getItem("user") || "{}").slug
)
  location.href = "/";

import Vue from "vue";
import Index from "./Index";
import router from "./router";
import store from "../../store";
import elementUi from "element-ui";
import { post, get, upload, patch, put } from "../../assets/js/http";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css"; // 响应式
import "element-ui/lib/theme-chalk/base.css"; // 过渡效果 缩放 淡入
import "@/assets/css/transform.css"; // 过渡效果 左滑动 右滑动

import "jquery/dist/jquery.min.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-table/dist/bootstrap-table.min.css";
import "bootstrap-table/dist/bootstrap-table.min.js";

import "x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css";
import "x-editable/dist/bootstrap3-editable/js/bootstrap-editable.js";
import "bootstrap-table/dist/extensions/editable/bootstrap-table-editable.min.js";

import "bootstrap-table/dist/extensions/export/bootstrap-table-export.min.js";
import "bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js";

Vue.config.productionTip = false;
Vue.use(elementUi);
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$upload = upload;
Vue.prototype.dateParse = date => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 9 ? "0" + date.getMonth() + 1 : date.getMonth()
  }-${date.getDate() < 9 ? "0" + date.getDate() : date.getDate()} ${
    date.getHours() < 9 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes()}:${
    date.getSeconds() < 9 ? "0" + date.getSeconds() : date.getSeconds()
  }`;
};
Vue.prototype.getTableAttr = ($el, attr) => {
  let arr = [],
    selected = $el.bootstrapTable("getAllSelections");
  selected.forEach(e => {
    arr.push(e[attr]);
  });
  return arr;
};
Vue.prototype.getData = $el => {
  return $el.bootstrapTable("getSelections");
};
Vue.prototype.addTable = ($el, index, data) => {
  $el.bootstrapTable("insertRow", {
    index: index,
    row: data
  });
};
Vue.prototype.delTable = ($el, type, data) => {
  $el.bootstrapTable("remove", {
    field: type,
    values: data
  });
};
Vue.prototype.ediTable = ($el, index, data) => {
  $el.bootstrapTable("updateRow", { index: index, row: data });
};
Vue.prototype.refresh = $el => {
  $el.bootstrapTable("refresh");
};

Array.prototype.sum = function() {
  return this.reduce(reducer, 0);
};
var reducer = function add(sumSoFar, item) {
  return sumSoFar + parseInt(item.number || 0) * parseFloat(item.price || 0);
};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { Index },
  template: "<Index/>"
});
