<template>
  <div class="modal fade" id="editPriority" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <p class="text-center">订单号: {{ row.order_number }}</p>
          <el-form :model="form" ref="form" label-width="160px">
            <el-form-item label="出货计划交期">
              <el-date-picker size="mini" v-model="form.delivery_period_at" value-format="yyyy-MM-dd" type="date" placeholder="选择日期时间"></el-date-picker>              
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer" style="text-align: center;">
          <el-button size="mini" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "editPriority",
  data() {
    return {
      form: {
        delivery_period_at: ""
      }
    };
  },
  props: {
    row: {
      type: Object,
    }
  },
  methods: {
    onSubmit() {
      this
        .$post(`produces/plan/sort`, {
          id: this.row.id,
          delivery_period_at: this.form.delivery_period_at
        })
        .then(response => {
          if (response.status != 200) return false;
          this.form.delivery_period_at = "";
          $("#plan #editPriority").modal("hide");
        })
        .catch(e => console.error(e));
    }
  }
}
</script>
<style lang="less">
#editPriority {
}
</style>
