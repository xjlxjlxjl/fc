<template>
  <div id="product">
    <div id="OQCtoolbar">
      <span class="lead">生产看板</span>
    </div>
    <table id="OQCtable"></table>
  </div>
</template>
<script>
export default {
  name: "product",
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {},
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      return params;
    },
    refreshed() {
      this.refresh($("#OQCtable"));
    }
  },
  mounted() {
    let that = this;
    $("#OQCtable").bootstrapTable({
      toolbar: "#OQCtoolbar",
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
          field: "id",
          title: "优先级排序",
          sortable: true
        },
        {
          field: "id",
          title: "任务开始时间",
          sortable: true
        },
        {
          field: "id",
          title: "预计结束时间",
          sortable: true
        },
        {
          field: "id",
          title: "订单号",
          sortable: true
        },
        {
          field: "id",
          title: "采购单号",
          sortable: true
        },
        {
          field: "id",
          title: "单据类型",
          sortable: true
        },
        {
          field: "id",
          title: "采购日期",
          sortable: true
        },
        {
          field: "id",
          title: "供应商编码",
          sortable: true
        },
        {
          field: "id",
          title: "供应商名称",
          sortable: true
        },
        {
          field: "id",
          title: "发票类型",
          sortable: true
        },
        {
          field: "id",
          title: "金额",
          sortable: true
        },
        {
          field: "id",
          title: "预付金额",
          sortable: true
        },
        {
          field: "id",
          title: "付款条件",
          sortable: true
        },
        {
          field: "id",
          title: "付款方式",
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
      detailFormatter: (index, row, $el) => {},
      onEditableSave: (field, mrow, oldValue, $el) => {}
    });
  },
  created() {}
};
</script>
