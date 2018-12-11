<template>
  <div id="tasks">
    <dateTimePick title="选择任务完成时间" @refresh="refresh" :activeId="activeId"></dateTimePick>
    <div id="toolbar">
      <span class="lead">未完成任务</span>
    </div>
    <table id="table"></table>

    <div id="prodbar">
      <span class="lead">生产看板</span>
    </div>
    <table id="prodtable"></table>

    <div id="clientbar">
      <span class="lead">客户管理看板</span>
    </div>
    <table id="clientable"></table>
  </div>
</template>
<script>
import dateTimePick from "@/pages/Process/common/dateTimePick";
export default {
  name: "tasks",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      activeId: 0
    };
  },
  components: {
    dateTimePick: dateTimePick
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("job/list")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          params.success({
            total: response.data.list.length,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      params.current_page = params.offset + 1;
      return params;
    },
    refresh() {
      this.refresh($("#table"));
    }
  },
  mounted() {
    let that = this;
    $("#table").bootstrapTable({
      toolbar: "#toolbar",
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
      columns: [
        {
          checkbox: true
        },
        {
          field: "work_no",
          title: "任务编号",
          sortable: true
        },
        {
          field: "creator",
          title: "创建人",
          sortable: true
        },
        {
          field: "created_at",
          title: "创建日期"
        },
        {
          field: "end_time",
          title: "截止日期"
        },
        {
          field: "content",
          title: "工作内容"
        },
        {
          field: "members",
          title: "工作成员",
          formatter: event => {
            let html = "";
            event.forEach(e => {
              html += `<p>姓名：${e.user.display_name}　进度：${
                e.status_text
              }</p>`;
            });
            return html;
          }
        },
        {
          field: "status_text",
          title: "任务状态"
        },
        {
          field: "status_text",
          title: "奖惩情况"
        },
        {
          field: "#",
          title: "操作",
          formatter: (value, row, index) => {
            let accept = [
                '<button class="btn btn-info accept">接受</button>'
              ].join(""),
              complete = [
                '<button class="btn btn-success complete">完成</button>'
              ].join(""),
              invalid = [
                '<button class="btn btn-danger invalid">作废</button>'
              ].join(""),
              taskState = 0;
            row.members.forEach(e => {
              if (e.user.id == this.user.user.id) taskState = e.status;
            });
            if (row.created_by_id == this.user.user.id) return invalid;
            else if (taskState == 1) return complete;
            else if (taskState == 0) return accept;
          },
          events: {
            "click .accept": (e, value, row, index) => {
              this.activeId = row.id;
              dateTimePick.methods.close.call(this);
            },
            "click .complete": (e, value, row, index) => {
              this.$post(`job/complete/${row.id}`)
                .then(response => {
                  if (response.status != 200) return false;
                  $("#table").bootstrapTable("refresh");
                })
                .catch(err => console.error(err));
            },
            "click .invalid": (e, value, row, index) => {
              this.$post(`job/invalid/${row.id}`)
                .then(response => {
                  if (response.status != 200) return false;
                  $("#table").bootstrapTable("refresh");
                })
                .catch(err => console.error(err));
            }
          }
        }
      ],
      onEditableSave: (field, mrow, oldValue, $el) => {}
    });

    $("#prodtable").bootstrapTable({
      toolbar: "#prodbar",
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
      columns: [
        {
          checkbox: true
        },
        {
          field: "work_no",
          title: "任务编号",
          sortable: true
        },
        {
          field: "creator",
          title: "创建人",
          sortable: true
        },
        {
          field: "created_at",
          title: "创建日期"
        },
        {
          field: "end_time",
          title: "截止日期"
        },
        {
          field: "content",
          title: "工作内容"
        },
        {
          field: "members",
          title: "工作成员",
          formatter: event => {
            let html = "";
            event.forEach(e => {
              html += `<p>姓名：${e.user.display_name}　进度：${
                e.status_text
              }</p>`;
            });
            return html;
          }
        },
        {
          field: "status_text",
          title: "任务状态"
        },
        {
          field: "status_text",
          title: "奖惩情况"
        },
        {
          field: "#",
          title: "操作",
          formatter: (value, row, index) => {
            let accept = [
                '<button class="btn btn-info accept">接受</button>'
              ].join(""),
              complete = [
                '<button class="btn btn-success complete">完成</button>'
              ].join(""),
              invalid = [
                '<button class="btn btn-danger invalid">作废</button>'
              ].join(""),
              taskState = 0;
            row.members.forEach(e => {
              if (e.user.id == this.user.user.id) taskState = e.status;
            });
            if (row.created_by_id == this.user.user.id) return invalid;
            else if (taskState == 1) return complete;
            else if (taskState == 0) return accept;
          },
          events: {
            "click .accept": (e, value, row, index) => {
              this.activeId = row.id;
              dateTimePick.methods.close.call(this);
            },
            "click .complete": (e, value, row, index) => {
              this.$post(`job/complete/${row.id}`)
                .then(response => {
                  if (response.status != 200) return false;
                  $("#table").bootstrapTable("refresh");
                })
                .catch(err => console.error(err));
            },
            "click .invalid": (e, value, row, index) => {
              this.$post(`job/invalid/${row.id}`)
                .then(response => {
                  if (response.status != 200) return false;
                  $("#table").bootstrapTable("refresh");
                })
                .catch(err => console.error(err));
            }
          }
        }
      ],
      onEditableSave: (field, mrow, oldValue, $el) => {}
    });

    $("#clientable").bootstrapTable({
      toolbar: "#clientbar",
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
      columns: [
        {
          checkbox: true
        },
        {
          field: "work_no",
          title: "任务编号",
          sortable: true
        },
        {
          field: "creator",
          title: "创建人",
          sortable: true
        },
        {
          field: "created_at",
          title: "创建日期"
        },
        {
          field: "end_time",
          title: "截止日期"
        },
        {
          field: "content",
          title: "工作内容"
        },
        {
          field: "members",
          title: "工作成员",
          formatter: event => {
            let html = "";
            event.forEach(e => {
              html += `<p>姓名：${e.user.display_name}　进度：${
                e.status_text
              }</p>`;
            });
            return html;
          }
        },
        {
          field: "status_text",
          title: "任务状态"
        },
        {
          field: "status_text",
          title: "奖惩情况"
        },
        {
          field: "#",
          title: "操作",
          formatter: (value, row, index) => {
            let accept = [
                '<button class="btn btn-info accept">接受</button>'
              ].join(""),
              complete = [
                '<button class="btn btn-success complete">完成</button>'
              ].join(""),
              invalid = [
                '<button class="btn btn-danger invalid">作废</button>'
              ].join(""),
              taskState = 0;
            row.members.forEach(e => {
              if (e.user.id == this.user.user.id) taskState = e.status;
            });
            if (row.created_by_id == this.user.user.id) return invalid;
            else if (taskState == 1) return complete;
            else if (taskState == 0) return accept;
          },
          events: {
            "click .accept": (e, value, row, index) => {
              this.activeId = row.id;
              dateTimePick.methods.close.call(this);
            },
            "click .complete": (e, value, row, index) => {
              this.$post(`job/complete/${row.id}`)
                .then(response => {
                  if (response.status != 200) return false;
                  $("#table").bootstrapTable("refresh");
                })
                .catch(err => console.error(err));
            },
            "click .invalid": (e, value, row, index) => {
              this.$post(`job/invalid/${row.id}`)
                .then(response => {
                  if (response.status != 200) return false;
                  $("#table").bootstrapTable("refresh");
                })
                .catch(err => console.error(err));
            }
          }
        }
      ],
      onEditableSave: (field, mrow, oldValue, $el) => {}
    });
  },
  created() {}
};
</script>
