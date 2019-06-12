<template>
  <el-container id="tabs">
    <el-aside id="companyAside" width="200px">
      <createdWork @refresh="getWorkList"></createdWork>
      <el-menu default-active="0" @select="menuSelect">
        <el-menu-item v-for="(item,index) in aside" :key="index" :index="index.toString()">
          <span slot="title">{{ item.name }}</span>
          <el-button v-if="!index" slot="title" type="info" size="mini" @click="created">新建</el-button>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main id="purchase">
      <el-tabs v-model="activeTabs" type="card" closable @tab-remove="removeTab">
        <el-tab-pane v-for="(item,index) in tabItems" :key="index" :name="item.label">
          <span slot="label" v-if="item.num">
            <el-badge :value="item.num" class="item">{{item.name}}</el-badge>
          </span>
          <span slot="label" v-else>{{item.name}}</span>
        </el-tab-pane>
      </el-tabs>
      <div class="global"></div>
      <keep-alive :max="10">
        <tasks v-if="activeTabs == '/tasks'" @change="menuSelect"></tasks>
        <approval v-else-if="activeTabs == '/approval'"></approval>
        <!-- 销售 -->
        <saleOrder v-else-if="activeTabs == '/Sale/order'"></saleOrder>
        <saleCustomerServiceApplication v-else-if="activeTabs == '/Sale/customerServiceApplication'"></saleCustomerServiceApplication>
        <saleCustomerServiceQuotation v-else-if="activeTabs == '/Sale/customerServiceQuotation'"></saleCustomerServiceQuotation>
        <!-- 售后 -->
        <afterSaleApplication v-else-if="activeTabs == '/AfterSale/application'"></afterSaleApplication>
        <afterSaleOffer v-else-if="activeTabs == '/AfterSale/offer'"></afterSaleOffer>
        <afterSalePicking v-else-if="activeTabs == '/AfterSale/picking'"></afterSalePicking>
        <afterSaleReport v-else-if="activeTabs == '/AfterSale/report'"></afterSaleReport>
        <afterSalePr v-else-if="activeTabs == '/AfterSale/PR'"></afterSalePr>
        <afterSaleClock v-else-if="activeTabs == '/AfterSale/clock'"></afterSaleClock>
        <!-- 采购 -->
        <purchaseApply v-else-if="activeTabs == '/Purchase/apply'"></purchaseApply>
        <purchaseBillAnalysis v-else-if="activeTabs == '/Purchase/billAnalysis'"></purchaseBillAnalysis>
        <purchasEntrust v-else-if="activeTabs == '/Purchase/entrust'"></purchasEntrust>
        <purchasReceive v-else-if="activeTabs == '/Purchase/receive'"></purchasReceive>
        <purchaseHistory v-else-if="activeTabs == '/Purchase/history'"></purchaseHistory>
        <purchaseOrder v-else-if="activeTabs == '/Purchase/order'"></purchaseOrder>
        <purchasePlan v-else-if="activeTabs == '/Purchase/plan'"></purchasePlan>
        <purchasePriceAnalysis v-else-if="activeTabs == '/Purchase/priceAnalysis'"></purchasePriceAnalysis>
        <purchaseProduct v-else-if="activeTabs == '/Purchase/product'"></purchaseProduct>
        <purchaseSupplier v-else-if="activeTabs == '/Purchase/supplier'"></purchaseSupplier>
        <purchaseTrimPrice v-else-if="activeTabs == '/Purchase/trimPrice'"></purchaseTrimPrice>
        <purchaseUnhealthy v-else-if="activeTabs == '/Purchase/unhealthy'"></purchaseUnhealthy>
        <purchaseBarter v-else-if="activeTabs == '/Purchase/barter'"></purchaseBarter>
        <purchaseReturn v-else-if="activeTabs == '/Purchase/return'"></purchaseReturn>
        <purchaseSmartPlan v-else-if="activeTabs == '/Purchase/smartPlan'"></purchaseSmartPlan>
        <purchaseProducTime v-else-if="activeTabs == '/Purchase/producTime'"></purchaseProducTime>
        <purchaseDailyHours v-else-if="activeTabs == '/Purchase/dailyHours'"></purchaseDailyHours>
        <!-- IQC -->
        <IQCkanban v-else-if="activeTabs == '/IQC/kanban'"></IQCkanban>
        <IQCtemporary v-else-if="activeTabs == '/IQC/temporary'"></IQCtemporary>
        <IQCtest v-else-if="activeTabs == '/IQC/test'"></IQCtest>
        <IQCunhealthy v-else-if="activeTabs == '/IQC/unhealthy'"></IQCunhealthy>
        <IQCmanage v-else-if="activeTabs == '/IQC/manage'"></IQCmanage>
        <IQCunhealthyManage v-else-if="activeTabs == '/IQC/unhealthyManage'"></IQCunhealthyManage>
        <IQCoutStore v-else-if="activeTabs == '/IQC/outStore'"></IQCoutStore>
        <!-- 工程 -->
        <engineerMaterial v-else-if="activeTabs == '/Engineer/material'"></engineerMaterial>
        <engineerBom v-else-if="activeTabs == '/Engineer/BOM'"></engineerBom>
        <!-- 仓库 -->
        <storeApplyMateriel v-else-if="activeTabs == '/store/applyMateriel'"></storeApplyMateriel>
        <storeCarManage v-else-if="activeTabs == '/store/carManage'"></storeCarManage>
        <storeManage v-else-if="activeTabs == '/store/manage'"></storeManage>
        <storeStock v-else-if="activeTabs == '/store/stock'"></storeStock>
        <storeTemporary v-else-if="activeTabs == '/store/temporary'"></storeTemporary>
        <storeCombination v-else-if="activeTabs == '/store/combination'"></storeCombination>
        <storeSplit v-else-if="activeTabs == '/store/split'"></storeSplit>
        <storeShipment v-else-if="activeTabs == '/store/shipment'"></storeShipment>
        <!-- 生产 -->
        <produceProduct v-else-if="activeTabs == '/Produce/product'"></produceProduct>
        <producePlan v-else-if="activeTabs == '/Produce/plan'"></producePlan>
        <producePicking v-else-if="activeTabs == '/Produce/picking'"></producePicking>
        <produceSOP v-else-if="activeTabs == '/Produce/SOP'"></produceSOP>
        <produceStore v-else-if="activeTabs == '/Produce/store'"></produceStore>
        <produceUnhealthy v-else-if="activeTabs == '/Produce/unhealthy'"></produceUnhealthy>
        <produceTime v-else-if="activeTabs == '/Produce/time'"></produceTime>
        <produceTurn v-else-if="activeTabs == '/Produce/turn'"></produceTurn>
        <!-- OQC -->
        <OQCProduct v-else-if="activeTabs == '/OQC/product'"></OQCProduct>
        <OQCInspection v-else-if="activeTabs == '/OQC/inspection'"></OQCInspection>
        <OQCRules v-else-if="activeTabs == '/OQC/rules'"></OQCRules>
        <OQCTime v-else-if="activeTabs == '/OQC/time'"></OQCTime>
        <OQCHistory v-else-if="activeTabs == '/OQC/history'"></OQCHistory>
        <!-- 财务 -->
        <financeIncomeDetail v-else-if="activeTabs == '/Finance/incomeDetail'"></financeIncomeDetail>
        <financePayableDetail v-else-if="activeTabs == '/Finance/payableDetail'"></financePayableDetail>
        <financeReceiveSummary v-else-if="activeTabs == '/Finance/receiveSummary'"></financeReceiveSummary>
        <financeMeetSummary v-else-if="activeTabs == '/Finance/meetSummary'"></financeMeetSummary>
        <financeReceiveDebt v-else-if="activeTabs == '/Finance/receiveDebt'"></financeReceiveDebt>
        <financeMeetDebt v-else-if="activeTabs == '/Finance/meetDebt'"></financeMeetDebt>
      </keep-alive>
    </el-main>
  </el-container>
