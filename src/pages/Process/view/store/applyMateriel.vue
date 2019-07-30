<template>
  <div id="applyMateriel">
    <addPrepare :receive_id.sync="receive_id" @refresh="refreshed"></addPrepare>
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
      receive_id: []
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
            field: "plan_number",
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
                let
                  active = new Map([
                    ['WI', () => 1],
                    ['PZ', () => 2],
                    ['TIL', () => 3],
                    ['WN', () => 4],
                    ['RT', () => 5],
                    ['ST', () => 6],
                    ['WL', () => 7],
                    ['SU', () => 8],
                    ['TL', () => 9]
                  ]),
                  materials = row.items.filter(e => e.spare_count).map(v => {
                    return {
                      material_id: v.material_id,
                      quantity: v.spare_count
                    }
                  });
                that
                  .$post(`repositories/storage_apply/create`, {
                    order_id: value,
                    from: active.get(row.numbering.removeNumber())(),
                    materials: materials
                  }).then(result => {
                    if (result.status != 200) return false;
                    that
                      .$post(`repositories/material/receive/notice/${value}`)
                      .then(response => {
                        if (response.status != 200) return false;
                        that.$message({ message: '通知领料成功', type: 'success' });
                      })
                      .catch(e => console.error(e));
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
              {
                content += `<tr>
                  <td>${k + 1}</td>
                  <td>${e.material_info.material_number || ''}</td>
                  <td>${e.material_info.material_specification || ''}</td>
                  <td>${e.material_info.name || ''}</td>
                  <td>${e.material_info.quantity || ''}</td>
                  <td>${e.material_info.length || ''}</td>
                  <td>`;
                  if(e.material_info.children)
                    e.material_info.children.forEach(e => (content += e.material_number));
                  content += `</td>
                  <td>${e.material_info.unit || ''}</td>
                  <td>
                    <div><input type="checkbox" ${ e.material_info.attributes ? e.material_info.attributes.includes('1') ? "checked='checked'" : '' : ''} disabled="true" /> 采购件</div>
                    <div><input type="checkbox" ${ e.material_info.attributes ? e.material_info.attributes.includes('2') ? "checked='checked'" : '' : ''} disabled="true" /> 自制件</div>
                    <div><input type="checkbox" ${ e.material_info.attributes ? e.material_info.attributes.includes('3') ? "checked='checked'" : '' : ''} disabled="true" /> 委外件</div>
                    <div><input type="checkbox" ${ e.material_info.attributes ? e.material_info.attributes.includes('4') ? "checked='checked'" : '' : ''} disabled="true" /> 销售件</div>
                  </td>
                  <td>${e.material_info.classification || ''}</td>
                  <td>${e.material_info.occupancy || ''}</td>
                  <td>${e.material_info.prepare_date || ''}</td>
                  <td>${e.material_info.available_quantity || '0'}</td>
                  <td>${e.material_info.take_up || '0'}</td>
                  <td>${e.material_info.way_quantity || '0'}</td>
                  <td>${e.material_info.end_period_quantity || '0'}</td>
                  <td>${e.cancel_count || "0"}</td>
                  <td>${e.wait_count || "0"}</td>
                  <td>${e.material_info.car_code || ""}</td>
                  <td>${e.spare_count || "0"}</td>
                  <td><button index="${field}" key="${k}" class="btn btn-sm prepare">备料</button></td>
                  <td>结案</td>
                </tr>`
              }
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
        data = that.getAllData($("#applyMateriel #table")),
        active = new Map([
          ['SU', () => data[self.attr('index')].items[self.attr('key')].material_info.respository_name = '领料仓'],
          ['WL', () => data[self.attr('index')].items[self.attr('key')].material_info.respository_name = '生产仓'],
        ]);
      active.get(data[self.attr('index')].numbering.removeNumber() || 'default').call(this);
      that.receive_id = [data[self.attr('index')].items[self.attr('key')]];
      $("#applyMateriel #addPrepare").modal("show");
    })
  }
};
</script>
<style>
#applyMateriel {
}
</style>