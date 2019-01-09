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
              <el-form :model="form" ref="form" label-position="left" label-width="120px">
                <el-form-item label="联系人" size="mini">
                  <el-input v-model="form.linkman"></el-input>
                </el-form-item>
                <el-form-item label="客户公司" size="mini">
                  <el-input v-model="form.customer_company_name"></el-input>
                </el-form-item>
                <!-- <el-form-item label="价格" size="mini">
                  <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="额外费用" size="mini">
                  <el-table :data="form.other_detail" size="mini" height="150">
                    <el-table-column
                      v-for="(item,index) in other_detail"
                      :prop="item.id"
                      :key="index"
                      :label="item.label"
                    >
                      <template slot-scope="{ row }">
                        <el-input v-model="row[item.prop]" :placeholder="item.label" size="mini"></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>-->
                <el-form-item label="明细" size="mini" style="margin-left: 0;">
                  <el-table :data="form.tableData" size="mini" height="250">
                    <el-table-column
                      v-for="(item,index) in tableLabel"
                      :prop="item.id"
                      :key="index"
                      :label="item.label"
                    >
                      <template slot-scope="{ row }">
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
      form: {
        linkman: "",
        customer_company_name: "",
        // price: "",
        // other_detail: [
        //   {
        //     name: "",
        //     money: ""
        //   }
        // ],
        tableData: [
          {
            name: "",
            number: ""
            // price: ""
          }
        ]
      },
      // other_detail: [
      //   { label: "额外费用名称", prop: "name" },
      //   { label: "额外费用金额", prop: "money" }
      // ],
      tableLabel: [
        { label: "料品编号", prop: "code" },
        { label: "品名", prop: "name" },
        { label: "规格", prop: "info" },
        { label: "单位", prop: "unit" },
        { label: "数量", prop: "number" }
        // { label: "价格", prop: "price" }
      ]
    };
  },
  props: {
    active: Object
  },
  methods: {
    commit() {
      let that = this,
        lastData = that.form.tableData;
      // extend = that.form.other_detail;
      lastData.forEach((e, k) => {
        e.number = parseInt(e.number);
        // e.price = parseFloat(e.price);
        if (!e.name && !e.info && !e.unit && !e.number)
          that.form.tableData.splice(k, 1);
      });
      // extend.forEach((e, k) => {
      //   e.money = parseFloat(e.money);
      //   if (!e.name && !e.money) that.form.other_detail.splice(k, 1);
      // });

      if (!that.form.linkman) {
        that.$message({ message: "客户联系人没有填写", type: "error" });
        return false;
      } else if (!that.form.customer_company_name) {
        that.$message({ message: "客户公司没有填写", type: "error" });
        return false;
      }
      // else if (!that.form.price) {
      //   that.$message({ message: "价格没有填写", type: "error" });
      //   return false;
      // }
      that
        .$post("/service/quoted_price/create", {
          service_id: that.active.id,
          linkman: that.form.linkman,
          customer_company_name: that.form.customer_company_name,
          detail: JSON.stringify(that.form.tableData)
          // other_detail: JSON.stringify(that.form.other_detail),
          // price: that.form.price
        })
        .then(response => {
          if (response.status != 200) return false;
          that.$emit("refresh");
          that.close();
          that.clearForm();
        })
        .catch(err => {});
    },
    clearForm() {
      this.form = {
        linkman: "",
        customer_company_name: "",
        // price: "",
        // other_detail: [
        //   {
        //     name: "",
        //     money: ""
        //   }
        // ],
        tableData: [
          {
            name: "",
            number: ""
            // price: ""
          }
        ]
      };
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
      if (!val) return false;
      this.form.linkman = this.active.customer_linkman;
      this.form.customer_company_name = this.active.customer_company_name;
    },
    form: {
      handler(val, oldVal) {
        // 处理表格数据
        let e = val.tableData[val.tableData.length - 1];
        // p = val.other_detail[val.other_detail.length - 1];
        // if (p.name && p.money)
        // this.form.other_detail.push({ name: "", money: "" });

        if (e.name && e.info && e.unit && e.number)
          this.form.tableData.push({
            name: "",
            info: "",
            unit: "",
            number: ""
            // price: ""
          });
        // 更新报价
        // this.form.price =
        //   this.form.tableData.sum() + this.form.other_detail.sum();
      },
      deep: true
    }
  }
};
</script>
<style lang="less">
#applyService {
  .modalBoxMain {
    width: 800px;
    max-width: 100%;
  }
  #quotation {
    .el-form {
      .el-form-item {
        &:last-child {
          .el-form-item__content {
            margin-left: 0 !important;
            table {
              width: auto !important;
            }
          }
        }
      }
    }
  }
}
</style>
