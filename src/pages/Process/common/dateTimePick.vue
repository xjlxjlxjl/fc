<template>
  <transition name="el-fade-in-linear">
    <div id="dateTimePick" v-show="dateTimePickModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">{{ title }}</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="timePick">
              <el-date-picker v-model="datetime" type="datetime" placeholder="选择日期时间"></el-date-picker>
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
import "@/assets/css/modal.css";
import { mapState } from "vuex";
export default {
  name: "dateTimePick",
  data() {
    return {
      datetime: ""
    };
  },
  props: {
    title: String,
    activeId: Number
  },
  methods: {
    commit() {
      if (!this.datetime) {
        this.$message({ message: "请选择任务时间", type: "error" });
        return false;
      }
      let that = this;
      this.$post(`job/accept/${that.activeId}`, {
        estimate_complete_time: that.dateParse(that.datetime)
      })
        .then(response => {
          if (response.status != 200) return false;
          that.$emit("refresh");
          that.close();
        })
        .catch(err => console.error(err));
    },
    close() {
      this.$store.commit("changeModal", "dateTimePickModal");
    }
  },
  computed: {
    ...mapState(["dateTimePickModal"])
  }
};
</script>
<style lang="less">
#dateTimePick {
  .modalBox {
    @media screen and (min-width: 610px) {
      margin-top: 15rem;
    }
    #timePick {
      .el-input {
        width: 100%;
      }
    }
  }
}
</style>