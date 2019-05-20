<template>
  <div id="saleNonstandard">
    <div
      style="width: 100%;min-height: 840px;box-sizing: border-box;border: 1px solid rgba(121, 121, 121, 1);padding: 30px;position: relative;"
    >
      <div id="QrCode" style="position: absolute;width: 80px;"></div>
      <p style="text-align: center;font-size: 24px;">非标询价</p>
      <div
        style="display: flex;flex-wrap: wrap;justify-content: space-between;margin-top: 60px;padding-top: 15px;border-top: 1px solid #797979;font-size: 12px;"
      >
        <p style="margin: 5px 0;width: 25%">非标询价单号：{{ data.number }}</p>
        <p style="margin: 5px 0;width: 25%">询价日期：{{ data.created_at }}</p>
        <p style="margin: 5px 0;width: 50%">询价人：{{ data.member_name }}</p>
        <p style="margin: 5px 0;width: 25%">客户公司名：{{ data.customer_name }}</p>
        <p style="margin: 5px 0;width: 25%">客户联系人：{{ data.linkman }}</p>
        <p style="margin: 5px 0;width: 25%">联系电话：{{ data.mobile }}</p>
        <p style="margin: 5px 0;width: 25%">职务：{{ data.position }}</p>
      </div>
      <div class="item">
        <div v-for="(e, k) in data.param" :key="k">
          <div>{{ e.label }}</div>
          <div v-if="e.type == 3">{{ e.enter.join(',') }}</div>
          <div v-else-if="e.type == 6">
            <img v-for="v in e.fileUrl" :key="v.uid" :src="v.url" style="max-width: 80px;max-height: 80px;">
          </div>
          <div v-else>{{ e.enter }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  name: "saleNonstandard",
  data() {
    return {
      data: {
        items: []
      }
    };
  },
  created() {
    let url = `orders/inquiry-price/print/${this.$route.params.id}`;
    this.$get(url)
      .then(response => {
        if (response.status != 200) return false;
        this.data = response.data;
        setTimeout(
          () =>
            QRCode.toString(
              `https://www.factoryun.com/print.html#/saleNonstandard/${this.$route.params.id}`,
              (err, string) => (document.getElementById(`QrCode`).innerHTML = string)
            ),
          500
        );
      })
      .catch(err => console.error(err));
  }
}
</script>
<style lang="less" scoped>
@grey: #999999;
@background: #f2f2f2;
@border: 1px solid @grey;
#saleNonstandard {
  .item {
    display: flex;
    flex-wrap: wrap;
    margin-top: 15px;
    font-size: 12px;
    border-left: @border;
    border-bottom: @border;
    > div {
      display: flex;
      flex-wrap: wrap;
      border-top: @border;
      width: 50%;
      > div {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        border-right: @border;
        padding: 8px;
        &:first-child {
          background-color: @background;
        }
      }
    }
  }
}
</style>
