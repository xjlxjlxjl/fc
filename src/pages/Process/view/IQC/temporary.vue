<template>
  <div id="temporary">
    <Qrmodel :url="url" :modalData="modalData"></Qrmodel>
    <addInspectionBill :arr="arr"></addInspectionBill>
    <smartOccupy :arr="row"></smartOccupy>
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import Qrmodel from "@/pages/Process/common/afterSale/qrCode";
import addInspectionBill from "@/pages/Process/common/IQC/addInspectionBill";
import smartOccupy from '@/pages/Process/common/purchase/smartOccupy';

export default {
  name: "temporary",
  data() {
    let user = JSON.parse(
      localStorage.getItem("user") || "{ user: { current_company: '' } }"
    );
    return {
      user: user,
      url: "",
      status: 0,
      arr: {},
      row: [],
      modalData: {},
      occupyModal: false
    };
  },
  components: {
    Qrmodel: Qrmodel,
    addInspectionBill: addInspectionBill,
    smartOccupy: smartOccupy
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`repositories/receipt`, params.data)
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
        supplier_name: params.search,
        is_inspection: 1
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
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`picking${row.id}`).innerHTML = string)), 500);
              return `<div id="picking${row.id}" class="img" style="margin: auto;max-width: 50px;max-height: 50px;"></div>`;
            },
            events: {
              "click .img": function($el, value, row, index) {
                that.url = value;
                that.modalData = {
                  company: that.user.user.current_company,
                  number: row.receipt_no,
                  created_at: row.created_at,
                  created_by: row.receipt_user.last_name
                }
                $("#temporary .qrCode").modal("show");
              }
            }
          },
          {
            field: "receipt_no",
            title: "暂收单号"
          },
          {
            field: "created_at",
            title: "暂收日期"
          },
          {
            field: "receipt_user.last_name",
            title: "暂收员"
          },
          {
            field: "from",
            title: "暂收来源"
          },
          {
            field: "order_number",
            title: "单号"
          },
          {
            field: "is_return",
            title: "是否退换货",
            formatter: function(value, row, index) {
              return value ? '是' : '否';
            }
          },
          {
            field: "supplier.name",
            title: "供应商/委外商"
          },
          {
            field: "supplier.contract",
            title: "联系人"
          },
          {
            field: "supplier.phone",
            title: "联系电话"
          },
          {
            field: "purchase_user",
            title: "采购员"
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let add = `<button class="btn btn-sm btn-success add">新建质检单</button>`,
                print = `<button class="btn btn-sm btn-warning print">打　　　印</button>`,
                del = `<button class="btn btn-sm btn-danger del">删　　　除</button>`;
              return add + print + del;
            },
            events: {
              "click .add": function(e, value, row, index) {
                that.arr = row;
                $("#temporary #addInspectionBill").modal("show");
              },
              "click .print": function(e, value, row, index) {
                window.open(`/print.html#/IQCtemporary/${row.id}`);
              },
              "click .del": function(e, value, row, index) {
                this
                  .$get(`repositories/receipt/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#temporary #table"), 'id', [value]);
                  })
                  .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#temporary #toolbar",
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
                    <th></th>
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
                    <th>已检数</th>
                    <th>待检数</th>
                    <th>料品智能占用</th>
                  </tr>
            `;
            for (let item of mrow.items) {
              html += `
                <tr>
                  <td><input type="checkbox" class="" /></td>
                  <td>${ item.material.material_number || '' }</td>
                  <td>${ item.material.name || '' }</td>
                  <td>${ item.material.material_specification || '' }</td>
                  <td>${ item.material.item_unit || '' }</td>
                  <td>${ item.delivery_period.date || '' }</td>
                  <td>${ item.purchase_quantity || '' }</td>
                  <td>${ item.cancel_quantity || '' }</td>
                  <td>${ item.wait_quantity || '' }</td>
                  <td>${ item.is_inspection ? '是' : '否' }</td>
                  <td>${ item.remark || '' }</td>
                  <td>${ item.checked_quantity || "" }</td>
                  <td>${ item.wait_checked_quantity || "" }</td>
                  <td><button class="btn btn-default btn-sm">查看占用</button></td>
                </tr>
              `;
            }
            html += `</tbody></table>`;
            return html;
          }
        };
      $("#temporary #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#temporary #table"));
    }
  },
  watch: {
    occupyModal(v) {
      $("#temporary #smartOccupy").modal("toggle");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
#temporary {
}
</style>