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
      let that = this;
      that
        .$get(`personnels/apply/review`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            total: 10,
            rows: []
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      params.d = params.search;
      return params;
    },
    create() {
      addOvertime.methods.close.call(this);
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "company_slug",
            title: "公司唯一标识",
            sortable: true
          },
          {
            field: "company_name",
            title: "公司名",
            sortable: true
          },
          {
            field: "description",
            title: "公司描述",
            sortable: true
          }
          // {
          //   field: "slug",
          //   title: "操作",
          //   formatter: (value, row, index) => {
          //     let del = [];
          //     return del;
          //   },
          //   events: {
          //     "click .del": ($el, value, row, index) => {}
          //   }
          // }
        ],
        data = {
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
          columns: columns,
          detailFormatter: (index, row, $el) => {},
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };
      $("#mattersTable").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#mattersTable"));
    }
  },
  mounted() {
    this.init();
  },
  created() {}
};
</script>
<style lang="less">
#overtime {
}
</style>
