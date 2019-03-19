<template>
  <div id="financePayableDetail">
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>

<script>
export default {
  name: "financePayableDetail",
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("finance/copes", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$store.commit("changeTasks", {
            name: "/Finance/payableDetail",
            num: response.data.pagination.total
          });
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      return params;
    },
    init() {
      let that = this,
        columns = [
          {
            field: "created_at",
            title: "创建时间",
            sortable: true
          },
          {
            field: "name",
            title: "公司名称",
            sortable: true
          },
          {
            field: "inbound_order_number",
            title: "入库单号",
            sortable: true
          },
          {
            field: "inbound_at",
            title: "入库日期",
            sortable: true
          },
          {
            field: "material_code",
            title: "料品编码",
            sortable: true
          },
          {
            field: "material_name",
            title: "料品名称",
            sortable: true
          },
          {
            field: "material_specification",
            title: "料品规格",
            sortable: true
          },
          {
            field: "unit",
            title: "单位",
            sortable: true
          },
          {
            field: "warehousing_number",
            title: "入库数量",
            sortable: true
          },
          {
            field: "unit_price",
            title: "单价",
            sortable: true
          },
          {
            field: "processing_total",
            title: "加工费",
            sortable: true
          },
          {
            field: "work_number",
            title: "工单号",
            sortable: true
          },
          {
            field: "paid_amount",
            title: "已付款金额",
            sortable: true
          },
          {
            field: "owed_amount",
            title: "欠款金额",
            sortable: true
          },
          {
            field: "payment_at",
            title: "付款时间",
            sortable: true
          },
          {
            field: "cope_month",
            title: "应付月份",
            sortable: true
          },
          {
            field: "payable_at",
            title: "应付款时间",
            sortable: true
          },
          {
            field: "is_overdue",
            title: "是否逾期",
            sortable: true,
            formatter: function(value, row, index) {
              return value ? "已逾期" : "未逾期";
            }
          },
          {
            field: "purchase_type",
            title: "采购类型",
            sortable: true
          }
        ],
        data = {
          toolbar: "#financePayableDetail #toolbar",
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
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          detailView: false,
          columns: columns,
          detailFormatter: (index, row, $el) => {},
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };
      $("#financePayableDetail #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#financePayableDetail #table"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
#financePayableDetail {
}
</style>