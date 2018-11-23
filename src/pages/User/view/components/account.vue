<template>
  <div id="account">
    <el-form :label-position="labelPosition" label-width="100px" :model="formData">
      <el-container>
        <el-row>
          <el-col :md="12" :xs="24">
            <el-form-item label="昵称">
              <el-input v-model="formData.display_name"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="formData.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="真实姓名">
              <el-input v-model="formData.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="身份证号码">
              <el-input v-model="formData.id_card" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="formData.email" disabled></el-input>
            </el-form-item>
            <el-form-item label="部门" v-if="user.user.login_type == 2">
              <el-input v-model="formData.branch" disabled></el-input>
            </el-form-item>
            <el-form-item label="职务" v-if="user.user.login_type == 2">
              <el-input v-model="formData.position" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="12" :xs="24">
            <el-form-item label="我的头像">
              <el-upload
                class="avatar-uploader"
                action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload">
                <img v-if="formData.avatar" :src="formData.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="我的二维码">
              <div id="qrcode"></div>
            </el-form-item>
            <el-form-item label="公司名称" v-if="user.user.login_type == 2">
              <el-input v-model="formData.company" disabled></el-input>
            </el-form-item>
            <el-form-item label="公司地址" v-if="user.user.login_type == 2">
              <el-input v-model="formData.company_address" disabled></el-input>
            </el-form-item>
            <el-form-item label="公司代码" v-if="user.user.login_type == 2">
              <el-input v-model="formData.company_slug" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-button type="primary" @click="save">提交</el-button>
          </el-col>
        </el-row>
      </el-container>
    </el-form>
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  name: "account",
  data() {
    return {
      baseUrl: baseUrl,
      labelPosition: "right",
      user: JSON.parse(localStorage.getItem("user")) || {
        user: { qrcode: "未登录" }
      },
      formData: {}
    };
  },
  methods: {
    beforeAvatarUpload(file) {
      let form = new FormData(),
        that = this;
      form.append("upload", file);
      form.append("type", "avatar");
      that.$upload("members/user/file-upload", form).then(response => {
        if (response.status != 200) return false;
        that
          .$post("members/user/edit-info", { avatar: response.data.url })
          .then(result => {
            if (result.status != 200) return false;
            that.formData.avatar = response.data.url;
            that.$message({ message: response.message, type: "success" });
          })
          .catch(err => console.error(err));
      });
    },
    save() {
      let that = this,
        loading = this.$loading({ lock: true });
      this.$post("members/user/edit-info", {
        display_name: that.formData.display_name,
        avatar: that.formData.avatar
      })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$message({ message: response.message, type: "success" });
        })
        .catch(error => loading.close());
      loading.close();
    },
    getQrcode() {
      let that = this;
      QRCode.toString(
        that.user.user.qrcode,
        (err, string) => (document.getElementById("qrcode").innerHTML = string)
      );
    }
  },
  created() {
    let that = this,
      loading = this.$loading({ lock: true });
    this.$get("members/user")
      .then(response => {
        loading.close();
        if (response.status != 200) return false;
        that.formData = response.data;
        that.getQrcode();
      })
      .catch(error => loading.close());
  }
};
</script> 
<style lang="less">
@gery: #f3f4f7;
#account {
  padding: 0 2rem;
  color: #666666;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  margin: auto;
  .el-row {
    width: 100%;
    .el-col {
      padding: 0 1rem;
      text-align: center;
      .el-form-item {
        .avatar-uploader {
          .el-upload {
            border-radius: 0.6rem;
            border: 1px dashed #666666;
            position: relative;
            cursor: pointer;
            &:hover {
              border-color: #409eff;
            }
            .avatar-uploader-icon {
              font-size: 28px;
              color: #8c939d;
              width: 130px;
              height: 130px;
              line-height: 130px;
              text-align: center;
            }
            .avatar {
              width: 130px;
              height: 130px;
              display: block;
            }
          }
        }
        svg {
          width: 100px;
          height: 100px;
        }
      }
    }
  }
}
</style>
