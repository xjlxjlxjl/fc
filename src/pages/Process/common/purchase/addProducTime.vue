<template>
  <div class="modal fade" id="addProducTime" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-table :data="row" border stripe>
            <el-table-column label="工时分类名称" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.name"></el-input-number>
              </template>
            </el-table-column>
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
                <el-input-number size="mini" v-model="row.subcontracte"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="来料质检（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.examination"></el-input-number>
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
                <el-input-number size="mini" v-model="row.inspection"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="打包（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.bale"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="入库（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.storage"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="发货（H）" width="150px">
              <template slot-scope="{ row }">
                <el-input-number size="mini" v-model="row.ship"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="总工时（H）">
              <template slot-scope="{ row }">
                <span>{{ (row.name || 0) + (row.billing || 0) + (row.split || 0) + (row.subcontracte || 0) + (row.examination || 0) + (row.preparation || 0) + (row.assembly || 0) + (row.inspection || 0) + (row.bale || 0) + (row.storage || 0) + (row.ship || 0) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    row: Array
  },
  methods: {
    onSubmit() {
      this
        .$post(``, this.row)
        .then(response => {
          if (response.status != 200) return false;
          this.$emit('refresh');
          $("#producTime #addProducTime").modal("hide");
        })
        .catch(e => console.error(e));
    }
  },
  mounted() {
    // $("#producTime #addProducTime").on('shown.bs.modal', () => {});
  }
}
</script>
<style lang="less">
#addProducTime {
  .el-input-number--mini {
    width: 100%;
  }
}
</style>
