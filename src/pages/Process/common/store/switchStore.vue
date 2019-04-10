<template>
  <!-- 转仓 -->
  <div class="modal fade" id="switchStore" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <el-table :data="data" border style="width: 100%">
          <el-table-column prop="date" label="料品编码"></el-table-column>
          <el-table-column prop="date" label="料品名称"></el-table-column>
          <el-table-column prop="date" label="料品规格"></el-table-column>
          <el-table-column prop="date" label="仓库"></el-table-column>
          <el-table-column prop="date" label="库存可用数量"></el-table-column>
          <el-table-column prop="date" label="单位"></el-table-column>
          <el-table-column prop="date" label="转入仓库">
            <template slot-scope="{ $index, row }">
              <el-select v-model="row.store"></el-select>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="转入数量">
            <template slot-scope="{ $index, row }">
              <el-input-number v-model="row.number" :min="1" :max="row.amount"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
        <div class="modal-footer">
          <el-button type="info" size="small" data-dismiss="modal">关闭</el-button>
          <el-button type="info" size="small" @click="save">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'switchStore',
  data() {
    return {};
  },
  props: {
    data: Array
  },
  methods: {
    save() {

    }
  },
  mounted() {}
}
</script>
<style lang="less">
  #switchStore {
    .modal-footer {
      text-align: center;
    }
  }
</style>
