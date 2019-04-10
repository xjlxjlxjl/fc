<template>
  <!-- 转仓记录 -->
  <div class="modal fade" id="transfeRecord" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <el-table :data="data" border style="width: 100%">
          <el-table-column prop="date" label="料品编码"></el-table-column>
          <el-table-column prop="date" label="料品名称"></el-table-column>
          <el-table-column prop="date" label="料品规格"></el-table-column>
          <el-table-column prop="date" label="转入/出仓库"></el-table-column>
          <el-table-column prop="date" label="转仓"></el-table-column>
          <el-table-column prop="date" label="转仓日期"></el-table-column>
          <el-table-column prop="date" label="审核人"></el-table-column>
          <el-table-column prop="date" label="审核日期"></el-table-column>
          <el-table-column prop="date" label="审核状态"></el-table-column>
        </el-table>
        <div class="modal-footer">
          <el-button type="info" size="small" data-dismiss="modal">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'transfeRecord',
  data() {
    return {};
  },
  props: {
    data: Array
  },
  methods: {},
  mounted() {}
}
</script>
<style lang="less">
  #transfeRecord {
    .modal-footer {
      text-align: center;
    }
  }
</style>
