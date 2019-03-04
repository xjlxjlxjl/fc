// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Center from "./Center";
import router from "./router";
import store from "@/store";
import elementUi from "element-ui";
import Http from "@/assets/js/http";
import mouseMenu from "vue-mouse-menu";
import preview from "vue-photo-preview";
import "element-ui/lib/theme-chalk/index.css";
// 地址
import VueAreaLinkage from "vue-area-linkage";
// 响应式
import "element-ui/lib/theme-chalk/display.css";
// 过渡效果 缩放 淡入
import "element-ui/lib/theme-chalk/base.css";

import "@/assets/css/init.css";

Vue.config.productionTip = false;
Vue.use(elementUi);
Vue.use(Http);
Vue.use(VueAreaLinkage);
Vue.use(mouseMenu);
Vue.use(preview);

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
  components: {
    Center
  },
  template: "<Center/>"
});
