<template>
  <div id="history">
    <div id="OQCtoolbar">
      <span class="lead">历史出货报告</span>
    </div>
    <table id="OQCtable"></table>
  </div>
</template>
<script>
export default {
  name: "history",
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {},
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
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
          field: "work_no",
          title: "任务编号",
          sortable: true
        },
        {
          field: "#",
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
