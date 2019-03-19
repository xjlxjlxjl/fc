<template>
  <div id="financeIncomeDetail">
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>

<script>
export default {
  name: "financeIncomeDetail",
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
        .$get("finance/receivables", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$store.commit("changeTasks", {
            name: "/Finance/incomeDetail",
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
            field: "shipment_number",
            title: "出货单号",
            sortable: true
          },
          {
            field: "shipment_at",
            title: "出货日期",
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
            field: "shipment_quantity",
            title: "出库数量",
            sortable: true
          },
          {
            field: "unit_price",
            title: "单价",
            sortable: true
          },
          {
            field: "total_price",
            title: "总价",
            sortable: true
          },
          {
            field: "payback_amount",
            title: "回款金额",
            sortable: true
          },
          {
            field: "owed_amount",
            title: "欠款金额",
            sortable: true
          },
          {
            field: "payback_date",
            title: "回款日期",
            sortable: true
          },
          {
            field: "business",
            title: "商户",
            sortable: true
          },
          {
            field: "is_invoice",
            title: "是否开票",
            sortable: true,
            formatter: function(value, row, index) {
              return value ? "已开票" : "未开票";
            }
          },
          {
            field: "payback_month",
            title: "应回款月份",
            sortable: true
          },
          {
            field: "payback_at",
            title: "应回款时间",
            sortable: true
          },
          {
            field: "payment_method",
            title: "支付方式",
            sortable: true
          },
          {
            field: "is_overdue",
            title: "是否逾期",
            sortable: true,
            formatter: function(value, row, index) {
              return value ? "已逾期" : "未逾期";
            }
          }
        ],
        data = {
          toolbar: "#financeIncomeDetail #toolbar",
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
      $("#financeIncomeDetail #table").bootstrapTable(data);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
#financeIncomeDetail {
}
</style>