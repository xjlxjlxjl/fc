// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Index from './Index'
import router from '../../router'
import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { post, get, patch, put } from '../../assets/js/http';

import '@/assets/icon/iconfont.css'

Vue.config.productionTip = false
Vue.use(elementUi);
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$patch = patch;
Vue.prototype.$put = put;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { Index },
  template: '<Index/>'
})