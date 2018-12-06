<template>
  <div id="checkOrder">
    <transition name="el-fade-in-linear">
      <div v-show="modalShow">
        <div class="Curtain"></div>
        <div class="modalBox">
          <div class="modalBoxMain">
            <div class="modalBoxMainHeader">
              <div class="modalBoxMainHeaderTitle">地址</div>
              <div class="modalBoxMainHeaderBtn" @click="clearEditForm">
                <i class="el-message-box__close el-icon-close"></i>
              </div>
            </div>
            <div class="modalBoxMainContent">
              <div id="editAddress">
                <div class="input-suffix">
                  <label for>省市区</label>
                  <area-cascader
                    type="text"
                    :data="pcaa"
                    :aria-level="1"
                    :level="1"
                    placeholder="请选择地区"
                    v-model="editForm.province"
                  ></area-cascader>
                </div>
                <div class="input-suffix">
                  <label for>详细地址</label>
                  <el-input size="mini" v-model="editForm.detailed_address"></el-input>
                </div>
                <div class="input-suffix">
                  <label for>邮政编码</label>
                  <el-input size="mini" v-model="editForm.zip_code"></el-input>
                </div>
                <div class="input-suffix">
                  <label for>收件人姓名</label>
                  <el-input size="mini" v-model="editForm.name"></el-input>
                </div>
                <div class="input-suffix">
                  <label for>联系电话</label>
                  <el-input size="mini" v-model="editForm.contact_mobile"></el-input>
                </div>
                <div class="input-suffix">
                  <label for>座机</label>
                  <div class="contact_phone">
                    <el-input size="mini" v-model="editForm.contact_phone.region"></el-input>
                    <el-input size="mini" v-model="editForm.contact_phone.tel"></el-input>
                    <el-input size="mini" v-model="editForm.contact_phone.extension"></el-input>
                  </div>
                </div>
                <el-checkbox v-model="editForm.default" label="是否选为默认地址"></el-checkbox>
              </div>
            </div>
            <div class="modalBoxMainBtn">
              <el-button size="mini" @click="clearEditForm">取消</el-button>
              <el-button size="mini" type="primary" @click="saveAddress(editForm.slug)">保存</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <h1>选择收货地址</h1>
    <div class="addressList">
      <el-card
        class="addressDetail"
        shadow="hover"
        v-for="(item,index) in addressList.list"
        :key="index"
      >
        <header>
          <span>编号：{{ item.id }}</span>
          <div>
            <el-button type="text" @change="changeDefault()" @click="editAddress(index)">编辑</el-button>
            <el-radio v-model="activeAddress" :label="item.slug" @change="changeDefault(item.slug)"></el-radio>
          </div>
        </header>
        <div class="contant">
          <p>{{ item.province + item.city + item.area + item.detailed_address }}</p>
          <p>
            <span>{{ item.name }}</span>
            <span>{{ item.hide_contact_mobile }}</span>
          </p>
        </div>
      </el-card>
    </div>
    <div class="addAddressBtn" align="right">
      <el-button type="primary" size="small" @click="modalShow = true">新增地址</el-button>
    </div>
    <h1>确认订单信息</h1>
    <el-table ref="multipleTable" :data="projectDetail" tooltip-effect="dark">
      <el-table-column label="产品" width="500">
        <template slot-scope="{ row,$index }">
          <div>
            <img :src="row.product.image">
          </div>
          <div>
            <p>型号：{{ row.model }}</p>
            <p>名称：{{ row.product.name }}</p>
            <p>创建人：{{ row.member }} 创建时间：{{ row.create_at }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="150">
        <template slot-scope="{ row,$index }">
          <el-input-number v-model="row.quantity" :min="1" label="件数" size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="150" show-overflow-tooltip>
        <template slot-scope="{ row,$index }">
          <div v-if="row.price == 0">
            <span>待报价</span>
            <div>
              <el-button type="primary">询价</el-button>
            </div>
          </div>
          <div v-else>
            <span>{{ row.price }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="交期" width="150" show-overflow-tooltip>
        <template slot-scope="{ row,$index }">
          <span>{{ row.delivery_period == null ? "无" : row.delivery_period + '天' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170">
        <template slot-scope="{ row,$index }">
          <div class="operation">
            <el-select
              @change="cartsItem(0,row.str_id,row.supplier.slug)"
              v-model="row.supplier.slug"
              placeholder="选择供应商"
            >
              <el-option
                v-for="item in row.all_supplier"
                :key="item.slug"
                :label="item.name"
                :value="item.slug"
              ></el-option>
            </el-select>
            <el-select
              @change="cartsItem(1,row.str_id,row.invoice_type.slug)"
              v-model="row.invoice_type.slug"
              placeholder="发票类型"
            >
              <el-option
                v-for="item in row.all_invoice_type"
                :key="item.slug"
                :label="item.name"
                :value="item.slug"
              ></el-option>
            </el-select>
            <el-select
              @change="cartsItem(2,row.str_id,row.payment_type.slug)"
              v-model="row.payment_type.slug"
              placeholder="付款方式"
            >
              <el-option
                v-for="item in row.all_payment_type"
                :key="item.slug"
                :label="item.name"
                :value="item.slug"
              ></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="checkOrder">
      <!-- <div class="selectForm">
        <label for="">配送方式</label>
        <el-select size="mini"> </el-select>
      </div>
      <div class="selectForm">
        <label for="">优惠券</label>
        <el-select size="mini"> </el-select>
      </div>-->
      <div class="sum">总计: ￥ {{ projectDetail.sum() }}</div>
      <el-button type="warning" size="mini" @click="checkout">确认订单</el-button>
    </div>
  </div>
</template>
<script>
import "@/assets/css/modal.css";
import { AreaCascader } from "vue-area-linkage";
import { pca, pcaa } from "area-data";
import "vue-area-linkage/dist/index.css";

export default {
  name: "checkOrder",
  data() {
    return {
      pcaa: pcaa,
      activeAddress: "",
      addressList: {},
      projectSlug: JSON.parse(localStorage.getItem("order")).projectSlug,
      projectDetail: JSON.parse(localStorage.getItem("order")).list,
      modalShow: false,
      editForm: {
        slug: "",
        province: [],
        detailed_address: "",
        zip_code: "",
        name: "",
        contact_mobile: "",
        contact_phone: {
          region: "",
          tel: "",
          extension: ""
        },
        default: false
      }
    };
  },
  methods: {
    getAddressList() {
      let that = this;
      this.$get("members/address")
        .then(response => {
          if (response.status != 200) return false;
          that.addressList = response.data;
          that.addressList.list.forEach(e => {
            if (e.default) that.activeAddress = e.slug;
          });
        })
        .catch(error => console.log(error));
    },
    editAddress(index) {
      let that = this,
        self = that.addressList.list[index];
      that.modalShow = true;
      that.editForm = {
        slug: self.slug,
        province: [self.province, self.city, self.area].join("/"),
        detailed_address: self.detailed_address,
        zip_code: self.zip_code,
        name: self.name,
        contact_mobile: self.contact_mobile,
        contact_phone: {
          region: self.contact_phone.split("-")[0],
          tel: self.contact_phone.split("-")[1],
          extension: self.contact_phone.split("-")[2]
        },
        default: self.default ? true : false
      };
    },
    saveAddress(slug) {
      if (this.editForm.name == "") {
        this.$notify.error({ title: "", message: "请填写姓名" });
        return false;
      }
      if (this.editForm.detailed_address == "") {
        this.$notify.error({ title: "", message: "请填写详细地址" });
        return false;
      }
      if (this.editForm.contact_mobile == "") {
        this.$notify.error({ title: "", message: "请填写联系电话" });
        return false;
      }
      const loading = this.$loading({ lock: true });
      let that = this,
        url = null;
      if (slug) url = `members/address/edit/${slug}`;
      else url = "members/address/create";

      that.editForm.area = that.editForm.province[2];
      that.editForm.city = that.editForm.province[1];
      that.editForm.province = that.editForm.province[0];

      that.editForm.contact_phone = Object.values(
        that.editForm.contact_phone
      ).join("-");

      that.modalShow = false;

      that
        .$post(url, that.editForm)
        .then(response => {
          loading.close();
          if (response.status != 200) {
            that.modalShow = true;
            return false;
          } else {
            that.clearEditForm();
            that.getAddressList();
          }
        })
        .catch(error => {
          that.modalShow = true;
          loading.close();
        });
    },
    clearEditForm() {
      this.modalShow = false;
      this.editForm = {
        slug: "",
        province: [],
        detailed_address: "",
        zip_code: "",
        name: "",
        contact_mobile: "",
        contact_phone: {
          region: "",
          tel: "",
          extension: ""
        },
        default: false
      };
    },
    changeDefault(slug) {
      this.$get(`members/default-address/${slug}`)
        .then(response => {
          if (response.status != 200) return false;
        })
        .catch(error => console.log(error));
    },
    cartsItem(key, str_id, slug) {
      let url = null,
        that = this;
      switch (key) {
        case 0:
          url = `carts/items/price-company/${
            that.projectSlug
          }/${str_id}/${slug}`;
          break;
        case 1:
          url = `carts/items/price-invoice/${
            that.projectSlug
          }/${str_id}/${slug}`;
          break;
        case 2:
          url = `carts/items/price-payment/${
            that.projectSlug
          }/${str_id}/${slug}`;
          break;
      }
      const loading = this.$loading({ lock: true });
      that
        .$post(url)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          let arr = [],
            obj = {};
          response.data.list.forEach(e => {
            if (e.str_id == str_id) obj = e;
          });
          that.projectDetail.forEach((e, k) => {
            if (e.str_id == str_id) arr.push(obj);
            else arr.push(e);
          });
          that.projectDetail = arr;
        })
        .catch(error => loading.close());
    },
    checkout() {
      let that = this,
        loading = this.$loading({ lock: true }),
        arr = [],
        activeAddress = {};
      that.addressList.list.forEach(e => {
        if (e.slug == that.activeAddress) activeAddress = e;
      });
      console.log(that.projectDetail);
      that.projectDetail.forEach(e => arr.push(e.id));
      that
        .$post("orders/checkout", {
          ids: arr.join(","),
          address:
            activeAddress.province + activeAddress.city + activeAddress.area,
          mobile: activeAddress.contact_mobile,
          consignee: activeAddress.name
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;

          window.location.href = "user.html#/order";
        })
        .catch(error => loading.close());
    }
  },
  created() {
    this.getAddressList();
  }
};
</script>
<style lang="less">
@org: #ff9900;
@gery: #e2e2e2;
@border: 1px solid @org;
.clear() {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#checkOrder {
  padding: 2rem;
  color: #666666;
  margin: 0 auto;
  box-sizing: border-box;
  max-width: 100%;
  overflow-y: auto;
  #editAddress {
    margin: 0 auto;
    box-sizing: border-box;
    padding: 0 1rem;
    width: 30rem;
    max-width: 100%;
    .input-suffix {
      display: flex;
      white-space: nowrap;
      align-items: center;
      margin-bottom: 0.5rem;
      label {
        width: 8rem;
      }
      .area-cascader-wrap {
        width: 19.8rem;
        .area-select {
          width: 100%;
        }
      }
      .el-input {
        width: 20rem;
      }
      .contact_phone {
        .el-input {
          width: 19.5rem / 3;
        }
      }
    }
  }
  @media screen and (min-width: 820px) {
    h1 {
      font-size: 2rem;
    }
    .addressList {
      display: flex;
      flex-wrap: wrap;
      padding-top: 2rem;
      padding-bottom: 1rem;
      max-width: 100%;
      overflow-x: auto;
      .addressDetail {
        box-sizing: border-box;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        width: 30rem;
        .el-card__body {
          height: 13rem;
          overflow-y: auto;
          .clear;
        }
        header {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          background-color: @gery;
          div {
            button {
              .clear();
            }
            .el-radio__label {
              display: none;
            }
          }
        }
        .contant {
          padding: 1rem;
          line-height: 1.6;
          word-break: break-all;
        }
      }
    }
    .addAddressBtn {
      margin-bottom: 2rem;
    }
    .el-table {
      max-width: 100%;
      overflow-x: auto;
      .el-table__body-wrapper {
        .el-table__row {
          .cell {
            display: flex;
            > div {
              box-sizing: border-box;
              &:first-child {
                margin-right: 1rem;
                img {
                  width: 100px;
                }
              }
            }
            .operation {
              button {
                width: 100%;
              }
              .clear;
              .el-select,
              .el-input,
              input {
                height: 30px;
              }
            }
          }
        }
      }
    }
    .checkOrder {
      float: right;
      text-align: right;
      .selectForm {
        text-align: right;
        padding: 0.5rem 0 0 0;
        label {
          width: 50px;
        }
      }
      .sum {
        width: 15rem;
        padding: 0.5rem;
        border: @border;
        color: @org;
        font-size: 1.8rem;
        margin: 0.5rem 0;
        text-align: left;
      }
    }
  }
}
</style>
