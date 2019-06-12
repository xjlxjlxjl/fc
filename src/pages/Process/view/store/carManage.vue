<template>
  <div id="carManage">
    <addCar :row="active" @refresh="refreshed"></addCar>
    <div id="toolbar">
      <el-button size="mini" @click="addCarModal = !addCarModal">新建物料车</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import addCar from '@/pages/Process/common/store/addCar';

export default {
  name: "carManage",
  data() {
    return {
      addCarModal: false,
      active: {}
    };
  },
  components: {
    addCar: addCar
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`repositories/car`, params.data)
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
        page: params.offset / 10 + 1,
        per_page: params.limit,
        code: params.search
      };
    },
    init() {
      const that = this,
        columns = [
          {
            field: "code",
            title: "物料车编码"
          },
          {
            field: "qrCode",
            title: "二维码",
            formatter: function(value, row, index) {
              setTimeout(
                () =>
                  QRCode.toString(
                    `https://www.factoryun.com/procurement/out_picking_material/${row.outsourcing_number}`,
                    (err, string) =>
                      (document.getElementById(`carManage${row.id}`).innerHTML = string)
                  ),
                500
              );
              return `<div id="carManage${row.id}" class="img" style="max-width: 80px;max-height: 80px;margin: auto;"></div>`;
            },
          },
          {
            field: "creator",
            title: "创建人"
          },
          {
            field: "created_at",
            title: "创建日期"
          },
          {
            field: "remark",
            title: "备注"
          },
          {
            field: "is_use",
            title: "占用状态",
            formatter: function(value, row, index) {
              return value ? '是' : '否';
            }
          },
          {
            field: "is_enable",
            title: "是否启用",
            formatter: function(value, row, index) {
              return value ? '是' : '否';
            }
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let
                del = `<button class="btn btn-sm btn-danger del" style="margin-left: 5px;">删除</button>`,
                edit = `<button class="btn btn-sm btn-success edit">编辑</button>`,
                clear = `<button class="btn btn-sm btn-warning clear" style="margin-left: 5px;">释放</button>`;
              return edit + del + clear;
            },
            events: {
              "click .edit": function(e, value, row, index) {
                that.active = row;
                that.addCarModal = !that.addCarModal;
              },
              "click .del": function(e, value, row, index) {
                that
                  .$post(`repositories/car/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#carManage #table"), 'id', [value]);
                  })
                  .catch(e => console.error(e));
              },
              "click .clear"(e, value, row, index) {
                that
                  .$get(`repositories/car/release/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.$message({ message: '释放成功', type: "success" });
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
          // detailView: true,
          columns: columns,
          // detailFormatter(field, mrow, oldValue, $el) {},
          onEditableSave(field, mrow, oldValue, $el) {}
        };
      $("#carManage #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#carManage #table"));
    }
  },
  watch: {
    addCarModal(val) {
      $("#carManage #addCar").modal("toggle");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
#carManage {
}
</style>