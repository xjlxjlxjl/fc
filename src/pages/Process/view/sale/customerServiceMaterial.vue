<template>
  <div id="customerServiceMaterial">
    <div id="toolbar">
      <span class="lead">客服领取料申请表</span>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
export default {
  name: "customerServiceMaterial",
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {},
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      return params;
    }
  },
  mounted() {
    let that = this;
    $("#table").bootstrapTable({
      toolbar: "#toolbar",
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
          title: "客服领料单号",
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
      onEditableSave(field, mrow, oldValue, $el) {},
      detailFormatter(field, mrow, oldValue, $el) {}
    });
  }
};
</script>
<style lang="less">
#customerServiceMaterial {
}
</style>
