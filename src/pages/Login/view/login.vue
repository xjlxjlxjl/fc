<template>
  <el-container class="loginContainer">
    <el-header class="headPortrait">
      <i class="font_family icon-touxiang"></i>
        <el-row class="loginType" type="flex" justify="space-around">
          <el-col><el-radio v-model="loginDetail.login_type" label="0">个人登陆</el-radio></el-col>
          <el-col><el-radio v-model="loginDetail.login_type" label="1">团队登陆</el-radio></el-col>
          <el-col><el-radio v-model="loginDetail.login_type" label="2">公司登陆</el-radio></el-col>
        </el-row>
    </el-header>
    <el-main>
      <el-input placeholder="输入手机号" 
                v-model="loginDetail.mobile" 
                clearable>
      </el-input>
      <el-input placeholder="请输入密码" 
                type="password"
                auto-complete="on"
                v-if="!isCodeLogin"
                v-model="loginDetail.password" @keyup.13.native="login"></el-input>
      <el-input placeholder="请输入验证码" 
                auto-complete="on"
                v-else
                v-model="loginDetail.code" @keyup.13.native="login">
        <el-button slot="suffix" type="info" @click="getCode" round>{{ codeCacheTime }}</el-button>
      </el-input>
      <el-input placeholder="公司代码" 
                v-if="loginDetail.login_type != '0'"
                v-model="loginDetail.slug" 
                @keyup.13.native="login"
                clearable></el-input>
    </el-main>
    <el-footer>
      <div>
        <el-button type="text" @click="isCodeLogin = !isCodeLogin">{{ isCodeLogin ? '使用密码登陆' : '使用短信验证登陆'  }}</el-button>
        <!-- <el-button type="text">扫码登陆</el-button> -->
      </div>
      <div><router-link to="/sign"><el-button type="text">没有账号，注册</el-button></router-link></div>
      <div><el-button type="primary" @click="login">登陆</el-button></div>
    </el-footer>
  </el-container>
</template>

<script>
import loginModal from "@/pages/Index/common/loginModal";

export default {
  name: "login",
  data() {
    return {
      userProtocol: false,
      isCodeLogin: false,
      loginDetail: {
        mobile: "",
        password: "",
        code: "",
        slug: "", // 记住账号(0或者1)
        login_type: "0" //登录类型0默认，1团队，2公司
      },
      codeCacheTime: "获取验证码",
      isClick: false
    };
  },
  methods: {
    getCode() {
      loginModal.methods.getCode.call(this);
    },
    lastTime() {
      loginModal.methods.lastTime.call(this);
    },
    login() {
      loginModal.methods.login.call(this);
    }
  },
  created() {
  }
};
</script>
<style lang="less" scoped>
@color: #0064db;
.loginContainer {
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 330px;
  .headPortrait {
    text-align: center;
    color: @color;
    i {
      font-size: 12rem;
      display: block;
    }
    .loginType {
      margin-top: 1.5rem;
    }
  }
  .el-main {
    padding: 20px 20px 0px 20px;
    div {
      display: block;
      margin-top: 15px;
      margin-bottom: 15px;
      margin-left: auto;
      margin-right: auto;
      &:last-child {
        margin-bottom: 0px;
      }
      button {
        padding: 3px;
        width: 80px;
      }
    }
  }
  .el-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    > div {
      width: 100%;
      &:first-child {
        text-align: right;
        button {
          padding-bottom: 0;
        }
      }
      &:nth-child(2) {
        text-align: right;
      }
      &:last-child {
        button {
          width: 100%;
        }
      }
    }
  }
}
</style>