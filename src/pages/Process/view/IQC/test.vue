<template>
  <div id="test">
    <Qrmodel :url="url" :modalData="modalData"></Qrmodel>
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import Qrmodel from "@/pages/Process/common/afterSale/qrCode";

export default {
  name: "test",
  data() {
    let user = JSON.parse(
      localStorage.getItem("user") || "{ user: { current_company: '' } }"
    );
    return {
      user: user,
      url: "",
      modalData: {}
    };
  },
  components: {
    Qrmodel: Qrmodel
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
            field: "qr_code_text",
            title: "二维码",
            formatter: function(value, row, index) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`test${row.id}`).innerHTML = string)), 500);
              return `<div id="test${row.id}" class="img" style="margin: auto;max-width: 50px;max-height: 50px;"></div>`;
            },
            events: {
              "click .img": function($el, value, row, index) {
                that.url = value;
                // $("#test .qrCode").modal("show");
              }
            }
          },
          {
            field: "number",
            title: "质检单号",
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
            title: "关联暂收单号",
            sortable: true
          },
          {
            field: "temp_storage.created_at",
            title: "暂收日期",
            sortable: true
          },
          {
            field: "temp_storage.created_by",
            title: "暂收员",
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
            field: "checks_status",
            title: "质检入库",
            formatter(value) {
              switch(value) {
                case 1:
                case "1":
                  return '申请通过';
                case 2:
                case "2":
                  return '已申请'
                default:
                  return '未申请'
              }
            }
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let join = `<button class="btn btn-sm btn-primary join">质检入库</button>`,
                del = `<button class="btn btn-sm btn-danger del">删　　除</button>`;
              return join + del;
            },
            events: {
              "click .join": function(e, value, row, index) {
                that
                  .$post(`icm_qty_ctrl/quality/store/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.refreshed();
                  })
                  .catch(e => console.error(e));
              },
              "click .del": function(e, value, row, index) {
                that
                  .$get(`icm_qty_ctrl/quality/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#test #table"), 'id', [value]);
                  })
                  .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#test #toolbar",
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
                    <th>质检结果</th>
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
                  <td style="padding: 0;">
                    <table class="table table-bordered">
                      <tr>
                        <td>合格数</td>
                        <td colspan="3">${ e.qualification }</td>
                      </tr>
                      <tr>
                        <td>不良数</td>
                        <td>${ e.bad }</td>
                        <td>不良原因</td>
                        <td>${ e.bad_cause }</td>
                      </tr>
                    </table>
                  </td>
                  <td><button class="btn btn-default btn-sm">查看占用</button></td>
                </tr>
              `;
            html += `</tbody></table>`;
            return html;
          },
          onEditableSave(field, mrow, oldValue, $el) {}
        };
      $("#test #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#test #table"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
#test {
}
</style>