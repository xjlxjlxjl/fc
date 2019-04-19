<template>
  <div id="saleOrder">
    <div
      style="width: 100%;min-height: 840px;box-sizing: border-box;border: 1px solid rgba(121, 121, 121, 1);padding: 30px;position: relative;"
    >
      <p style="text-align: center;font-size: 18px;">销售订单</p>
      <div style="display: flex;justify-content: space-between;font-size: 10px;padding-top: 20px;">
        <div>
          <p>公司：{{ data.customer.name }}</p>
          <p>地址：{{ data.customer.address }}</p>
          <p>
            <span style="margin-right: 25px;">电话：{{ data.customer.phone }}</span>
            <span>传真：{{ data.customer.fax }}</span>
          </p>
          <p>
            <span style="margin-right: 25px;">网址：{{ data.customer.website }}</span>
            <span>邮箱：{{ data.customer.email }}</span>
          </p>
        </div>
        <div id="QrCode" style="width: 80px;height: 80px;"></div>
      </div>

      <div style="margin-top: 15px;font-size: 10px;line-height: 2;">
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">销售订单号{{ data.numbering }}</span>
          <span style="width: 50%;">发票类型：{{ data.invoice_type_name }}</span>
        </p>
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">创建日期：{{ data.created_at.split(' ')[0] }}</span>
          <span style="width: 50%;">付款方式：{{ data.payment_type_name }}</span>
        </p>
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">创建人：{{ data.created_by_name }}</span>
          <span style="width: 50%;">交货地址：{{ data.address }}</span>
        </p>
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 100%;">付款条件：{{ data.terms_of_payment.text }}</span>
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
            <td style="border-right: 1px solid rgb(215, 215, 215)">单价</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">金额</td>
            <td style="border-right: 1px solid rgb(215, 215, 215)">交期</td>
            <td>备注</td>
          </tr>
          <tr v-for="(item,index) in data.items" :key="index">
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ index + 1 }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.material_code }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.material_name }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.material_specification }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.material_unit }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.quantity }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.purchase_price }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ parseFloat(item.purchase_price) * parseInt(item.quantity) }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.delivery_period }}</td>
            <td style="border-top: 1px solid rgb(215, 215, 215);">{{ item.remark }}</td>
          </tr>
          <tr>
            <td colspan="10" style="border-top: 1px solid rgb(215, 215, 215);" align="right">合计：{{ data.total_price }}</td>
          </tr>
        </table>
        <div
          style="line-height: 1.4;position: absolute;left: 0;bottom: 0;width: 100%;padding: 30px;box-sizing:border-box;"
          v-html="data.terms_of_contract"
        ></div>
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
        customer: {},
        terms_of_payment: {},
        items: []
      }
    };
  },
  mounted() {
    let url = `orders/company/print/${this.$route.params.id}`;
    this.$get(url)
      .then(response => {
        if (response.status != 200) return false;
        this.data = response.data;
        setTimeout(
          () =>
            QRCode.toString(
              `https://www.factoryun.com/print.html#/orders/company/print/${this.$route.params.id}`,
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
<style lang="less">
#saleOrder {
  ul {
    list-style: none;
  }
}
</style>
