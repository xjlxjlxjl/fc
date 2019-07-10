<template>
  <div class="modal fade" id="orderList" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div id="orderbar"></div>
        <table id="order"></table>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="onSubmit">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  name: "orderList",
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`orders/company`, params.data)
        .then(response => {
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => console.error(err));
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        number: params.search || undefined
      };
    },
    init() {
      const
        that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "index",
            title: "序号",
            sortable: true,
            formatter(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qr_code_text",
            title: "二维码",
            formatter(value, row, index) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`saleOrder${row.id}`).innerHTML = string) ), 500);
              return `<div id="saleOrder${row.id}" class="img" style="max-width: 85px;max-height: 85px;margin: auto;"></div>`;
            },
            events: {
              "click .img": function(e, value, row, index) {
              }
            }
          },
          {
            field: "numbering",
            title: "销售订单号",
            sortable: true
          },
          {
            field: "created_at",
            title: "下单日期",
            sortable: true
          },
          {
            field: "delivery_period",
            title: "客户要求交期",
            sortable: true
          },
          {
            field: "clerk_name",
            title: "业务员",
            sortable: true
          },
          {
            field: "total_price",
            title: "订单总金额",
            sortable: true
          },
          {
            field: "consignee",
            title: "收货人",
            sortable: true
          },
          {
            field: "mobile",
            title: "收货人手机",
            sortable: true
          },
          {
            field: "address",
            title: "收货地址",
            sortable: true
          },
          {
            field: "postcode",
            title: "邮政编码",
            sortable: true
          },
          {
            field: "customer_code",
            title: "客户编码",
            sortable: true
          },
          {
            field: "customer_name",
            title: "客户名",
            sortable: true
          },
          {
            field: "contract",
            title: "联系人",
            sortable: true
          },
          {
            field: "contract_mobile",
            title: "手机号",
            sortable: true
          }
        ],
        data = {
          toolbar: "#orderList #orderbar",
          ajax: this.tableAjaxData,
          queryParams: this.tableAjaxParams,
          search: true,
          singleSelect: true,
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
          columns: columns,
          detailFormatter(field, mrow, oldValue, $el) {
            let content = [
              `<table class="table">`,
              `<tr><th>序号</th><th>料品编码</th><th>料品名称</th><th>料品规格</th><th>单位</th><th>数量</th></tr>`
            ];
            mrow.items.forEach((e, k) =>
              content.push(
                `<tr><td>${k + 1}</td><td>${e.material.code}</td><td>${e.material.name}</td><td>${e.material.specification}</td><td>${e.material.unit}</td><td>${e.quantity}</td></tr>`
              )
            );
            content.push(`</table>`);
            return content.join("");
          }
        };
      $("#orderList #order").bootstrapTable(data);
    },
    onSubmit() {
      this.$emit('add', this.getData($("#orderList #order")).pop());
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less">
#orderList {

}
</style>
