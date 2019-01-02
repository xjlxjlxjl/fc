<template>
  <div id="basic">
    <el-form
      :model="companyDetail"
      :rules="rules"
      ref="form"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="企业LOGO" prop="logo">
        <el-upload
          class="avatar-uploader"
          action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
          :before-upload="upload"
          :show-file-list="false"
        >
          <img v-if="companyDetail.logo" :src="companyDetail.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="企业全称" prop="name">
        <el-input v-model="companyDetail.name" placeholder="企业全称"></el-input>
      </el-form-item>
      <el-form-item label="简称" prop="short_name">
        <el-input v-model="companyDetail.short_name" placeholder="简称"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="manager">
        <el-input v-model="companyDetail.manager" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="contact_mobile">
        <el-input v-model="companyDetail.contact_mobile" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item label="座机" prop="contact_phone">
        <el-input v-model="companyDetail.contact_phone" placeholder="座机"></el-input>
      </el-form-item>
      <el-form-item label="公司官网" prop="website">
        <el-input v-model="companyDetail.website" placeholder="公司官网"></el-input>
      </el-form-item>
      <el-form-item v-if="isEdit">
        <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
        <el-button size="small" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "basic",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      isEdit: true,
      rules: {
        logo: [
          { required: true, message: "请上传企业LOGO", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入企业全称", trigger: "blur" }],
        short_name: [
          { required: true, message: "请输入简称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        manager: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        contact_mobile: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        contact_phone: [
          { required: true, message: "请输入联系人手机", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(["setStateData"]),
    upload(file) {
      let that = this,
        form = new FormData();
      form.append("upload", file);
      form.append("slug", "company_logo");
      that
        .$upload(`files/upload`, form)
        .then(response => {
          if (response.status != 200) return false;
          that.companyDetail.logo = response.data.url;
          that.companyDetail.logo_id = response.data.upload.id;
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
#basic {
  padding: 0.5rem 1.5rem;
  .el-form {
    width: 450px;
    max-width: 100%;
    .avatar-uploader {
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
          width: 148px;
          height: 148px;
          line-height: 148px;
          text-align: center;
        }
        .avatar {
          width: 148px;
          height: 148px;
          display: block;
        }
      }
    }
  }
}
</style>
