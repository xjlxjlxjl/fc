<template>
  <el-container id="project">
    <el-aside width="200px">
      <el-menu default-active="0">
        <el-menu-item index="-1">
          <i class="font_family icon-xianmu"></i>
          <span>　购物车</span>
        </el-menu-item>
        <el-menu-item v-for="(item,index) in projectList.list" 
                     :key="index" :index="index.toString()"
                     @click="showProjectChange(index)">
          <i class="el-icon-location"></i>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <div class="projectTeam">
        <div class="teamHeader">
          <div>
            <span>项目成员（创始人：{{ projectDetail.display_name }}）</span>
          </div>
          <div>
            <i class="font_family icon-chengyuan"></i>
            <el-select v-model="members" placeholder="请选择" @change="editCart" multiple>
              <el-option-group v-for="group in options" :key="group.branch_id" :label="group.branch_name">
                <el-option v-for="item in group.member" :key="item.id"
                  :label="item.display_name" :value="item.id">
                </el-option>
              </el-option-group>
            </el-select>
          </div>
        </div>
        <div class="teamContant">
          <el-card v-for="(item,index) in displayArr" :key="index">
            <img :src="item.url || 'https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg'" class="image">
            <div>
              <span>{{ item.display_name }}</span>
            </div>
          </el-card>
        </div>
      </div>

      <el-table ref="multipleTable" :data="projectDetail.list" tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="产品" width="400">
          <template slot-scope="{ row,$index }">
            <div>
              <img :src="row.product_image || 'https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg'">
            </div>
            <div>
              <p>型号：{{ row.model }}</p>
              <p>名称：{{ row.product_name }}</p>
              <p>创建人：{{ row.member_name }} 创建时间：{{ row.create_time }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="150">
          <template slot-scope="{ row,$index }">
            <el-input-number v-model="row.quantity" :min="1" label="件数" size="mini" @change="editGoods(row.quantity, row.str_id)"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="100" show-overflow-tooltip>
          <template slot-scope="{ row,$index }">
            <div v-if="isNaN(row.price)">
              <span>待报价</span>
              <div>
                <el-button type="primary" size="mini" @click="company.id = row.id;company.list = row.all_supplier;modalShow = true">询价</el-button>
              </div>
            </div>
            <div v-else>
              <span>{{ row.price }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="交期" width="100" show-overflow-tooltip>
          <template slot-scope="{ row,$index }">
            <span>{{ row.delivery_period == null ? "无" : row.delivery_period + '天' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="{ row,$index }">
            <div class="operation">
              <el-select @change="cartsItem(0,row.str_id,row.supplier)" v-model="row.supplier" placeholder="选择供应商">
                <el-option
                  v-for="item in row.all_supplier"
                  :key="item.slug"
                  :label="item.name"
                  :value="item.slug">
                </el-option>
              </el-select>
              <el-select @change="cartsItem(1,row.str_id,row.invoice_type)" v-model="row.invoice_type" placeholder="发票类型">
                <el-option
                  v-for="item in row.all_invoice_type"
                  :key="item.slug"
                  :label="item.name"
                  :value="item.slug">
                </el-option>
              </el-select>
              <el-select @change="cartsItem(2,row.str_id,row.payment_type)" v-model="row.payment_type" placeholder="付款方式">
                <el-option
                  v-for="item in row.all_payment_type"
                  :key="item.slug"
                  :label="item.name"
                  :value="item.slug">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="controller">
        <div></div>
        <div>
          <el-button type="primary" size="mini" @click="delGoods">删除</el-button>
          <el-button type="success" size="mini" @click="checkOrder">结算</el-button>
        </div>
      </div>
    </el-main>
    <transition name="el-fade-in-linear">
      <div v-show="modalShow">
        <div class="Curtain"></div>
        <div class="modalBox">
          <div class="modalBoxMain">
            <div class="modalBoxMainHeader">
              <div class="modalBoxMainHeaderTitle">
                询价
              </div>
              <div class="modalBoxMainHeaderBtn" @click="modalShow = false;">
                <i class="el-message-box__close el-icon-close"></i>
              </div>
            </div>
            <div class="modalBoxMainContent">
              <div id="companySelect">
                <el-checkbox-group v-model="company.company_ids">
                  <el-checkbox v-for="(item,key) in company.list" :label="item.id" :key="key"> {{ item.name }} </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="modalBoxMainBtn">
              <el-button size="mini" @click="modalShow = false;">取消</el-button>
              <el-button size="mini" type="primary" @click="inquiry">确定</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </el-container>
</template>
<script>
import  "@/assets/css/modal.css";
export default {
  name: 'project',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')),
      projectList: {},
      projectDetail: {},
      shoppingCar: {},
      options: [],
      members: [],
      displayArr: [],
      company: {
        list: [],
        id: '',
        company_ids: []
      },
      modalShow: false
    }
  },
  methods: {
    showProjectChange(index) {
      const loading = this.$loading({ lock: true }),that = this;
      let self = that.projectList.list[index];
      this.multipleSelection = [];

      that.$get('carts/items/' + self.slug ).then( response => {
        loading.close();
        if(response.status != 200)
          return false;
        that.projectDetail = response.data;
        that.members = self.members;
        that.displayArr = [];
        that.index = index;
      }).catch( error => loading.close());
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getBranch(){
      let that = this;
      that.$get('members/company/branch').then( response => {
        if(response.status != 200)
          return false;
        that.options = response.data.list;
        that.setMembersCard();
      }).catch( error => {});
    },
    // 设置成员卡片
    setMembersCard() {
      let  that = this,displayArr = [],inArray = false;
      that.options.forEach(value => {
        value.member.forEach(item => {
          that.members.forEach(e => {
            if(item.id == e){
              displayArr.push(item)
            }
          })
        })
      });
      that.displayArr = displayArr.repeatDepth();
    },
    editCart() {
      let that = this,loading = that.$loading({ lock: true }),self = that.projectList.list[that.index];
      that.$post('carts/edit/' + self.slug,{
        name: self.name,
        members_ids: that.members.join(',')
      }).then( response => {
        loading.close();
        if(response.status != 200)
          return false;
      }).catch( error => loading.close());
    },
    editGoods(quantity, str_id) {
      let that = this;
      that.$post('carts/items/edit/'+ that.projectList.list[that.index].slug +'/' + str_id, { quantity: quantity}).then( response => {
        if(response.status != 200)
          return false;
      }).catch( error => console.log(error))
    },
    delGoods(){
      let that = this,loading = this.$loading({ lock: true }),arr = [];
      this.multipleSelection.forEach( e => {
        arr.push(e.id)
      })
      that.$post('carts/items/delete/' + that.projectList.list[that.index].slug, { ids: arr.join(',') }).then( response => {
        loading.close()
        if(response.status != 200)
          return false;
        that.showProjectChange(that.index);
      }).catch( error => loading.close());
    },
    cartsItem(key,str_id,slug){
      let url = null,that = this;
      switch(key){
        case 0:
          url = 'carts/items/price-company/' + that.projectList.list[that.index].slug + '/' + str_id + '/' + slug
          break;
        case 1:
          url = 'carts/items/price-invoice/' + that.projectList.list[that.index].slug + '/' + str_id + '/' + slug
          break;
        case 2:
          url = 'carts/items/price-payment/' + that.projectList.list[that.index].slug + '/' + str_id + '/' + slug
          break;
      }
      that.$post(url);
    },
    // 询价
    inquiry(){
      let loading = this.$loading({ lock: true }),that = this;
      this.$post('carts/items/price-inquiry/' + that.projectList.list[that.index].slug,{
        ids: that.company.id,
        company_ids: that.company.company_ids.join(','),
      }).then( response => {
        loading.close();
        if(response.status != 200)
          return false;
        
        this.$notify({ title: '', message: '请求报价成功', type: 'success' });
        that.modalShow = false;
      }).catch(error => loading.close());
    },
    checkOrder() {
      let arr = [],hasNaN = false;
      if(!this.multipleSelection.length){
        this.$notify.error({ title: '', message: '没有选中购买商品' });
        return false;
      }

      this.multipleSelection.forEach((e,k) => {
        if(isNaN(e.price)){
          this.$notify.error({ title: '', message: '选择商品中有尚未报价的商品' });
          hasNaN = true;
        }
        arr.push(e.product.id)
      });
      if(isNaN)
        return false;

      const loading = this.$loading({ lock: true }),that = this;

      that.$post('orders/confirm_order',{
        item_ids: arr.join(',')
      }).then( response => {
        loading.close();
        if(response.status != 200)
          return false;
        that.projectDetail.projectSlug = that.projectList.list[that.index].slug;
        that.projectDetail.list = that.multipleSelection;
        localStorage.setItem('order',JSON.stringify(that.projectDetail));
        window.location.href = '/chart.html#/checkOrder';
      }).catch( error => loading.close());
    }
  },
  watch:{
    members(newValue, oldValue) {
      if(newValue.length == oldValue.length)
        return false;

      let  that = this,arr = [],displayArr = [];
      newValue.forEach(e => {
        if(e.id)
          arr.push(e.id);
        else
          arr.push(e);
      });

      that.members = arr;
      that.setMembersCard();
    }
  },
  created() {
    const loading = this.$loading({ lock: true }),that = this;
    that.$get('carts').then( response => {
      loading.close();
      if(response.status != 200)
        return false;
      
      if(response.data.list.length > 0)
        that.projectList = response.data;
        that.showProjectChange(0);

        if(that.user.slug)
          that.getBranch();
    }).catch( error => loading.close());
  }
}
</script>
<style lang="less">
@gery: #f2f2f2;
@blue: #0064db;
@blue-hover: #7eb9ff;
@white: #ffffff;
@border: 1px solid #e2e2e2;
@borderBold: 1rem solid @gery;
.clear() {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

@media screen and (min-width: 720px){
  #project{
    height: 100%;
    color: #666666;
    .el-aside{
      .el-menu{
        height: 100%;
        border-right: @borderBold;
        .el-menu-item{
          overflow: hidden;
          text-overflow: ellipsis;
          &:first-child{
            box-sizing: content-box;
            border-bottom: @borderBold;
            i{
              visibility: initial;
            }
          }
          i{
            visibility: hidden;
          }
          &:hover{
            background-color: @blue-hover;
            color: @white;
            i{
              color: @white;
            }
          }
        }
        .is-active{
          background-color: @blue;
          color: @white;
          i{
            visibility: initial;
          }
        }
      }
    }
    .el-main{
      padding: 2rem;
      .projectTeam{
        width: 100%;
        border: @border;
        box-sizing: border-box;
        .teamHeader{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          height: 40px;
          box-sizing: border-box;
          background-color: @gery;
          >div{
            display: flex;
            align-items: center;
            .el-select{
              input{
                height: 2.5rem !important;
              }
              .clear
            }
            >i{
              font-size: 3rem;
            }
          }
        }
        .teamContant{
          display: flex;
          flex-wrap: wrap;
          .el-card{
            text-align: center;
            width: 8rem;
            height: 12rem;
            margin: .5rem;
            .el-card__body{
              padding: 0;
              img{
                width: 100%;
                max-height: 8rem;
              }
              .item{
                padding: 1rem;
                display: block;
              }
            }
          }
        }
      }
    }
    .el-table{
      .el-table__body-wrapper{
        .el-table__row{
          .cell{
            display: flex;
            >div{
              box-sizing: border-box;
              &:first-child{
                margin-right: 1rem;
                img{
                  width: 100px;
                }
              }
            }
            .operation{
              .clear;
              .el-select,
              .el-input,
              input{
                height: 30px;
              }
            }
          }
        }
      }
    }
    .controller{
      display: flex;
      justify-content: space-between;
      padding: 0 2rem;
      margin-top: 1rem;
    }
  }
}
@media screen and (max-width: 720px){
  #project{
    height: 100%;
    color: #666666;
    flex-wrap: wrap;
    .el-aside{
      width: 100% !important;
      .el-menu{
        .el-menu-item{
          &:first-child{
            box-sizing: content-box;
            border-bottom: @borderBold;
            i{
              visibility: initial;
            }
          }
          i{
            visibility: hidden;
          }
          &:hover{
            background-color: @blue-hover;
            color: @white;
            i{
              color: @white;
            }
          }
        }
        .is-active{
          background-color: @blue;
          color: @white;
          i{
            visibility: initial;
          }
        }
      }
    }

    .el-main{
      display: block;
      padding: .5rem;
      .projectTeam{
        width: 100%;
        border: @border;
        box-sizing: border-box;
        .teamHeader{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          height: 40px;
          box-sizing: border-box;
          background-color: @gery;
          >div{
            display: flex;
            align-items: center;
            .el-select{
              input{
                height: 2.5rem !important;
              }
              .clear
            }
            >i{
              font-size: 3rem;
            }
          }
        }
        .teamContant{
          display: flex;
          flex-wrap: wrap;
          .el-card{
            text-align: center;
            width: 8rem;
            height: 12rem;
            margin: .5rem;
            .el-card__body{
              padding: 0;
              img{
                width: 100%;
                max-height: 8rem;
              }
              .item{
                padding: 1rem;
                display: block;
              }
            }
          }
        }
      }
    }
    .el-table{
      .el-table__body-wrapper{
        .el-table__row{
          .cell{
            display: flex;
            >div{
              box-sizing: border-box;
              &:first-child{
                margin-right: 1rem;
                img{
                  width: 100px;
                }
              }
            }
            .operation{
              .clear;
              .el-select,
              .el-input,
              input{
                height: 30px;
              }
            }
          }
        }
      }
    }
    .controller{
      display: flex;
      justify-content: space-between;
      padding: 0 2rem;
      margin-top: 1rem;
    }
  }
}
</style>
