<template>
  <transition name="el-fade-in-linear">
    <div id="addApproval" v-show="addApprovalModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">添加审批条件</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form
              ref="form"
              :rules="rules"
              label-position="right"
              label-width="120px"
              :model="form"
            >
              <el-form-item label="审批条件名称" prop="name">
                <el-input v-model="form.name" placeholder="审批条件名称"></el-input>
              </el-form-item>
              <el-form-item label="审批条件规则" prop="condition_rule">
                <el-input v-model="form.condition_rule" placeholder="审批条件规则"></el-input>
              </el-form-item>
              <el-form-item label="审批条件单位" prop="condition_unit">
                <el-input v-model="form.condition_unit" placeholder="审批条件单位"></el-input>
              </el-form-item>
              <el-form-item label="审批条件值" prop="condition_value">
                <el-input type="number" v-model="form.condition_value" placeholder="审批条件值"></el-input>
              </el-form-item>
              <el-form-item label="审批类型" prop="type">
                <el-select v-model="form.type" placeholder="审批类型">
                  <el-option
                    v-for="item in appTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="审批用户" prop="members">
                <el-select v-model="form.members" multiple placeholder="审批用户">
                  <el-option-group
                    v-for="item in userBranch"
                    :key="item.branch_id"
                    :label="item.branch_name"
                    :value="item.branch_id"
                  >
                    <el-option
                      v-for="val in item.member"
                      :key="val.id"
                      :label="val.display_name"
                      :value="val.id"
                    ></el-option>
                  </el-option-group>
                </el-select>
              </el-form-item>
              <el-form-item label="是否需要部门管理者审批">
                <el-radio-group v-model="form.is_branch_manage">
                  <el-radio :label="1">需要</el-radio>
                  <el-radio :label="0">不需要</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="onSubmit">立即创建</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "addApproval",
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "请输入审批条件名称", trigger: "blur" }
        ],
        condition_rule: [
          { required: true, message: "请输入审批条件规则", trigger: "blur" }
        ],
        condition_unit: [
          { required: true, message: "请输入审批条件单位", trigger: "blur" }
        ],
        condition_value: [
          {
            required: true,
            message: "请输入审批条件值并且为数字",
            trigger: "blur"
          }
        ],
        type: [{ required: true, message: "请选择审批类型", trigger: "blur" }],
        members: [
          { required: true, message: "请选择审批用户", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    form: Object
  },
  methods: {
    ...mapMutations(["getUserBranch", "setStateData"]),
    onSubmit() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
        let that = this,
          url = null,
          params = {
            name: this.form.name,
            condition_rule: this.form.condition_rule,
            condition_unit: this.form.condition_unit,
            condition_value: this.form.condition_value,
            type: this.form.type,
            members: this.form.members.join(","),
            is_branch_manage: this.form.is_branch_manage
          };
        if (this.form.id) {
          params.id = this.form.id;
          url = `approvals/approval/edit`;
        } else url = `approvals/approval/create`;
        that
          .$post(url, params)
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.clearForm();
          })
          .catch(err => console.error(err));
      });
    },
    getType() {
      if (!this.appTypeList.length) {
        let that = this;
        that
          .$get(`approvals/type`)
          .then(response => {
            if (response.status != 200) return false;
            this.setStateData({
              name: "appTypeList",
              arr: response.data.list
            });
          })
          .catch(err => console.error(err));
      }
    },
    getBranch() {
      if (!this.userBranch.length) {
        let that = this;
        that
          .$get(`members/company/branch`)
          .then(response => {
            if (response.status != 200) return false;
            that.getUserBranch(response.data.list);
          })
          .catch(err => console.error(err));
      }
    },
    clearForm() {
      this.$refs["form"].resetFields();
    },
    close() {
      this.$store.commit("changeModal", "addApprovalModal");
    }
  },
  computed: mapState([
    "addApprovalModal",
    "addonList",
    "userBranch",
    "appTypeList"
  ]),
  mounted() {
    this.getType();
    this.getBranch();
  }
};
</script>
<style lang="less">
#addApproval {
  .modalBox {
    .modalBoxMain {
      width: 820px;
      .modalBoxMainContent {
        .el-form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            width: 50%;
            .el-select {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>

