<template>
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
              label-width="140px"
              label-position="left"
            >
              <el-form-item label="客户名称" prop="name">
                <el-input v-model="form.name" placeholder="客户名称"></el-input>
              </el-form-item>
              <el-form-item label="详细地址" prop="detailed_address">
                <el-input v-model="form.detailed_address" placeholder="详细地址"></el-input>
              </el-form-item>
              <el-form-item label="物流编码" prop="logistics_code">
                <el-input v-model="form.logistics_code" placeholder="物流编码"></el-input>
              </el-form-item>
              <el-form-item label="账期类型" prop="account_period_type">
                <el-input v-model="form.account_period_type" placeholder="账期类型"></el-input>
              </el-form-item>
              <el-form-item class="widthFull" label="地图标注位置" prop="region">
                <div id="baiduMap"></div>
              </el-form-item>
              <el-form-item label="客户级别">
                <el-input v-model="form.customer_level" placeholder="客户级别"></el-input>
              </el-form-item>
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
              <el-form-item label="地址">
                <el-input v-model="form.address" placeholder="地址"></el-input>
              </el-form-item>
              <el-form-item label="业务员">
                <el-select v-model="form.salesman" placeholder="业务员">
                  <el-option
                    v-for="item in userBranch"
                    :key="item.id"
                    :label="item.display_name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="主联系人">
                <el-input v-model="form.primary_contact" placeholder="主联系人"></el-input>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input v-model="form.phone" placeholder="联系电话"></el-input>
              </el-form-item>
              <el-form-item label="传真">
                <el-input v-model="form.fax" placeholder="传真"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="form.mobile" placeholder="手机号"></el-input>
              </el-form-item>
              <el-form-item label="发票类型">
                <el-input v-model="form.invoice_type" placeholder="发票类型"></el-input>
              </el-form-item>
              <el-form-item label="付款条件">
                <el-input v-model="form.payment_terms" placeholder="付款条件"></el-input>
              </el-form-item>
              <el-form-item label="付款方式">
                <el-input v-model="form.payment_type" placeholder="付款方式"></el-input>
              </el-form-item>
              <el-form-item label="工商营业执照号码">
                <el-input v-model="form.business_license_number" placeholder="工商营业执照号码"></el-input>
              </el-form-item>
              <el-form-item label="网址">
                <el-input v-model="form.url" placeholder="网址"></el-input>
              </el-form-item>
              <el-form-item label="电子邮件">
                <el-input v-model="form.email" placeholder="电子邮件"></el-input>
              </el-form-item>
              <el-form-item label="送货方式">
                <el-input v-model="form.delivery_methods" placeholder="送货方式"></el-input>
              </el-form-item>
              <el-form-item label="交货地址">
                <el-input v-model="form.delivery_address" placeholder="交货地址"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.remark" placeholder="备注"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-input v-model="form.status" placeholder="状态"></el-input>
              </el-form-item>
              <el-form-item label="发票抬头">
                <el-input v-model="form.invoice_head" placeholder="发票抬头"></el-input>
              </el-form-item>
              <el-form-item label="法人代表">
                <el-input v-model="form.legal_representative" placeholder="法人代表"></el-input>
              </el-form-item>
              <el-form-item label="注册资金">
                <el-input v-model="form.registered_capital" placeholder="注册资金"></el-input>
              </el-form-item>
              <el-form-item label="成立日期">
                <el-input v-model="form.establish_at" placeholder="成立日期"></el-input>
              </el-form-item>
              <el-form-item label="最近联系日期">
                <el-input v-model="form.recent_contacts_at" placeholder="最近联系日期"></el-input>
              </el-form-item>
              <el-form-item label="最近联系一次记录">
                <el-input v-model="form.recent_contacts_record" placeholder="最近联系一次记录"></el-input>
              </el-form-item>
              <el-form-item label="最近服务日期">
                <el-input v-model="form.recent_service_at" placeholder="最近服务日期"></el-input>
              </el-form-item>
              <el-form-item label="最近出货日期">
                <el-input v-model="form.recent_shipping_at" placeholder="最近出货日期"></el-input>
              </el-form-item>
              <el-form-item label="标签">
                <el-input v-model="form.tags" placeholder="标签"></el-input>
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
  name: "addCustomer",
  data() {
    return {
      userBranch: [],
      form: {
        name: "",
        detailed_address: "",
        logistics_code: "",
        account_period_type: "",
        region: {
          address: "",
          x: "",
          y: ""
        },
        customer_level: "",
        bank_account: "",
        account_name: "",
        account_number: "",
        tax_id: "",
        address: "",
        salesman: "",
        primary_contact: "",
        phone: "",
        fax: "",
        mobile: "",
        invoice_type: "",
        payment_terms: "",
        payment_type: "",
        business_license_number: "",
        url: "",
        email: "",
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
        tags: ""
      },
      rules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        detailed_address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        logistics_code: [
          { required: true, message: "请输入物流编码", trigger: "blur" }
        ],
        account_period_type: [
          { required: true, message: "请输入账期类型", trigger: "blur" }
        ]
        // region: {
        //   address: [
        //     { required: true, message: "请在地图选择地点", trigger: "blur" }
        //   ],
        //   x: [{ required: true, message: "请在地图选择地点", trigger: "blur" }],
        //   y: [{ required: true, message: "请在地图选择地点", trigger: "blur" }]
        // }
      }
    };
  },
  methods: {
    ...mapMutations(["getUserBranch"]),
    onSubmit() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
        let that = this;
        that
          .$post(`customers/create`, that.form)
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.clearForm();
          })
          .catch(err => {});
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
        detailed_address: "",
        logistics_code: "",
        account_period_type: "",
        region: {
          address: "",
          x: "",
          y: ""
        },
        customer_level: "",
        bank_account: "",
        account_name: "",
        account_number: "",
        tax_id: "",
        address: "",
        salesman: "",
        primary_contact: "",
        phone: "",
        fax: "",
        mobile: "",
        invoice_type: "",
        payment_terms: "",
        payment_type: "",
        business_license_number: "",
        url: "",
        email: "",
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
        tags: ""
      };
    },
    close() {
      this.$store.commit("changeModal", "addCustomer");
    },
    /**
     * 地图初始化
     */
    init() {
      let that = this,
        map = new BMap.Map("baiduMap"),
        point = new BMap.Point(116.404, 39.915);
      map.centerAndZoom(point, 14);
      map.enableScrollWheelZoom();
      map.enableInertialDragging();
      map.enableContinuousZoom();

      let size = new BMap.Size(10, 20),
        geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            // let mk = new BMap.Marker(r.point);
            // map.addOverlay(mk);
            map.panTo(r.point);
            // 拖动
            // mk.enableDragging();
          }
        },
        { enableHighAccuracy: true }
      );

      let addControl = setInterval(() => {
        map.addControl(
          new BMap.CityListControl({
            anchor: "BMAP_ANCHOR_TOP_LEFT",
            offset: size
          })
        );
        clearInterval(addControl);
      }, 2000);
      var geoc = new BMap.Geocoder();
      map.addEventListener("click", e => {
        map.clearOverlays();
        var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建标注
        geoc.getLocation(e.point, res => {
          that.form.region = {
            address: `${res.addressComponents.province}-${
              res.addressComponents.city
            }-${res.addressComponents.district}`,
            x: e.point.lng,
            y: e.point.lat
          };
        });
        map.addOverlay(marker);
      });
    }
  },
  computed: mapState(["addCustomer"]),
  mounted() {
    this.getBranch();
    setTimeout(() => this.init(), 2000);
  }
};
</script>
<style lang="less">
#addCustomer {
  .modalBoxMain {
    width: 980px;
    max-width: 100%;
    .modalBoxMainContent {
      max-height: 535px;
      overflow: auto;
      .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 50%;
          padding: 0 15px;
          box-sizing: border-box;
          .el-select {
            width: 100%;
          }
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
      }
    }
  }
}
</style>
