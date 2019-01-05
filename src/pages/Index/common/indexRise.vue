<template>
  <el-container class="homeHeader">
    <el-header class="hidden-sm-and-down">
      <div>
        <i class="font_family icon-logo1" onclick="window.location.href = '/'"></i>
        <div>
          <p>最简洁的界面需要最强大的算法，</p>
          <p>工厂云从来不简单！</p>
        </div>
        <!-- <el-input placeholder="搜索输入型号/产品名/品牌名等关键字" v-model="searchText">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>-->
      </div>
      <div>
        <el-menu background-color="transparent" class="el-menu-demo" mode="horizontal">
          <el-submenu index="1">
            <template slot="title">
              <span v-if="user != null">欢迎您: 尊敬的 {{ user.user.display_name }}</span>
              <span v-else @click="loginOut">未登录，请登录</span>
            </template>
            <el-menu-item index="1-1" @click="loginOut" v-if="user != null">退出登录</el-menu-item>
          </el-submenu>
          <el-menu-item index="2">
            <a :href="user ? user.user.qrcode : 'javascript:;'" target="_blank">我的名片</a>
          </el-menu-item>
          <!-- 工资条界面 -->
          <!-- <el-menu-item index="3">
            <a href target="_blank">俺的小金库</a>
          </el-menu-item>-->
          <el-menu-item index="3">
            <a @click="locationTo('/#/company')" href="javascript:;">认证公司</a>
          </el-menu-item>
          <el-menu-item index="4">
            <a @click="locationTo('/user.html#/order')" href="javascript:;">个人中心</a>
          </el-menu-item>
          <el-menu-item index="5">
            <a href="https://factoryun.com/updated/download" target="_blank">APP下载</a>
          </el-menu-item>
          <el-menu-item index="6">
            <a href="/chart.html#/message">
              <el-badge :value="messageTips" v-if="messageTips > 0" class="item">
                <i class="el-icon-bell"></i>
              </el-badge>
              <i class="el-icon-bell" v-else></i>
            </a>
          </el-menu-item>
          <el-menu-item index="7">
            <a href="https://company.factoryun.com/login" target="_blank">企业ERP</a>
          </el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-header class="hidden-md-and-up">
      <section>
        <i class="font_family icon-logo1" onclick="window.location.href = '/'"></i>
      </section>
      <section>
        <el-button type="text" class="moblieHomeMenu" @click="menuShow = !menuShow">
          <i class="el-icon-close" v-if="menuShow"></i>
          <i class="el-icon-back" v-else></i>
        </el-button>
        <transition name="el-fade-in">
          <div class="Curtain" v-show="menuShow" @click="menuShow = false"></div>
        </transition>
        <transition name="el-zoom-in-right">
          <div class="menuContent" v-show="menuShow">
            <el-menu background-color="transparent" text-color="#fff" active-text-color="#0064db">
              <!-- <el-menu-item index="1">
                <el-input placeholder="搜索输入型号/产品名/品牌名等关键字" v-model="searchText">
                  <i slot="prefix" class="el-input__icon el-icon-search" @click="search"></i>
                </el-input>
              </el-menu-item>-->
              <el-menu-item index="2">
                <div class="dearUserName">
                  <a
                    onclick="window.location.href = './user.html#/order'"
                    href="javascript:;"
                    v-if="user != null"
                  >欢迎您: 尊敬的 {{ user.user.display_name }}</a>
                  <a
                    onclick="window.location.href = './login.html#/login'"
                    href="javascript:;"
                    v-else
                  >未登录，请登录</a>
                </div>
              </el-menu-item>
              <el-menu-item index="3">
                <a href="/chart.html#/project">购物车</a>
              </el-menu-item>
              <el-menu-item index="4">
                <a href="/chart.html#/contrast">对比</a>
              </el-menu-item>
              <el-menu-item index="5">
                <a href="/chart.html#/inquiry">询价</a>
              </el-menu-item>
              <el-menu-item index="6">
                <a href="/chart.html#/message">消息</a>
              </el-menu-item>
              <el-menu-item index="7">
                <a :href="user ? user.user.qrcode : 'javascript:;'" target="_blank">我的名片</a>
              </el-menu-item>
              <el-menu-item index="8">
                <a href target="_blank">俺的小金库</a>
              </el-menu-item>
              <el-menu-item index="9" v-if="user != null">
                <span @click="loginOut">退出登录</span>
              </el-menu-item>
              <el-menu-item index="10">
                <a href="https://factoryun.com/updated/download" target="_blank">APP下载</a>
              </el-menu-item>
            </el-menu>
          </div>
        </transition>
      </section>
    </el-header>
    <el-main class="headerProcess hidden-md-and-down">
      <el-menu background-color="transparent" class="el-menu-demo" mode="horizontal">
        <el-menu-item v-for="(val,key) in process" :index="key.toString()" :key="key">
          <a href="javascript:;" @click="locationTo(val.indexUrl)">
            <div class="whiteRoundBox">
              <a href="javascript:;">{{ val.name }}</a>
              <img :src="progress" v-if="key < process.length - 3">
              <img :src="progressLast" v-else-if="key == process.length - 1">
              <img :src="progressHide" v-else>
            </div>
          </a>
        </el-menu-item>
      </el-menu>
    </el-main>
  </el-container>
