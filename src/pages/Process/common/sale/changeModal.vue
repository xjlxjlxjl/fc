<template>
  <div class="modal fade" id="changeModal" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div id="changModalbar"></div>
          <table id="changModalTable"></table>
        </div>
        <div class="modal-footer">
          <el-button size="mini" @click="onSubmit">确定</el-button>
          <el-button size="mini" data-dismiss="modal">取消</el-button>          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    onSubmit() {
      if(!this.getData($("#changeModal #changModalTable")).length) {
        this.$message({ message: '请选择模板', type: 'error' });
        return false;
      }
      this.$emit('changModal', this.getData($("#changeModal #changModalTable")))
    },
    init() {
      const 
        that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "name",
            title: "非标询价模板名称"
          },
          {
            field: "created_by",
            title: "创建人",
          },
          {
            field: "created_at",
            title: "创建日期",
          }
        ],
        data = {
          toolbar: "#changModalbar",
          ajax(params) {
            that
              .$get(`orders/inquiry-template`, params.data)
              .then(response => {
                if (response.status != 200) return false;
                params.success({
                  rows: response.data.list,
                  total: response.data.pagination.total
                })
              })
              .catch(e => console.error(e));
          },
          queryParams(params) {
            return {
              page: params.offset / params.limit + 1,
              per_page: params.limit,
              name: params.search || undefined
            };
          },
          search: true,
          strictSearch: true,
          showRefresh: true,
          sidePagination: "server",
          pagination: true,
          striped: true,
          singleSelect: true,
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
          detailView: false,
          detailFormatter(field, mrow, oldValue, $el) {}
        };
      $("#changeModal #changModalTable").bootstrapTable(data);
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less">
#changeModal {}
</style>