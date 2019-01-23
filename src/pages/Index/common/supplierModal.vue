<template>
  <transition name="el-fade-in-linear">
    <div id="supplierModal" v-show="supplierModal">
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
            <el-select v-model="form.supplier_ids">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "supplierModal",
  data() {
    return {
      form: {
        supplier_ids: undefined
      }
    };
  },
  props: {
    title: String,
    demand: Object
  },
  methods: {
    ...mapMutations(["setStateData"]),
    getCompany() {
      if (this.companyList.length) return false;
      let that = this;
      that
        .$get(`purchase/suppliers`)
        .then(response => {
          if (response.status != 200) return false;
          this.setStateData({ name: "companyList", arr: response.data.list });
        })
        .catch(err => console.error(err));
    },
    onSubmit() {
      this.$emit("onSubmit", {
        demand: this.demand.requirements,
        images_ids: this.demand.images_ids.join(","),
        supplier_ids: this.form.supplier_ids
      });
    },
    close() {
      this.$store.commit("changeModal", "supplierModal");
    }
  },
  computed: mapState(["companyList", "supplierModal"]),
  mounted() {
    this.getCompany();
  }
};
</script>
<style lang="less">
#supplierModal {
  .modalBoxMainContent {
    .el-select {
      width: 100%;
    }
  }
}
</style>
