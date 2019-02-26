<template>
  <div id="customer">
    <addCustomer @refresh="refreshed"></addCustomer>
    <addVisit :slug="slug" @refresh="refreshed"></addVisit>
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
      <router-link to="/customerMap" style="margin-left: 5px;">
        <el-button size="mini">附近客户</el-button>
      </router-link>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addCustomer from "@/pages/Process/common/addCustomer";
import addVisit from "@/pages/Process/common/addVisit";

export default {
  name: "customer",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      slug: ""
    };
  },
  components: {
    addCustomer: addCustomer,
    addVisit: addVisit
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
            editable: {
              type: "select",
              title: "状态",
              source: [{ text: "启用", value: 1 }, { text: "禁用", value: 0 }],
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
            formatter: (value, row, index) => {
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
                that.slug = value;
                addVisit.methods.close.call(this);
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
            field: "created_at",
            title: "创建时间",
            sortable: true
          },
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
            field: "together",
            title: "同行人",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "client_company",
            title: "公司名称",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "product_used",
            title: "所用产品",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "purchase_quantity_year",
            title: "年采购量",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "payment_method",
            title: "付款方式",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "business_content",
            title: "营业内容",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "contact",
            title: "联系人",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "mobile",
            title: "电话",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "customer_level",
            title: "客户等级",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "visiting_content",
            title: "拜访内容",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "market_status",
            title: "市场状态",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "suggestions",
            title: "建议事项",
            sortable: true,
            editable: {
              type: "text",
              title: "同行人",
              emptytext: "空"
            }
          },
          {
            field: "supervisor_reply",
            title: "主管回复",
            sortable: true
          },
          {
            field: "reply_at",
            title: "回复时间",
            sortable: true
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let del = [
                  `<button class="btn btn-danger btn-sm del">删除记录</button>`
                ],
                reply = [
                  `<button class="btn btn-primary btn-sm reply">主管回复</button>`
                ];
              if (row.is_reply) return reply + del;
              else return del;
            },
            events: {
              "click .reply": (e, slug, row, index) => {
                $(".bs-example-modal-lg").modal("hide");
                that
                  .$prompt("主管回复内容", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消"
                  })
                  .then(({ value }) => {
                    that
                      .$post(`customers/visit/reply`, {
                        slug: slug,
                        supervisor_reply: value
                      })
                      .then(response => {
                        $(".bs-example-modal-lg").modal("show");
                        if (response.status != 200) return false;
                        that.$message({ message: "回复成功", type: "success" });
                      })
                      .catch(err => {});
                  })
                  .catch(() => {});
              },
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
          mrow.access_at = that.miniDateParse(new Date(mrow.access_at));
          that
            .$post(`customers/visit/edit`, mrow)
            .then(response => {
              if (response.status != 200) return false;
              this.$message({ message: "修改成功", type: "success" });
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
