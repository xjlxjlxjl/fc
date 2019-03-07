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
      <purchaseTasks v-show="activeTabs == '/Purchase'" @change="menuSelect"></purchaseTasks>
      <purchaseApply v-show="activeTabs == '/Purchase/apply'"></purchaseApply>
      <purchaseBillAnalysis v-show="activeTabs == '/Purchase/billAnalysis'"></purchaseBillAnalysis>
      <purchasEntrust v-show="activeTabs == '/Purchase/entrust'"></purchasEntrust>
      <purchasReceive v-show="activeTabs == '/Purchase/receive'"></purchasReceive>
      <purchaseHistory v-show="activeTabs == '/Purchase/history'"></purchaseHistory>
      <purchaseOrder v-show="activeTabs == '/Purchase/order'"></purchaseOrder>
      <purchasePlan v-show="activeTabs == '/Purchase/plan'"></purchasePlan>
      <purchasePriceAnalysis v-show="activeTabs == '/Purchase/priceAnalysis'"></purchasePriceAnalysis>
      <purchaseProduct v-show="activeTabs == '/Purchase/product'"></purchaseProduct>
      <purchaseSupplier v-show="activeTabs == '/Purchase/supplier'"></purchaseSupplier>
      <purchaseUnhealthy v-show="activeTabs == '/Purchase/unhealthy'"></purchaseUnhealthy>
    </el-main>
  </el-container>
</template>
<script>
import { mapState } from "vuex";
import createdWork from "@/pages/Process/common/createdWork";

// import Purchase from "@/pages/Process/view/purchase/purchase";
import purchaseTasks from "@/pages/Process/view/purchase/tasks";
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
import purchaseUnhealthy from "@/pages/Process/view/purchase/unhealthy";

export default {
  name: "tabs",
  data() {
    let url = this.$route.name.toLowerCase();
    return {
      aside: this.$store.state.process[url],
      activeTabs: "/Purchase",
      tabItems: [{ name: "待完成任务", label: "/Purchase", num: 0 }]
    };
  },
  components: {
    createdWork: createdWork,
    purchaseTasks: purchaseTasks,
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
    purchaseUnhealthy: purchaseUnhealthy
  },
  methods: {
    // 整理添加或者打开tab
    menuSelect(key, url) {
      if (isNaN(Number(key))) url = key;
      else url = this.aside[key].url;
      let name = null;
      this.aside.filter(e => {
        if (e.url == url) name = e.name;
      });
      if (!this.tabItems.onArray(url, "label", "name"))
        this.tabItems.push({
          name: name,
          label: url,
          num: this.tasksPendingNum[url]
        });
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
    }
  },
  computed: mapState(["createdWorkModal", "tasksPendingNum"]),
  created() {}
};
</script>
<style lang="less">
@background: #f2f2f2;
@borderBlod: solid 1rem @background;
@border: solid 1px @background;
@white: #ffffff;
@gery: #666666;
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
  }
}
</style>
