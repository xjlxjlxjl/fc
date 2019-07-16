<template>
  <div>
    <div class="modal fade" id="addPrepare" role="dialog">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
         <el-table :data="receive_id" border stripe>
            <el-table-column prop="material_info.material_number" label="物料编码"></el-table-column>
            <el-table-column prop="material_info.material_specification" label="物料规格"></el-table-column>
            <el-table-column prop="material_info.name" label="物料名称"></el-table-column>
            <el-table-column prop="material_info.material_quality" label="数量"></el-table-column>
            <el-table-column prop="material_info.respository_name" label="仓库">
              <template slot-scope="{}">原材料仓</template>
            </el-table-column>
            <el-table-column prop="material_info.quantity" label="可用数量"></el-table-column>
            <el-table-column prop="material_info.unit" label="单位"></el-table-column>
            <el-table-column prop="material_info.respository_name" label="转入仓库"></el-table-column>
            <el-table-column label="物料车编号">
              <template slot-scope="{row}">
                <el-select size="mini" v-model="row.carid">
                  <el-option v-for="e in car" :key="e.id" :label="e.name" :value="e.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="备料数量">
              <template slot-scope="{row}">
                <el-input v-model="row.prepare_quantity" size="mini"></el-input>
              </template>
            </el-table-column>
          </el-table>
          <div class="modal-footer">
            <button class="btn btn-primary btn-sm" @click="onSubmit">确定</button>
            <button class="btn btn-default btn-sm" data-dismiss="modal" aria-label="Close">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addPrepare",
  data() {
    return {
      car: []
    };
  },
  props: {
    receive_id: {
      type: Array
    }
  },
  methods: {
    getCar() {
      this
        .$get(`repositories/car/all`)
        .then(response => {
          if (response.status != 200) return false;
          this.car = response.data.list;
        })
        .catch(e => console.error(e));
    },
    onSubmit() {
      const data = this.receive_id[0];
      this
        .$post(`repositories/car/lock/${data.carid}`, {
          receive_id: data.receive_id,
          material_id: data.material_info.id,
          prepare_quantity: data.prepare_quantity
        })
        .then(response => {
          if (response.status != 200) return false;
          this.$emit("refresh");
          $("#addPrepare").modal("hide");
        })
        .catch(e => console.error(e));
    }
  },
  mounted() {
    this.getCar();
    $("#applyMateriel #addPrepare").on("shown.bs.modal", () => console.log(this.receive_id));
  }
}
</script>
<style lang="less">
#addPrepare {
  .el-table {
    td {
      &:nth-child(17) {
        padding: 0;
        .cell {
          padding: 0;
          .materialsType {
            display: flex;
            > div {
              white-space: nowrap;
              width: 100px;
              height: 50px;
              line-height: 50px;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .condition {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    > div {
      display: flex;
      align-items: center;
      button,
      span {
        white-space: nowrap;
        margin-right: 5px;
      }
    }
  }
}
</style>
