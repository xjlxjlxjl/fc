<template>
  <div id="overtime">
    <overTimeModal @refresh="refreshed"></overTimeModal>
    <div id="mattersToolbar">
      <span class="lead">加班申请记录</span>
      <el-button @click="create" size="mini">新建</el-button>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
import addOvertime from "@/pages/Process/common/addOvertime";

export default {
  name: "overtime",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      activeId: 0
    };
  },
  components: {
    overTimeModal: addOvertime
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("personnels/overtimes", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
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
          field: "created_at",
          title: "申请时间（创建时间）",
          sortable: true
        },
        {
          field: "full_name",
          title: "操作者",
          sortable: true
        },
        {
          field: "branch",
          title: "部门",
          sortable: true
        },
        {
          field: "position",
          title: "岗位",
          sortable: true
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
          sortable: true
        },
        {
          field: "total_cost",
          title: "总费用",
          sortable: true
        },
        {
          field: "sigin_in_method",
          title: "是否有打卡记录",
          sortable: true,
          editable: {
            type: "select",
            source: [{ value: "1", text: "是" }, { value: "0", text: "否" }],
            title: "是否有打卡记录",
            emptytext: "空"
          }
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
          field: "details",
          title: "加班说明（详情）",
          sortable: true,
          editable: {
            type: "text",
            title: "加班说明",
            emptytext: "空"
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
                .$post(`personnels/overtimes/delete/${value}`)
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
        let self = row.overtimes;
        let html = [
          `<table class="table">
          <tr><th>审批人</th><th>审批状态</th><th>原因</th><th>审批时间</th></tr>`
        ];
        self.forEach(e =>
          html.push(
            `<tr><td>${e.name}</td><td>${
              e.status == "success"
                ? "成功"
                : e.status == "fail"
                ? "拒绝"
                : "待审批"
            }</td><td>${e.reason || "无"}</td><td>${e.created_at}</td></tr>`
          )
        );
        html.push("</table>");
        return html.join("");
      },
      onEditableSave: (field, mrow, oldValue, $el) => {
        mrow.total_time =
          (new Date(mrow.end_at) - new Date(mrow.start_at)) / 3600 / 1000;

        mrow.start_at = mrow.start_at.split(":");
        mrow.start_at.pop();
        mrow.start_at = mrow.start_at.join(":");

        mrow.end_at = mrow.end_at.split(":");
        mrow.end_at.pop();
        mrow.end_at = mrow.end_at.join(":");

        that
          .$post(`/personnels/overtimes/edit/${mrow.slug}`, mrow)
          .then(response => {
            if (response.status != 200) return false;
            that.$message({ message: "修改成功", type: "success" });
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
