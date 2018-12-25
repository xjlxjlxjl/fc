<template>
  <div id="sociology">
    <el-form
      :model="companyDetail"
      ref="form"
      :rules="rules"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="企业全称" prop="name">
        <el-input v-model="companyDetail.name"></el-input>
      </el-form-item>
      <el-form-item label="企业开户银行" prop="account_bank">
        <el-input v-model="companyDetail.account_bank"></el-input>
      </el-form-item>
      <el-form-item label="对公账号" prop="bank_account_number">
        <el-input v-model="companyDetail.bank_account_number"></el-input>
      </el-form-item>
      <el-form-item label="纳税识别号" prop="pay_taxes">
        <el-input v-model="companyDetail.pay_taxes"></el-input>
      </el-form-item>
      <el-form-item label="社会信用代码" prop="social_code">
        <el-input v-model="companyDetail.social_code"></el-input>
      </el-form-item>
      <el-form-item label="法人代表" prop="legal_representative">
        <el-input v-model="companyDetail.legal_representative"></el-input>
      </el-form-item>
      <el-form-item label="注册资本" prop="registered_capital">
        <el-input v-model="companyDetail.registered_capital"></el-input>
      </el-form-item>
      <el-form-item label="成立时间" prop="build_at">
        <el-input v-model="companyDetail.build_at"></el-input>
      </el-form-item>
      <el-form-item label="有效期至" prop="end_at">
        <el-input v-model="companyDetail.end_at"></el-input>
      </el-form-item>
      <el-form-item label="登记机关" prop="registration_authority">
        <el-input v-model="companyDetail.registration_authority"></el-input>
      </el-form-item>
      <el-form-item label="公司地址" prop="address">
        <el-input v-model="companyDetail.address"></el-input>
      </el-form-item>
      <el-form-item label="资质证件" prop="company_business_license,company_industry_license">
        <el-upload
          class="avatar-uploader"
          action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
          :before-upload="buslicUpload"
          :show-file-list="false"
        >
          <img
            v-if="companyDetail.company_business_license"
            :src="companyDetail.company_business_license"
            class="avatar"
          >
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-upload
          class="avatar-uploader"
          action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
          :before-upload="indlicUpload"
          :show-file-list="false"
        >
          <img
            v-if="companyDetail.company_industry_license"
            :src="companyDetail.company_industry_license"
            class="avatar"
          >
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="uploadTips">
          <span class="el-upload__tip" slot="tip">营业执照</span>
          <span class="el-upload__tip" slot="tip">特许经营许可证</span>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "sociology",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      rules: {
        name: [{ required: true, message: "请输入企业全称", trigger: "blur" }],
        account_bank: [
          { required: true, message: "请输入企业开户银行", trigger: "blur" }
        ],
        bank_account_number: [
          { required: true, message: "请输入对公账号", trigger: "blur" }
        ],
        pay_taxes: [
          { required: true, message: "请输入纳税识别号", trigger: "blur" }
        ],
        social_code: [
          { required: true, message: "请输入社会信用代码", trigger: "blur" }
        ],
        legal_representative: [
          { required: true, message: "请输入法人代表", trigger: "blur" }
        ],
        registered_capital: [
          { required: true, message: "请输入注册资本", trigger: "blur" }
        ],
        build_at: [
          { required: true, message: "请输入成立时间", trigger: "blur" }
        ],
        end_at: [{ required: true, message: "请输入有效期", trigger: "blur" }],
        registration_authority: [
          { required: true, message: "请输入登记机关", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入公司地址", trigger: "blur" }
        ],
        company_business_license: [
          { required: true, message: "请上传营业执照", trigger: "change" }
        ],
        company_industry_license: [
          { required: true, message: "请上传特许经营许可证", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(["setStateData"]),
    buslicUpload(file) {
      this.upload(file, "company_business_license");
    },
    indlicUpload(file) {
      this.upload(file, "company_industry_license");
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
        .$get(`members/company/detail/${that.user.uesr.current_company_id}`)
        .then(response => {
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
#sociology {
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
          width: 178px;
          height: 148px;
          line-height: 148px;
          text-align: center;
        }
        .avatar {
          width: 178px;
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
