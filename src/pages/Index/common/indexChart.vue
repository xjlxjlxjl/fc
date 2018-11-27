<template>
  <div class="chart">
    <a v-for="(item,index) in chartParts" @click="jump(item.url)" href="javascript:;" :key="index">
      <div>
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </div>
    </a>
  </div>
</template>
<script>
import loginModal from "@/pages/Index/common/loginModal";
export default {
  name: "indexChart",
  data() {
    return {
      chartParts: [
        {
          name: "购物车",
          icon: "font_family icon-xiangmu",
          url: "/chart.html#/project"
        },
        {
          name: "对比",
          icon: "font_family icon-duibi",
          url: "/chart.html#/contrast"
        },
        {
          name: "询价",
          icon: "font_family icon-xunjia1",
          url: "/chart.html#/inquiry"
        },
        {
          name: "消息",
          icon: "font_family icon-xiaoxi",
          url: "/chart.html#/message"
        }
      ]
    };
  },
  components: {
    "login-modal": loginModal
  },
  methods: {
    jump(url) {
      if(!this.$ifLogin()) return false;
      window.location.href = url;
    }
  }
};
</script>
<style lang="less">
@media screen and (max-width: 820px) {
  .chart {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 11rem;
    a {
      text-decoration: none;
      color: #ffffff;
      div {
        background-color: #ff9900;
        padding: 0.5rem;
        text-align: center;
        box-sizing: border-box;
        width: 6rem;
        i {
          display: block;
          font-size: 4rem;
        }
      }
    }
  }
}
@media screen and (min-width: 820px) {
  .chart {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background: #f2f2f2;
    a {
      text-decoration: none;
      color: #ffffff;
      div {
        background-color: #ff9900;
        padding: 0.5rem;
        margin-bottom: 1rem;
        text-align: center;
        width: 66px;
        height: 66px;
        i {
          display: block;
          font-size: 4rem;
        }
      }
    }
  }
}
</style>
