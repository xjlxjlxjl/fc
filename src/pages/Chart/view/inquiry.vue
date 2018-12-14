<template>
  <div id="inquiry">
    <supplier :list="supplierList" :slug="projectSlug" :productId="productId"></supplier>
    <demand :demand="demandDetail"></demand>
    <chatModal :companyId="parseInt(companyId)" :companyName="companyName"></chatModal>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in typeSelection"
        :key="index"
        :label="item.name"
        :name="item.label"
      >
        <el-table
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column prop="product" label="产品" width="340">
            <template slot-scope="{ row, $index }">
              <div class="imgBox">
                <img
                  :src="row.product ? row.product.image ? row.product.image : fLOGO : fLOGO"
                  width="100"
                >
              </div>
              <div class="description">
                <p>{{ row.product ? row.product.name ? row.product.name: '非标商品' : '非标商品' }}</p>
                <p>{{ row.product ? row.product.model ? row.product.model : row.demand : row.demand }}</p>
                <p>{{ row.product ? row.product.description : '' }}</p>
                <el-button
                  v-if="activeName == 'inquiry' && !row.cart"
                  type="primary"
                  size="mini"
                  @click="getDetail(row.id)"
                >编辑需求</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="询价日期" width="107">
            <template slot-scope="{ row,$index }">
              <span>{{ row.inquiry_datetime || row.created_at }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="supplier" label="供应商" width="220">
            <template slot-scope="{ row,$index }">
              <div align="center" class="supplier">
                <el-select
                  v-model="row.supplier"
                  size="mini"
                  @change="selectSupplier(row.cart_slug, row.supplier, row.str_id)"
                >
                  <el-option
                    v-for="item in (typeof row.price == 'object' ? row.price : [])"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                  ></el-option>
                </el-select>
                <el-button
                  v-if="row.cart && activeName == 'offer'"
                  type="primary"
                  size="mini"
                  @click="againInquiry((typeof row.price == 'object' ? row.price : [row.supplier]), row.cart_slug, row.product.id)"
                >再次询价</el-button>
                <el-button
                  v-if="!row.cart && activeName == 'inquiry'"
                  type="primary"
                  size="mini"
                  @click="getDetail(row.id)"
                >再次询价</el-button>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="报价日期" width="107">
            <template slot-scope="{ row, $index }">
              <span>{{ row.product ? row.product.created_at : "" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="85">
            <template slot-scope="{ row, $index }">
              <span>{{ typeof row.price == 'object' ? row.cart_item_price : row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="delivery_period" label="交期" width="50">
            <template slot-scope="{ row, $index }">
              <span>{{ row.delivery_period }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="end_at" label="报价有效期至" width="100"></el-table-column>
          <el-table-column prop="name" label="在线咨询" width="80">
            <template slot-scope="{ row,$index }">
              <a
                href="javascript:;"
                @click="awaken(row.company_id,row.company_name)"
                target="_blank"
              >
                <i class="font_family icon-xiaoxi"></i>
              </a>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div align="right" style="margin-top: 1rem;" v-if="activeName == 'inquiry'">
      <el-button type="primary" size="mini" @click="joinCart">加入购物车</el-button>
      <el-button type="danger" size="mini" @click="delInquiry">删除</el-button>
    </div>
  </div>
</template>
<script>
import supplier from "@/pages/Chart/common/supplier";
import demand from "@/pages/Chart/common/demand";
import chatModal from "@/pages/chart/common/customerChat";

export default {
  name: "inquiry",
  data() {
    return {
      fLOGO:
        "https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/category_logo/非标定制.jpg",
      user: JSON.parse(localStorage.getItem("user")),
      activeName: "inquiry",
      typeSelection: [
        {
          name: "我的询价",
          label: "inquiry",
          isActive: true
        }
      ],
      tableData: [],
      inquiryList: {
        list: [],
        pagination: {
          current_page: 0,
          total: 0
        }
      },
      offerList: {
        list: [],
        pagination: {
          current_page: 0,
          total: 0
        }
      },
      demandDetail: {},
      supplierList: [],
      projectSlug: "",
      productId: "",
      companyId: 0,
      companyName: ""
    };
  },
  components: {
    supplier: supplier,
    demand: demand,
    chatModal: chatModal
  },
  methods: {
    handleClick() {
      switch (this.activeName) {
        case "offer":
          this.tableData = this.offerList.list;
          break;
        default:
          this.tableData = this.inquiryList.list;
          break;
      }
      document.getElementsByClassName("el-tabs__content")[0].scrollTop =
        document.getElementsByClassName("el-tabs__content")[0].scrollTop - 1;
    },
    getInquiry() {
      if (
        this.inquiryList.pagination.current_page != 0 &&
        this.inquiryList.pagination.total / 15 <=
          this.inquiryList.pagination.current_page
      )
        return false;
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get("orders/inquiry-price", {
          per_page: 15,
          page: ++that.inquiryList.pagination.current_page
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          response.data.list.forEach(e => that.inquiryList.list.push(e));
          that.inquiryList.pagination = response.data.pagination;
          this.handleClick();
        })
        .catch(err => loading.close());
    },
    getOffer() {
      if (
        this.offerList.pagination.current_page != 0 &&
        this.offerList.pagination.total / 15 <=
          this.offerList.pagination.current_page
      )
        return false;
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get("orders/quoted-price", {
          per_page: 15,
          page: ++that.offerList.pagination.current_page
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          response.data.list.forEach(e => that.offerList.list.push(e));
          that.offerList.pagination = response.data.pagination;
          this.handleClick();
        })
        .catch(err => loading.close());
    },
    selectSupplier(slug, supplier, id) {
      if (!slug || !supplier || !id) return false;
      let that = this;
      that
        .$post(`carts/items/price-company/${slug}/${id}/${supplier.slug}`)
        .then(response => {
          if (response.status != 200) return false;
        })
        .catch(err => console.error(err));
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getDetail(id) {
      let that = this;
      that
        .$get(`orders/inquiry-price/detail/${id}`)
        .then(response => {
          if (response.status != 200) return false;
          response.data.fileList = [];
          response.data.images_ids = [];
          response.data.images.forEach(e => {
            response.data.fileList.push({
              name: e.url.split("/").pop(),
              url: e.url
            });
            response.data.images_ids.push(e.id);
          });
          that.demandDetail = response.data;
          demand.methods.close.call(this);
        })
        .catch(err => console.error(err));
    },
    delInquiry() {
      let that = this,
        arr = [],
        isDemand = true,
        url = null;
      if (this.multipleSelection.length != 1) {
        this.$message({ message: "每次删除限制为一个", type: "error" });
        return false;
      }
      this.multipleSelection.forEach(e => {
        if (e.cart) isDemand = false;
        arr.push(e.id);
      });

      if (isDemand) url = `orders/inquiry-price/delete/${arr.join(",")}`;
      else url = `carts/items/inquiry/close/${arr.join(",")}`;

      that
        .$get(url)
        .then(response => {
          if (response.status != 200) return false;
          if (that.activeName == "inquiry") {
            that.inquiryList = {
              list: [],
              pagination: {
                current_page: 0,
                total: 0
              }
            };
            that.getInquiry();
          } else {
            that.offerList.list = [];
            that.getOffer();
          }
        })
        .catch(err => console.error(err));
    },
    againInquiry(data, slug, id) {
      this.supplierList = data;
      this.projectSlug = slug;
      this.productId = id.toString();
      supplier.methods.close.call(this);
    },
    joinCart() {
      let that = this,
        arr = [];
      this.multipleSelection.forEach(e => arr.push(e.id));
      that
        .$post("orders/inquiry-price/cart", {
          demand_id: arr.join(",")
        })
        .then(response => {
          if (response.status != 200) return false;
          that.getInquiry();
        })
        .catch(err => console.error(err));
    },
    awaken(id, name) {
      if (!this.$ifLogin()) return false;
      this.companyId = id;
      this.companyName = name;
      chatModal.methods.close.call(this);
    }
  },
  created() {
    if (this.user.slug) {
      this.typeSelection.push({
        name: "我的报价",
        label: "offer",
        isActive: false
      });
      this.getOffer();
    }
    this.getInquiry();
  },
  mounted() {
    document.getElementsByClassName("el-tabs__content")[0].onscroll = e => {
      if (e.target.scrollTop == e.target.scrollHeight - e.target.clientHeight) {
        switch (this.activeName) {
          case "inquiry":
            this.getInquiry();
            break;
          case "offer":
            this.getOffer();
            break;
        }
      }
    };
  }
};
</script>
<style lang="less">
@org: #ff9900;
@gery: #666666;
@blue: #0064db;
@white: #ffffff;
@background: #f3f4f7;
@border: solid 1px @white;

#inquiry {
  width: 100%;
  height: 95%;
  box-sizing: border-box;
  padding: 2rem 3rem 2rem 2rem;
  .el-tabs {
    height: 100%;
    .el-tabs__header {
      border-bottom: none;
      margin: 0;
    }
    .el-tabs__content {
      height: 90%;
      overflow: auto;
    }
  }
  .el-table {
    height: 89%;
    .el-table__body-wrapper {
      overflow-y: auto;
      height: 100%;
      table {
        .cell {
          display: flex;
          align-items: center;
          .imgBox {
            box-sizing: border-box;
            padding: 0.5rem;
          }
          .description {
            p {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
            button {
              margin-top: 0.5rem;
            }
          }
          .supplier {
            button {
              margin-top: 1rem;
              display: block;
              width: 100%;
            }
          }
          a {
            text-decoration: none;
          }
          .font_family {
            color: @org;
            line-height: 6rem;
            font-size: 6rem;
          }
        }
      }
    }
  }
}
</style>