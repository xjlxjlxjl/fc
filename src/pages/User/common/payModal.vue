<template>
  <transition name="el-fade-in-linear">
    <div v-show="payModal" id="payModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">选择支付方式</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-radio-group id="payment" v-model="paymentMethods">
              <el-radio v-for="(item,index) in radioList" :key="index" :label="item.label">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="item.icon"></use>
                </svg>
                <span>{{ item.text }}</span>
              </el-radio>
            </el-radio-group>
            <div align="center">
              <el-button type="primary" size="mini" @click="payment">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";
import "@/assets/css/modal.css";
import icon from "@/assets/icon/iconfont.js";

export default {
  name: "payModal",
  data() {
    return {
      paymentMethods: "alipay",
      radioList: [
        {
          label: "alipay",
          icon: "#icon-zhifubaozhifu",
          text: "每日不限额"
        },
        {
          label: "unionpay",
          icon: "#icon-yinlianzhifu",
          text: "（公账，企业转账）"
        }
      ]
    };
  },
  props: {
    orderIdActive: String
  },
  methods: {
    payment() {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$post("orders/order_pay", {
          orderId: that.orderIdActive,
          pay_method: that.paymentMethods
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          // 创建表单

          let turnForm = document.createElement("form");
          // turnForm.innerHTML = response.pay_html;
          turnForm.method = "post";
          // turnForm.target = "_blank";
          turnForm.action = response.data.action;
          document.body.appendChild(turnForm);

          // 表单内容
          let element = null,
            keys = Object.keys(response.data),
            values = Object.values(response.data);

          keys.forEach((e, k) => {
            if (e == "action") return false;
            element = document.createElement("input");
            element.setAttribute("name", e);
            element.setAttribute("type", "hidden");
            element.setAttribute("value", values[k]);
            turnForm.appendChild(element);
          });
          // 表单提交
          turnForm.submit();
          document.body.removeChild(turnForm);
          that.close();
        })
        .catch(error => loading.close());
    },
    close() {
      this.$store.commit("changeModal", "payModal");
    }
  },
  computed: mapState(["payModal"])
};
</script>
<style lang="less">
#payModal {
  #payment {
    width: 100%;
    .el-radio {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: 0;
      margin-bottom: 1rem;
    }
    .el-radio__label {
      width: 70%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      svg {
        height: 5rem;
        width: 10rem;
      }
    }
  }
}
</style>