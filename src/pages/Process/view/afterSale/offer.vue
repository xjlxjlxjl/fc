<template>
  <div id="offer">
    <Qrmodel :url="url"></Qrmodel>
    <servicePick type="1" :active="active" @refresh="refreshed"></servicePick>
    <applyService :active="active" @refresh="refreshed"></applyService>
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>

<script>
import QRCode from "qrcode";
import Qrmodel from "@/pages/Process/common/afterSale/qrCode";
import servicePick from "@/pages/Process/common/afterSale/servicePick";
import applyService from "@/pages/Process/common/afterSale/applyService";

export default {
  name: "offer",
  data() {
    return {
      url: "",
      active: {}
    };
  },
  components: {
    Qrmodel: Qrmodel,
    servicePick: servicePick,
    applyService: applyService
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`service/quoted_price`, params.data)
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
      return params;
    },
    init() {
      const that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter: function(value, row, index) {
              return `${index + 1}`;
            }
          },
          {
            field: "qrCode",
            title: "二维码",
            formatter: function(value, row, index) {
              setTimeout(
                () =>
                  QRCode.toString(`https://www.factoryun.com/respositories/detail/${row.slug}`,
                    (err, string) =>
                      (document.getElementById(`offer${row.id}`).innerHTML = string)
                  ),
                500
              );
              return `<div id="offer${row.id}" class="img" style="margin: auto;"></div>`;
            },
            events: {
              "click .img": function($el, value, row, index) {
                that.url = 'aaaaaaaaaaaa';
                $("#offer .qrCode").modal("show");
              }
            }
          },
          {
            field: "quoted_price_number",
            title: "客服报价单号",
            sortable: true
          },
          {
            field: "created_by",
            title: "创建人",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建日期",
            sortable: true
          },
          {
            field: "service_number",
            title: "客服申请单号",
            sortable: true
          },
          {
            field: "customer_company_name",
            title: "客户公司名",
            sortable: true
          },
          {
            field: "linkman",
            title: "客户联系人",
            sortable: true
          },
          {
            field: "phone",
            title: "联系电话",
            sortable: true
          },
          {
            field: "check.check_status",
            title: "审核状态",
            formatter: function(value, row, index) {
              return `${value ? "已审核" : "审核中"}`;
            }
          },
          {
            field: "#",
            title: "操作",
            formatter: function(value, row, index) {
              const picking = `<button class="picking btn btn-primary btn-sm">客服领料</button>`,
                edit = `<button class="edit btn btn-success btn-sm">　编辑　</button>`,
                del = `<button class="del btn btn-danger btn-sm">　删除　</button>`;
              return picking + edit + del;
            },
            events: {
              "click .picking": function($el, value, row, index) {
                that.active = row;
                $("#offer #servicePick").modal("show");
              },
              "click .edit": function($el, value, row, index) {
                that.active = row;
                $("#offer #applyService").modal("show");
              },
              "click .del": function($el, value, row, index) {},
            }
          }
        ],
        data = {
          toolbar: "#offer #toolbar",
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
            let table = `
              <table>
                <tr>
                  <td>序号</td>
                  <td>料品编码</td>
                  <td>料品名称/费用名称</td>
                  <td>单位</td>
                  <td>数量</td>
                </tr>
            `;
            morw.item.forEach((e, k) => (table += `
              <tr>
                <td>${ k + 1 }</td>
                <td>${ e.code || '' }</td>
                <td>${ e.name || '' }</td>
                <td>${ e.unit || '' }</td>
                <td>${ e.num || '' }</td>
              </tr>
            `));
            table += `</table>`;
            return table;
          },
          onEditableSave(field, mrow, oldValue, $el) {}
        };
      $("#offer #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#offer #table"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#offer {
  #table {
    svg {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
