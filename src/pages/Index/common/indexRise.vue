<template>
  <el-container class="homeHeader">
    <el-header class="hidden-sm-and-down">
      <div>
        <i class="font_family icon-logo1" onclick="window.location.href = '/'"></i>
        <!-- <el-input placeholder="搜索输入型号/产品名/品牌名等关键字" v-model="searchText">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input> -->
      </div>
      <div>
        <el-menu background-color="transparent" class="el-menu-demo" mode="horizontal">
          <el-menu-item index="1">
            <div class="dearUserName">
              <a onclick="window.location.href = './user.html#/order'" href="javascript:;" v-if="user != null">欢迎您: 尊敬的 {{ user.user.display_name }}</a>
              <a onclick="window.location.href = './login.html#/login'" href="javascript:;" v-else>未登录，请登录</a>
            </div>
          </el-menu-item>
          <el-menu-item index="2">
            <a href="https://factoryun.com/firm/register" target="_blank">认证公司</a>
          </el-menu-item>
          <el-menu-item index="3">
            <a href="https://company.factoryun.com/login" target="_blank">企业ERP</a>
          </el-menu-item>
          <el-menu-item index="4">
            <span @click="loginOut">退出</span>
          </el-menu-item>
          <el-menu-item index="5">
            <a href="https://factoryun.com/updated/download" target="_blank">APP下载</a>
          </el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-header class="hidden-md-and-up">
      <section><i class="font_family icon-logo1" onclick="window.location.href = '/'"></i></section>
      <section>
        <el-button type="text" 
                   class="moblieHomeMenu"
                   @click="menuShow = !menuShow">
                  <i class="el-icon-close" v-if="menuShow"></i>
                  <i class="el-icon-back" v-else></i>
        </el-button>
        <transition name="el-fade-in">
          <div class="Curtain" v-show="menuShow" @click="menuShow = false"></div>
        </transition>
        <transition name="el-zoom-in-right">
          <div class="menuContent" 
              v-show="menuShow">
            <el-menu
              background-color="transparent"
              text-color="#fff"
              active-text-color="#0064db">
              <!-- <el-menu-item index="1">
                <el-input placeholder="搜索输入型号/产品名/品牌名等关键字" v-model="searchText">
                  <i slot="prefix" class="el-input__icon el-icon-search" @click="search"></i>
                </el-input>
              </el-menu-item> -->
              <el-menu-item index="2">
                <div class="dearUserName">
                  <a onclick="window.location.href = './user.html#/order'" href="javascript:;" v-if="user != null">欢迎您: 尊敬的 {{ user.user.display_name }}</a>
                  <a onclick="window.location.href = './login.html#/login'" href="javascript:;" v-else>未登录，请登录</a>
                </div>
              </el-menu-item>
              <el-menu-item index="3">
                <a href="https://factoryun.com/firm/register" target="_blank">认证公司</a>
              </el-menu-item>
              <el-menu-item index="4">
                <a href="https://company.factoryun.com/login" target="_blank">企业ERP</a>
              </el-menu-item>
              <el-menu-item index="5">
                <span @click="loginOut">退出</span>
              </el-menu-item>
              <el-menu-item index="6">
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
          <div class="whiteRoundBox">
            <router-link :to="val.url">{{ val.name }}</router-link>
            <div class="processExtend">
              <nav v-for="(item,index) in val.child" :key="index">
                <router-link to="#">{{ item.name }}</router-link>
                <!-- <router-link :to="item.url">{{ item.name }}</router-link> -->
              </nav>
            </div>
          </div>
          <i class="font_family icon-jiantou" v-show="key !=  process.length - 1"></i>
        </el-menu-item>
      </el-menu>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "indexRise",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      process: [
        {
          name: "销售",
          url: "Sale",
          child: [
            { name: "客户管理", url: "customers" },
            { name: "销售订单", url: "orders" },
            { name: "报价", url: "quotedPrice" }
          ]
        },
        {
          name: "工程",
          url: "Engineer",
          child: [
            { name: "Bom", url: "project" },
            { name: "料品", url: "materials" }
          ]
        },
        {
          name: "采购",
          url: "Purchase",
          child: [
            { name: "采购计划", url: "project" },
            { name: "采购单", url: "project" }
          ]
        },
        {
          name: "IQC",
          url: "IQC",
          child: [{ name: "来料检测", url: "project" }]
        },
        {
          name: "仓库",
          url: "WareHouse",
          child: [
            { name: "料品管理", url: "project" },
            { name: "出库", url: "project" },
            { name: "入库", url: "project" }
          ]
        },
        {
          name: "生产",
          url: "Produce",
          child: [
            { name: "生产计划", url: "project" },
            { name: "生产领料", url: "project" },
            { name: "生产送检", url: "project" }
          ]
        },
        {
          name: "OQC",
          url: "OQC",
          child: [
            { name: "成品检测", url: "project" },
            { name: "质检报告", url: "project" }
          ]
        },
        {
          name: "物流",
          url: "Logistics",
          child: [{ name: "物流管理", url: "project" }]
        },
        {
          name: "售后",
          url: "AfterSale",
          child: [
            { name: "售后计划", url: "project" },
            { name: "售后维修", url: "project" }
          ]
        }
      ],
      menuShow: false,
      searchText: ""
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
      getUserInfo = setInterval(() => {
        that.getUserInfo();
        if (JSON.parse(localStorage.getItem("user")))
          clearInterval(getUserInfo);
      }, 1000);
  }
};
</script>
<style lang="less">
@white: #ffffff;
@aBule: #0064db;
@bBule: #0057bf;
.whiteLink () {
  color: @white;
  text-decoration: none;
}
.whiteRound() {
  border-radius: 30px;
  border: 1px solid #ffffff !important;
  margin-right: 1rem;
  font-size: 2rem;
  padding: 0.5rem 1.5rem;
  display: inline-flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
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
      }
      .el-input {
        margin-left: 1rem;
        color: @white;
        width: 24rem;
        .el-input__inner {
          background-color: transparent;
          border: none;
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
        .el-menu-item {
          color: @white !important;
          .dearUserName{
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
        top: 51px;
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
    padding: 0.5rem;
    .el-menu {
      border-bottom: none;
      display: flex;
      justify-content: center;
      margin: 0 auto;
      max-width: 1280px;
      .el-menu-item {
        padding: 0 0.5rem;
        border-bottom: none;
        .whiteRoundBox {
          color: @white;
          a {
            line-height: 1.8;
            .whiteLink;
          }
          .processExtend {
            position: fixed;
            left: 0;
            right: 0;
            z-index: 2;
            // 幕布定位
            margin-top: 99px;
            -webkit-margin-before: 49px;
            width: 100%;
            opacity: 0.8;
            display: none;
            background-color: #000000;
            nav {
              font-size: 2rem;
              margin-left: 2rem;
              margin-right: 2rem;
            }
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
</style>
