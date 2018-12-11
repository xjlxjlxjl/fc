<template>
  <transition name="el-fade-in-linear">
    <div id="applyService" v-show="customerService">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">客服申请</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent"></div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="commit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import "@/assets/css/modal.css";
import { mapState } from "vuex";
export default {
  name: "applyService",
  data() {
    return {
      branch: []
    };
  },
  methods: {
    getBranch() {
      if (this.$store.state.userBranch.length)
        this.branch = this.$store.state.userBranch;
      else {
        let that = this;
        that
          .$get(`members/branch`)
          .then(response => {
            if (response.status != 200) return false;
            that.branch = response.data.list;
            that.$store.commit("getUserBranch", response.data.list);
          })
          .catch(err => console.error(err));
      }
    },
    commit() {},
    close() {
      this.$store.commit("changeModal", "customerService");
    }
  },
  computed: mapState(["customerService"]),
  created() {
    this.getBranch();
  }
};
</script>
<style lang="less">
#applyService {
}
</style>
