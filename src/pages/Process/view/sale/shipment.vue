<template>
  <div id="shipment">
    <addShipment @refresh="refreshed"></addShipment>
    <div id="toolbar">
      <span class="lead">出货申请单</span>
      <el-button size="mini" @click="addSale">创建出货单</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addShipment from "@/pages/Process/common/addShipment";

export default {
  name: "shipment",
  data() {
    return {};
  },
  components: {
    addShipment: addShipment
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`ship_orders`, params.data)
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
    addSale() {
      addShipment.methods.close.call(this);
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
          field: "created_user",
          title: "出库申请人",
          formatter: value => {
            return `${value.display_name}`;
          }
        },
        {
          field: "ship_order_no",
          title: "发货单号",
          sortable: true
        },
        {
          field: "customer_name",
          title: "客户名称",
          sortable: true,
          editable: {
            type: "text",
            title: "客户名称",
            emptytext: "空"
          }
        },
        {
          field: "total_amount",
          title: "总金额",
          sortable: true,
          editable: {
            type: "text",
            title: "总金额",
            emptytext: "空"
          }
        },
        {
          field: "ship_date",
          title: "发货日期",
          sortable: true,
          editable: {
            type: "text",
            title: "发货日期",
            emptytext: "空"
          }
        },
        {
          field: "salesman",
          title: "销售人员",
          sortable: true,
          editable: {
            type: "text",
            title: "销售人员",
            emptytext: "空"
          }
        },
        {
          field: "ship_address",
          title: "发货地址",
          sortable: true,
          editable: {
            type: "text",
            title: "发货地址",
            emptytext: "空"
          }
        },
        {
          field: "consignee",
          title: "客户联系人",
          sortable: true,
          editable: {
            type: "text",
            title: "客户联系人",
            emptytext: "空"
          }
        },
        {
          field: "mobile",
          title: "客户手机",
          sortable: true,
          editable: {
            type: "text",
            title: "客户手机",
            emptytext: "空"
          }
        },
        {
          field: "phone",
          title: "客户电话",
          sortable: true,
          editable: {
            type: "text",
            title: "客户电话",
            emptytext: "空"
          }
        },
        {
          field: "address",
          title: "客户地址",
          sortable: true,
          editable: {
            type: "text",
            title: "客户地址",
            emptytext: "空"
          }
        },
        {
          field: "ship_method",
          title: "发货方式",
          sortable: true,
          editable: {
            type: "text",
            title: "发货方式",
            emptytext: "空"
          }
        },
        {
          field: "receipt_amount",
          title: "收款金额",
          sortable: true,
          editable: {
            type: "text",
            title: "收款金额",
            emptytext: "空"
          }
        },
        {
          field: "receipt_address",
          title: "收件人地址",
          sortable: true,
          editable: {
            type: "text",
            title: "收件人地址",
            emptytext: "空"
          }
        },
        {
          field: "receipt_name",
          title: "收件人名称",
          sortable: true,
          editable: {
            type: "text",
            title: "收件人名称",
            emptytext: "空"
          }
        },
        {
          field: "receipt_mobile",
          title: "收件人手机",
          sortable: true,
          editable: {
            type: "text",
            title: "收件人手机",
            emptytext: "空"
          }
        },
        {
          field: "remark",
          title: "备注",
          sortable: true,
          editable: {
            type: "text",
            title: "备注",
            emptytext: "空"
          }
        }
      ],
      onEditableSave(field, mrow, oldValue, $el) {
        that
          .$post(`ship_order/edit/${mrow.slug}`, mrow)
          .then(response => {
            if (response.status != 200) return false;
          })
          .catch(err => {});
      },
      detailFormatter(field, mrow, oldValue, $el) {
        let content = [
          `<table class="table">`,
          `<tr><th>序号</th><th>订单号</th><th>料品编码</th><th>品名/规格</th><th>单位</th><th>数量</th><th>客户货号</th><th>客户订单号</th><th>备注</th></tr>`
        ];
        mrow.items.forEach(e =>
          content.push(
            `
          <tr><td>${e.order_id}</td><td>${e.order_no}</td><td>${
              e.item_code
            }</td><td>${e.item_name}</td><td>${e.item_unit}</td><td>${
              e.item_num
            }</td><td>${e.customer_goods_no}</td><td>${
              e.customer_order_no
            }</td><td>${e.remark}</td></tr>
          `
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
#shipment {
}
</style>
