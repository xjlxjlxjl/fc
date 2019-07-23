<template>
  <div id="purchaseUnhealthy">
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  name: 'purchaseUnhealthy',
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`icm_qty_ctrl/quality`, params.data)
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
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        grade: 0
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
            field: "qr_code_text",
            title: "二维码",
            formatter: function(value, row, index) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`purchaseUnhealthy${row.id}`).innerHTML = string)), 500);
              return `<div id="purchaseUnhealthy${row.id}" class="img" style="margin: auto;max-width: 50px;max-height: 50px;"></div>`;
            },
            events: {
              "click .img": function($el, value, row, index) {
                // that.url = value;
                // $("#purchaseUnhealthy .qrCode").modal("show");
              }
            }
          },
          {
            field: "number",
            title: "质检不良单号"
          },
          {
            field: "created_at",
            title: "质检日期"
          },
          {
            field: "created_by",
            title: "质检员"
          },
          {
            field: "temp_storage.number",
            title: "关联质检单号"
          },
          {
            field: "temp_storage.source",
            title: "暂收来源"
          },
          {
            field: "procurement.number",
            title: "关联单号"
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
            title: "供应商/委外商"
          },
          {
            field: "procurement.supplier_contract.name",
            title: "联系人"
          },
          {
            field: "procurement.supplier_contract.mobile",
            title: "联系电话"
          },
          {
            field: "procurement.created_by",
            title: "采购员"
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let barter = `<button class="btn btn-sm btn-primary barter">采购换货</button>`,
                retreat = `<button class="btn btn-sm btn-warning retreat">采购退货</button>`,
                print = `<button class="btn btn-sm btn-success print">打　　印</button>`,
                special = `<button class="btn btn-sm btn-primary special">特检入库</button>`,
                end = `<button class="btn btn-sm btn-danger end">结　　案</button>`,
                del = `<button class="btn btn-sm btn-danger del">删　　除</button>`;
              return barter + retreat + print + special + end + del;
            },
            events: {
              "click .barter": function(e, value, row, index) {
                that.creatEmptor(1, row);
              },
              "click .retreat": function(e, value, row, index) {
                that.creatEmptor(2, row);
              },
              "click .print": function(e, value, row, index) {
                window.open(`/print.html#/IQCunhealthy/${row.id}`);
              },
              "click .del": function(e, value, row, index) {
                if (confirm('是否确定删除'))
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
          toolbar: "#purchaseUnhealthy #toolbar",
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
                    <th>料品编码</th>
                    <th>料品名称</th>
                    <th>料品规格</th>
                    <th>单位</th>
                    <th>交期</th>
                    <th>采购数量</th>
                    <th>暂收数</th>
                    <th>尚缺数量</th>
                    <th>是否需检</th>
                    <th>备注</th>
                    <th>此次检数</th>
                    <th>不良数</th>
                    <th>不良原因</th>
                    <th>智能占用</th>
                  </tr>
            `;
            for (let e of mrow.items)
              html += `
                <tr>
                  <td>${ e.material.code }</td>
                  <td>${ e.material.name }</td>
                  <td>${ e.material.specification }</td>
                  <td>${ e.material.unit }</td>
                  <td>${ e.procurement_item.delivery_period }</td>
                  <td>${ e.procurement_item.quantity }</td>
                  <td>${ e.temp_storage_item.cancel_quantity }</td>
                  <td>${ e.temp_storage_item.wait_quantity }</td>
                  <td>${ e.material.check ? '是' : '否' }</td>
                  <td>${ e.procurement_item.remark }</td>
                  <td>${ e.quantity }</td>
                  <td>${ e.bad }</td>
                  <td>${ e.bad_cause }</td>
                  <td><button class="btn btn-default btn-sm">查看占用</button></td>
                </tr>
              `;
            html += `</tbody></table>`;
            return html;
          }
        };
      $("#purchaseUnhealthy #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#purchaseUnhealthy #table"));
    },
    creatEmptor(type, row) {
      let 
        arr = [],
        that = this, 
        msg = new Map([
          [1, () => that.$message({ message: '生成换货单成功', type: 'success' })],
          [2, () => that.$message({ message: '生成换退货单成功', type: 'success' })]
        ]);
      for (let e of row.items)
        arr.push({
          quality_item_id: e.id,
          temp_storage_item_id: e.temp_storage_item_id,
          refund: e.refund,
          actual_refund: e.actual_refund
        })

      that
        .$post(`procurement/emptor/create`, {
          quality_id: row.id,
          temp_storage_id: row.temp_storage_id,
          type: type,
          items: arr
        })
        .then(response => {
          if (response.status != 200) return false;
          msg.get(type).call(this);
        })
        .catch(e => console.error(e));
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style>
  #purchaseUnhealthy {
    
  }
</style>