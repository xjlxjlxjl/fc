<template>
  <div id="temporary">
    <Qrmodel :url="url"></Qrmodel>
    <addInspectionBill :arr="arr"></addInspectionBill>
    <div id="toolbar">
      <el-select v-model="status" @change="refreshed" size="mini">
        <el-option label="未完成" :value="0"></el-option>
        <el-option label="已完成" :value="1"></el-option>
        <el-option label="全部" :value="undefined"></el-option>        
      </el-select>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import Qrmodel from "@/pages/Process/common/afterSale/qrCode";
import addInspectionBill from "@/pages/Process/common/IQC/addInspectionBill";

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
      arr: []
    };
  },
  components: {
    Qrmodel: Qrmodel,
    addInspectionBill: addInspectionBill
  },
  methods: {
    tableAjaxData(params) {
      params.success({
        rows: [
          {
            id: 1,
            items: [
              {},
              {},
              {},
              {}
            ]
          },
          {
            id: 2,
            items: [
              {}
            ]
          },
          {
            id: 3,
            items: [
              {},
              {},
            ]
          },
          {
            id: 4,
            items: [
              {},
              {},
              {}
            ]
          }
        ],
        total: 1
      });
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / 10 + 1,
        per_page: params.limit,
        status: this.status
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
            field: "aaa",
            title: "暂收单号"
          },
          {
            field: "aaa",
            title: "暂收日期"
          },
          {
            field: "aaa",
            title: "暂收员"
          },
          {
            field: "aaa",
            title: "暂收来源"
          },
          {
            field: "aaa",
            title: "单号"
          },
          {
            field: "aaa",
            title: "是否退换货",
            formatter: function(value, row, index) {
              return value ? '是' : '否';
            }
          },
          {
            field: "aaa",
            title: "供应商/委外商"
          },
          {
            field: "aaa",
            title: "联系人"
          },
          {
            field: "aaa",
            title: "联系电话"
          },
          {
            field: "aaa",
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
                that.arr = row.items;
                $("#temporary #addInspectionBill").modal("show");
              },
              "click .print": function(e, value, row, index) {
                window.open(`/print.html#/IQCtemporary/${row.id}`);
              },
              "click .del": function(e, value, row, index) {
                that.delTable($("#temporary #table"), 'id', [value]);
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
                    <th>料品智能占用</th>
                  </tr>
            `;
            html += `
              <tr>
                <td><input type="checkbox" /></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            `;
            html += `</tbody></table>`;
            return html;
          },
          onEditableSave(field, mrow, oldValue, $el) {}
        };
      $("#temporary #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#temporary #table"));
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