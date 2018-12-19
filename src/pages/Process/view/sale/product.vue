<template>
  <div id="product">
    <div id="toolbar">
      <span class="lead">生产看板</span>
    </div>
    <table id="table"></table>
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
          title: "优先级排序",
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
          title: "订单时间",
          sortable: true
        },
        {
          field: "id",
          title: "预计出货时间",
          sortable: true
        },
        {
          field: "id",
          title: "客户代码",
          sortable: true
        },
        {
          field: "id",
          title: "产品型号",
          sortable: true
        },
        {
          field: "id",
          title: "客户回签承认图",
          sortable: true
        },
        {
          field: "id",
          title: "客户交期",
          sortable: true
        },
        {
          field: "id",
          title: "业务员",
          sortable: true
        },
        {
          field: "id",
          title: "业务备注",
          sortable: true
        },
        {
          field: "id",
          title: "发票类型",
          sortable: true
        },
        {
          field: "id",
          title: "订单金额",
          sortable: true
        },
        {
          field: "id",
          title: "预收金额",
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
#product {
}
</style>
