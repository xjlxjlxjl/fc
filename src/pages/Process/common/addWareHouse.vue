<template>
  <transition name="el-fade-in-linear">
    <div id="addWareHouse" v-show="addWareHouseModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">新建仓库</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form :model="form" size="mini" label-width="80px">
              <el-form-item label="仓库名称">
                <el-input type="textarea" v-model="form.name" placeholder="仓库名称"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="form.description" placeholder="描述"></el-input>
              </el-form-item>
              <el-form-item label="仓库类型">
                <el-radio-group v-model="form.type">
                  <el-radio :label="1">仓库</el-radio>
                  <el-radio :label="2">仓位</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="仓库类别">
                <el-select v-model="activeKey">
                  <el-option
                    v-for="(item,index) in WareHouseType"
                    :key="index"
                    :label="item.value"
                    :value="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="父级仓库" v-if="form.type == 2">
                <el-select v-model="form.parent">
                  <el-option
                    v-for="(item,index) in WareHouseList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.remark" placeholder="备注"></el-input>
              </el-form-item>
              <el-form-item label="是否启用">
                <el-radio-group v-model="form.enabled">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
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
  name: "addWareHouse",
  data() {
    return {
      activeKey: "",
      form: {
        name: "",
        description: "",
        type: 1,
        category: "",
        parent: 0,
        remark: "",
        enabled: 0
      }
    };
  },
  methods: {
    ...mapMutations(["setStateData"]),
    onSubmit() {
      let that = this;
      if (that.form.type == 1) that.form.parent = 0;
      that
        .$post(`respositories/create`, that.form)
        .then(response => {
          if (response.status != 200) return false;
          that.close();
          that.$emit("refresh");
        })
        .catch(err => {});
    },
    close() {
      this.$store.commit("changeModal", "addWareHouseModal");
    }
  },
  computed: mapState({
    WareHouseType: state => state.WareHouseType,
    addWareHouseModal: state => state.addWareHouseModal,
    WareHouseList: state => {
      let arr = [{ name: "无父级仓库", id: 0 }];
      state.WareHouseList.forEach(e => arr.push(e));
      return arr;
    }
  }),
  watch: {
    activeKey(newVal, oldVal) {
      this.form.category = JSON.stringify(this.WareHouseType[newVal].key);
    }
  }
};
</script>
<style lang="less">
#addWareHouse {
  .modalBoxMain {
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
