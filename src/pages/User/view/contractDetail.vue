<template>
  <div id="cantractDetail">
    <div class="contractBody">
      <div class="contractNumber">
        <p class="title">{{ content.a_company }}</p>
        <div>
          <p>地址：{{ content.a_address }}</p>
          <p>
            <span>电话：{{ content.a_tel }}</span>
            <span>传真：{{ content.a_fax }}</span>
          </p>
          <p>
            <span>网址：{{ content.a_domain }}</span>
            <span>邮箱：{{ content.a_email }}</span>
          </p>
        </div>
      </div>
      <div class="responsiblePerson">
        <p class="title">订货确认书</p>
        <div class="bDetailInfo">
          <div>
            <p>
              <span>客户</span>：
              <span>{{ content.b_company }}</span>
            </p>
            <p>
              <span>送货地址</span>：
              <span>{{ content.b_address }}</span>
            </p>
            <p>
              <span>联系人</span>：
              <span>{{ content.b_linkman }}</span>
            </p>
            <p>
              <span>电话</span>：
              <span>{{ content.b_phone }}</span>
            </p>
            <p>
              <span>传真</span>：
              <span>{{ content.b_fax }}</span>
            </p>
            <p>
              <span>付款方式</span>：
              <span>{{ content.payment_method }}</span>
            </p>
            <p>
              <span>付款条件</span>：
              <span>{{ content.payment_term }}</span>
            </p>
          </div>
          <div>
            <p>
              <span>单号</span>：
              <span>{{ content.contract_no }}</span>
            </p>
            <p>
              <span>报价日期</span>：
              <span>{{ content.orders[0] ? content.orders[0].created_at : '' }}</span>
            </p>
            <p>
              <span>业务员</span>：
              <span>{{ content.salesman_name }}</span>
            </p>
            <p>
              <span>直线电话</span>：
              <span>{{ content.a_tel }}</span>
            </p>
            <p>
              <span>手机</span>：
              <span>{{ content.a_phone }}</span>
            </p>
            <p>
              <span>邮箱</span>：
              <span>{{ content.a_email }}</span>
            </p>
            <p>
              <span>币别</span>：
              <span>人名币</span>
            </p>
          </div>
        </div>
        <el-button v-if="content.company_type == 'a'" class="edit" type="primary" size="mini" @click="isEdit.user = !isEdit.user;if(!isEdit.user) editContract()" plain>{{ isEdit.user ? '保存' : '编辑'}}</el-button>
      </div>
      <div class="table">
        <el-table border :data="content.orders">
          <el-table-column prop="id" label="序号" width="50"><template slot-scope="{ row, $index }"><div align="center"><span>{{ $index + 1 }}</span></div></template></el-table-column>
          <el-table-column prop="product_id" label="产品" width="400">
            <template slot-scope="{ row,$index }">
              <div class="goods">
                <div>
                  <img :src="row.product_image" alt="">
                </div>
                <div>
                  <p>名称：{{ row.product_name }}</p>
                  <p>型号：{{ row.product_model }}</p>
                  <p class="grey">{{ row.meta_description }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量"><template slot-scope="{ row, $index }"><span>{{ row.quantity }} 件</span></template></el-table-column>
          <el-table-column prop="purchase_price" label="单价"><template slot-scope="{ row, $index }"><span>￥ {{ row.purchase_price }}</span></template></el-table-column>
          <el-table-column prop="delivery_period" label="交货期"><template slot-scope="{ row, $index }"><span>{{ row.delivery_period }} 工作日</span></template></el-table-column>
          <el-table-column prop="total_price" label="总价"><template slot-scope="{ row, $index }"><span>{{ row.total_price }}</span></template></el-table-column>
        </el-table>
        <div class="total_price">
          <span>合计（大写）：{{ content.chinese_total_price }}</span>
          <span>￥ {{ content.total_price }}</span>
        </div>
      </div>
      <div class="extend">
        <p>备注：{{ content.order_remark || '无' }}</p>
        <p>条款：</p>
        <div v-html="content.contract_content" v-if='!isEdit.contract'></div>
        <el-input type="textarea" rows="3" v-else v-model="content.contract_content"></el-input>
        <el-button v-if="content.company_type == 'a'" class="edit" type="primary" size="mini" @click="isEdit.contract = !isEdit.contract;if(!isEdit.contract) editContract()" plain>{{ isEdit.contract ? '保存' : '编辑'}}</el-button>
      </div>
      <div class="sign">
        <div>
          <span>甲方签章：</span>
          <div class="signBox">
            <img :src="'data:image/svg+xml;base64, ' + content.a_signature" alt="">
          </div>
          <div class="operation" v-if="content.company_type == 'a'">
            <el-button type="primary" size="mini" @click="modalShow = true">签字</el-button>
            <el-button type="primary" size="mini" @click="seal">盖章</el-button>
          </div>
          <img class="seal" v-if="content.a_seal" :src="content.a_seal">
        </div>
        <div>
          <span>乙方签章：</span>
          <div class="signBox">
            <img :src="'data:image/svg+xml;base64, ' + content.b_signature" alt="">
          </div>
          <div class="operation" v-if="content.company_type == 'b'">
            <el-button type="primary" size="mini" @click="modalShow = true">签字</el-button>
            <el-button type="primary" size="mini" @click="seal">盖章</el-button>
          </div>
          <img class="seal" v-if="content.b_seal" :src="content.b_seal">
        </div>
      </div>
      <div class="query">
        <el-button type="primary" size="mini" @click="query">确认</el-button>
      </div>
    </div>
    <transition name="el-fade-in-linear">
      <div v-show="modalShow">
        <div class="Curtain"></div>
        <div class="modalBox">
          <div class="modalBoxMain">
            <div class="modalBoxMainHeader">
              <div class="modalBoxMainHeaderTitle">
                签名
              </div>
              <div class="modalBoxMainHeaderBtn" @click="modalShow = false;">
                <i class="el-message-box__close el-icon-close"></i>
              </div>
            </div>
            <div class="modalBoxMainContent">
              <div id="jSignature">
                <canvas id="canvas" style="width: 100%;height: 100%;">Canvas画板</canvas>
                <div><el-button size="mini" type="primary" @click="saveSvg">保存签名</el-button></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import SignaturePad from "signature_pad";
export default {
  name: "cantractDetail",
  data() {
    return {
      baseUrl: baseUrl,
      slug: this.$route.params.slug,
      modalShow: false,
      signaturePad: null,
      content: {
        orders: [{ created_at: "0000-00-00 00:00:00" }]
      },
      isEdit: {
        user: false,
        contract: false
      }
    };
  },
  methods: {
    getContract() {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get("orders/contract/" + that.slug)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.content = response.data;
        })
        .catch(error => loading.close());
    },
    editContract() {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$post("orders/contract/update/" + that.slug, that.content)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
        })
        .catch(error => loading.close());
    },
    canvasInit() {
      let canvas = document.querySelector("canvas");
      this.signaturePad = new SignaturePad(canvas);
    },
    saveSvg() {
      let that = this,
        svg = this.signaturePad.toDataURL("image/svg+xml");
      const data = svg.split("data:image/svg+xml;base64,")[1],
        loading = this.$loading({ lock: true });
      that
        .$post("orders/contract/signature/" + that.slug, {
          signature: data,
          ab: that.content.company_type
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.modalShow = false;
          switch (that.content.company_type) {
            case "a":
              that.content.a_signature = data;
              break;
            case "b":
              that.content.b_signature = data;
              break;
          }
        })
        .catch(error => loading.close());
    },
    seal() {
      let that = this;
      that.$post("orders/contract/seal/" + that.slug).then(response => {
        if (response.status != 200) return false;
        switch (that.content.company_type) {
          case a:
            that.content.a_seal = response.data.seal_url;
            break;
          case b:
            that.content.b_seal = response.data.seal_url;
            break;
        }
      });
    },
    query() {
      let that = this,
        loading = that.$loading({ lock: true });
      that
        .$post("orders/contract/confirm/" + that.slug, { slug: that.slug })
        .then(response => loading.close())
        .catch(error => loading.close());
    }
  },
  mounted() {
    this.canvasInit();
  },
  created() {
    this.getContract();
  }
};
</script>
<style lang="less">
@gery: #666666;
@grey: #999999;
@background: #f1f1f1;
@border: solid 1px @gery;
#cantractDetail {
  height: 100%;
  width: 100%;
  padding: 1.5rem 2rem;
  color: @gery;
  box-sizing: border-box;
  overflow-y: auto;
  .grey {
    color: @grey;
  }
  .edit() {
    position: absolute;
    right: 1.5rem;
    top: 1rem;
  }
  .contractBody {
    border: @border;
    .contractNumber {
      border-bottom: @border;
      padding: 1rem;
      .title {
        text-align: center;
        font-size: 2.4rem;
        font-weight: bold;
        line-height: 2;
      }
      > div {
        width: 38rem;
        max-width: 100%;
        margin: 0.5rem auto;
        line-height: 1.6;
        p {
          display: flex;
          justify-content: space-between;
          font-size: 1.5rem;
          span {
            font-size: 1.5rem;
          }
        }
      }
    }
    .responsiblePerson {
      position: relative;
      padding: 1rem 1.5rem;
      line-height: 1.8;
      .title {
        text-align: center;
        font-size: 2.4rem;
        font-weight: bold;
        line-height: 2;
      }
      .bDetailInfo {
        display: flex;
        justify-content: space-around;
        p {
          display: flex;
          > span:first-child {
            display: block;
            width: 6rem;
            white-space: nowrap;
          }
        }
      }
      .edit {
        .edit();
      }
    }
    .table {
      padding: 1rem;
      box-sizing: border-box;
      width: 100%;
      .el-table {
        width: 100%;
        .goods {
          display: flex;
          align-items: center;
          div {
            &:first-child {
              width: 10rem;
              height: 10rem;
              img {
                width: 100%;
              }
            }
          }
        }
      }
      .total_price {
        border-left: 1px solid @background;
        border-right: 1px solid @background;
        border-bottom: 1px solid @background;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
      }
    }
    .extend {
      padding: 2rem;
      position: relative;
      p {
        margin-bottom: 1rem;
      }
      .edit {
        .edit();
      }
    }
    .sign {
      padding: 1rem;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      > div {
        width: 1%;
        flex-grow: 1;
        position: relative;
        > div {
          padding: 1rem;
        }
        .signBox {
          height: 300px;
          border: @border;
          width: 90%;
          box-sizing: border-box;
          margin: 0.5rem auto;
          overflow: hidden;
          img {
            width: 100%;
            height: 300px;
          }
        }
        .seal {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 150px;
        }
      }
      .operation {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .query {
    text-align: center;
    padding: 1rem;
  }
  .modalBox {
    @media screen and (min-width: 820px) {
      top: 180px;
    }
    @media screen and (max-width: 820px) {
      top: 0px;
    }
    div {
      text-align: center;
    }
  }
}
</style>