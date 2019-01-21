// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Index from "./Index";
import router from "./router";
import store from "@/store";
import elementUi from "element-ui";
import mouseMenu from "vue-mouse-menu";
import Http from "@/assets/js/http";
import Config from "@/assets/js/config";
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
Vue.use(elementUi);
Vue.use(mouseMenu);
Vue.use(Http);
Vue.use(VueAreaLinkage);
Vue.use(Config);

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

new Vue({
  el: "#app",
  router,
  store,
  components: { Index },
  template: "<Index/>"
});