</template>
<script>
import { mapState } from "vuex";
import createdWork from "@/pages/Process/common/createdWork";

// import Purchase from "@/pages/Process/view/purchase/purchase";
import tasks from "@/pages/Process/control/tasks";
import approval from "@/pages/Process/control/approval";

// 销售
import saleOrder from "@/pages/Process/view/sale/order";
import saleCustomerServiceApplication from "@/pages/Process/view/sale/customerServiceApplication";
import saleCustomerServiceQuotation from "@/pages/Process/view/sale/customerServiceQuotation";

// 售后
import afterSaleApplication from "@/pages/Process/view/afterSale/application";
import afterSaleOffer from "@/pages/Process/view/afterSale/offer";
import afterSalePicking from "@/pages/Process/view/afterSale/picking";
import afterSaleReport from "@/pages/Process/view/afterSale/report";
import afterSalePr from "@/pages/Process/view/afterSale/PR";
import afterSaleClock from "@/pages/Process/view/afterSale/clock";

// 采购
import purchaseApply from "@/pages/Process/view/purchase/apply";
import purchaseBillAnalysis from "@/pages/Process/view/purchase/billAnalysis";
import purchasEntrust from "@/pages/Process/view/purchase/entrust";
import purchasReceive from "@/pages/Process/view/purchase/receive";
import purchaseHistory from "@/pages/Process/view/purchase/history";
import purchaseOrder from "@/pages/Process/view/purchase/order";
import purchasePlan from "@/pages/Process/view/purchase/plan";
import purchasePriceAnalysis from "@/pages/Process/view/purchase/priceAnalysis";
import purchaseProduct from "@/pages/Process/view/purchase/product";
import purchaseSupplier from "@/pages/Process/view/purchase/supplier";
import purchaseTrimPrice from "@/pages/Process/view/purchase/trimPrice"
import purchaseUnhealthy from "@/pages/Process/view/purchase/unhealthy";
import purchaseBarter from "@/pages/Process/view/purchase/barter";
import purchaseReturn from "@/pages/Process/view/purchase/return";
import purchaseSmartPlan from "@/pages/Process/view/purchase/smartPlan";
import purchaseProducTime from "@/pages/Process/view/purchase/producTime";
import purchaseDailyHours from "@/pages/Process/view/purchase/dailyHours";

