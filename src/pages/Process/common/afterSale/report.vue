<template>
  <div>
    <createdReport :active="row"></createdReport>
    <reportList :reportId="reportId"></reportList>
    <div class="modal fade" id="report">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
          <div class="modal-body">
            <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="100px">
              <el-form-item label="客户公司名" prop="customer_company_name">
                <el-input v-model="form.customer_company_name"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="linkman">
                <el-input v-model="form.linkman"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="客服地址" prop="address">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
            </el-form>
            <el-table :data="form.item" size="mini" border>
              <el-table-column label="序号" width="50px">
                <template slot-scope="{ $index }"><span>{{ $index + 1 }}</span></template>
              </el-table-column>
              <el-table-column prop="order_number" label="销售订单编号"></el-table-column>
              <el-table-column prop="SN" label="产品SN码"></el-table-column>
              <el-table-column prop="code" label="料品编码"></el-table-column>
              <el-table-column prop="specifications" label="料品规格"></el-table-column>
              <el-table-column prop="name" label="料品名称"></el-table-column>
              <el-table-column prop="date" label="出货日期"></el-table-column>
              <el-table-column prop="is" label="是否过保"></el-table-column>
              <el-table-column prop="description" label="产品故障描述"></el-table-column>
              <el-table-column label="图片">
                <template slot-scope="{ row }">
                  <a v-for="item in row.img" :key="item.id" :href="item.url" target="_blank">
                    <img :src="item.url" />
                  </a>
                </template>
              </el-table-column>
              <el-table-column label="客服记录" align="center">
                <template slot-scope="{ row }">
                  <el-button type="default" size="mini" @click="reportId = row.id;reportListModal = !reportListModal">查看记录</el-button>
                  <el-button type="default" size="mini" style="margin: 0;" @click="createdReportModal = !createdReportModal">添加记录</el-button>                
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
import createdReport from "@/pages/Process/common/afterSale/createdReport";
import reportList from "@/pages/Process/common/afterSale/reportList";

export default {
  name: "report",
  data() {
    return {
      form: {
        customer_company_name: "",
        linkman: "",
        mobile: "",
        address: "",
        item: [
          {
            img: [],
          }
        ]
      },
      rules: {
        customer_company_name: [{ required: true, message: '请输入客户公司名', trigger: 'blur' }],
        linkman: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        address: [{ required: true, message: '请输入客服地址', trigger: 'blur' }]
      },
      row: {},
      reportId: 0,
      reportListModal: false,
      createdReportModal: false
    };
  },
  props: {
    active: Object
  },
  components: {
    createdReport: createdReport,
    reportList: reportList
  },
  methods: {
    onSubmit() {

    }
  },
  watch: {
    createdReportModal() {
      $("#application  #createdReport").modal("toggle");
    },
    reportListModal() {
      $("#application  #reportList").modal("toggle");
    }
  },
  mounted() {
    const that = this;
    $("#application #report").on("shown.bs.modal", function() {
      that.form.customer_company_name = that.active.customer_company_name;
      that.form.linkman = that.active.customer_linkman;
      that.form.mobile = that.active.customer_contact;
      console.log(that.form)
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
