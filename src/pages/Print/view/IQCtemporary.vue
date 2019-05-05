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
        <p style="margin: 5px 0;width: 33.33333%">暂收单号：PZ20190101-001</p>
        <p style="margin: 5px 0;width: 33.33333%">暂收日期：2019-01-01</p>
        <p style="margin: 5px 0;width: 33.33333%">暂收员：仓库</p>
        <p style="margin: 5px 0;width: 33.33333%">暂收来源：采购订单</p>
        <p style="margin: 5px 0;width: 33.33333%">单号：PO2091010-001</p>
        <p style="margin: 5px 0;width: 33.33333%">是否退换货：否</p>
        <p style="margin: 5px 0;width: 33.33333%">供应商/委外商：深圳默默供应商</p>
        <p style="margin: 5px 0;width: 33.33333%">供应商联系人：王小二</p>
        <p style="margin: 5px 0;width: 33.33333%">联系人电话：1399999999</p>
        <p style="margin: 5px 0;width: 33.33333%">采购专员：采购</p>
      </div>
      <el-table :data="data.items" size="mini" border stripe>
        <el-table-column label="序号" width="50"></el-table-column>
        <el-table-column prop="code" label="料品编码" width="80"></el-table-column>
        <el-table-column prop="name" label="品名" width="50"></el-table-column>
        <el-table-column prop="info" label="规格" width="80"></el-table-column>
        <el-table-column prop="unit" label="单位" width="50"></el-table-column>
        <el-table-column prop="date" label="交期" width="80"></el-table-column>
        <el-table-column prop="num" label="暂收数量" width="80"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="num" label="不良数量" width="80"></el-table-column>
        <el-table-column prop="num" label="不良原因"></el-table-column>
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
        company: {},
        supplier: {},
        created_at: " ",
        items: []
      }
    };
  },
  created() {
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
    return false;
    let url = `procurement/order/print/${this.$route.params.id}`;
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
