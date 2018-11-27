import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

// const loginModal = {
//   state:{
//     ModalShow: false,
//   },
//   mutations: {
//     change(state) {
//       state.loginModal = !state.loginModal;
//     }
//   }
// }

// export default new Vuex.Store({
//   modules: {
//     loginModal: loginModal
//   }
// })

export default new Vuex.Store({
  state: {
    userInfo: {},
    ModalShow: false,
  },
  mutations: {
    change(state) {
      state.ModalShow = !state.ModalShow;
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
  }
});
