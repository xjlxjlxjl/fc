<template>
  <div id="msgBox">
    <div class="msgRise">
      <div class="avatar"></div>
      <div class="switch">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <div class="msgMain">
      <div class="msgSearch">
        <el-input size="mini" placeholder="搜索用户" prefix-icon="el-icon-search"></el-input>
      </div>
      <el-menu class="msgList" default-active="0">
        <el-menu-item index="0">
          <div class="avatarBox">
            <img src="https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/avatar/微信图片_20181115170315-20181204113354.jpg">
          </div>
          <span slot="title">aaaaaaaaaa</span>
          <el-popover placement="left" trigger="hover">
            <el-button size="mini" slot="reference">操作</el-button>
            <el-button size="mini" type="danger">加入群组</el-button>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="1">
          <div class="avatarBox">
            <img src="https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/avatar/微信图片_20181115170315-20181204113354.jpg">
          </div>
          <span slot="title">aaaaaaaaaa</span>
          <el-popover placement="left" trigger="hover">
            <el-button size="mini" slot="reference">操作</el-button>
            <el-button size="mini" type="danger">加入群组</el-button>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="2">
          <div class="avatarBox">
            <img src="https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/avatar/微信图片_20181115170315-20181204113354.jpg">
          </div>
          <span slot="title">aaaaaaaaaa</span>
          <el-popover placement="left" trigger="hover">
            <el-button size="mini" slot="reference">操作</el-button>
            <el-button size="mini" type="danger">加入群组</el-button>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="3">
          <div class="avatarBox">
            <img src="https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/avatar/微信图片_20181115170315-20181204113354.jpg">
          </div>
          <span slot="title">aaaaaaaaaa</span>
          <el-popover placement="left" trigger="hover">
            <el-button size="mini" slot="reference">操作</el-button>
            <el-button size="mini" type="danger">加入群组</el-button>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="4">
          <div class="avatarBox">
            <img src="https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/avatar/微信图片_20181115170315-20181204113354.jpg">
          </div>
          <span slot="title">aaaaaaaaaa</span>
          <el-popover placement="left" trigger="hover">
            <el-button size="mini" slot="reference">操作</el-button>
            <el-button size="mini" type="danger">加入群组</el-button>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- <div class="tail"></div> -->
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import fileImg from "@/assets/img/file.png";
import "vue-photo-preview/dist/skin.css";

export default {
  name: "chatModal",
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || null
    };
  },
  props: {
  },
  methods: {
  },
  computed: mapState(["chatModal"]),
  watch: {
  },
  beforeDestroy() {
  },
  mounted() {
  },
  created() {
  }
};
</script>
<style lang="less">
@grey: #D9D9D9;
@gery: #666666;
@smallGrey: #F6F6F6;
@white: #ffffff;
@eee: #eeeeee;
@dedede: #dedede;
@e6e6e6: #e6e6e6;
@black: #1d1d1d;
@shadow: 1px 1px 50px rgba(0,0,0,.3);
@border: 1px solid @grey;
  #msgBox {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 10;
    width: 300px;
    height: 600px;
    border: @border;
    box-sizing: border-box;
    border-radius: 2px;
    box-shadow: @shadow;
    background-color: @smallGrey;
    .msgRise {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      color: @black;
      .switch {
        > i {
          font-size: 2rem;
          font-weight: bold;
        }
      }
    }
    .msgMain {
      .msgSearch {
        padding: 0 .5rem;
      }
      .el-menu {
        margin-top: .5rem;
        background-color: @eee;
        p {
          padding: 1rem 1.5rem;
          background-color: @white;
          color: @gery;
          border-bottom: @border;
        }
        .el-menu-item {
          color: @gery;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          * {
            vertical-align: unset;
          }
          &:hover {
            background-color: @e6e6e6;
          }
          .avatarBox {
            width: 40px;
            height: 40px;
            overflow: hidden;
            display: inline-block;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50px;
            }
          }
          .el-badge {
            height: 50px;
            .el-badge__content {
              top: 10px;
            }
          }
          > span {
            margin-left: 1rem;
            &:last-child {
              display: block;
              width: 120px;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          label {
            display: block;
            width: 85%;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 1.4rem;
          }
          button {
            position: absolute;
            right: 1rem;
            top: 1.3rem;
          }
        }
        .is-active {
          background-color: @dedede;
        }
      }
    }
    .tail {
      width: 100%;
      height: 30px;
      background-color: @black;
    }
  }
</style>
