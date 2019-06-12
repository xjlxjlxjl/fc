<template>
  <div class="modal fade" id="getRecord" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-table :data="arr" border stripe>
            <el-table-column prop="shipment_company_name" label="物流公司"></el-table-column>
            <el-table-column prop="shipment_number" label="物流单号"></el-table-column>
            <el-table-column prop="product_sn" label="产品SN码"></el-table-column>
            <el-table-column prop="ship_at" label="出货日期"></el-table-column>
            <el-table-column prop="ship_quantity" label="出货数量"></el-table-column>
            <el-table-column prop="ship_user" label="发货人"></el-table-column>
            <el-table-column prop="payment_at" label="付款日期"></el-table-column>
            <el-table-column prop="deposit_at" label="定金日期"></el-table-column>
            <el-table-column prop="invoice_at" label="发票日期"></el-table-column>
            <el-table-column prop="balance_at" label="余款日期"></el-table-column>
          </el-table>
        </div>
        <div class="modal-footer">
          <el-button size="mini" data-dismiss="modal">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "getRecord",
  data() {
    return {};
  },
  props: {
    arr: Array
  }
}
</script>
<style lang="less">
#getRecord {

}
</style>
