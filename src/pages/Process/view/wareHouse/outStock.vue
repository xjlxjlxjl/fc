<template>
  <div id="outStock">
    <div id="wareHouseToolbar">
      <span class="lead">出库申请表</span>
    </div>
    <table id="wareHouseTable"></table>
  </div>
</template>
<script>
export default {
  name: "wareOutStock",
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
          title: "领料类型",
          sortable: true
        },
        {
          field: "id",
          title: "单号",
          sortable: true
        },
        {
          field: "id",
          title: "申请人",
          sortable: true
        },
        {
          field: "id",
          title: "申请日期",
          sortable: true
        },
        {
          field: "id",
          title: "审核状态",
          sortable: true
        },
        {
          field: "id",
          title: "领料状态",
          sortable: true
        },
        {
          field: "id",
          title: "客服单号",
          sortable: true
        },
        {
          field: "id",
          title: "客户公司名",
          sortable: true
        },
        {
          field: "id",
          title: "领料明细",
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
#outStock {
}
</style>