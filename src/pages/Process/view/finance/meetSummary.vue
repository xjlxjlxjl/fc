<template>
  <div id="financeMeetSummary">
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>

<script>
export default {
  name: "financeMeetSummary",
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
        .$get("finance/copes/summary", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$store.commit("changeTasks", {
            name: "/Finance/meetSummary",
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
            field: "cope_month",
            title: "应付月份",
            sortable: true
          },
          {
            field: "summary_processing_total",
            title: "加工费总额",
            sortable: true
          },
          {
            field: "summary_paid_amount",
            title: "已付款总金额",
            sortable: true
          },
          {
            field: "summary_owed_amount",
            title: "欠款总金额",
            sortable: true
          }
        ],
        data = {
          toolbar: "#financeMeetSummary #toolbar",
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
      $("#financeMeetSummary #table").bootstrapTable(data);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
#financeMeetSummary {
}
</style>