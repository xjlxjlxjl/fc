<template>
  <transition name="el-fade-in-linear">
    <div v-show="joinModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">加入项目</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
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
                  <el-option
                    v-for="(item,key) in joinProject.projectList"
                    :key="key"
                    :label="item.name"
                    :value="item.slug"
                  ></el-option>
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
                  <el-option-group
                    v-for="(item,key) in joinProject.member"
                    :key="key"
                    :label="item.branch_name"
                    :value="item.branch_id"
                  >
                    <el-option
                      v-for="(val,el) in item.member"
                      :key="el"
                      :label="val.display_name"
                      :value="val.id"
                    ></el-option>
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
</template>
<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "joinProject",
  data() {
    return {};
  },
  props: {
    joinProject: Object,
    quantity: Number
  },
  methods: {
    ...mapMutations(["getUserBranch"]),
    getBranch() {
      let that = this;
      if (this.userBranch.length) {
        that.joinProject.member = this.userBranch;
      } else {
        that
          .$get("members/company/branch")
          .then(response => {
            if (response.status != 200) return false;
            this.getUserBranch(response.data.list);
            that.joinProject.member = response.data.list;
          })
          .catch(error => console.error(error));
      }
    },
    getProject() {
      const loading = this.$loading({ lock: true }),
        that = this;
      that
        .$get("carts")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          this.$store.commit("joinModalDispaly", true);
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
          if (that.joinProject.id) {
            that.joinProject.status = 0;

            that.joinProject.projectSlug = response.data.slug;
            that.joinProjectCart();
          } else that.close();
        })
        .catch(error => loading.close());
    },
    joinProjectCart() {
      let that = this,
        loading = this.$loading({ lock: true }),
        url = "";
      if (that.joinProject.projectSlug)
        url = `carts/items/create/${that.joinProject.projectSlug}`;
      else url = "carts/items/create/cart_item";

      that
        .$post(url, {
          product: that.joinProject.id,
          quantity: that.quantity,
          selling_price_slug: that.joinProject.history
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$message({ message: "添加成功", type: "success" });
          that.close();
        })
        .catch(error => loading.close());
    },
    show() {
      this.$store.commit("changeModal", "joinModal");
    },
    close() {
      this.$store.commit("changeModal", "joinModal", false);
    }
  },
  computed: mapState(["joinModal", "userBranch"]),
  created() {
    if (
      JSON.parse(localStorage.getItem("user")) &&
      JSON.parse(localStorage.getItem("user")).slug
    )
      this.getBranch();
  }
};
</script>
<style lang="less">
@import "../../../assets/css/modal.css";
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
</style>