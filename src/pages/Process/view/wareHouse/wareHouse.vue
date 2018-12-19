<template>
  <el-container id="wareHouse">
    <companyAside :aside="aside"></companyAside>
    <el-main>
      <div class="global"></div>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import companyAside from "@/pages/Process/common/companyAside";
export default {
  name: "wareHouse",
  data() {
    return {
      aside: this.$store.state.process.WareHouse
    };
  },
  components: {
    companyAside: companyAside
  }
};
</script>
<style lang="less">
#wareHouse {
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
