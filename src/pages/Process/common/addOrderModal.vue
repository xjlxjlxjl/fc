<template>
  <transition name="el-fade-in-linear">
    <div id="addOrderModal" v-show="addOrderModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">新增订单</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form :model="form" ref="form" :rules="rules">
              <el-form-item label="收货人" prop="consignee">
                <el-select
                  v-model="form.consignee"
                  placeholder="收货人"
                  :filterable="true"
                  :remote="true"
                  :remote-method="customers"
                  no-match-text="查找不到该客户"
                  no-data-text="无客户"
                  @change="setCustomers"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
                <!-- <el-input type="text" v-model="form.consignee" placeholder="收货人"></el-input> -->
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input type="text" v-model="form.mobile" placeholder="手机号"></el-input>
              </el-form-item>
              <el-form-item label="地址" prop="address">
                <el-input type="text" v-model="form.address" placeholder="地址"></el-input>
              </el-form-item>
              <el-form-item label="交期" prop="delivery_period">
                <el-date-picker v-model="form.delivery_period" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <!-- <el-form-item label="用户id">
                <el-input type="text" v-model="form.member_id" placeholder="用户id"></el-input>
              </el-form-item>-->
              <el-form-item label="发票类型">
                <el-select v-model="form.invoice_type_id">
                  <el-option
                    v-for="item in invoiceType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="付款方式">
                <el-select v-model="form.payment_type_id">
                  <el-option
                    v-for="item in paymenType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input type="text" v-model="form.remark" placeholder="备注"></el-input>
              </el-form-item>
              <el-form-item label="产品">
                <el-table :data="form.products">
                  <el-table-column
                    v-for="col in columns"
                    :prop="col.label"
                    :key="col.label"
                    :label="col.name"
                  >
                    <template slot-scope="{ row, $index }">
                      <el-input v-model="row[col.label]" :placeholder="col.name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="是否库存">
                    <template slot-scope="{ row, $index }">
                      <el-radio-group v-model="row.is_stock">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                      </el-radio-group>
                    </template>
                  </el-table-column>
                </el-table>
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
  name: "addOrderModal",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      form: {
        delivery_period: "",
        member_id: "",
        consignee: "",
        consignee_id: "",
        mobile: "",
        address: "",
        invoice_type_id: "",
        payment_type_id: "",
        remark: "",
        products: [
          {
            product_id: "",
            product_model: "",
            product_name: "",
            product_specification: "",
            quantity: "",
            price: "",
            is_stock: 1
          }
        ]
      },
      columns: [
        {
          label: "product_id",
          name: "产品编号"
        },
        {
          label: "product_model",
          name: "产品型号"
        },
        {
          label: "product_name",
          name: "产品名字"
        },
        {
          label: "product_specification",
          name: "产品说明"
        },
        {
          label: "quantity",
          name: "数量"
        },
        {
          label: "price",
          name: "价格"
        }
      ],
      rules: {
        consignee: [
          { required: true, message: "请输入收货人", trigger: "blur" }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        delivery_period: [
          { required: true, message: "请输入交期", trigger: "blur" }
        ],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }]
      },
      options: []
    };
  },
  methods: {
    ...mapMutations(["setStateData"]),
    getInvoice() {
      if (this.invoiceType.length) return false;
      let that = this;
      that
        .$get(`finance/invoice_types`)
        .then(response => {
          if (response.status != 200) return false;
          that.setStateData({ name: "invoiceType", arr: response.data.list });
        })
        .catch(err => {});
    },
    getPayment() {
      if (this.paymenType.length) return false;
      let that = this;
      that
        .$get(`finance/payment_types`)
        .then(response => {
          if (response.status != 200) return false;
          that.setStateData({ name: "paymenType", arr: response.data.list });
        })
        .catch(err => {});
    },
    onSubmit() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
        let that = this,
          _this = that.form.products[that.form.products.length - 1];
        if (
          !_this.product_id &&
          !_this.product_model &&
          !_this.product_name &&
          !_this.product_specification &&
          !_this.quantity &&
          !_this.price
        )
          that.form.products.pop();

        that
          .$post("orders/company/create", {
            delivery_period: that.dateParse(that.form.delivery_period),
            member_id: that.form.consignee_id,
            consignee: that.form.consignee,
            mobile: that.form.mobile,
            address: that.form.address,
            invoice_type_id: that.form.invoice_type_id || undefined,
            payment_type_id: that.form.payment_type_id || undefined,
            remark: that.form.remark,
            products: JSON.stringify(that.form.products)
          })
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.clearForm();
          })
          .catch(err => {});
      });
    },
    clearForm() {
      this.form = {
        delivery_period: "",
        member_id: "",
        consignee: "",
        mobile: "",
        address: "",
        invoice_type_id: "",
        payment_type_id: "",
        remark: "",
        products: [
          {
            product_id: "",
            product_model: "",
            product_name: "",
            product_specification: "",
            quantity: "",
            price: "",
            is_stock: 0
          }
        ]
      };
    },
    close() {
      this.$store.commit("changeModal", "addOrderModal");
    },
    customers(query) {
      let that = this;
      that
        .$get(`customers`, {
          name: query
        })
        .then(response => {
          if (response.status != 200) return false;
          that.options = response.data.list;
        })
        .catch(err => console.error(err));
    },
    setCustomers(item) {
      this.form.consignee = item.name;
      this.form.consignee_id = item.id;
      this.form.mobile = item.mobile || item.phone;
      this.form.address = item.region.address + item.detailed_address;
    }
  },
  computed: mapState(["invoiceType", "paymenType", "addOrderModal"]),
  watch: {
    form: {
      handler(val) {
        let _this = val.products[val.products.length - 1];
        if (
          _this.product_id &&
          _this.product_model &&
          _this.product_name &&
          _this.product_specification &&
          _this.quantity &&
          _this.price
        )
          this.form.products.push({
            product_id: "",
            product_model: "",
            product_name: "",
            product_specification: "",
            quantity: "",
            price: "",
            is_stock: 0
          });
      },
      deep: true
    }
  },
  created() {
    this.getInvoice();
    this.getPayment();
  }
};
</script>
<style lang="less">
#addOrderModal {
  .modalBoxMain {
    width: 800px;
    max-width: 100%;
    .modalBoxMainContent {
      height: 400px;
      overflow-y: auto;
      .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 50%;
          box-sizing: border-box;
          padding: 0 5px;
          margin-bottom: 0;
          .el-select,
          .el-radio-group,
          .el-date-editor {
            width: 100%;
          }
          &:last-child {
            width: 100%;
            .el-table__row {
              .el-radio {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
