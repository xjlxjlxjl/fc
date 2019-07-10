<template>
  <div id="task">
    <dateTimePick title="选择任务完成时间" @refresh="refreshed" :activeId="activeId"></dateTimePick>
    <div id="toolbar">
      <el-select v-model="tasksStatus" @change="refreshed" size="mini" placeholder="任务状态">
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
import "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/locale/locale_cn.js";

export default {
  name: "task",
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || {
      user: { id: 0 }
    };
    return {
      user: user,
      options: this.$store.state.tasksType,
      // 默认未完成（全部）
      tasksStatus: "undone",
      date: [],
      activeId: 0,
      // 表格过渡
      jsonGantt: {},
      rowId: 0,
      index: undefined
    };
  },
  components: {
    dateTimePick: dateTimePick
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get("job/list", params.data)
        .then(response => {
          if (response.status != 200) return false;
          this.$store.commit("changeTasks", {
            name: "/tasks",
            num: response.data.total
          });
          params.success({
            total: response.data.total,
            rows: response.data.list
          });
        })
        .catch(err => console.error(err));
    },
    tableAjaxParams(params) {
      let p = {};
      p.page = params.offset / params.limit + 1;
      p.perPage = params.limit;
      p.status = this.tasksStatus;
      if (this.date.length) {
        p.end_time = this.dateParse(this.date[1]);
        p.star_time = this.dateParse(this.date[0]);
      }
      if (params.search.length > 8) p.work_no = params.search;
      else p.username = params.search || undefined;
      return p;
    },
    init() {
      let that = this,
        columns = [
          {
            field: "work_no",
            title: "任务编号"
          },
          {
            field: "creator",
            title: "创建人"
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
            formatter: function(event) {
              let html = `<table class="table table-bordered" style="white-space: nowrap;">`;
              event.forEach(e => (html += `<tr><td>姓名：${e.user.display_name}</td><td>进度：${e.status_text}</td></tr>`));
              html += `</table>`;
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
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let accept = `<button sid="${row.id}" class="btn btn-info btn-sm accept">接受</button>`,
                complete = `<button sid="${row.id}" class="btn btn-success btn-sm complete">完成</button>`,
                invalid = `<button sid="${row.id}" class="btn btn-danger btn-sm invalid">作废</button>`,
                turn = `<button slug="${row.redirect_slug}" class="btn btn-default btn-sm turn">跳转</button>`,
                taskState = null;
              row.members.forEach(e => {
                if (e.user.id == that.user.user.id) taskState = e.status;
              });
              switch (row.redirect_slug) {
                case "service":
                case "service_assign":
                case "service_quote":
                case "order":
                case "check":
                  // 已废弃任务不做操作
                  if (row.status == 4) return "";
                  // 自己是任务发起者并且是成员
                  else if (
                    taskState == 0 &&
                    row.created_by_id == that.user.user.id
                  )
                    return turn + accept + invalid;
                  else if (
                    taskState == 0 &&
                    row.created_by_id != that.user.user.id
                  )
                    return turn + accept;
                  else if (
                    taskState == 1 &&
                    row.created_by_id == that.user.user.id
                  )
                    return turn + complete + invalid;
                  else if (
                    taskState == 1 &&
                    row.created_by_id != that.user.user.id
                  )
                    return turn + complete;
                  else return turn;
                  break;
                case "worker":
                  // 已废弃任务不做操作
                  if (row.status == 4) return "";
                  // 自己是任务发起者并且是成员
                  else if (
                    taskState == 0 &&
                    row.created_by_id == that.user.user.id
                  )
                    return accept + invalid;
                  else if (
                    taskState == 0 &&
                    row.created_by_id != that.user.user.id
                  )
                    return accept;
                  else if (
                    taskState == 1 &&
                    row.created_by_id == that.user.user.id
                  )
                    return complete + invalid;
                  else if (
                    taskState == 1 &&
                    row.created_by_id != that.user.user.id
                  )
                    return complete;
                  else return "";
                  break;
                default:
                  return turn;
                  break;
              }
            },
            events: {
              "click .turn": function(e, value, row, index) {
                let 
                  sign = row.redirect_slug,
                  sort = that.$store.state.tasksItems[sign];
                  switch (sign) {
                    // 提交客服
                    case "service":
                      that.refresh($("#customerServiceApplication #table"), {
                        url: "service/list",
                        query: {
                          number: row.order_no
                        }
                      });
                      break;
                    // 客服主管指派客服
                    case "service_assign":
                      that.refresh($("#application #afterSaleTable"), {
                        url: "service/list",
                        query: {
                          number: row.order_no
                        }
                      });
                      break;
                    // 客服报价
                    case "service_quote":
                      that.refresh($("#application #afterSaleTable"), {
                        url: "service/list",
                        query: {
                          number: row.order_no
                        }
                      });
                      break;
                    case "order":
                      // that.refresh($("#order #table"));
                      break;
                    case "check":
                      that.refresh($("#approval #table"));
                      break;
                  }
                if (sort) that.$emit("change", sort.label);
                else that.$message({ message: "该订单编号尚未注册，请联系管理员后处理", type: "error" });
              },
              "click .accept": function(e, value, row, index) {
                that.activeId = row.id;
                dateTimePick.methods.close.call(that);
              },
              "click .complete": function(e, value, row, index) {
                that
                  .$post(`job/complete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.refreshed();
                  })
                  .catch(err => console.error(err));
              },
              "click .invalid": function(e, value, row, index) {
                that
                  .$post(`job/invalid/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    row.status = 4;
                    that.ediTable($("#task #table"), index, row);
                  })
                  .catch(err => console.error(err));
              }
            }
          }
        ],
        data = {
          toolbar: "#task #toolbar",
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
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: columns,
          detailFormatter(index, row, $el) {
            if (that.index != index)
              $("#task #table").bootstrapTable("collapseRow", [ that.index ? that.index : index != 0 ? 0 : undefined ]);
            that.rowId = row.id, that.index = index || undefined;
            let jsonGantt = JSON.parse(row.gantt) || {
                data:[],
                links:[]
              };
            setTimeout(() => {
              gantt.init(`gantt${index}`);
              for (let item of jsonGantt.data) {
                item.start_date = new Date(item.start_date);
                item.end_date = new Date(item.end_date);
              }
              that.jsonGantt = jsonGantt;
              gantt.clearAll();
              gantt.parse(jsonGantt);
            }, 100);
            return `<div id="gantt${index}"></div>`;
          }
        };
      $("#task #table").bootstrapTable(data);
    },
    initGantt() {
      gantt.config.autofit = true;
      gantt.config.autosize = "xy";
      gantt.config.autosize_min_width = 800;
      gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";

      let
        colHeader = '<div class="gantt_grid_head_cell gantt_grid_head_add contral" type="addGantt"></div>',
        colContent = function (task) {
          return (`
            <button class="btn btn-xs btn-default contral" type="feedback" tid="${task.id}">反馈</button>
            <button class="btn btn-xs btn-default contral" type="reply" tid="${task.id}">回复</button>
            <button class="btn btn-xs btn-info contral" type="addGantt" tid="${task.id}">
              <i class="el-icon-plus"></i>
            </button>` +
            `<button class="btn btn-xs btn-danger contral" type="delGantt" tid="${task.id}">
              <i class="el-icon-close"></i>
            </button>
          `);
        };

      gantt.config.columns = [
        { name: "id", label: "序号", tree: true, width: 150 },
        { name: "create_by", label: "创建人", align: "center", width: 70 },
        { name: "create_at", label: "创建时间", align: "center", width: 70 },
        { name: "together", label: "协同人", align: "center", editor: { type: "text", map_to: "together" }, width: 70 },
        { name: "text", label: "工作内容规划", align: "center", editor: { type: "text", map_to: "text" }, width: 120 },
        { name: "start_date", label: "预计开始时间", align: "center", width: 120 },
        { name: "end_date", label: "实际完成时间", align: "center", width: 120 },
        { name: "duration", label: "耗时", align: "center", width: 70 },
        { name: "progress", label: "进度", align: "center", width: 70 },
        { name: "feedback", label: "遇到问题反馈", resize: true, align: "center", width: 120 },
        { name: "reply", label: "主管回复", resize: true, align: "center", width: 120 },
        { name: "buttons", label: colHeader, template: colContent, width: 160 }
      ];

      gantt.config.lightbox.sections = [
        { name: "together", height: 38, map_to: "together", type: "textarea" },
        { name: "text", height: 38, map_to: "text", type: "textarea" },
        { name: "strat_at", height: 38, map_to: "auto", type: "time" }
      ];

      gantt.attachEvent("onAfterTaskAdd", (id, item) => this.editGantt(id, item));
      gantt.attachEvent("onAfterTaskUpdate", (id, item) => this.editGantt(id, item));
      gantt.attachEvent("onAfterTaskDelete", (id, item) => this.editGantt(id, item));
    },
    editGantt(id, item) {
      this.jsonGantt.data = [];
      for (let item in gantt.getDatastore("task").pull)
        this.jsonGantt.data.push(gantt.getDatastore("task").pull[item]);
        
      this
        .$post(`job/edit_gantt/${this.rowId}`, {
          id: this.rowId,
          gantt: JSON.stringify(this.jsonGantt)
        }).then(response => {
          if (response.status != 200) return false;
          this.$message({ message: '任务保存成功，请刷新后查看', type: 'success' });
        })
        .catch(err => console.error(err));
    },
    changeDate(item) {
      this.date = item;
      this.refreshed();
    },
    refreshed() {
      this.refresh($("#task #table"));
    }
  },
  mounted() {
    this.initGantt();
    this.init();
  },
  created() {
    let that = this;
    $(document).on("click", ".contral", function(e) {
      let self = $(this);
      switch(self.attr('type')) {
        case "addGantt":
          gantt.createTask({
            create_by: that.user.user.display_name,
            create_at: that.dateParse(new Date()),
            progress: 0,
            feedback: '',
            reply: ''
          }, self.attr('tid') || 0);
          break;
        case "delGantt":
          gantt.confirm({
            title: gantt.locale.labels.confirm_deleting_title,
            text: gantt.locale.labels.confirm_deleting,
            callback: function (res) {
              if (res) gantt.deleteTask(self.attr('tid'));
            }
          });
          break;
        case "feedback":
          that
            .$prompt('反馈内容', '反馈')
            .then(({ value }) => {
              gantt.getTask(self.attr('tid')).feedback = `${that.user.user.display_name}：${value}`;
              gantt.updateTask(self.attr('tid'));
            });
          break;
        case "reply":
          that
            .$prompt('回复内容', '回复')
            .then(({ value }) => {
              gantt.getTask(self.attr('tid')).reply = `${that.user.user.display_name}：${value}`;
              gantt.updateTask(self.attr('tid'));
            });
          break;
      }
    });

    $(document).on("click", ".turn", function(e) {
      let
        self = $(this),
        sign = self.attr('slug'),
        sort = that.$store.state.tasksItems[sign];
      if (sort) that.$emit("change", sort.label);
      else that.$message({ message: "该订单编号尚未注册，请联系管理员后处理", type: "error" });
    });
    $(document).on("click", ".accept", function(e) {
      that.activeId = $(this).attr('sid');
      dateTimePick.methods.close.call(that);
    });
    $(document).on("click", ".complete", function(e) {
      that
        .$post(`job/complete/${$(this).attr('sid')}`)
        .then(response => {
          if (response.status != 200) return false;
          that.refreshed();
        })
        .catch(err => console.error(err));
    });
    $(document).on("click", ".invalid", function(e) {
      that
        .$post(`job/invalid/${$(this).attr('sid')}`)
        .then(response => {
          if (response.status != 200) return false;
          row.status = 4;
          that.ediTable($("#task #table"), index, row);
        })
        .catch(err => console.error(err));
    });
  }
};
</script>
<style lang="less">
@import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
#task {
}
</style>