<template>
  <div id="PR">
    <div id="toolbar">
    </div>
    <table id="table"></table>
  </div>
</template>

<script>
export default {
  name: "PR",
  data() {
    return {

    };
  },
  methods: {
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter: function(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qrCode",
            title: "二维码",
            formatter: function(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "number",
            title: "客服报告单号",
            sortable: true
          },
          {
            field: "customer_name",
            title: "创建人",
            sortable: true
          },
          {
            field: "customer_linkman",
            title: "创建日期",
            sortable: true
          },
          {
            field: "customer_mobile",
            title: "客服申请单号",
            sortable: true
          },
          {
            field: "specification",
            title: "客户公司名",
            sortable: true
          },
          {
            field: "quantity",
            title: "客户联系人",
            sortable: true
          },
          {
            field: "description",
            title: "联系电话",
            sortable: true
          },
          {
            field: "#",
            title: "操作",
            formatter: function(value, row, index) {
              let edit = `<button class="btn btn-success btn-sm">编辑</button>`,
                del = `<button class="btn btn-danger btn-sm">删除</button>`;
              return edit + del;
            },
            events: {

            }
          }
        ],
        data = {
          toolbar: "#report #toolbar",
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
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>序号</td>
                    <td>销售订单编号</td>
                    <td>产品SN码</td>
                    <td>料品编码</td>
                    <td>料品规格</td>
                    <td>料品名称</td>
                    <td>出货日期</td>
                    <td>是否过保</td>
                    <td>产品故障描述</td>
                    <td>图片</td>
                    <td>客服记录</td>
                  </tr>
            `;
            mrow.items = [{}]
            mrow.items.forEach((e, k) => {
              content += `
                <tr>
                  <td>${ k + 1 }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>
                    <img src="" />
                  </td>
                  <td>
                    <button class="btn btn-default btn-sm getRecord">查看记录</button>
                    <button class="btn btn-default btn-sm addRecord">添加记录</button>
                  </td>
                </tr>
              `;
            })
            content += `</tbody></table>`;
            return content;
          },
          onEditableSave(field, mrow, oldValue, $el) {}
        };
      $("#PR #table").bootstrapTable(data);
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less">
#PR {
}
</style>
