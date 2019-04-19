<template>
  <div class="modal fade" id="applyService">
    <div class="modal-dialog" role="document" style="width: 980px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <div id="quotation">
            <el-form :model="form" ref="form" :rules="rules" label-position="left" size="mini" label-width="80px">
              <el-form-item label="客服单号" prop="order_number">
                <el-input v-model="form.order_number"></el-input>
              </el-form-item>
              <el-form-item label="客户公司" prop="customer_company_name">
                <el-input v-model="form.customer_company_name"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="linkman">
                <el-input v-model="form.linkman"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="form.remark"></el-input>
              </el-form-item>
              <el-form-item label="明细" size="mini" style="margin-left: 0;">
                <el-table :data="form.tableData" size="mini">
                  <el-table-column label="序号" width="50px">
                    <template slot-scope="{ $index }">
                      <span>{{ $index + 1 }}</span>
                    </template>
                  </el-table-column>
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
                  <el-table-column width="50px">
                    <template slot-scope="{ $index }">
                      <el-button type="text" @click="form.tableData.splice($index, 1)">
                        <i style="font-size: 2.1rem;" class="el-icon-delete"></i>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
            <el-button type="primary" size="mini" style="width: 100%;" @click="form.tableData.push({ name: '', number: '' })">
              <i class="el-icon-plus"></i>
            </el-button>
          </div>
        </div>
        <div class="modal-footer" style="text-align: center;">
          <el-button size="mini" type="info" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="commit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "applyService",
  data() {
    return {
      form: {
        order_number: "",
        linkman: "",
        customer_company_name: "",
        remark: "",
        tableData: [
          {
            name: "",
            number: ""
          }
        ]
      },
      tableLabel: [
        { label: "料品编号", prop: "code" },
        { label: "规格", prop: "info" },
        { label: "料品名称/费用名称", prop: "name" },
        { label: "单位", prop: "unit" },
        { label: "数量", prop: "number" }
      ],
      rules: {
        order_number: [{ required: true, message: '请填写客服单号', trigger: 'blur' }],
        customer_company_name: [{ required: true, message: '请填写客户公司名', trigger: 'blur' }],
        linkman: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
        mobile: [{ required: true, message: '请填写联系电话', trigger: 'blur' }]
      }
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
      $("#application #applyService").modal("toggle");
      if (!val) return false;
      this.form.order_number = this.active.order_number;
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
  #quotation {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 25%;
        padding-left: 5px;
        padding-right: 5px;
        &:nth-child(5) {
          width: 100%;
        }
        &:last-child {
          width: 100%;
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
