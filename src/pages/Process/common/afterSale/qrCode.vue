<template>
  <div class="modal fade qrCode" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div
            ref="qrCodePrint"
            style="display: flex;padding: 15px;margin: auto;width: 540px;"
          >
            <div
              id="qrCodePrintImg"
              style="width: 160px;padding: 15px;border-top: 1px solid;border-left: 1px solid;border-bottom: 1px solid;"
            ></div>
            <div style="width: 100px;border: 1px solid;">
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;"
              >公司</div>
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
              >单号</div>
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
              >创建日期</div>
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
              ></div>
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
              ></div>
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
              ></div>
            </div>
            <div
              style="width: 240px;border-top: 1px solid;border-bottom: 1px solid;border-right: 1px solid;"
            >
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;"
              >{{ modalData.company }}</div>
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
              >{{ modalData.number }}</div>
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
              >{{ modalData.created_at }}</div>
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
              ></div>
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
              ></div>
              <div
                style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
              ></div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-info btn-small" @click="printing">打印</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode";

export default {
  name: "qrCode",
  data() {
    return {
      modalData: {}
    };
  },
  props: {
    url: String
  },
  methods: {
    printing() {
      this.$print(this.$refs.qrCodePrint);
      $(".qrCodePrintModal").modal("hide");
    },
  },
  mounted() {
    const that = this;
    $('#offer .qrCode').on('shown.bs.modal', function () {
      QRCode.toString(that.url, (err, string) => (document.getElementById("qrCodePrintImg").innerHTML = string));
    })
  }
}
</script>
<style lang="less">
.qrCode {

}
</style>