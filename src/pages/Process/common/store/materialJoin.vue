<template>
  <div id="materialJoin" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" ref="form" label-width="100px">
            <el-form-item label="选择物料车">
              <el-select v-model="str" @change="change">
                <el-option v-for="(item, index) in form.item"
                  :key="item.id"
                  :label="item.car_name"
                  :value="index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <el-table :data="list" border stripe>
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
            <el-table-column prop="car_name" label="当前物料车"></el-table-column>
            <el-table-column prop="join_num" label="转入数量">
              <template slot-scope="{ row }">
                <el-input v-model="row.join_num" size="mini"></el-input>                
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
          <button type="button" class="btn btn-primary" @click="onSubmit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "materialJoin",
  data() {
    return {
      form: {
        item: []
      },
      str: "",
      list: []
    };
  },
  props: {
    arr: Array,
    id: Number
  },
  methods: {
    change(val) {
      this.list = this.form.item[val].material.map(e => {
        return {
          car_name: this.form.item[val].car_name,
          from_car_id: this.form.item[val].from_car_id,
          join_num: this.form.item[val].join_num,
          material: {
            material_id: e.material_id,
            category_name: e.category_name,
            item_unit: e.item_unit,
            length: e.length,
            material_number: e.material_number,
            material_specification: e.material_specification,
            name: e.name,
            quantity: e.quantity,
          }
        }
      })
    },
    onSubmit() {
      this.list.forEach((e, k) => {
        this
          .$post(`repositories/car/transfer_material`, {
            from_car_id: e.from_car_id,
            to_car_id: this.id,
            material_id: e.material.material_id,
            join_num: e.join_num
          })
          .then(response => {
            if (response.status != 200) return false;
            if (k == this.list.length - 1) {
              this.$emit('refresh');
              this.clearForm();
              $("#carManage #materialJoin").modal("hide");
            }
          })
          .catch(e => console.error(e));
      })
    },
    clearForm() {
      this.form = {
        item: []
      };
      this.str = "";
      this.list = [];
    }
  },
  mounted() {
    $("#carManage #materialJoin").on('shown.bs.modal', () => {
      this.form.item = this.arr.map(e => {
        let arr = e.material.map(v => {
          return {
            material_id: v.id,
            material_number: v.material_number,
            material_specification: v.material_specification,
            name: v.name,
            quantity: v.quantity,
            length: v.length,
            item_unit: v.item_unit,
            category_name: v.category_name
          };
        })
        return {
          material: arr,
          from_car_id: e.id,
          car_name: e.code,
          join_num: '',
        }
      })
    })
    $("#carManage #materialJoin").on('hidden.bs.modal', () => this.clearForm())
  }
}
</script>
<style lang="less">
#materialJoin {

}
</style>
