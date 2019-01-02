<template>
  <div id="enterprise">
    <el-form :model="companyDetail" ref="form" label-position="left" label-width="120px">
      <el-form-item label="企业公章" prop="company_seal">
        <el-upload
          class="avatar-uploader"
          action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
          :before-upload="companyUpload"
          :show-file-list="false"
        >
          <img v-if="companyDetail.company_seal" :src="companyDetail.company_seal" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="合同章" prop="contract_seal">
        <el-upload
          class="avatar-uploader"
          action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
          :before-upload="contractUpload"
          :show-file-list="false"
        >
          <img v-if="companyDetail.contract_seal" :src="companyDetail.contract_seal" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="财务章" prop="finance_seal">
        <el-upload
          class="avatar-uploader"
          action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
          :before-upload="financeUpload"
          :show-file-list="false"
        >
          <img v-if="companyDetail.finance_seal" :src="companyDetail.finance_seal" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </el-form-item>-->
    </el-form>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "enterprise",
  data() {
    return {
      isEdit: true,
      user: JSON.parse(localStorage.getItem("user")),
      rules: {
        company_seal: [
          { required: true, message: "请上传企业公章", trigger: "change" }
        ],
        contract_seal: [
          { required: true, message: "请上传合同章", trigger: "change" }
        ],
        finance_seal: [
          { required: true, message: "请上传财务章", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(["setStateData"]),
    companyUpload(file) {
      this.upload(file, "company_seal");
    },
    contractUpload(file) {
      this.upload(file, "contract_seal");
    },
    financeUpload(file) {
      this.upload(file, "finance_seal");
    },
    upload(file, name) {
      let that = this,
        form = new FormData();
      form.append("upload", file);
      form.append("slug", "company_logo");
      that
        .$upload(`files/upload`, form)
        .then(response => {
          if (response.status != 200) return false;
          that.companyDetail[name] = response.data.url;
          that.companyDetail[`${name}_id`] = response.data.upload.id;
          that.onSubmit();
        })
        .catch(err => {});
    },
    onSubmit() {
      let that = this;
      this.$refs["form"].validate(valid => {
        if (!valid) return false;
        that
          .$post(
            `members/company/edit/${that.user.user.current_company_id}`,
            that.companyDetail
          )
          .then(response => {
            if (response.status != 200) return false;
            that.setStateData({
              name: "companyDetail",
              arr: that.companyDetail
            });

            that.$message({ message: "保存成功", type: "success" });
          })
          .catch(err => {});
      });
    },
    resetForm() {
      this.$refs["form"].resetFields();
    },
    getCompany() {
      if (this.companyDetail.name) return false;
      let that = this;
      that
        .$get(`members/company/detail/${that.user.user.current_company_id}`)
        .then(response => {
          if (response.status == 503) this.isEdit = false;
          if (response.status != 200) return false;
          that.setStateData({ name: "companyDetail", arr: response.data });
        })
        .catch(err => {});
    }
  },
  computed: mapState(["companyDetail"]),
  created() {
    this.getCompany();
  }
};
</script>
<style lang="less">
#enterprise {
  padding: 0.5rem 1.5rem;
  .el-form {
    width: 484px;
    max-width: 100%;
    .avatar-uploader {
      display: inline;
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409eff;
        }
        .el-upload__input {
          display: none;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 278px;
          height: 148px;
          line-height: 148px;
          text-align: center;
        }
        .avatar {
          width: 278px;
          height: 148px;
          display: block;
        }
      }
    }
    .uploadTips {
      display: flex;
      > span {
        display: block;
        width: 50%;
        margin-top: -0.5rem;
        padding-left: 0.5rem;
        line-height: 1.2;
      }
    }
  }
}
</style>
