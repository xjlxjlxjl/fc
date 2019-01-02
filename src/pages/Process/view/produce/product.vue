<template>
  <div id="product">
    <div id="produceToolbar">
      <span class="lead">生产看板</span>
    </div>
    <table id="produceTable"></table>
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
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      return params;
    }
  },
  mounted() {
    let that = this;
    $("#produceTable").bootstrapTable({
      toolbar: "#produceToolbar",
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
          title: "指定物料车",
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
          title: "唯一识别码",
          sortable: true
        },
        {
          field: "id",
          title: "转仓单号",
          sortable: true
        },
        {
          field: "id",
          title: "转仓日期",
          sortable: true
        },
        {
          field: "id",
          title: "部门",
          sortable: true
        },
        {
          field: "id",
          title: "经手人",
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
          title: "组装人员",
          sortable: true
        },
        {
          field: "id",
          title: "工时",
          sortable: true
        },
        {
          field: "id",
          title: "Bom",
          sortable: true
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
#product {
}
</style>