// IQC
import IQCkanban from "@/pages/Process/view/IQC/kanban";
import IQCtemporary from "@/pages/Process/view/IQC/temporary";
import IQCtest from "@/pages/Process/view/IQC/test";
import IQCunhealthy from "@/pages/Process/view/IQC/unhealthy";
import IQCmanage from "@/pages/Process/view/IQC/manage";
import IQCunhealthyManage from "@/pages/Process/view/IQC/unhealthyManage";
import IQCoutStore from "@/pages/Process/view/IQC/outStore";

// 工程
import engineerMaterial from "@/pages/Process/view/engineer/material";
import engineerBom from "@/pages/Process/view/engineer/BOM";

// 仓库
import storeManage from "@/pages/Process/view/store/manage";
import storeStock from "@/pages/Process/view/store/Stock";
import storeApplyMateriel from "@/pages/Process/view/store/applyMateriel";
import storeProduct from "@/pages/Process/view/store/product";
import storeMaterial from "@/pages/Process/view/store/material";
import storeShipment from "@/pages/Process/view/store/shipment";
import storehousing from "@/pages/Process/view/store/warehousing";
import storeTemporary from "@/pages/Process/view/store/temporary";
import storeCarManage from "@/pages/Process/view/store/carManage";
import storeCombination from "@/pages/Process/view/store/combination";
import storeSplit from "@/pages/Process/view/store/split";
import storeSparePart from "@/pages/Process/view/store/spareParts";

// 生产
import produceProduct from "@/pages/Process/view/produce/product";
import producePlan from "@/pages/Process/view/produce/plan";
import producePicking from "@/pages/Process/view/produce/picking";
import produceSOP from "@/pages/Process/view/produce/SOP";
import produceStore from "@/pages/Process/view/produce/store";
import produceUnhealthy from "@/pages/Process/view/produce/unhealthy";
import produceTime from "@/pages/Process/view/produce/time";
import produceTurn from "@/pages/Process/view/produce/turn";

// OQC
import OQCProduct from "@/pages/Process/view/OQC/product";
import OQCInspection from "@/pages/Process/view/OQC/inspection";
import OQCRules from "@/pages/Process/view/OQC/rules";
import OQCTime from "@/pages/Process/view/OQC/time";
import OQCHistory from "@/pages/Process/view/OQC/history";

// 财务
import financeIncomeDetail from "@/pages/Process/view/finance/incomeDetail";
import financePayableDetail from "@/pages/Process/view/finance/payableDetail";
import financeReceiveSummary from "@/pages/Process/view/finance/receiveSummary";
import financeMeetSummary from "@/pages/Process/view/finance/meetSummary";
import financeReceiveDebt from "@/pages/Process/view/finance/receiveDebt";
import financeMeetDebt from "@/pages/Process/view/finance/meetDebt";

