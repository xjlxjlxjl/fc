<template>
  <div id="customer">
    <div id="createdCustomerForm">
      <el-form :inline="true" :model="form" label-position="left" label-width="100px">
        <el-form-item label="公司">
          <el-input v-model="form.customer_company_name" placeholder="公司"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.customer_linkman" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input v-model="form.customer_contact" placeholder="手机">
            <el-button
              slot="suffix"
              type="info"
              size="mini"
              class="pcCode"
              round
              @click="sendCode"
            >{{ sendCodeTips }}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item class="moblieCode" style="text-align: right;">
          <el-button type="info" size="mini" round @click="sendCode">{{ sendCodeTips }}</el-button>
        </el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="form.code" placeholder="验证码"></el-input>
        </el-form-item>
        <el-form-item label="产品型号">
          <el-input v-model="form.specification" placeholder="产品型号"></el-input>
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input v-model="form.customer_demand" placeholder="问题描述"></el-input>
        </el-form-item>
        <el-form-item label="上传图片" class="fileList">
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
    <div class="modalBoxMainBtn">
      <el-button size="mini" type="primary" @click="commit">确定</el-button>
    </div>
  </div>
</template>
<script>
import createdCustomer from "@/pages/Process/common/sale/createdCustomer";

export default {
  name: "customer",
  data() {
    return {
      form: {
        number: this.$route.params.number,
        apply_linkman: "",
        customer_company_name: "",
        customer_linkman: "",
        customer_contact: "",
        date: "",
        customer_demand: "",
        specification: "",
        code: "",
        customer_file_ids: [],
        business_file_ids: [],
        fileUrl: [],
        remark: "",
        token: ""
      },
      state: 1,
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
      createdCustomer.methods.sendCode.call(this);
    },
    upload(file) {
      createdCustomer.methods.upload.call(this, file);
    },
    remove(item) {
      createdCustomer.methods.remove.call(this, item);
    },
    commit() {
      createdCustomer.methods.commit.call(this);
    }
  },
  created() {}
};
</script>
<style lang="less">
@white: #ffffff;
#customer {
  padding: 1rem;
  background-color: @white;
  padding-bottom: 150px;
  #createdCustomerForm {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      @media screen and (max-width: 500px) {
        .pcCode {
          display: none !important;
        }
      }
      @media screen and (min-width: 501px) {
        .moblieCode {
          display: none !important;
        }
      }
      .el-form-item {
        width: 100%;
        display: flex;
        .el-form-item__content {
          box-sizing: border-box;
          flex-grow: 1;
          flex-basis: auto;
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
        display: flex;
        flex-wrap: wrap;
        .el-form-item__label {
          display: block;
          padding-right: 0;
        }
        .el-form-item__content {
          > div {
            display: flex;
            flex-direction: column-reverse;
            > ul {
              width: 100%;
              max-width: 100%;
              display: flex;
              flex-wrap: wrap;
            }
          }
        }
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
