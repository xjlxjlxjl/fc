<template>
  <div id="order">
    <transition name="el-fade-in-linear">
      <div v-show="modalShow">
        <div class="Curtain"></div>
        <div class="modalBox">
          <div class="modalBoxMain">
            <div class="modalBoxMainHeader">
              <div class="modalBoxMainHeaderTitle">
                选择支付方式
              </div>
              <div class="modalBoxMainHeaderBtn" @click="modalShow = false;">
                <i class="el-message-box__close el-icon-close"></i>
              </div>
            </div>
            <div class="modalBoxMainContent">
              <el-radio-group id="payment" v-model="paymentMethods">
                <el-radio label="alipay">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-zhifubaozhifu"></use>
                  </svg>
                </el-radio>
                <el-radio label="unionpay">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yinlianzhifu"></use>
                  </svg>
                </el-radio>
              </el-radio-group>
              <div align='center'>
                <el-button type="primary" size="mini" @click="payment">确定</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="tabs-nav">
      <div v-for="(item,index) in tabsNav" :key="index"
          :class="state == item.state ? 'isActive' : ''" 
          @click="getOrderStatusData(item.state,item.order_status)">{{ item.name }}</div>
    </div>
    <div class="orderList">
      <div class="orderDetail" v-for="(item,index) in tableData" :key="index">
        <div class="orderDetailHeader">
          <div class="number">
            <span>订单编号：{{ item.numbering }}</span>
            <span class="date">{{ item.created_at }}</span>
            <span>{{ item.order_member_name }}</span>
            <span>{{ item.order_status }}</span>
          </div>
          <div class="table">
            <div>产品</div>
            <div>数量</div>
            <div>价格</div>
            <div>交期</div>
            <div>其他</div>
          </div>
        </div>
        <div class="orderDetailContent" v-if="item.products.length > 0"> 
          <div class="productDetail" v-for="(val,key) in item.products" :key="key">
            <div>
              <div><img :src="val.product_image? val.product_image : 'https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg'"></div>
              <div>
                <p>{{ val.product_name }}</p>
                <p>{{ val.product_model }}</p>
              </div>
            </div>
            <div>{{ val.quantity }} 件</div>
            <div>{{ val.total_price ? '￥ ' + val.total_price : '带报价' }}</div>
            <div>{{ val.delivery_period ? val.delivery_period + ' 天' : '未知' }}</div>
          </div>
          <div v-if="item.order_status == '待签合同'">
            <a :href="`${ baseUrl }orders/contract/${ item.contract_slug }`">
              <el-button type="primary" size="mini" @click="signContract(item.contract_slug)"> 签订合同 </el-button>
            </a>
            <el-button type="success" size="mini" @click="orderIdActive = item.numbering;modalShow = true;"> 立即支付 </el-button>
          </div>
          <div v-else>
            <a :href="`${ baseUrl }orders/contract/pdf/${ item.contract_slug }`" target="_blank"><el-button type="primary" size="mini"> 查看合同 </el-button></a>
            <el-button type="success" size="mini" @click="getLogistics(item.contract_slug)">查看物流</el-button>
          </div>
        </div>
        <div class="orderDetailContent" v-else></div>
      </div>
    </div>
  </div>
