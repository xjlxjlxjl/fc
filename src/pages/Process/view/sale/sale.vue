<template>
  <el-container id="sale">
    <companyAside :aside="aside"></companyAside>
    <el-main>
      <div class="global">
        <!-- <el-button size="mini">创建生产看板</el-button>
        <el-button size="mini">创建生产看板</el-button>
        <el-button size="mini">创建生产看板</el-button>
        <el-button size="mini">创建生产看板</el-button>-->
      </div>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import companyAside from "@/pages/Process/common/companyAside";
export default {
  name: "sale",
  data() {
    return {
      aside: this.$store.state.process.sale
    };
  },
  components: {
    companyAside: companyAside
  },
  methods: {}
};
</script>
<style lang="less">
@background: #f2f2f2;
@borderBlod: solid 1rem @background;
@border: solid 1px @background;
@white: #ffffff;
@gery: #666666;
#sale {
  .global {
    padding: 11px 0 0 11px;
  }
  #toolbar {
    display: none;
    &:first-child {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .lead {
        margin-right: 20px;
        margin-bottom: 0;
      }
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
