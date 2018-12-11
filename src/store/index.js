import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    socketAddress: "wss://factoryun.com/wss",
    // socketAddress: "ws://skyliu.cn/ws",
    userBranch: [],
    process: {
      sale: [
        { name: "未完成任务", url: "/Sale" },
        { name: "生产看版", url: "/Sale/product" },
        { name: "客户管理", url: "/Sale/customer" },
        { name: "销售订单", url: "/Sale/order" },
        { name: "报价单", url: "/Sale/offer" },
        { name: "出货申请表", url: "/Sale/shipment" },
        {
          name: "客服申请表",
          url: "/Sale/customerServiceApplication"
        },
        {
          name: "客服报价表",
          url: "/Sale/customerServiceQuotation"
        },
        {
          name: "客服领料申请表",
          url: "/Sale/customerServiceMaterial"
        },
        { name: "应收账单", url: "/Sale/accountsReceivable" },
        { name: "退货单", url: "/Sale/returnOrder" },
        { name: "入库申请单", url: "/Sale/warehouseApplication" },
        { name: "历史出货汇总表", url: "/Sale/historyShipment" },
        { name: "历史汇款汇总表", url: "/Sale/historyRemittance" }
      ]
    },
    ModalShow: false,
    joinModal: false,
    supplierModal: false,
    demandModal: false,
    moveModal: false,
    galleryModal: false,
    payModal: false,
    createdWorkModal: false,
    createdCustomerModal: false,
    dateTimePickModal: false
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
    changeModal(state, name, status) {
      if (status) state[name] = status;
      else state[name] = !state[name];
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    getUserBranch(state, arr) {
      state.userBranch = arr;
    }
  }
});
