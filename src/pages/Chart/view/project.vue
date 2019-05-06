<template>
  <el-container id="project">
    <!-- 选择供应商 -->
    <supplier
      :list="company.list"
      :slug="projectList.list[index].slug"
      :productId="company.id.toString()"
    ></supplier>
    <!-- 移入项目 -->
    <moveProject :multipleSelection="multipleSelection" :projectList="projectList"></moveProject>
    <!-- 创建项目 -->
    <joinProject :joinProject="joinProject" :quantity="0"></joinProject>
    <el-aside width="200px">
      <el-menu default-active="0" v-if="projectList.list.length > 0">
        <el-menu-item
          v-for="(item,index) in projectList.list"
          v-if="item.is_default"
          :key="index"
          :index="index.toString()"
          @click="showProjectChange(index)"
          class="shoppingCar"
        >
          <i class="font_family icon-xianmu"></i>
          <span>购物车</span>
        </el-menu-item>
        <el-menu-item
          v-for="(item,index) in projectList.list"
          v-if="!item.is_default"
          :key="index"
          :index="index.toString()"
          @click="showProjectChange(index)"
        >
          <i class="el-icon-location"></i>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </el-menu>
      <div class="operation">
        <el-button type="primary" @click="addProject" size="mini">新建</el-button>
        <el-button type="primary" @click="editProject('close')" size="mini">关闭</el-button>
        <el-button type="primary" @click="editProject('del')" size="mini">删除</el-button>
      </div>
    </el-aside>
    <el-main>
      <div class="projectTeam" v-if="!projectList.list[index].is_default">
        <div class="teamHeader">
          <div>
            <span>项目成员（创始人：{{ projectDetail.display_name }}）</span>
          </div>
          <div>
            <i class="font_family icon-chengyuan"></i>
            <el-select v-model="members" placeholder="请选择" @change="editCart" multiple>
              <el-option-group
                v-for="group in options"
                :key="group.branch_id"
                :label="group.branch_name"
              >
                <el-option
                  v-for="item in group.member"
                  :key="item.id"
                  :label="item.display_name"
                  :value="item.id"
                ></el-option>
              </el-option-group>
            </el-select>
          </div>
        </div>
        <div class="teamContant">
          <el-card v-for="(item,index) in displayArr" :key="index">
            <img
              :src="item.url || 'https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg'"
              class="image"
            >
            <div>
              <span>{{ item.display_name }}</span>
            </div>
          </el-card>
        </div>
      </div>

      <el-table
        ref="multipleTable"
        :data="projectDetail.list"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column label="产品" width="400">
          <template slot-scope="{ row,$index }">
            <div>
              <img
                :src="row.product.image || 'https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg'"
              >
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
            <el-input-number
              v-model="row.quantity"
              :min="1"
              label="件数"
              size="mini"
              @change="editGoods(row.quantity, row.str_id)"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="100" show-overflow-tooltip>
          <template slot-scope="{ row,$index }">
            <div v-if="isNaN(row.price)">
              <span>待报价</span>
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="company.id = row.id;company.list = row.all_supplier;inquiry();"
                >询价</el-button>
              </div>
            </div>
            <div v-else>
              <span>{{ row.price }}</span>
              <div v-if="!row.is_close">
                <el-button
                  type="primary"
                  size="mini"
                  @click="company.id = row.id;company.list = row.all_supplier;inquiry();"
                >询价</el-button>
              </div>
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
      <div class="controller">
        <div></div>
        <div>
          <el-button
            type="warning"
            size="mini"
            @click="moveProject"
            v-if="projectList.list[index].is_default"
          >移入项目</el-button>
          <el-button type="primary" size="mini" @click="delGoods">删除</el-button>
          <el-button type="success" size="mini" @click="checkOrder">结算</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import supplier from "@/pages/Chart/common/supplier";
import moveProject from "@/pages/Chart/common/moveProject";
import joinProject from "@/pages/Index/common/joinProject";

