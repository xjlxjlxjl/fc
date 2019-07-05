<template>
  <div id="carManage">
    <addCar :row="active" @refresh="refreshed"></addCar>
    <materialJoin :id="cid" :arr="list" @refresh="refreshed"></materialJoin>
    <transfer :id="cid" :arr="arr" :data="list" @refresh="refreshed"></transfer>
    <div id="toolbar">
      <el-button size="mini" @click="addCarModal = !addCarModal">新建物料车</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import addCar from '@/pages/Process/common/store/addCar';
import materialJoin from '@/pages/Process/common/store/materialJoin';
import transfer from '@/pages/Process/common/store/transfer';

export default {
  name: "carManage",
  data() {
    return {
      addCarModal: false,
      active: {},
      cid: 0,
      list: [],
      arr: []
    };
  },
  components: {
    addCar: addCar,
    materialJoin: materialJoin,
    transfer: transfer
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
        page: params.offset / params.limit + 1,
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
            field: "qr_code_text",
            title: "二维码",
            formatter: function(value, row, index) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`carManage${row.id}`).innerHTML = string)), 500);
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
                add = `<button class="btn btn-sm btn-primary add" style="margin-left: 5px;">添加物料</button>`,
                del = `<button class="btn btn-sm btn-danger del" style="margin-left: 5px;">删除</button>`,
                edit = `<button class="btn btn-sm btn-success edit">编辑</button>`,
                clear = `<button class="btn btn-sm btn-warning clear" style="margin-left: 5px;">释放</button>`;
              return `<div style="display: flex;">${edit + del + add}</div>`;
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
              "click .add"(e, value, row, index) {
                that.cid = value;
                that.list = that.getAllData($("#carManage #table"));
                $("#carManage #materialJoin").modal("show");
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
          detailView: true,
          columns: columns,
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
                    <td>单位</td>
                    <td>料品类别</td>
                    <td>操作</td>
                  </tr>
            `;
            mrow.material.forEach((e, k) => {
              content += `
                <tr>
                  <td>${ k + 1 }</td>
                  <td>${e.material_number}</td>
                  <td>${e.material_specification}</td>
                  <td>${e.name}</td>
                  <td>${e.quantity}</td>
                  <td>${e.length}</td>
                  <td>${e.item_unit}</td>
                  <td>${e.category_name || ''}</td>
                  <td><button class="btn btn-info btn-sm transfer" cid="${ mrow.id }" key="${ field }" index="${ k }">转车</button></td>
                </tr>
              `;
            })
            content += `</tbody></table>`;
            return content;
          }
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
    let that = this;
    $(document).on("click", "#carManage .transfer", function() {
      let self = $(this),
        data = that.getAllData($("#carManage #table")),
        m = data[self.attr('key')].material[self.attr('index')];
      that.cid = parseInt(self.attr('cid'));
      that.list = data;
      that.arr = [
        {
          material: {
            material_id: m.id,
            material_number: m.material_number,
            material_specification: m.material_specification,
            name: m.name,
            quantity: m.quantity,
            length: m.length,
            item_unit: m.item_unit,
            category_name: m.category_name
          },
          to_car_id: '',
          car_name: '',
          join_num: ''
        }
      ];
      $("#carManage #transfer").modal("show")
    });
  }
};
</script>
<style>
#carManage {
}
</style>