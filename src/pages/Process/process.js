// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Index from "./Index";
import router from "./router";
import store from "../../store";
import elementUi from "element-ui";
import { post, get, upload, patch, put } from "../../assets/js/http";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/icon/iconfont.css"; // 字体
import "element-ui/lib/theme-chalk/display.css"; // 响应式
import "element-ui/lib/theme-chalk/base.css"; // 过渡效果 缩放 淡入
import "@/assets/css/transform.css"; // 过渡效果 左滑动 右滑动

import "jquery/dist/jquery.min.js";

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-table/dist/bootstrap-table.min.js";
import "bootstrap-table/dist/bootstrap-table.min.css";
import "bootstrap-table/dist/extensions/export/bootstrap-table-export.min.js";
import "bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js";

Vue.config.productionTip = false;
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

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { Index },
  template: "<Index/>"
});
