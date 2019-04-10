<template>
  <div class="modal fade" id="addPosition" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form
            label-position="left"
            :model="form"
            :rules="rules"
            ref="form"
            size="mini"
            label-width="80px"
          >
            <el-form-item label="仓库编号" prop="number">
              <el-input v-model="form.number" placeholder="仓库编号"></el-input>
            </el-form-item>
            <el-form-item label="仓库名称" prop="name">
              <el-input v-model="form.name" placeholder="仓库名称"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="describe">
              <el-input type="textarea" v-model="form.describe" placeholder="描述"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="switch">
              <el-switch
                v-model="form.switch"
                active-color="#13ce66"
                active-value="1"
                inactive-color="#ff4949"
                inactive-value="0"
                active-text="启用"
                inactive-text="不启用"
              ></el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button type="primary" size="mini" @click="save">保存</el-button>
          <el-button type="info" size="mini" data-dismiss="modal">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "addPosition",
  data() {
    return {
      form: {
        number: "",
        name: "",
        describe: "",
        switch: "1"
      },
      rules: {
        number: [
          { required: true, message: "请输入仓库编号", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }]
      }
    };
  },
  props: {
    row: Object
  },
  methods: {
    save() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
        console.log(this.form);
      });
    }
  },
  mounted() {
    let that = this;
    $("#manage #addPosition").on("shown.bs.modal", function() {
      if (that.row.id) that.form = that.row;
    });

    $("#manage #addPosition").on("hidden.bs.modal", function() {
      if (that.row.id)
        that.form = {
          number: "",
          name: "",
          describe: "",
          switch: "1"
        };
    });
  }
};
</script>

<style lang="less">
#addPosition {
  .modal-body {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .el-form-item {
        width: 48%;
        .el-textarea {
          textarea {
            resize: unset;
          }
        }
      }
    }
  }
  .modal-footer {
    text-align: center;
  }
}
</style>
