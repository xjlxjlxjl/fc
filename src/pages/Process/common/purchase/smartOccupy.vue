<template>
  <div>
    <div class="modal fade" id="smartOccupy" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table :data="arr" border stripe>
            <el-table-column prop="" label="料品规格"></el-table-column>
            <el-table-column prop="" label="料品名称"></el-table-column>
            <el-table-column prop="" label="数量"></el-table-column>
            <el-table-column prop="" label="长度"></el-table-column>
            <el-table-column prop="" label="关联子料"></el-table-column>
            <el-table-column prop="" label="单位"></el-table-column>
            <el-table-column prop="" label="料品类别"></el-table-column>
            <el-table-column prop="" label="料品属性"></el-table-column>
            <el-table-column prop="" label="占用仓库">
              <template slot-scope="{ $index, row }">
                <el-button size="mini" @click="inStoreModal = !inStoreModal">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="modal fade" id="inStock" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table :data="inStore" border stripe>
            <el-table-column label="序号" width="50"></el-table-column>
            <el-table-column prop="" label="占用订单号"></el-table-column>
            <el-table-column prop="" label="SN码"></el-table-column>
            <el-table-column prop="" label="料品编码"></el-table-column>
            <el-table-column prop="" label="料品规格"></el-table-column>
            <el-table-column prop="" label="料品名称"></el-table-column>
            <el-table-column prop="" label="占用数量"></el-table-column>
            <el-table-column prop="" label="占用仓库"></el-table-column>
            <el-table-column prop="" label="占用方式"></el-table-column>
            <el-table-column prop="" label="调整占用">
              <template slot-scope="{ row }">
                <el-button size="mini" @click="AdjustmentModal = !AdjustmentModal">调整</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="modal fade" id="Adjustment" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table :data="inStore" border stripe>
            <el-table-column prop="" label="可占用仓库"></el-table-column>
            <el-table-column prop="" label="可用数量"></el-table-column>
            <el-table-column prop="" label="已占用数量"></el-table-column>
            <el-table-column prop="" label="调整占用数量"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "smartOccupy",
  data() {
    return {
      inStore: [{}],
      Adjustment: [],
      inStoreModal: false,
      AdjustmentModal: false,
    };
  },
  props: {
    arr: Array
  },
  methods: {},
  watch: {
    inStoreModal(val) {
      $("#inStock").modal("toggle");
    },
    AdjustmentModal(val) {
      $("#Adjustment").modal("toggle");
    }
  }
}
</script>
<style lang="less">
#smartOccupy {}
</style>
