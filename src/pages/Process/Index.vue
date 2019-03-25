<template>
  <div id="app">
    <el-container>
      <el-header>
        <index-rise></index-rise>
      </el-header>
      <el-container class="homeContainer">
        <!-- <div id="aside">
          <companyAside></companyAside>
        </div>-->
        <el-main>
          <div id="main">
            <el-container>
              <el-main class="homeMainContent">
                <el-container>
                  <transition name="el-fade-in">
                    <router-view></router-view>
                  </transition>
                </el-container>
                <!-- <index-chart></index-chart> -->
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
import indexRise from "@/pages/Process/common/companyRise";
import indexTail from "@/pages/Index/common/indexTail";
// import indexChart from "@/pages/Index/common/indexChart";
// import companyAside from "@/pages/Process/common/companyAside";

import "jquery/dist/jquery.min.js";
import "tablednd/dist/jquery.tablednd.min.js";

import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-table/dist/bootstrap-table.min.js";

import "x-editable/dist/bootstrap3-editable/js/bootstrap-editable.js";
import "bootstrap-table/dist/extensions/editable/bootstrap-table-editable.min.js";
import "bootstrap-table/dist/extensions/export/bootstrap-table-export.min.js";
import "@/assets/js/tableExport.min.js";
import "bootstrap-table/dist/extensions/reorder-rows/bootstrap-table-reorder-rows.min.js";
import "bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js";

export default {
  name: "Index",
  data() {
    return {};
  },
  components: {
    "index-rise": indexRise,
    // "index-chart": indexChart,
    // companyAside: companyAside,
    "index-tail": indexTail
  }
};
</script>
<style lang="less">
@import "element-ui/lib/theme-chalk/index.css";
@import "element-ui/lib/theme-chalk/display.css"; // 响应式
@import "element-ui/lib/theme-chalk/base.css"; // 过渡效果 缩放 淡入
@import "../../assets/css/init.css";
@import "bootstrap/dist/css/bootstrap.min.css";
@import "bootstrap-table/dist/bootstrap-table.min.css";
@import "x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css";

.el-header,
.el-main,
.el-footer {
  padding: 0;
}
.homeContainer {
  background-color: #f2f2f2;
  height: 86%;
  #aside {
    #companyAside {
      height: 87%;
    }
  }
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
  margin: 0 auto;
  height: 87%;
  font-size: 14px;
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
        width: 100%;
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

  .fixed-table-toolbar {
    padding: 0 1rem;
  }
  .fixed-table-container {
    .fixed-table-body {
      width: 100%;
      overflow: auto;
      > table {
        color: #666666;
        > thead {
          background-color: #f2f2f2;
          > tr {
            > th {
              min-width: 100px;
              &:first-child {
                max-width: 50px;
                width: 50px;
              }
            }
          }
        }
        > tbody {
          tr {
            td {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
  .fixed-table-pagination {
    .pagination-detail {
      padding: 0 1rem;
    }
    .pagination {
      padding: 0 1rem;
    }
  }
  @media screen and (min-width: 820px) {
    .chart a div {
      padding: 0;
      i {
        font-size: 3rem;
      }
    }
  }
}
</style>