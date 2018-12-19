<template>
  <div id="order">
    <div id="toolbar">
      <span class="lead">销售订单</span>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
export default {
  name: "saleOrder",
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
          title: "销售订单号",
          sortable: true
        },
        {
          field: "id",
          title: "客户",
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
          title: "下单日期",
          sortable: true
        },
        {
          field: "id",
          title: "交期",
          sortable: true
        },
        {
          field: "id",
          title: "收货地址",
          sortable: true
        },
        {
          field: "id",
          title: "联系人",
          sortable: true
        },
        {
          field: "id",
          title: "订单状态",
          sortable: true
        },
        {
          field: "id",
          title: "支付状态",
          sortable: true
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
          title: "审核时间",
          sortable: true
        },
        {
          field: "id",
          title: "合同状态",
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
#order {
}
</style>
