<template>
  <transition name="el-fade-in-linear">
    <div id="applyService" v-show="customerService">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">客服报价</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="quotation">
              <el-form :model="form" ref="form" label-position="left" label-width="80px">
                <el-form-item label="联系人">
                  <el-input v-model="form.linkman"></el-input>
                </el-form-item>
                <el-form-item label="客户公司">
                  <el-input v-model="form.customer_company_name"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                  <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="明细">
                  <el-table :data="form.tableData" size="mini" height="250">
                    <el-table-column
                      v-for="(item,index) in tableLabel"
                      :prop="item.id"
                      :key="index"
                      :label="item.label"
                    >
                      <template slot-scope="{ row,$index }">
                        <el-input v-model="row[item.prop]" :placeholder="item.label" size="mini"></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </el-form>
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
  name: "applyService",
  data() {
    return {
      branch: [],
      form: {
        linkman: "",
        customer_company_name: "",
        price: "",
        tableData: [
          {
            name: "",
            number: "",
            price: ""
          }
        ]
      },
      tableLabel: [
        { label: "产品", prop: "name" },
        { label: "数量", prop: "number" },
        { label: "价格", prop: "price" }
      ]
    };
  },
  props: {
    active: Object
  },
  methods: {
    commit() {
      let that = this,
        lastData = that.form.tableData[that.form.tableData.length - 1];
      if (!lastData.name && !lastData.number && !lastData.price)
        that.form.tableData.pop();

      if (!that.form.linkman) {
        that.$message({ message: "客户联系人没有填写", type: "error" });
        return false;
      } else if (!that.form.customer_company_name) {
        that.$message({ message: "客户公司没有填写", type: "error" });
        return false;
      } else if (!that.form.price) {
        that.$message({ message: "价格没有填写", type: "error" });
        return false;
      }
      that
        .$post("/service/quoted_price/create", {
          service_id: that.active.id,
          linkman: that.form.linkman,
          customer_company_name: that.form.customer_company_name,
          detail: JSON.stringify(that.form.tableData),
          price: that.form.price
        })
        .then(response => {
          if (response.status != 200) return false;
          that.$emit("refresh");
          that.close();
        })
        .catch(err => {});
    },
    close() {
      this.$store.commit("changeModal", "customerService");
    }
  },
  computed: {
    ...mapState(["customerService"])
  },
  watch: {
    customerService(val, oldVal) {
      if (val) this.form.linkman = this.active.customer_linkman;
    },
    form: {
      handler(val, oldVal) {
        // 处理表格数据
        let e = val.tableData[val.tableData.length - 1];
        if (e.name && e.number && e.price)
          this.form.tableData.push({
            name: "",
            number: "",
            price: ""
          });
        // 更新报价
        this.form.price = this.form.tableData.sum();
      },
      deep: true
    }
  }
};
</script>
<style lang="less">
#applyService {
}
</style>
