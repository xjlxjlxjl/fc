<template>
  <div id="app">
    <el-container>
      <el-header>
        <index-rise></index-rise>
      </el-header>
      <el-container class="homeContainer">
        <el-main>
          <div id="main">
            <el-container>
              <el-aside class="homeMainAside" width="0"></el-aside>
              <el-main class="homeMainContent">
                <el-container>
                  <transition name="el-fade-in">
                    <router-view></router-view>
                  </transition>
                </el-container>
                <index-chart></index-chart>
              </el-main>
            </el-container>
          </div>
        </el-main>
      </el-container>
      <el-footer class="homeFooter">
        <index-tail></index-tail>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import indexRise from "@/pages/Index/common/indexRise";
import indexTail from "@/pages/Index/common/indexTail";
import indexChart from "@/pages/Index/common/indexChart";

export default {
  name: "Index",
  components: {
    "index-rise": indexRise,
    "index-chart": indexChart,
    "index-tail": indexTail
  }
};
</script>
<style lang="less">
@import "element-ui/lib/theme-chalk/index.css";
@import "../../assets/css/init.css"; // 基础改动
@import "element-ui/lib/theme-chalk/display.css"; // 响应式
@import "../../assets/css/transform.css"; // 过渡效果 缩放 淡入
.el-header,
.el-main,
.el-footer {
  padding: 0;
}
.homeContainer {
  background-color: #f2f2f2;
}
.homeFooter {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
}

@border: solid 1px #e6e6e6;
@white: #ffffff;
@sky: #2288ff;
.borShadow () {
  background-color: @white;
  height: 100% !important;
}
#main {
  max-width: 1280px;
  margin: 0 auto;
  height: 87%;
  @media screen and (min-width: 820px) {
    > .el-container {
      height: 100%;
      .homeMainAside {
        padding: 0;
        margin-top: 1.5rem;
        margin-right: 1.5rem;
        .borShadow;
      }
    }
    .homeMainContent {
      position: relative;
      padding: 0;
      margin-top: 1.5rem;
      height: 100% !important;
      background: #ffffff;
      > section {
        height: 100%;
        width: 94.3%;
      }
    }
  }

  @media screen and (max-width: 820px) {
    > .el-container {
      height: auto;
      display: block;
      .homeMainAside {
        padding: 0;
        width: 100% !important;
        height: auto;
      }
    }
    .homeMainContent {
      display: block;
      padding: 0;
      background: #ffffff;
    }
  }
}
</style>