<template>
  <transition name="el-fade-in-linear">
    <div id="addShipment" v-show="addShipmentModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">添加出货单</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form label-position="top" :model="form">
              <el-form-item label="客户名称" prop="customer_name">
                <el-input v-model="form.customer_name" placeholder="客户名称"></el-input>
              </el-form-item>
              <!-- <el-form-item label="总金额" prop="total_amount">
                <el-input v-model="form.total_amount" placeholder="总金额"></el-input>
              </el-form-item>-->
              <el-form-item label="发货日期" prop="ship_date">
                <el-date-picker v-model="form.ship_date" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="业务员" prop="salesman">
                <el-input v-model="form.salesman" placeholder="业务员"></el-input>
              </el-form-item>
              <el-form-item label="发货方式" prop="ship_method">
                <el-input v-model="form.ship_method" placeholder="发货方式"></el-input>
              </el-form-item>
              <el-form-item label="发货地址" prop="ship_address">
                <el-input v-model="form.ship_address" placeholder="发货地址"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="consignee">
                <el-input v-model="form.consignee" placeholder="联系人"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="form.mobile" placeholder="手机"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" placeholder="电话"></el-input>
              </el-form-item>
              <!-- <el-form-item label="地址" prop="address">
                <el-input v-model="form.address" placeholder="地址"></el-input>
              </el-form-item>-->
              <!-- <el-form-item label="收款金额" prop="receipt_amount">
                <el-input v-model="form.receipt_amount" placeholder="收款金额"></el-input>
              </el-form-item>-->
              <p class="lead widthFull">快递信息</p>
              <el-form-item label="收件人地址" prop="receipt_address">
                <el-input v-model="form.receipt_address" placeholder="收件人地址"></el-input>
              </el-form-item>
              <el-form-item label="收件人手机" prop="receipt_mobile">
                <el-input v-model="form.receipt_mobile" placeholder="收件人手机"></el-input>
              </el-form-item>
              <el-form-item label="收件人姓名" prop="receipt_name">
                <el-input v-model="form.receipt_name" placeholder="收件人姓名"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" placeholder="备注"></el-input>
              </el-form-item>
              <el-form-item label="货物" prop="items" size="mini">
                <el-table :data="form.items">
                  <el-table-column v-for="(col, index) in columns" :key="index" :label="col.label">
                    <template slot-scope="{ row,$index }">
                      <el-input v-model="row[col.value]" :placeholder="col.label"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="{ row,$index }">
                      <el-button type="text" size="small" @click="form.items.splice($index,1)">删除</el-button>
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
import { mapState } from "vuex";
export default {
  name: "addShipment",
  data() {
    return {
      form: {
        customer_name: this.shipment.customer_name,
        total_amount: undefined,
        ship_date: "",
        salesman: this.shipment.salesman,
        ship_method: "",
        ship_address: "",
        consignee: "",
        mobile: "",
        phone: "",
        address: "",
        receipt_amount: undefined,
        receipt_address: this.shipment.receipt_address,
        receipt_mobile: this.shipment.mobile,
        receipt_name: "",
        remark: "",
        items: [
          {
            order_id: "",
            order_no: "",
            item_code: "",
            item_name: "",
            item_unit: "",
            item_num: "",
            customer_goods_no: "",
            customer_order_no: "",
            remark: ""
          }
        ]
      },
      columns: [
        {
          label: "序号",
          value: "order_id"
        },
        {
          label: "订单号",
          value: "order_no"
        },
        {
          label: "料品编码",
          value: "item_code"
        },
        {
          label: "品名/规格",
          value: "item_name"
        },
        {
          label: "单位",
          value: "item_unit"
        },
        {
          label: "数量",
          value: "item_num"
        },
        {
          label: "客户货号",
          value: "customer_goods_no"
        },
        {
          label: "客户订单号",
          value: "customer_order_no"
        },
        {
          label: "备注",
          value: "remark"
        }
      ]
    };
  },
  props: {
    shipment: Object,
    goods: Array
  },
  methods: {
    onSubmit() {
      let that = this;
      that.form.items.forEach((e, k) => {
        if (
          !e.order_id &&
          !e.order_no &&
          !e.item_code &&
          !e.item_name &&
          !e.item_unit &&
          !e.item_num &&
          !e.customer_goods_no &&
          !e.customer_order_no &&
          !e.remark
        )
          that.form.items.splice(k, 1);
      });
      if (!that.form.customer_name) {
        this.$message({ message: "客户名称为必填", type: "error" });
        return false;
      } else if (!that.form.ship_date) {
        this.$message({ message: "发货日期为必填", type: "error" });
        return false;
      } else if (!that.form.salesman) {
        this.$message({ message: "业务员为必填", type: "error" });
        return false;
      } else if (!that.form.consignee) {
        this.$message({ message: "联系人为必填", type: "error" });
        return false;
      } else if (!that.form.mobile) {
        this.$message({ message: "手机为必填", type: "error" });
        return false;
      } else if (!that.form.receipt_address) {
        this.$message({ message: "收件人地址为必填", type: "error" });
        return false;
      } else if (!that.form.items.length) {
        this.$message({ message: "发货物件为必填", type: "error" });
        that.form.items = [
          {
            order_id: "",
            order_no: "",
            item_code: "",
            item_name: "",
            item_unit: "",
            item_num: "",
            customer_goods_no: "",
            customer_order_no: "",
            remark: ""
          }
        ];
        return false;
      }
      that
        .$post(`ship_order/create`, {
          customer_name: that.form.customer_name,
          total_amount: that.form.total_amount,
          ship_date: that.dateParse(that.form.ship_date),
          salesman: that.form.salesman,
          ship_method: that.form.ship_method,
          ship_address: that.form.ship_address,
          consignee: that.form.consignee,
          mobile: that.form.mobile,
          phone: that.form.phone,
          // address: that.form.address,
          receipt_amount: that.form.receipt_amount,
          receipt_address: that.form.receipt_address,
          receipt_mobile: that.form.receipt_mobile,
          receipt_name: that.form.receipt_name,
          remark: that.form.remark,
          items: JSON.stringify(that.form.items)
        })
        .then(response => {
          if (response.status != 200) return false;
          that.clearForm();
          that.close();
          that.$emit("refresh");
        })
        .catch(err => {});
    },
    clearForm() {
      this.form = {
        customer_name: "",
        total_amount: "",
        ship_date: "",
        salesman: "",
        ship_method: "",
        ship_address: "",
        consignee: "",
        mobile: "",
        phone: "",
        address: "",
        receipt_amount: "",
        receipt_address: "",
        receipt_mobile: "",
        receipt_name: "",
        items: [
          {
            order_id: "",
            order_no: "",
            item_code: "",
            item_name: "",
            item_unit: "",
            item_num: "",
            customer_goods_no: "",
            customer_order_no: "",
            remark: ""
          }
        ]
      };
    },
    close() {
      this.$store.commit("changeModal", "addShipmentModal");
    }
  },
  computed: mapState(["addShipmentModal"]),
  watch: {
    addShipmentModal(val) {
      if (!val) return false;
      this.clearForm();

      this.form.customer_name = this.shipment.customer_name;
      this.form.salesman = this.shipment.salesman;
      this.form.receipt_name = this.shipment.customer_name;
      this.form.receipt_mobile = this.shipment.mobile;
      this.form.receipt_address = this.shipment.receipt_address;

      this.goods.forEach(e => this.form.items.unshift(e));
      console.log(this.goods);
    },
    form: {
      handler(val, old) {
        let item = val.items[val.items.length - 1];
        if (
          item.order_id &&
          item.order_no &&
          item.item_code &&
          item.item_name &&
          item.item_unit &&
          item.item_num &&
          item.customer_goods_no &&
          item.customer_order_no &&
          item.remark
        )
          this.form.items.push({
            order_id: "",
            order_no: "",
            item_code: "",
            item_name: "",
            item_unit: "",
            item_num: "",
            customer_goods_no: "",
            customer_order_no: "",
            remark: ""
          });
      },
      deep: true
    }
  }
};
</script>
<style lang="less">
#addShipment {
  .modalBoxMain {
    width: 1200px;
    max-width: 100%;
    .modalBoxMainContent {
      height: 600px;
      overflow: auto;
      > .el-form {
        display: flex;
        flex-wrap: wrap;
        > .el-form-item {
          box-sizing: border-box;
          width: 50%;
          margin-bottom: 1rem;
          padding-right: 1rem;
          &:last-child {
            margin-bottom: 0;
            width: 100%;
          }
          .el-form-item__label {
            margin-bottom: 0;
          }
          .el-date-editor {
            width: 100%;
          }
        }
        .widthFull {
          width: 100%;
          margin-bottom: 0px;
        }
      }
    }
  }
}
</style>
