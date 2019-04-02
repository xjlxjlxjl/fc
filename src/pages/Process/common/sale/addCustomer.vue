<template>
  <div>
    <transition name="el-fade-in-linear">
      <div id="addCustomer" v-show="addCustomer">
        <div class="Curtain"></div>
        <div class="modalBox">
          <div class="modalBoxMain">
            <div class="modalBoxMainHeader">
              <div class="modalBoxMainHeaderTitle">新建客户</div>
              <div class="modalBoxMainHeaderBtn" @click="close">
                <i class="el-message-box__close el-icon-close"></i>
              </div>
            </div>
            <div class="modalBoxMainContent">
              <el-form
                :model="form"
                :rules="rules"
                ref="form"
                size="mini"
                label-width="120px"
                label-position="left"
              >
                <p class="lead widthFull">基本信息</p>
                <el-form-item label="客户公司全称" prop="name">
                  <el-input v-model="form.name" placeholder="客户公司全称"></el-input>
                </el-form-item>
                <el-form-item label="客户简称" prop="abbreviation">
                  <el-input v-model="form.abbreviation" placeholder="客户简称"></el-input>
                </el-form-item>
                <el-form-item label="客户级别">
                  <el-input v-model="form.customer_level" placeholder="客户级别"></el-input>
                </el-form-item>
                <el-form-item label="业务员" prop="salesman">
                  <el-select v-model="form.salesman" placeholder="业务员">
                    <el-option
                      v-for="item in userBranch"
                      :key="item.id"
                      :label="item.display_name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="工商营业执照">
                  <el-input v-model="form.business_license_number" placeholder="工商营业执照"></el-input>
                </el-form-item>
                <el-form-item label="法人代表">
                  <el-input v-model="form.legal_representative" placeholder="法人代表"></el-input>
                </el-form-item>
                <el-form-item label="注册资金">
                  <el-input v-model="form.registered_capital" placeholder="注册资金"></el-input>
                </el-form-item>
                <el-form-item label="成立日期">
                  <el-date-picker
                    v-model="form.establish_at"
                    value-format="yyyy-MM-dd HH:mm"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="网址">
                  <el-input v-model="form.url" placeholder="网址"></el-input>
                </el-form-item>
                <el-form-item label="座机号码">
                  <el-input v-model="form.phone" placeholder="座机号码"></el-input>
                </el-form-item>
                <el-form-item label="传真">
                  <el-input v-model="form.fax" placeholder="传真"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                  <el-input v-model="form.status" placeholder="状态"></el-input>
                </el-form-item>

                <el-form-item label="市场状况">
                  <el-input v-model="form.market_status" placeholder="市场状况"></el-input>
                </el-form-item>
                <el-form-item label="所用产品">
                  <el-input v-model="form.product_used" placeholder="所用产品"></el-input>
                </el-form-item>
                <el-form-item label="年采购量">
                  <el-input v-model="form.purchase_quantity_year" placeholder="年采购量"></el-input>
                </el-form-item>
                <el-form-item label="营业内容">
                  <el-input v-model="form.business_content" placeholder="营业内容"></el-input>
                </el-form-item>

                <el-form-item label="区域">
                  <el-input v-model="form.area" placeholder="区域"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                  <el-input v-model="form.tags" placeholder="标签"></el-input>
                </el-form-item>
                <el-form-item label="备注" class="widthHalf">
                  <el-input v-model="form.remark" placeholder="备注"></el-input>
                </el-form-item>
                <el-form-item label="详细地址" prop="detailed_address" class="widthFull">
                  <input id="suggestId" name="sendAddress" placeholder="详细地址" type="text">
                  <div
                    id="searchResultPanel"
                    style="border: 1px solid #C0C0C0; width: 150px; height: auto;display: none;"
                  ></div>
                </el-form-item>
                <el-form-item class="widthFull" label="地图标注位置" prop="region">
                  <div id="baiduMap"></div>
                </el-form-item>

                <p class="lead widthFull">联系人信息</p>
                <div
                  class="linkManItem widthFull"
                  v-for="(item, key) in form.contact"
                  :key="key.toString()"
                >
                  <el-form-item label="联系人">
                    <el-input v-model="item.name" placeholder="联系人"></el-input>
                  </el-form-item>
                  <el-form-item label="职务" prop="position">
                    <el-input v-model="item.position" placeholder="职务"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="item.mobile" placeholder="手机号"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="item.email" placeholder="邮箱"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="danger" size="mini" @click="form.contact.splice(key, 1)">
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </el-form-item>
                </div>
                <el-button
                  class="widthFull"
                  size="mini"
                  type="info"
                  @click="form.contact.push({ linkman: '', position: '', mobile: '', email: '' })"
                >
                  <i class="el-icon-plus"></i>
                </el-button>

                <p class="lead widthFull">财务资料</p>
                <el-form-item label="开户银行">
                  <el-input v-model="form.bank_account" placeholder="开户银行"></el-input>
                </el-form-item>
                <el-form-item label="账户名">
                  <el-input v-model="form.account_name" placeholder="账户名"></el-input>
                </el-form-item>
                <el-form-item label="账号">
                  <el-input v-model="form.account_number" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item label="税号">
                  <el-input v-model="form.tax_id" placeholder="税号"></el-input>
                </el-form-item>
                <el-form-item label="账期类型">
                  <el-input v-model="form.account_period_type" placeholder="账期类型"></el-input>
                </el-form-item>
                <el-form-item label="付款方式">
                  <el-input v-model="form.payment_type" placeholder="付款方式"></el-input>
                </el-form-item>
                <el-form-item label="发票类型">
                  <el-input v-model="form.invoice_type" placeholder="发票类型"></el-input>
                </el-form-item>
                <el-form-item label="发票抬头">
                  <el-input v-model="form.invoice_head" placeholder="发票抬头"></el-input>
                </el-form-item>

                <p class="lead widthFull">付款条件</p>
                <div
                  class="payment_terms widthFull"
                  v-for="(item, key) in form.payment_terms"
                  :key="'info2-' + key.toString()"
                >
                  <el-form-item :label="'付款条件' + ( key + 1 )">
                    <el-input 
                      :value="item.text"
                      @focus="editPayment(key)" 
                      placeholder="付款条件"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="danger" @click="form.payment_terms.splice(key, 1)">
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </el-form-item>
                </div>
                <el-button
                  size="mini"
                  type="info"
                  class="widthFull"
                  @click="payMentShow = !payMentShow"
                >
                  <i class="el-icon-plus"></i>
                </el-button>

                <p class="lead widthFull">物流信息</p>
                <el-form-item label="邮政编码">
                  <el-input v-model="form.logistics_code" placeholder="邮政编码"></el-input>
                </el-form-item>
                <el-form-item label="送货方式">
                  <el-input v-model="form.delivery_methods" placeholder="送货方式"></el-input>
                </el-form-item>
                <el-form-item label="交货地址">
                  <el-input v-model="form.delivery_address" placeholder="交货地址"></el-input>
                </el-form-item>

                <p class="lead widthFull">合同信息</p>
                <el-form-item label="合同模板">
                  <el-button type="info" @click="editContract(true)">编辑条款</el-button>
                </el-form-item>

                <p class="lead widthFull">商务记录</p>
                <el-form-item label="最近联系日期">
                  <el-date-picker
                    v-model="form.recent_contacts_at"
                    value-format="yyyy-MM-dd HH:mm"
                    type="date"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="近一次联系记录">
                  <el-input v-model="form.recent_contacts_record" placeholder="近一次联系记录"></el-input>
                </el-form-item>
                <el-form-item label="最近服务日期">
                  <el-date-picker
                    v-model="form.recent_service_at"
                    value-format="yyyy-MM-dd HH:mm"
                    type="date"
                    placeholder="最近服务日期"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="最近出货日期">
                  <el-date-picker
                    v-model="form.recent_shipping_at"
                    value-format="yyyy-MM-dd HH:mm"
                    type="date"
                    placeholder="最近出货日期"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <div class="modalBoxMainBtn">
              <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- 付款条件 -->
    <div class="modal fade" id="payMentModal" role="dialog" >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div class="terms">
              <div>
                <b>定金</b>
                <p>合同签订后，付
                  <input type="text" v-model="payMenTerms.deposit.pay_rate"> %订单总额
                </p>
              </div>
              <div>
                <div>
                  <b>出货前</b>
                  <p>出货前，付
                    <input type="text" v-model="payMenTerms.shipment_before.pay_rate"> %订单总额
                  </p>
                </div>
                <div>
                  <b>出货后</b>
                  <p v-for="(item, index) in payMenTerms.shipment_after" :key="index">出货后
                    <input type="text" v-model="item.day"> 天，付
                    <input type="text" v-model="item.pay_rate"> %订单总额
                    <i class="el-icon-delete" @click="payMenTerms.shipment_after.splice(index, 1)"></i>
                  </p>
                  <el-button size="mini" type="info" @click="payMenTerms.shipment_after.push({ day: '', pay_rate: '' })">
                    <i class="el-icon-plus"></i> 添加
                  </el-button>
                </div>
              </div>
              <div>
                <div>
                  <b>验收后</b>
                  <p v-for="(item, index) in payMenTerms.accept_after" :key="index">验收后
                    <input type="text" v-model="item.day"> 天，付
                    <input type="text" v-model="item.pay_rate"> %订单总额
                    <i class="el-icon-delete" @click="payMenTerms.accept_after.splice(index, 1)"></i>
                  </p>
                  <el-button size="mini" type="info" @click="payMenTerms.accept_after.push({ day: '', pay_rate: '' })">
                    <i class="el-icon-plus"></i> 添加
                  </el-button>
                </div>
                <div>
                  <b>验收后</b>
                  <p>验收后
                    <input type="text" v-model="payMenTerms.accept_after_balance.day"> 天，付清订单余款
                    <input type="text" v-model="payMenTerms.accept_after_balance.pay_rate"> %
                  </p>
                </div>
              </div>
              <div>
                <div>
                  <b>开票后</b>
                  <p v-for="(item, index) in payMenTerms.billing_after" :key="index">开票后
                    <input type="text" v-model="item.day"> 天，付
                    <input type="text" v-model="item.pay_rate"> %订单总额
                    <i class="el-icon-delete" @click="payMenTerms.billing_after.splice(index, 1)"></i>
                  </p>
                  <el-button size="mini" type="info" @click="payMenTerms.billing_after.push({ day: '', pay_rate: '' })">
                    <i class="el-icon-plus"></i> 添加
                  </el-button>
                </div>
                <div>
                  <b>开票后</b>
                  <p>开票后
                    <input type="text" v-model="payMenTerms.billing_after_balance.day"> 天，付清订单余款
                    <input type="text" v-model="payMenTerms.billing_after_balance.pay_rate"> %
                  </p>
                </div>
              </div>
            </div>
            <div align="center" style="margin-top: 1rem;">
              <el-button size="small" type="info" data-dismiss="modal">取消</el-button>
              <el-button size="small" type="primary" @click="addPayment">保存</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑条款 -->
    <div class="modal fade editContract" role="dialog" >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div id="toolbar-container"></div>
            <div id="editor"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";

