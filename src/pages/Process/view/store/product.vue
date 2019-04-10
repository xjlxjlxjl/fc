<template>
  <div id="product">
    <div id="wareHouseToolbar">
      <span class="lead">生产看板</span>
    </div>
    <table id="wareHouseTable"></table>
  </div>
</template>
<script>
export default {
  name: "wareProduct",
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
          title: "出货单号",
          sortable: true
        },
        {
          field: "id",
          title: "出货日期",
          sortable: true
        },
        {
          field: "id",
          title: "客户代码",
          sortable: true
        },
        {
          field: "id",
          title: "客户名称",
          sortable: true
        },
        {
          field: "id",
          title: "总金额",
          sortable: true
        },
        {
          field: "id",
          title: "经办人",
          sortable: true
        },
        {
          field: "id",
          title: "联系人",
          sortable: true
        },
        {
          field: "id",
          title: "电话",
          sortable: true
        },
        {
          field: "id",
          title: "手机号",
          sortable: true
        },
        {
          field: "id",
          title: "物流/快递名",
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
      // detailFormatter(field, mrow, oldValue, $el) {},
      onEditableSave(field, mrow, oldValue, $el) {}
    });
  }
};
</script>
<style>
#product {
}
</style>