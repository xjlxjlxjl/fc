<template>
  <el-main>
    <dateTimePick title="选择任务完成时间" @refresh="refresh" :activeId="activeId"></dateTimePick>
    <createdCustomer @refresh="refresh"></createdCustomer>
    <div id="toolbar">
      <el-button size="mini" @click="addApplication">新建</el-button>
    </div>
    <table id="table"></table>
  </el-main>
</template>
<script>
import dateTimePick from "@/pages/Process/common/dateTimePick";
import createdCustomer from "@/pages/Process/common/createdCustomer";

export default {
  name: "tasks",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      activeId: 0
    };
  },
  components: {
    dateTimePick: dateTimePick,
    createdCustomer: createdCustomer
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("service")
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
    addApplication() {
      createdCustomer.methods.close.call(this);
    },
    refresh() {
      $("#table").bootstrapTable("refresh");
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
          field: "id",
          title: "",
          // checkbox: true,
          formatter: (value, row, index) => {
            let del = ['<button class="btn btn-danger del">删除</button>'];
            return del;
          },
          events: {
            "click .del": ($el, value, row, index) => {
              that.delTable($("#table"), "id", [value]);
              return false;
              that
                .$post(`/service/delete/${value}`)
                .then(response => {
                  $("#table").bootstrapTable("remove", {
                    field: "id",
                    values: row
                  });
                })
                .catch(err => {});
            }
          }
        },
        {
          field: "number",
          title: "订单号",
          sortable: true
        },
        {
          field: "created_at",
          title: "创建日期",
          sortable: true
        },
        {
          field: "apply_linkman",
          title: "申请联系人",
          editable: {
            type: "text",
            title: "申请联系人",
            emptytext: "空"
          }
        },
        {
          field: "customer_demand",
          title: "客户需求",
          editable: {
            type: "text",
            title: "客户需求",
            emptytext: "空"
          }
        },
        {
          field: "customer_linkman",
          title: "客户联系人",
          editable: {
            type: "text",
            title: "客户名",
            emptytext: "空",
            validate: v => {
              if (!v) return "不能为空";
            }
          }
        },
        {
          field: "customer_contact",
          title: "客户联系方式",
          sortable: true,
          editable: {
            type: "text",
            title: "联系方式",
            emptytext: "空",
            validate: v => {
              if (!v) return "不能为空";
            }
          }
        },
        {
          field: "customer_other_contact",
          title: "客户其他联系方式",
          sortable: true,
          editable: {
            type: "text",
            title: "客户其他联系方式",
            emptytext: "空",
            validate: v => {
              if (!v) return "不能为空";
            }
          }
        },
        {
          field: "reason_analysis",
          title: "原因分析",
          sortable: true,
          editable: {
            type: "text",
            title: "原因分析",
            emptytext: "空",
            validate: v => {
              if (!v) return "不能为空";
            }
          }
        },
        {
          field: "deal_method",
          title: "处理方式",
          sortable: true,
          editable: {
            type: "text",
            title: "处理方式",
            emptytext: "空",
            validate: v => {
              if (!v) return "不能为空";
            }
          }
        },
        {
          field: "deal_result",
          title: "处理结果",
          sortable: true
        },
        {
          field: "repair_quoted_price",
          title: "维修报价",
          formatter: (value, row, index) => {
            return `${value}`;
          }
        },
        {
          field: "repair_discount_price",
          title: "维修折扣价",
          sortable: true
        },
        {
          field: "repair_real_price",
          title: "维修实价"
        },
        {
          field: "repair_advice",
          title: "维修建议",
          editable: {
            type: "textarea",
            title: "维修建议",
            emptytext: "空"
          }
        },
        {
          field: "service_status_name",
          title: "服务状态"
        },
        {
          field: "remark",
          title: "备注",
          editable: {
            type: "textarea",
            title: "备注",
            emptytext: "空"
          }
        }
      ],
      onEditableSave(field, mrow, oldValue, $el) {
        that
          .$post(`/service/edit/${mrow.id}`, mrow)
          .then(response => {
            if (response.status != 200) return false;
            this.refresh();
          })
          .catch(err => {});
      },
      detailFormatter(field, mrow, oldValue, $el) {}
    });
  },
  created() {
    console.log();
  }
};
</script>
