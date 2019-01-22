<template>
  <div id="tasks">
    <dateTimePick title="选择任务完成时间" @refresh="refreshed" :activeId="activeId"></dateTimePick>
    <el-tabs v-model="activeTabs" type="card" closable @tab-remove="removeTab">
      <el-tab-pane v-for="(item,index) in tabItems" :key="index" :name="item.label">
        <span slot="label" v-if="item.num">
          <el-badge :value="item.num" class="item">{{item.name}}</el-badge>
        </span>
        <span slot="label" v-else>{{item.name}}</span>
      </el-tab-pane>
    </el-tabs>
    <div class="tasks" v-show="activeTabs == 'tasks'">
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
    <order v-show="activeTabs == 'order'"></order>
    <customerServiceApplication v-show="activeTabs == 'customerServiceApplication'"></customerServiceApplication>
    <application v-show="activeTabs == 'application'"></application>
    <customerServiceQuotation v-show="activeTabs == 'customerServiceQuotation'"></customerServiceQuotation>
  </div>
</template>
<script>
import { mapState } from "vuex";
import dateTimePick from "@/pages/Process/common/dateTimePick";
import order from "@/pages/Process/view/sale/order";
import customerServiceApplication from "@/pages/Process/view/sale/customerServiceApplication";
import application from "@/pages/Process/view/afterSale/application";
import customerServiceQuotation from "@/pages/Process/view/sale/customerServiceQuotation";

export default {
  name: "tasks",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      activeId: 0,
      activeTabs: "tasks",
      tabItems: [
        { name: "任务列表", label: "tasks", num: 0 }
        // { name: "销售订单", label: "order", num: 0 },
        // { name: "客服申请", label: "customerServiceApplication", num: 0 },
        // { name: "客服报价", label: "application", num: 0 },
        // { name: "发送报价", label: "customerServiceQuotation", num: 0 }
      ],
      options: this.$store.state.tasksType,
      // 默认未完成（全部）
      tasksStatus: "undone",
      date: []
    };
  },
  components: {
    dateTimePick: dateTimePick,
    order: order,
    customerServiceApplication: customerServiceApplication,
    application: application,
    customerServiceQuotation: customerServiceQuotation
  },
  methods: {
    removeTab(tagIndex) {
      this.tabItems.forEach((e, k) => {
        if (e.label == tagIndex) {
          this.tabItems.splice(k, 1);
          this.activeTabs = this.tabItems[k ? k - 1 : k].label;
        }
      });
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
          that.$store.commit("changeTasks", {
            name: "tasks",
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
                  '<button class="btn btn-info accept">接受</button>'
                ].join(""),
                complete = [
                  '<button class="btn btn-success complete">完成</button>'
                ].join(""),
                invalid = [
                  '<button class="btn btn-danger invalid">作废</button>'
                ].join(""),
                turn = [
                  '<button class="btn btn-default turn">跳转</button>'
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
                  sort = that.tasksItems[sign];
                switch (sign) {
                  // 提交客服
                  case "service":
                    $("#customerServiceApplication #table").bootstrapTable(
                      "refresh",
                      {
                        url: "service/list",
                        query: {
                          number: row.order_no
                        }
                      }
                    );
                    break;
                  // 客服主管指派客服
                  case "service_assign":
                    $("#application #afterSaleTable").bootstrapTable(
                      "refresh",
                      {
                        url: "service/list",
                        query: {
                          number: row.order_no
                        }
                      }
                    );
                    break;
                  // 客服报价
                  case "service_quote":
                    $("#application #afterSaleTable").bootstrapTable(
                      "refresh",
                      {
                        url: "service/list",
                        query: {
                          number: row.order_no
                        }
                      }
                    );
                    break;
                  case "order":
                    // this.refresh($("#order #table"));
                    break;
                }
                if (sort) {
                  let inArr = true;
                  that.tabItems.forEach(e => {
                    if (e.label == sort.label) inArr = false;
                  });
                  if (inArr)
                    that.tabItems.push({
                      name: sort.name,
                      label: sort.label,
                      num: that.tasksPendingNum[sort.label]
                    });
                  that.activeTabs = sort.label;
                } else {
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
          toolbar: ".tasks #toolbar",
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
      $("#tasks #table").bootstrapTable(data);
    },
    changeDate(item) {
      this.date = item;
      this.refreshed();
    },
    refreshed() {
      this.refresh($("#table"));
    }
  },
  computed: mapState(["tasksItems", "tasksPendingNum"]),
  watch: {
    tasksPendingNum: {
      handler(val) {
        for (const key in val) {
          this.tabItems.forEach(e => {
            if (e.label == key) e.num = val[key];
          });
        }
      },
      deep: true
    },
    tasksStatus(val) {
      this.refreshed();
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#tasks {
  .el-tabs__header {
    margin: 0;
    .el-tabs__nav-wrap {
      .el-tabs__nav-scroll {
        .el-tabs__nav {
          .el-tabs__item {
            .el-badge__content {
              top: 6px;
              right: 1px;
            }
          }
        }
      }
    }
  }
  #toolbar {
    display: none;
    &:first-child {
      display: flex;
      display: -ms-flexbox;
      display: -webkit-box;
    }
    > div {
      margin-right: 1rem;
      &:last-child {
        margin-right: 0rem;
      }
    }
  }
}
</style>
