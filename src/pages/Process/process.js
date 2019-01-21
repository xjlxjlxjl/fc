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
import { post, get, upload } from "@/assets/js/http";
import Print from "@/assets/js/print";
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
Vue.use(Print);
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$upload = upload;
Vue.prototype.dateParse = date => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 9 ? "0" + date.getDate() : date.getDate()} ${
    date.getHours() < 9 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes()}:${
    date.getSeconds() < 9 ? "0" + date.getSeconds() : date.getSeconds()
  }`;
};
Vue.prototype.miniDateParse = date => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 9 ? "0" + date.getDate() : date.getDate()} ${
    date.getHours() < 9 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes()}`;
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
/**
 * type String 'id'
 * data Array [ id, id, id ]
 */
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

String.prototype.removeNumber = function() {
  return this.replace(/\d+[a-zA-Z&\|\\\*^%$#@\-]\d+/g, "");
};

Array.prototype.inArray = function(n) {
  return this.includes(n);
};
Array.prototype.rep = function() {
  return Array.from(new Set(this));
};
Array.prototype.sum = function(num = "number", price = "price") {
  return this.reduce((sumSoFar, item) => {
    return parseFloat(
      sumSoFar +
        parseInt(item[num] || 1) *
          parseFloat(item[price] ? item[price] : item.money ? item.money : 0)
    );
  }, 0);
};
Array.prototype.limit = function(cond, ition) {
  if (cond) return this.filter(n => n > ition);
  else return this.filter(n => n[cond] > ition);
};

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { Index },
  template: "<Index/>"
});
