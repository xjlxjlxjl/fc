<template>
  <div id="cantractDetail">
    <div class="contractBody">
      <div class="contractNumber">
        <div>
          <span>合同编号：{{ content.contract_no }}</span>
          <span>{{ content.orders[0] ? content.orders[0].created_at : '' }}</span>
        </div>
        <a :href="`${ baseUrl }orders/contract/pdf/${ slug }?download=1`"><el-button type="primary" size="mini">下载合同</el-button></a>
      </div>
      <div class="responsiblePerson">
        <p>
          <span>甲方：</span>
          <span v-if='!isEdit.user'> {{ content.a_company }} </span>
          <el-input size="mini" v-else v-model="content.a_company"></el-input>
        </p>
        <p>
          <span>公司地址：</span>
          <span v-if='!isEdit.user'> {{ content.a_address }} </span>
          <el-input size="mini" v-else v-model="content.a_address"></el-input>
        </p>
        <p>
          <span>联系人：</span>
          <span v-if='!isEdit.user'> {{ content.a_linkman }} </span>
          <el-input size="mini" v-else v-model="content.a_linkman"></el-input>
        </p>
        <p>
          <span>电话：</span>
          <span v-if='!isEdit.user'> {{ content.tel }} </span>
          <el-input size="mini" v-else v-model="content.tel"></el-input>
        </p>
        <p>
          <span>传真：</span>
          <span v-if='!isEdit.user'> {{ content.a_fax }} </span>
          <el-input size="mini" v-else v-model="content.a_fax"></el-input>
        </p>
        <p>
          <span>乙方：</span>
          <span v-if='!isEdit.user'> {{ content.b_company }} </span>
          <el-input size="mini" v-else v-model="content.b_company"></el-input>
        </p>
        <p>
          <span>送货地址：</span>
          <span v-if='!isEdit.user'> {{ content.b_address }} </span>
          <el-input size="mini" v-else v-model="content.b_address"></el-input>
        </p>
        <p>
          <span>手机：</span>
          <span v-if='!isEdit.user'> {{ content.b_phone }} </span>
          <el-input size="mini" v-else v-model="content.b_phone"></el-input>
        </p>
        <p>
          <span>电话：</span>
          <span v-if='!isEdit.user'> {{ content.b_tel }} </span>
          <el-input size="mini" v-else v-model="content.b_tel"></el-input>
        </p>
        <p>
          <span>传真：</span>
          <span v-if='!isEdit.user'> {{ content.b_fax }} </span>
          <el-input size="mini" v-else v-model="content.b_fax"></el-input>
        </p>
        <p>
          <span>付款方式：</span>
          <span v-if='!isEdit.user'> {{ content.payment_method }} </span>
          <el-input size="mini" v-else v-model="content.payment_method"></el-input>
        </p>
        <el-button v-if="content.company_type == 'a'" class="edit" type="primary" size="mini" @click="isEdit.user = !isEdit.user;if(!isEdit.user) editContract()" plain>{{ isEdit.user ? '保存' : '编辑'}}</el-button>
      </div>
      <div class="table">
        <el-table border :data="content.orders">
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
          <el-table-column prop="delivery_period" label="交货期"><template slot-scope="{ row, $index }"><span>{{ row.delivery_period }}</span></template></el-table-column>
          <el-table-column prop="total_price" label="总价"><template slot-scope="{ row, $index }"><span>{{ row.total_price }}</span></template></el-table-column>
        </el-table>
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
          <div>
            <img :src="'data:image/svg+xml;base64, ' + content.a_signature" alt="">
          </div>
          <div class="operation" v-if="content.company_type == 'a'">
            <el-button type="primary" size="mini" @click="modalShow = true">签字</el-button>
            <el-button type="primary" size="mini">盖章</el-button>
          </div>
        </div>
        <div>
          <span>乙方签章：</span>
          <div>
            <img :src="'data:image/svg+xml;base64, ' + content.b_signature" alt="">
          </div>
          <div class="operation" v-if="content.company_type == 'b'">
            <el-button type="primary" size="mini" @click="modalShow = true">签字</el-button>
            <el-button type="primary" size="mini">盖章</el-button>
          </div>
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
import SignaturePad from 'signature_pad';
export default {
  name: 'cantractDetail',
  data() {
    return {
      baseUrl: baseUrl,
      slug: this.$route.params.slug,
      modalShow: false,
      signaturePad: null,
      content: {
        orders: [{ created_at: '0000-00-00 00:00:00' }]
      },
      isEdit: {
        user: false,
        contract: false
      }
    }
  },
  methods: {
    getContract() {
      let that = this,loading = this.$loading({ lock: true });
      that.$get('orders/contract/' + that.slug).then( response => {
        loading.close()
        if(response.status != 200)
          return false;
          that.content = response.data;
      }).catch( error => loading.close());
    },
    editContract() {
      let that = this,loading = this.$loading({ lock: true });
      that.$post('orders/contract/update/' + that.slug, that.content).then( response => {
        loading.close()
        if(response.status != 200)
          return false;
      }).catch( error => loading.close())
    },
    canvasInit() {
      let canvas = document.querySelector("canvas");
      this.signaturePad = new SignaturePad(canvas);
    },
    saveSvg() {
      let that = this,
          svg = this.signaturePad.toDataURL("image/svg+xml");
      const data = svg.split('data:image/svg+xml;base64,')[1],loading = this.$loading({ lock: true });
      that.$post('orders/contract/signature/' + that.slug, {
        signature: data,
        ab: that.content.company_type
      }).then( response => {
        loading.close()
        if( response.status != 200)
          return false;
        that.modalShow = false;
        switch(that.content.company_type){
          case 'a':
            that.content.a_signature = data;
            break;
          case 'b':
            that.content.b_signature = data;
            break;
        }
      }).catch( error => loading.close())
    },
    query(){
      let that = this,loading = that.$loading({ lock: true });
      that.$post('orders/contract/confirm/' + that.slug,{ slug: that.slug })
      .then( response => loading.close()).catch( error => loading.close())
    }
  },
  mounted(){
    this.canvasInit();
  },
  created() {
    this.getContract();
  }
}
</script>
<style lang="less">
@gery: #666666;
@grey: #999999;
@background: #f1f1f1;
@border: solid 1px @background;
#cantractDetail{
  height: 100%;
  width: 100%;
  padding: 1.5rem 2rem;
  color: @gery;
  box-sizing: border-box;
  overflow-y: auto;
  .grey{
    color: @grey;
  }
  .edit() {
    position: absolute;
    right: 1.5rem;
    top: 1rem;
  }
  .contractBody{
    border: @border;
    .contractNumber{
      background-color: @background;
      padding: .5rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div{
        &:first-child{
          span{
            &:first-child{
              margin-right: 3rem;
            }
          }
        }
      }
    }
    .responsiblePerson{
      position: relative;
      padding: 1rem 1.5rem;
      line-height: 1.8;
      >p{
        clear: both;
        > span:first-child{
          float: left;
          width: 5rem;
          margin-right: 2rem;
          white-space: nowrap;
        }
      }
      .el-input{
        width: auto;
        input{
          width: auto;
        }
      }
      .edit{
        .edit();
      }
    }
    .table{
      padding: 1rem;
      box-sizing: border-box;
      width: 100%;
      .el-table{
        width: 100%;
        .goods{
          display: flex;
          align-items: center;
          div{
            &:first-child{
              width: 10rem;
              height: 10rem;
              img{
                width: 100%;
              }
            }
          }
        }
      }
    }
    .extend{
      padding: 1rem;
      position: relative;
      p{
        margin-bottom: 1rem;
      }
      .edit{
        .edit();
      }
    }
    .sign{
      padding: 1rem;
      width: 100%;
      display: flex;
      box-sizing: border-box;
      >div{
        width: 1%;
        flex-grow: 1;
        >div{
          width: 100%;
          padding: 1rem;
          box-sizing: border-box;
          img{
            width: 100%;
            border: @border;
          }
        }
      }
      .operation{
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .query{
    text-align: center;
  }
  .modalBox{
    @media screen and (min-width: 820px){
      top: 180px;
    }
    @media screen and (max-width: 820px){
      top: 0px;      
    }
    div{
      text-align: center;
    }
  }
}
</style>