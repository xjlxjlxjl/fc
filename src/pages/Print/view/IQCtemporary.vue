<template>
  <div id="apply">
    <div
      style="width: 100%;min-height: 840px;box-sizing: border-box;border: 1px solid rgba(121, 121, 121, 1);padding: 30px;position: relative;"
    >
      <div id="QrCode" style="position: absolute;width: 80px;"></div>
      <p style="text-align: center;font-size: 24px;">来料暂收单</p>
      <div
        style="display: flex;flex-wrap: wrap;justify-content: space-between;margin-top: 60px;padding-top: 15px;border-top: 1px solid #797979;font-size: 12px;"
      >
        <p style="margin: 5px 0;width: 33.33333%">暂收单号：{{ data.receipt_no }}</p>
        <p style="margin: 5px 0;width: 33.33333%">暂收日期：{{ data.created_at }}</p>
        <p style="margin: 5px 0;width: 33.33333%">暂收员：{{ data.receipt_user.last_name }}</p>
        <p style="margin: 5px 0;width: 33.33333%">暂收来源：{{ data.from }}</p>
        <p style="margin: 5px 0;width: 33.33333%">单号：{{ data.order_number }}</p>
        <p style="margin: 5px 0;width: 33.33333%">是否退换货：{{ data.is_return ? '是' : '否' }}</p>
        <p style="margin: 5px 0;width: 33.33333%">供应商/委外商：{{ data.supplier.name }}</p>
        <p style="margin: 5px 0;width: 33.33333%">供应商联系人：{{ data.supplier.contract }}</p>
        <p style="margin: 5px 0;width: 33.33333%">联系人电话：{{ data.supplier.phone }}</p>
        <p style="margin: 5px 0;width: 33.33333%">采购专员：{{ data.purchase_user }}</p>
      </div>
      <el-table :data="data.items" size="mini" border stripe>
        <el-table-column label="序号" width="50"><template slot-scope="{ $index }">{{ $index + 1 }}</template></el-table-column>
        <el-table-column prop="material.material_number" label="料品编码" width="200"></el-table-column>
        <el-table-column prop="material.name" label="品名" width="150"></el-table-column>
        <el-table-column prop="material.material_specification" label="规格" width="80"></el-table-column>
        <el-table-column prop="material.item_unit" label="单位" width="50"></el-table-column>
        <el-table-column prop="delivery_period" label="交期" width="80"></el-table-column>
        <el-table-column prop="cancel_quantity" label="暂收数量" width="80"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="bad_count" label="不良数量" width="80"></el-table-column>
        <el-table-column prop="bad_reason" label="不良原因"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  data() {
    return {
      data: {
        receipt_user: {},
        supplier: {},
        created_at: " ",
        items: []
      }
    };
  },
  created() {
    let url = `repositories/receipt/detail/${this.$route.params.id}`;
    this.$get(url)
      .then(response => {
        if (response.status != 200) return false;
        this.data = response.data;
        setTimeout(
          () =>
            QRCode.toString(
              `https://www.factoryun.com/print.html#/IQCtemporary/${
                this.$route.params.id
              }`,
              (err, string) =>
                (document.getElementById(`QrCode`).innerHTML = string)
            ),
          500
        );
      })
      .catch(err => console.error(err));
  }
};
</script>
<style lang="less" scoped>
#apply {
}
</style>
