<template>
  <transition name="el-fade-in-linear">
    <div id="delegateUser" v-show="delegateUser">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">选择委派人员</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="checkedUser">
              <el-checkbox-group v-model="checkedUser">
                <el-checkbox
                  v-for="(val,key) in userBranch"
                  :key="key"
                  :label="val.id"
                >{{ val.display_name }}</el-checkbox>
              </el-checkbox-group>
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
import { mapState, mapMutations } from "vuex";
export default {
  name: "delegateUser",
  data() {
    return {
      userBranch: [],
      checkedUser: []
    };
  },
  props: {
    active: Object
  },
  methods: {
    ...mapMutations(["getUserBranch"]),
    getBranch() {
      if (this.$store.state.userBranch.length)
        this.$store.state.userBranch.forEach(e =>
          e.member.forEach(v => this.userBranch.push(v))
        );
      else {
        let that = this;
        that
          .$get(`members/company/branch`)
          .then(response => {
            if (response.status != 200) return false;
            response.data.list.forEach(e =>
              e.member.forEach(v => that.userBranch.push(v))
            );
            that.getUserBranch(response.data.list);
          })
          .catch(err => console.error(err));
      }
    },
    commit() {
      let that = this;
      that
        .$post(`service/delegate/customer/service/${that.active.id}`, {
          user_ids: that.checkedUser.join(",")
        })
        .then(response => {
          if (response.status != 200) return false;
          that.$emit("refresh");
          that.close();
        })
        .catch(err => {});
    },
    close() {
      this.$store.commit("changeModal", "delegateUser");
    }
  },
  computed: mapState(["delegateUser"]),
  created() {
    this.getBranch();
  }
};
</script>
<style lang="less">
#delegateUser {
  #checkedUser {
    max-height: 500px;
    overflow-y: auto;
    .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      > label {
        margin-left: 0;
        width: 30%;
      }
    }
  }
}
</style>
