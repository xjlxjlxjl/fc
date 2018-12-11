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
            <div id="createdCustomerForm">
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
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
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
        customer_file_ids: "",
        business_file_ids: "",
        remark: "",
        company: "",
        ok: 0
      },
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
    commit() {
      let that = this,
        loading = this.$loading({ lock: true });
      this.$post("/service/create", this.form)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          // that.$emit("refresh");
          that.addTable($("#table"), 0, response.data);
          that.close();
        })
        .catch(err => loading.close());
    },
    close() {
      this.$store.commit("changeModal", "createdCustomerModal");
    }
  },
  computed: mapState(["createdCustomerModal"])
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
