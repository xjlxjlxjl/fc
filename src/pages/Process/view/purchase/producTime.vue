<template>
  <div id="producTime">
    <addProducTime :row="row" @refresh="refreshed"></addProducTime>
    <div id="toolbar">
      <el-button size="mini" @click="row = [{}];add = !add;">新建工时分类</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addProducTime from '@/pages/Process/common/purchase/addProducTime'
export default {
  name: "producTime",
  data() {
    return {
      row: [],
      add: false
    };
  },
  components: {
    addProducTime: addProducTime
  },
  methods: {
    tableAjaxData(params) {
      params.success({
        rows: [{ id: 1 }],
        total: 1
      });
      return false
      this
        .$get(``, params.data)
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
        grade: 1
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "#",
            title: "序号",
            formatter: function(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "number",
            title: "工时分类名称",
            sortable: true
          },
          {
            field: "created_at",
            title: "发单（H）",
            sortable: true
          },
          {
            field: "created_by",
            title: "拆分（H）",
            sortable: true
          },
          {
            field: "temp_storage",
            title: "委外备料（H）",
            sortable: true
          },
          {
            field: "temp_storage",
            title: "来料质检（H）",
            sortable: true
          },
          {
            field: "procurement",
            title: "备料（H）",
            sortable: true
          },
          {
            field: "temp_storage",
            title: "组装（H）"
          },
          {
            field: "procurement",
            title: "成品质检（H）",
            sortable: true
          },
          {
            field: "procurement",
            title: "打包（H）",
            sortable: true
          },
          {
            field: "procurement",
            title: "入库（H）",
            sortable: true
          },
          {
            field: "procurement",
            title: "发货（H）",
            sortable: true
          },
          {
            field: "procurement",
            title: "总工时（H）",
            sortable: true
          },
          {
            field: "procurement",
            title: "创建人",
            sortable: true
          },
          {
            field: "procurement",
            title: "创建日期",
            sortable: true
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let edit = `<button class="btn btn-sm btn-success edit">编辑</button>`,
                del = `<button class="btn btn-sm btn-danger del">删除</button>`;
              return edit + del;
            },
            events: {
              "click .edit": function(e, value, row, index) {
                that.row = [row];
                that.add = !that.add
              },
              "click .del": function(e, value, row, index) {
                if (confirm('是否确定删除'))
                  that
                    .$get(`icm_qty_ctrl/quality/delete/${value}`)
                    .then(response => {
                      if (response.status != 200) return false;
                    })
                    .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#producTime #toolbar",
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
          detailView: false,
          columns: columns,
          detailFormatter(field, mrow, oldValue, $el) {}
        };
      $("#producTime #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#producTime #table"));
    }
  },
  watch: {
    add() {
      $("#producTime #addProducTime").modal("toggle");
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less">
#producTime {
  
}
</style>
