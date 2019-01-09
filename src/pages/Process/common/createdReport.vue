<template>
  <transition name="el-fade-in-linear">
    <div id="createdReport" v-show="createdReportModal">
      <div class="Curtain" @click="close"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">生成报告</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="report">
              <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="客户名称" prop="customer_name">
                  <el-input v-model="form.customer_name"></el-input>
                </el-form-item>
                <el-form-item label="客户联系人" prop="customer_linkman">
                  <el-input v-model="form.customer_linkman"></el-input>
                </el-form-item>
                <el-form-item label="联系人手机" prop="customer_mobile">
                  <el-input v-model="form.customer_mobile"></el-input>
                </el-form-item>
                <el-form-item label="产品型号" prop="specification">
                  <el-input v-model="form.specification"></el-input>
                </el-form-item>
                <p class="lead widthFull">问题描述</p>
                <el-form-item label="责任方">
                  <el-radio-group v-model="form.organization">
                    <el-radio label="厂内"></el-radio>
                    <el-radio label="客户"></el-radio>
                    <el-radio label="无法判定"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="客服时间" prop="service_at">
                  <el-date-picker
                    v-model="form.service_at"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="问题描述">
                  <el-input v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="原因分析">
                  <el-input v-model="form.analysis"></el-input>
                </el-form-item>
                <el-form-item label="处理方案">
                  <el-input v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="维修建议">
                  <el-input v-model="form.advice"></el-input>
                </el-form-item>
                <p class="lead widthFull">客服文件</p>
                <el-form-item label="客服文件" class="fileList">
                  <el-upload
                    action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                    list-type="picture-card"
                    :before-upload="upload"
                    :before-remove="remove"
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
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      form: {
        customer_name: "",
        customer_linkman: "",
        customer_mobile: "",
        specification: "",
        quantity: 1,
        description: "",
        analysis: "",
        content: "",
        organization: "客户",
        advice: "",
        service_at: "",
        service_id: user.user.id,
        file_ids: [],
        fileUrl: []
      },
      rules: {
        customer_name: [
          { required: true, message: "请输入客户名称", trigger: "blur" }
        ],
        customer_linkman: [
          { required: true, message: "请输入客户联系人", trigger: "blur" }
        ],
        customer_mobile: [
          { required: true, message: "请输入联系人手机", trigger: "blur" }
        ],
        specification: [
          { required: true, message: "请输入产品型号", trigger: "blur" }
        ],
        service_at: [
          { required: true, message: "请输入服务时间", trigger: "blur" }
        ]
      }
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
          that.form.file_ids.push(response.data.upload.id);
        })
        .catch(err => console.error(err));
    },
    remove(item) {
      this.form.fileUrl.forEach((e, k) => {
        if (e.uid == item.uid) {
          this.form.file_ids.splice(k, 1);
          this.form.fileUrl.splice(k, 1);
        }
      });
    },
    commit() {
      let that = this,
        self = that.form;
      that.$refs["form"].validate(v => {
        if (!v) return false;
        that
          .$post(`service/report/create`, {
            number: this.active.product_number,
            customer_name: self.customer_name,
            customer_linkman: self.customer_linkman,
            customer_mobile: self.customer_mobile,
            specification: self.specification,
            quantity: self.quantity,
            description: self.description,
            analysis: self.analysis,
            content: self.content,
            organization: self.organization,
            advice: self.advice,
            service_at: self.service_at,
            service_id: this.active.id,
            file_ids: self.file_ids.join(",")
          })
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.clearForm();
          })
          .catch(err => {});
      });
    },
    clearForm() {
      this.$refs["form"].resetFields();
    },
    close() {
      this.$store.commit("changeModal", "createdReportModal");
    }
  },
  watch: {
    createdReportModal(val) {
      if (!val) return false;
      let self = this.active,
        _this = this.form;
      _this.customer_name = self.customer_company_name;
      _this.customer_linkman = self.customer_linkman;
      _this.customer_mobile = self.customer_contact;
      _this.specification = self.specification;
      _this.organization = self.organization || "客户";
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
    .modalBoxMain {
      width: 845px;
      #report {
        .el-form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            width: 50%;
          }
          .widthFull {
            width: 100%;
          }
        }
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
}
</style>