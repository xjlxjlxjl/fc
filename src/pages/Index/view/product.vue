<template>
  <div id="product">
    <join-project :join-project="joinProject" :quantity="assigned.quantitative"></join-project>
    <login-modal></login-modal>
    <chatModal :companyId="assigned.company_id" :companyName="assigned.company_name"></chatModal>
    <div class="main">
      <el-aside width="298px">
        <div class="typeSelector">
          <header>选型器</header>
          <div class="body">
            <div class="goodsImg">
              <img v-if="assigned.images.length > 0" :src="assigned.images ? assigned.images : ''">
              <!-- <img v-else src="https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg"> -->
            </div>
            <div class="qrCode">
              <!-- <img src="https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg"> -->
            </div>
          </div>
        </div>
        <div class="params">
          <ul>
            <li v-for="(item,index) in assigned.attribute" :key="index">
              <p>{{ item.name }}</p>
              <div>
                <el-input :value="item.value"></el-input>
              </div>
            </li>
          </ul>
        </div>
      </el-aside>
      <el-main>
        <div class="goods">
          <div class="header">
            <p class="blue">{{ assigned.name }}</p>
            <div class="detail">
              <span>{{ assigned.type }}</span>
              <span>价格：{{ assigned.sales_price }}</span>
              <span>交期：{{ assigned.delivery_period }}天</span>
              <span>
                共有
                <span class="org">{{ assigned.dealer_quantity }}</span>家供应商
              </span>
            </div>
            <div class="operation">
              <span>
                <span>数量：</span>
                <el-input-number size="mini" v-model="assigned.quantitative"></el-input-number>
                <span>件</span>
              </span>
              <el-button
                type="primary"
                size="mini"
                v-if="!assigned.is_collect"
                @click="joinCollect"
              >收藏</el-button>
              <el-button type="primary" size="mini" v-else @click="delCollect(assigned.id)">取消收藏</el-button>
              <el-button type="primary" size="mini" @click="joinContrast">加入对比</el-button>
              <el-button type="primary" size="mini" @click="getProject">加入项目</el-button>
              <el-button type="primary" size="mini" @click="awaken">咨询</el-button>
            </div>
          </div>
          <div class="card">
            <el-tabs type="card">
              <el-tab-pane label="详细规格参数">
                <ul class="modelUl">
                  <li v-for="(item,key) in assigned.assigned" :key="key">
                    <div>{{ item.name }}</div>
                    <div>{{ item.value }}</div>
                  </li>
                  <li v-for="(item,index) in assigned.attribute" :key="index">
                    <div>{{ item.name }}</div>
                    <div>{{ item.value }}</div>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="3D预览">
                <div class="model3D">
                  <iframe
                    :src="'https://factoryun.com/store/3d?strid=' + assigned.str_id"
                    frameborder="0"
                  ></iframe>
                </div>
              </el-tab-pane>
              <el-tab-pane label="2D图纸">
                <div class="model2D">
                  <embed v-for="item in assigned.drawing_2d_v2" :key="item" :src="item" type="application/pdf">
                </div>
              </el-tab-pane>
              <el-tab-pane label="型号列表">
                <el-table stripe>
                  <el-table-column prop="model" label="型号"></el-table-column>
                  <el-table-column prop="model" label="系列"></el-table-column>
                  <el-table-column prop="model" label="地板宽度"></el-table-column>
                  <el-table-column prop="model" label="有效行程"></el-table-column>
                  <el-table-column prop="model" label="连续推力"></el-table-column>
                  <el-table-column prop="model" label="峰值推力"></el-table-column>
                  <el-table-column prop="model" label="动子数"></el-table-column>
                  <el-table-column prop="model" label="霍尔"></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="规格表">
                <div class="Specification">
                  <img
                    v-if="assigned.images.length > 0"
                    :src="assigned.images ? assigned.images : 'https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg'"
                  >
                  <img
                    src="https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg"
                  >
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <index-chart></index-chart>
      </el-main>
    </div>
  </div>
