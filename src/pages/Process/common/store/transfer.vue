<template>
  <div id="transfer" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <el-table :data="form.item" border stripe style="width: 100%;">
          <el-table-column label="序号" width="50">
            <template slot-scope="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="material.material_number" label="料品编码"></el-table-column>
          <el-table-column prop="material.material_specification" label="料品规格"></el-table-column>
          <el-table-column prop="material.name" label="料品名称"></el-table-column>
          <el-table-column prop="material.quantity" label="数量"></el-table-column>
          <el-table-column prop="material.length" label="长度"></el-table-column>
          <el-table-column prop="material.item_unit" label="单位"></el-table-column>
          <el-table-column prop="material.category_name" label="料品类别"></el-table-column>
          <el-table-column prop="car_name" label="转入物料车">
            <template slot-scope="{ row }">
              <el-select v-model="row.to_car_id">
                <el-option v-for="item in data" :key="item.id" :label="item.code" :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="join_num" label="转入数量">
            <template slot-scope="{ row }">
              <el-input v-model="row.join_num" size="mini"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary" @click="onSubmit">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "transfer",
  data() {
    return {
      form: {
        item: []
      }
    };
  },
  props: {
    arr: Array,
    data: Array,
    id: Number
  },
  methods: {
    onSubmit() {
      this
        .$post(`repositories/car/transfer_material`, {
          from_car_id: this.id,
          to_car_id: this.form.item[0].to_car_id,
          material_id: this.form.item[0].material.material_id,
          join_num: this.form.item[0].join_num
        })
        .then(response => {
          if (response.status != 200) return false;
          this.$emit('refresh');
          this.clearForm();
          $("#carManage #transfer").modal('hide');
        })
        .catch(e => console.error(e));
    },
    clearForm() {
      this.form = {
        item: []
      }
    }
  },
  mounted() {
    $("#carManage #transfer").on('shown.bs.modal', () => {
      this.form.item = this.arr;
    })
  }
}
</script>
<style lang="less">
#transfer {

}
</style>
