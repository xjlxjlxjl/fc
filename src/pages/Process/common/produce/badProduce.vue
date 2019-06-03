<template>
<div>
  <div class="modal fade" id="badProduce" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <el-table :data="arr" border stripe>
          <el-table-column label="序号">
            <template slot-scope="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="material_number" label="料品编码"></el-table-column>
          <el-table-column prop="material_specification" label="料品规格"></el-table-column>
          <el-table-column prop="name" label="料品名称"></el-table-column>
          <el-table-column prop="quantity" label="数量"></el-table-column>
          <el-table-column prop="length" label="长度"></el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column prop="material_category" label="料品类别"></el-table-column>
          <el-table-column prop="material_attributes" label="料品属性"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ $index }">
              <el-button size="mini" @click="key = $index;bad = !bad">设置不良</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="bad_num" label="不良数量"></el-table-column>
          <el-table-column prop="reason" label="不良原因"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
  <div class="modal fade setmodal" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" ref="form" size="mini" label-width="80px">
            <el-form-item label="不良数量">
              <el-input v-model="form.bad_num"></el-input>
            </el-form-item>
            <el-form-item label="不良原因">
              <el-input v-model="form.reason"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button type="primary" @click="setBad(form.bad_num, form.reason)">确定</el-button>
          <el-button data-dismiss="modal" aria-label="Close">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: "badProduce",
  data() {
    return {
      bad: false,
      form: {
        bad_num: "",
        reason: "",
      }
    };
  },
  props: {
    arr: {
      type: Array
    }
  },
  methods: {
    setBad(bad_num, reason) {
      this.arr[this.key].bad_num = bad_num;
      this.arr[this.key].reason = reason;
      this.arr.push({})
      this.arr.pop();
      this.bad = !this.bad;
      this.form = {
        bad_num: "",
        reason: "",
      };
    }
  },
  watch: {
    bad(val) {
      $("#product .setmodal").modal("toggle");
    }
  }
}
</script>
<style lang="less">
#badProduce {
}
</style>
