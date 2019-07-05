<template>
  <div id="picking">
    <Qrmodel :url="url"></Qrmodel>
    <servicePick type="2" :active="active" @refresh="refreshed"></servicePick>
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import Qrmodel from "@/pages/Process/common/afterSale/qrCode";
import servicePick from "@/pages/Process/common/afterSale/servicePick";

export default {
  name: "picking",
  data() {
    return {
      url: '',
      active: {}
    };
  },
  components: {
    servicePick: servicePick,
    Qrmodel: Qrmodel
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`service/receive_material`, params.data)
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
        search: params.search,
        page: params.offset / params.limit + 1,
        per_page: params.limit
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter(value, row, index) {
              return `${index + 1}`;
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
                $("#picking .qrCode").modal("show");
              }
            }
          },
          {
            field: "number",
            title: "客服领料单号",
            formatter(value, row, index) {
              return `${value}`;
            }
          },
          {
            field: "creator.last_name",
            title: "创建人",
            formatter(value, row, index) {
              return `${value}`;
            }
          },
          {
            field: "created_at",
            title: "创建日期",
            formatter(value, row, index) {
              return `${value}`;
            }
          },
          {
            field: "service_number",
            title: "客服申请单号",
            formatter(value, row, index) {
              return `${value}`;
            }
          },
          {
            field: "customer_company_name",
            title: "客户公司名",
            formatter(value, row, index) {
              return `${value}`;
            }
          },
          {
            field: "customer_linkman",
            title: "客户联系人",
            formatter(value, row, index) {
              return `${value}`;
            }
          },
          {
            field: "phone",
            title: "联系电话",
            formatter(value, row, index) {
              return `${value}`;
            }
          },
          {
            field: "check.check_status",
            title: "审核状态",
            formatter(value, row, index) {
              return `${value ? '审核中' : '已审核' }`;
            }
          },
          {
            field: "id",
            title: "操作",
            formatter(value, row, index) {
              let edit = `<button class="edit btn btn-success btn-sm">编辑</button>`,
                del = `<button class="del btn btn-danger btn-sm">删除</button>`;
              return edit + del;
            },
            events: {
              "click .edit": function($el, value, row, index) {
                that.active = row;
                $("#picking #servicePick").modal("show");
              },
              "click .del": ($el, value, row, index) => {
                that
                  .$post(`service/receive_material/${value}/delete`)
                  .then(response => {
                    that.delTable($("#table"), "id", [value]);
                  })
                  .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#picking #toolbar",
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
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>序号</td>
                    <td>料品编码</td>
                    <td>料品规格</td>
                    <td>料品名称</td>
                    <td>单位</td>
                    <td>数量</td>
                    <td>已领数量</td>
                    <td>待领数量</td>
                  </tr>
            `;
            mrow.items.forEach((e, k) => {
              content += `
                <tr>
                  <td>${ k + 1 }</td>
                  <td>${ e.material_number }</td>
                  <td>${ e.material_specification }</td>
                  <td>${ e.material_name }</td>
                  <td>${ e.unit }</td>
                  <td>${ e.quantity }</td>
                  <td>${ e.cancel_quantity || '' }</td>
                  <td>${ e.wait_quantity || '' }</td>
                </tr>
              `
            });
            content += `
                </tbody>
              </table>
            `;
            return content;
          }
        };
      $("#picking #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#picking #table"));
    }
  },
  mounted() {
    this.init();
  },
  created() {}
};
</script>
<style lang="less">
#picking {
}
</style>
