// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Index from "./Index";
import router from "./router";
import store from "@/store";
import elementUi from "element-ui";
import mouseMenu from "vue-mouse-menu";
import Http from "@/assets/js/http";
import Config from "@/assets/js/config";
import preview from "vue-photo-preview";
// 地址
import VueAreaLinkage from "vue-area-linkage";

Vue.config.productionTip = false;
Vue.use(elementUi);
Vue.use(mouseMenu);
Vue.use(Http);
Vue.use(VueAreaLinkage);
Vue.use(Config);
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
    Index
  },
  template: "<Index/>"
});
