// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Home from "./Home";
import router from "./router";
import store from "@/store";
import elementUi from "element-ui";
import Http from "@/assets/js/http";
import "element-ui/lib/theme-chalk/index.css";
import "element-ui/lib/theme-chalk/display.css"; // 响应式
import "element-ui/lib/theme-chalk/base.css"; // 过渡效果 缩放 淡入
import "@/assets/css/init.css"; // 基础改动

Vue.config.productionTip = false;
Vue.use(elementUi);
Vue.use(Http);

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
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: {
    Home
  },
  template: "<Home/>"
});
