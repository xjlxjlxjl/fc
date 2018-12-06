<template>
  <transition name="el-fade-in-linear">
    <div v-show="supplierModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">询价</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="companySelect">
              <el-checkbox-group v-model="company_ids">
                <el-checkbox v-for="(item,key) in list" :label="item.id" :key="key">{{ item.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" @click="close">取消</el-button>
            <el-button size="mini" type="primary" @click="inquiry">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "supplier",
  data() {
    return {
      company_ids: []
    };
  },
  props: {
    list: Array,
    slug: String,
    productId: String
  },
  methods: {
    inquiry() {
      let loading = this.$loading({ lock: true }),
        that = this;
      this.$post(`carts/items/price-inquiry/${that.slug}`, {
        ids: that.productId,
        company_ids: that.company_ids.join(",")
      })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;

          this.$notify({ title: "", message: "请求报价成功", type: "success" });
          that.close();
        })
        .catch(error => loading.close());
    },
    close() {
      this.$store.commit("supplierModalDisplay");
    }
  },
  computed: mapState(["supplierModal"]),
  created() {}
};
</script>
<style lang="less">
</style>
