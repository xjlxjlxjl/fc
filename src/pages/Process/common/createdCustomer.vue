<template>
  <transition name="el-fade-in-linear">
    <div id="createdCustomer" v-show="createdCustomerModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">客服申请单</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="createdCustomerForm" v-if="state == 1">
              <el-form :inline="true" :model="form" label-position="left" label-width="100px">
                <el-form-item label="姓名">
                  <el-input v-model="form.customer_linkman" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机">
                  <el-input v-model="form.customer_contact" placeholder="手机">
                    <el-button
                      slot="suffix"
                      type="info"
                      size="mini"
                      round
                      @click="sendCode"
                    >{{ sendCodeTips }}</el-button>
                  </el-input>
                </el-form-item>
                <el-form-item label="验证码">
                  <el-input v-model="form.customer_contact" placeholder="验证码"></el-input>
                </el-form-item>
                <el-form-item label="问题描述">
                  <el-input v-model="form.customer_demand" placeholder="问题描述"></el-input>
                </el-form-item>
                <el-form-item label="上传图片" class="fileList">
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
            <div id="createdCustomerForm" v-else-if="state == 0">
              <el-form :inline="true" :model="form" label-position="left" label-width="100px">
                <el-form-item label="申请人">
                  <el-input v-model="form.apply_linkman" placeholder="申请人"></el-input>
                </el-form-item>
                <el-form-item label="客户联系人">
                  <el-input v-model="form.customer_linkman" placeholder="客户联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系人号码">
                  <el-input v-model="form.customer_contact" placeholder="联系人号码"></el-input>
                </el-form-item>
                <el-form-item label="出货日期">
                  <el-date-picker v-model="form.date" type="datetime" placeholder="出货日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="客户需求">
                  <el-input v-model="form.customer_demand" placeholder="客户需求"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="form.remark" placeholder="备注"></el-input>
                </el-form-item>
                <el-form-item label="图片" class="fileList">
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
  name: "createdCustomer",
  data() {
    return {
      form: {
        apply_linkman: "",
        customer_linkman: "",
        customer_contact: "",
        date: "",
        customer_demand: "",
        customer_file_ids: [],
        business_file_ids: [],
        fileUrl: [],
        remark: "",
        company: "",
        ok: 0
      },
      sendCodeTips: "发送验证码",
      isClick: false,
      tableData: [
        {
          materialsId: "",
          materialsName: "",
          materialSpecifications: "",
          materialsNum: "",
          unit: ""
        }
      ]
    };
  },
  methods: {
    sendCode() {
      if (this.isClick) return false;
      this.sendCodeTips = 60;
      this.isClick = true;
      this.lock = setInterval(() => {
        if (this.sendCodeTips > 1) --this.sendCodeTips;
        else {
          clearInterval(this.lock);
          this.isClick = false;
          this.sendCodeTips = "重新发送";
        }
      }, 1000);
    },
    upload(file) {
      let form = new FormData(),
        that = this;
      form.append("slug", "customer_service");
      form.append("file", file);
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          that.form.fileUrl.push({
            name: file.name,
            url: response.data.url
          });
          that.form.business_file_ids.push(response.data.upload.id);
        })
        .catch(err => console.error(err));
    },
    commit() {
      let that = this,
        loading = this.$loading({ lock: true });
      this.$post("/service/create", {
        apply_linkman: this.form.apply_linkman,
        customer_linkman: this.form.customer_linkman,
        customer_contact: this.form.customer_contact,
        date: this.form.date,
        customer_demand: this.form.customer_demand,
        customer_file_ids: this.form.customer_file_ids.join(","),
        business_file_ids: this.form.business_file_ids.join(",")
      })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          // that.$emit("refresh");
          that.close();
          that.addTable($("#table"), 0, response.data);
        })
        .catch(err => loading.close());
    },
    close() {
      this.$store.commit("changeModal", "createdCustomerModal");
    }
  },
  computed: mapState(["createdCustomerModal"]),
  created() {
    switch (location.pathname) {
      case "/":
      case "/index.html":
        this.state = 1;
        break;
      default:
        this.state = 0;
        break;
    }
  }
};
</script>
<style lang="less">
#createdCustomer {
  .modalBoxMain {
    width: 800px;
    #createdCustomerForm {
      .el-form {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        .el-form-item {
          margin-bottom: 0;
          flex-grow: 1;
          max-width: 374px;
          .el-form-item__content {
            box-sizing: border-box;
            width: 220px;
            &:last-child {
              width: auto;
            }
            .el-input {
              .el-input__inner {
                padding-right: 15px;
              }
              .el-input__suffix {
                button {
                  padding: 5px;
                  font-size: 12px;
                }
              }
            }
            .el-date-editor {
              width: 202px;
            }
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
