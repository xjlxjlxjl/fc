<template>
  <div id="overtime">
    <div id="mattersToolbar">
      <span class="lead">调休列表</span>
      <el-date-picker
        size="mini"
        v-model="date"
        type="daterange"
        value-format="yyyy-MM-dd HH:mm"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="refreshed"
      ></el-date-picker>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
export default {
  name: "overtime",
  data() {
    return {
      date: "",
      user: JSON.parse(localStorage.getItem("user") || "{}")
    };
  },
  components: {},
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`personnels/rest`, params.data)
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
      return {
        per_page: params.limit,
        page: params.offset / params.limit + 1,
        created_start_at: this.date[0],
        created_end_at: this.date[1]
      };
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "member_name",
            title: "申请人",
            sortable: true
          },
          {
            field: "is_annual",
            title: "是否年假",
            sortable: true,
            editable: {
              type: "select",
              source: [{ value: 1, text: "是" }, { value: 0, text: "否" }],
              title: "是否年假",
              emptytext: "空"
            }
          },
          {
            field: "vacation_detail",
            title: "调休详情",
            sortable: true
          },
          {
            field: "duration",
            title: "调休时长",
            sortable: true
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let del = [
                  `<button class="btn btn-danger btn-sm del">删除</button>`
                ],
                canApproval = false;
              row.rest.forEach(e => {
                if (
                  (this.user.user.id == e.member_id && e.receive) ||
                  (this.user.user.id == e.member_id && e.reject)
                )
                  canApproval = "exit";
                else if (
                  (this.user.user.id == e.member_id && !e.receive) ||
                  (this.user.user.id == e.member_id && !e.reject)
                )
                  canApproval = e.id;
              });
              let adopt = [
                  `<button appId="${canApproval}" class="btn btn-success btn-sm adopt">通过</button>`
                ],
                refuse = [
                  `<button appId="${canApproval}" class="btn btn-danger btn-sm refuse">拒绝</button>`
                ];
              if (canApproval == "exit") return;
              else if (canApproval) return adopt + refuse;
              return del;
            },
            events: {
              "click .adopt": function($el, value, row, index) {
                let id = $(this).attr("appId");
                that
                  .$prompt(`同意原因`, "")
                  .then(({ value }) => {
                    that
                      .$post(`personnels/approval`, {
                        receive: 1,
                        reason: value,
                        type: "rest",
                        id: id
                      })
                      .then(response => {
                        if (response.status != 200) return false;
                        that.refresh($("#mattersTable"));
                      })
                      .catch(err => console.error(err));
                  })
                  .catch(err => console.error(err));
              },
              "click .refuse": function($el, value, row, index) {
                let id = $(this).attr("appId");
                that
                  .$prompt(`拒绝原因`, "")
                  .then(({ value }) => {
                    that
                      .$post(`personnels/approval`, {
                        reject: 1,
                        reason: value,
                        type: "rest",
                        id: id
                      })
                      .then(response => {
                        if (response.status != 200) return false;
                        that.refresh($("#mattersTable"));
                      })
                      .catch(err => console.error(err));
                  })
                  .catch(err => console.error(err));
              },
              "click .del": ($el, value, row, index) => {
                that
                  .$get(`personnels/rest/delete`, { id: row.id })
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
          detailFormatter: (index, row, $el) => {},
          onEditableSave: (field, mrow, oldValue, $el) => {
            that.$post(`personnels/rest/edit`, {
              id: mrow.id,
              duration: mrow.duration,
              is_annual: mrow.is_annual
            });
          }
        };
      $("#mattersTable").bootstrapTable(data);
    },
    changeDate(item) {
      this.refreshed();
    },
    refreshed() {
      this.refresh($("#mattersTable"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#overtime {
}
</style>
