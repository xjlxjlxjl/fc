<template>
  <div id="product">
    <transition name="el-fade-in-linear">
      <div v-show="modalShow">
        <div class="Curtain"></div>
        <div class="modalBox">
          <div class="modalBoxMain">
            <div class="modalBoxMainHeader">
              <div class="modalBoxMainHeaderTitle">
                加入项目
              </div>
              <div class="modalBoxMainHeaderBtn" @click="modalShow = false;">
                <i class="el-message-box__close el-icon-close"></i>
              </div>
            </div>
            <div class="modalBoxMainContent">
              <div id="joinProject" v-show="joinProject.status == 0">
                <p>
                  <span>选择您要加入的项目</span>
                  <el-button type="text" @click="joinProject.status = 1">+新建项目</el-button>
                </p>
                <div>
                  <el-select v-model="joinProject.projectSlug">
                    <el-option v-for="(item,key) in joinProject.projectList" 
                              :key="key" :label="item.name" :value="item.slug"></el-option>
                  </el-select>
                </div>
                <div>
                  <el-button type="primary" size="mini" @click="joinProjectCart">确认</el-button>
                </div>
              </div>
              <div id="joinProject" v-show="joinProject.status == 1">
                <el-button class="goBack" type="text" @click="joinProject.status = 0">返回</el-button>
                <el-input v-model="joinProject.newProjectName" placeholder="输入项目名称"></el-input>
                <div>
                  <el-select v-model="joinProject.memberId" size="mini" multiple>
                    <el-option-group v-for="(item,key) in joinProject.member" 
                                    :key="key" :label="item.branch_name" :value="item.branch_id">
                      <el-option v-for="(val,el) in item.member" 
                                :key="el" :label="val.display_name" :value="val.id"></el-option>
                    </el-option-group>
                  </el-select>
                </div>
                <el-input v-model="joinProject.description" placeholder="项目介绍"></el-input>
                <div>
                  <el-button type="primary" size="mini" @click="addProject">确定</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
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
              <span>共有<span class="org">{{ assigned.dealer_quantity }}</span>家供应商</span>
            </div>
            <div class="operation">
              <span>
                <span>数量：</span>
                <el-input-number size="mini" v-model="assigned.quantitative"></el-input-number>
                <span>件</span>
              </span>
              <el-button type="primary" size="mini" v-if="!assigned.is_collect" @click="joinCollect">收藏</el-button>
              <el-button type="primary" size="mini" v-else @click="delCollect(assigned.id)">取消收藏</el-button>
              <el-button type="primary" size="mini" @click="joinContrast">加入对比</el-button>
              <el-button type="primary" size="mini" @click="getProject">加入项目</el-button>
            </div>
          </div>
          <div class="card">
            <el-tabs type="card">
              <el-tab-pane label="详细规格参数">
                <ul class="modelUl">
                  <li v-for="(item,key) in assigned.assigned" :key='key'>
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
                  <iframe :src="'https://factoryun.com/store/3d?strid=' + assigned.str_id" frameborder="0"></iframe>  
                </div>
              </el-tab-pane>
              <el-tab-pane label="2D图纸">
                <div class="model2D">
                  <embed :src="assigned.drawing_2d" type="application/pdf">
                </div>
              </el-tab-pane>
              <el-tab-pane label="型号列表">
                <el-table stripe >
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
                  <img v-if="assigned.images.length > 0" :src="assigned.images ? assigned.images : 'https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg'">
                  <img src="https://factoryun.com/app/default/assets/applications//monster/default-theme/resources/hnimg/miss.jpg">
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <index-chart></index-chart>
      </el-main>
    </div>
    <login-modal></login-modal>
  </div>
</template>
<script>
import indexChart from "@/pages/Index/common/indexChart";
import loginModal from "@/pages/Index/common/loginModal";

export default {
  name: "product",
  data() {
    return {
      modalShow: false,
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
      }
    };
  },
  components: {
    "index-chart": indexChart,
    "login-modal": loginModal
  },
  methods: {
    joinCollect() {
      if (!localStorage.getItem("user")) {
        this.$notify({
          title: "警告",
          message: "请登陆后再作操作",
          type: "warning"
        });
        return false;
      }
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
      if (!localStorage.getItem("user")) {
        this.$notify({
          title: "警告",
          message: "请登陆后再作操作",
          type: "warning"
        });
        return false;
      }
    },
    getBranch() {
      let that = this;
      that
        .$get("members/company/branch")
        .then(response => {
          if (response.status != 200) return false;
          that.joinProject.member = response.data.list;
        })
        .catch(error => {});
    },
    getProject() {
      if (!localStorage.getItem("user")) {
        this.$store.commit("change");
        this.$notify({
          title: "警告",
          message: "请登陆后再作操作",
          type: "warning"
        });
        return false;
      }
      const loading = this.$loading({ lock: true }),
        that = this;
      that
        .$get("carts")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.modalShow = true;
          that.joinProject.projectList = response.data.list;
          if (JSON.parse(localStorage.getItem("user")).slug) that.getBranch();
        })
        .catch(error => loading.close());
    },
    addProject() {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$post("carts/create", {
          name: that.joinProject.newProjectName,
          members_ids: that.joinProject.member.join(","),
          description: that.joinProject.description
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.joinProject.status = 0;
          that.modalShow = false;

          that.joinProject.projectSlug = response.data.slug;
          that.joinProjectCart();
          // that.getProject();
        })
        .catch(error => loading.close());
    },
    joinProjectCart() {
      let that = this,
        loading = this.$loading({ lock: true }),
        url = "";
      if (that.joinProject.projectSlug)
        url = "carts/items/create/" + that.joinProject.projectSlug;
      // else if(that.joinProject.projectList.length)
      //   url = 'carts/items/create/' + that.joinProject.projectList[0].slug;
      else url = "carts/items/create/cart_item";

      that
        .$post(url, {
          product: that.joinProject.id,
          quantity: that.assigned.quantitative,
          selling_price_slug: that.joinProject.history
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.modalShow = false;
          that.$message({ message: "添加成功", type: "success" });
        })
        .catch(error => loading.close());
    }
  },
  created() {
    const that = this,
      loading = this.$loading({ lock: true });
    that.params = that.$route.params;
    console.log(that.params);
    that
      .$post("products/product-details/" + that.params.slug, {
        selling_price_slug: that.params.code
      })
      .then(response => {
        loading.close();
        if (response.status != 200) return false;
        that.assigned = response.data;
      })
      .catch(error => loading.close());
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
    height: 83%;
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
            .goodsImg,
            .qrCode {
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
              margin-bottom: 0.5rem;
            }
            .detail {
              width: 100%;
              display: flex;
              justify-content: space-between;
              white-space: nowrap;
              margin-bottom: 0.5rem;
            }
            .operation {
              margin-bottom: 0.5rem;
              > span {
                display: block;
                margin-bottom: 0.5rem;
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
  .modalBoxMain {
    width: 330px;
    @media screen and (min-width: 500px) {
      margin-top: 180px;
    }
    #joinProject {
      p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .goBack {
        float: right;
        padding-top: 0;
      }
      > div {
        text-align: center;
        margin-bottom: 1rem;
        .el-select {
          width: 100%;
        }
        &:last-child {
          margin-top: 2rem;
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>