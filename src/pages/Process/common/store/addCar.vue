<template>
  <div id="addCar" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" ref="form" :rules="rule" size="mini" label-position="left" label-width="110px">
            <el-form-item prop="code" label="物料车编号">
              <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item prop="remark" label="备注">
              <el-input v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item prop="is_enable" label="是否启用">
              <el-radio-group v-model="form.is_enable">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button size="mini" type="info" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addCar",
  data() {
    return {
      form: {
        code: '',
        remark: '',
        is_enable: 1
      },
      rule: {
        code: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      }
    };
  },
  props: {
    row: Object
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate(v => {
        if (!v) return false;
        let url = '';
        if (this.row.id) url = `repositories/car/edit/${this.row.id}`;
        else url = `repositories/car/create`;
        this
          .$post(url, this.form)
          .then(response => {
            if (response.status != 200) return false;
            this.$emit("refresh");
            $("#carManage #addCar").modal("hide");
          })
          .catch(e => console.error(e));
      })
    }
  },
  mounted() {
    let that = this;
    $("#carManage #addCar").on("shown.bs.modal", function() {
      if (that.row.id)
        that.form = that.row;
      else 
        that.form = {
          code: '',
          remark: '',
          is_enable: 1
        }
    });
  }
}
</script>
<style lang="less">
#addCar {
}
</style>
