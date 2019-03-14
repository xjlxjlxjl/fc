<template>
  <transition name="el-fade-in-linear">
    <div id="addOvertime" v-show="addOverTimeModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">加班申请</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form :model="form" ref="form" :rules="rules" size="mini" label-width="80px">
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
              <el-form-item label="打卡记录">
                <el-radio-group v-model="form.sigin_in_method">
                  <el-radio :label="1">有</el-radio>
                  <el-radio :label="0">无</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否调休">
                <el-radio-group v-model="form.working_days_off">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="加班说明">
                <el-input type="textarea" v-model="form.details" placeholder="加班说明"></el-input>
              </el-form-item>
              <el-form-item label="加班时长">
                <el-input v-model="form.total_time" placeholder="加班总时长"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button @click="close">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "addOvertime",
  data() {
    return {
      date: "",
      form: {
        start_at: "",
        end_at: "",
        sigin_in_method: 0,
        working_days_off: 0,
        details: "",
        total_time: ""
      },
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
      },
      rules: {
        start_at: [
          { required: true, message: "加班开始时间不能为空", trigger: "blur" }
        ],
        end_at: [
          { required: true, message: "加班结束时间不能为空", trigger: "blur" }
        ],
        details: [
          { required: true, message: "加班说明不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onSubmit() {
      let that = this;
      this.$refs["form"].validate(verification => {
        if (!verification) return false;
        that
          .$post(`/personnels/overtimes/create`, that.form)
          .then(response => {
            if (response.status != 200) return false;
            that.close();
            that.$emit("refresh");
          })
          .catch(err => {});
      });
    },
    close() {
      this.$store.commit("changeModal", "addOverTimeModal");
    }
  },
  computed: mapState(["addOverTimeModal"]),
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
  }
};
</script>
<style lang="less">
#addOvertime {
  .modalBoxMain {
    width: auto;
  }
  .el-form {
    .el-form-item {
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>