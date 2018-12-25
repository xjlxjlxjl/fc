<template>
  <div id="order">
    <addOrderModal @refresh="refreshed"></addOrderModal>
    <div id="toolbar">
      <span class="lead">销售订单</span>
      <el-button size="mini" @click="addOrder">新建销售订单</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addOrderModal from "@/pages/Process/common/addOrderModal";
export default {
  name: "saleOrder",
  data() {
    return {};
  },
  components: {
    addOrderModal: addOrderModal
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`orders/company`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      return params;
    },
    addOrder() {
      addOrderModal.methods.close.call(this);
    },
    refreshed() {
      this.refresh($("#table"));
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
          field: "numbering",
          title: "销售订单号",
          sortable: true
        },
        {
          field: "company_name",
          title: "客户",
          sortable: true
        },
        {
          field: "total_price",
          title: "订单金额",
          sortable: true
        },
        {
          field: "created_at",
          title: "下单日期",
          sortable: true
        },
        {
          field: "products",
          title: "交期",
          sortable: true,
          formatter: (value, row, index) => {
            let date = 0;
            value.forEach(e => (date += parseInt(e.delivery_period || 0)));
            return `${date}天`;
          }
        },
        {
          field: "address",
          title: "收货地址",
          sortable: true
        },
        {
          field: "consignee",
          title: "联系人",
          sortable: true
        },
        {
          field: "status",
          title: "订单状态",
          sortable: true,
          formatter: (value, row, index) => {
            return `${value ? "已关闭" : "未关闭"}`;
          }
        },
        {
          field: "pay_status",
          title: "支付状态",
          sortable: true,
          formatter: (value, row, index) => {
            return `${value ? "已支付" : "未支付"}`;
          }
        },
        {
          field: "pay_method",
          title: "支付方式",
          sortable: true,
          formatter: (value, row, index) => {
            let text = "";
            switch (value) {
              case 0:
              case "0":
                return "线下支付";
                break;
              case 1:
              case "1":
                return "支付宝支付";
                break;
              case 2:
              case "2":
                return "银联支付";
                break;
            }
          }
        },
        {
          field: "order_status",
          title: "合同状态",
          sortable: true
        },
        {
          field: "check_status_name",
          title: "审核状态",
          sortable: true,
          formatter: (value, row, index) => {
            return `${value || "待审核"}`;
          }
        },
        {
          field: "check_man_name",
          title: "审核人",
          sortable: true,
          formatter: (value, row, index) => {
            return `${value || "暂无"}`;
          }
        },
        {
          field: "check_at",
          title: "审核时间",
          sortable: true,
          formatter: (value, row, index) => {
            return `${value || "暂无"}`;
          }
        }
      ],
      onEditableSave(field, mrow, oldValue, $el) {},
      detailFormatter(field, mrow, oldValue, $el) {
        let content = [
          `<table class="table">`,
          `<tr><th>商品名</th><th>商品图片</th><th>发票类型</th><th>数量</th><th>单价</th><th>合计</th></tr>`
        ];
        mrow.products.forEach(e =>
          content.push(
            `<tr>
              <td>
                <p>${e.product_name}</p>
                <p style="margin-bottom: 0;">${e.product_model}</p>
              </td>
              <td>
                <img src="${e.product_image}" width="50px" height="50px">
              </td>
              <td>${e.invoice_type_name || "暂无"}</td>
              <td>${e.quantity}</td>
              <td>${e.purchase_price}</td>
              <td>${parseInt(e.quantity) *
                parseFloat(e.purchase_price)}</td></tr>`
          )
        );
        content.push(`</table>`);
        return content.join("");
      }
    });
  }
};
</script>
<style lang="less">
#order {
}
</style>
