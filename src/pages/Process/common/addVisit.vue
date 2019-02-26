<template>
  <transition name="el-fade-in-linear">
    <div id="addVisit" v-show="addVisitModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">添加访问记录</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form
              label-position="left"
              ref="form"
              :rules="rules"
              label-width="80px"
              :model="form"
              size="mini"
            >
              <el-form-item label="公司名称" prop="client_company">
                <el-input v-model="form.client_company" placeholder="公司名称"></el-input>
              </el-form-item>
              <el-form-item label="所用产品" prop="product_used">
                <el-input v-model="form.product_used" placeholder="所用产品"></el-input>
              </el-form-item>
              <el-form-item label="年采购量" prop="purchase_quantity_year">
                <el-input v-model="form.purchase_quantity_year" placeholder="年采购量"></el-input>
              </el-form-item>
              <el-form-item label="付款方式" prop="payment_method">
                <el-input v-model="form.payment_method" placeholder="付款方式"></el-input>
              </el-form-item>
              <el-form-item label="建议事项">
                <el-input v-model="form.suggestions" placeholder="建议事项"></el-input>
              </el-form-item>
              <el-form-item label="市场状态">
                <el-input v-model="form.market_status" placeholder="市场状态"></el-input>
              </el-form-item>
              <el-form-item label="拜访内容">
                <el-input v-model="form.visiting_content" placeholder="拜访内容"></el-input>
              </el-form-item>
              <el-form-item label="客户等级">
                <el-input v-model="form.customer_level" placeholder="客户等级"></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="form.mobile" placeholder="电话"></el-input>
              </el-form-item>
              <el-form-item label="联系人">
                <el-input v-model="form.contact" placeholder="联系人"></el-input>
              </el-form-item>
              <el-form-item label="营业内容">
                <el-input v-model="form.business_content" placeholder="营业内容"></el-input>
              </el-form-item>
              <el-form-item label="同行人">
                <el-input v-model="form.together" placeholder="同行人"></el-input>
              </el-form-item>
              <el-form-item label="访问时间">
                <el-date-picker v-model="form.access_at" type="datetime" placeholder="访问时间"></el-date-picker>
              </el-form-item>
              <el-form-item label="访问地址">
                <el-input v-model="form.address" placeholder="访问地址"></el-input>
              </el-form-item>
              <el-form-item label="访问记录">
                <el-input v-model="form.access_records" placeholder="访问记录"></el-input>
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
  name: "addVisit",
  data() {
    return {
      form: {
        client_company: "",
        product_used: "",
        purchase_quantity_year: "",
        payment_method: "",
        suggestions: "",
        market_status: "",
        visiting_content: "",
        customer_level: "",
        mobile: "",
        contact: "",
        business_content: "",
        together: "",
        access_at: "",
        address: "",
        access_records: ""
      },
      rules: {
        client_company: [
          { required: true, message: "公司名称", trigger: "blur" }
        ],
        product_used: [
          { required: true, message: "所用产品", trigger: "blur" }
        ],
        purchase_quantity_year: [
          { required: true, message: "年采购量", trigger: "blur" }
        ],
        payment_method: [
          { required: true, message: "付款方式", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    slug: String
  },
  methods: {
    onSubmit() {
      let that = this;
      this.$refs["form"].validate(v => {
        if (!v) return false;
        that
          .$post(`customers/visit/create`, {
            slug: that.slug,
            access_at: that.form.access_at
              ? that.miniDateParse(that.form.access_at)
              : "",
            access_records: that.form.access_records,
            address: that.form.address,
            business_content: that.form.business_content,
            client_company: that.form.client_company,
            contact: that.form.contact,
            customer_level: that.form.customer_level,
            market_status: that.form.market_status,
            mobile: that.form.mobile,
            payment_method: that.form.payment_method,
            product_used: that.form.product_used,
            purchase_quantity_year: that.form.purchase_quantity_year,
            suggestions: that.form.suggestions,
            together: that.form.together,
            visiting_content: that.form.visiting_content
          })
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.clearForm();
          })
          .catch(err => console.error(err));
      });
    },
    clearForm() {
      this.$refs["form"].resetFields();
    },
    close() {
      this.$store.commit("changeModal", "addVisitModal");
    }
  },
  computed: mapState(["addVisitModal"])
};
</script>
<style lang="less">
#addVisit {
  .modalBoxMain {
    .el-form {
      .el-form-item {
        &:last-child {
          margin-bottom: 0;
          .el-form-item__content {
            .el-upload {
              text-align: left;
            }
            .el-upload-list {
              max-height: 250px;
              overflow: auto;
            }
            .el-upload__input {
              opacity: 0;
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>

