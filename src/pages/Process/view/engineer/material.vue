<template>
  <div id="material">
    <transfeRecord :data="record"></transfeRecord>
    <addMaterialModal @refresh="refreshed"></addMaterialModal>
    <barcode></barcode>
    <div id="toolbar">
      <el-button size="mini" @click="addMaterial">新建料品</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>

<script>
import JsBarcode from "jsbarcode";
import transfeRecord from "@/pages/Process/common/store/transfeRecord";
import addMaterialModal from "@/pages/Process/common/engineer/addMaterial";
import barcode from "@/pages/Process/common/store/barcode";

export default {
  name: "material",
  data() {
    return {
      record: []
    };
  },
  components: {
    transfeRecord: transfeRecord,
    addMaterialModal: addMaterialModal,
    barcode: barcode
  },
  methods: {
    tableAjaxData(params) {
      this.$get(`respositories/materials/list`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => console.error(err));
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        name: params.search
      };
    },
    init() {
      const that = this,
        barCodeStyle = { displayValue: false, height: 30, width: 2 },
        columns = [
          {
            checkbox: true
          },
          {
            field: "material_number",
            title: "料品编码",
            sortable: true
          },
          {
            field: "name",
            title: "料品名称",
            editable: {
              type: "text",
              title: "料品名称",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "material_specification",
            title: "料品规格",
            sortable: true
          },
          {
            field: "item_unit",
            title: "单位",
            sortable: true
          },
          {
            field: "barcode",
            title: "条码",
            formatter: function(value, row, index) {
              let img = `<svg id="barCode${index}"></svg>`;
              setTimeout(
                () =>
                  JsBarcode(
                    `#barCode${index}`,
                    value || "Non-existent",
                    barCodeStyle
                  ),
                500
              );
              return img;
            },
            events: {
              "click svg": function(e, value, row, index) {
                $("#material #barcode").modal("show");
              }
            }
          },
          {
            field: "material_category.name",
            title: "料品类别",
            formatter: function(value, row, index) {
              const checkbox = `
                <div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.includes('1') ? 'checked="checked"' : ''} disabled />采购件</label>
                  </div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.includes('2') ? 'checked="checked"' : ''} disabled />自制件</label>
                  </div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.includes('3') ? 'checked="checked"' : ''} disabled />委外件</label>
                  </div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.includes('4') ? 'checked="checked"' : ''} disabled />销售件</label>
                  </div>
                </div>
              `;
              return checkbox;
            },
            events: {
              "change input": function(e, value, row, index) {}
            }
          },
          {
            field: "attributes",
            title: "料品属性",
            formatter: function(value, row, index) {
              const checkbox = `
                <div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.includes('1') ? 'checked="checked"' : ''} disabled />原材料</label>
                  </div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.includes('2') ? 'checked="checked"' : ''} disabled />半成品</label>
                  </div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.includes('3') ? 'checked="checked"' : ''} disabled />成品</label>
                  </div>
                </div>
              `;
              return checkbox;
            },
            events: {
              "change input": function(e, value, row, index) {}
            }
          },
          {
            field: "classification",
            title: "料品分类",
            formatter: function(value) {
              return value ? value.name : "";
            }
          },
          {
            field: "respository.name",
            title: "仓库",
            sortable: true
          },
          {
            field: "length",
            title: "长度",
            sortable: true
          },
          {
            field: "width",
            title: "宽度",
            sortable: true
          },
          {
            field: "height",
            title: "高度",
            sortable: true
          },
          {
            field: "weight",
            title: "重量",
            sortable: true
          },
          {
            field: "purchase_unit",
            title: "采购单位",
            sortable: true
          },
          {
            field: "sales_unit",
            title: "销售单位",
            sortable: true
          },
          {
            field: "bom_unit",
            title: "Bom单位",
            sortable: true
          },
          {
            field: "children",
            title: "关联子料编码",
            sortable: true
          },
          {
            field: "pinyin_code",
            title: "拼音码",
            sortable: true
          },
          {
            field: "material_quality",
            title: "材质",
            sortable: true
          },
          {
            field: "picture_number",
            title: "图档号",
            sortable: true
          },
          {
            field: "manufacturer",
            title: "生产厂家",
            sortable: true
          },
          {
            field: "mold_number",
            title: "模具号",
            sortable: true
          },
          {
            field: "standard_model",
            title: "标准型号",
            sortable: true
          },
          {
            field: "material_level",
            title: "料品等级",
            sortable: true
          },
          {
            field: "brand_name.name",
            title: "品牌",
            sortable: true
          },
          {
            field: "check",
            title: "是否需检",
            formatter: function(value, row, index) {
              return `${value ? "需要" : "不需要"}`;
            }
          },
          {
            field: "min_inventory",
            title: "最小库存量",
            sortable: true
          },
          {
            field: "max_inventory",
            title: "最大库存量",
            sortable: true
          },
          {
            field: "safety_stock",
            title: "安全库存量",
            sortable: true
          },
          {
            field: "stocking_volume",
            title: "备货量",
            sortable: true
          },
          {
            field: "purchase_cycle",
            title: "采购周期",
            sortable: true
          },
          {
            field: "image",
            title: "图片",
            formatter(value) {
              let content = ``;
              for (let e of value)
                content += `<div><a target="_blank" style="white-space: nowrap;" href="${ e }">${ e.split('/').pop() }</a></div>`
              return content;
            }
          },
          {
            field: "project_drawing_number",
            title: "工程图号"
          },
          {
            field: "drawing_working",
            title: "加工图",
            formatter(value) {
              let content = ``;
              for (let e of value)
                content += `<div><a target="_blank" style="white-space: nowrap;" href="${ e }">${ e.split('/').pop() }</a></div>`
              return content;
            }
          },
          {
            field: "drawing_approve",
            title: "承认图",
            formatter(value) {
              let content = ``;
              for (let e of value)
                content += `<div><a target="_blank" style="white-space: nowrap;" href="${ e }">${ e.split('/').pop() }</a></div>`
              return content;
            }
          },
          {
            field: "drawing_2d",
            title: "2D图纸",
            formatter(value) {
              let content = ``;
              for (let e of value)
                content += `<div><a target="_blank" style="white-space: nowrap;" href="${ e }">${ e.split('/').pop() }</a></div>`
              return content;
            }
          },
          {
            field: "drawing_3d",
            title: "3D图纸",
            formatter(value) {
              let content = ``;
              for (let e of value)
                content += `<div><a target="_blank" style="white-space: nowrap;" href="${ e }">${ e.split('/').pop() }</a></div>`
              return content;
            }
          },
          {
            field: "drawing_pdf",
            title: "pdf图纸",
            formatter(value) {
              let content = ``;
              for (let e of value)
                content += `<div><a target="_blank" style="white-space: nowrap;" href="${ e }">${ e.split('/').pop() }</a></div>`
              return content;
            }
          },
          {
            field: "assembly_drawing",
            title: "组装图",
            formatter(value) {
              let content = ``;
              for (let e of value)
                content += `<div><a target="_blank" style="white-space: nowrap;" href="${ e }">${ e.split('/').pop() }</a></div>`
              return content;
            }
          },
          {
            field: "begin_price",
            title: "期初单价",
            sortable: true
          },
          {
            field: "enter_warehouse_price",
            title: "入库单价",
            sortable: true
          },
          {
            field: "out_warehouse_price",
            title: "出库单价",
            sortable: true
          },
          {
            field: "enter_warehouse_amount",
            title: "入库金额",
            sortable: true
          },
          {
            field: "out_warehouse_amount",
            title: "出库金额",
            sortable: true
          },
          {
            field: "enter_warehouse_quantity",
            title: "入库数量",
            sortable: true
          },
          {
            field: "out_warehouse_quantity",
            title: "出库数量",
            sortable: true
          },
          {
            field: "end_period_quantity",
            title: "期末数量",
            sortable: true
          },
          {
            field: "end_period_amount",
            title: "期末金额",
            sortable: true
          },
          {
            field: "revise_quantity",
            title: "调整数量",
            sortable: true
          },
          {
            field: "revise_amount",
            title: "调整金额",
            sortable: true
          },
          {
            field: "tax",
            title: "税额",
            sortable: true
          },
          {
            field: "real_inventory",
            title: "库存可用数量",
            sortable: true
          },
          {
            field: "way_quantity",
            title: "在途数量",
            sortable: true
          },
          {
            field: "take_up",
            title: "占用数量",
            sortable: true
          },
          {
            field: "member",
            title: "创建人",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建日期",
            sortable: true
          },
          {
            field: "audit.check_last_name",
            title: "审核人",
            sortable: true
          },
          {
            field: "audit.check_at",
            title: "审核日期",
            sortable: true
          },
          {
            field: "audit.check_status",
            title: "审核状态",
            formatter: function(value, row, index) {
              return `${value ? "已审核" : "未审核"}`;
            }
          },
          {
            field: "editor.last_name",
            title: "修改人",
            sortable: true
          },
          {
            field: "updated_at",
            title: "修改日期",
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
                that
                  .$get(`respositories/materials/rollover_record/${row.slug}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    console.log(response);
                  })
                  .catch(err => console.error(err));
                $("#material #transfeRecord").modal("show");
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
              "click .del": function(e, value, row, index) {
                that
                  .$get(`respositories/materials/delete/${row.slug}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#material #table"), "id", [row.id]);
                  })
                  .catch(err => console.error(err));
              }
            }
          }
        ],
        data = {
          toolbar: "#material #toolbar",
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
          uniqueId: "id",
          showToggle: true,
          showExport: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          detailView: false,
          columns: columns,
          detailFormatter(index, row, $el) {},
          onEditableSave(field, mrow, oldValue, $el) {
            that
              .$post(`respositories/materials/edit/${mrow.slug}`, {
                name: mrow.name,
                respository: mrow.respository.id
              })
              .then(response => {
                if (response.status != 200) return false;
              })
              .catch(err => console.error(err));
          }
        };
      $("#material #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#material #table"));
    },
    addMaterial() {
      $("#material #addMaterial").modal("show");
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

#material {
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
