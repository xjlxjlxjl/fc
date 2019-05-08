<template>
  <div id="addOffer" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content modal-lg">
        <div class="modal-body">
          <el-form :model="form" ref="form" label-width="80px" size="mini">
            <el-form-item label="产品型号">
              <el-input v-model="form.model"></el-input>
            </el-form-item>
            <el-form-item label="价格">
              <el-input v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="交期">
              <el-date-picker v-model="form.date" type="date" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item label="附件">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-remove="handleRemove"
                :file-list="fileList"
                list-type="picture">
                <el-button size="mini" type="info">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button size="mini" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">立即创建</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addOffer",
  data() {
    return {
      form: {},
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    };
  },
  methods: {
    onSubmit() {
      console.log(this.form)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    }
  }
};
</script>
<style lang="less">
#addOffer {
  .modal-content {
    .modal-body {
      .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          &:first-child,
          &:nth-child(2),
          &:nth-child(3) {
            width: 33.33%
          }
          &:nth-child(4),
          &:last-child{
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
          }
          .el-upload {
            input[type=file] {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
