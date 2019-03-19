<template>
  <div id="financeMeetDebt">
    <div id="toolbar"></div>
    <table id="table"></table>

    <div id="dateBar"></div>
    <table id="dateTable"></table>
  </div>
</template>

<script>
export default {
  name: "financeMeetDebt",
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
        .$get("finance/copes/data", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          // "/Finance/meetDebt"
          params.success({ total: 0, rows: [] });
          $("#financeMeetDebt #table").bootstrapTable('load', response.data.company);
          $("#financeMeetDebt #dateTable").bootstrapTable('load', response.data.date);
        })
        .catch(err => loading.close());
    },
    init() {
      let that = this,
        columns = [
          {
            field: "name",
            title: "公司名称",
            sortable: true
          },
          {
            field: "total_owed_amount",
            title: "总欠款",
            sortable: true
          }
        ],
        data = {
          toolbar: "#financeMeetDebt #toolbar",
          ajax: this.tableAjaxData,
          // queryParams: this.tableAjaxParams,
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
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: columns,
          detailFormatter: (index, row, $el) => {
            let html = [`<table class="table table-bordered">`]
            html.push(`<tr><th>公司名称</th><th>欠款金额</th><th>欠款日期</th><th>欠款月份</th></tr>`)
            for (let item of row.month) html.push(`<tr><td>${item.name}</td><td>${item.owed_amount}</td><td>${item.payable_at || ''}</td><td>${item.cope_month || '无'}</td></tr>`);
            html.push(`</table>`);
            return html.join('');
          },
          onEditableSave: (field, mrow, oldValue, $el) => {}
        },
        dateColumns = [
          {
            field: "month",
            title: "欠款月份",
            sortable: true
          },
          {
            field: "total_owed_amount",
            title: "总欠款",
            sortable: true
          }
        ],
        dateData = {
          toolbar: "#financeMeetDebt #dateBar",
          ajax: this.tableAjaxData,
          // queryParams: this.tableAjaxParams,
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
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: dateColumns,
          detailFormatter: (index, row, $el) => {
            let html = [`<table class="table table-bordered">`]
            html.push(`<tr><th>公司名称</th><th>欠款金额</th><th>欠款日期</th><th>欠款月份</th></tr>`)
            for (let item of row.company) html.push(`<tr><td>${item.name}</td><td>${item.owed_amount}</td><td>${item.payable_at}</td><td>${item.cope_month || '无'}</td></tr>`);
            html.push(`</table>`);
            return html.join('');
          },
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };

      $("#financeMeetDebt #table").bootstrapTable(data);
      $("#financeMeetDebt #dateTable").bootstrapTable(dateData);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
#financeMeetDebt {
}
</style>