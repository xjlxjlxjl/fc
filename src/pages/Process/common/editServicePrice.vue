<template>
    <div id="editServicePrice" class="modal fade" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <el-form :model="form" label-position="left" :rules="rules" size="mini" ref="form" label-width="100px">
              <el-form-item label="总价" prop="price">
                <el-input-number v-model="form.price"></el-input-number>
              </el-form-item>
              <el-form-item label="优惠价" prop="discount_price">
                <el-input-number v-model="form.discount_price"></el-input-number>
              </el-form-item>
              <el-form-item label="报价有效期">
                <el-date-picker
                  v-model="form.validity_date"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="date"
                  placeholder="报价有效期"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="modal-footer">
            <el-button size="mini" type="primary" @click="commit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "editServicePrice",
  data() {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      form: {
        price: "",
        discount_price: "",
        validity_date: "",
        report_user_id: user.user.id,
        report_user_name: user.user.display_name
      },
      rules: {
        price: [{ required: true, message: "请输入总价", trigger: "blur" }],
        discount_price: [
          { required: true, message: "请输入折扣价", trigger: "blur" }
        ]
      }
    };
  },
  props: {
    active: Object
  },
  methods: {
    commit() {
      let that = this;
      this.$refs["form"].validate(v => {
        if (!v) return false;
        that
          .$post(
            `service/quoted_price/price/${that.active.entry.entry_id}`,
            that.form
          )
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
      this.form.validity_date = "";
    },
    close() {
      $("#editServicePrice").modal("toggle");
    }
  },
  mounted() {
    let that = this;
    $('#editServicePrice').on('shown.bs.modal', function () {
      console.log(123)
    })
  }
};
</script>
<style lang="less">
#editServicePrice {
}
</style>
