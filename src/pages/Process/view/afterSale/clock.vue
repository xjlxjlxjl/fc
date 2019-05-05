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
    tableAjaxData(params) {
      this
        .$get(`service/signin/records`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          let arr = [];
          response.data.list.forEach(e => 
            e.siginins.forEach(v => arr.push({
              customer_company_name: e.customer_company_name,
              service_number: e.service_number,
              last_name: v.created_member.last_name,
              created_at: v.created_at,
              address: v.address
            }))
          )
          params.success({
            rows: arr,
            total: response.data.pagination.total
          });
        })
        .catch(err => console.error(err));
    },
    tableAjaxParams(params) {
      return params;
    },
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
            field: "customer_company_name",
            title: "客服公司名",
            sortable: true
          },
          {
            field: "service_number",
            title: "客服申请单号",
            sortable: true
          },
          {
            field: "last_name",
            title: "打卡人",
            sortable: true
          },
          {
            field: "created_at",
            title: "打卡时间",
            sortable: true
          },
          {
            field: "address",
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
