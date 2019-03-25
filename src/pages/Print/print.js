import Vue from "vue";
import Index from "./Index";
import router from "./router";
import store from "@/store";
import elementUi from "element-ui";
import Http from "@/assets/js/http";
import Config from "@/assets/js/config";

Vue.use(Http);
Vue.use(Config);
Vue.use(elementUi);

new Vue({
  el: "#app",
  router,
  store,
  components: {
    Index
  },
  template: "<Index/>"
});
