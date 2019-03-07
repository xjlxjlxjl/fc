<template>
  <el-container id="purchase">
    <!-- <companyAside :aside="aside"></companyAside> -->
    <el-main>
      <div class="global">
        <div>
          <!-- <el-button size="mini">审核</el-button> -->
          <!-- <el-button size="mini">反刻</el-button> -->
          <!-- <el-button size="mini">打印</el-button> -->
          <!-- <el-button size="mini">新增客户</el-button> -->
          <!-- <el-button size="mini">新建报价单</el-button> -->
          <!-- <el-button size="mini">新建销售单</el-button> -->
          <!-- <el-button size="mini">出货申请</el-button> -->
          <!-- <el-button size="mini">调整优先级</el-button> -->
          <!-- <el-button size="mini">合同模板</el-button> -->
        </div>
        <div>
          <!-- <el-button size="mini">付款方式设定</el-button> -->
          <!-- <el-button size="mini">发票类型</el-button> -->
          <!-- <el-button size="mini">产品价格设定</el-button> -->
          <!-- <el-button size="mini">生成对账单</el-button> -->
          <!-- <el-button size="mini">加班申请</el-button> -->
          <!-- <el-button size="mini">请假</el-button> -->
          <!-- <el-button size="mini">出差申请</el-button> -->
          <!-- <el-button size="mini">部门人员权限</el-button> -->
        </div>
      </div>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
// import companyAside from "@/pages/Process/control/tabs";

export default {
  name: "purchase",
  data() {
    return {
      aside: this.$store.state.process.purchase
    };
  },
  components: {
    // companyAside: companyAside
  }
};
</script>
<style lang="less">
#purchase {
  .global {
    display: flex;
    justify-content: space-between;
    > div {
      &:first-child {
        padding-left: .5rem;
      }
      &:last-child {
        padding-right: .5rem;
      }
      button {
        margin-top: .5rem;
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
</style>
