<template>
  <div id="storage">
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  name: "storage",
  data() {
    return {};
  },
  components: {},
  methods: {
    tableAjaxData(params) {
      this
        .$get(`repositories/storage_apply/index`, params.data)
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
        name: params.search
      };
    },
    init() {
      let
        that = this,
        columns = [
          {
            field: "#",
            title: "序号",
            formatter(value, row, index, $el) {
              return index + 1;
            }
          },
          {
            field: "qr_code_text",
            title: "二维码",
            formatter(value, row, index, $el) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`storageQrcode${row.id}`).innerHTML = string)), 500);
              return `<div id="storageQrcode${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            }
          },
          {
            field: "numbering",
            title: "入库申请",
          },
          {
            field: "creator",
            title: "申请人"
          },
          {
            field: "created_at",
            title: "申请日期"
          },
          {
            field: "from_text",
            title: "入库来源"
          },
          {
            field: "order_no",
            title: "关联单号"
          },
          {
            field: "check_status",
            title: "审核状态"
          },
          {
            field: "id",
            title: "操作",
            formatter(value, row, index, $el) {
              let pass = `<button class="btn btn-sm btn-primary">审核通过</button>`,
                fail = `<button class="btn btn-sm btn-danger" style="margin-left: 5px;">审核失败</>`;
              return `<div style="display: flex;">${ pass + fail }</div>`;
            }
          },
        ],
        data = {
          toolbar: "#storage #toolbar",
          ajax: that.tableAjaxData,
          queryParams: that.tableAjaxParams,
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
          pageList: ["All", 5, 10, 25, 50, 100],
          detailView: true,
          columns: columns,
          onEditableSave(field, mrow, oldValue, $el) {},
          detailFormatter(field, mrow, oldValue, $el) {
            let content = `
              <table class="table table-bordered">
                <tr>
                  <th>序号</th>
                  <th>料品编码</th>
                  <th>料品规格</th>
                  <th>料品名称</th>
                  <th>数量</th>
                  <th>长度</th>
                  <th>单位</th>
                  <th>料品类别</th>
                  <th>智能占用</th>
                  <th>已领数量</th>
                  <th>待领数量</th>
                  <th>物料车编号</th>
                  <th>备料数量</th>
                </tr>
                <tr>
                  <td>1</td>
                  <td>D0001</td>
                  <td>DZ100-100</td>
                  <td>动子</td>
                  <td>1</td>
                  <td>20m</td>
                  <td>PCS</td>
                  <td>原材料</td>
                  <td><button class="btn btn-default">查看智能占用</button></td>
                  <td>0</td>
                  <td>1</td>
                  <td>A001</td>
                  <td>1</td>
                </tr>
              </table>
            `;
            return content;
          }
        };
      $("#storage #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#storage #table"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#storage {
}
</style>
