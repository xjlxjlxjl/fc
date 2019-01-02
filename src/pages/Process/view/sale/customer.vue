<template>
  <div id="customer">
    <addCustomer @refresh="refreshed"></addCustomer>
    <div
      class="modal fade bs-example-modal-lg"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div id="childToolbar">
            <span class="lead">拜访记录</span>
          </div>
          <table id="childTable"></table>
        </div>
      </div>
    </div>
    <div id="toolbar">
      <span class="lead">客户管理</span>
      <el-button size="mini" @click="add">新建客户</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addCustomer from "@/pages/Process/common/addCustomer";

export default {
  name: "customer",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}")
    };
  },
  components: {
    addCustomer: addCustomer
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`customers`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      params.address = params.search;
      // params.salesman_id = this.user.user.id;
      return params;
    },
    add() {
      addCustomer.methods.close.call(this);
    },
    refreshed() {
      this.refresh($("#table"));
    },
    tableInit() {
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
        // detailView: true,
        columns: [
          {
            checkbox: true
          },
          {
            field: "code",
            title: "客户编码",
            sortable: true
          },
          {
            field: "name",
            title: "客户名称",
            sortable: true,
            editable: {
              type: "text",
              title: "客户名称",
              emptytext: "空"
            }
          },
          {
            field: "salesman",
            title: "业务员",
            sortable: true
          },
          {
            field: "legal_representative",
            title: "法人代表",
            sortable: true,
            editable: {
              type: "text",
              title: "法人代表",
              emptytext: "空"
            }
          },
          {
            field: "address",
            title: "地址",
            sortable: true,
            editable: {
              type: "text",
              title: "地址",
              emptytext: "空"
            }
          },
          {
            field: "detailed_address",
            title: "详细地址",
            sortable: true,
            editable: {
              type: "text",
              title: "详细地址",
              emptytext: "空"
            }
          },
          {
            field: "phone",
            title: "电话",
            sortable: true,
            editable: {
              type: "text",
              title: "电话",
              emptytext: "空"
            }
          },
          {
            field: "mobile",
            title: "手机号",
            sortable: true,
            editable: {
              type: "text",
              title: "手机号",
              emptytext: "空"
            }
          },
          {
            field: "logistics_code",
            title: "物流编码",
            sortable: true,
            editable: {
              type: "text",
              title: "物流编码",
              emptytext: "空"
            }
          },
          {
            field: "invoice_head",
            title: "发票抬头",
            sortable: true,
            editable: {
              type: "text",
              title: "发票抬头",
              emptytext: "空"
            }
          },
          {
            field: "bank_account",
            title: "开户银行",
            sortable: true,
            editable: {
              type: "text",
              title: "开户银行",
              emptytext: "空"
            }
          },
          {
            field: "account_name",
            title: "银行账户名",
            sortable: true,
            editable: {
              type: "text",
              title: "银行账户名",
              emptytext: "空"
            }
          },
          {
            field: "account_number",
            title: "银行账号",
            sortable: true,
            editable: {
              type: "text",
              title: "银行账号",
              emptytext: "空"
            }
          },
          {
            field: "tax_id",
            title: "税号",
            sortable: true,
            editable: {
              type: "text",
              title: "税号",
              emptytext: "空"
            }
          },
          {
            field: "business_license_number",
            title: "工商营业执照号码",
            sortable: true,
            editable: {
              type: "text",
              title: "工商营业执照号码",
              emptytext: "空"
            }
          },
          {
            field: "url",
            title: "网址",
            sortable: true,
            editable: {
              type: "text",
              title: "网址",
              emptytext: "空"
            }
          },
          {
            field: "delivery_address",
            title: "交货地址",
            sortable: true,
            editable: {
              type: "text",
              title: "交货地址",
              emptytext: "空"
            }
          },
          {
            field: "registered_capital",
            title: "注册资金",
            sortable: true,
            editable: {
              type: "text",
              title: "注册资金",
              emptytext: "空"
            }
          },
          {
            field: "establish_at",
            title: "成立日期",
            sortable: true,
            editable: {
              type: "text",
              title: "成立日期",
              emptytext: "空"
            }
          },
          {
            field: "email",
            title: "电子邮件",
            sortable: true,
            editable: {
              type: "text",
              title: "电子邮件",
              emptytext: "空"
            }
          },
          {
            field: "created_at",
            title: "新建日期",
            sortable: true
          },
          {
            field: "enabled",
            title: "状态",
            sortable: true,
            editable: {
              type: "select",
              title: "状态",
              score: [{ text: "启用", value: 1 }, { text: "不启用", value: 0 }],
              emptytext: "空"
            }
          },
          {
            field: "remark",
            title: "备注",
            sortable: true,
            editable: {
              type: "textarea",
              title: "备注",
              emptytext: "空"
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: () => {
              let visit = [
                  `<button class="btn btn-success btn-sm visit">添加访问</button>`
                ],
                list = [
                  `<button class="btn btn-primary btn-sm list">访问记录</button>`
                ];
              return visit + list;
            },
            events: {
              "click .visit": (e, value, row, index) => {
                that
                  .$prompt("", "输入拜访地址", {})
                  .then(result => {
                    that
                      .$post(`customers/visit/create`, {
                        slug: value,
                        access_at: that.miniDateParse(new Date()),
                        address: result.value
                      })
                      .then(response => {
                        if (response.status != 200) return false;
                        that.refresh($("#table"));
                      })
                      .catch(err => {});
                  })
                  .catch(err => {});
              },
              "click .list": (e, value, row, index) => {
                $("#childTable").bootstrapTable("load", row.visit);
                $(".bs-example-modal-lg").modal("show");
              }
            }
          }
        ],
        onEditableSave(field, mrow, oldValue, $el) {
          that
            .$post(`customers/edit`, mrow)
            .then(response => {
              if (response.status != 200) return false;
            })
            .catch(err => {});
        },
        detailFormatter(field, mrow, oldValue, $el) {}
      });

      $("#childTable").bootstrapTable({
        toolbar: "#childToolbar",
        search: true,
        strictSearch: true,
        showRefresh: true,
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
            field: "access_at",
            title: "拜访时间",
            sortable: true
          },
          {
            field: "address",
            title: "拜访地点",
            sortable: true,
            editable: {
              type: "text",
              title: "拜访地点",
              emptytext: "空"
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: () => {
              let del = [
                `<button class="btn btn-danger btn-sm del">删除记录</button>`
              ];
              return del;
            },
            events: {
              "click .del": (e, value, row, index) => {
                that
                  .$get(`customers/visit/delete`, row)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#childTable"), "id", [row.id]);
                  })
                  .catch(err => {});
              }
            }
          }
        ],
        onEditableSave(field, mrow, oldValue, $el) {
          that
            .$post(`customers/visit/edit`, mrow)
            .then(response => {
              if (response.status != 200) return false;
            })
            .catch(err => {});
        }
      });
    }
  },
  mounted() {
    this.tableInit();
  }
};
</script>
<style lang="less">
#customer {
}
</style>
