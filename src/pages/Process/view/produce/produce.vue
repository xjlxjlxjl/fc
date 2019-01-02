<template>
  <el-container id="produce">
    <companyAside :aside="aside"></companyAside>
    <el-main>
      <div class="global">
        <!-- <el-button size="mini">创建生产看板</el-button> -->
      </div>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import companyAside from "@/pages/Process/common/companyAside";
export default {
  name: "produce",
  data() {
    return {
      aside: this.$store.state.process.produce
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
#produce {
  .global {
    padding: 11px 0 0 11px;
  }
  #produceToolbar {
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
