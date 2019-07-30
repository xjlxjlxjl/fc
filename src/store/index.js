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
          index: 0,
          alt: "消息",
          id: "chat",
          icon: "font_family icon-liaotian",
          activeIcon: "font_family icon-liaotian_",
          isDefault: true,
          isShow: true
        },
        {
          index: 1,
          alt: "好友",
          id: "mail",
          icon: "font_family icon-haoyou_1",
          activeIcon: "font_family icon-haoyou_",
          isDefault: false,
          isShow: true
        },
        {
          index: 2,
          alt: "群聊",
          id: "group",
          icon: "font_family icon-qunliao1",
          activeIcon: "font_family icon-qunliao",
          isDefault: false,
          isShow: true
        },
        {
          index: 3,
          alt: "用户搜索",
          id: "search",
          icon: "el-input__icon el-icon-search",
          activeIcon: "el-input__icon el-icon-search",
          isDefault: false,
          isShow: false
        },
        {
          index: 4,
          alt: "群搜索",
          id: "search",
          icon: "el-input__icon el-icon-search",
          activeIcon: "el-input__icon el-icon-search",
          isDefault: false,
          isShow: false
        },
        {
          index: 5,
          alt: "同事",
          id: "member",
          icon: "font_family icon-tongshi_1",
          activeIcon: "font_family icon-tongshi_",
          isDefault: false,
          isShow: true
        },
        {
          index: 6,
          alt: "通知",
          id: "notices",
          icon: "font_family icon-tongzhi1",
          activeIcon: "font_family icon-tongzhi",
          isDefault: false,
          isShow: true
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
    // 审批插件
    addonList: [],
    // 供应商列表
    supplierList: {
      list: [],
      pagination: {}
    },
    appTypeList: [],
    riseProcess: [
      {
        name: "销售",
        url: "/Sale",
        indexUrl: "/process.html#/Sale",
        active: false,
        child: [
          {
            name: "客户管理",
            url: "customers"
          },
          {
            name: "销售订单",
            url: "orders"
          },
          {
            name: "报价",
            url: "quotedPrice"
          }
        ]
      },
      {
        name: "工程",
        url: "/Engineer",
        indexUrl: "/process.html#/Engineer",
        active: false,
        child: [
          {
            name: "Bom",
            url: "project"
          },
          {
            name: "料品",
            url: "materials"
          }
        ]
      },
      {
        name: "采购",
        url: "/Purchase",
        indexUrl: "/process.html#/Purchase",
        active: false,
        child: [
          {
            name: "采购计划",
            url: "project"
          },
          {
            name: "采购单",
            url: "project"
          }
        ]
      },
      {
        name: "IQC",
        url: "/IQC",
        indexUrl: "/process.html#/IQC",
        active: false,
        child: [
          {
            name: "来料检测",
            url: "project"
          }
        ]
      },
      {
        name: "仓库",
        url: "/store",
        indexUrl: "/process.html#/store",
        active: false,
        child: [
          {
            name: "料品管理",
            url: "project"
          },
          {
            name: "出库",
            url: "project"
          },
          {
            name: "入库",
            url: "project"
          }
        ]
      },
      {
        name: "生产",
        url: "/Produce",
        indexUrl: "/process.html#/Produce",
        active: false,
        child: [
          {
            name: "生产计划",
            url: "project"
          },
          {
            name: "生产领料",
            url: "project"
          },
          {
            name: "生产送检",
            url: "project"
          }
        ]
      },
      {
        name: "OQC",
        url: "/OQC",
        indexUrl: "/process.html#/OQC",
        active: false,
        child: [
          {
            name: "成品检测",
            url: "project"
          },
          {
            name: "质检报告",
            url: "project"
          }
        ]
      },
      {
        name: "物流",
        url: "/Logistics",
        indexUrl: "/process.html#/Logistics",
        active: false,
        child: [
          {
            name: "物流管理",
            url: "project"
          }
        ]
      },
      {
        name: "客服",
        url: "/afterSale",
        indexUrl: "/process.html#/afterSale",
        active: false,
        child: [
          {
            name: "售后计划",
            url: "project"
          },
          {
            name: "售后维修",
            url: "project"
          }
        ]
      },
      {
        name: "财务",
        url: "/Finance",
        indexUrl: "/process.html#/Finance",
        active: false,
        child: [
          {
            name: "财务",
            url: "project"
          }
        ]
      },
      {
        name: "人事",
        url: "/Matters",
        indexUrl: "/process.html#/Matters",
        active: false,
        child: [
          {
            name: "人事",
            url: "Matters"
          }
        ]
      }
    ],
    process: {
      sale: [
        {
          name: "未完成任务",
          url: "/tasks"
        },
        {
          name: "生产看版",
          url: "/Produce/product"
        },
        {
          name: '审核表',
          url: '/approval'
        },
        {
          name: "客户管理",
          url: "/Sale/customer"
        },
        {
          name: "销售订单",
          url: "/Sale/order"
        },
        {
          name: "非标询价",
          url: "/Sale/nonstandard"
        },
        {
          name: "非标询价模板设置",
          url: "/Sale/nonstandardModal"
        },
        {
          name: "报价单",
          url: "/Sale/offer"
        },
        {
          name: "出货申请表",
          url: "/Sale/shipment"
        },
        {
          name: "退货申请表",
          url: "/Sale/return"
        },
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
        // {
        //   name: "应收账单",
        //   url: "/Sale/accountsReceivable"
        // },
        // {
        //   name: "入库申请单",
        //   url: "/Sale/warehouseApplication"
        // }
      ],
      matters: [
        {
          name: "员工列表",
          url: "/Matters"
        },
        {
          name: "公司部门",
          url: "/Matters/department"
        },
        {
          name: "部门权限",
          url: "/Matters/power"
        },
        {
          name: "加班申请记录",
          url: "/Matters/overtime"
        },
        {
          name: "请假记录",
          url: "/Matters/leave"
        },
        {
          name: "出差申请记录",
          url: "/Matters/outsite"
        },
        {
          name: "签到列表",
          url: "/Matters/sign"
        },
        {
          name: "备忘录列表",
          url: "/Matters/remember"
        },
        {
          name: "调休列表",
          url: "/Matters/break"
        },
        {
          name: "用户入职申请审核列表",
          url: "/Matters/entry"
        },
        {
          name: "审批条件列表",
          url: "/Matters/approval"
        },
        {
          name: "审批类型列表",
          url: "/Matters/approvals/type"
        },
        {
          name: "用户组列表",
          url: "/Matters/userGroup"
        },
      ],
      aftersale: [
        {
          name: "待完成任务",
          url: "/tasks"
        },
        {
          name: "客服申请",
          url: "/AfterSale/application"
        },
        {
          name: "客服报价",
          url: "/AfterSale/offer"
        },
        {
          name: "客服领料",
          url: "/AfterSale/picking"
        },
        {
          name: "客服报告",
          url: "/AfterSale/report"
        },
        {
          name: "采购申请",
          url: "/AfterSale/PR"
        },
        {
          name: "客服打卡",
          url: "/AfterSale/clock"
        },
        {
          name: "历史客服申请",
          url: "/AfterSale/history"
        },
        {
          name: "客服总类分析",
          url: "/AfterSale/analysis"
        },
        {
          name: "不良产品问题归类",
          url: "/AfterSale/badProblem"
        },
        {
          name: "客户好评系统汇总",
          url: "/AfterSale/praise"
        },
        {
          name: "客服部共享文件汇总",
          url: "/AfterSale/sharedFiles"
        }
      ],
      produce: [
        {
          name: "待完成任务",
          url: "/tasks"
        },
        {
          name: "生产看板",
          url: "/Produce/product"
        },
        {
          name: '审核表',
          url: '/approval'
        },
        {
          name: '生产入库',
          url: '/Produce/storage'
        },
        {
          name: '生产出库',
          url: '/Produce/extract'
        },
        {
          name: '生产计划',
          url: '/Produce/plan'
        },
        {
          name: "生产领料",
          url: "/Produce/picking"
        },
        {
          name: "SOP管理",
          url: "/Produce/SOP"
        },
        {
          name: "生产工序管理",
          url: "/Produce/turn"
        },
        {
          name: "成品打包",
          url: "/Produce/bale"
        },
        {
          name: "生产仓管理",
          url: "/Produce/store"
        },
        {
          name: "生产不良仓管理",
          url: "/Produce/unhealthy"
        },
        {
          name: "工时表",
          url: "/Produce/time"
        }
      ],
      store: [
        {
          name: "待完成任务",
          url: "/tasks"
        },
        {
          name: "生产看板",
          url: "/store/product"
        },
        {
          name: '审核表',
          url: '/approval'
        },
        {
          name: "领料申请",
          url: "/store/applyMateriel"
        },
        {
          name: "仓库、仓位管理",
          url: "/store/manage"
        },
        {
          name: "库存管理",
          url: "/store/stock"
        },
        {
          name: "来料暂收",
          url: "/store/temporary"
        },
        {
          name: "物料车管理",
          url: "/store/carManage"
        },
        {
          name: "拆分单",
          url: "/store/split"
        },
        {
          name: "组合单",
          url: "/store/combination"
        },
        {
          name: "备料需求表",
          url: "/store/spareParts"
        },
        {
          name: "入库申请表",
          url: "/store/warehousing"
        },
        {
          name: "出货申请表",
          url: "/store/shipment"
        },
        {
          name: "退货申请单",
          url: "/store/recall"
        }
      ],
      oqc: [
        {
          name: "待完成任务",
          url: "/tasks"
        },
        {
          name: "生产看板",
          url: "/Produce/product"
        },
        {
          name: "生产送检表",
          url: "/OQC/inspection"
        },
        {
          name: "出货检标准规定",
          url: "/OQC/rules"
        },
        {
          name: "工时",
          url: "/OQC/time"
        },
        {
          name: "历史出货报告",
          url: "/OQC/history"
        }
      ],
      system: [
        {
          name: "基本信息",
          url: "/System"
        },
        {
          name: "社会信息",
          url: "/System/sociology"
        },
        {
          name: "企业电子章",
          url: "/System/enterprise"
        }
      ],
      purchase: [
        {
          name: '待完成任务',
          url: '/tasks'
        },
        {
          name: '审核表',
          url: '/approval'
        },
        {
          name: '生产看板',
          url: '/Produce/product'
        },
        {
          name: '供应商管理',
          url: '/Purchase/supplier'
        },
        {
          name: '采购申请',
          url: '/Purchase/apply'
        },
        {
          name: '采购计划',
          url: '/Purchase/plan'
        },
        {
          name: '采购订单',
          url: '/Purchase/order'
        },
        {
          name: '委外订单',
          url: '/Purchase/entrust'
        },
        {
          name: '委外领料单',
          url: '/Purchase/receive'
        },
        {
          name: '质检不良单',
          url: '/Purchase/unhealthy'
        },
        {
          name: '采购换货',
          url: '/Purchase/barter'
        },
        {
          name: '采购退货',
          url: '/Purchase/return'
        },
        {
          name: '智能计划',
          url: '/Purchase/smartPlan'
        },
        {
          name: '生产工时管理',
          url: '/Purchase/producTime'
        },
        {
          name: '每日可用工时管理',
          url: '/Purchase/dailyHours'
        }
      ],
      finance: [
        {
          name: '待完成任务',
          url: '/tasks'
        },
        {
          name: '应收明细',
          url: '/Finance/incomeDetail'
        },
        {
          name: '应付明细',
          url: '/Finance/payableDetail'
        },
        {
          name: '应收负债表',
          url: '/Finance/receiveDebt'
        },
        {
          name: '应付负债表',
          url: '/Finance/meetDebt'
        },
        {
          name: '利润表',
          url: '/Finance/profit'
        },
        {
          name: '现金流量表',
          url: '/Finance/cashFlow'
        },
        {
          name: '不良商品问题归类',
          url: '/Finance/badClassify'
        },
        {
          name: '预收定金冲账表',
          url: '/Finance/downPayment'
        },
        {
          name: '坏账',
          url: '/Finance/badDebt'
        },
        {
          name: '日记账',
          url: '/Finance/journal'
        },
        {
          name: '其他私账表',
          url: '/Finance/otherSecretBill'
        },
        {
          name: '应收票据统计',
          url: '/Finance/receiveBillCount'
        },
        {
          name: '应付发票统计',
          url: '/Finance/meetBillCount'
        },
        {
          name: '支票记录提醒',
          url: '/Finance/checkRecord'
        },
        {
          name: '固定资产',
          url: '/Finance/fixedAssets'
        },
        {
          name: '库存金额分类汇总报表',
          url: '/Finance/storeSumSubtotal'
        },
        {
          name: '应收汇总表',
          url: '/Finance/receiveSummary'
        },
        {
          name: '应付汇总表',
          url: '/Finance/meetSummary'
        },
        {
          name: '委外明细表',
          url: '/Finance/entrustDetail'
        },
        {
          name: '委外汇总表',
          url: '/Finance/entrustSummary'
        },
        {
          name: '料品组合表',
          url: '/Finance/matterGroup'
        },
        {
          name: '生产领退料明细',
          url: '/Finance/productMatterDetail'
        },
        {
          name: '料品出入库明细',
          url: '/Finance/matterLaidUpDetail'
        },
        {
          name: '料品历史库存表',
          url: '/Finance/matterHistoryStock'
        },
        {
          name: '其他出入库明细',
          url: '/Finance/otherLaidUpDetail'
        },
        {
          name: '每月科目余额表',
          url: '/Finance/monthBalance'
        },
        {
          name: '部门费用分析',
          url: '/Finance/branchCostAnalysis'
        },
        {
          name: '费用分析',
          url: '/Finance/CostAnalysis'
        },
        {
          name: '汇总科目余额表',
          url: '/Finance/poolBalance'
        }
      ],
      engineer: [
        {
          name: "待完成任务",
          url: "/tasks"
        },
        {
          name: "生产看板",
          url: "/Produce/product"
        },
        {
          name: "审核表",
          url: "/approval"
        },
        {
          name: "料品管理",
          url: "/Engineer/material"
        },
        {
          name: "BOM管理",
          url: "/Engineer/BOM"
        },
        {
          name: "承认图",
          url: "/Engineer/admit"
        },
        {
          name: "组装图",
          url: "/Engineer/assemble"
        },
        {
          name: "加工图",
          url: "/Engineer/machine"
        }
      ],
      iqc: [
        {
          name: "待完成任务",
          url: "/tasks"
        },
        {
          name: "生产看板",
          url: "/IQC/kanban"
        },
        {
          name: "来料暂收",
          url: "/IQC/temporary"
        },
        {
          name: "质检单",
          url: "/IQC/test"
        },
        {
          name: "质检不良单",
          url: "/IQC/unhealthy"
        },
        {
          name: "出库申请",
          url: "/IQC/outStore"
        },
        {
          name: "质检仓管理",
          url: "/IQC/manage"
        },
        {
          name: "质检不良仓管理",
          url: "/IQC/unhealthyManage"
        }
      ]
    },
    // 任务
    tasksType: [
      {
        value: undefined,
        label: "全部"
      },
      {
        value: 0,
        label: "未完成（未延期）"
      },
      {
        value: 2,
        label: "未完成（延期）"
      },
      {
        value: "undone",
        label: "未完成（全部）"
      },
      {
        value: 1,
        label: "完成（未延期）"
      },
      {
        value: 3,
        label: "完成（延期）"
      },
      {
        value: "complete",
        label: "完成（全部）"
      }
    ],
    tasksItems: {
      worker: {
        name: "任务列表",
        label: "tasks"
      },
      service: {
        name: "客服申请",
        label: "/Sale/customerServiceApplication"
      },
      service_assign: {
        name: "客服报价",
        label: "/AfterSale/application"
      },
      service_quote: {
        name: "客服报价",
        label: "/AfterSale/application"
      },
      order: {
        name: "销售订单",
        label: "/Sale/order"
      },
      check: {
        name: "审核表",
        label: "/approval"
      },
      show: {
        name: "生产看板",
        label: "/Produce/product"
      },
      quality: {
        name: "质检列表",
        label: "/OQC/inspection"
      },
      bale: {
        name: "成品打包",
        label: "/Produce/bale"
      }
    },
    tasksPendingNum: {
      tasks: 0,
      '/tasks': 0,
      // 销售
      '/Sale/order': 0,
      '/Sale/customerServiceApplication': 0,
      '/Sale/customerServiceQuotation': 0,
      // 售后
      '/AfterSale/application': 0,
      // 采购
      '/tasks': 0,
      '/approval': 0,
      '/Purchase/product': 0,
      '/Purchase/supplier': 0,
      '/Purchase/apply': 0,
      '/Purchase/plan': 0,
      '/Purchase/order': 0,
      '/Purchase/entrust': 0,
      '/Purchase/receive': 0,
      '/Purchase/unhealthy': 0,
      '/Purchase/history': 0,
      '/Purchase/priceAnalysis': 0,
      '/Purchase/billAnalysis': 0,
      // 财务
      '/Finance/incomeDetail': 0,
      '/Finance/payableDetail': 0,
      '/Finance/receiveSummary': 0,
      '/Finance/meetSummary': 0,
      '/Finance/receiveDebt': 0,
      '/Finance/meetDebt': 0,
      // 工程
      '/Engineer/product': 0,
      '/Engineer/material': 0,
      '/Engineer/BOM': 0,
      '/Engineer/admit': 0,
      '/Engineer/assemble': 0,
      '/Engineer/machine': 0,
      '/Engineer/gallery': 0
    },
    apiKeys: {
      // baiduMap: "IjVLfQ6Tudo7LK8wCBeCPESmHl8doh61"
      baiduMap: "davD7QtGgnBgqrfET20iwKHlWTL5g8GT"
    },
    ModalShow: false,
    userCheckBoxModal: false,
    joinModal: false,
    supplierModal: false,
    demandModal: false,
    moveModal: false,
    galleryModal: false,
    chatModal: false,
    payModal: false,
    supplierModal: false,
    fileListModal: false,
    //
    createdWorkModal: false,
    createdCustomerModal: false,
    dateTimePickModal: false,
    customerService: false,
    delegateUser: false,
    //
    entryWorkModal: false,
    changePositionsModal: false,
    addOverTimeModal: false,
    addLeaveModal: false,
    addOutsiteModal: false,
    addNoteModal: false,
    //
    addWareHouseModal: false,
    addMaterials: false,
    addCustomer: false,
    //
    departmentModal: false,
    addAppTypeModal: false,
    addApprovalModal: false,
    addVisitModal: false
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
    setStateData(state, {
      name,
      arr
    }) {
      state[name] = arr;
    },
    // 更改待完成任务条数
    changeTasks(state, {
      name,
      num
    }) {
      state.tasksPendingNum[name] = num;
    }
  }
});
