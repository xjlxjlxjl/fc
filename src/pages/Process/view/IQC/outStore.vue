<template>
  <div id="outStore">
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  name: "outStore",
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {
      params.success({
        rows: [{ id: 1 }],
        total: 1
      });
      return false
      this
        .$get(``, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(e => console.error(e));
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / 10 + 1,
        per_page: params.limit,
        grade: 1
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "#",
            title: "序号",
            formatter: function(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qrCode",
            title: "二维码",
            formatter: function(value, row, index) {
              setTimeout(() =>QRCode.toString(`https://www.factoryun.com/service/report/detail/${row.id}`,
                (err, string) => (document.getElementById(`outStore${row.id}`).innerHTML = string)),
                500
              );
              return `<div id="outStore${row.id}" class="img" style="margin: auto;max-width: 50px;max-height: 50px;"></div>`;
            },
            events: {
              "click .img": function($el, value, row, index) {
                // that.url = `https://www.factoryun.com/service/report/detail/${row.id}`;
                // $("#outStore .qrCode").modal("show");
              }
            }
          },
          {
            field: "number",
            title: "出库申请单号",
            sortable: true
          },
          {
            field: "created_at",
            title: "质检日期",
            sortable: true
          },
          {
            field: "created_by",
            title: "质检员",
            sortable: true
          },
          {
            field: "temp_storage.number",
            title: "关联退/换货单",
            sortable: true
          },
          {
            field: "temp_storage.source",
            title: "暂收来源",
            sortable: true
          },
          {
            field: "procurement.number",
            title: "关联单号",
            sortable: true
          },
          {
            field: "temp_storage.is_return",
            title: "是否退换货",
            formatter(value) {
              return value ? '是' : '否' ;
            }
          },
          {
            field: "procurement.supplier.name",
            title: "供应商/委外商",
            sortable: true
          },
          {
            field: "procurement.supplier_contract.name",
            title: "联系人",
            sortable: true
          },
          {
            field: "procurement.supplier_contract.mobile",
            title: "联系电话",
            sortable: true
          },
          {
            field: "procurement.created_by",
            title: "采购员",
            sortable: true
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let print = `<button class="btn btn-sm btn-primary print">打印</button>`,
                outStore = `<button class="btn btn-sm btn-danger outStore">出库</button>`;
              return print + outStore;
            },
            events: {
              "click .print": function(e, value, row, index) {
                window.open(`/print.html#/purchasReceive/${row.id}`);
              },
              "click .outStore": function(e, value, row, index) {
                that
                  .$get(`icm_qty_ctrl/quality/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                  })
                  .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#outStore #toolbar",
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
            let html = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th>序号</th>
                    <th>料品编码</th>
                    <th>料品名称</th>
                    <th>料品规格</th>
                    <th>单位</th>
                    <th>交期</th>
                    <th>采购数量</th>
                    <th>暂收数</th>
                    <th>不良数</th>
                    <th>需退数</th>
                    <th>实退数</th>
                    <th>不良原因</th>
                  </tr>
            `;
            for (let e of mrow.items)
              html += `
                <tr>
                  <td>${ k + 1 }</td>
                  <td>${ e.material.code }</td>
                  <td>${ e.material.name }</td>
                  <td>${ e.material.specification }</td>
                  <td>${ e.material.unit }</td>
                  <td>${ e.procurement_item.delivery_period }</td>
                  <td>${ e.procurement_item.quantity }</td>
                  <td>${ e.temp_storage_item.cancel_quantity }</td>
                  <td>${ e.temp_storage_item.wait_quantity }</td>
                  <td>${ e.bad }</td>
                  <td>${ e.refund }</td>
                  <td>${ e.actual_refund }</td>
                  <td>${ e.bad_cause }</td>
                </tr>
              `;
            html += `</tbody></table>`;
            return html;
          }
        };
      $("#outStore #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#outStore #table"));
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less">
#outStore {

}
</style>
