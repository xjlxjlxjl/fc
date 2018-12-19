<template>
  <div id="shipment">
    <div id="wareHouseToolbar">
      <span class="lead">出货申请表</span>
    </div>
    <table id="wareHouseTable"></table>
  </div>
</template>
<script>
export default {
  name: "wareShipment",
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
      // detailView: true,
      columns: [
        {
          checkbox: true
        },
        {
          field: "id",
          title: "销售订单",
          sortable: true
        },
        {
          field: "id",
          title: "料品编码",
          sortable: true
        },
        {
          field: "id",
          title: "料品名称",
          sortable: true
        },
        {
          field: "id",
          title: "唯一识别码",
          sortable: true
        },
        {
          field: "id",
          title: "出库数量",
          sortable: true
        },
        {
          field: "id",
          title: "出库申请人",
          sortable: true
        },
        {
          field: "id",
          title: "申请时间",
          sortable: true
        },
        {
          field: "id",
          title: "打包方式",
          sortable: true
        },
        {
          field: "id",
          title: "配送方式",
          sortable: true
        },
        {
          field: "id",
          title: "客户",
          sortable: true
        },
        {
          field: "id",
          title: "发货地址",
          sortable: true
        },
        {
          field: "id",
          title: "收货人",
          sortable: true
        },
        {
          field: "id",
          title: "联系电话",
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
          title: "审核状态",
          sortable: true
        },
        {
          field: "id",
          title: "审核人",
          sortable: true
        },
        {
          field: "id",
          title: "操作",
          formatter: (value, row, index) => {},
          events: {}
        }
      ],
      // detailFormatter(field, mrow, oldValue, $el) {},
      onEditableSave(field, mrow, oldValue, $el) {}
    });
  }
};
</script>
<style>
#shipment {
}
</style>