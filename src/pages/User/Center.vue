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
              <el-aside class="homeMainAside" width="200px">
                <el-menu default-active="0">
                  <router-link v-for="(item,index) in service" :key="index" :to="item.url">
                    <el-menu-item :index="index.toString()">
                      <span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                  </router-link>
                </el-menu>
              </el-aside>
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
import indexRise from '@/pages/Index/common/indexRise';
import indexTail from '@/pages/Index/common/indexTail';
import indexChart from '@/pages/Index/common/indexChart';

export default {
  name: 'Center',
  data() {
    return {
      service: [
        { name: '我的订单', url: 'order' },
        { name: '我的合同', url: 'contract' },
        { name: '我的收藏', url: 'collect' },
        { name: '个人信息', url: 'account' },
        { name: '实名认证', url: 'authentication' },
        { name: '收货地址管理', url: 'addressManage' },
        { name: '安全中心', url: 'security' },
      ]
    }
  },
  components:{
    'index-rise': indexRise,
    'index-chart': indexChart,
    'index-tail': indexTail
  },
  methods: {
    changeState(item) {
      this.content = item;
    },
  }
}
</script>
<style lang="less">
a{
  text-decoration: none;
}
.el-header,
.el-main,
.el-footer{
  padding: 0;
}
.homeContainer{
  background-color: #f2f2f2;
}
.homeFooter{
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
.borShadow (){
  // border: @border;
  // box-shadow: 0 0 15px #a7a6a6;
  background-color: @white;
  height: 100% !important;
}
#main{
  max-width: 1280px;
  margin: 0 auto;
  // 保留底部颜色
  height: 83%;
  
  @media screen and (min-width: 820px){
    >.el-container{
      height: 100%;
      .homeMainAside{
        padding: 0;
        margin-top: 1.5rem;
        margin-right: 1.5rem;
        .el-menu{
          border: none;
          .el-menu-item{
            &:hover{
              background-color: @sky;
              color: @white;
            }
          }
          .el-menu-item.is-active{
            background-color: #0064db;
            color: #ffffff;
          }
        }
        .borShadow
      }
    }
    .homeMainContent{
      position: relative;
      padding: 0;
      margin-top: 1.5rem;
      height: 100% !important;
      background: #ffffff;
      >section{
        height: 92%;
        width: 93%;
        .homeAsideList{
          .el-menu-item{
            border-bottom: 1px solid #e6e6e6;
          }
          .el-menu-item.is-active{
            background-color: #ff9900;
            color: #ffffff;
          }
        }
        .homeMainList{
          display: flex;
          flex-wrap: wrap;
          background: #ffffff;
          >div{
            width: 15rem;
            height: 15rem;
            overflow: hidden;
            text-align: center;
            padding: 1rem;
            img{
              display: block;
              margin: 0 auto;
              padding: .5rem;
              border: 1px solid #EEEEEE;
              box-sizing: border-box;
              width: 80%;
            }
            span{
              line-height: 2;
              color: #666666;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 820px){
    >.el-container{
      height: auto;
      display: block;
      .homeMainAside{
        padding: 0;
        width: 100% !important;
        height: auto;
        .el-menu{
          border: none;
          .el-menu-item{
            border-bottom: 1px solid #e6e6e6;
            box-sizing: border-box;
          }
          .el-menu-item.is-active{
            background-color: #0064db;
            color: #ffffff;
          }
        }
      }
    }
    .homeMainContent{
      display: block;
      padding: 0;
      background: #ffffff;
      >section{
        .homeAsideList{
          box-sizing: border-box;
          .el-menu-item{
            border-bottom: 1px solid #e6e6e6;
            box-sizing: border-box;
            &:first-child{
              border-top: 1px solid #e6e6e6;
            }
          }
          .el-menu-item.is-active{
            background-color: #ff9900;
            color: #ffffff;
          }
        }
        .homeMainList{
          display: flex;
          flex-wrap: wrap;
          background: #ffffff;
          padding: .5rem;
          >div{
            width: 50%;
            box-sizing: border-box;
            text-align: center;
            img{
              display: block;
              margin: auto;
              padding: .5rem;
              border: 1px solid #EEEEEE;
              box-sizing: border-box;
              width: 90%;
            }
            span{
              line-height: 2;
              color: #666666;
            }
          }
        }
      }
    }
  }
}
</style>