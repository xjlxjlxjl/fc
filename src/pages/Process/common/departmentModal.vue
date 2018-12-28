<template>
  <transition>
    <div id="departmentModal" v-show="departmentModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">{{ branchId ? '修改部门' : '创建部门' }}</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form :model="items" :rules="rules" ref="form" label-width="160px">
              <el-form-item label="部门名称" prop="slug">
                <el-input v-model="items.name" placeholder="部门名称"></el-input>
              </el-form-item>
              <el-form-item label="部门唯一识别码">
                <el-input v-model="items.slug" placeholder="部门唯一识别码"></el-input>
              </el-form-item>
              <el-form-item label="部门描述">
                <el-input v-model="items.description" placeholder="部门描述"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" v-if="branchId" @click="edit">保存</el-button>
            <el-button size="mini" type="primary" v-else @click="onSubmit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "departmentModal",
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入部门名称", trigger: "blur" }]
      }
    };
  },
  props: {
    branchId: Number,
    items: Object,
    parentId: Number
  },
  methods: {
    onSubmit() {
      let that = this,
        params = {
          name: this.items.name,
          description: this.items.description
        };
      if (this.items.slug) params.slug = this.items.slug;
      if (this.parentId) params.parent_id = this.parentId;
      that
        .$post(`members/branch/create`, params)
        .then(response => {
          if (response.status != 200) return false;
          that.$message({ message: "添加成功", type: "success" });
          that.close();
          that.$emit("refresh");
        })
        .catch(err => {});
    },
    edit() {
      let that = this,
        params = {
          name: that.items.name,
          parent_id: that.parentId
        };
      if (this.items.slug) params.slug = this.items.slug;
      if (
        this.items.description &&
        this.items.description.replace(/\s/g, "").length != 0
      )
        params.description = this.items.description;

      that
        .$post(`members/branch/edit/${that.branchId}`, params)
        .then(response => {
          if (response.status != 200) return false;
          that.$message({ message: "更新成功", type: "success" });
          that.close();
          that.$emit("refresh");
        })
        .catch(err => {});
    },
    close() {
      this.$store.commit("changeModal", "departmentModal");
    }
  },
  computed: mapState(["departmentModal"])
};
</script>
<style lang="less">
#departmentModal {
  .modalBoxMain {
    width: 600px;
    .modalBoxMainContent {
      .el-form {
      }
    }
  }
}
</style>