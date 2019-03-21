<template>
  <div>
    <div
      class="modal fade bs-example-modal-lg"
      role="dialog"
      id="addSupplier"
      aria-labelledby="myLargeModalLabel"
    >
      <div class="modal-dialog modal-lg" style="width: 100%;max-width: 1280px;" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" style="font-size: 2.7rem;">&times;</span>
            </button>
            <h4 class="modal-title">添加供应商</h4>
          </div>
          <div class="modal-body">
            <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="100px">
              <p class="lead">基本信息</p>
              <el-form-item label="供应商名称" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="供应商简称" prop="abbreviation">
                <el-input v-model="form.abbreviation"></el-input>
              </el-form-item>
              <el-form-item label="供应商类型" prop="type">
                <el-input v-model="form.type"></el-input>
              </el-form-item>
              <el-form-item label="供应产品" prop="goods">
                <el-input v-model="form.goods"></el-input>
              </el-form-item>
              <el-form-item label="供应商状态" prop="status">
                <el-input v-model="form.status"></el-input>
              </el-form-item>
              <el-form-item label="区域" prop="region">
                <el-input v-model="form.region"></el-input>
              </el-form-item>
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
              <el-form-item label="座机电话" prop="phone">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
              <el-form-item label="传真" prop="fax">
                <el-input v-model="form.fax"></el-input>
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

              <p class="lead">联系人信息</p>
              <div class="linkManItem" v-for="(item, index) in form.items" :key="index">
                <el-form-item label="联系人" prop="items.linkman">
                  <el-input v-model="item.linkman"></el-input>
                </el-form-item>
                <el-form-item label="职务" prop="items.work">
                  <el-input v-model="item.work"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="items.mobile">
                  <el-input v-model="item.mobile"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="items.email">
                  <el-input v-model="item.email"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="danger" size="mini" @click="form.items.splice(index, 1)">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </el-form-item>
              </div>
              <el-button 
                class="widthFull" 
                type="info" 
                size="mini" 
                style="margin-bottom: 20px;"
                @click="form.items.push({ linkman: '', work: '', mobile: '', email: '' })">+ 添加</el-button>
              
              <p class="lead">其他</p>
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
              <el-form-item label="开户行" prop="account_bank">
                <el-input v-model="form.account_bank"></el-input>
              </el-form-item>
              <el-form-item label="银行账户号" prop="bank_account_number">
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
              <el-form-item label="对账日期" prop="reconciliation_date">
                <span>每月</span>
                <el-select style="width: 60%;" v-model="form.reconciliation_date">
                  <el-option v-for="item in date" :key="item" :value="item"></el-option>
                </el-select>
                <span>日</span>
              </el-form-item>
              <el-form-item label="开票日期" prop="invoice_date">
                <span>每月</span>
                <el-select style="width: 60%;" v-model="form.invoice_date">
                  <el-option v-for="item in date" :key="item" :value="item"></el-option>
                </el-select>
                <span>日</span>
              </el-form-item>
              <el-form-item label="合同条款" prop="contracTerms">
                <el-button size="mini" @click="createTerms">编辑条款</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade" 
      role="dialog" 
      id="addContract"
      aria-labelledby="myLargeModalLabel">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div id="addToolbar"></div>
            <div id="addEditor"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";

export default {
  name: "addSupplier",
  data() {
    let i = 1,date = [];
    while(i < 32) {
      date.push(i);
      ++i;
    }
    return {
      date: date,
      form: {
        name: "",
        abbreviation: "",
        items: [
          {
            linkman: "",
            work: "",
            mobile: "",
            email: "",
          }
        ],
        address: "",
        type: "",
        status: "",
        region: "",
        phone: "",
        fax: "",
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
        account_period_type: "",
        reconciliation_date: 1,
        invoice_date: 1,
        account_period_type: ""
      },
      rules: {
        name: [
          { required: true, message: "请填写供应商名称", trigger: "blur" }
        ],
        abbreviation: [
          { required: true, message: "请填写供应商简称", trigger: "blur" }
        ],
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
  props: {
    id: Number,
    row: Object
  },
  methods: {
    createTerms() {
      $("#addContract").modal("show");
    },
    onSubmit() {
      let that = this,
        url = that.id ? `procurement/supplier/edit/${that.id}` : `procurement/supplier/create`;
        console.log(url)
      this.$refs["form"].validate(v => {
        if (!v) return false;
        that
          .$post(url, that.form)
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.$refs["form"].resetFields();
            that.editor.setData(`
              <p>合同条款：</p>
              <ul>
                <li>1、收到订单后必须在当天签回，否则将视为供方已默认收到磁采购订单；</li>
                <li>2、送货单请详细填写采购单号、产品料号、品名规格、数量（勿填价格）等；</li>
                <li>3、必须按期保质保量交换，因逾期交货或品质问题影响需方产生进度的，则当天扣除按该订单总货款的0.1%，未如期完成对账及发票开具的，将延至下月付款；</li>
                <li>4、廉政条约：如发现我司员工与供应商有利益关系，立即取消供应商资格，并扣除所有货款。</li>
              </ul>
            `);
          })
          .catch(err => console.error(err));
      });
    },
    close() {
      $("#addSupplier").modal("hide");
    },
    initCKEditor() {
      const that = this;
      class UploadAdapter {
        constructor(loader) {
          this.loader = loader;
        }
        upload() {
          //重置上传路径
          return new Promise((resolve, reject) => {
            let form = new FormData();
            form.append('imageFile', this.loader.file);
            console.log(form);
          });
        }
        abort() {}
      }
      //初始化编辑器
      CKEditor.create(document.querySelector("#addEditor"), {
        removePlugins: ["MediaEmbed"], //除去视频按钮
        language: "zh-cn", // 中文
        ckfinder: {
          uploaded: 1,
          url: "/"
          // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
        }
      })
        .then(editor => {
          const toolbarContainer = document.querySelector("#addToolbar");
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
          // 加载了适配器
          editor.plugins.get("FileRepository").createUploadAdapter = loader => {
            return new UploadAdapter(loader);
          };
          this.editor = editor; // 将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
          this.editor.setData(this.form.contracTerms || `
            <p>合同条款：</p>
            <ul>
              <li>1、收到订单后必须在当天签回，否则将视为供方已默认收到磁采购订单；</li>
              <li>2、送货单请详细填写采购单号、产品料号、品名规格、数量（勿填价格）等；</li>
              <li>3、必须按期保质保量交换，因逾期交货或品质问题影响需方产生进度的，则当天扣除按该订单总货款的0.1%，未如期完成对账及发票开具的，将延至下月付款；</li>
              <li>4、廉政条约：如发现我司员工与供应商有利益关系，立即取消供应商资格，并扣除所有货款。</li>
            </ul>
          `);
        })
        .catch(error => console.error(error));
    },
  },
  mounted() {
    this.initCKEditor();
    $('#purchaseSupplier #addSupplier').on('shown.bs.modal', () => (this.form = this.row))
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
        width: 25%;
        .el-date-editor {
          width: 100% !important;
        }
        &:last-child {
          width: 100%;
          text-align: center;
          .el-form-item__content {
            margin-left: 0px !important;
          }
        }
      }
      .linkManItem {
        width: 100%;
        display: flex;
        .el-form-item {
          width: 23%;
          &:last-child {
            width: 8%;
          }
        }
      }
    }
  }
}
</style>
