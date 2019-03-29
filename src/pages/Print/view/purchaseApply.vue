<template>
  <div id="apply">
    <div style="width: 600px;height: 840px;border: 1px solid rgba(121, 121, 121, 1);padding: 30px;">
      <p style="text-align: center;font-size: 18px;">采购申请</p>
      <div
        style="display: flex;justify-content: space-between;border-bottom: 1px solid rgb(121, 121, 121);font-size: 10px;padding: 20px 0;"
      >
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
      <div style="margin-top: 15px;font-size: 10px;line-height: 2;">
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">采购申请单号：{{ data.number }}</span>
          <span style="width: 50%;">创建日期：{{ data.created_at.split(' ')[0] }}</span>
        </p>
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">申请人：{{ data.applicant_name }}</span>
          <span style="width: 50%;">部门：{{ data.branch_name }}</span>
        </p>
        <table
          style="margin-top: 10px;width: 100%;border: 1px solid rgb(215, 215, 215);text-align: center;"
        >
          <tr>
            <td style="border-right: 1px solid rgb(215, 215, 215)">序号</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">料品编码</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">品名</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">规格</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">单位</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">数量</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">需求日期</td>
            <td>备注</td>
          </tr>
          <tr v-for="(item,index) in data.item" :key="index">
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ index + 1 }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.material_code }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.name }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.specification }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.unit }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.quantity }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.demand_at.split(' ')[0] }}</td>
            <td style="border-top: 1px solid rgb(215, 215, 215);">{{ item.remark }}</td>
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
        created_at: " ",
        item: []
      }
    };
  },
  created() {
    let url = `procurement/request/print/${this.$route.params.id}`;
    this.$get(url)
      .then(response => {
        if (response.status != 200) return false;
        this.data = response.data;
        setTimeout(
          () =>
            QRCode.toString(
              `https://www.factoryun.com/print.html#/purchaseApply/${this.$route.params.id}`,
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
