<template>
  <div id="apply">
    <div
      style="width: 100%;min-height: 840px;box-sizing: border-box;border: 1px solid rgba(121, 121, 121, 1);padding: 30px;position: relative;"
    >
      <p style="text-align: center;font-size: 24px;">组合单</p>
      <div style="display: flex;justify-content: space-between;margin-top: 60px;padding-top: 15px;border-top: 1px solid #797979;">
        <div style="display: flex;flex-wrap: wrap;justify-content: space-between;font-size: 12px;">
            <p style="margin: 5px 0;width: 50%">组合单号：{{ data.order_no }}</p>
            <p style="margin: 5px 0;width: 50%">创建人：{{ data.creator }}</p>
            <p style="margin: 5px 0;width: 50%">创建日期：{{ data.created_at }}</p>
            <p style="margin: 5px 0;width: 50%">智能提示组合日期：{{ data.combination_at }}</p>
        </div>
        <div id="QrCode" style="width: 80px;"></div>
      </div>
      <p style="border: 1px solid #ebeef5;font-size: 12px;padding: 3px;color: #909399;">组合料</p>
      <el-table :data="data.items.combination" size="mini" border stripe>
        <el-table-column label="序号" width="50"><template slot-scope="{ $index }">{{ $index + 1 }}</template></el-table-column>
        <el-table-column prop="material_info.material_number" label="料品编码"></el-table-column>
        <el-table-column prop="material_info.material_specification" label="料品规格" width="80"></el-table-column>
        <el-table-column prop="material_info.name" label="料品名称" width="80"></el-table-column>
        <el-table-column prop="material_info.len" label="长度" width="50"></el-table-column>
        <el-table-column prop="count" label="数量" width="80"></el-table-column>
        <el-table-column prop="material_info.unit" label="单位" width="80"></el-table-column>
        <el-table-column prop="material_info.repository" label="仓库"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
      </el-table>
      <p style="border: 1px solid #ebeef5;font-size: 12px;padding: 3px;color: #909399;">拆分料</p>
      <el-table :data="data.items.origin" size="mini" border stripe>
        <el-table-column label="序号" width="50"><template slot-scope="{ $index }">{{ $index + 1 }}</template></el-table-column>
        <el-table-column prop="material_info.material_number" label="料品编码"></el-table-column>
        <el-table-column prop="material_info.material_specification" label="料品规格" width="80"></el-table-column>
        <el-table-column prop="material_info.name" label="料品名称" width="80"></el-table-column>
        <el-table-column prop="material_info.len" label="长度" width="50"></el-table-column>
        <el-table-column prop="count" label="数量" width="80"></el-table-column>
        <el-table-column prop="material_info.unit" label="单位" width="80"></el-table-column>
        <el-table-column prop="material_info.repository" label="仓库"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
        items: {
          origin: [],
          other: [],
          split: []
        }
      }
    };
  },
  created() {
    let url = `repositories/combination_order/detail/${this.$route.params.id}`;
    this.$get(url)
      .then(response => {
        if (response.status != 200) return false;
        this.data = response.data;
        setTimeout(
          () =>
            QRCode.toString(
              `https://www.factoryun.com/print.html#/storeCombination/${this.$route.params.id}`,
              (err, string) => (document.getElementById(`QrCode`).innerHTML = string)
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
