import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    ModalShow: false,
    joinModal: false,
    supplierModal: false,
    demandModal: false,
    moveModal: false,
    galleryModal: false
  },
  mutations: {
    change(state) {
      state.ModalShow = !state.ModalShow;
    },
    joinModalDispaly(state, status) {
      if (status) state.joinModal = status;
      else state.joinModal = !state.joinModal;
    },
    supplierModalDisplay(state, status) {
      if (status) state.supplierModal = status;
      else state.supplierModal = !state.supplierModal;
    },
    demandModalDisplay(state, status) {
      if (status) state.demandModal = status;
      else state.demandModal = !state.demandModal;
    },
    changeModal(state, name ,status) {
      if (status) state[name] = status;
      else state[name] = !state[name];
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    }
  }
});
