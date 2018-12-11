<template>
  <el-aside id="companyAside" width="200px">
    <createdWork @refresh="getWorkList"></createdWork>
    <el-menu default-active="0" @select="menuSelect">
      <router-link
        v-for="(item,index) in aside"
        v-if="item.status != 4"
        :key="index"
        :to="item.url"
      >
        <el-menu-item :index="index.toString()">
          <span slot="title">{{ item.name }}</span>
          <el-button v-if="!index" slot="title" type="info" size="mini" @click="created">新建</el-button>
        </el-menu-item>
      </router-link>
    </el-menu>
  </el-aside>
</template>
<script>
import { mapState } from "vuex";
import createdWork from "@/pages/Process/common/createdWork";

export default {
  name: "companyAside",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null
    };
  },
  props: {
    aside: Array
  },
  components: {
    createdWork: createdWork
  },
  methods: {
    menuSelect(key) {
      console.log(this.aside[key].url);
      // this.$route.path = this.aside[key].url;
    },
    handleSelect(key) {
      if (key == "-1") return false;
      let that = this,
        self = that.aside[key],
        members = "",
        taskState = false;
      self.members.forEach(e => {
        members += `<p>姓名：${e.user.display_name}　进度：${
          e.status_text
        }</p>`;
        if (e.user.id == this.user.user.id) taskState = e.status;
      });
      let content = `
        <div>
          <p>任务内容：${self.content}</p>
          <p>发布者：${self.creator}</p>
          <p>结束时间：${self.end_time}</p>
          <p>任务成员：${members}</p>
          <p>任务状态：${self.status_text}</p>
        </div>
      `;
      switch (taskState) {
        case 0:
        case 1:
          let url = null,
            btn = "",
            params = {};
          if (taskState) {
            btn = "完成";
            url = `job/complete/${self.id}`;
          } else {
            btn = "接受（ 完成时间为任务结束时间 ）";
            url = `job/accept/${self.id}`;
            // 开始选择接受完成时间
            params.estimate_complete_time = self.end_time;
          }
          // 接受
          this.$confirm(content, "工作详情", {
            confirmButtonText: btn,
            cancelButtonText: "确定",
            dangerouslyUseHTMLString: true
          })
            .then(() =>
              that
                .$post(url, params)
                .then(response => {
                  if (response.status != 200) return false;
                  that.getWorkList();
                })
                .catch(err => console.error(err))
            )
            .catch(() => {});
          break;
        case 2:
        case 3:
          this.$alert(content, "工作详情", {
            dangerouslyUseHTMLString: true
          });
          break;
        default:
          // 发布者
          this.$confirm(content, "工作详情", {
            confirmButtonText: "作废",
            cancelButtonText: "确定",
            dangerouslyUseHTMLString: true
          })
            .then(() => {
              that
                .$post(`job/invalid/${self.id}`)
                .then(response => {
                  if (response.status != 200) return false;
                  that.aside[key].status = 4;
                })
                .catch(err => console.error(err));
            })
            .catch(() => {});
          break;
      }
    },
    created() {
      createdWork.methods.close.call(this);
    },
    getWorkList() {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get("job/list")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.aside = response.data.list;
        })
        .catch(err => loading.close());
    }
  },
  computed: mapState(["createdWorkModal"]),
  created() {
    // this.getWorkList();
  }
};
</script>
<style lang="less">
@background: #f2f2f2;
@borderBlod: solid 1rem @background;
@border: solid 1px @background;
@white: #ffffff;
@gery: #666666;
@sky: #2288ff;
@orange: #ff9900;
@orgBorder: solid 1px @orange;
#companyAside {
  // margin-top: 1.5rem;
  border-right: @borderBlod;
  // padding: 1rem;
  background: @white;
  .lead {
    font-size: 20px;
    margin-bottom: 0.5rem;
    button {
      float: right;
    }
  }
  .el-menu {
    border-right: none;
    a {
      text-decoration: none;
    }
    .el-menu-item {
      padding: 0.5rem 1rem !important;
      color: @gery;
      height: auto;
      min-height: 3.4rem;
      line-height: 1.4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      word-break: break-all;
      white-space: normal;
      span {
        font-size: 1.4rem;
      }
      button {
        padding: 3px 15px;
      }
    }
    .is-active {
      color: #ff9900;
      border-bottom: @orgBorder;
    }
  }
}
</style>
