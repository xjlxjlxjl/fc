<template>
  <el-container id="IQC">
    <el-main>
      <div class="global"></div>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "IQC"
};
</script>
<style lang="less">
#IQC {
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
