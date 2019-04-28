<template>
  <div id="addNonstandardModal" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="110px">
            <el-form-item label="询价模板名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <p class="lead widthFull">询价人资料</p>
            <el-form-item label="客户公司名" prop="customer_company_name">
              <el-input v-model="form.customer_company_name"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="contract">
              <el-input v-model="form.contract"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="职位" prop="position">
              <el-input v-model="form.position"></el-input>
            </el-form-item>
            <p class="lead widthFull">询价产品资料</p>
            <el-form-item label="需求描述" prop="desc" class="widthFull">
              <el-input v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="需求附件" prop="file">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-remove="handleRemove"
                :file-list="form.file"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <p class="lead widthFull">自定义询价字段</p>
          </el-form>
          <el-table :data="form.items" border stripe>
            <el-table-column label="字段名称（单位）">
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
                </el-radio-group>
                <el-input v-if="row.type == 1" v-model="row.value" size="mini" placeholder="请输入"></el-input>
                <el-radio-group v-else-if="row.type == 2" v-model="row.value">
                  <el-radio>备选项</el-radio>
                  <el-radio>备选项</el-radio>
                  <el-radio>备选项</el-radio>
                </el-radio-group>
                <el-checkbox-group v-else-if="row.type == 3" v-model="row.value">
                  <el-checkbox label="复选框 A"></el-checkbox>
                  <el-checkbox label="复选框 B"></el-checkbox>
                  <el-checkbox label="复选框 C"></el-checkbox>
                </el-checkbox-group>
                <el-select v-else-if="row.type == 4" v-model="row.value" size="mini">
                  <el-option label="选项1"></el-option>
                  <el-option label="选项2"></el-option>
                  <el-option label="选项3"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="字段值">
              <template slot-scope="{ row }">
                <el-input v-if="row.type == 1" v-model="row.value" size="mini" placeholder="请输入"></el-input>
                <el-input v-else-if="row.type == 2" type="textarea" v-model="row.value" placeholder="请输入单选值，每行一个"></el-input>
                <el-input v-else-if="row.type == 3" type="textarea" v-model="row.value" placeholder="请输入多选值，每行一个"></el-input>
                <el-input v-else-if="row.type == 4" type="textarea" v-model="row.value" placeholder="请输入下拉选择列表，每行一个"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="90">
              <template slot-scope="{ $index }">
                <el-button type="text" @click="form.items.splice($index, 0, {})">
                  <i class="el-icon-circle-plus-outline" style="font-size: 2.1rem;"></i>
                </el-button>
                <el-button type="text" @click="form.items.splice($index, 1)">
                  <i class="el-icon-remove-outline" style="font-size: 2.1rem;"></i>
                </el-button>
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
        file: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
        items: [{}]
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        customer_company_name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        contract: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入活动名称', trigger: 'blur' }]
      }
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
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
      }
      .lead {
        padding-bottom: 10px;
        border-bottom: 1px solid #c5c5c5;
      }
      .widthFull {
        width: 100%;
      }
    }
  }
}
</style>
