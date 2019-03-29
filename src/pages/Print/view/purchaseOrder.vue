<template>
  <div id="apply">
    <div
      style="width: 100%;min-height: 840px;box-sizing: border-box;border: 1px solid rgba(121, 121, 121, 1);padding: 30px;position: relative;"
    >
      <p style="text-align: center;font-size: 18px;">采购订单</p>
      <div style="display: flex;justify-content: space-between;font-size: 10px;padding-top: 20px;">
        <div>
          <p>公司：深圳市克洛诺斯科技有限公司</p>
          <p>地址：深圳市宝安区石岩街道水田社区宝石东路268-3号伟兴科技园A栋1层</p>
          <p>
            <span style="margin-right: 25px;">电话：0755- 86090058</span>
            <span>传真：0755- 86090058</span>
          </p>
          <p>
            <span style="margin-right: 25px;">网址：xyz.factoryun.com</span>
            <span>邮箱：yangguang@factoryun.com</span>
          </p>
        </div>
        <div id="QrCode" style="width: 80px;height: 80px;"></div>
      </div>

      <div
        style="border-bottom: 1px solid rgb(121, 121, 121);font-size: 10px;padding-bottom: 20px;"
      >
        <div>
          <p>
            <span style="margin-right: 25px;">供应商：深圳市克洛诺斯科技有限公司</span>
            <span>联系人：摸摸摸</span>
          </p>
          <p>地址：深圳市宝安区石岩街道水田社区宝石东路268-3号伟兴科技园A栋1层</p>
          <p>
            <span style="margin-right: 25px;">电话：0755- 86090058</span>
            <span>传真：0755- 86090058</span>
          </p>
          <p>
            <span style="margin-right: 25px;">网址：xyz.factoryun.com</span>
            <span>邮箱：yangguang@factoryun.com</span>
          </p>
        </div>
      </div>

      <div style="margin-top: 15px;font-size: 10px;line-height: 2;">
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">采购订单号：{{ data.number }}</span>
          <span style="width: 50%;">发票类型：{{ data.created_at }}</span>
        </p>
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">创建日期：{{ data.created_at.split(' ')[0] }}</span>
          <span style="width: 50%;">付款条件：{{ data.branch_name }}</span>
        </p>
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">创建人：{{ data.created_by }}</span>
          <span style="width: 50%;">付款方式：{{ data.branch_name }}</span>
        </p>
        <p style="display: flex;justify-content: space-between;">
          <span style="width: 50%;">交货地址：{{ data.created_by }}</span>
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
            >{{ item.price }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.price * item.quantity }}</td>
            <td
              style="border-right: 1px solid rgb(215, 215, 215);border-top: 1px solid rgb(215, 215, 215);"
            >{{ item.delivery_period.split(' ')[0] }}</td>
            <td style="border-top: 1px solid rgb(215, 215, 215);">{{ item.remark }}</td>
          </tr>
          <tr>
            <td colspan="10" style="border-top: 1px solid rgb(215, 215, 215);" align="right">合计：</td>
          </tr>
        </table>
        <div
          style="line-height: 1.4;position: absolute;left: 0;bottom: 0;width: 100%;padding: 30px;box-sizing:border-box;"
        >
          <p>合同条款：</p>
          <p>1、收到订单后必须在当天签回，否则将视为供方已默认收到磁采购订单；</p>
          <p>2、送货单请详细填写采购单号、产品料号、品名规格、数量（勿填价格）等；</p>
          <p>3、必须按期保质保量交换，因逾期交货或品质问题影响需方产生进度的，则当天扣除按该订单总货款的0.1%，未如期完成对账及发票开具的，将延至下月付款；</p>
          <p>4、廉政条约：如发现我司员工与供应商有利益关系，立即取消供应商资格，并扣除所有货款。</p>
        </div>
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
        items: []
      }
    };
  },
  created() {
    let url = `procurement/order/print/${this.$route.params.id}`;
    this.$get(url)
      .then(response => {
        if (response.status != 200) return false;
        this.data = response.data;
        setTimeout(
          () =>
            QRCode.toString(
              `https://www.factoryun.com/purchaseOrder/${this.$route.params.id}`,
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
