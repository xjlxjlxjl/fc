<template>
  <transition name="el-fade-in-linear">
    <div id="changePositions" v-show="changePositionsModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">调整岗位</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form :model="form" ref="form" label-width="120px" size="small">
              <el-form-item label="跳转岗位">
                <el-select v-model="form.post">
                  <el-option
                    v-for="(item,index) in label"
                    :key="index"
                    :value="item.branch_id"
                    :label="item.branch_name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
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
  name: "changePositions",
  data() {
    return {
      form: {
        post: ""
      },
      label: this.$store.state.userBranch
    };
  },
  props: {
    userArr: Array
  },
  methods: {
    ...mapMutations(["getUserBranch"]),
    getBranch() {
      if (this.label.length) return false;
      let that = this;
      that
        .$get(`members/company/branch`)
        .then(response => {
          if (response.status != 200) return false;
          that.label = response.data.list;
          that.getUserBranch(response.data.list);
        })
        .catch(err => console.error(err));
    },
    commit() {
      let that = this;
      if (!that.form.post) {
        that.$message({ message: "请选择部门", type: "error" });
        return false;
      }
      that.userArr.forEach(e => {
        that
          .$post(`members/adjustment/position`, {
            member_id: e,
            branch_id: that.form.post
          })
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
          })
          .catch(err => {});
      });
    },
    close() {
      this.$store.commit("changeModal", "changePositionsModal");
    }
  },
  computed: mapState(["changePositionsModal"]),
  created() {
    this.getBranch();
  }
};
</script>
<style lang="less">
#changePositions {
  .el-form {
    .el-form-item {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
