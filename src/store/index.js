import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    companyDetail: {},
    socketAddress: "wss://factoryun.com/wss",
    // socketAddress: "ws://skyliu.cn/ws",
    msg: {
      interface: [
        {
          alt: "消息",
          id: "chat",
          icon: "font_family icon-liaotian",
          activeIcon: "font_family icon-liaotian_",
          isDefault: true
        },
        {
          alt: "好友",
          id: "mail",
          icon: "font_family icon-haoyou_1",
          activeIcon: "font_family icon-haoyou_",
          isDefault: false
        },
        {
          alt: "群聊",
          id: "group",
          icon: "font_family icon-qunliao1",
          activeIcon: "font_family icon-qunliao",
          isDefault: false
        },
        {
          alt: "用户搜索",
          id: "search",
          icon: "el-input__icon el-icon-search",
          activeIcon: "el-input__icon el-icon-search",
          isDefault: false
        },
        {
          alt: "群搜索",
          id: "search",
          icon: "el-input__icon el-icon-search",
          activeIcon: "el-input__icon el-icon-search",
          isDefault: false
        },
        {
          alt: "同事",
          id: "member",
          icon: "font_family icon-tongshi_1",
          activeIcon: "font_family icon-tongshi_",
          isDefault: false
        },
        {
          alt: "通知",
          id: "notices",
          icon: "font_family icon-tongzhi1",
          activeIcon: "font_family icon-tongzhi",
          isDefault: false
        }
      ],
      popItems: [
        {
          txt: "转发"
        },
        {
          txt: "复制"
        },
        {
          txt: "撤回"
        }
      ]
    },
    companyList: [],
    userBranch: [],
    // 发票类型
    invoiceType: [],
    // 付款类型
    paymenType: [],
    // 请假类型
    leaveType: [],
    // 仓库列表
    WareHouseList: [],
    // 仓库类型
    WareHouseType: [],
    // 材料属性
    materialAttr: [],
    // 材料类型
    materialType: [],
    // 品牌
    brandList: [],
    // 权限
    powerList: [],
    riseProcess: [
      {
        name: "销售",
        url: "/Sale",
        indexUrl: "/process.html#/Sale",
        active: false,
        child: [
          { name: "客户管理", url: "customers" },
          { name: "销售订单", url: "orders" },
          { name: "报价", url: "quotedPrice" }
        ]
      },
      {
        name: "工程",
        url: "/Engineer",
        indexUrl: "/process.html#/Engineer",
        active: false,
        child: [
          { name: "Bom", url: "project" },
          { name: "料品", url: "materials" }
        ]
      },
      {
        name: "采购",
        url: "/Purchase",
        indexUrl: "/process.html#/Purchase",
        active: false,
        child: [
          { name: "采购计划", url: "project" },
          { name: "采购单", url: "project" }
        ]
      },
      {
        name: "IQC",
        url: "/IQC",
        indexUrl: "/process.html#/IQC",
        active: false,
        child: [{ name: "来料检测", url: "project" }]
      },
      {
        name: "仓库",
        url: "/WareHouse",
        indexUrl: "/process.html#/WareHouse",
        active: false,
        child: [
          { name: "料品管理", url: "project" },
          { name: "出库", url: "project" },
          { name: "入库", url: "project" }
        ]
      },
      {
        name: "生产",
        url: "/Produce",
        indexUrl: "/process.html#/Produce",
        active: false,
        child: [
          { name: "生产计划", url: "project" },
          { name: "生产领料", url: "project" },
          { name: "生产送检", url: "project" }
        ]
      },
      {
        name: "OQC",
        url: "/OQC",
        indexUrl: "/process.html#/OQC",
        active: false,
        child: [
          { name: "成品检测", url: "project" },
          { name: "质检报告", url: "project" }
        ]
      },
      {
        name: "物流",
        url: "/Logistics",
        indexUrl: "/process.html#/Logistics",
        active: false,
        child: [{ name: "物流管理", url: "project" }]
      },
      {
        name: "售后",
        url: "/AfterSale",
        indexUrl: "/process.html#/AfterSale",
        active: false,
        child: [
          { name: "售后计划", url: "project" },
          { name: "售后维修", url: "project" }
        ]
      },
      {
        name: "财务",
        url: "/Finance",
        indexUrl: "/process.html#/Finance",
        active: false,
        child: [{ name: "财务", url: "project" }]
      },
      {
        name: "人事",
        url: "/Matters",
        indexUrl: "/process.html#/Matters",
        active: false,
        child: [{ name: "人事", url: "Matters" }]
      }
    ],
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
        { name: "公司部门", url: "/Matters/department" },
        { name: "部门权限", url: "/Matters/power" },
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
      ],
      produce: [
        { name: "待完成任务", url: "/Produce" },
        { name: "生产看板", url: "/Produce/product" },
        { name: "生产领料", url: "/Produce/picking" },
        { name: "生产物料车管理", url: "/Produce/materiel" },
        { name: "生产仓库存", url: "/Produce/store" },
        { name: "不良率原因汇总表", url: "/Produce/summary" },
        { name: "工时表", url: "/Produce/time" }
      ],
      WareHouse: [
        { name: "待完成任务", url: "/WareHouse" },
        { name: "生产看板", url: "/WareHouse/product" },
        { name: "备料需求表", url: "/WareHouse/spareParts" },
        { name: "拆分需求表", url: "/WareHouse/split" },
        { name: "组合需求表", url: "/WareHouse/combination" },
        { name: "来料暂收表", url: "/WareHouse/temporary" },
        { name: "入库申请表", url: "/WareHouse/warehousing" },
        { name: "出货申请表", url: "/WareHouse/shipment" },
        { name: "出库申请表", url: "/WareHouse/outStock" },
        { name: "原材料库存", url: "/WareHouse/material" },
        { name: "物料备货周期表", url: "" },
        { name: "库存金额表", url: "" },
        { name: "最优库存量表", url: "" },
        { name: "差异仓列表", url: "" },
        { name: "展品仓列表", url: "" },
        { name: "库存金额表", url: "" },
        { name: "固定资产仓列表", url: "" },
        { name: "退换货仓列表", url: "" },
        { name: "打包仓列表", url: "" },
        { name: "各仓历史盘点记录", url: "" }
      ],
      OQC: [
        { name: "待完成任务", url: "/OQC" },
        { name: "生产看板", url: "/OQC/product" },
        { name: "生产送检表", url: "/OQC/inspection" },
        { name: "出货检标准规定", url: "/OQC/rules" },
        { name: "工时", url: "/OQC/time" },
        { name: "历史出货报告", url: "/OQC/history" }
      ],
      system: [
        { name: "基本信息", url: "/System" },
        { name: "社会信息", url: "/System/sociology" },
        { name: "企业电子章", url: "/System/enterprise" }
      ]
    },
    tasksItems: {
      BM: { name: "Bom清单", label: "BOM" },
      ON: { name: "通知单", label: "notice" },
      OP: { name: "任务列表", label: "tasks" },
      OAP: { name: "公告单", label: "bulletin" },
      FJ: { name: "应付结账单", label: "reckoning" },
      FP: { name: "付款单", label: "payment" },
      RF: { name: "预付款单", label: "advance" },
      PI: { name: "采购入库单", label: "beLaidUp" },
      PT: { name: "采购退货", label: "purchaseReturns" },
      PZ: { name: "来料暂收", label: "incomingTem" },
      PO: { name: "采购订单", label: "purchaseOrder" },
      PR: { name: "采购计划", label: "purchasePlan" },
      PP: { name: "采购报价", label: "purchaseOffer" },
      RI: { name: "应收结账单", label: "offerOrder" },
      RR: { name: "预收款单", label: "advanceReceipt" },
      RS: { name: "收款单", label: "receipt" },
      SI: { name: "销售发票", label: "saleInvoice" },
      SHA: { name: "销售出货", label: "saleShipment" },
      SO: { name: "销售订单", label: "saleOrder" },
      ST: { name: "销售退货", label: "saleReturn" },
      SB: { name: "销售报价", label: "saleOffer" },
      WI: { name: "生产入库", label: "prodWare" },
      WC: { name: "拆分单", label: "split" },
      WZ: { name: "组合单", label: "combination" },
      WQ: { name: "其他入库", label: "otherWare" },
      WE: { name: "其他出库", label: "otherStock" },
      WL: { name: "生产领料", label: "prodMate" },
      WN: { name: "生产退料", label: "prodReturn" },
      SA: { name: "维修申请", label: "customerServiceApplication" },
      SQ: { name: "维修报价", label: "customerServiceQuotation" },
      SEO: { name: "维修出库", label: "mainExport" },
      SU: { name: "维修领料", label: "mainMate" },
      RT: { name: "维修退料", label: "mainReturn" },
      MP: { name: "生产计划", label: "prodPlan" },
      TE: { name: "委外费用单", label: "sourcExp" },
      TI: { name: "委外入库", label: "sourcWare" },
      TO: { name: "委外工单", label: "sourcOrder" },
      TZ: { name: "委外暂收", label: "sourcTem" },
      TL: { name: "委外领料", label: "sourcMate" },
      TR: { name: "委外退料", label: "sourcReturn" },
      TP: { name: "委外计划", label: "sourcPlan" },
      TB: { name: "委外报价", label: "sourcOffer" }
    },
    apiKeys: {
      // baiduMap: "IjVLfQ6Tudo7LK8wCBeCPESmHl8doh61"
      baiduMap: "davD7QtGgnBgqrfET20iwKHlWTL5g8GT"
    },
    ModalShow: false,
    joinModal: false,
    supplierModal: false,
    demandModal: false,
    moveModal: false,
    galleryModal: false,
    chatModal: false,
    payModal: false,
    supplierModal: false,
    //
    createdWorkModal: false,
    createdCustomerModal: false,
    dateTimePickModal: false,
    customerService: false,
    delegateUser: false,
    createdReportModal: false,
    //
    entryWorkModal: false,
    changePositionsModal: false,
    addOverTimeModal: false,
    addLeaveModal: false,
    addOutsiteModal: false,
    addNoteModal: false,
    editOqcModal: false,
    //
    addWareHouseModal: false,
    addMaterials: false,
    addShipmentModal: false,
    addOrderModal: false,
    addCustomer: false,
    //
    departmentModal: false
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
    },
    /**
     * @param {*} state
     * @param {*} name
     * @param {*} arr
     * vuex用的是apply()
     */
    setStateData(state, { name, arr }) {
      state[name] = arr;
    }
  }
});
