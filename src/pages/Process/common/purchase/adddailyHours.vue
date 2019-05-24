<template>
  <div class="modal fade" id="adddailyHours" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-table :data="row" border stripe>
            <el-table-column label="发单（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.billing"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="拆分（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.split"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="委外备料（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.outside_preparation"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="来料质检（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.incoming_quality_inspection"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="备料（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.preparation"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="组装（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.assembly"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="成品质检（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.finished_product_quality_inspection"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="打包（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.packaging"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="入库（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.storage"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="发货（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.shipping"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="总工时（H）">
              <template slot-scope="{ row }">
                <span>{{ (row.billing || 0) + (row.split || 0) + (row.outside_preparation || 0) + (row.incoming_quality_inspection || 0) + (row.preparation || 0) + (row.assembly || 0) + (row.finished_product_quality_inspection || 0) + (row.packaging || 0) + (row.storage || 0) + (row.shipping || 0) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="modal-footer">
          <el-button size="mini" type="info" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "adddailyHours",
  data() {
    return {};
  },
  props: {
    row: Array
  },
  methods: {
    onSubmit() {
      this
        .$post(this.row[0].id ? `schedule/daily/hour/edit/${this.row[0].id}` : `schedule/daily/hour/create`, ...this.row)
        .then(response => {
          if (response.status != 200) return false;
          this.$emit('refresh');
          $("#dailyHours #adddailyHours").modal("hide");
        })
        .catch(e => console.error(e));
    }
  },
  mounted() {
    // $("#dailyHours #adddailyHours").on('shown.bs.modal', () => {});
  }
}
</script>
<style lang="less">
#adddailyHours {
  .el-input-number--mini {
    width: 100%;
  }
}
</style>
