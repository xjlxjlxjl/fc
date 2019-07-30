<template>
  <div id="offer">
    <Qrmodel :modalData="modalData" :url="url"></Qrmodel>
    <addQuote :row="row" @refresh="refreshed"></addQuote>
    <div id="toolbar">
      <el-button size="mini" @click="row = { id: 0 };addModal = !addModal">新建报价单</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import Qrmodel from "@/pages/Process/common/afterSale/qrCode";
import addQuote from "@/pages/Process/common/sale/addQuote";

export default {
  name: "saleOffer",
  data() {
    return {
      url: "",
      addModal: false,
      modalData: {
        company: "",
        number: "",
        created_by: "",
        created_at: ""
      },
      row: {
        id: 0
      }
    };
  },
  components: {
    Qrmodel: Qrmodel,
    addQuote: addQuote
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`orders/sales/quoted_price`, params.data)
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
        check_status: 0
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "#",
            title: "序号",
            formatter(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qr_code_text",
            title: "二维码",
            formatter: function(value, row, index) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`offer${row.id}`).innerHTML = string)), 500);
              return `<div id="offer${row.id}" class="img" style="margin: auto;"></div>`;
            },
            events: {
              "click .img": function($el, value, row, index) {
                that.url = value;
                that.modalData = {
                  company: row.customer.name,
                  number: row.number,
                  created_by: row.created_by,
                  created_at: row.created_at
                }
                $("#offer .qrCode").modal("show");
              }
            }
          },
          {
            field: "number",
            title: "销售报价单号"
          },
          {
            field: "created_by",
            title: "报价人"
          },
          {
            field: "created_at",
            title: "报价日期"
          },
          {
            field: "validity",
            title: "报价有效期至"
          },
          {
            field: "total_price",
            title: "报价总金额"
          },
          {
            field: "currency",
            title: "币别"
          },
          {
            field: "customer.name",
            title: "客户名"
          },
          {
            field: "linkman",
            title: "联系人"
          },
          {
            field: "mobile",
            title: "手机号"
          },
          {
            field: "address",
            title: "公司地址"
          },
          {
            field: "source",
            title: "客户来源"
          },
          {
            field: "valid",
            title: "是否有效",
            formatter(value) {
              return value ? '已过有效期' : '未过有效期';
            }
          },
          {
            field: "id",
            title: "操作",
            formatter(value, row, index) {
              let print = `<button class="btn btn-primary btn-sm print">打印</button>`,
                edit = `<button class="btn btn-success btn-sm edit" style="margin-left: 5px;">编辑</button>`,
                del = `<button class="btn btn-danger btn-sm del" style="margin-left: 5px;">删除</button>`;
              return `<div style="display: flex;">${print + edit + del}</div>`
            },
            events: {
              "click .print"(event, value, row, index) {
                window.open(`/print.html#/saleOffer/${row.id}`);
              },
              "click .edit"(event, value, row, index) {
                that.row = row;
                that.addModal = !that.addModal;
              },
              "click .del"(event, value, row, index) {
                that
                  .$get(`orders/sales/quoted_price/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#offer #table"), 'id', [value]);
                  })
                  .catch(e => console.error(e));
              }
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
            let content = [];
            content.push(`<table class="table table-bordered">`);
            content.push(
              `<tr><th>序号</th><th>料品名称</th><th>产品规格</th><th>数量</th><th>单位</th><th>价格</th><th>产品需求描述</th></tr>`
            );
            mrow.items.forEach((e, k) =>
              content.push(
                `<tr>
                <td>${ k + 1 }</td>
                <td>${e.name || ""}</td>
                <td>${e.model || ""}</td>
                <td>${e.quantity || ""}</td>
                <td>${e.unit || ""}</td>
                <td>${e.price}</td>
                <td>${e.description}</td>
              </tr>`
              )
            );
            content.push(`</table>`);
            return content.join("");
          }
        };
      $("#offer #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#offer #table"))
    }
  },
  watch: {
    addModal(v) {
      $("#offer #addQuote").modal("toggle");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#offer {
}
</style>
