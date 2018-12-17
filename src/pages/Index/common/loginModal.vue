<template>
  <div id="loginModal">
    <transition name="el-fade-in-linear">
      <div v-show="ModalShow">
        <div class="Curtain"></div>
        <div class="modalBox">
          <div class="modalBoxMain">
            <div class="modalBoxMainHeader">
              <div class="modalBoxMainHeaderTitle">用户登录</div>
              <div class="modalBoxMainHeaderBtn" @click="close">
                <i class="el-message-box__close el-icon-close"></i>
              </div>
            </div>
            <div class="modalBoxMainContent">
              <div id="login">
                <el-row class="loginType" type="flex" justify="space-around">
                  <el-col>
                    <el-radio v-model="loginDetail.login_type" label="0">个人登陆</el-radio>
                  </el-col>
                  <el-col>
                    <el-radio v-model="loginDetail.login_type" label="1">团队登陆</el-radio>
                  </el-col>
                  <el-col>
                    <el-radio v-model="loginDetail.login_type" label="2">公司登陆</el-radio>
                  </el-col>
                </el-row>
                <el-input placeholder="输入手机号" v-model="loginDetail.mobile" clearable></el-input>
                <el-input
                  placeholder="请输入密码"
                  type="password"
                  auto-complete="on"
                  v-if="!isCodeLogin"
                  @keyup.enter.native="login"
                  v-model="loginDetail.password"
                ></el-input>
                <el-input
                  placeholder="请输入验证码"
                  auto-complete="on"
                  v-else
                  @keyup.enter.native="login"
                  v-model="loginDetail.code"
                >
                  <el-button
                    slot="suffix"
                    type="info"
                    @click="getCode"
                    size="mini"
                    round
                  >{{ codeCacheTime }}</el-button>
                </el-input>
                <el-input
                  placeholder="公司代码"
                  v-if="loginDetail.login_type != '0'"
                  @keyup.enter.native="login"
                  v-model="loginDetail.slug"
                  clearable
                ></el-input>
                <div class="btn-box">
                  <el-button
                    type="text"
                    @click="isCodeLogin = !isCodeLogin"
                  >{{ isCodeLogin ? '使用密码登陆' : '使用短信验证登陆' }}</el-button>
                  <div>
                    <a href="/login.html#/sign">
                      <el-button size="mini" type="text">没有账号，注册</el-button>
                    </a>
                  </div>
                </div>
                <div class="query">
                  <el-button type="primary" size="mini" @click="login">登陆</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import "@/assets/css/modal.css";
import { mapState } from "vuex";

export default {
  name: "loginModal",
  data() {
    return {
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
    close() {
      this.$store.commit("change");
    },
    getCode() {
      let that = this;
      if (that.isClick) {
        return false;
      }
      if (that.loginDetail.mobile == "") {
        that.$message({
          message: "请输入手机号码",
          type: "error"
        });
        return false;
      }
      const loading = this.$loading({ lock: true });
      that
        .$get("members/entry-send", {
          mobile: that.loginDetail.mobile
        })
        .then(response => {
          loading.close();
          if (response.status != 200) {
            return false;
          }
          that.isClick = true;
          that.lastTime();
        })
        .catch(error => loading.close());
    },
    lastTime() {
      let that = this;
      that.codeCacheTime = 60;
      let setTimeOut = setInterval(function() {
        if (that.codeCacheTime > 1) {
          that.codeCacheTime--;
        } else {
          clearInterval(setTimeOut);
          that.codeCacheTime = "重新发送";
          that.isClick = false;
        }
      }, 1000);
    },
    login() {
      let that = this;
      if (that.loginDetail.mobile == "") {
        that.$message({
          message: "请输入手机号码",
          type: "error"
        });
        return false;
      }
      let params = {
        mobile: that.loginDetail.mobile,
        login_type: that.loginDetail.login_type
      };
      if (that.loginDetail.code) params.code = that.loginDetail.code;
      else if (that.loginDetail.password)
        params.password = that.loginDetail.password;
      else {
        this.$message({ message: "密码或者验证码不能为空", type: "error" });
        return false;
      }
      const loading = that.$loading({ lock: true });
      if (that.loginDetail.login_type != 0) params.slug = that.loginDetail.slug;
      that
        .$post("members/entry", params)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          localStorage.setItem("user", JSON.stringify(response.data));
          switch (window.location.pathname) {
            case "/login.html":
              window.location.href = "./index.html";
              break;
            case "/":
            case "/index.html":
              that.close();
              break;
          }
        })
        .catch(error => loading.close());
    }
  },
  computed: mapState(["ModalShow"])
};
</script>
<style lang="less" scoped>
#loginModal {
  .modalBox {
    top: 80px !important;
    .modalBoxMain {
      width: 330px;
      #login {
        .loginType {
          margin-bottom: 1rem;
        }
        .el-input {
          margin: 0.5rem 0;
          button {
            padding: 3px;
            width: 80px;
            margin: 0.7rem 0;
          }
        }
        .btn-box {
          text-align: right;
        }
        .query {
          text-align: center;
        }
      }
      @media screen and (min-width: 500px) {
        margin-top: 180px;
      }
    }
  }
}
</style>
