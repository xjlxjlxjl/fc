<template>
  <div id="overtime">
    <div id="mattersToolbar">
      <span class="lead">用户入职申请审核表</span>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
export default {
  name: "overtime",
  data() {
    return {};
  },
  components: {},
  methods: {
    tableAjaxData(params) {
      params.success({
        total: 10,
        rows: []
      });
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.current_page = params.limit;
      params.d = params.search;
      return params;
    },
    create() {
      addOvertime.methods.close.call(this);
    },
    refreshed() {
      this.refresh($("#mattersTable"));
    }
  },
  mounted() {
    let that = this;
    $("#mattersTable").bootstrapTable({
      toolbar: "#mattersToolbar",
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
      columns: [
        {
          checkbox: true
        },
        {
          field: "created_at",
          title: "申请时间（创建时间）",
          sortable: true
        },
        {
          field: "working_days_off",
          title: "是否调休",
          sortable: true,
          editable: {
            type: "select",
            source: [{ value: 1, text: "是" }, { value: 0, text: "否" }],
            title: "是否调休",
            emptytext: "空"
          }
        },
        {
          field: "slug",
          title: "操作",
          formatter: (value, row, index) => {
            let del = [];
            return del;
          },
          events: {
            "click .del": ($el, value, row, index) => {}
          }
        }
      ],
      detailFormatter: (index, row, $el) => {},
      onEditableSave: (field, mrow, oldValue, $el) => {}
    });
  },
  created() {}
};
</script>
<style lang="less">
#overtime {
}
</style>
