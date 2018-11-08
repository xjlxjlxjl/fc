// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Home from './Home';
import router from '../../router';
import elementUi from 'element-ui';
import { post, get, patch, put } from '../../assets/js/http';
import 'element-ui/lib/theme-chalk/index.css';

import '@/assets/icon/iconfont.css';
// 响应式
import 'element-ui/lib/theme-chalk/display.css';
// 过渡效果 缩放 淡入
import 'element-ui/lib/theme-chalk/base.css';

import '@/assets/css/transform.css';

Vue.config.productionTip = false;
Vue.use(elementUi);
Vue.prototype.$post = post;
Vue.prototype.$get = get;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { Home },
  template: '<Home/>'
})