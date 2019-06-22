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
            label-width="120px"
          >
            <el-form-item label="	仓库编号前缀" prop="prefix">
              <el-input v-model="form.prefix" placeholder="仓库编号前缀"></el-input>
            </el-form-item>
            <el-form-item label="仓库名称" prop="name">
              <el-input v-model="form.name" placeholder="仓库名称"></el-input>
            </el-form-item>
            <el-form-item label="仓库类型" prop="category_id">
              <el-select v-model="form.category_id" placeholder="仓库类型">
                <el-option 
                  v-for="item in $store.state.WareHouseType"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
              </el-select>              
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input type="textarea" v-model="form.description" placeholder="描述"></el-input>
            </el-form-item>
            <el-form-item label="是否启用" prop="enabled">
              <el-switch
                v-model="form.enabled"
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
        prefix: "",
        category_id: '',
        name: "",
        parent_id: 0,
        description: "",
        address: "",
        enabled: "1"
      },
      rules: {
        prefix: [{ required: true, message: "请输入仓位编号前缀", trigger: "blur" }],
        name: [{ required: true, message: "请输入仓位名称", trigger: "blur" }],
        category_id: [{ required: true, message: "请选择仓位属性", trigger: "change" }]
      }
    };
  },
  props: {
    row: Object
  },
  methods: {
    getStoreCategory() {
      if (!this.$store.state.WareHouseType.length)
        this
          .$get(`respositories/category`)
          .then(response => {
            if (response.status != 200) return false;
            this.$store.commit('setStateData', { name: 'WareHouseType', arr: response.data });
          })
          .catch(err => console.error(err));
    },
    save() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
        let url = '';
        if (this.row.slug) url = `respositories/edit/${this.row.slug}`
        else url = `respositories/create`
        this
          .$post(url, {
            prefix: this.form.prefix,
            category_id: this.form.category_id,
            parent_id: this.row.parent_id,
            name: this.form.name,
            description: this.form.description || "",
            address: this.form.address || "",
            enabled: this.form.enabled == '1' ? 1 : undefined
          })
          .then(response => {
            if(response.status != 200) return false;
            this.$emit('refresh');
            $("#manage #addPosition").modal('hide');
          })
          .catch(err => console.error(err));
      });
    }
  },
  mounted() {
    let that = this;
    $("#manage #addPosition").on("shown.bs.modal", function() {
      that.getStoreCategory();
      if (that.row.id) {
        that.form = that.row;
        that.form.category_id = that.row.category.id;
        that.form.prefix = that.row.number_prefix;
        that.form.enabled = that.row.enabled.toString();
      }
    });

    $("#manage #addPosition").on("hidden.bs.modal", function() {
      if (that.row.id)
        that.form = {
          prefix: "",
          category_id: '',
          name: "",
          parent_id: 0,
          description: "",
          address: "",
          enabled: "1"
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
        .el-select {
          width: 100%;
        }
      }
    }
  }
  .modal-footer {
    text-align: center;
  }
}
</style>