export default {
  name: "project",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      index: "0",
      multipleSelection: [],
      projectList: { list: [{ is_default: 1 }] },
      projectDetail: {},
      shoppingCar: {},
      options: [],
      members: [],
      displayArr: [],
      company: {
        list: [],
        id: "",
        company_ids: []
      },
      joinProject: {
        id: 0,
        projectList: [],
        projectSlug: "",
        history: "",
        status: 1,
        newProjectName: "",
        member: [],
        memberId: [],
        description: ""
      }
    };
  },
  components: {
    supplier: supplier,
    moveProject: moveProject,
    joinProject: joinProject
  },
  methods: {
    ...mapMutations(["getUserBranch"]),
    showProjectChange(index) {
      const loading = this.$loading({ lock: true }),
        that = this;
      let self = that.projectList.list[index];
      this.multipleSelection = [];

      if (self.slug == undefined) {
        loading.close();
        return false;
      }
      that
        .$get(`carts/items/${self.slug}`)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          // 重定义
          response.data.list.forEach(e => {
            if (!e.supplier) e.supplier = { slug: null };
            else if (!e.all_supplier.length) e.all_supplier.push(e.supplier);

            if (!e.payment_type) e.payment_type = { slug: null };
            else if (!e.all_payment_type.length) e.all_payment_type.push(e.payment_type);

            if (!e.invoice_type) e.invoice_type = { slug: null };
            else if (!e.all_invoice_type.length) e.all_invoice_type.push(e.invoice_type);
          });
          
          that.projectDetail = response.data;
          that.members = self.members;
          that.displayArr = [];
          that.index = index;
        })
        .catch(error => loading.close());
    },
    toggleSelection(rows) {
      if (rows)
        rows.forEach(row => this.$refs.multipleTable.toggleRowSelection(row));
      else this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getProject() {
      const loading = this.$loading({ lock: true }),
        that = this;
      that
        .$get("carts")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;

          if (response.data.list.length > 0) {
            that.projectList = response.data;
            that.showProjectChange(0);
          }
          if (that.user.slug) that.getBranch();
        })
        .catch(error => loading.close());
    },
    addProject() {
      joinProject.methods.show.call(this);
    },
    editProject(state) {
      let that = this,
        url = null;
      switch (state) {
        case "close":
          url = `carts/close/${this.projectList.list[this.index].slug}`;
          break;
        case "del":
          url = `carts/delete/${this.projectList.list[this.index].slug}`;
          break;
      }
      that
        .$get(url)
        .then(response => {
          if (response.status != 200) return false;
          if (state == "del") {
            that.projectList.list.splice(that.index, 1);
            that.projectDetail.list = [];
          }
          that.$message({ message: response.message, type: "success" });
        })
        .catch(err => console.error(err));
    },
    getBranch() {
      let that = this;
      if (that.options.length) return false;
      if (this.userBranch.length) that.options = this.userBranch;
      else {
        that
          .$get("members/company/branch")
          .then(response => {
            if (response.status != 200) return false;
            this.getUserBranch(response.data.list);
            that.options = response.data.list;
            that.setMembersCard();
          })
          .catch(error => console.error(error));
      }
    },
    // 设置成员卡片
    setMembersCard() {
      let that = this,
        displayArr = [],
        inArray = false;
      that.options.forEach(value => {
        value.member.forEach(item => {
          that.members.forEach(e => {
            if (item.id == e) displayArr.push(item);
          });
        });
      });
      that.displayArr = displayArr.repeatDepth();
    },
    editCart() {
      let that = this,
        loading = that.$loading({ lock: true }),
        self = that.projectList.list[that.index];
      that
        .$post(`carts/edit/${self.slug}`, {
          name: self.name,
          members_ids: that.members.join(",")
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
        })
        .catch(error => loading.close());
    },
    moveProject() {
      moveProject.methods.close.call(this);
    },
    editGoods(quantity, str_id) {
      let that = this;
      that
        .$post(
          `carts/items/edit/${
            that.projectList.list[that.index].slug
          }/${str_id}`,
          { quantity: quantity }
        )
        .then(response => {
          if (response.status != 200) return false;
        })
        .catch(error => console.log(error));
    },
    delGoods() {
      let that = this,
        loading = this.$loading({ lock: true }),
        arr = [];
      this.multipleSelection.forEach(e => arr.push(e.id));
      that
        .$post(`carts/items/delete/${that.projectList.list[that.index].slug}`, {
          ids: arr.join(",")
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.showProjectChange(that.index);
        })
        .catch(error => loading.close());
    },
    cartsItem(key, str_id, slug) {
      let url = null,
        that = this,
        loading = this.$loading({ lock: true });
      switch (key) {
        case 0:
          url = `carts/items/price-company/${
            that.projectList.list[that.index].slug
          }/${str_id}/${slug}`;
          break;
        case 1:
          url = `carts/items/price-invoice/${
            that.projectList.list[that.index].slug
          }/${str_id}/${slug}`;
          break;
        case 2:
          url = `carts/items/price-payment/${
            that.projectList.list[that.index].slug
          }/${str_id}/${slug}`;
          break;
      }
      that
        .$post(url)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          response.data.list.forEach(e => {
            if (!e.supplier) e.supplier = { slug: null };
            if (!e.payment_type) e.payment_type = { slug: null };
            if (!e.invoice_type) e.invoice_type = { slug: null };
          });
          that.projectDetail = response.data;
        })
        .catch(error => loading.close());
    },
    // 询价
    inquiry() {
      supplier.methods.close.call(this);
    },
    checkOrder() {
      let arr = [],
        hasNaN = false;
      if (!this.multipleSelection.length) {
        this.$notify.error({ title: "", message: "没有选中购买商品" });
        return false;
      }

      this.multipleSelection.forEach((e, k) => {
        if (isNaN(e.price)) {
          this.$notify.error({
            title: "",
            message: "选择商品中有尚未报价的商品"
          });
          hasNaN = true;
        }
        // if(!e.supplier.id){
        //   this.$notify.error({ title: '', message: '选择商品中有尚未选择供应商的商品' });
        //   hasNaN = true;
        // }
        // if(!e.invoice_type){
        //   this.$notify.error({ title: '', message: '选择商品中有尚未选择发票类型的商品' });
        //   hasNaN = true;
        // }
        // if(!e.payment_type){
        //   this.$notify.error({ title: '', message: '选择商品中有尚未选择支付方式商品' });
        //   hasNaN = true;
        // }

        arr.push(e.id);
      });

      if (hasNaN) return false;

      const loading = this.$loading({ lock: true }),
        that = this;

      that
        .$post("orders/confirm_order", {
          ids: arr.join(",")
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.projectDetail.projectSlug =
            that.projectList.list[that.index].slug;
          that.projectDetail.list = that.multipleSelection;
          localStorage.setItem("order", JSON.stringify(that.projectDetail));
          window.location.href = "/chart.html#/checkOrder";
        })
        .catch(error => loading.close());
    }
  },
  watch: {
    members(newValue, oldValue) {
      if (newValue.length == oldValue.length) return false;

      let that = this,
        arr = [],
        displayArr = [];
      newValue.forEach(e => {
        if (e.id) arr.push(e.id);
        else arr.push(e);
      });

      that.members = arr;
      that.setMembersCard();
    },
    moveModal(newValue, oldValue) {
      if (!newValue) this.showProjectChange(this.index);
    },
    joinModal(newValue, oldValue) {
      if (!newValue) this.getProject();
    }
  },
  computed: mapState(["moveModal", "joinModal", "userBranch"]),
  created() {
    this.getProject();
  }
};
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
#project {
  height: 100%;
  color: #666666;
  @media screen and (min-width: 720px) {
    .el-aside {
      position: relative;
      .el-menu {
        height: 100%;
        border-right: @borderBold;
        .el-menu-item {
          overflow: hidden;
          text-overflow: ellipsis;
          i {
            visibility: hidden;
          }
          &:hover {
            background-color: @blue-hover;
            color: @white;
            i {
              color: @white;
            }
          }
        }
        .shoppingCar {
          box-sizing: content-box;
          border-bottom: @borderBold;
          i {
            visibility: initial;
          }
        }
        .is-active {
          background-color: @blue;
          color: @white;
          i {
            visibility: initial;
          }
        }
      }
      .operation {
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
      }
    }
    .el-main {
      padding: 2rem;
      .projectTeam {
        width: 100%;
        border: @border;
        box-sizing: border-box;
        .teamHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          height: 40px;
          box-sizing: border-box;
          background-color: @gery;
          > div {
            display: flex;
            align-items: center;
            .el-select {
              input {
                height: 2.5rem !important;
              }
              .clear;
            }
            > i {
              font-size: 3rem;
            }
          }
        }
        .teamContant {
          display: flex;
          flex-wrap: wrap;
          .el-card {
            text-align: center;
            width: 8rem;
            height: 12rem;
            margin: 0.5rem;
            .el-card__body {
              padding: 0;
              img {
                width: 100%;
                max-height: 8rem;
              }
              .item {
                padding: 1rem;
                display: block;
              }
            }
          }
        }
      }
    }
    .el-table {
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
    .controller {
      display: flex;
      justify-content: space-between;
      padding: 0 2rem;
      margin-top: 1rem;
    }
  }
  @media screen and (max-width: 720px) {
    flex-wrap: wrap;
    .el-aside {
      width: 100% !important;
      .el-menu {
        .el-menu-item {
          i {
            visibility: hidden;
          }
          &:hover {
            background-color: @blue-hover;
            color: @white;
            i {
              color: @white;
            }
          }
        }
        .shoppingCar {
          box-sizing: content-box;
          border-bottom: @borderBold;
          i {
            visibility: initial;
          }
        }
        .is-active {
          background-color: @blue;
          color: @white;
          i {
            visibility: initial;
          }
        }
      }
    }
    .el-main {
      display: block;
      padding: 0.5rem;
      .projectTeam {
        width: 100%;
        border: @border;
        box-sizing: border-box;
        .teamHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          height: 40px;
          box-sizing: border-box;
          background-color: @gery;
          > div {
            display: flex;
            align-items: center;
            .el-select {
              input {
                height: 2.5rem !important;
              }
              .clear;
            }
            > i {
              font-size: 3rem;
            }
          }
        }
        .teamContant {
          display: flex;
          flex-wrap: wrap;
          .el-card {
            text-align: center;
            width: 8rem;
            height: 12rem;
            margin: 0.5rem;
            .el-card__body {
              padding: 0;
              img {
                width: 100%;
                max-height: 8rem;
              }
              .item {
                padding: 1rem;
                display: block;
              }
            }
          }
        }
      }
    }
    .el-table {
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
    .controller {
      display: flex;
      justify-content: space-between;
      padding: 0 2rem;
      margin-top: 1rem;
    }
  }
  #joinProject > button {
    display: none;
  }
}
</style>
