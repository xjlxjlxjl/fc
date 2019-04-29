<template>
  <div id="report">
    <Qrmodel :url="url"></Qrmodel>
    <editReport :active="active" @refresh="refreshed" type="2" @createdReportModal="createdReportModal" @reportListModal="reportListModal"></editReport>
    <createdReport :active="rows" @record="ids"></createdReport>
    <reportList :reportId="reportId"></reportList>

    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import Qrmodel from "@/pages/Process/common/afterSale/qrCode";
import editReport from "@/pages/Process/common/afterSale/report";
import createdReport from "@/pages/Process/common/afterSale/createdReport";
import reportList from "@/pages/Process/common/afterSale/reportList";

export default {
  name: "report",
  data() {
    return {
      url: '',
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      active: {
        orders: [],
      },
      date: [],
      rows: {},
      reportId: 0,
    };
  },
  components: {
    Qrmodel: Qrmodel,
    editReport: editReport,
    createdReport: createdReport,
    reportList: reportList
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`service/report`, params.data)
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
      let p = {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        member: this.user.user.display_name,
        start_at: this.date[0],
        end_at: this.date[1]
      };
      p.number = params.search || undefined;
      return p;
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter: function(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qrCode",
            title: "二维码",
            formatter: function(value, row, index) {
              setTimeout(
                () =>
                  QRCode.toString(`https://www.factoryun.com/service/report/detail/${row.id}`,
                    (err, string) =>
                      (document.getElementById(`report${row.id}`).innerHTML = string)
                  ),
                500
              );
              return `<div id="report${row.id}" class="img" style="margin: auto;"></div>`;
            },
            events: {
              "click .img": function($el, value, row, index) {
                that.url = `https://www.factoryun.com/service/report/detail/${row.id}`;
                $("#report .qrCode").modal("show");
              }
            }
          },
          {
            field: "number",
            title: "客服报告单号",
            sortable: true
          },
          {
            field: "creator.last_name",
            title: "创建人",
            sortable: true
          },
          {
            field: "customer_linkman",
            title: "创建日期",
            sortable: true
          },
          {
            field: "server_number",
            title: "客服申请单号",
            sortable: true
          },
          {
            field: "customer_company_name",
            title: "客户公司名",
            sortable: true
          },
          {
            field: "customer_linkman",
            title: "客户联系人",
            sortable: true
          },
          {
            field: "customer_mobile",
            title: "联系电话",
            sortable: true
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let edit = `<button class="edit btn btn-success btn-sm">编辑</button>`,
                del = `<button class="del btn btn-danger btn-sm">删除</button>`;
              return edit + del;
            },
            events: {
              "click .edit": function(e, value, row, index) {
                that.active = row;
                $("#report #report").modal("show");
              },
              "click .del": function(e, value, row, index) {
                that
                  .$get(`service/report/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#report #table"), 'id', [value]);
                  })
                  .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#report #toolbar",
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
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>序号</td>
                    <td>销售订单编号</td>
                    <td>产品SN码</td>
                    <td>料品编码</td>
                    <td>料品规格</td>
                    <td>料品名称</td>
                    <td>出货日期</td>
                    <td>是否过保</td>
                    <td>产品故障描述</td>
                    <td>图片</td>
                    <td>客服记录</td>
                  </tr>
            `;
            mrow.orders.forEach((e, k) => {
              content += `
                <tr>
                  <td>${ k + 1 }</td>
                  <td>${ e.order_no }</td>
                  <td>${ e.product_sn }</td>
                  <td>${ e.material_number }</td>
                  <td>${ e.material_specification }</td>
                  <td>${ e.material_name }</td>
                  <td>${ e.ship_date }</td>
                  <td>${ e.is_protected ? '是' : '否' }</td>
                  <td>${ e.problem }</td>
                  <td>`
                    e.images_url.forEach(v => content += `<a href="${v.url}" target="_blank"><img src="${v.url}" style="max-width: 50px; max-height: 50px;" /></a>`);
                  content += `</td>
                  <td>
                    <button index="${e.id}" class="btn btn-default btn-sm getRecord">查看记录</button>
                    <button index="${field}" key="${k}" class="btn btn-default btn-sm addRecord">添加记录</button>
                  </td>
                </tr>
              `;
            })
            content += `</tbody></table>`;
            return content;
          }
        };
      $("#report #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#report #table"));
    },
    createdReportModal(val) {
      this.rows = val;
      $("#report #createdReport").modal("toggle");
    },
    reportListModal(val) {
      this.reportId = parseInt(val);
      $("#report #reportList").modal("toggle");
    },
    ids(data) {
      this.active.orders = data;
    }
  },
  mounted() {
    this.init();
    const that = this;
    $("#report #table").on("click", '.getRecord', function() {
      that.reportListModal($(this).attr("index"));
    })
    $("#report #table").on("click", '.addRecord', function() {
      let index = $(this).attr("index"),
        key = $(this).attr("key"),
        data = { index: key, data: that.getAllData($("#report #table"))[index].orders };
      that.createdReportModal(data);
    })
  }
};
</script>
<style lang="less">
#report {
}
</style>
