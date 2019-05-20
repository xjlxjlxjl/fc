<template>
  <div id="addNonstandardModal" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="110px">
            <el-form-item label="询价模板名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <p class="lead widthFull">询价人资料（为默认字段，只作展示作用）</p>
            <el-form-item label="客户公司名" prop="customer_company_name">
              <el-input v-model="form.customer_company_name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contract">
              <el-input v-model="form.contract" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="form.mobile" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input v-model="form.position" :disabled="true"></el-input>
            </el-form-item>
            <p class="lead widthFull">询价产品资料（为默认字段，只作展示作用）</p>
            <el-form-item label="需求描述" prop="desc" class="widthFull">
              <el-input type="textarea" v-model="form.desc" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="需求附件" prop="file">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :file-list="form.file"
                list-type="picture">
                <el-button size="small" type="primary" :disabled="true">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <p class="lead widthFull">自定义询价字段</p>
          </el-form>
          <el-table :data="form.items" border stripe>
            <el-table-column label="字段名称（单位）" width="300">
              <template slot-scope="{ row }">
                <el-input v-model="row.label" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="字段值样式" width="550">
              <template slot-scope="{ row }">
                <el-radio-group v-model="row.type">
                  <el-radio :label="1">文本输入框</el-radio>
                  <el-radio :label="2">单选值</el-radio>
                  <el-radio :label="3">多选值</el-radio>
                  <el-radio :label="4">下拉选择列表</el-radio>
                  <el-radio :label="5">多行文本框</el-radio>
                  <el-radio :label="6">文件</el-radio>
                </el-radio-group>
                <el-input v-if="row.type == 1" size="mini" placeholder="请输入"></el-input>
                <el-radio-group v-else-if="row.type == 2" v-model="s">
                  <el-radio value="1">备选项1</el-radio>
                  <el-radio value="2">备选项2</el-radio>
                  <el-radio value="3">备选项3</el-radio>
                  <el-input size="mini" placeholder="请输入"></el-input>
                </el-radio-group>
                <el-checkbox-group v-else-if="row.type == 3" v-model="s">
                  <el-checkbox value="1" label="复选框 A"></el-checkbox>
                  <el-checkbox value="2" label="复选框 B"></el-checkbox>
                  <el-checkbox value="3" label="复选框 C"></el-checkbox>
                  <el-input size="mini" placeholder="请输入"></el-input>
                </el-checkbox-group>
                <el-select v-else-if="row.type == 4" v-model="s" size="mini">
                  <el-option value="3" label="选项1"></el-option>
                  <el-option value="2" label="选项2"></el-option>
                  <el-option value="1" label="选项3"></el-option>
                </el-select>
                <el-input v-else-if="row.type == 5" type="textarea" v-model="s" size="mini" placeholder="请输入"></el-input>
                <div v-else-if="row.type == 6"><el-button type="primary" size="mini">点击上传</el-button></div>
              </template>
            </el-table-column>
            <el-table-column label="字段值">
              <template slot-scope="{ row }">
                <el-input v-if="row.type == 1" v-model="row.value" size="mini" placeholder="请输入"></el-input>
                <el-input v-else-if="row.type == 2" type="textarea" v-model="row.value" placeholder="请输入单选值，每行一个"></el-input>
                <el-input v-else-if="row.type == 3" type="textarea" v-model="row.value" placeholder="请输入多选值，每行一个"></el-input>
                <el-input v-else-if="row.type == 4" type="textarea" v-model="row.value" placeholder="请输入下拉选择列表，每行一个"></el-input>
                <el-input v-else-if="row.type == 5" type="textarea" v-model="row.value" size="mini" placeholder="请输入"></el-input>
                <el-button v-else-if="row.type == 6" type="primary" size="mini">点击上传</el-button>
              </template>
            </el-table-column>
            <el-table-column width="90">
              <template slot-scope="{ $index }">
                <el-button type="text" @click="form.items.splice($index + 1, 0, { type: 1 })">
                  <i class="el-icon-circle-plus-outline" style="font-size: 2.1rem;"></i>
                </el-button>
                <el-button type="text" @click="form.items.splice($index, 1)">
                  <i class="el-icon-remove-outline" style="font-size: 2.1rem;"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="modal-footer">
          <el-button size="mini" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>     
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addNonstandardModal",
  data() {
    return {
      form: {
        name: "",
        customer_company_name: "",
        contract: "",
        mobile: "",
        position: "",
        desc: "",
        file: [],
        items: [{ type: 1 }]
      },
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
      },
      // 设置默认值
      s: ''
    };
  },
  props: {
    row: Object
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate(v => {
        if (!v) return false;
        let arr = this.form.items, url = '';
        for (let e of arr) {
          if (e.type != 1 && e.type != 5 && e.type != 6) {
            let cat = e.value.split("\n") || [];
            e.value = cat.filter(v => {
              if(v) return v
            });
          } else e.value = e.value || "";
          e.slug = this.random(4);
        }

        if (this.row.id) url = `orders/inquiry-template/edit/${this.row.id}`;
        else url = `orders/inquiry-template/create`;

        this
          .$post(url, {
            name: this.form.name,
            data: JSON.stringify(arr)
          })
          .then(response => {
            if (response.status != 200) return false;
            this.$emit("refresh");
            $("#nonstandardModal #addNonstandardModal").modal("hide");
            this.clearForm();
          })
          .catch(e => console.error(e));
      });
    },
    clearForm() {
      this.form = {
        name: "",
        customer_company_name: "",
        contract: "",
        mobile: "",
        position: "",
        desc: "",
        file: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        items: [{ type: 1 }]
      }
    }
  },
  mounted() {
    $('#nonstandardModal #addNonstandardModal').on('shown.bs.modal', () => {
      if (this.row.id) {
        this.form = {
          name: this.row.name,
          items: []
        };
        for (let e of this.row.data) {
          let str = '';
          if (e.type == 2 || e.type == 3 || e.type == 4)
            str = e.value.join("\n")
          else str = e.value || "";
          this.form.items.push({
            label: e.label,
            slug: e.slug,
            type: e.type,
            value: str
          })
        }
      }
    })
  }
};
</script>
<style lang="less">
#addNonstandardModal {
  .modal-body {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 25%;
        .el-upload {
          input[type=file] {
            display: none;
          }
        }
        .el-upload-list {
          width: 300px;
        }
      }
      .lead {
        padding-bottom: 10px;
        border-bottom: 1px solid #c5c5c5;
      }
      .widthFull {
        width: 100%;
      }
    }
    .el-table {
      .el-table__body-wrapper {
        .el-table__body {
          tbody {
            .el-table__row {
              td {
                &:nth-child(2) {
                  .cell {
                    display: flex;
                    .el-radio-group {
                      width: 150px;
                      label {
                        display: block;
                        margin-left: 0;
                      }
                    }
                    .el-input {
                      max-width: 200px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
