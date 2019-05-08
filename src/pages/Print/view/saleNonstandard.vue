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
        <p style="margin: 5px 0;width: 25%">非标询价单号：AP20190101-001</p>
        <p style="margin: 5px 0;width: 25%">询价日期：2019-01-01</p>
        <p style="margin: 5px 0;width: 50%">询价人：业务</p>
        <p style="margin: 5px 0;width: 25%">客户公司名：深圳默默公司</p>
        <p style="margin: 5px 0;width: 25%">客户联系人：王小二</p>
        <p style="margin: 5px 0;width: 25%">联系电话：13699999999</p>
        <p style="margin: 5px 0;width: 25%">职务：采购</p>
      </div>
      <div class="item">
        <div v-for="(e, k) in data.items" :key="k">
          <div>{{ e.key }}</div>
          <div>{{ e.value }}</div>
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
        items: [
          {
            key: '询价描述',
            value: '客户要求交期快，质量好，价格优',
          },
          {
            key: '询价附件',
            value: '',
          },
          {
            key: '平台规格',
            value: '1000*1000',
          },
          {
            key: '应用产业',
            value: '激光',
          },
          {
            key: '平台类型',
            value: '单轴',
          },
          {
            key: '使用环境',
            value: '一般25℃环境',
          },
          {
            key: '每个轴动子数',
            value: '1',
          },
          {
            key: '负载（kg）',
            value: '100',
          },
          {
            key: '最大速度(m/s)',
            value: '1',
          },
          {
            key: '加速度(m/s2)',
            value: '2',
          },
          {
            key: '行程（m）',
            value: '2',
          },
          {
            key: '重现精度(μm)',
            value: '0.1',
          },
          {
            key: '定位精度（补偿后）(μm)',
            value: '0.2',
          },
          {
            key: '水平直线度（mm）',
            value: '1',
          },
          {
            key: '垂直直线度(mm)',
            value: '1',
          },
          {
            key: '垂直度(arc-sec)',
            value: '1',
          },
          {
            key: '编码类型(μm)',
            value: '二进制',
          },
          {
            key: '运动方式',
            value: '点到点',
          },
          {
            key: '防尘装置',
            value: '无',
          },
          {
            key: '平台安装方式',
            value: '水平',
          },
          {
            key: '本体颜色',
            value: '黑色',
          },
          {
            key: '包装送货方式',
            value: '纸箱/三合板（送货）',
          }
        ]
      }
    };
  },
  created() {
    setTimeout(
      () =>
        QRCode.toString(
          `https://www.factoryun.com/print.html#/IQCtemporary/${this.$route.params.id}`,
          (err, string) => (document.getElementById(`QrCode`).innerHTML = string)
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
        text-align: center;
        box-sizing: border-box;
        border-right: @border;
        padding: 5px;
        &:first-child {
          background-color: @background;
        }
      }
    }
  }
}
</style>
