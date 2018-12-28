// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Index from "./Index";
import router from "./router";
import store from "../../store";
import elementUi from "element-ui";
import mouseMenu from "vue-mouse-menu";
import { post, get, upload, patch, put } from "../../assets/js/http";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/init.css"; // 基础改动
// 地址
import VueAreaLinkage from "vue-area-linkage";

// 响应式
import "element-ui/lib/theme-chalk/display.css";
// 过渡效果 缩放 淡入
import "element-ui/lib/theme-chalk/base.css";

import "@/assets/css/transform.css";

Vue.config.productionTip = false;
Vue.use(VueAreaLinkage);
Vue.use(mouseMenu);
Vue.use(elementUi);
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$upload = upload;
Vue.prototype.$ifLogin = () => {
  if (!localStorage.getItem("user")) {
    store.commit("change");
    Vue.prototype.$notify({
      title: "警告",
      message: "请登陆后再作操作",
      type: "warning"
    });
    return false;
  } else return true;
};
Vue.prototype.dateParse = date => {
  return `${date.getFullYear()}-${
    date.getMonth() + 1 < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 9 ? "0" + date.getDate() : date.getDate()} ${
    date.getHours() < 9 ? "0" + date.getHours() : date.getHours()
  }:${date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes()}:${
    date.getSeconds() < 9 ? "0" + date.getSeconds() : date.getSeconds()
  }`;
};
Array.prototype.repeat = function() {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (arr.indexOf(this[i]) == -1) arr.push(this[i]);
  }
  return arr;
};
Array.prototype.repeatDepth = function() {
  var inArray = false;
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    inArray = false;
    for (var j = 0; j < arr.length; j++) {
      if (this[i].id == arr[j].id) inArray = true;
    }
    if (!inArray) arr.push(this[i]);
  }
  return arr;
};
Array.prototype.sum = function() {
  return this.reduce(reducer, 0);
};
var reducer = function add(sumSoFar, item) {
  return sumSoFar + parseInt(item.quantity) * parseFloat(item.price);
};

new Vue({
  el: "#app",
  router,
  store,
  components: { Index },
  template: "<Index/>"
});
