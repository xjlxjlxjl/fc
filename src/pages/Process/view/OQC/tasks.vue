<template>
  <div id="tasks">
    <dateTimePick title="选择任务完成时间" @refresh="refreshed" :activeId="activeId"></dateTimePick>
    <div id="OQCtoolbar">
      <span class="lead">未完成任务</span>
    </div>
    <table id="OQCtable"></table>
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
        .$get("job/list", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          params.success({
            total: response.data.total_page,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.current_page = params.limit;
      return params;
    },
    refreshed() {
      this.refresh($("#OQCtable"));
    }
  },
  mounted() {
    let that = this;
    $("#OQCtable").bootstrapTable({
      toolbar: "#OQCtoolbar",
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
        // {
        //   field: "members",
        //   title: "工作成员",
        //   formatter: event => {
        //     let html = "";
        //     event.forEach(e => {
        //       html += `<p>姓名：${e.user.display_name}　进度：${
        //         e.status_text
        //       }</p>`;
        //     });
        //     return html;
        //   }
        // },
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
              taskState = null;
            row.members.forEach(e => {
              if (e.user.id == this.user.user.id) taskState = e.status;
            });
            if (row.created_by_id == this.user.user.id && row.status == 0)
              return invalid;
            else if (taskState == 1) return complete;
            else if (taskState == 0) return accept;
            else return "";
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
                  that.refresh($("#OQCtable"));
                })
                .catch(err => console.error(err));
            },
            "click .invalid": (e, value, row, index) => {
              this.$post(`job/invalid/${row.id}`)
                .then(response => {
                  if (response.status != 200) return false;
                  row.status = 4;
                  that.ediTable($("#OQCtable"), index, row);
                })
                .catch(err => console.error(err));
            }
          }
        }
      ],
      detailFormatter: (index, row, $el) => {
        let html = [
          "<table class='table'>",
          "<tr><th>成员姓名</th><th>完成状态</th></tr>"
        ];
        row.members.forEach(e =>
          html.push(
            `<tr><td>${e.user.display_name}</td><td>${e.status_text}</td></tr>`
          )
        );
        html.push("</table>");
        return html.join("");
      },
      onEditableSave: (field, mrow, oldValue, $el) => {}
    });
  },
  created() {}
};
</script>
