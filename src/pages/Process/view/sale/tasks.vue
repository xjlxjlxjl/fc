<template>
  <div id="tasks">
    <dateTimePick title="选择任务完成时间" @refresh="refreshed" :activeId="activeId"></dateTimePick>
    <el-tabs v-model="activeTabs" type="card" closable @tab-remove="removeTab">
      <el-tab-pane
        v-for="(item,index) in tabItems"
        :key="index"
        :label="item.name"
        :name="index.toString()"
      ></el-tab-pane>
    </el-tabs>
    <div id="toolbar">
      <span class="lead">未完成任务</span>
      <el-select v-model="tasksStatus" size="mini" placeholder="任务状态">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-date-picker
        size="mini"
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="任务开始日期"
        end-placeholder="任务结束日期"
        @change="changeDate"
      ></el-date-picker>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import dateTimePick from "@/pages/Process/common/dateTimePick";
export default {
  name: "tasks",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      activeId: 0,
      activeTabs: 0,
      tabItems: [
        { name: "待完成任务0" },
        { name: "待完成任务1" },
        { name: "待完成任务2" },
        { name: "待完成任务3" },
        { name: "待完成任务4" },
        { name: "待完成任务5" },
        { name: "待完成任务6" },
        { name: "待完成任务7" },
        { name: "待完成任务8" },
        { name: "待完成任务9" }
      ],
      options: [
        {
          value: undefined,
          label: "全部"
        },
        {
          value: 0,
          label: "未完成"
        },
        {
          value: 1,
          label: "完成"
        },
        {
          value: 2,
          label: "延期未完成"
        },
        {
          value: 3,
          label: "延期完成"
        }
      ],
      tasksStatus: "",
      date: []
    };
  },
  components: {
    dateTimePick: dateTimePick
  },
  methods: {
    removeTab(tagIndex) {
      this.tabItems.splice(tagIndex, 1);
    },
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
      params.status = this.tasksStatus;
      if (this.date.length) {
        params.end_time = this.dateParse(this.date[1]);
        params.star_time = this.dateParse(this.date[0]);
      }
      params.work_no = params.search;
      return params;
    },
    init() {
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
                    that.refresh($("#table"));
                  })
                  .catch(err => console.error(err));
              },
              "click .invalid": (e, value, row, index) => {
                this.$post(`job/invalid/${row.id}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    row.status = 4;
                    that.ediTable($("#table"), index, row);
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
              `<tr><td>${e.user.display_name}</td><td>${
                e.status_text
              }</td></tr>`
            )
          );
          html.push("</table>");
          return html.join("");
        },
        onEditableSave: (field, mrow, oldValue, $el) => {}
      });
    },
    changeDate(item) {
      this.date = item;
      this.refreshed();
    },
    refreshed() {
      this.refresh($("#table"));
    }
  },
  watch: {
    tasksStatus(val) {
      this.refreshed();
    }
  },
  mounted() {
    this.init();
  },
  created() {}
};
</script>
<style lang="less">
#tasks {
  #toolbar {
    > div {
      margin-right: 1rem;
      &:last-child {
        margin-right: 0rem;
      }
    }
  }
}
</style>