</template>
<script>
import progress from "@/assets/img/progress.png";
import progressHide from "@/assets/img/progressHide.png";
import progressLast from "@/assets/img/progressLast.png";

export default {
  name: "indexRise",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      process: this.$store.state.riseProcess,
      progress: progress,
      progressHide: progressHide,
      progressLast: progressLast,
      menuShow: false,
      searchText: "",
      messageTips: 0
    };
  },
  methods: {
    loginOut() {
      localStorage.clear();
      window.location.href = "./login.html#/login";
    },
    getUserInfo() {
      this.user = JSON.parse(localStorage.getItem("user")) || null;
    },
    locationTo(url) {
      if (!this.$ifLogin()) return false;
      if (this.user && !this.user.slug && url != "/user.html#/order")
        this.$message({
          message: "需要公司登陆才能使用ERP功能",
          type: "warning"
        });
      else if (this.user.slug) location.href = url;
    },
    search() {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$post("home/search", { name: that.searchText })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
        })
        .catch(error => loading.close());
    }
  },
  created() {
    let that = this,
      orignalSetItem = localStorage.setItem;

    localStorage.setItem = function(key, newValue) {
      orignalSetItem.apply(this, arguments);
      if (key == "user") that.getUserInfo();
    };
  }
};
</script>
<style lang="less">
@white: #ffffff;
@aBule: #0064db;
@bBule: #0057bf;
@border: solid 1px @white;
.whiteLink() {
  color: @white;
  text-decoration: none;
}
.whiteRound() {
  border: @border !important;
  font-size: 2rem;
  width: 80px;
  padding: 0.5rem 1.5rem;
  display: inline-flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  line-height: 1;
  position: relative;
}
.homeHeader {
  width: 100%;
  background-color: @bBule;
  color: @white;
  font-size: 1.2rem;
  .el-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 0.5rem 0;
    position: relative;
    // pc端
    > div {
      display: flex;
      align-items: center;
      > i {
        font-size: 3.4rem;
        margin-right: 1rem;
      }
      .el-input {
        margin-left: 1rem;
        color: @white;
        width: 24rem;
        border: @border;
        height: 30px;
        .el-input__suffix {
          border-left: @border;
          width: 40px;
        }
        .el-input__inner {
          background-color: transparent;
          border: none;
          padding: 0 0.5rem;
          height: 30px;
          color: @white;
        }
        i {
          font-size: 18px;
        }
      }
      .el-menu {
        display: flex;
        align-items: center;
        border: none;
        color: @white;
        height: auto;
        .el-submenu {
          color: @white;
          .el-submenu__title {
            color: @white;
            &:hover {
              color: @white;
              background-color: @bBule !important;
            }
          }
        }
        .el-menu-item {
          color: @white !important;
          .dearUserName {
            text-align: right;
            width: 150px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          &:hover {
            background-color: #0064db !important;
          }
          a {
            .whiteLink;
          }
          i {
            color: @white;
          }
          .el-badge {
            line-height: 1;
          }
        }
      }
    }
    // moblie端
    > section {
      > i {
        font-size: 3.6rem;
      }
      > .moblieHomeMenu {
        background-color: transparent;
        color: @white;
        padding: 0.7rem 1.3rem;
        i {
          font-size: 2rem;
          font-weight: bold;
        }
      }
      .menuContent {
        position: absolute;
        box-sizing: border-box;
        right: -1px;
        // top: 51px;
        top: 0px;
        z-index: 2002;
        background-color: @bBule;
        .el-menu-item {
          color: @white !important;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
          &:hover {
            background-color: @aBule !important;
          }
          i,
          a,
          span {
            font-size: 1.4rem;
            .whiteLink;
          }
          input {
            background-color: transparent;
            color: @white;
            border: none;
            padding-right: 0;
          }
        }
      }
    }
  }
  .hidden-md-and-up {
    justify-content: space-between !important;
    padding: 0.5rem;
    z-index: 2;
    font-size: 1.4rem !important;
    height: 52px;
  }
  .el-main {
    background-color: @aBule;
    padding: 0rem;
    .el-menu {
      border-bottom: none;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      margin: 0 auto;
      width: max-content;
      .el-menu-item {
        padding: 0 0.5rem;
        border-bottom: none;
        height: auto;
        a {
          text-decoration: none;
        }
        .whiteRoundBox {
          color: @white;
          a {
            line-height: 1.8;
            .whiteLink;
          }
          &:hover {
            background-color: @white !important;
            > a {
              color: @aBule !important;
            }
            > .processExtend {
              display: flex;
              flex-wrap: wrap;
            }
          }
          img {
            position: absolute;
            right: -26px;
            top: -1px;
            z-index: 2;
            height: 35px;
          }
          .whiteRound;
        }
        &:hover {
          background-color: transparent !important;
        }
        i {
          color: @white;
          font-size: 3rem;
        }
      }
    }
  }
}
.el-menu--horizontal {
  .el-menu {
    .el-menu-item {
      background-color: @bBule !important;
      color: @white !important;
      &:hover {
        background-color: @aBule !important;
        color: @white !important;
      }
    }
  }
}
</style>
