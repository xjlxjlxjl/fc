<template>
  <div id="overtime">
    <div id="mattersToolbar">
      <span class="lead">请假记录</span>
      <el-date-picker
        v-model="date"
        type="daterange"
        value-format="yyyy-MM-dd"
        size="mini"
        @change="refreshed">
      </el-date-picker>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "overtime",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      date: []
    };
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
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        current_page: params.limit,
        member_name: params.search,
        created_start_at: this.date[0],
        created_end_at: this.date[1]
      };
    },
    create() {
      addOvertime.methods.close.call(this);
    },
    refreshed() {
      this.refresh($("#mattersTable"));
    },
    Init() {
      let loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        }),
        clock = setInterval(() => {
          if (this.leaveType.arr.length) {
            this.tableInit();
            loading.close();
            clearInterval(clock);
          }
        }, 1000);
    },
    tableInit() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "full_name",
            title: "操作者",
            sortable: true
          },
          {
            field: "type.id",
            title: "假期类型",
            sortable: true,
            editable: {
              type: "select",
              source: that.leaveType.arr,
              title: "假期类型",
              emptytext: "空"
            }
          },
          {
            field: "start_at",
            title: "开始时间",
            sortable: true,
            editable: {
              type: "text",
              title: "开始时间",
              emptytext: "空"
            }
          },
          {
            field: "end_at",
            title: "结束时间",
            sortable: true,
            editable: {
              type: "text",
              title: "结束时间",
              emptytext: "空"
            }
          },
          {
            field: "total_time",
            title: "总时间",
            sortable: true,
            editable: {
              type: "text",
              title: "总时间",
              emptytext: "空"
            }
          },
          {
            field: "total_cost",
            title: "总成本",
            sortable: true,
            editable: {
              type: "text",
              title: "总成本",
              emptytext: "空"
            }
          },
          {
            field: "work_transfer",
            title: "交接人",
            sortable: true,
            editable: {
              type: "text",
              title: "交接人",
              emptytext: "空"
            }
          },
          {
            field: "working_address",
            title: "工作地址",
            sortable: true,
            editable: {
              type: "text",
              title: "工作地址",
              emptytext: "空"
            }
          },
          {
            field: "details",
            title: "详情",
            sortable: true,
            editable: {
              type: "text",
              title: "详情",
              emptytext: "空"
            }
          },
          {
            field: "created_at",
            title: "创建于",
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
            field: "vacation_leave_status",
            title: "销假状态",
            sortable: true,
            formatter: (value, row, index) => {
              return `${value ? "已销假" : "未销假"}`;
            }
          },
          {
            field: "vacations",
            title: "审批人",
            sortable: true,
            formatter: (value, row, index) => {
              let html = [];
              value.forEach(e => html.push(e.name));
              return html.join(",");
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let del = [
                  `<button class="btn btn-danger btn-sm del">删除</button>`
                ],
                destroy = [
                  `<button class="btn btn-success btn-sm destroy">销假</button>`
                ],
                canApproval = false;
              row.vacations.forEach(e => {
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
              else {
                switch (row.vacation_leave_status) {
                  case 0:
                    return destroy + del;
                    break;
                  case 1:
                    return del;
                    break;
                }
              }
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
                        type: "vacations",
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
                        type: "vacations",
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
                  .$post(`personnels/vacations/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#mattersTable"), "id", [row.id]);
                  })
                  .catch(err => {});
              },
              "click .destroy": ($el, value, row, index) => {
                that
                  .$post(`personnels/vacation/vacation_leave`, {
                    slug: value,
                    vacation_leave_at: that.miniDateParse(new Date())
                  })
                  .then(response => {
                    if (response.status != 200) return false;
                    row.vacation_leave_status = 1;
                    that.ediTable($("#mattersTable"), index, row);
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
            let html = [
              `<table class="table">
            <tr><th>审批人</th><th>审批状态</th><th>审批时间</th></tr>`
            ];
            row.vacations.forEach(e =>
              html.push(
                `<tr><td>${e.name}</td><td>${
                  e.receive ? "接受" : e.reject ? "拒绝" : "等待"
                }</td><td>${e.created_at}</td></tr>`
              )
            );
            html.push(`</table>`);
            return html.join("");
          },
          onEditableSave: (field, mrow, oldValue, $el) => {
            mrow.start_at = that.miniDateParse(new Date(mrow.start_at));
            mrow.end_at = that.miniDateParse(new Date(mrow.end_at));
            let str = "";
            that.leaveType.obj.forEach(e => {
              if (e.key.id == mrow["type.id"]) str = JSON.stringify(e.key);
            });
            that
              .$post(`personnels/vacations/edit/${mrow.slug}`, {
                start_at: mrow.start_at,
                end_at: mrow.end_at,
                working_days_off: mrow.working_days_off,
                details: mrow.details,
                work_transfer: mrow.work_transfer,
                total_time: mrow.total_time,
                type: str,
                working_address: mrow.working_address,
                total_cost: mrow.total_cost
              })
              .then(response => {
                if (response.status != 200) return false;
              })
              .catch(err => {});
          }
        };
      $("#mattersTable").bootstrapTable(data);
    }
  },
  computed: mapState({
    leaveType: state => {
      let obj = {
        arr: [],
        obj: []
      };
      state.leaveType.forEach(e => {
        obj.arr.push({ value: e.key.id, text: e.value });
        obj.obj.push(e);
      });
      return obj;
    }
  }),
  mounted() {
    this.Init();
  }
};
</script>
<style lang="less">
#overtime {
}
</style>
