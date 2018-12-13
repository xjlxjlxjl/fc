<template>
  <el-container id="matters">
    <companyAside :aside="aside"></companyAside>
    <el-main>
      <div class="global">
        <el-button size="mini">新建加班申请</el-button>
        <el-button size="mini">新建请假单</el-button>
        <el-button size="mini">新建出差申请</el-button>
        <el-button size="mini">添加备忘录</el-button>
        <el-button size="mini">申请年假</el-button>
        <el-button size="mini">签到</el-button>
      </div>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import companyAside from "@/pages/Process/common/companyAside";
export default {
  name: "matters",
  data() {
    return {
      aside: this.$store.state.process.matters
    };
  },
  components: {
    companyAside: companyAside
  }
};
</script>
<style lang="less">
@background: #f2f2f2;
@borderBlod: solid 1rem @background;
@border: solid 1px @background;
@white: #ffffff;
@gery: #666666;
#matters {
  .global {
    padding: 11px 0 0 11px;
  }
  #toolbar {
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
