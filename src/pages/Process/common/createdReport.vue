<template>
  <transition name="el-fade-in-linear">
    <div id="createdReport" v-show="createdReportModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">生成质检报告书</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="report">
              <el-form :model="form" label-width="80px">
                <el-form-item
                  v-for="(item,index) in label"
                  :key="index"
                  :label="item.name"
                  size="mini"
                >
                  <el-input v-model="form[item.label]"></el-input>
                </el-form-item>
                <el-form-item label="责任方">
                  <el-radio-group v-model="form.organization">
                    <el-radio label="厂内"></el-radio>
                    <el-radio label="客户"></el-radio>
                    <el-radio label="无法判定"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="客服图片" class="fileList">
                  <el-upload
                    action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                    list-type="picture-card"
                    :before-upload="upload"
                    :file-list="form.fileUrl"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="commit">确定</el-button>
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
  name: "createdReport",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      form: {
        reason_analysis: "",
        deal_method: "",
        deal_result: "",
        deal_advice: "",
        organization: "客户",
        service_files_id: [],
        fileUrl: []
      },
      label: [
        { label: "reason_analysis", name: "原因分析" },
        { label: "deal_method", name: "处理方式" },
        { label: "deal_result", name: "处理结果" }
        // { label: "deal_advice", name: "处理建议" }
      ]
    };
  },
  props: {
    active: Object
  },
  methods: {
    upload(file) {
      let form = new FormData(),
        that = this;
      form.append("slug", "customer_service");
      form.append("upload", file);
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          that.form.fileUrl.push({
            name: file.name,
            url: response.data.url
          });
          that.form.service_files_id.push(response.data.upload.id);
        })
        .catch(err => console.error(err));
    },
    commit() {
      let that = this;
      if (!that.form.reason_analysis) {
        that.$message({ message: "原因分析为必填", type: "error" });
        return false;
      }
      if (!that.form.deal_method) {
        that.$message({ message: "处理方式为必填", type: "error" });
        return false;
      }

      that
        .$post(`service/upload/quality/report/${that.active.id}`, {
          reason_analysis: that.form.reason_analysis,
          deal_method: that.form.deal_method,
          deal_result: that.form.deal_result,
          // deal_advice: that.form.deal_advice,
          organization: that.form.organization,
          service_files_id: that.form.service_files_id.join(","),
          report_user_id: that.user.user.id,
          report_user_name: that.user.user.display_name
        })
        .then(response => {
          if (response.status != 200) return false;
          that.$emit("refresh");
          that.close();
          that.clearForm();
        })
        .catch(err => {});
    },
    clearForm() {
      this.form = {
        reason_analysis: "",
        deal_method: "",
        deal_result: "",
        deal_advice: "",
        organization: "客户",
        service_files_id: [],
        fileUrl: []
      };
    },
    close() {
      this.$store.commit("changeModal", "createdReportModal");
    }
  },
  computed: {
    ...mapState(["createdReportModal"])
  }
};
</script>
<style lang="less">
#createdReport {
  .modalBox {
    #report {
      .fileList {
        padding-bottom: 0.5rem;
        max-width: none;
        .el-upload--picture-card {
          width: 90px;
          height: 90px;
          line-height: 102px;
          .el-upload__input {
            opacity: 0;
            display: none;
          }
        }
        .el-upload-list {
          .el-upload-list__item {
            width: 90px;
            height: 90px;
          }
        }
      }
    }
  }
}
</style>