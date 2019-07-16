<template>
  <div id="return">
    <div id="toolbar">
      <el-button size="mini" @click="addSale">创建出货单</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";

export default {
  name: "return",
  data() {
    return {
    };
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`orders/sales/return`, params.data)
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
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        number: params.search || undefined
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qr_code_text",
            title: "二维码",
            formatter(value, row, index) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`salereturn${row.id}`).innerHTML = string)), 500);
              return `<div id="salereturn${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            }
          },
          {
            field: "number",
            title: "退货申请单号"
          },
          {
            field: "created_by",
            title: "申请人"
          },
          {
            field: "created_at",
            title: "申请日期"
          },
          {
            field: "shipment.number",
            title: "出货申请单号"
          },
          {
            field: "order.number",
            title: "关联销售单号"
          },
          {
            field: "consignee",
            title: "客户公司名"
          },
          {
            field: "consignee",
            title: "客户联系人"
          },
          {
            field: "mobile",
            title: "收货人手机"
          },
          {
            field: "address",
            title: "退货地址"
          },
          {
            field: "postcode",
            title: "邮政编码"
          },
          {
            field: "delivery_method",
            title: "退货方式"
          },
          {
            field: "packing_method",
            title: "包装方式"
          },
          {
            field: "delivery_method",
            title: "快递/物流运费"
          },
          {
            field: "packing_method",
            title: "备注"
          },
          {
            field: "check.man",
            title: "审核人"
          },
          {
            field: "check.datetime",
            title: "审核日期"
          },
          {
            field: "check.status",
            title: "审核状态",
            formatter(value) {
              return value ? `审核成功` : `未审核`;
            }
          },
          {
            field: "id",
            title: "操作",
            formatter(value, row, index) {
              let edit = `<button class="btn btn-success btn-sm edit">编辑</button>`,
                del = `<button class="btn btn-danger btn-sm del">删除</button>`;
              return edit + del;
            },
            events: {
              "click .edit"(e, value, row, index) {
                that.return = row;
                that.addSale();
              },
              "click .del"(e, value, row, index) {
                if (confirm("确定删除吗?"))
                  that
                    .$get(`orders/sales/return/delete/${value}`)
                    .then(response => {
                      if (response.status != 200) return false;
                      that.delTable($("#return #table"), 'id', [value]);
                    })
                    .catch(err => console.error);
              }
            }
          }
        ],
        data = {
          toolbar: "#return #toolbar",
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
      $("#return #table").bootstrapTable(data);
    },
    addSale() {
      $("#return #addreturn").modal("show");
    },
    refreshed() {
      this.refresh($("#return #table"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#return {
}
</style>
