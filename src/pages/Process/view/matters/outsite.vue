<template>
  <div id="overtime">
    <div id="mattersToolbar">
      <span class="lead">出差申请表</span>
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
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get(`personnels/evections`, params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => loading.close());
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
          field: "full_name",
          title: "申请人",
          sortable: true
        },
        {
          field: "created_at",
          title: "申请时间（创建时间）",
          sortable: true
        },
        {
          field: "branch",
          title: "所在部门",
          sortable: true
        },
        {
          field: "position",
          title: "岗位",
          sortable: true
        },
        {
          field: "customer",
          title: "客户",
          sortable: true,
          editable: {
            type: "text",
            title: "客户",
            emptytext: "空"
          }
        },
        {
          field: "address",
          title: "地址",
          sortable: true,
          editable: {
            type: "text",
            title: "地址",
            emptytext: "空"
          }
        },
        {
          field: "transportation",
          title: "交通方式",
          sortable: true,
          editable: {
            type: "text",
            title: "交通方式",
            emptytext: "空"
          }
        },
        {
          field: "total_time",
          title: "出差時长",
          sortable: true,
          editable: {
            type: "text",
            title: "出差時长",
            emptytext: "空"
          }
        },
        {
          field: "grants",
          title: "有无补助",
          sortable: true,
          editable: {
            type: "select",
            source: [{ value: 1, text: "有" }, { value: 0, text: "无" }],
            title: "有无补助",
            emptytext: "空"
          }
        },
        {
          field: "details",
          title: "出差说明（详情）",
          sortable: true,
          editable: {
            type: "text",
            title: "出差说明（详情）",
            emptytext: "空"
          }
        },
        {
          field: "evections",
          title: "出差审批",
          sortable: true,
          formatter: (value, row, index) => {
            let str = [];
            value.forEach(e => str.push(e.name));
            return str.join(",");
          }
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
                .$post(`personnels/evections/delete/${value}`)
                .then(response => {
                  if (response.status != 200) return false;
                  that.delTable($("#mattersTable"), "id", [row.id]);
                })
                .catch(err => {});
            }
          }
        }
      ],
      detailFormatter: (index, row, $el) => {
        let content = [`<table class="table">`];
        content.push(
          `<tr><th>审批人</th><th>审批状态</th><th>审批时间</th></tr>`
        );
        row.evections.forEach(e =>
          content.push(
            `<tr><td>${e.name}</td><td>${
              e.status == "success"
                ? "同意"
                : e.status == "fail"
                ? "拒绝"
                : "等待审核"
            }</td><td>${e.created_at}</td></tr>`
          )
        );
        content.push(`</table>`);
        return content.join("");
      },
      onEditableSave: (field, mrow, oldValue, $el) => {
        mrow.start_at = that.miniDateParse(new Date(mrow.start_at));
        mrow.end_at = that.miniDateParse(new Date(mrow.end_at));
        that
          .$post(`personnels/evections/edit/${mrow.slug}`, mrow)
          .then(response => {
            if (response.status != 200);
          })
          .catch(err => {});
      }
    });
  },
  created() {}
};
</script>
<style lang="less">
#overtime {
}
</style>
