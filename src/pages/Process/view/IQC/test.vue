<template>
  <div id="test">
    <Qrmodel :url="url"></Qrmodel>
    <div id="toolbar">
      <el-button type="default" size="mini">转仓</el-button>
    </div>
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
      url: ""
    };
  },
  components: {
    Qrmodel: Qrmodel
  },
  methods: {
    tableAjaxData(params) {
      params.success({
        rows: [{}],
        total: 1
      });
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      return params;
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
              setTimeout(
                () =>
                  QRCode.toString(
                    `https://www.factoryun.com/service/report/detail/${row.id}`,
                    (err, string) =>
                      (document.getElementById(
                        `picking${row.id}`
                      ).innerHTML = string)
                  ),
                500
              );
              return `<div id="picking${
                row.id
              }" class="img" style="margin: auto;max-width: 50px;max-height: 50px;"></div>`;
            },
            events: {
              "click .img": function($el, value, row, index) {
                that.url = `https://www.factoryun.com/service/report/detail/${
                  row.id
                }`;
                $("#picking .qrCode").modal("show");
              }
            }
          },
          {
            field: "id",
            title: "暂收单号",
            sortable: true
          },
          {
            field: "id",
            title: "暂收日期",
            sortable: true
          },
          {
            field: "id",
            title: "暂收员",
            sortable: true
          },
          {
            field: "id",
            title: "暂收来源",
            sortable: true
          },
          {
            field: "id",
            title: "单号",
            sortable: true
          },
          {
            field: "id",
            title: "委外商/供应商",
            sortable: true
          },
          {
            field: "id",
            title: "联系人",
            sortable: true
          },
          {
            field: "id",
            title: "联系电话",
            sortable: true
          },
          {
            field: "id",
            title: "采购员",
            sortable: true
          },
          {
            field: "id",
            title: "是否发送质检",
            sortable: true
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let send = `<button class="btn btn-sm btn-success send">发送品检</button>`,
                join = `<button class="btn btn-sm btn-primary join">申请入库</button>`,
                edit = `<button class="btn btn-sm btn-warning del">编　　辑</button>`,
                del = `<button class="btn btn-sm btn-danger del">删　　除</button>`;
              return send + join + edit + del;
            },
            events: {
              "click .send": function(e, value, row, index) {},
              "click .join": function(e, value, row, index) {},
              "click .edit": function(e, value, row, index) {},
              "click .del": function(e, value, row, index) {}
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
              <table>
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
                  <th>料品智能占用</th>
                </tr>
            `;
            html += `</table>`;

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