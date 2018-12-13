import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    // socketAddress: "wss://factoryun.com/wss",
    socketAddress: "ws://skyliu.cn/ws",
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
      ],
      matters: [
        { name: "员工列表", url: "/Matters" },
        { name: "加班申请记录", url: "/Matters/overtime" },
        { name: "请假记录", url: "/Matters/leave" },
        { name: "出差申请记录", url: "/Matters/outsite" },
        { name: "签到列表", url: "/Matters/sign" },
        { name: "备忘录列表", url: "/Matters/remember" },
        { name: "调休列表", url: "/Matters/break" },
        { name: "用户入职申请审核列表", url: "/Matters/entry" }
      ],
      afterSale: [
        { name: "待完成任务", url: "/AfterSale" },
        { name: "客服申请表", url: "/AfterSale/application" },
        { name: "客服领料申请表", url: "/AfterSale/picking" },
        { name: "历史客服报告", url: "/AfterSale/history" },
        { name: "客服总类分析", url: "/AfterSale/analysis" },
        { name: "不良产品问题归类", url: "/AfterSale/badProblem" },
        { name: "客户好评系统汇总", url: "/AfterSale/praise" },
        { name: "客服部共享文件汇总", url: "/AfterSale/sharedFiles" }
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
    dateTimePickModal: false,
    customerService: false,
    delegateUser: false,
    createdReportModal: false
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
