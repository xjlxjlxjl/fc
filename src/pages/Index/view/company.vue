<template>
  <div id="company">
    <el-main>
      <el-form :model="form" :rules="rules" ref="form" label-width="160px">
        <el-form-item label="企业全称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="short_name">
          <el-input v-model="form.short_name"></el-input>
        </el-form-item>
        <el-form-item label="企业银行对公账号" prop="bank_account_number">
          <el-input v-model="form.bank_account_number"></el-input>
        </el-form-item>
        <el-form-item label="对公账号开户银行" prop="account_bank">
          <el-input v-model="form.account_bank"></el-input>
        </el-form-item>
        <el-form-item label="企业纳税识别号" prop="pay_taxes">
          <el-input v-model="form.pay_taxes"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人" prop="legal_representative">
          <el-input v-model="form.legal_representative"></el-input>
        </el-form-item>
        <el-form-item label="注册资金" prop="registered_capital">
          <el-input v-model="form.registered_capital"></el-input>
        </el-form-item>
        <el-form-item label="企业注册日期" prop="build_at">
          <el-date-picker v-model="form.build_at" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="营业期限至" prop="end_at">
          <el-date-picker v-model="form.end_at" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="登记机关" prop="registration_authority">
          <el-input v-model="form.registration_authority"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="manager">
          <el-input v-model="form.manager"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contact_phone">
          <el-input v-model="form.contact_phone"></el-input>
        </el-form-item>
        <el-form-item label="联系手机" prop="contact_mobile">
          <el-input v-model="form.contact_mobile"></el-input>
        </el-form-item>
        <el-form-item label="是否特许经营企业" prop="company_industry_license_id">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :before-upload="industryUpload"
          >
            <img v-if="company_industry_license" :src="company_industry_license" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="营业执照" prop="company_business_license_id">
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :before-upload="companyUpload"
          >
            <img v-if="company_business_license" :src="company_business_license" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="onSubmit">认证公司</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <index-chart></index-chart>
  </div>
</template>
<script>
import indexChart from "@/pages/Index/common/indexChart";
// import "http://api.map.baidu.com/api?v=2.0&ak=${this.$store.state.apiKeys.baiduMap}";

export default {
  name: "company",
  data() {
    return {
      form: {
        name: "",
        short_name: "",
        manager: "",
        contact_mobile: "",
        contact_phone: "",
        address: "",
        legal_representative: "",
        registration_authority: "",
        account_bank: "",
        bank_account_number: "",
        pay_taxes: ""
      },
      company_industry_license: "",
      company_business_license: "",
      rules: {
        name: [
          { required: true, message: "请输入企业名称", trigger: "blur" },
          { min: 3, max: 39, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        short_name: [
          { required: true, message: "请输入企业简称", trigger: "blur" }
        ],
        bank_account_number: [
          { required: true, message: "请输入企业对公账户", trigger: "blur" }
        ],
        account_bank: [
          { required: true, message: "请输入企业开户银行", trigger: "blur" }
        ],
        pay_taxes: [
          { required: true, message: "请输入企业纳税识别号", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入公司地址", trigger: "blur" }
        ],
        legal_representative: [
          { required: true, message: "请输入企业法人", trigger: "blur" }
        ],
        registration_authority: [
          { required: true, message: "请输入登记机关", trigger: "blur" }
        ],
        manager: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contact_phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        contact_mobile: [
          { required: true, message: "请输入联系手机", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    industryUpload(file) {
      this.upload(file, "company_industry_license");
      // company_industry_license_id
    },
    companyUpload(file) {
      this.upload(file, "company_business_license");
      // company_business_license_id
    },
    upload(file, state) {
      let form = new FormData(),
        that = this;
      form.append("upload", file);
      form.append("slug", "company_logo");
      that
        .$upload(`files/upload`, form)
        .then(response => {
          if (response.status != 200) return false;
          that[state] = response.data.url;
          that.form[`${state}_id`] = response.data.upload.id;
        })
        .catch(err => {});
    },
    onSubmit() {
      let myGeo = new BMap.Geocoder(),
        that = this,
        loading = this.$loading({ lock: true });
      this.$refs["form"].validate(v => {
        if (!v) {
          loading.close();
          return false;
        }
        myGeo.getPoint(
          this.form.address,
          point => {
            if (point) {
              this.form.region = {
                address: this.form.address,
                x: point.lng,
                y: point.lat
              };
              if (this.form.build_at)
                this.form.build_at = this.dateParse(this.form.build_at);
              if (this.form.end_at)
                this.form.end_at = this.dateParse(this.form.end_at);
              that
                .$post(`members/company/create`, that.form)
                .then(response => {
                  loading.close();
                  if (response.status != 200) return false;
                  that.$message({
                    message: "提交成功，请等待审核结束",
                    type: "success"
                  });
                })
                .catch(err => loading.close());
            } else {
              loading.close();
              this.$message({ message: "请将地址填写清晰谢谢", type: "error" });
              return false;
            }
          },
          "深圳市"
        );
      });
    }
  },
  components: {
    "index-chart": indexChart
  }
};
</script>
<style lang="less">
@white: #ffffff;
@gery: #e6e6e6;
@background: #f2f2f2;
@borderBlod: 1rem solid @background;
@border: 1px solid @background;
#company {
  width: 1280px;
  max-width: 100%;
  height: 87%;
  background-color: @white;
  margin: 1.5rem auto;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  .el-form {
    width: 500px;
    max-width: 100%;
    margin: 6rem auto;
    .el-form-item {
      .el-date-editor {
        width: 100%;
      }
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
  }
}
</style>
