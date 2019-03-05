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
                <input id="suggestId" name="sendAddress" placeholder="详细地址" type="text">
                <div id="searchResultPanel" style="border: 1px solid #C0C0C0; width: 150px; height: auto;display: none;"></div>
              </el-form-item>
              <el-form-item label="主联系人" prop="primary_contact">
                <el-input v-model="form.primary_contact" placeholder="主联系人"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" placeholder="手机号"></el-input>
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
              <el-form-item label="联系电话">
                <el-input v-model="form.phone" placeholder="联系电话"></el-input>
              </el-form-item>
              <el-form-item class="widthFull" label="地图标注位置" prop="region">
                <div id="baiduMap"></div>
              </el-form-item>
              <p class="lead widthFull">客户信息（选填）</p>
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
              <el-form-item label="传真">
                <el-input v-model="form.fax" placeholder="传真"></el-input>
              </el-form-item>
              <el-form-item label="账期类型">
                <el-input v-model="form.account_period_type" placeholder="账期类型"></el-input>
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
                <el-date-picker
                  v-model="form.establish_at"
                  value-format="yyyy-MM-dd HH:mm"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="form.remark" placeholder="备注"></el-input>
              </el-form-item>
              <el-form-item label="状态">
                <el-input v-model="form.status" placeholder="状态"></el-input>
              </el-form-item>
              <el-form-item label="标签">
                <el-input v-model="form.tags" placeholder="标签"></el-input>
              </el-form-item>
              <p class="lead widthFull">快递方式（选填）</p>
              <el-form-item label="邮政代码">
                <el-input v-model="form.logistics_code" placeholder="邮政代码"></el-input>
              </el-form-item>
              <el-form-item label="送货方式">
                <el-input v-model="form.delivery_methods" placeholder="送货方式"></el-input>
              </el-form-item>
              <el-form-item label="交货地址">
                <el-input v-model="form.delivery_address" placeholder="交货地址"></el-input>
              </el-form-item>
              <p class="lead widthFull">商务记录（选填）</p>
              <el-form-item label="最近联系日期">
                <el-date-picker
                  v-model="form.recent_contacts_at"
                  value-format="yyyy-MM-dd HH:mm"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="最近联系一次记录">
                <el-input v-model="form.recent_contacts_record" placeholder="最近联系一次记录"></el-input>
              </el-form-item>
              <el-form-item label="最近服务日期">
                <el-date-picker
                  v-model="form.recent_service_at"
                  value-format="yyyy-MM-dd HH:mm"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="最近出货日期">
                <el-date-picker
                  v-model="form.recent_shipping_at"
                  value-format="yyyy-MM-dd HH:mm"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
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
        tags: "",
        enabled: 1
      },
      rules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        detailed_address: [
          { message: "请输入详细地址", trigger: "blur" }
        ],
        primary_contact: [
          { required: true, message: "请输入联系人", trigger: "blur" }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        salesman: [{ required: true, message: "请选择业务员", trigger: "blur" }]
        // region: {
        //   address: [
        //     { required: true, message: "请在地图选择地点", trigger: "blur" }
        //   ],
        //   x: [{ required: true, message: "请在地图选择地点", trigger: "blur" }],
        //   y: [{ required: true, message: "请在地图选择地点", trigger: "blur" }]
        // }
      },
      map: null
    };
  },
  methods: {
    ...mapMutations(["getUserBranch"]),
    onSubmit() {
      if($('#suggestId').val())
        this.form.detailed_address = $('#suggestId').val();
      else {
        this.$message({ message: '请输入地址', type: 'error' });
        return false;
      }
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
          if (this.getStatus() == BMAP_STATUS_SUCCESS) 
            that.map.panTo(r.point);
        },
        { enableHighAccuracy: true }
      );

      var geoc = new BMap.Geocoder();
      this.map.addEventListener("click", e => {
        this.map.clearOverlays();
        var marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建标注
        geoc.getLocation(e.point, res => {
          that.form.detailed_address = res.address;
          $('#suggestId').val(`${res.addressComponents.province}-${
              res.addressComponents.city
            }-${res.addressComponents.district}`)
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
    G(id) {
        return document.getElementById(id);
    },
    loadMapAutocomplete(suggestId, searchResultPanel) {
      var checkValue,
        that = this,
        Ac = new BMap.Autocomplete({ "input": suggestId, });

      Ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
          var str = "";
          var _value = e.fromitem.value;
          var value = "";
          if(e.fromitem.index > -1) {
              value = _value.province + _value.city + _value.district + _value.street + _value.business;
          }
          str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

          value = "";
          if(e.toitem.index > -1) {
              _value = e.toitem.value;
              value = _value.province + _value.city + _value.district + _value.street + _value.business;
          }
          str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
          that.G(searchResultPanel).innerHTML = str;
      });

      Ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
          var _value = e.item.value;
          checkValue = _value.province + _value.city + _value.district + _value.street + _value.business;
          that.G(searchResultPanel).innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + checkValue;
          var myGeo = new BMap.Geocoder();
          myGeo.getPoint(e.item.value.city + e.item.value.district + e.item.value.business, function(point){
            that.form.region = {
              address: `${e.item.value.city}-${
                e.item.value.district
              }-${e.item.value.business}`,
              x: point.lng,
              y: point.lat
            };
            that.map.centerAndZoom(point, 16);
            that.map.addOverlay(new BMap.Marker(point));
          }, e.item.value.city);
      });
    }
  },
  computed: mapState(["addCustomer"]),
  mounted() {
    this.getBranch();
    this.loadMapAutocomplete("suggestId", "searchResultPanel");
    setTimeout(() => this.init(), 2000);
  }
};
</script>
<style lang="less">
.tangram-suggestion-main{
  z-index: 9999;
}
#suggestId{
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
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
}
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
          .el-date-editor,
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
