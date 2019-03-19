<template>
  <el-container id="finance">
    <!-- <companyAside :aside="aside"></companyAside> -->
    <el-main>
      <div class="global">
        <div>
          <!-- <el-button size="mini">导入</el-button> -->
          <!-- <el-button size="mini">导出</el-button> -->
          <!-- <el-button size="mini">预售冲账</el-button> -->
          <!-- <el-button size="mini">月结</el-button> -->
        </div>
        <div>
          <!-- <el-button size="mini">销假</el-button> -->
          <!-- <el-button size="mini">申请出差</el-button> -->
          <!-- <el-button size="mini">部门人员权限</el-button> -->
        </div>
      </div>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "finance",
  data() {
    return {
      aside: this.$store.state.process.finance
    };
  },
  components: {
    // companyAside: companyAside
  }
};
</script>
<style lang="less">
#finance {
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
