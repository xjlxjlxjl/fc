<template>
  <div id="product">
    <getMaterialPic :pic="pic"></getMaterialPic>
    <getBOM :arr="arr"></getBOM>
    <getSOP :arr="sop"></getSOP>
    <seTurn :arr.sync="turn" :member="members_data" @refresh="refreshed"></seTurn>
    <badProduce :id="id" :arr.sync="arr"></badProduce>
    <designate type="self_check_manage" @user="user"></designate>
    <div id="toolbar">
      <el-select v-model="status" size="mini" @change="refreshed">
        <el-option label="生产中" :value="0"></el-option>
        <el-option label="生产结束" :value="1"></el-option>
        <el-option label="全部" :value="undefined"></el-option>
      </el-select>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import getMaterialPic from '@/pages/Process/common/engineer/getMaterialPic';
import getBOM from '@/pages/Process/common/produce/getBOM';
import getSOP from '@/pages/Process/common/produce/getSOPData';
import seTurn from '@/pages/Process/common/produce/seTurn';
import badProduce from '@/pages/Process/common/produce/badProduce';
import designate from '@/pages/Process/common/store/designate';

export default {
  name: "product",
  data() {
    return {
      id: 0,
      arr: [],
      sop: {},
      turn: [],
      members_data: [],
      pic: {
        drawing_working: [],
        assembly_drawing: [],
        drawing_approve: [],
        drawing_2d: [],
        drawing_3d: [],
        drawing_pdf: []
      },
      status: 0
    };
  },
  components: {
    getMaterialPic: getMaterialPic,
    getBOM: getBOM,
    getSOP: getSOP,
    seTurn: seTurn,
    badProduce: badProduce,
    designate: designate
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`produces/show`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          this.priority = response.data.pagination.from;
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
        order_number: params.search || undefined,
        status: this.status
      };
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "priority",
            title: "排单顺序",
            formatter(value, row, index) {
              return index + that.priority;
            }
          },
          {
            field: "order_number",
            title: "订单号"
          },
          {
            field: "created_member.last_name",
            title: "排单人"
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
            field: "schedule.numbering",
            title: "SN码"
          },
          {
            field: "prompt_at",
            title: "智能提示生产日期"
          },
          {
            field: "delivery_period_at",
            title: "出货计划交期"
          },
          {
            field: "bom",
            title: "BOM",
            formatter(value, row, index) {
              const btn = `<button class="btn btn-sm btn-link">BOM(查看)</button>`;
              return btn;
            },
            events: {
              "click .btn"($el, value, row, index) {
                console.log(row.bom_item)
                that.arr = row.bom_item.map(e => {
                  return {
                    material_number: e.material_number,
                    material_specification: e.material_specification,
                    material_name: e.material_name,
                    quantity: e.quantity,
                    length: e.length,
                    unit: e.unit,
                    material_category: e.material_category,
                    bom_attributes_name: e.material_attributes
                  }
                });
                $("#product #getBOM").modal("show");
              }
            }
          },
          {
            field: "material",
            title: "图纸",
            formatter(value) {
              let see = '<button class="btn btn-sm btn-info see">查看</button>';
              return see;
            },
            events: {
              "click .see"($el, value, row, index) {
                that.pic = {
                  drawing_working: row.material.drawing_working || [],
                  assembly_drawing: row.material.assembly_drawing || [],
                  drawing_approve: row.material.drawing_approve || [],
                  drawing_2d: row.material.drawing_2d || [],
                  drawing_3d: row.material.drawing_3d || [],
                  drawing_pdf: row.material.drawing_pdf || []
                };
                $("#product #getMaterialPic").modal("show");
              }
            }
          },
          {
            field: "status",
            title: "生产状态",
            formatter(value) {
              return value ? '生产结束' : '生产中';
            }
          },
          {
            field: "members_data",
            title: "生产组员",
            formatter(value) {
              let arr = [];
              for (const e of value) arr.push(e.last_name);
              return arr.join(',');
            }
          },
          {
            field: "sop_data.name",
            title: "SOP",
            formatter(value) {
              const btn = `<button class="btn btn-sm btn-link">${value}</button>`;
              return btn;
            },
            events: {
              "click .btn"($el, value, row, index) {
                that.sop = row.sop_data;
                $("#product #getSopData").modal("show");
              }
            }
          },
          {
            field: "procedure",
            title: "生产工序",
            formatter(value) {
              let edit = '<button class="btn btn-sm btn-info edit">编辑</button>';
              return edit;
            },
            events: {
              "click .edit"($el, value, row, index) {
                that.turn = value;
                that.members_data = row.members_data;
                $("#product #seTurn").modal("show");
              }
            }
          },
          {
            field: "id",
            title: "操作",
            formatter(value, row, index) {
              let check = `<button class="btn btn-primary btn-sm check">生产送检</button>`,
                process = `<button class="btn btn-info btn-sm process">生产工序</button>`,
                unhealthy = `<button class="btn btn-danger btn-sm unhealthy">生产不良</button>`;
                return check + unhealthy;
            },
            events: {
              "click .process"($el, value, row, index) {},
              "click .check"($el, value, row, index) {
                that.id = value;
                $('#product #designate').modal("show");
              },
              "click .unhealthy"($el, value, row, index) {
                that.id = value;
                that.arr = row.produces_bad || [];
                $("#product #badProduce").modal("show");
              },
            }
          }
        ],
        data = {
          toolbar: "#product #toolbar",
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
          detailFormatter(field, mrow, oldValue, $el) {}
        };
      $("#product #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#product #table"));
    },
    user(ids) {
      this
        .$get(`quality/produces/create`, { show_id: this.id, supervisor: ids.join(',') })
        .then(response => {
          if (response.status != 200) return false;
          $('#product #designate').modal("hide");
          this.$message({ message: '通知成功', type: 'success' });
        })
        .catch(e => console.error(e));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#product {
}
</style>
