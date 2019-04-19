<template>
  <div id="createdReport" class="modal fade">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body" id="reportBody">
          <el-form :model="form" :rules="rules" ref="form" label-width="100px">
            <el-form-item label="客服人员" prop="customer_name">
              <el-input v-model="form.customer_name"></el-input>
            </el-form-item>
            <el-form-item label="责任方">
              <el-select v-model="form.organization">
                <el-option label="厂内" value="item.value"></el-option>
                <el-option label="客户" value="item.value"></el-option>
                <el-option label="无法判定" value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="不良原因分析">
              <el-input v-model="form.analysis"></el-input>
            </el-form-item>
            <el-form-item label="处理方案">
              <el-input v-model="form.content"></el-input>
            </el-form-item>
            <el-form-item label="图片" class="fileList">
              <el-upload
                action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                list-type="picture-card"
                :before-upload="upload"
                :before-remove="remove"
                :file-list="form.fileUrl"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button size="mini" type="primary" @click="commit">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "createdReport",
  data() {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      form: {
        customer_name: "",
        customer_linkman: "",
        customer_mobile: "",
        specification: "",
        quantity: 1,
        description: "",
        analysis: "",
        content: "",
        organization: "客户",
        advice: "",
        service_at: "",
        service_id: user.user.id,
        file_ids: [],
        fileUrl: []
      },
      rules: {
        customer_name: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        customer_linkman: [
          { required: true, message: "请输入客户联系人", trigger: "blur" }
        ],
        customer_mobile: [
          { required: true, message: "请输入联系人手机", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "请输入产品型号", trigger: "blur" }
        ],
        service_at: [
          { required: true, message: "请输入服务时间", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    active: Object
  },
  methods: {
    upload(file) {
      let form = new FormData(),
        that = this;
      form.append("slug", "customer_service");
      form.append("upload", file);
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          that.form.fileUrl.push({
            name: file.name,
            url: response.data.url
          });
          that.form.file_ids.push(response.data.upload.id);
        })
        .catch(err => console.error(err));
    },
    remove(item) {
      this.form.fileUrl.forEach((e, k) => {
        if (e.uid == item.uid) {
          this.form.file_ids.splice(k, 1);
          this.form.fileUrl.splice(k, 1);
        }
      });
    },
    commit() {
      let that = this,
        self = that.form;
      that.$refs["form"].validate(v => {
        if (!v) return false;
        that
          .$post(`service/report/create`, {
            number: this.active.product_number,
            customer_name: self.customer_name,
            customer_linkman: self.customer_linkman,
            customer_mobile: self.customer_mobile,
            specification: self.specification,
            quantity: self.quantity,
            description: self.description,
            analysis: self.analysis,
            content: self.content,
            organization: self.organization,
            advice: self.advice,
            service_at: self.service_at,
            service_id: this.active.id,
            file_ids: self.file_ids.join(",")
          })
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.clearForm();
          })
          .catch(err => {});
      });
    },
    clearForm() {
      this.$refs["form"].resetFields();
    },
    close() {
      this.$store.commit("changeModal", "createdReportModal");
    }
  }
};
</script>
<style lang="less">
#createdReport {
  z-index: 1055;
  #reportBody {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        &:nth-child(1),
        &:nth-child(2) {
          width: 50%;
        }
      }
      .widthFull {
        width: 100%;
      }
    }
    .fileList {
      width: 100%;
      padding-bottom: 0.5rem;
      max-width: none;
      .el-upload--picture-card {
        width: 90px;
        height: 90px;
        line-height: 102px;
        .el-upload__input {
          opacity: 0;
          display: none;
        }
      }
      .el-upload-list {
        .el-upload-list__item {
          width: 90px;
          height: 90px;
        }
      }
    }
  }
}
</style>