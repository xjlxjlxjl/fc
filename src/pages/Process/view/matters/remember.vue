<template>
  <div id="overtime">
    <div id="mattersToolbar">
      <span class="lead">备忘录列表</span>
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
        .$get(`personnels/memos`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
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
    init() {
      let that = this,
        columns = [
          {
            field: "created_at",
            title: "创建时间",
            sortable: true
          },
          {
            field: "note",
            title: "备忘录内容",
            sortable: true
            // editable: {
            //   type: "text",
            //   title: "备忘录内容",
            //   emptytext: "空"
            // }
          },
          {
            field: "full_name",
            title: "创建者",
            sortable: true
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let del = [
                `<button class="btn btn-danger btn-sm del">删除</button>`
              ];
              return del;
            },
            events: {
              "click .del": ($el, value, row, index) => {
                that
                  .$get(`personnels/memos/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#mattersTable"), "id", [row.id]);
                  })
                  .catch(err => {});
              }
            }
          }
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
          detailFormatter: (index, row, $el) => {
            let content = [`<p class="lead">备忘录上传文件</p>`];
            content.push(`<table class="table table-bordered"><tr>`);
            row.files.forEach(e =>
              content.push(`<td><a href="${e}">${e.split("/").pop()}</a></td>`)
            );
            content.push(`</tr></table>`);
            return content.join("");
          },
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
