<template>
  <transition name="el-fade-in-linear">
    <div id="createdWork" v-show="createdWorkModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">新建任务</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="work">
              <el-date-picker
                v-model="datetime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
              <el-input v-model="content" placeholder="请输入工作内容"></el-input>
              <el-select v-model="userList" placeholder="请选择人员" :multiple="true">
                <el-option-group
                  v-for="group in userBranch"
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
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="created">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import "@/assets/css/modal.css";
import { mapState } from "vuex";

export default {
  name: "createdWork",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      userList: [],
      datetime: [],
      content: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    getBranch() {
      if (this.userBranch.length) return false;
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get("members/company/branch")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$store.commit("getUserBranch", response.data.list);
        })
        .catch(err => loading.close());
    },
    created() {
      let that = this,
        loading = this.$loading({ lock: true }),
        params = {
          content: that.content,
          start_time: that.dateParse(that.datetime[0]),
          end_time: that.dateParse(that.datetime[1]),
          users: `[${that.userList.join(",")}]`
        };
      that
        .$post("job/create", params)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$emit("refresh");
          that.close();
        })
        .catch(err => loading.close());
    },
    close() {
      this.userList = [];
      this.datetime = [];
      this.content = "";
      this.$store.commit("changeModal", "createdWorkModal");
    }
  },
  computed: mapState(["createdWorkModal", "userBranch"]),
  created() {
    if (this.user.slug) this.getBranch();
  }
};
</script>
<style lang="less">
#createdWork {
  #work {
    .el-date-editor {
      width: 100%;
    }
    > .el-input {
      margin: 1rem 0;
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>
