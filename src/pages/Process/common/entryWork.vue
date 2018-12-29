<template>
  <transition name="el-fade-in-linear">
    <div id="entryWork" v-show="entryWorkModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">邀请入职</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form :model="form" ref="form" label-width="40px" size="small">
              <el-form-item v-for="(item,index) in label" :key="index" :label="item.name">
                <el-input v-model="form[item.label]"></el-input>
              </el-form-item>
              <el-form-item label="部门">
                <el-select v-model="form.branch">
                  <el-option
                    v-for="item in $store.state.userBranch"
                    :key="item.id"
                    :label="item.branch_name"
                    :value="item.id"
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
  name: "entryWork",
  data() {
    return {
      form: {
        member: "",
        branch: "",
        employee_id: ""
      },
      label: [
        { name: "手机", label: "member" },
        // { name: "部门", label: "branch" },
        { name: "工号", label: "employee_id" }
      ]
    };
  },
  methods: {
    ...mapMutations([""]),
    commit() {
      let that = this;
      if (!that.form.member) {
        that.$message({ message: "请输入手机", type: "error" });
        return false;
      }
      if (!that.form.branch) {
        that.$message({ message: "请输入部门", type: "error" });
        return false;
      }
      if (!that.form.employee_id) {
        that.$message({ message: "请输入工号", type: "error" });
        return false;
      }
      that
        .$post(`personnels/engage`)
        .then(response => {
          if (response.status != 200) return false;
          that.close();
        })
        .catch(err => {});
    },
    close() {
      this.$store.commit("changeModal", "entryWorkModal");
    }
  },
  computed: mapState(["entryWorkModal"]),
  created() {}
};
</script>
<style lang="less">
#entryWork {
  .el-form {
    .el-form-item {
      &:last-child {
        margin-bottom: 0;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
