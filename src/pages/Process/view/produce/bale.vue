<template>
  <div id="bale">
    <baleRecord :id="id"></baleRecord>
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import baleRecord from '@/pages/Process/common/produce/baleRecord';

export default {
  name: "bale",
  data() {
    return {
      id: 0
    };
  },
  components: {
    baleRecord: baleRecord
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`produces/bale`, params.data)
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
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        bale_number: params.search
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qr_code_text",
            title: "二维码",
            formatter(value, row) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`bale${row.id}`).innerHTML = string)), 500);
              return `<div id="bale${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            }
          },
          {
            field: "bale_number",
            title: "打包单号"
          },
          {
            field: "created_member.last_name",
            title: "创建人"
          },
          {
            field: "created_at",
            title: "创建日期"
          },
          {
            field: "prompt_bale_at",
            title: "智能提示打包日期"
          },
          {
            field: "order.numbering",
            title: "订单号"
          },
          {
            field: "schedule.sn_code",
            title: "SN码"
          },
          {
            field: "material.material_number",
            title: "料品编码"
          },
          {
            field: "material.material_specification",
            title: "料品规格"
          },
          {
            field: "material.name",
            title: "料品名称"
          },
          {
            field: "quality_inspector",
            title: "质检员",
            formatter(value) {
              return value.map(e => e.last_name).join(',');
            }
          },
          {
            field: "status",
            title: "入库申请",
            formatter(value) {
              return value ? '已入库' : '未入库';
            }
          },
          {
            field: "id",
            title: "操作",
            formatter(value, row, index) {
              let record = `<button class="btn btn-success btn-sm record">打包记录</button>`,
                join = `<button class="btn btn-primary btn-sm join">生产入库</button>`;
                return record + join;
            },
            events: {
              "click .record"($el, value, row, index) {
                that.id = value;
                $("#bale #baleRecord").modal("show");
              },
              "click .join"($el, value, row, index) {
                that
                  .$post(`produces/apply/storage`, { id: value })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.$message({ message: "入库成功", type: "success" });
                  })
                  .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#bale #toolbar",
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
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>序号</td>
                    <td>打包人</td>
                    <td>打包日期</td>
                    <td>图片记录</td>
                    <td>备注</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>${ mrow.bale_user.last_name }</td>
                    <td>${ mrow.bale_at }</td>
                    <td>`;
                  for (const e of mrow.images)
                    content += `<a href="${ e.url }" target="__blank"><img src="${ e.url }" style="max-height: 50px;max-width: 50px;"></a>`
                  content += `</td>
                    <td>${ mrow.remark || '' }</td>
                  </tr>
                </tbody>
              </table>
            `;

            return content;
          }
        };
      $("#bale #table").bootstrapTable(data);
    },
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less">
#bale {}
</style>
