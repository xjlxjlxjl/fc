<template>
  <div id="financeReceiveDebt">
    <div id="toolbar"></div>
    <table id="table"></table>

    <div id="companyBar"></div>
    <table id="companyTable"></table>
  </div>
</template>

<script>
export default {
  name: "financeReceiveDebt",
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
        .$get("finance/receivables/data", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          // "/Finance/receiveDebt"
          params.success({ total: 0, rows: [] });
          $("#financeReceiveDebt #table").bootstrapTable('load', response.data.date);
          that.getData(response.data.company);
        })
        .catch(err => loading.close());
    },
    getData(data) {
      $("#financeReceiveDebt #companyTable").bootstrapTable('load', data);
    },
    init() {
      let that = this,
        columns = [
					{
            field: "month",
            title: "欠款月份",
            sortable: true
					},
					{
            field: "total_owed_amount",
            title: "欠款总金额",
            sortable: true
          },
        ],
        data = {
          toolbar: "#financeReceiveDebt #toolbar",
          ajax: this.tableAjaxData,
          search: false,
          strictSearch: false,
          showRefresh: true,
          sidePagination: "server",
          pagination: false,
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
          pageSize: 'All',
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: columns,
          detailFormatter: (index, row, $el) => {
            let html = [`<table class="table table-bordered">`]
            html.push(`<tr><th>公司名称</th><th>欠款金额</th><th>回款日期</th><th>回款月份</th></tr>`)
            for (let item of row.company) html.push(`<tr><td>${item.name}</td><td>${item.owed_amount}</td><td>${item.payback_at}</td><td>${item.payback_month || ''}</td></tr>`);
            html.push(`</table>`);
            return html.join('');
          },
          onEditableSave: (field, mrow, oldValue, $el) => {}
        },
        companyColumns = [
          {
            field: "name",
            title: "公司名称",
            sortable: true
					},
					{
            field: "total_owed_amount",
            title: "欠款总额",
            sortable: true
					}
        ],
        conpanyData = {
          toolbar: "#financeReceiveDebt #companyBar",
          // ajax: this.tableAjaxData,
          search: false,
          strictSearch: false,
          showRefresh: false,
          sidePagination: "server",
          pagination: false,
          striped: false,
          clickToSelect: false,
          showColumns: false,
          sortName: "createTime",
          sortOrder: "desc",
          idField: "id",
          showToggle: false,
          showExport: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageSize: 'All',
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: companyColumns,
          detailFormatter: (index, row, $el) => {
            let html = [`<table class="table table-bordered">`]
            html.push(`<tr><th>公司名称</th><th>欠款金额</th><th>回款日期</th><th>回款月份</th></tr>`)
            for (let item of row.month) html.push(`<tr><td>${item.name}</td><td>${item.owed_amount}</td><td>${item.payback_at}</td><td>${item.payback_month || ''}</td></tr>`);
            html.push(`</table>`);
            return html.join('');
          },
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };
      $("#financeReceiveDebt #table").bootstrapTable(data);
      $("#financeReceiveDebt #companyTable").bootstrapTable(conpanyData);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
#financeReceiveDebt {
}
</style>