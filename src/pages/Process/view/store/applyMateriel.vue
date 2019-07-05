<template>
  <div id="applyMateriel">
    <addPrepare :receive_id="receive_id" @refresh="refreshed"></addPrepare>
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import addPrepare from '@/pages/Process/common/store/addPrepare';

export default {
  name: "applyMateriel",
  data() {
    return {
      receive_id: 0
    };
  },
  components: {
    addPrepare: addPrepare
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`repositories/material/receive`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(e => console.error(e));
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit
      };
    },
    init() {
      const that = this,
        columns = [
          {
            field: "#",
            title: "序号",
            formatter(value, row, index) {
              return index + 1
            }
          },
          {
            field: "qr_code_text",
            title: "二维码",
            formatter(value, row, index) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`applyMateriel${row.id}`).innerHTML = string)), 500);
              return `<div id="applyMateriel${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            }
          },
          {
            field: "numbering",
            title: "领料单号",
          },
          {
            field: "creator",
            title: "创建人",
          },
          {
            field: "created_at",
            title: "领料数量(日期)",
          },
          {
            field: "order_no",
            title: "关联销售订单号",
          },
          {
            field: "aaa",
            title: "关联生产计划单",
          },
          {
            field: "id",
            title: "操作",
            formatter(value, row, index) {
              let notify = `<button class="btn btn-primary btn-sm notify">通知领料</button>`;
              return notify;
            },
            events: {
              "click .notify"($el, value, row, index) {
                that
                  .$post(`/repositories/material/receive/notice/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.$message({ message: '通知领料成功', type: 'success' });
                  })
                  .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#toolbar",
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
            let content = `<table class="table table-bordered" style="white-space: nowrap;"><tbody>
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
                  <td>可用数量</td>
                  <td>占用数量</td>
                  <td>采购在途数</td>
                  <td>期末数量</td>
                  <td>已领数量</td>
                  <td>待领数量</td>
                  <td>物料车编号</td>
                  <td>备料数量</td>
                  <td>备料</td>
                  <td>结案</td>
                </tr>`;
            mrow.items.forEach((e, k) => 
              (content += `<tr>
                  <td>${k + 1}</td>
                  <td>${e.material_info.material_number}</td>
                  <td>${e.material_info.material_specification}</td>
                  <td>${e.material_info.name}</td>
                  <td>${e.material_info.quantity}</td>
                  <td>${e.material_info.len}</td>
                  <td>关联子料</td>
                  <td>${e.material_info.unit}</td>
                  <td>料品类别</td>
                  <td>料品属性</td>
                  <td>智能占用</td>
                  <td>智能备料日期</td>
                  <td>可用数量</td>
                  <td>占用数量</td>
                  <td>采购在途数</td>
                  <td>期末数量</td>
                  <td>${e.cancel_count}</td>
                  <td>${e.wait_count}</td>
                  <td>物料车编号</td>
                  <td>${e.spare_count}</td>
                  <td><button index="${field}" key="${k}" class="btn btn-sm prepare">备料</button></td>
                  <td>结案</td>
                </tr>`)
            );
            content += `</tbody></table>`;
            return content;
          }
        };
      $("#applyMateriel #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#applyMateriel #table"));
    }
  },
  mounted() {
    this.init();
    let that = this;
    $("#applyMateriel").on("click", ".prepare", function(e) {
      const self = $(this),
        data = that.getAllData($("#applyMateriel #table"));
      that.receive_id = data[self.attr('index')].items[self.attr('key')].receive_id;
      $("#applyMateriel #addPrepare").modal("show");
    })
  }
};
</script>
<style>
#applyMateriel {
}
</style>