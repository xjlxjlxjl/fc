<template>
  <div id="material">
    <div id="wareHouseToolbar">
      <span class="lead">原材料库存</span>
    </div>
    <table id="wareHouseTable"></table>
  </div>
</template>
<script>
export default {
  name: "material",
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {},
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      return params;
    }
  },
  mounted() {
    let that = this;
    $("#wareHouseTable").bootstrapTable({
      toolbar: "#wareHouseToolbar",
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
      detailView: true,
      columns: [
        {
          checkbox: true
        },
        {
          field: "name",
          title: "料品名称",
          sortable: true
        },
        {
          field: "material_number",
          title: "料品编号",
          sortable: true
        },
        {
          field: "material_specification",
          title: "料品规格",
          sortable: true
        },
        {
          field: "material_category",
          title: "料品类别（关系）",
          sortable: true
        },
        {
          field: "respository",
          title: "仓库（关系）",
          sortable: true
        },
        {
          field: "project_drawing_number",
          title: "工程图号",
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
          field: "width",
          title: "宽度",
          sortable: true
        },
        {
          field: "length",
          title: "长度",
          sortable: true
        },
        {
          field: "item_unit",
          title: "料品单位",
          sortable: true
        },
        {
          field: "attributes",
          title: "料品属性",
          sortable: true
        },
        {
          field: "print",
          title: "是否打印",
          sortable: true
        },
        {
          field: "picture_number",
          title: "图档号",
          sortable: true
        },
        {
          field: "check",
          title: "是否需要质检",
          sortable: true
        },
        {
          field: "project_drawing_number",
          title: "工程图号",
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
          field: "material_quality",
          title: "材质",
          sortable: true
        },
        {
          field: "pinyin_code",
          title: "拼音码",
          sortable: true
        },
        {
          field: "drawing_2d",
          title: "2D图纸（关系）",
          sortable: true
        },
        {
          field: "drawing_3d",
          title: "3D图纸（关系）",
          sortable: true
        },
        {
          field: "drawing_pdf",
          title: "pdf图纸（关系）",
          sortable: true
        },
        {
          field: "drawing_working",
          title: "加工图纸（关系）",
          sortable: true
        },
        {
          field: "drawing_approve",
          title: "承认图纸（关系）",
          sortable: true
        },
        {
          field: "project_picture",
          title: "工程图片",
          sortable: true
        },
        {
          field: "total_weight",
          title: "总重",
          sortable: true
        },
        {
          field: "dimension",
          title: "维度",
          sortable: true
        },
        {
          field: "barcode",
          title: "条码",
          sortable: true
        },
        {
          field: "assistant_code",
          title: "助记码",
          sortable: true
        },
        {
          field: "image",
          title: "图片（关系）",
          sortable: true
        },
        {
          field: "abc_category",
          title: "ABC分类",
          sortable: true
        },
        {
          field: "manufacturer",
          title: "生产厂家",
          sortable: true
        },
        {
          field: "brand_name",
          title: "品牌",
          sortable: true
        },
        {
          field: "begin_price",
          title: "期初单价",
          sortable: true
        },
        {
          field: "begin_amount_money",
          title: "期初金额",
          sortable: true
        },
        {
          field: "enter_warehouse_price",
          title: "入库单价",
          sortable: true
        },
        {
          field: "enter_warehouse_amount",
          title: "入库金额",
          sortable: true
        },
        {
          field: "out_warehouse_price",
          title: "出库单价",
          sortable: true
        },
        {
          field: "out_warehouse_amount",
          title: "出库金额",
          sortable: true
        },
        {
          field: "revise_amount",
          title: "调整金额",
          sortable: true
        },
        {
          field: "end_period_amount",
          title: "期末金额",
          sortable: true
        },
        {
          field: "standard_single_price",
          title: "标准单价",
          sortable: true
        },
        {
          field: "standard_cost_price",
          title: "标准进价",
          sortable: true
        },
        {
          field: "standard_uniform_price",
          title: "标准售价",
          sortable: true
        },
        {
          field: "minimum_purchase_quantity",
          title: "最小采购量",
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
          field: "revise_quantity",
          title: "调整数量",
          sortable: true
        },
        {
          field: "end_period_quantity",
          title: "期末数量",
          sortable: true
        },
        {
          field: "await_stored_quantity",
          title: "待入库数量",
          sortable: true
        },
        {
          field: "await_delivered_quantity",
          title: "待出库数量",
          sortable: true
        },
        {
          field: "await_revise_quantity",
          title: "待调整数量",
          sortable: true
        },
        {
          field: "expected_inventory_quantity",
          title: "预计结存数量",
          sortable: true
        },
        {
          field: "take_up",
          title: "占用",
          sortable: true
        },
        {
          field: "max_inventory",
          title: "最大库存",
          sortable: true
        },
        {
          field: "min_inventory",
          title: "最小库存",
          sortable: true
        },
        {
          field: "real_inventory",
          title: "实际库存",
          sortable: true
        },
        {
          field: "id",
          title: "备注",
          sortable: true,
          editable: {
            type: "textarea",
            title: "备注",
            emptytext: "空"
          }
        },
        {
          field: "id",
          title: "操作",
          formatter: (value, row, index) => {},
          events: {}
        }
      ],
      onEditableSave(field, mrow, oldValue, $el) {},
      detailFormatter(field, mrow, oldValue, $el) {}
    });
  }
};
</script>
<style lang="less">
#material {
}
</style>