export default {
  name: "addCustomer",
  data() {
    return {
      userBranch: [],
      form: {
        name: "",
        abbreviation: "",
        detailed_address: "",
        logistics_code: "",
        account_period_type: "",
        region: {
          address: "",
          x: "",
          y: ""
        },
        contact: [
          {
            name: "",
            position: "",
            mobile: "",
            email: ""
          }
        ],
        customer_level: "",
        bank_account: "",
        account_name: "",
        account_number: "",
        tax_id: "",
        salesman: "",
        primary_contact: "",
        phone: "",
        fax: "",
        invoice_type: "",
        payment_terms: [],
        payment_type: "",
        business_license_number: "",
        url: "",
        delivery_methods: "",
        delivery_address: "",
        remark: "",
        status: "",
        invoice_head: "",
        legal_representative: "",
        registered_capital: "",
        establish_at: "",
        recent_contacts_at: "",
        recent_contacts_record: "",
        recent_service_at: "",
        recent_shipping_at: "",
        tags: "",
        area: "",
        market_status: "",
        product_used: "",
        purchase_quantity_year: "",
        business_content: "",
        enabled: 1
      },
      rules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        abbreviation: [{ required: true, message: "请输入客户简称", trigger: "blur" }],
        detailed_address: [{ message: "请输入详细地址", trigger: "blur" }],
        // primary_contact: [
        //   { required: true, message: "请输入联系人", trigger: "blur" }
        // ],
        // mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        salesman: [{ required: true, message: "请选择业务员", trigger: "blur" }]
        // region: {
        //   address: [
        //     { required: true, message: "请在地图选择地点", trigger: "blur" }
        //   ],
        //   x: [{ required: true, message: "请在地图选择地点", trigger: "blur" }],
        //   y: [{ required: true, message: "请在地图选择地点", trigger: "blur" }]
        // }
      },
      map: null,
      payMentShow: false,
      payMenTerms: {
        deposit: {
          pay_rate: ''
        },
        shipment_before: {
          pay_rate: ''
        },
        shipment_after: [
          {
            day: '',
            pay_rate: ''
          }
        ],
        accept_after: [
          {
            day: '',
            pay_rate: ''
          }
        ],
        accept_after_balance: {
          day: '',
          pay_rate: ''
        },
        billing_after: [
          {
            day: '',
            pay_rate: ''
          }
        ],
        billing_after_balance: {
          day: '',
          pay_rate: ''
        }
      }
    };
  },
  props: {
    rows: Object
  },
  methods: {
    ...mapMutations(["getUserBranch"]),
    onSubmit() {
      if ($("#suggestId").val())
        this.form.detailed_address = $("#suggestId").val();
      else {
        this.$message({ message: "请输入地址", type: "error" });
        return false;
      }
      this.$refs["form"].validate(v => {
        if (!v) return false;
        let that = this, url = this.rows.id ? `customers/edit` : `customers/create`,
          contact = [];
        for (let e of that.form.contact) {
          if (
            e.name && 
            e.position && 
            e.mobile
          )
            contact.push(e);
        }
        if (!contact.length) {
          that.$message({ message: "至少要有一个联系人", type: "error" });
          return false;
        }

        that
          .$post(url, {
            name: that.form.name,
            customer_level: that.form.customer_level,
            bank_account: that.form.bank_account,
            account_name: that.form.account_name,
            account_number: that.form.account_number,
            tax_id: that.form.tax_id,
            salesman: that.form.salesman,
            primary_contact: that.form.primary_contact,
            phone: that.form.phone,
            fax: that.form.fax,
            invoice_type: that.form.invoice_type,
            payment_terms: JSON.stringify(that.form.payment_terms),
            payment_type: that.form.payment_type,
            business_license_number: that.form.business_license_number,
            url: that.form.url,
            delivery_methods: that.form.delivery_methods,
            delivery_address: that.form.delivery_address,
            remark: that.form.remark,
            status: that.form.status,
            invoice_head: that.form.invoice_head,
            legal_representative: that.form.legal_representative,
            registered_capital: that.form.registered_capital,
            establish_at: that.form.establish_at ? that.miniDateParse(new Date(that.form.establish_at)) : undefined,
            recent_contacts_at: that.form.recent_contacts_at ? that.miniDateParse(new Date(that.form.recent_contacts_at)) : undefined,
            recent_contacts_record: that.form.recent_contacts_record,
            recent_service_at: that.form.recent_service_at ? that.miniDateParse(new Date(that.form.recent_service_at)) : undefined,
            recent_shipping_at: that.form.recent_shipping_at ? that.miniDateParse(new Date(that.form.recent_shipping_at)) : undefined,
            tags: that.form.tags,
            detailed_address: that.form.detailed_address,
            account_period_type: that.form.account_period_type,
            logistics_code: that.form.logistics_code,
            region: that.form.region,
            enabled: that.form.enabled,
            market_status: that.form.market_status,
            product_used: that.form.product_used,
            purchase_quantity_year: that.form.purchase_quantity_year,
            business_content: that.form.business_content,
            contact: JSON.stringify(contact),
            abbreviation: that.form.abbreviation,
            area: that.form.area,
            contract_terms: that.editor.getData(),
            slug: that.rows.slug || undefined
          })
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.clearForm();
          })
          .catch(err => console.error(err));
      });
    },
    getBranch() {
      if (this.$store.state.userBranch.length)
        this.$store.state.userBranch.forEach(e =>
          e.member.forEach(v => this.userBranch.push(v))
        );
      else {
        let that = this;
        that
          .$get(`members/company/branch`, {})
          .then(response => {
            if (response.status != 200) return false;
            response.data.list.forEach(e =>
              e.member.forEach(v => that.userBranch.push(v))
            );
            that.getUserBranch(response.data.list);
          })
          .catch(err => console.error(err));
      }
    },
    clearForm() {
      this.form = {
        name: "",
        abbreviation: "",
        detailed_address: "",
        logistics_code: "",
        account_period_type: "",
        region: {
          address: "",
          x: "",
          y: ""
        },
        contact: [
          {
            name: "",
            position: "",
            mobile: "",
            email: ""
          }
        ],
        customer_level: "",
        bank_account: "",
        account_name: "",
        account_number: "",
        tax_id: "",
        salesman: "",
        primary_contact: "",
        phone: "",
        fax: "",
        invoice_type: "",
        payment_terms: [],
        payment_type: "",
        business_license_number: "",
        url: "",
        delivery_methods: "",
        delivery_address: "",
        remark: "",
        status: "",
        invoice_head: "",
        legal_representative: "",
        registered_capital: "",
        establish_at: "",
        recent_contacts_at: "",
        recent_contacts_record: "",
        recent_service_at: "",
        recent_shipping_at: "",
        tags: "",
        area: "",
        market_status: "",
        product_used: "",
        purchase_quantity_year: "",
        business_content: "",
        enabled: 1
      };
      this.editor.setData(`
        <p>合同条款：</p>
        <ul>
          <li>1、收到订单后必须在当天签回，否则将视为供方已默认收到磁采购订单；</li>
          <li>2、送货单请详细填写采购单号、产品料号、品名规格、数量（勿填价格）等；</li>
          <li>3、必须按期保质保量交换，因逾期交货或品质问题影响需方产生进度的，则当天扣除按该订单总货款的0.1%，未如期完成对账及发票开具的，将延至下月付款；</li>
          <li>4、廉政条约：如发现我司员工与供应商有利益关系，立即取消供应商资格，并扣除所有货款。</li>
        </ul>
      `);
    },
    close() {
      this.$store.commit("changeModal", "addCustomer");
    },
    addPayment() {
      let text = '',
        self = this.payMenTerms;
      if (self.deposit.pay_rate) text += `合同签订后，付 ${self.deposit.pay_rate} %订单总额;`;
      if (self.shipment_before.pay_rate) text += `出货前，付 ${self.shipment_before.pay_rate} %订单总额;`;
      if (self.shipment_after.length) 
        self.shipment_after.forEach(e => {
          if (e.pay_rate) text += `出货后 ${e.day} 天，付 ${e.pay_rate} %订单总额;`;
        })
      if (self.accept_after.length)
        self.accept_after.forEach(e => {
          if (e.pay_rate) text += `验收后 ${e.day} 天，付 ${e.pay_rate} %订单总额;`;
        })
      if (self.accept_after_balance.pay_rate) text += `验收后 ${self.accept_after_balance.day} 天，付清订单余款 ${self.accept_after_balance.pay_rate} %`;
      if (self.billing_after.length)
        self.billing_after.forEach(e => {
          if (e.pay_rate) text += `票到后 ${e.day} 天，付 ${e.pay_rate} %订单总额;`;
        })
      if (self.billing_after_balance.pay_rate) text += `票到后 ${self.billing_after_balance.day} 天，付清订单余款 ${self.billing_after_balance.pay_rate}%;`;

      if (this.key == 0 || this.key)
        this.form.payment_terms[this.key] = {
          text: text,
          value: this.payMenTerms
        }
      else
        this.form.payment_terms.push({
          text: text,
          value: this.payMenTerms
        });
      // 重置
      $("#customer #payMentModal").modal("hide");
      this.key = undefined;
      this.payMenTerms = {
        deposit: {
          pay_rate: ''
        },
        shipment_before: {
          pay_rate: ''
        },
        shipment_after: [
          {
            day: '',
            pay_rate: ''
          }
        ],
        accept_after: [
          {
            day: '',
            pay_rate: ''
          }
        ],
        accept_after_balance: {
          day: '',
          pay_rate: ''
        },
        billing_after: [
          {
            day: '',
            pay_rate: ''
          }
        ],
        billing_after_balance: {
          day: '',
          pay_rate: ''
        }
      }
    },
    editPayment(key) {
      this.payMenTerms = this.form.payment_terms[key].value;
      this.key = key;
      $("#customer #payMentModal").modal("show");
    },
    editContract(state) {
      $("#customer .editContract").modal("toggle");
      if(state) return false;
    },
    /**
     * 地图初始化
     */
    init() {
      let that = this,
        point = new BMap.Point(116.404, 39.915);
      this.map = new BMap.Map("baiduMap");
      this.map.centerAndZoom(point, 14);
      this.map.enableScrollWheelZoom();
      this.map.enableInertialDragging();
      this.map.enableContinuousZoom();

      let size = new BMap.Size(10, 20),
        geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) that.map.panTo(r.point);
        },
        { enableHighAccuracy: true }
      );

      var geoc = new BMap.Geocoder();
      this.map.addEventListener("click", e => {
        this.map.clearOverlays();
        var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建标注
        geoc.getLocation(e.point, res => {
          that.form.detailed_address = res.address;
          $("#suggestId").val(
            `${res.addressComponents.province}-${res.addressComponents.city}-${
              res.addressComponents.district
            }`
          );
          that.form.region = {
            address: `${res.addressComponents.province}-${
              res.addressComponents.city
            }-${res.addressComponents.district}`,
            x: e.point.lng,
            y: e.point.lat
          };
        });
        this.map.addOverlay(marker);
      });
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
      CKEditor.create(document.querySelector("#editor"), {
        removePlugins: ["MediaEmbed"], //除去视频按钮
        language: "zh-cn", // 中文
        ckfinder: {
          uploaded: 1,
          url: "/"
          // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
        }
      })
        .then(editor => {
          const toolbarContainer = document.querySelector("#toolbar-container");
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
          // 加载了适配器
          editor.plugins.get("FileRepository").createUploadAdapter = loader => {
            return new UploadAdapter(loader);
          };
          this.editor = editor; // 将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
        })
        .catch(error => console.error(error));
    },
    G(id) {
      return document.getElementById(id);
    },
    loadMapAutocomplete(suggestId, searchResultPanel) {
      var checkValue,
        that = this,
        Ac = new BMap.Autocomplete({ input: suggestId });

      Ac.addEventListener("onhighlight", function(e) {
        //鼠标放在下拉列表上的事件
        var str = "";
        var _value = e.fromitem.value;
        var value = "";
        if (e.fromitem.index > -1) {
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str =
          "FromItem<br />index = " +
          e.fromitem.index +
          "<br />value = " +
          value;

        value = "";
        if (e.toitem.index > -1) {
          _value = e.toitem.value;
          value =
            _value.province +
            _value.city +
            _value.district +
            _value.street +
            _value.business;
        }
        str +=
          "<br />ToItem<br />index = " +
          e.toitem.index +
          "<br />value = " +
          value;
        that.G(searchResultPanel).innerHTML = str;
      });

      Ac.addEventListener("onconfirm", function(e) {
        //鼠标点击下拉列表后的事件
        var _value = e.item.value;
        checkValue =
          _value.province +
          _value.city +
          _value.district +
          _value.street +
          _value.business;
        that.G(searchResultPanel).innerHTML =
          "onconfirm<br />index = " +
          e.item.index +
          "<br />myValue = " +
          checkValue;

          function myFun(){
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            that.form.region = {
              address: checkValue,
              x: pp.lng,
              y: pp.lat
            };
            that.map.centerAndZoom(pp, 16);
            that.map.addOverlay(new BMap.Marker(pp));    //添加标注
          }
          var local = new BMap.LocalSearch(that.map, { //智能搜索
            onSearchComplete: myFun
          });
          local.search(checkValue);
      });
    }
  },
  watch: {
    payMentShow(val) {
      $("#customer #payMentModal").modal("show");
    },
    addCustomer(val) {
      if (val)
        if (this.rows.id) {
          this.form = this.rows;
          this.editor.setData(this.form.contract_terms);
          this.form.payment_terms = this.form.payment_terms_vl;
          if (this.form.region.x && this.form.region.y) {
            this.map.centerAndZoom(new BMap.Point(this.form.region.x, this.form.region.y), 14);
            var marker = new BMap.Marker(new BMap.Point(this.form.region.x, this.form.region.y));
            this.map.addOverlay(marker);
          }
          this.form.tags = this.form.tags.join(' ');
        }
      else 
        this.clearForm();
    }
  },
  computed: mapState(["addCustomer"]),
  mounted() {
    this.getBranch();
    this.loadMapAutocomplete("suggestId", "searchResultPanel");
    this.initCKEditor();
    setTimeout(() => this.init(), 2000);
  }
};
</script>
<style lang="less">
.tangram-suggestion-main {
  z-index: 9999;
}
#suggestId {
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  height: 40px;
  line-height: 40px;
  outline: 0;
  padding: 0 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