export default {
  name: "tabs",
  data() {
    let url = this.$route.name.toLowerCase(),
      process = [];
    Object.keys(this.$store.state.process).forEach(label =>
      this.$store.state.process[label].forEach(e => process.push(e))
    );
    return {
      process: process,
      aside: this.$store.state.process[url],
      activeTabs: "/tasks",
      tabItems: [{ name: "待完成任务", label: "/tasks", num: 0 }]
    };
  },
  components: {
    createdWork: createdWork,
    tasks: tasks,
    approval: approval,

    saleOrder: saleOrder,
    saleCustomerServiceApplication: saleCustomerServiceApplication,
    saleCustomerServiceQuotation: saleCustomerServiceQuotation,

    afterSaleApplication: afterSaleApplication,
    afterSaleOffer: afterSaleOffer,
    afterSalePicking: afterSalePicking,
    afterSaleReport: afterSaleReport,
    afterSalePr: afterSalePr,
    afterSaleClock: afterSaleClock,

    purchaseApply: purchaseApply,
    purchaseBillAnalysis: purchaseBillAnalysis,
    purchasEntrust: purchasEntrust,
    purchasReceive: purchasReceive,
    purchaseHistory: purchaseHistory,
    purchaseOrder: purchaseOrder,
    purchasePlan: purchasePlan,
    purchasePriceAnalysis: purchasePriceAnalysis,
    purchaseProduct: purchaseProduct,
    purchaseSupplier: purchaseSupplier,
    purchaseTrimPrice: purchaseTrimPrice,
    purchaseUnhealthy: purchaseUnhealthy,
    purchaseBarter: purchaseBarter,
    purchaseReturn: purchaseReturn,
    purchaseSmartPlan: purchaseSmartPlan,
    purchaseProducTime: purchaseProducTime,
    purchaseDailyHours: purchaseDailyHours,

    IQCkanban: IQCkanban,
    IQCtemporary: IQCtemporary,
    IQCtest: IQCtest,
    IQCunhealthy: IQCunhealthy,
    IQCmanage: IQCmanage,
    IQCunhealthyManage: IQCunhealthyManage,
    IQCoutStore: IQCoutStore,

    engineerMaterial: engineerMaterial,
    engineerBom: engineerBom,
    
    storeApplyMateriel: storeApplyMateriel,
    storeCarManage: storeCarManage,
    storeManage: storeManage,
    storeStock: storeStock,
    storeTemporary: storeTemporary,
    storeCombination: storeCombination,
    storeSplit: storeSplit,
    storeShipment: storeShipment,

    produceProduct: produceProduct,
    producePlan: producePlan,
    producePicking: producePicking,
    produceSOP: produceSOP,
    produceStore: produceStore,
    produceUnhealthy: produceUnhealthy,
    produceTime: produceTime,
    produceTurn: produceTurn,

    OQCProduct: OQCProduct,
    OQCInspection: OQCInspection,
    OQCRules: OQCRules,
    OQCTime: OQCTime,
    OQCHistory: OQCHistory,

    financeIncomeDetail: financeIncomeDetail,
    financePayableDetail: financePayableDetail,
    financeReceiveSummary: financeReceiveSummary,
    financeMeetSummary: financeMeetSummary,
    financeReceiveDebt: financeReceiveDebt,
    financeMeetDebt: financeMeetDebt
  },
  methods: {
    // 整理添加或者打开tab
    menuSelect(key, url) {
      if (isNaN(Number(key))) url = key;
      else url = this.aside[key].url;
      let name = null;
      this.process.filter(e => {
        if (e.url == url) name = e.name;
      });
      if (!this.tabItems.onArray(url, "label", "name"))
        this.tabItems.push({
          name: name,
          label: url,
          num: this.tasksPendingNum[url]
        });
      this.getLabelNums();
      this.activeTabs = url;
    },
    removeTab(tagIndex) {
      this.tabItems.forEach((e, k) => {
        if (e.label == tagIndex) {
          this.tabItems.splice(k, 1);
          this.activeTabs = this.tabItems[k ? k - 1 : k].label;
        }
      });
    },
    handleSelect(key) {
      if (key == "-1") return false;
      let that = this,
        self = that.aside[key],
        members = "",
        taskState = false;
      self.members.forEach(e => {
        members += `<p>姓名：${e.user.display_name}　进度：${
          e.status_text
        }</p>`;
        if (e.user.id == this.user.user.id) taskState = e.status;
      });
      let content = `
        <div>
          <p>任务内容：${self.content}</p>
          <p>发布者：${self.creator}</p>
          <p>结束时间：${self.end_time}</p>
          <p>任务成员：${members}</p>
          <p>任务状态：${self.status_text}</p>
        </div>
      `;
      switch (taskState) {
        case 0:
        case 1:
          let url = null,
            btn = "",
            params = {};
          if (taskState) {
            btn = "完成";
            url = `job/complete/${self.id}`;
          } else {
            btn = "接受（ 完成时间为任务结束时间 ）";
            url = `job/accept/${self.id}`;
            // 开始选择接受完成时间
            params.estimate_complete_time = self.end_time;
          }
          // 接受
          this.$confirm(content, "工作详情", {
            confirmButtonText: btn,
            cancelButtonText: "确定",
            dangerouslyUseHTMLString: true
          })
            .then(() =>
              that
                .$post(url, params)
                .then(response => {
                  if (response.status != 200) return false;
                  that.getWorkList();
                })
                .catch(err => console.error(err))
            )
            .catch(() => {});
          break;
        case 2:
        case 3:
          this.$alert(content, "工作详情", {
            dangerouslyUseHTMLString: true
          });
          break;
        default:
          // 发布者
          this.$confirm(content, "工作详情", {
            confirmButtonText: "作废",
            cancelButtonText: "确定",
            dangerouslyUseHTMLString: true
          })
            .then(() => {
              that
                .$post(`job/invalid/${self.id}`)
                .then(response => {
                  if (response.status != 200) return false;
                  that.aside[key].status = 4;
                })
                .catch(err => console.error(err));
            })
            .catch(() => {});
          break;
      }
    },
    created() {
      createdWork.methods.close.call(this);
    },
    getWorkList() {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get("job/list")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.refresh($("#table"));
          // that.aside = response.data.list;
        })
        .catch(err => loading.close());
    },
    getLabelNums() {
      // 设置 label 上数量
      setTimeout(() => 
        Object.keys(this.tasksPendingNum).forEach(e => {
          for (let item of this.tabItems) 
            if (item.label == e) item.num = this.tasksPendingNum[e];
        }),
      1000);
    }
  },
  computed: {
    ...mapState(["createdWorkModal", "tasksPendingNum"])
  },
  watch: {
    tabItems(val) {
      localStorage.setItem('tabItems', JSON.stringify(val));
    },
    activeTabs(val) {
      localStorage.setItem('activeTabs', val)
    }
  },
  mounted() {
    if (localStorage.getItem("activeTabs")) 
      this.activeTabs = localStorage.getItem("activeTabs");
    if (localStorage.getItem("tabItems"))
      this.tabItems = JSON.parse(localStorage.getItem("tabItems"));
    
    this.getLabelNums();
  }
};
</script>
<style lang="less">
@background: #f2f2f2;
@borderBlod: solid 1rem @background;
@border: solid 1px @background;
@white: #ffffff;
@gery: #666666;
@lightGrey: #999999;
@sky: #2288ff;
@orange: #ff9900;
@orgBorder: solid 1px @orange;
#tabs {
  #companyAside {
    // margin-top: 1.5rem;
    border-right: @borderBlod;
    // padding: 1rem;
    background: @white;
    .lead {
      font-size: 20px;
      margin-bottom: 0.5rem;
      button {
        float: right;
      }
    }
    .el-menu {
      border-right: none;
      a {
        text-decoration: none;
      }
      .el-menu-item {
        padding: 0.5rem 1rem !important;
        color: @gery;
        height: auto;
        min-height: 3.4rem;
        line-height: 1.4;
        display: flex;
        align-items: center;
        justify-content: space-between;
        word-break: break-all;
        white-space: normal;
        span {
          font-size: 1.4rem;
        }
        button {
          padding: 3px 15px;
        }
      }
      .is-active {
        color: #ff9900;
        border-bottom: @orgBorder;
      }
    }
  }
  #toolbar {
    display: none;
    &:first-child {
      display: block;
    }
  }

  #store,
  #finance,
  #purchase {
    .el-tabs__header {
      margin-bottom: 0;
      .el-badge.item {
        .el-badge__content {
          top: 7px;
        }
      }
    }
    .global {
      display: flex;
      justify-content: space-between;
      > div {
        &:first-child {
          padding-left: 0.5rem;
        }
        &:last-child {
          padding-right: 0.5rem;
        }
        button {
          margin-top: 0.5rem;
        }
      }
    }

    #financeToolbar,
    #purchaseToolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .lead {
        margin-right: 20px;
        margin-bottom: 0;
      }
    }
    .table th,
    .table td {
      text-align: center;
      vertical-align: middle !important;
    }
    .el-main
      .bootstrap-table
      > .fixed-table-container
      > .fixed-table-body
      > .table
      > thead
      > tr
      > .bs-checkbox {
      min-width: auto;
    }
    .el-input-group__append {
      padding: 0 5px;
    }
  }
  .modal-content {
    p.lead {
      width: 100%;
      padding-bottom: 10px;
      border-bottom: 1px solid @lightGrey;
    }
    .widthFull {
      width: 100%;
    }
  }
}
</style>
