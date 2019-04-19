<template>
  <div id="clock">
    <div id="toolbar">
    </div>
    <table id="table"></table>
  </div>
</template>

<script>
export default {
  name: "clock",
  data() {
    return {};
  },
  methods: {
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter: function(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "customer_conpany_name",
            title: "客服公司名",
            sortable: true
          },
          {
            field: "customer_name",
            title: "客服申请单号",
            sortable: true
          },
          {
            field: "customer_linkman",
            title: "打卡人",
            sortable: true
          },
          {
            field: "customer_mobile",
            title: "打卡时间",
            sortable: true
          },
          {
            field: "specification",
            title: "打卡地址",
            sortable: true
          }
        ],
        data = {
          toolbar: "#report #toolbar",
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
          idField: "id",
          showToggle: true,
          showExport: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageList: [10, 25, 50, 100, "All"],
          columns: columns
        };
      $("#clock #table").bootstrapTable(data);
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less">
#clock {
}
</style>
