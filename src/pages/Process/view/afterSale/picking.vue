<template>
  <div id="picking">
    <div id="afterSaleToolbar">
      <span class="lead">客服领料申请表</span>
      <!-- <el-button size="mini">新建领料</el-button> -->
    </div>
    <table id="afterSaleTable"></table>
  </div>
</template>
<script>
export default {
  name: "picking",
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      // that
      //   .$get(`repositories/requisition`, params.data)
      //   .then(response => {
      //     if (response.status != 200) return false;
      //     params.success({
      //       total: 0,
      //       rows: []
      //     });
      //   })
      //   .catch(err => {});
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
            checkbox: true
          },
          {
            field: "pickId",
            title: "客服领料单号",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "客服领料单号",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "申请人",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "申请日期",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "审核状态",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "领料状态",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "客服单号",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "客户公司名",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "备注",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "id",
            title: "操作",
            formatter: (value, row, index) => {
              return `${value}`;
            },
            events: {
              "click .del": ($el, value, row, index) => {
                that
                  .$post(`/service/delete/${value}`)
                  .then(response => {
                    that.delTable($("#afterSaleTable"), "id", [value]);
                  })
                  .catch(err => {});
              }
            }
          }
        ],
        data = {
          toolbar: "#afterSaleToolbar",
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
          onEditableSave(field, mrow, oldValue, $el) {
            that
              .$post(`/service/edit/${mrow.id}`, mrow)
              .then(response => {
                if (response.status != 200) return false;
                this.refreshed();
              })
              .catch(err => {});
          },
          detailFormatter(field, mrow, oldValue, $el) {
            let html = [`<p>客服领料明细</p>`];
            html.push(`<table class="table">`);
            mrow.detail.forEach(e =>
              html.push(
                `<tr><td>物品名称：${e.name}</td><td>数量：${
                  e.numbers
                }</td></tr>`
              )
            );
            html.push(`</table>`);
          }
        };
      $("#afterSaleTable").bootstrapTable(data);
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
