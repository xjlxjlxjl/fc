<template>
  <div id="power">
    <div id="mattersToolbar">
      <span class="lead">部门权限</span>
    </div>
    <powerModal @init="init"></powerModal>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
import powerModal from "@/pages/Process/common/powerModal";

export default {
  name: "power",
  data() {
    return {
      row: []
    };
  },
  components: {
    powerModal: powerModal
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`members/branch/permission`, params.data)
        .then(response => {
          if (response.status != 200) {
            params.success({
              rows: [],
              total: 0
            });
            return false;
          }
          let arr = [];
          response.data.list.forEach((e, k) => {
            arr.push({
              id: e.id,
              name: e.name
            });
            e.permission.forEach(p => {
              // for (let item in p.options) {
              //   if (p.value.indexOf(item) != -1) arr[k][item] = true;
              //   else arr[k][item] = false;
              // }
              arr[k][p.name] = {
                options: p.options,
                value: p.value
              };
            });
          });
          that.row = arr;
          params.success({
            rows: arr,
            total: response.data.pagination.total
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      params.page = parseInt(params.offset / params.limit + 1);
      params.per_page = params.limit;
      params.q = params.search;
      return params;
    },
    init({ columns }) {
      let that = this,
        data = {
          toolbar: "#mattersToolbar",
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
          pageSize: 1,
          pageList: [1, 3, 5],
          // detailView: true,
          columns: columns,
          detailFormatter: (index, row, $el) => {},
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };
      $("#mattersTable").bootstrapTable(data);
    },
    edit(arr) {
      let that = this;
      arr.forEach(e => {
        let self = that.getTableAttr($("#mattersTable"), "id");
        console.log(self);
        // that.$post()
      });
    },
    /**
     * 放出所有选项
     */
    changePower() {
      const that = this;
      $("#mattersTable").on("click", ".power", function() {
        let val = $(this).val(),
          key = $(this).attr("key"),
          index = $(this).attr("index"),
          row = that.row[index],
          list = Object.values(row),
          arr = [];

        for (let item of list) {
          if (typeof item == "object") item.value.forEach(e => arr.push(e));
        }
        if (arr.indexOf(val) == -1) arr.push(val);
        else arr.splice(arr.indexOf(val), 1);
        that
          .$post(`members/branch/permission/edit/${row.id}`, {
            permission: JSON.stringify(arr)
          })
          .then(response => {
            if (response.status != 200) return false;
            let data = {
              id: row.id,
              name: row.name
            };
            response.data.permission.forEach(p => {
              data[p.name] = {
                options: p.options,
                value: p.value
              };
            });
            that.ediTable($("#mattersTable"), index, data);
          })
          .catch(err => {});
      });
    },
    a() {
      let that = this,
        self = this.$store.state.powerList;
      this.label = [];
      this.item = [];
      this.columns = [];
      self.forEach(e => {
        Object.values(e.options).forEach(v => this.label.push(v));
        Object.keys(e.options).forEach(v => this.item.push(v));
      });
      for (let k in this.label) {
        if (k != "sum")
          this.columns.push({
            field: this.item[k],
            title: this.label[k],
            formatter: (val, row, index) => {
              return `<input type='checkbox' checked='${that.item.indexOf(
                val
              ) != -1}'>`;
            }
          });
      }
      $("#mattersTable").bootstrapTable({
        toolbar: "#mattersToolbar",
        ajax: this.tableAjaxData,
        queryParams: this.tableAjaxParams,
        data: [],
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
        pageList: [5],
        // detailView: true,
        columns: this.columns,
        detailFormatter: (index, row, $el) => {},
        onEditableSave: (field, mrow, oldValue, $el) => {}
      });
    },
    refreshed() {
      this.refresh($("#mattersTable"));
    }
  },
  mounted() {
    this.changePower();
    // this.init();
  }
};
</script>
<style lang="less">
#power {
  #mattersTable {
    > tbody {
      > tr {
        > td {
          padding-top: 0px;
          padding-bottom: 0px;
          padding-left: 0px;
          padding-right: 0px;
          > .table {
            > tbody {
              > tr {
                > td {
                  vertical-align: top !important;
                  white-space: nowrap;
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