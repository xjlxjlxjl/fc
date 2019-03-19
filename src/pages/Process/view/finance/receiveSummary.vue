<template>
  <div id="financeReceiveSummary">
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>

<script>
export default {
  name: "financeReceiveSummary",
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
        .$get("finance/receivables/summary", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$store.commit("changeTasks", {
            name: "/Finance/receiveSummary",
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
            field: "payback_month",
            title: "回款月份",
            sortable: true
					},
					{
            field: "summary_total_price",
            title: "总价",
            sortable: true
					},
					{
            field: "summary_payback_amount",
            title: "回款总金额",
            sortable: true
					},
					{
            field: "summary_owed_amount",
            title: "欠款总金额",
            sortable: true
          },
        ],
        data = {
          toolbar: "#financeReceiveSummary #toolbar",
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
      $("#financeReceiveSummary #table").bootstrapTable(data);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
#financeReceiveSummary {
}
</style>