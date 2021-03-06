// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Index from "./Index";
import router from "./router";
// import store from '../../store';
import elementUi from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Http from "@/assets/js/http";
import "@/assets/icon/iconfont.css";
import "@/assets/css/init.css";

Vue.config.productionTip = false;
Vue.use(elementUi);
Vue.use(Http);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  // store,
  components: {
    Index
  },
  template: "<Index/>"
});
