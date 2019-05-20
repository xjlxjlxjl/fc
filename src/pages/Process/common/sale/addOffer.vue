<template>
  <div id="addOffer" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content modal-lg">
        <div class="modal-body">
          <el-form :model="form" ref="form" label-width="80px" size="mini">
            <el-form-item label="产品型号">
              <el-input v-model="form.product_model"></el-input>
            </el-form-item>
            <el-form-item label="价格">
              <el-input v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="交期">
              <el-date-picker v-model="form.delivery_period" type="date" value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item label="附件">
              <el-upload
                action="a"
                :before-upload="upload"
                :on-remove="remove"
                :file-list="fileList"
                list-type="picture">
                <el-button size="mini" type="primary">上传</el-button>
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
      form: {
        inquiry_price_id: 0,
        product_model: "",
        price: "",
        delivery_period: "",
        file_ids: [],
        remark: ""
      },
      fileList: []
    };
  },
  props: {
    row: Object
  },
  methods: {
    upload(file) {
      let form = new FormData();
      form.append("upload", file);
      form.append("slug", "non_standard_requirements");

      this
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          this.fileList.push({
            name: file.name,
            uid: response.data.upload.id,
            url: response.data.url
          });
          this.form.file_ids.push(response.data.upload.id);
        })
        .catch(err => console.error(err));
    },
    onSubmit() {
      if (typeof this.form.file_ids == 'object')
        this.form.file_ids = this.form.file_ids.join(',');
      this.form.inquiry_price_id = this.row.id;
      this
        .$post(`orders/quoted-price/create`, this.form)
        .then(response => {
          if (response.status != 200) return false;
          this.$emit('refresh');
          $("#nonstandard #addOffer").modal("hide");
          this.clearForm();
        })
        .catch(e => console.error(e));
    },
    clearForm() {
      this.form = {
        inquiry_price_id: 0,
        product_model: "",
        price: "",
        delivery_period: "",
        file_ids: [],
        remark: ""
      };
      this.fileList = [];
    },
    remove(file, fileList) {
      this.fileList = fileList;
      this.form.file_ids = [];
      for (let v of fileList)
        this.form.file_ids.push(v.uid)
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
