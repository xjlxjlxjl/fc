<template>
  <div id="overtime">
    <div id="mattersToolbar">
      <span class="lead">请假记录</span>
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
      let that = this;
      that
        .$get(`personnels/vacations`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            total: pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => {});
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
          title: "操作者",
          sortable: true
        },
        {
          field: "created_at",
          title: "开始时间",
          sortable: true
        },
        {
          field: "created_at",
          title: "结束时间",
          sortable: true
        },
        {
          field: "created_at",
          title: "总时间",
          sortable: true
        },
        {
          field: "created_at",
          title: "总成本",
          sortable: true
        },
        {
          field: "created_at",
          title: "详情",
          sortable: true
        },
        {
          field: "created_at",
          title: "创建于",
          sortable: true
        },
        {
          field: "created_at",
          title: "打卡记录",
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
          field: "created_at",
          title: "审批人",
          sortable: true
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
