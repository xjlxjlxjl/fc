<template>
  <div id="inquiryRecord" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document" style="width: 900px;max-width: 100%;">
      <div class="modal-content">
        <el-table :data="arr" border stripe>
          <el-table-column prop="id" label="询价记录"></el-table-column>
          <el-table-column prop="inquiry_name" label="询价人"></el-table-column>
          <el-table-column prop="quoted_datetime" label="询价日期"></el-table-column>
          <el-table-column prop="member_name" label="报价人"></el-table-column>
          <el-table-column prop="product_model" label="型号"></el-table-column>
          <el-table-column prop="selling_price" label="价格"></el-table-column>
          <el-table-column prop="delivery_period" label="预计交期"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column prop="images" label="附件">
            <template slot-scope="{ row }">
              <a v-for="e in row.images" :key="e.id" :href="e.url" target="_blank">
                <img :src="e.url" style="max-width: 80px;max-height: 80px;">
              </a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "inquiryRecord",
  data() {
    return {};
  },
  props: {
    arr: Array
  },
  mounted() {
    // $("#nonstandard #inquiryRecord").on('shown.bs.modal', () => {})
  }
}
</script>
<style lang="less">
#inquiryRecord {
  
}
</style>