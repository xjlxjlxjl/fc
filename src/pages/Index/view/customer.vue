<template>
  <div id="customer">
    <div id="createdCustomerForm">
      <el-form ref="form" :model="form" :rules="rule" size="mini" label-position="left" label-width="100px">
        <div v-for="(v, k) in form.orders" :key="v.index">
          <el-form-item label="销售订单号">
            <el-input v-model="v.order_no"></el-input>
          </el-form-item>
          <el-form-item label="产品SN码">
            <el-input v-model="v.product_sn"></el-input>
          </el-form-item>
          <el-form-item label="料品编码">
            <el-input v-model="v.material_code"></el-input>
          </el-form-item>
          <el-form-item label="料品规格">
            <el-input v-model="v.material_specification"></el-input>
          </el-form-item>
          <el-form-item label="料品名称">
            <el-input v-model="v.material_name"></el-input>
          </el-form-item>
          <el-form-item label="出货日期">
            <el-date-picker
              v-model="v.ship_date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否过保">
            <el-input v-model="v.is_protected"></el-input>
          </el-form-item>
          <el-form-item label="客服问题描述">
            <el-input type="textarea" v-model="v.problem" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="上传图片" style="margin-bottom: 0px;"></el-form-item>
          <el-upload
            action="a"
            class="fileList"
            list-type="picture-card"
            :before-upload="upload"
            :before-remove="remove"
            :file-list="v.fileUrl"
          >
            <i class="el-icon-plus" @click="key = k"></i>
          </el-upload>
          <el-form-item align="right">
            <el-button size="mini" @click="form.orders.splice(k, 1)">删除</el-button>
          </el-form-item>
        </div>
        <el-button 
          style="width: 100%;margin-bottom: 18px;"
          type="info"
          size="mini"
          @click="form.orders.push({ fileUrl: [], images: [] })"
        > +添加产品 </el-button>
        
        <el-form-item prop="customer_company_name" label="客户公司名">
          <el-input v-model="form.customer_company_name" placeholder="公司"></el-input>
        </el-form-item>
        <el-form-item prop="customer_linkman" label="联系人">
          <el-input v-model="form.customer_linkman" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item prop="customer_contact" label="联系电话">
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
        <el-form-item prop="code" label="验证码">
          <el-input v-model="form.code" placeholder="验证码"></el-input>
        </el-form-item>
        <el-form-item prop="customer_other_contact" label="客服地址">
          <el-input v-model="form.customer_other_contact" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="form.remark" placeholder="请输入"></el-input>
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
        customer_company_name: "",
        customer_linkman: "",
        customer_contact: "",
        code: "",
        customer_other_contact: "",
        remark: "",
        token: "",
        orders: [{ fileUrl: [], images: [] }]
      },
      rule: {
        customer_company_name: [{ required: true, message: "客户公司名为必填", trigger: "blur" }],
        customer_linkman: [{ required: true, message: "联系人为必填", trigger: "blur" }],
        customer_contact: [{ required: true, message: "联系电话为必填", trigger: "blur" }],
        code: [{ required: true, message: "验证码为必填", trigger: "blur" }],
        customer_other_contact: [{ required: true, message: "客服地址为必填", trigger: "blur" }]
      },
      state: 1,
      sendCodeTips: "发送验证码",
      isClick: false
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
      this.$refs['form'].validate(v => {
        if (!v) return false;
        createdCustomer.methods.commit.call(this);
      })
    }
  }
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
      > div {
        width: 100%;
      }
      .el-form-item {
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
                font-size: 10px !important;
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
