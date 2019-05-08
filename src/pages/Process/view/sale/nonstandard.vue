<template>
  <div id="nonstandard">
    <addNonstandard></addNonstandard>
    <addOffer></addOffer>
    <div id="toolbar">
      <el-button type="default" size="mini" @click="addNonstandardModal = !addNonstandardModal">新建非标询价</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addNonstandard from "@/pages/Process/common/sale/addNonstandard";
import addOffer from "@/pages/Process/common/sale/addOffer";

export default {
  name: "nonstandard",
  data() {
    return {
      addNonstandardModal: false,
      addOfferModal: false
    };
  },
  components: {
    addNonstandard: addNonstandard,
    addOffer: addOffer
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
            field: "index",
            title: "序号",
            formatter: (value, row, index) => {
              return index + 1;
            }
          },
          {
            field: "qrCode",
            title: "二维码",
            formatter: (value, row, index) => {
              return index;
            }
          },
          {
            field: "qrCode",
            title: "非标询价单号",
            formatter: (value, row, index) => {
              return index;
            }
          },
          {
            field: "qrCode",
            title: "询价人"
          },
          {
            field: "qrCode",
            title: "询价日期"
          },
          {
            field: "#",
            title: "询价记录",
            formatter: (value, row, index) => {
              let inquiry = `
                <select class="form-control inquiry">
                  <option>1</option>
                  <option>2</option>
                </select>
              `;
              return inquiry;
            },
            events: {
              "change .inquiry": function(e, value, row, index) {
                that.ediTable($("#nonstandard #table"), index, {
                  qrCode: 1231231231
                });
              }
            }
          },
          {
            field: "qrCode",
            title: "报价状态"
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let
                offer = `<button class="btn btn-primary btn-sm offer">报价</button>`,
                print = `<button class="btn btn-success btn-sm print" style="margin-left: 5px;">打印</button>`,
                edit = `<button class="btn btn-warning btn-sm edit" style="margin-left: 5px;">编辑</button>`,
                del = `<button class="btn btn-danger btn-sm del" style="margin-left: 5px;">删除</button>`;
              return offer + print + edit + del;
            },
            events: {
              "click .offer": function(e, value, row, index) {
                that.addOfferModal = !that.addOfferModal;
              },
              "click .print": function(e, value, row, index) {
                window.open(`/print.html#/saleNonstandard/${row.id || 123}`);
              },
              "click .edit": function(e, value, row, index) {
                that.addNonstandardModal = !that.addNonstandardModal;
              },
              "click .del": function(e, value, row, index) {

              }
            }
          }
        ],
        data = {
          toolbar: "#nonstandard #toolbar",
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
          onEditableSave(field, mrow, oldValue, $el) {},
          detailFormatter(field, mrow, oldValue, $el) {}
        };
      $("#nonstandard #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#nonstandard #table"));
    }
  },
  watch: {
    addNonstandardModal(val) {
      $("#nonstandard #addNonstandard").modal("toggle");
    },
    addOfferModal(val) {
      $("#nonstandard #addOffer").modal("toggle");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#nonstandard {
}
</style>
