<template>
  <div id="offer">
    <div id="toolbar">
      <span class="lead">报价单</span>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
export default {
  name: "saleOffer",
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`service/quoted_price`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => console.error(err));
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      return params;
    },
    init() {
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
            field: "quoted_price_number",
            title: "报价单号",
            sortable: true
          },
          {
            field: "order_number",
            title: "订单号",
            sortable: true
          },
          {
            field: "customer_company_name",
            title: "客户公司名",
            sortable: true
          },
          {
            field: "linkman",
            title: "联系人",
            sortable: true
          },
          {
            field: "id",
            title: "业务员",
            sortable: true
          },
          {
            field: "price",
            title: "报价",
            sortable: true
          },
          {
            field: "member_name",
            title: "报价人",
            sortable: true
          },
          {
            field: "create_at",
            title: "报价日期",
            sortable: true
          },
          {
            field: "validity_date",
            title: "报价有效期至",
            sortable: true
          }
          // {
          //   field: "id",
          //   title: "操作",
          //   formatter: (value, row, index) => {},
          //   events: {}
          // }
        ],
        onEditableSave(field, mrow, oldValue, $el) {},
        detailFormatter(field, mrow, oldValue, $el) {
          let content = [];
          content.push(`<table class="table table-bordered">`);
          content.push(
            `<tr><th>料品编号</th><th>产品</th><th>规格</th><th>单位</th><th>数量</th><th>价格</th></tr>`
          );
          mrow.detail.forEach(e =>
            content.push(
              `<tr>
                <td>${e.code || e.Code}</td>
                <td>${e.name}</td>
                <td>${e.info}</td>
                <td>${e.unit}</td>
                <td>${e.number}</td>
                <td>${e.price}</td>
              </tr>`
            )
          );
          content.push(`</table>`);
          return content.join("");
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#offer {
}
</style>
