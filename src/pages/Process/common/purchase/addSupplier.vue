<template>
  <div
    class="modal fade bs-example-modal-lg"
    id="addSupplier"
    tabindex="-1"
    role="dialog"
    aria-labelledby="myLargeModalLabel"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" style="font-size: 2.7rem;">&times;</span>
          </button>
          <h4 class="modal-title">添加供应商</h4>
        </div>
        <div class="modal-body">
          <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="100px">
            <el-form-item label="供应商名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="供应商简称" prop="abbreviation">
              <el-input v-model="form.abbreviation"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="form.linkman"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-input v-model="form.type"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-input v-model="form.status"></el-input>
            </el-form-item>
            <el-form-item label="区域" prop="region">
              <el-input v-model="form.region"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="传真" prop="fax">
              <el-input v-model="form.fax"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="网址" prop="website">
              <el-input v-model="form.website"></el-input>
            </el-form-item>
            <el-form-item label="物流编码" prop="logistics_code">
              <el-input v-model="form.logistics_code"></el-input>
            </el-form-item>
            <el-form-item label="等级" prop="grade">
              <el-input v-model="form.grade"></el-input>
            </el-form-item>
            <el-form-item label="法定代表人" prop="legal_representative">
              <el-input v-model="form.legal_representative"></el-input>
            </el-form-item>
            <el-form-item label="注册资金" prop="registered_capital">
              <el-input v-model="form.registered_capital"></el-input>
            </el-form-item>
            <el-form-item label="成立日期" prop="establishment_at">
              <el-date-picker
                v-model="form.establishment_at"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="截止日期" prop="due_at">
              <el-date-picker
                v-model="form.due_at"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="营业执照" prop="license">
              <el-input v-model="form.license"></el-input>
            </el-form-item>
            <el-form-item label="送货方式" prop="delivery_method">
              <el-input v-model="form.delivery_method"></el-input>
            </el-form-item>
            <el-form-item label="送货地址" prop="shipping_address">
              <el-input v-model="form.shipping_address"></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="tag">
              <el-input v-model="form.tag"></el-input>
            </el-form-item>
            <el-form-item label="发票抬头" prop="invoice_header">
              <el-input v-model="form.invoice_header"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="account_bank">
              <el-input v-model="form.account_bank"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="bank_account_number">
              <el-input v-model="form.bank_account_number"></el-input>
            </el-form-item>
            <el-form-item label="发票类型" prop="invoice_type">
              <el-input v-model="form.invoice_type"></el-input>
            </el-form-item>
            <el-form-item label="付款条件" prop="terms_of_payment">
              <el-input v-model="form.terms_of_payment"></el-input>
            </el-form-item>
            <el-form-item label="付款方式" prop="payment_method">
              <el-input v-model="form.payment_method"></el-input>
            </el-form-item>
            <el-form-item label="账期类型" prop="account_period_type">
              <el-input v-model="form.account_period_type"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addSupplier",
  data() {
    return {
      form: {
        name: "",
        abbreviation: "",
        linkman: "",
        mobile: "",
        address: "",
        type: "",
        status: "",
        region: "",
        phone: "",
        fax: "",
        email: "",
        website: "",
        logistics_code: "",
        grade: "",
        legal_representative: "",
        registered_capital: "",
        establishment_at: "",
        due_at: "",
        license: "",
        delivery_method: "",
        shipping_address: "",
        tag: "",
        invoice_header: "",
        account_bank: "",
        bank_account_number: "",
        invoice_type: "",
        terms_of_payment: "",
        payment_method: "",
        account_period_type: ""
      },
      rules: {
        name: [
          { required: true, message: "请填写供应商名称", trigger: "blur" }
        ],
        abbreviation: [
          { required: true, message: "请填写供应商简称", trigger: "blur" }
        ],
        linkman: [{ required: true, message: "请填写联系人", trigger: "blur" }],
        mobile: [{ required: true, message: "请填写手机号", trigger: "blur" }],
        address: [{ required: true, message: "请填写地址", trigger: "blur" }],
        type: [],
        status: [],
        region: [],
        phone: [],
        fax: [],
        email: [],
        website: [],
        logistics_code: [],
        grade: [],
        legal_representative: [],
        registered_capital: [],
        establishment_at: [],
        due_at: [],
        license: [],
        delivery_method: [],
        shipping_address: [],
        tag: [],
        invoice_header: [],
        account_bank: [],
        bank_account_number: [],
        invoice_type: [],
        terms_of_payment: [],
        payment_method: [],
        account_period_type: []
      }
    };
  },
  methods: {
    onSubmit() {
      let that = this;
      this.$refs["form"].validate(v => {
        if (!v) return false;
        that
          .$post(`procurement/supplier/create`, that.form)
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.$refs["form"].resetFields();
          })
          .catch(err => console.error(err));
      });
    },
    close() {
      $("#addSupplier").modal("hide");
    }
  }
};
</script>
<style lang="less">
#addSupplier {
  .modal-content {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 50%;
        &:last-child {
          width: 100%;
          text-align: center;
          .el-form-item__content {
            margin-left: 0px !important;
          }
        }
      }
    }
  }
}
</style>
