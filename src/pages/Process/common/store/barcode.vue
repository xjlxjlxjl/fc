<template>
  <!-- 条形码 -->
  <div class="modal fade" id="barcode" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div ref="barcode">
            <svg id="barCodeSvg"></svg>
            <table class="table table-bordered">
              <tbody>
                <tr>
                  <td>料品编码</td>
                  <td>LS58D65S5</td>
                </tr>
                <tr>
                  <td>品名</td>
                  <td>盖板</td>
                </tr>
                <tr>
                  <td>规格</td>
                  <td>GGS4454D2S454</td>
                </tr>
                <tr>
                  <td>仓库</td>
                  <td>盖板仓</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div align="right">
            <el-button type="info" size="small"  data-dismiss="modal">取消</el-button>
            <el-button type="info" size="small" @click="print">打印标签</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import JsBarcode from 'jsbarcode';

export default {
  name: "barcode",
  data() {
    return {
      barCodeStyle: { displayValue: false , height: 80, width: 2 }
    };
  },
  props: {
    url: String
  },
  methods: {
    print() {
      this.$print(this.$refs.barcode);
    }
  },
  mounted() {
    const that = this;
    $('#barcode').on("shown.bs.modal", function() {
      JsBarcode(`#barcode #barCodeSvg`, that.url || 'Non-existent', that.barCodeStyle)
    });
  }
}
</script>
<style lang="less">
#barcode {
  .modal-body {
    text-align: center;
    #barCodeSvg {
      width: 100%;
    }
  }
}
</style>