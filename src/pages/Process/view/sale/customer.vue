<template>
  <div id="customer">
    <div id="toolbar">
      <span class="lead">客户管理</span>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
export default {
  name: "customer",
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
          title: "客户编码",
          sortable: true
        },
        {
          field: "id",
          title: "客户公司名",
          sortable: true
        },
        {
          field: "id",
          title: "客户简称",
          sortable: true
        },
        {
          field: "id",
          title: "联系人",
          sortable: true
        },
        {
          field: "id",
          title: "业务员",
          sortable: true
        },
        {
          field: "id",
          title: "区域",
          sortable: true
        },
        {
          field: "id",
          title: "地址",
          sortable: true
        },
        {
          field: "id",
          title: "电话",
          sortable: true
        },
        {
          field: "id",
          title: "电子邮件",
          sortable: true
        },
        {
          field: "id",
          title: "新建日期",
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
#customer {
}
</style>