</template>
<script>
import indexChart from "@/pages/Index/common/indexChart";
import joinProjectModel from "@/pages/Index/common/joinProject";
import loginModal from "@/pages/Index/common/loginModal";
import chatModal from "@/pages/Chart/common/consu";

export default {
  name: "product",
  data() {
    return {
      params: {},
      goodsParams: {
        exercise_mode: "1",
        number_of_mover: "1",
        load_weight: "1",
        distance: "1",
        distance: "1",
        time: "1",
        stay_time: "1",
        reproduce_the_accuracy: "1",
        positioning_accuracy: "1",
        seal: "1",
        mountingmotor: "1",
        dustproof_device: "1",
        cable_length: "1",
        power_voltage: "1"
      },
      assigned: {
        images: []
      },
      joinProject: {
        id: this.$route.params.model,
        projectList: [],
        projectSlug: "",
        history: this.$route.params.code,
        status: 0,
        newProjectName: "",
        member: [],
        memberId: [],
        description: ""
      },
      companyId: 0
    };
  },
  components: {
    "index-chart": indexChart,
    "join-project": joinProjectModel,
    "login-modal": loginModal,
    chatModal: chatModal
  },
  methods: {
    joinCollect() {
      if (!this.$ifLogin()) return false;
      let that = this;
      this.$post("members/collects/create", { products: that.params.model })
        .then(response => {
          if (response.status != 200) return false;
          that.assigned.is_collect = 1;
        })
        .catch(err => conosle.error(err));
    },
    delCollect(id) {
      let that = this;
      that
        .$post("members/collects/delete", { products: id })
        .then(response => {
          if (response.status != 200) return false;
          that.assigned.is_collect = 0;
        })
        .catch(err => console.error(err));
    },
    joinContrast() {
      if (!this.$ifLogin()) return false;
      let arr = JSON.parse(localStorage.getItem("contrast") || "{}"),
        inArr = false;
      if (!arr[this.assigned.parent_category.name])
        arr[this.assigned.parent_category.name] = [];
      arr[this.assigned.parent_category.name].forEach(e => {
        if (e.slug == this.$route.params.slug) inArr = true;
      });
      this.assigned.historySlug = this.$route.params.code;
      if (!inArr) arr[this.assigned.parent_category.name].push(this.assigned);
      localStorage.setItem("contrast", JSON.stringify(arr));
    },
    awaken() {
      if (!this.$ifLogin()) return false;
      chatModal.methods.close.call(this);
    },
    getProject() {
      if (!this.$ifLogin()) return false;
      joinProjectModel.methods.getProject.call(this);
    },
    getDetail() {
      const that = this,
        loading = this.$loading({ lock: true });
      that.params = that.$route.params;
      that
        .$post(`products/product-details/${that.params.slug}`, {
          selling_price_slug: that.params.code
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.assigned = response.data;
        })
        .catch(error => loading.close());
    }
  },
  created() {
    this.getDetail();
  }
};
</script>
<style lang="less">
@white: #ffffff;
@blue: #0064db;
@org: #ff9900;
@background: #f2f2f2;
@boldBorder: solid 1rem @background;
@border: solid 1px @background;
@gery: #666666;
.org {
  color: @org;
}
.blue {
  color: @blue;
}
#product {
  @media screen and (min-width: 880px) {
    max-width: 1280px;
    margin: 0 auto;
    height: 87%;
    padding-top: 1.5rem;
    .main {
      height: 100%;
      width: 100%;
      background-color: @white;
      display: flex;
      color: #666666;
      .el-aside {
        border-right: @boldBorder;
        box-sizing: border-box;
        height: 100%;
        .typeSelector {
          width: 100%;
          header {
            background-color: @blue;
            padding: 1rem;
            color: @white;
          }
          .body {
            display: flex;
            padding: 1rem;
            border-bottom: @border;
            .goodsImg,
            .qrCode {
              width: 200px;
              box-sizing: border-box;
              padding: 0.5rem;
              img {
                width: 100%;
              }
            }
          }
        }
        .params {
          height: 69%;
          overflow-y: auto;
          ul {
            li {
              padding: 1rem;
              border-bottom: @border;
              display: flex;
              justify-content: space-between;
              align-items: center;
              &:last-child {
                border: none;
              }
              p {
                line-height: 40px;
              }
              > div {
                .el-input {
                  width: auto;
                  height: 30px;
                  margin: 0.5rem 0;
                  input {
                    width: 10rem;
                    height: 30px;
                  }
                }
                span {
                  display: inline-block;
                  width: 7rem;
                }
              }
            }
          }
        }
      }
      .el-main {
        box-sizing: border-box;
        width: 300px !important;
        position: relative;
        .goods {
          width: 92%;
          height: 100%;
          .header {
            p {
              font-size: 1.8rem;
              height: 3rem;
              line-height: 3rem;
            }
            .detail {
              min-width: 50%;
              max-width: 60%;
              display: flex;
              justify-content: space-between;
              padding: 0.5rem 0rem;
            }
            .operation {
              padding: 0.5rem 0;
              > span {
                margin-right: 5rem;
              }
            }
          }
          .card {
            margin-top: 1rem;
            height: 82%;
            .el-tabs {
              height: 100%;
            }
            .el-tabs__content {
              height: 90%;
              overflow: auto;
              > div {
                height: 100%;
              }
              .modelUl {
                list-style: none;
                li {
                  width: 50%;
                  box-sizing: border-box;
                  float: left;
                  min-height: 40px;
                  div {
                    box-sizing: border-box;
                    padding: 1rem;
                    width: 50%;
                    float: left;
                    &:first-child {
                      background-color: @background;
                      border-bottom: solid 1px @white;
                    }
                    &:last-child {
                      border-bottom: @border;
                    }
                  }
                }
              }
              .model3D {
                width: 100%;
                height: 100%;
                iframe {
                  width: 100%;
                  height: 99%;
                }
              }
              .model2D {
                width: 100%;
                height: 100%;
                embed {
                  width: 100%;
                  height: 100%;
                }
              }
              // 规格表
              .Specification {
                img {
                  width: 100%;
                }
              }
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 880px) {
    color: @gery;
    .main {
      width: 100%;
      .el-aside {
        width: 100% !important;
        height: auto;
        .typeSelector {
          header {
            font-size: 1.6rem;
            padding: 0.5rem;
          }
          .body {
            width: 100%;
            display: flex;
            .goodsImg {
              width: 1%;
              flex-grow: 1;
              box-sizing: border-box;
              border: @border;
              img {
                width: 100%;
              }
            }
          }
        }
        .params {
          box-sizing: border-box;
          padding: 1rem;
          background-color: @white;
          ul {
            list-style: none;
            li {
              display: flex;
              white-space: nowrap;
              justify-content: space-between;
              align-items: center;
              min-height: 30px;
              padding: 0.5rem 0.2rem;
              p,
              div,
              label {
                width: 50%;
                > div {
                  width: 100%;
                  margin: 0.2rem 0;
                  span {
                    width: 50%;
                  }
                }
                .el-input {
                  width: auto;
                  height: 30px;
                  input {
                    width: 60px;
                    height: 30px;
                    line-height: 30px;
                  }
                }
              }
            }
          }
        }
      }
      .el-main {
        background-color: @white;
        padding: 0 1rem 1rem 1rem;
        .goods {
          .header {
            > p {
              font-size: 1.4rem;
              margin-bottom: 1rem;
            }
            .detail {
              width: 100%;
              display: flex;
              justify-content: space-between;
              white-space: nowrap;
              margin-bottom: 1rem;
            }
            .operation {
              margin-bottom: 1rem;
              > span {
                display: block;
                margin-bottom: 1rem;
              }
            }
          }
        }
        .card {
          .modelUl {
            li {
              display: flex;
              margin: 0.5rem 0;
              padding: 0.5rem;
              div {
                width: 1%;
                flex-grow: 1;
              }
              &:nth-child(2n) {
                background-color: @background;
              }
            }
          }
          // 规格表
          .Specification {
            img {
              width: 100%;
            }
          }
        }
      }
    }
  }
}
</style>