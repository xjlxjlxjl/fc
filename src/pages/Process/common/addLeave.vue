<template>
  <transition name="el-fade-in-linear">
    <div id="addLeave" v-show="addLeaveModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">新建请假单</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form :model="form" size="mini" label-width="80px">
              <el-form-item label="加班时间">
                <el-date-picker
                  v-model="date"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="工作交接">
                <el-input v-model="form.work_transfer" placeholder="工作交接"></el-input>
              </el-form-item>
              <el-form-item label="请假详情（事由）">
                <el-input type="textarea" v-model="form.details" placeholder="加班说明"></el-input>
              </el-form-item>
              <el-form-item label="是否调休">
                <el-radio-group v-model="form.working_days_off">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="请假总计时长">
                <el-input v-model="form.total_time" placeholder="加班总时长"></el-input>
              </el-form-item>
              <el-form-item label="请假类型">
                <el-select v-model="activeTypeKey" placeholder="请假类型">
                  <el-option
                    v-for="(item, index) in leaveType"
                    :key="index"
                    :label="item.value"
                    :value="index"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工作地址">
                <el-input v-model="form.working_address" placeholder="工作地址"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="onSubmit">立即创建</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "addLeave",
  data() {
    return {
      date: "",
      activeTypeKey: 0,
      form: {
        start_at: "",
        end_at: "",
        work_transfer: "",
        details: "",
        working_days_off: 0,
        total_time: "",
        type: "",
        working_address: ""
      },
      leaveType: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(["setStateData"]),
    getLeaveType() {
      if (this.$store.state.leaveType && this.$store.state.leaveType.length) {
        this.leaveType = this.$store.state.leaveType;
        return false;
      }
      let that = this;
      that
        .$get(`personnels/vacations_type`)
        .then(response => {
          if (response.status != 200) return false;
          that.setStateData("leaveType", response.data.list);
          that.leaveType = response.data.list;
        })
        .catch(err => {});
    },
    onSubmit() {
      let that = this;
      that.form.type = JSON.stringify(that.leaveType[that.activeTypeKey].key);
      that
        .$post(`personnels/vacations/create`, that.form)
        .then(response => {
          if (response.status != 200) return false;
          that.close();
          that.$emit("refresh");
        })
        .catch(err => {});
    },
    close() {
      this.$store.commit("changeModal", "addLeaveModal");
    }
  },
  computed: mapState(["addLeaveModal"]),
  watch: {
    date(newVal, oldVal) {
      this.form.start_at = this.dateParse(newVal[0]);
      this.form.start_at = this.form.start_at.split(":");
      this.form.start_at.pop();
      this.form.start_at = this.form.start_at.join(":");

      this.form.end_at = this.dateParse(newVal[1]);
      this.form.end_at = this.form.end_at.split(":");
      this.form.end_at.pop();
      this.form.end_at = this.form.end_at.join(":");

      this.form.total_time = (newVal[1] - newVal[0]) / 3600 / 1000;
    }
  },
  created() {
    this.getLeaveType();
  }
};
</script>
<style lang="less">
#addLeave {
  .modalBoxMain {
    width: auto;
    .el-form {
      .el-form-item {
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
