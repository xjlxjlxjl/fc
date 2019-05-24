<template>
  <div id="dailyHours">
    <adddailyHours :row="row" @refresh="refreshed"></adddailyHours>
    <div id="toolbar">
      <el-button size="mini" @click="row = [{}];add = !add;">新建工时分类</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import adddailyHours from "@/pages/Process/common/purchase/adddailyHours";
export default {
  name: "dailyHours",
  data() {
    return {
      row: [],
      add: false
    };
  },
  components: {
    adddailyHours: adddailyHours
  },
  methods: {
    tableAjaxData(params) {
      this.$get(`schedule/daily/hour`, params.data)
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
            field: "billing",
            title: "发单（H）",
            sortable: true
          },
          {
            field: "split",
            title: "拆分（H）",
            sortable: true
          },
          {
            field: "outside_preparation",
            title: "委外备料（H）",
            sortable: true
          },
          {
            field: "incoming_quality_inspection",
            title: "来料质检（H）",
            sortable: true
          },
          {
            field: "preparation",
            title: "备料（H）",
            sortable: true
          },
          {
            field: "assembly",
            title: "组装（H）"
          },
          {
            field: "finished_product_quality_inspection",
            title: "成品质检（H）",
            sortable: true
          },
          {
            field: "packaging",
            title: "打包（H）",
            sortable: true
          },
          {
            field: "storage",
            title: "入库（H）",
            sortable: true
          },
          {
            field: "shipping",
            title: "发货（H）",
            sortable: true
          },
          {
            field: "procurement",
            title: "总工时（H）",
            formatter(value, row, index) {
              return (row.billing || 0) + (row.split || 0) + (row.outside_preparation || 0) + (row.incoming_quality_inspection || 0) + (row.preparation || 0) + (row.assembly || 0) + (row.finished_product_quality_inspection || 0) + (row.packaging || 0) + (row.storage || 0) + (row.shipping || 0)
            }
          },
          {
            field: "created_by",
            title: "创建人",
            sortable: true
          },
          {
            field: "created_at",
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
                that.add = !that.add;
              },
              "click .del": function(e, value, row, index) {
                if (confirm("是否确定删除"))
                  that
                    .$get(`schedule/daily/hour/delete/${value}`)
                    .then(response => {
                      if (response.status != 200) return false;
                      that.delTable($("#dailyHours #table"), 'id', [value]);
                    })
                    .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#dailyHours #toolbar",
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
      $("#dailyHours #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#dailyHours #table"));
    }
  },
  watch: {
    add() {
      $("#dailyHours #adddailyHours").modal("toggle");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#dailyHours {
}
</style>
