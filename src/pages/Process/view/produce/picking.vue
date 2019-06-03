<template>
  <div id="picking">
    <div id="toolbar"></div>
    <table id="table"></table>
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
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("service/list", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.tableData = response.data.list;
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
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
            formatter(value, row, index){
              return `${index + 1}`;
            }
          },
          {
            field: "pickId",
            title: "生产领料单号",
            formatter(value, row, index){
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "创建人",
            formatter(value, row, index){
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "创建时间",
            formatter(value, row, index){
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "关联销售订单号",
            formatter(value, row, index){
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "关联生产计划单",
            formatter(value, row, index){
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "领料状态",
            formatter(value, row, index){
              return `${value}`;
            }
          },
          {
            field: "id",
            title: "操作",
            formatter(value, row, index){
              let end = `<button class="btn btn-sm btn-info">结案</button>`;
              return end;
            },
            events: {
              "click .end"($el, value, row, index) {
                if (confirm("是否确认结案"))
                  that
                    .$post(`/service/delete/${value}`)
                    .then(response => {
                      that.delTable($("#picking #table"), "id", [value]);
                    })
                    .catch(err => console.error(err));
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
          columns: columns,
          detailView: true,
          detailFormatter(field, mrow, oldValue, $el) {
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>序号</td>
                    <td>料品编码</td>
                    <td>料品规格</td>
                    <td>料品名称</td>
                    <td>数量</td>
                    <td>长度</td>
                    <td>关联子料</td>
                    <td>单位</td>
                    <td>料品类别</td>
                    <td>料品属性</td>
                    <td>智能占用</td>
                    <td>智能备料日期</td>
                    <td>已领数量</td>
                    <td>待领数量</td>
                    <td>物料车编号</td>
                    <td>备料数量</td>
                  </tr>
            `;
            mrow.items = [{}];
            mrow.items.forEach((e, k) => {
              content += `
                <tr>
                  <td>${k + 1}</td>
                  <td>${e.料品编码}</td>
                  <td>${e.料品规格}</td>
                  <td>${e.料品名称}</td>
                  <td>${e.数量}</td>
                  <td>${e.长度}</td>
                  <td>${e.关联子料}</td>
                  <td>${e.单位}</td>
                  <td>${e.料品类别}</td>
                  <td>${e.料品属性}</td>
                  <td>${e.智能占用}</td>
                  <td>${e.智能备料日期}</td>
                  <td>${e.已领数量}</td>
                  <td>${e.待领数量}</td>
                  <td>${e.物料车编号}</td>
                  <td>${e.备料数量}</td>
                </tr>
              `
            });
            content += `</tbody></table>`;
            return content;
          }
        };
      $("#picking #table").bootstrapTable(data);
    }
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="less">
#picking {
}
</style>
