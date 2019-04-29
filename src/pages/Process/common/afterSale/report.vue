<template>
  <div>
    <div class="modal fade" id="report">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
          <div class="modal-body">
            <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="100px">
              <el-form-item label="客户公司名" prop="customer_company_name">
                <el-input v-model="form.customer_company_name"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="customer_linkman">
                <el-input v-model="form.customer_linkman"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="customer_mobile">
                <el-input v-model="form.customer_mobile"></el-input>
              </el-form-item>
              <el-form-item label="客服地址" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-form>
            <el-table :data="form.orders" size="mini" border>
              <el-table-column label="序号" width="50px">
                <template slot-scope="{ $index }"><span>{{ $index + 1 }}</span></template>
              </el-table-column>
              <el-table-column prop="order_no" label="销售订单编号"></el-table-column>
              <el-table-column prop="product_sn" label="产品SN码"></el-table-column>
              <el-table-column prop="material_number" label="料品编码"></el-table-column>
              <el-table-column prop="material_specification" label="料品规格"></el-table-column>
              <el-table-column prop="material_name" label="料品名称"></el-table-column>
              <el-table-column prop="ship_date" label="出货日期"></el-table-column>
              <el-table-column prop="is_protected" label="是否过保">
                <template slot-scope="{ row }"><span>{{ row.is_protected ? "是" : "否" }}</span></template>
              </el-table-column>
              <el-table-column prop="problem" label="产品故障描述"></el-table-column>
              <el-table-column label="图片">
                <template slot-scope="{ row }">
                  <a v-for="item in row.images_url" :key="item.id" :href="item.url" target="_blank">
                    <img :src="item.url" style="max-width: 50px;max-height: 50px;" />
                  </a>
                </template>
              </el-table-column>
              <el-table-column label="客服记录" align="center">
                <template slot-scope="{ $index, row }">
                  <el-button type="default" size="mini" v-if="type != '1'" @click="reportListModal(row.id)">查看记录</el-button>
                  <el-button type="default" size="mini" style="margin: 0;" @click="createdReportModal($index)">添加记录</el-button>                
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="modal-footer" style="text-align: center;">
            <el-button size="mini" type="info" data-dismiss="modal">取消</el-button>
            <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "report",
  data() {
    return {
      form: {
        customer_company_name: "",
        customer_linkman: "",
        customer_mobile: "",
        address: "",
        orders: []
      },
      rules: {
        customer_company_name: [{ required: true, message: '请输入客户公司名', trigger: 'blur' }],
        customer_linkman: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        customer_mobile: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        address: [{ required: true, message: '请输入客服地址', trigger: 'blur' }]
      }
    };
  },
  props: {
    type: String,
    active: Object
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate(v => {
        if (!v) return false;
        let url = '', arr = [];
        if (this.type == "1") url = `service/report/create`;
        else url = `service/report/edit/${this.active.id}`;
        this.form.orders.forEach((e, k) => {
          e.record_ids = this.active.orders[k].record_ids || "";
          if (this.active.orders[k].record_ids)
            arr.push(this.active.orders[k].record_ids);
        });
        if (this.type == "2")
          this.form.record_ids = arr.join(",");
        this
          .$post(url, this.form)
          .then(response => {
            if (response.status != 200) return false;
            $("#application #report").modal("hide");
            $("#report #report").modal("hide");
            this.clearForm();
          })
          .catch(e => console.error(e));
      })
    },
    clearForm() {
      this.form = {
        customer_company_name: "",
        customer_linkman: "",
        customer_mobile: "",
        address: "",
        orders: []
      }
    },
    reportListModal(val) {
      this.$emit("reportListModal", val);
    },
    createdReportModal(index) {
      this.$emit("createdReportModal", { index: index, data: this.form.orders });
    }
  },
  mounted() {
    const that = this;
    $("#report").on("shown.bs.modal", function() {
      if (that.type == "1") that.form.service_id = that.active.id;
      else that.form.service_id = that.active.server_id;
      
      that.form.customer_company_name = that.active.customer_company_name;
      that.form.customer_linkman = that.active.customer_linkman;
      that.form.customer_mobile = that.active.customer_contact || that.active.customer_mobile;
      that.form.address = that.active.customer_other_contact || that.active.address;
      that.form.orders = [];

      for (let e of that.active.orders) {
        let images = e.images_url.map(e => e.id);
        that.form.orders.push({
          id: e.id,
          order_id: e.order_id,
          order_no: e.order_no,
          product_sn: e.product_sn,
          schedule_id: e.schedule_id,
          materail_id: e.material_id,
          material_number: e.material_code || e.material_number,
          material_name: e.material_name,
          material_specification: e.material_specification,
          ship_date: e.ship_date,
          is_protected: e.is_protected,
          problem: e.problem,
          images: images.join(','),
          images_url: e.images_url
        })
      }
    })
  }
}
</script>
<style lang="less">
#report {
  .el-form {
    display: flex;
    .el-form-item {
      width: 25%;
    }
  }
}
</style>
