<template>
  <div id="task">
    <dateTimePick title="选择任务完成时间" @refresh="refreshed" :activeId="activeId"></dateTimePick>
    <div id="toolbar">
      <!-- <span class="lead">未完成任务</span> -->
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
  name: 'task',
  data() {
    const user = JSON.parse(localStorage.getItem('user')) || { user: {id: 0} };
    return {
      user: user,
      options: this.$store.state.tasksType,
      // 默认未完成（全部）
      tasksStatus: "undone",
      date: [],
      activeId: 0
    };
  },
  components: {
    dateTimePick: dateTimePick,
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
          that.$store.commit("changeTasks", {
            name: "/tasks",
            num: response.data.total
          });
          params.success({
            total: response.data.total,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.perPage = params.limit;
      params.status = this.tasksStatus;
      if (this.date.length) {
        params.end_time = this.dateParse(this.date[1]);
        params.star_time = this.dateParse(this.date[0]);
      }
      if (params.search.length > 8) params.work_no = params.search;
      else params.username = params.search;
      return params;
    },
    init() {
      let that = this,
        columns = [
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
                  '<button class="btn btn-info btn-sm accept">接受</button>'
                ].join(""),
                complete = [
                  '<button class="btn btn-success btn-sm complete">完成</button>'
                ].join(""),
                invalid = [
                  '<button class="btn btn-danger btn-sm invalid">作废</button>'
                ].join(""),
                turn = [
                  '<button class="btn btn-default btn-sm turn">跳转</button>'
                ].join(""),
                taskState = null;
              row.members.forEach(e => {
                if (e.user.id == this.user.user.id) taskState = e.status;
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
                    row.created_by_id == this.user.user.id
                  )
                    return turn + accept + invalid;
                  else if (
                    taskState == 0 &&
                    row.created_by_id != this.user.user.id
                  )
                    return turn + accept;
                  else if (
                    taskState == 1 &&
                    row.created_by_id == this.user.user.id
                  )
                    return turn + complete + invalid;
                  else if (
                    taskState == 1 &&
                    row.created_by_id != this.user.user.id
                  )
                    return turn + complete;
                  else return turn;
                  break;
                case "worker":
                default:
                  // 已废弃任务不做操作
                  if (row.status == 4) return "";
                  // 自己是任务发起者并且是成员
                  else if (
                    taskState == 0 &&
                    row.created_by_id == this.user.user.id
                  )
                    return accept + invalid;
                  else if (
                    taskState == 0 &&
                    row.created_by_id != this.user.user.id
                  )
                    return accept;
                  else if (
                    taskState == 1 &&
                    row.created_by_id == this.user.user.id
                  )
                    return complete + invalid;
                  else if (
                    taskState == 1 &&
                    row.created_by_id != this.user.user.id
                  )
                    return complete;
                  else return "";
                  break;
              }
            },
            events: {
              "click .turn": (e, value, row, index) => {
                let sign = row.redirect_slug,
                  // let sign = row.numbering.removeNumber(),
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
                    // this.refresh($("#order #table"));
                    break;
                  case "check":
                    that.refresh($("#approval #table"));
                    break;
                }
                if (sort) that.$emit('change', sort.label);        
                else {
                  that.$message({
                    message: "该订单编号尚未注册，请联系管理员后处理",
                    type: "error"
                  });
                  return false;
                }
              },
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
        };
      $("#task #table").bootstrapTable(data);
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
    this.init();
  }
}
</script>
<style>
  #task {

  }
</style>