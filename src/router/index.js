import Vue from 'vue';
import Router from 'vue-router';

// login
import login from '@/pages/Login/view/login';
import sign from '@/pages/Login/view/sign';
// index
import indexMain from '@/pages/Index/view/indexMain';
import product from '@/pages/Index/view/product';
import Presentation from '@/pages/Index/view/Presentation';
// user
import order from '@/pages/User/view/components/order';
import contract from '@/pages/User/view/components/contract';
import account from '@/pages/User/view/components/account';
import addressManage from '@/pages/User/view/components/addressManage';
import authentication from '@/pages/User/view/components/authentication';
import collect from '@/pages/User/view/components/collect';
import security from '@/pages/User/view/components/security';
// chart
import project from '@/pages/Chart/view/project';
import contrast from '@/pages/Chart/view/contrast';
import inquiry from '@/pages/Chart/view/inquiry';
import message from '@/pages/Chart/view/message';
import checkOrder from '@/pages/Chart/view/checkOrder';
Vue.use(Router);

export default new Router({
    mode: 'hash',
    routes: [
      {
        path: '/login',
        name: 'login',
        component: login
      },{
        path: '/sign',
        name: 'sign',
        component: sign
      },{
        path: '/',
        name: 'indexMain',
        component: indexMain
      },{
        path: '/product/:slug/:model/:code',
        name: 'product',
        component: product
      },{
        path: '/Presentation',
        name: 'Presentation',
        component: Presentation
      },{
        path: '/order',
        name: 'order',
        component: order
      },{
        path: '/contract',
        name: 'contract',
        component: contract
      },{
        path: '/account',
        name: 'account',
        component: account
      },{
        path: '/addressManage',
        name: 'addressManage',
        component: addressManage
      },{
        path: '/authentication',
        name: 'authentication',
        component: authentication
      },{
        path: '/collect',
        name: 'collect',
        component: collect
      },{
        path: '/security',
        name: 'security',
        component: security
      },{
        path: '/project',
        name: 'project',
        component: project
      },{
        path: '/contrast',
        name: 'contrast',
        component: contrast
      },{
        path: '/inquiry',
        name: 'inquiry',
        component: inquiry
      },{
        path: '/message',
        name: 'message',
        component: message
      },{
        path: '/checkOrder',
        name: 'checkOrder',
        component: checkOrder
      }
    ]
})