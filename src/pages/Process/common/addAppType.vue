<template>
  <transition name="el-fade-in-linear">
    <div id="addAppType" v-show="addAppTypeModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">添加审批类型</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form
              ref="form"
              :rules="rules"
              label-position="left"
              label-width="80px"
              :model="form"
            >
              <el-form-item label="审批类型" prop="name">
                <el-input v-model="form.name" placeholder="审批类型"></el-input>
              </el-form-item>
              <el-form-item label="选择插件" prop="addon">
                <el-select v-model="form.addon" placeholder="选择插件">
                  <el-option
                    v-for="(item, index) in addonList"
                    :key="index"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类型描述">
                <el-input v-model="form.description" placeholder="类型描述"></el-input>
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
  name: "addAppType",
  data() {
    return {
      form: {
        name: "",
        addon: "",
        description: ""
      },
      rules: {
        name: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
        addon: [{ required: true, message: "请选择插件", trigger: "blur" }]
      }
    };
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
        let that = this;
        that
          .$post(`approvals/type/create`, that.form)
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.clearForm();
          })
          .catch(err => console.error(err));
      });
    },
    clearForm() {
      this.$refs["form"].resetFields();
    },
    close() {
      this.$store.commit("changeModal", "addAppTypeModal");
    }
  },
  computed: mapState(["addAppTypeModal", "addonList"])
};
</script>
<style lang="less">
#addAppType {
  .el-select {
    width: 100%;
  }
}
</style>