#addCustomer {
  .modalBox {
    top: 0;
  }
  .modalBoxMain {
    width: 1280px;
    max-width: 100%;
    .modalBoxMainContent {
      max-height: 635px;
      overflow: auto;
      .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 25%;
          padding: 0 15px;
          box-sizing: border-box;
          .el-date-editor,
          .el-select {
            width: 100%;
          }
        }
        .widthHalf {
          width: 50%;
        }
        .widthFull {
          width: 100%;
          .el-form-item__content {
            margin-left: 0px !important;
            #baiduMap {
              width: 100%;
              height: 500px;
            }
          }
        }
        .linkManItem {
          display: flex;
          .el-form-item {
            display: flex;
            width: 23%;
            margin-bottom: 0px;
            .el-form-item__label {
              width: 60px !important;
            }
            &:last-child {
              width: 8%;
            }
          }
        }
        .payment_terms {
          display: flex;
          .el-form-item {
            display: flex;
            width: 92%;
            margin-bottom: 0px;
            .el-form-item__label {
              width: 90px !important;
            }
            .el-form-item__content {
              width: 100%;
            }
            &:last-child {
              width: 8%;
            }
          }
        }
        p {
          border-bottom: 1px solid #989898;
          padding-bottom: 10px;
        }
        button {
          margin-bottom: 20px;
        }
      }
    }
  }
}
.modal-backdrop {
  z-index: 2001;
}
.modal {
  z-index: 2002;
}
#payMentModal {
  top: 20%;
  @dashed: 1px dashed #989898;
  .terms {
    border: @dashed;
    display: flex;
    > div {
      &:first-child {
        padding: 1rem;
      }
      border-right: @dashed;
      flex-grow: 1;
      p {
        white-space: nowrap;
        input {
          display: inline;
          width: 20px;
        }
      }
      > div {
        padding: 1rem;
        min-height: 101px;
        &:first-child {
          border-bottom: @dashed;
        }
      }
      &:last-child {
        border-right: none;
      }
    }
  }
}
</style>
