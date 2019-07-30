<template>
  <div id="recall">
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
export default {
  name: "recall",
  data() {
    return {};
  },
  components: {},
  methods: {
    tableAjaxData(params) {
      this
        .$get(`respositories/list`, params.data)
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
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`recallQrcode${row.id}`).innerHTML = string)), 500);
              return `<div id="recallQrcode${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            }
          },
          {
            field: "parentname",
            title: "退货申请单号",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "申请人",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "申请日期",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "出货申请单号",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "关联销售单号",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "客户公司名",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "客户联系人",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "联系人手机",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "退货地址",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "邮政编码",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "退货方式",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "包装方式",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "快递/物流运费",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "备注",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "审核人",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "审核日期",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
          },
          {
            field: "parentname",
            title: "审核状态",
            formatter(value, row, index, $el) {
              return `${value || "无"}`;
            }
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
          toolbar: "#recall #toolbar",
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
                  <th></th>
                  <th>序号</th>
                  <th>料品编码</th>
                  <th>料品名称</th>
                  <th>料品规格</th>
                  <th>单位</th>
                  <th>仓库</th>
                  <th>退货数量</th>
                </tr>
                <tr>
                  <td><input type="checkbox"></td>
                  <td>1</td>
                  <td>111111111</td>
                  <td>直线电机模组</td>
                  <td>LK100-100-100</td>
                  <td>PCS</td>
                  <td>成品仓</td>
                  <td>1</td>
                </tr>
              </table>
            `;
            return content;
          }
        };
      $("#recall #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#recall #table"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#recall {
}
</style>
