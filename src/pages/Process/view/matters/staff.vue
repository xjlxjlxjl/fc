<template>
  <div id="tasks">
    <entryWork></entryWork>
    <changePositions :userArr="arr" @refresh="refreshed"></changePositions>
    <div id="mattersToolbar">
      <span class="lead">员工列表</span>
      <el-button size="mini" @click="entry">邀请入职</el-button>
      <el-button size="mini" @click="changePost">调整岗位</el-button>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
import entryWork from "@/pages/Process/common/entryWork";
import changePositions from "@/pages/Process/common/changePositions";
export default {
  name: "tasks",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      activeId: 0,
      arr: []
    };
  },
  components: {
    entryWork: entryWork,
    changePositions: changePositions
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("personnels/list", params.data)
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
      params.per_page = params.limit;
      params.q = params.search;
      params.i = params.search;
      params.p = params.search;
      return params;
    },
    entry() {
      entryWork.methods.close.call(this);
    },
    changePost() {
      this.arr = this.getTableAttr($("#mattersTable"), "member_id");
      if (!this.arr.length) {
        this.$message({ message: "请勾选要调岗的员工", type: "error" });
        return false;
      }
      changePositions.methods.close.call(this);
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
      // detailView: true,
      columns: [
        {
          checkbox: true
        },
        {
          field: "employee_id",
          title: "员工编号",
          sortable: true
        },
        {
          field: "name",
          title: "姓名",
          sortable: true
        },
        {
          field: "display_name",
          title: "昵称",
          sortable: true
        },
        {
          field: "native_place",
          title: "老家",
          sortable: true
        },
        {
          field: "entry_at",
          title: "入职时间",
          sortable: true
        },
        {
          field: "zodiac",
          title: "属相",
          sortable: true
        },
        {
          field: "birthday",
          title: "生日",
          sortable: true
        },
        {
          field: "department",
          title: "职位",
          sortable: true
        },
        {
          field: "gender",
          title: "性别",
          formatter: (value, row, index) => {
            return `${value == "male" ? "男" : "女"}`;
          }
        },
        {
          field: "contact_phone",
          title: "联系电话",
          sortable: true
        }
      ],
      detailFormatter: (index, row, $el) => {},
      onEditableSave: (field, mrow, oldValue, $el) => {}
    });
  },
  created() {}
};
</script>
