<template>
  <div id="overtime">
    <div id="mattersToolbar">
      <span class="lead">请假记录</span>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
import { mapState } from "vuex";
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
            total: response.data.pagination.total,
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
              ];
              let destroy = [
                `<button class="btn btn-success btn-sm destroy">销假</button>`
              ];
              switch (row.vacation_leave_status) {
                case 0:
                  return destroy + del;
                  break;
                case 1:
                  return del;
                  break;
              }
            },
            events: {
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
      });
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
