<template>
  <div id="stock">
    <transfeRecord :data="record"></transfeRecord>
    <switchStore :data="list"></switchStore>
    <barcode></barcode>
    <div id="toolbar">
      <el-button type="default" size="mini" @click="change">转仓</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import JsBarcode from "jsbarcode";
import transfeRecord from "@/pages/Process/common/store/transfeRecord";
import switchStore from "@/pages/Process/common/store/switchStore";
import barcode from "@/pages/Process/common/store/barcode";

export default {
  name: "stock",
  data() {
    return {
      record: [],
      list: []
    };
  },
  components: {
    transfeRecord: transfeRecord,
    switchStore: switchStore,
    barcode: barcode
  },
  methods: {
    tableAjaxData(params) {
      params.success({
        rows: [{ id: 20 }],
        total: 1
      });
    },
    tableAjaxParams(params) {
      return params;
    },
    init() {
      const that = this,
        barCodeStyle = { displayValue: false, height: 30, width: 2 },
        columns = [
          {
            checkbox: true
          },
          {
            field: "#",
            title: "料品编码",
            sortable: true
          },
          {
            field: "#",
            title: "料品名称",
            sortable: true
          },
          {
            field: "#",
            title: "料品规格",
            sortable: true
          },
          {
            field: "#",
            title: "单位",
            sortable: true
          },
          {
            field: "id",
            title: "条码",
            formatter: function(value, row, index) {
              let img = `<svg id="barCode${index}"></svg>`;
              setTimeout(
                () => JsBarcode(`#barCode${index}`, value, barCodeStyle),
                500
              );
              return img;
            },
            events: {
              "click svg": function(e, value, row, index) {
                $("#stock #barcode").modal("show");
              }
            }
          },
          {
            field: "category",
            title: "料品类别",
            formatter: function(value, row, index) {
              const checkbox = `
                <div>
                  <div>
                    <label><input type="checkbox" />采购件</label>
                  </div>
                  <div>
                    <label><input type="checkbox" />自制件</label>
                  </div>
                  <div>
                    <label><input type="checkbox" />委外件</label>
                  </div>
                  <div>
                    <label><input type="checkbox" />销售件</label>
                  </div>
                </div>
              `;
              return checkbox;
            },
            events: {
              'change input': function(e, value, row, index) {
                console.log(123)
              },
            }
          },
          {
            field: "attribute",
            title: "料品属性",
            formatter: function(value, row, index) {
              const checkbox = `
                <div>
                  <div><input type="checkbox" />原材料</div>
                  <div><input type="checkbox" />半成品</div>
                  <div><input type="checkbox" />成品</div>
                </div>
              `;
              return checkbox;
            },
            events: {
              'change input': function(e, value, row, index) {
                console.log(321)
              },
            }
          },
          {
            field: "#",
            title: "仓库",
            sortable: true
          },
          {
            field: "#",
            title: "长度",
            sortable: true
          },
          {
            field: "#",
            title: "宽度",
            sortable: true
          },
          {
            field: "#",
            title: "高度",
            sortable: true
          },
          {
            field: "#",
            title: "重量",
            sortable: true
          },
          {
            field: "#",
            title: "采购单位",
            sortable: true
          },
          {
            field: "#",
            title: "销售单位",
            sortable: true
          },
          {
            field: "#",
            title: "Bom单位",
            sortable: true
          },
          {
            field: "#",
            title: "关联子料编码",
            sortable: true
          },
          {
            field: "#",
            title: "拼音码",
            sortable: true
          },
          {
            field: "#",
            title: "材质",
            sortable: true
          },
          {
            field: "#",
            title: "图档号",
            sortable: true
          },
          {
            field: "#",
            title: "生产厂家",
            sortable: true
          },
          {
            field: "#",
            title: "模具号",
            sortable: true
          },
          {
            field: "#",
            title: "标准型号",
            sortable: true
          },
          {
            field: "#",
            title: "料品等级",
            sortable: true
          },
          {
            field: "#",
            title: "品牌",
            sortable: true
          },
          {
            field: "#",
            title: "是否需检",
            sortable: true
          },
          {
            field: "#",
            title: "最小库存量",
            sortable: true
          },
          {
            field: "#",
            title: "最大库存量",
            sortable: true
          },
          {
            field: "#",
            title: "安全库存量",
            sortable: true
          },
          {
            field: "#",
            title: "备货量",
            sortable: true
          },
          {
            field: "#",
            title: "采购周期",
            sortable: true
          },
          {
            field: "#",
            title: "图片",
            sortable: true
          },
          {
            field: "#",
            title: "工程图号",
            sortable: true
          },
          {
            field: "#",
            title: "加工图",
            sortable: true
          },
          {
            field: "#",
            title: "承认图",
            sortable: true
          },
          {
            field: "#",
            title: "2D图纸",
            sortable: true
          },
          {
            field: "#",
            title: "3D图纸",
            sortable: true
          },
          {
            field: "#",
            title: "pdf图纸",
            sortable: true
          },
          {
            field: "#",
            title: "组装图",
            sortable: true
          },
          {
            field: "#",
            title: "期初单价",
            sortable: true
          },
          {
            field: "#",
            title: "入库单价",
            sortable: true
          },
          {
            field: "#",
            title: "出库单价",
            sortable: true
          },
          {
            field: "#",
            title: "入库金额",
            sortable: true
          },
          {
            field: "#",
            title: "出库金额",
            sortable: true
          },
          {
            field: "#",
            title: "入库数量",
            sortable: true
          },
          {
            field: "#",
            title: "出库数量",
            sortable: true
          },
          {
            field: "#",
            title: "期末数量",
            sortable: true
          },
          {
            field: "#",
            title: "期末金额",
            sortable: true
          },
          {
            field: "#",
            title: "调整数量",
            sortable: true
          },
          {
            field: "#",
            title: "调整金额",
            sortable: true
          },
          {
            field: "#",
            title: "税额",
            sortable: true
          },
          {
            field: "#",
            title: "库存可用数量",
            sortable: true
          },
          {
            field: "#",
            title: "在途数量",
            sortable: true
          },
          {
            field: "#",
            title: "占用数量",
            sortable: true
          },
          {
            field: "#",
            title: "创建人",
            sortable: true
          },
          {
            field: "#",
            title: "创建日期",
            sortable: true
          },
          {
            field: "#",
            title: "审核人",
            sortable: true
          },
          {
            field: "#",
            title: "审核日期",
            sortable: true
          },
          {
            field: "#",
            title: "审核状态",
            sortable: true
          },
          {
            field: "#",
            title: "修改人",
            sortable: true
          },
          {
            field: "#",
            title: "修改日期",
            sortable: true
          },
          {
            field: "#",
            title: "删除日期",
            sortable: true
          },
          {
            field: "getRecord",
            title: "转仓记录",
            formatter: function(value, row, index) {
              let getRecord = `<button class="btn btn-sm btn-primary">查看</button>`;
              return getRecord;
            },
            events: {
              "click .btn": function(e, value, row, index) {
                that.record = [];
                $("#stock #transfeRecord").modal("show");
              }
            }
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let del = `<button class="btn btn-sm btn-danger del" style="margin-left: 5px;">删除</button>`;
              return del;
            },
            events: {
              "click .del": function(e, value, row, index) {}
            }
          }
        ],
        data = {
          toolbar: "#stock #toolbar",
          ajax: this.tableAjaxData,
          queryParams: this.tableAjaxParams,
          search: true,
          strictSearch: true,
          showRefresh: true,
          sidePagination: "server",
          pagination: true,
          striped: true,
          clickToSelect: true,
          showColumns: true,
          sortName: "createTime",
          sortOrder: "desc",
          idField: "id",
          showToggle: true,
          showExport: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageList: [10, 25, 50, 100, "All"],
          detailView: false,
          columns: columns,
          detailFormatter(field, mrow, oldValue, $el) {},
          onEditableSave(field, mrow, oldValue, $el) {}
        };

      $("#stock #table").bootstrapTable(data);
    },
    change() {
      $("#stock #switchStore").modal("show");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
@grey: #dddddd;
@border: 1px solid @grey;

#stock {
  #table {
    tbody {
      tr {
        td {
          &:nth-child(6),
          &:nth-child(7),
          &:nth-child(8) {
            padding: 0px;
            > div {
              display: flex;
              > div {
                padding: 15px;
                width: 100px;
                border-right: @border;
                > label {
                  margin-bottom: 0;
                  font-weight: normal;
                }
                &:last-child {
                  border: none;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
