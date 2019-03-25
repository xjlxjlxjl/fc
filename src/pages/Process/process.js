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

Vue.config.productionTip = false;
Vue.use(elementUi);
Vue.use(Http);
Vue.use(Print);
Vue.use(Config);
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
