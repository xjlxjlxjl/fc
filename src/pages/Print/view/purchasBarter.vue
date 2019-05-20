<template>
  <div id="IQCunhealthy">
    <div
      style="width: 100%;min-height: 840px;box-sizing: border-box;border: 1px solid rgba(121, 121, 121, 1);padding: 30px;position: relative;"
    >
      <p style="text-align: center;font-size: 18px;">采购换货单</p>
      <div style="display: flex;justify-content: space-between;font-size: 10px;padding-top: 20px;">
        <div>
          <p>公司：{{ data.company.name }}</p>
          <p>地址：{{ data.company.address }}</p>
          <p>
            <span style="margin-right: 25px;">电话：{{ data.company.phone }}</span>
            <span>传真：{{ data.company.fax }}</span>
          </p>
          <p>
            <span style="margin-right: 25px;">网址：{{ data.company.website }}</span>
            <span>邮箱：{{ data.company.email }}</span>
          </p>
        </div>
        <div id="QrCode" style="width: 80px;height: 80px;"></div>
      </div>
      <div
        style="border-bottom: 1px solid rgb(121, 121, 121);font-size: 10px;padding-bottom: 20px;"
      >
        <div>
          <p>
            <span style="margin-right: 25px;">供应商：{{ data.procurement.supplier.name }}</span>
            <span>联系人：{{ data.procurement.supplier_contract.name }}</span>
          </p>
          <p>地址：{{ data.procurement.supplier.address }}</p>
          <p>
            <span style="margin-right: 25px;">电话：{{ data.procurement.supplier.phone }}</span>
            <span>传真：{{ data.procurement.supplier.fax }}</span>
          </p>
          <p>
            <span style="margin-right: 25px;">网址：{{ data.procurement.supplier.website }}</span>
            <span>邮箱：{{ data.procurement.supplier.email }}</span>
          </p>
        </div>
      </div>

      <div style="margin-top: 15px;font-size: 10px;line-height: 2;">
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">采购换货单号：{{ data.number }}</span>
          <span style="width: 50%;">质检日期：{{ data.created_at.split(' ')[0] }}</span>
          <span style="width: 50%;">质检员：{{ data.created_by }}</span>
        </p>
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">暂收来源：{{ data.temp_storage.source }}</span>
          <span style="width: 50%;">单号：{{ data.procurement.number }}</span>
          <span style="width: 50%;">采购专员：{{ data.procurement.created_by }}</span>
        </p>
        <table
          style="margin-top: 10px;width: 100%;border: 1px solid rgb(215, 215, 215);text-align: center;"
        >
          <tr>
            <td style="border-right: 1px solid rgb(215, 215, 215)">序号</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">料品编码</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">料品名称</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">料品规格</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">单位</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">交期</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">不良数</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">需退数</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">实退数</td>
            <td>不良原因</td>
          </tr>
          <tr v-for="(item,index) in data.items" :key="index">
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ index + 1 }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.material.code }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.material.name }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.material.specification }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.material.unit }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.procurement_item.delivery_period }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.bad }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.refund }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.actual_refund }}</td>
            <td style="border-top: 1px solid rgb(215, 215, 215);">{{ item.bad_cause }}</td>
          </tr>
        </table>
      </div>
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
        procurement: {
          supplier: {},
          supplier_contract: {}
        },
        quality: {},
        temp_storage: {},
        created_at: " ",
        items: []
      }
    };
  },
  created() {
    let url = `procurement/emptor/print/${this.$route.params.id}`;
    this.$get(url)
      .then(response => {
        if (response.status != 200) return false;
        this.data = response.data;
        setTimeout(
          () =>
            QRCode.toString(
              `https://www.factoryun.com/print.html#/purchasBarter/${this.$route.params.id}`,
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
#IQCunhealthy {
}
</style>