</template>
<script>
  import icon from '@/assets/icon/iconfont.js'

  export default {
    name: 'order',
    data() {
      return {
        baseUrl: baseUrl,
        state: 0,
        paymentMethods: 'alipay',
        orderIdActive: '',
        modalShow: false,
        tabsNav: [
          { name: '全部', state: 0, order_status: '' },
          { name: '待签合同', state: 1, order_status: 'wait_contract' },
          { name: '待发货', state: 2, order_status: 'confirm_contract' },
          { name: '待收货', state: 3, order_status: 'send_out_goods' },
          { name: '已收货', state:4, order_status: 'complete' }
        ],
        // 显示数据
        tableData: [],
        // 全部
        orderList: {
          list: [],
          pagination: {
            page: 0,
            per_page: 10,
          }
        },
        // 待签合同
        signedList: {
          list: [],
          pagination: {
            page: 0,
            per_page: 10,
          }
        },
        // 待发货
        pendingDeliveryList: {
          list: [],
          pagination: {
            page: 0,
            per_page: 10,
          }
        },
        // 待收货
        receivedGoodsList: {
          list: [],
          pagination: {
            page: 0,
            per_page: 10,
          }
        },
        // 已收货
        alreadyList: {
          list: [],
          pagination: {
            page: 0,
            per_page: 10,
          }
        }
      }
    },
    methods:{
      changeOrderState(state,order_status) {
        let that = this;
        switch(state){
          case 1:
            that.tableData = that.signedList.list;
            break;
          case 2:
            that.tableData = that.pendingDeliveryList.list;
            break;
          case 3:
            that.tableData = that.receivedGoodsList.list;
            break;
          case 4:
            that.tableData = that.alreadyList.list;
            break;
          default:
            that.tableData = that.orderList.list;
            break;
        }
        that.state = state;
      },
      getOrderStatusData(state,order_status) {
        const loading = this.$loading({ lock: true }),that = this;
        let self = null;
        switch(state){
          case 1:
            self = that.signedList;
            break;
          case 2:
            self = that.pendingDeliveryList;
            break;
          case 3:
            self = that.receivedGoodsList;
            break;
          case 4:
            self = that.alreadyList;
            break;
          default:
            self = that.orderList;
            break;
        }
        that.$get('orders',{
          order_status: order_status,
          page: ++self.pagination.page,
          per_page: self.pagination.per_page
        }).then( response => {
          loading.close();
          if(response.status != 200){
            return false;
          }
          for(let item of response.data.list){
            self.list.push(item);
          }
          that.changeOrderState(state,order_status);
        }).catch( error => {
          that.changeOrderState(state,order_status);
          --self.pagination.page
          loading.close();
        });
      },
      signContract(slug) {

      },
      payment() {
        let that = this;
        window.location = 'https://factoryun.com/orders/order_pay?pay_method=' + that.paymentMethods + '&orderId=' + that.orderIdActive;
      },
      getLogistics(slug) {

      }
    },
    created() {
      this.getOrderStatusData(0,'');
    }
  }
</script> 
<style lang="less" scoped>
@white: #ffffff;
@bule: #0064db;
@sky: #2288ff;
@gery: #f3f4f7;
@border: 1px solid @gery;
  .flex-center() {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #order{
    padding: 2rem;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    color: #666666;
    .tabs-nav{
      width: 100%;
      >div{
        width: 20%;
        text-align: center;
        box-sizing: border-box;
        color: @bule;
        background-color: @gery;
        border: 1px solid @white;
        padding: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover{
          background-color: @sky;
          color: @white;
        }
      }
      >div.isActive{
        background-color: @bule;
        color: @white;
      }
      .flex-center;
    }
    .orderList{
      height: 100%;
      margin-top: 2rem;
      overflow-y: auto;
      .orderDetail{
        margin-bottom: 2rem;
        box-sizing: border-box;
        min-width: 75rem;
        .orderDetailHeader{
          .number{
            background-color: @gery;
            padding: 1rem 3rem 1rem 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .date{
              color: #c0c0c0;
            }
          }
          .table{
            display: flex;
            >div{
              text-align: center;
              flex-basis: 12%;
              padding: 1rem;
              border: @border;
              border-bottom: none;
              border-top: none;
              box-sizing: border-box;
              &:first-child{
                flex-basis: 45%;
              }
              &:last-child{
                flex-basis: 19%;
              }
            }
          }
        }
        .orderDetailContent{
          border: @border;
          display: flex;
          flex-wrap: wrap;
          >div{
            box-sizing: border-box;
            &:last-child{
              flex-basis: 19%;
              display: flex;
              justify-content: center;
              align-items: center;
              button{
                padding: .5rem 1rem;
                margin: .5rem;
              }
            }
          }
          .productDetail{
            flex-basis: 81%;
            display: flex;
            >div{
              flex-basis: 17%;
              border: @border;
              &:first-child{
                flex-basis: 64%;
                justify-content: flex-start;
                padding: 1rem;
                box-sizing: border-box;
                >div:first-child{
                  width: 100px;
                  height: 100px;
                  border: @border;
                  display: flex;
                  border-bottom: none;
                  border-top: none;
                  border-left: none;
                  img{
                    width: 100%;
                    align-self: center;
                  }
                }
                p{
                  text-align: left;
                  white-space: nowrap;
                  margin-left: 1rem;
                }
              }
              .flex-center
            }
          }
        }
      }
    }
    #payment{
      .el-radio{
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-left: 0;
        margin-bottom: 1rem;
        svg{
          height: 5rem;
          width: 10rem;
          margin-left: 10rem;
        }
      }
    }
  }
  @media screen and (max-width: 820px){
    #order{
      padding: .5rem;
      .el-table{

      }
    }
  }
</style>
