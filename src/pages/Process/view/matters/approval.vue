<template>
  <div id="approval">
    <addApproval :form="form" @refresh="refreshed"></addApproval>
    <div id="mattersToolbar">
      <span class="lead">审批条件列表</span>
      <el-button size="mini" @click="add">新建</el-button>
      <el-button size="mini" @click="del">删除</el-button>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
import addApproval from "@/pages/Process/common/addApproval";
export default {
  name: "approval",
  data() {
    return {
      form: {
        name: "",
        condition_rule: "",
        condition_unit: "",
        condition_value: "",
        type: "",
        members: [],
        is_branch_manage: 1
      }
    };
  },
  components: {
    addApproval: addApproval
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`approvals/approval`, params.data)
        .then(response => {
          if (response.status == 400) {
            params.success({
              rows: [],
              total: 0
            });
          }
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => console.error(err));
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      params.d = params.search;
      return params;
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "name",
            title: "名称",
            sortable: true
          },
          {
            field: "condition_rule",
            title: "条件规则",
            sortable: true
          },
          {
            field: "condition_unit",
            title: "条件单位",
            sortable: true
          },
          {
            field: "condition_value",
            title: "条件值",
            sortable: true
          },
          {
            field: "type",
            title: "类型名称",
            sortable: true,
            formatter: (value, row, index) => {
              return value.name;
            }
          },
          {
            field: "type",
            title: "类型描述",
            sortable: true,
            formatter: (value, row, index) => {
              return value.description;
            }
          },
          {
            field: "id",
            title: "操作",
            formatter: (value, row, index) => {
              let del = [
                `<button class="btn btn-danger btn-sm del">删除</button>`
              ];
              let edit = [
                `<button class="btn btn-success btn-sm edit">编辑</button>`
              ];
              return del + edit;
            },
            events: {
              "click .del": ($el, value, row, index) => {
                that
                  .$post(`approvals/approval/delete`, {
                    id: value
                  })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#mattersTable"), "id", [value]);
                  })
                  .catch(err => console.error(err));
              },
              "click .edit": ($el, value, row, index) => {
                let arr = [],
                  type = 0;
                row.members.forEach(e => arr.push(e.id));
                row.members = arr;
                row.type = row.type.id;
                this.form = row;
                addApproval.methods.close.call(this);
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
            let content = [`<table class="table table-bordered">`];
            content.push(`<tr><th>用户名</th><th>手机</th></tr>`);
            row.members.forEach(e =>
              content.push(
                `<tr><td>${e.display_name}</td><td>${e.mobile}</td></tr>`
              )
            );
            content.push(`</table>`);
            return content.join("");
          },
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };
      $("#mattersTable").bootstrapTable(data);
    },
    add() {
      this.form = {
        name: "",
        condition_rule: "",
        condition_unit: "",
        condition_value: "",
        type: "",
        members: [],
        is_branch_manage: 1
      };
      addApproval.methods.close.call(this);
    },
    del() {
      let that = this;
      that.getData($("#mattersTable")).forEach(e => {
        that
          .$post(`approvals/approval/delete`, { id: e.id })
          .then(response => {
            if (response.status != 200) return false;
            that.delTable($("#mattersTable"), "id", [e.id]);
          })
          .catch(err => console.error(err));
      });
    },
    refreshed() {
      this.refresh($("#mattersTable"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#approval {
}
</style>
