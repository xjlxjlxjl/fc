<template>
  <transition name="el-fade-in-linear">
    <div id="editServicePrice" v-show="editServicePrice">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">设置报价</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="servicePrice">
              <el-form :model="form" :rules="rules" ref="form" label-width="80px">
                <el-form-item label="总价">
                  <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="优惠价">
                  <el-input v-model="form.discount_price"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="commit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "editServicePrice",
  data() {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      form: {
        price: "",
        discount_price: "",
        report_user_id: user.user.id,
        report_user_name: user.user.display_name
      },
      rules: {
        price: [{ required: true, message: "请输入总价", trigger: "blur" }],
        discount_price: [
          { required: true, message: "请输入折扣价", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    active: Object
  },
  methods: {
    commit() {
      let that = this;
      this.$refs["form"].validate(v => {
        if (!v) return false;
        that
          .$post(`service/set/discount/price/${that.active.id}`, that.form)
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.clearForm();
          })
          .catch(err => {});
      });
    },
    clearForm() {
      this.$refs["form"].resetFields();
    },
    close() {
      this.$store.commit("changeModal", "editServicePrice");
    }
  },
  computed: {
    ...mapState(["editServicePrice"])
  },
  watch: {
    editServicePrice(val) {
      if (!val) return false;
      this.form.price = this.active.price;
      this.form.discount_price = this.active.discount_price;
    }
  }
};
</script>
<style lang="less">
#editServicePrice {
  #servicePrice {
    .el-form {
      .el-form-item {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
