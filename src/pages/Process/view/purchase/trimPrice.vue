<template>
  <div id="trimPrice">
    <div id="toolbar">
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
export default {
  name: "trimPrice",
  data() {
    return {
      record: [],
      list: []
    };
  },
  components: {
  },
  methods: {
    tableAjaxData(params) {
      params.success({
        rows: [{ id: 20 }],
        total: 1
      });
    },
    tableAjaxParams(params) {
      return params;
    },
    init() {
      const that = this,
        barCodeStyle = { displayValue: false, height: 30, width: 2 },
        columns = [
          {
            checkbox: true
          },
          {
            field: "#",
            title: "料品编码",
            sortable: true
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let del = `<button class="btn btn-sm btn-danger del" style="margin-left: 5px;">删除</button>`;
              return del;
            },
            events: {
              "click .del": function(e, value, row, index) {}
            }
          }
        ],
        data = {
          toolbar: "#trimPrice #toolbar",
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
          detailView: false,
          columns: columns,
          detailFormatter(field, mrow, oldValue, $el) {},
          onEditableSave(field, mrow, oldValue, $el) {}
        };

      $("#trimPrice #table").bootstrapTable(data);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
@grey: #dddddd;
@border: 1px solid @grey;

#trimPrice {
  #table {
    tbody {
      tr {
        td {
          &:nth-child(6),
          &:nth-child(7),
          &:nth-child(8) {
            padding: 0px;
            > div {
              display: flex;
              > div {
                padding: 15px;
                width: 100px;
                border-right: @border;
                > label {
                  margin-bottom: 0;
                  font-weight: normal;
                }
                &:last-child {
                  border: none;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
