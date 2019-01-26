<template>
  <div id="customerServiceApplication">
    <createdCustomer @refresh="refreshed" number></createdCustomer>
    <applyService :active="active"></applyService>
    <delegateUser :active="active" title="选择通知客服" @refresh="refreshed"></delegateUser>
    <editServicePrice :active="active" @refresh="refreshed"></editServicePrice>
    <div id="toolbar">
      <span class="lead">客服申请表</span>
      <el-button size="mini" @click="addApplication">新建</el-button>
      <!-- <el-button size="mini" @click="readyToService">发送客服</el-button> -->
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import createdCustomer from "@/pages/Process/common/createdCustomer";
import applyService from "@/pages/Process/common/applyService";
import delegateUser from "@/pages/Process/common/delegateUser";
import editServicePrice from "@/pages/Process/common/editServicePrice";

export default {
  name: "customerServiceApplication",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      active: {},
      tableData: []
    };
  },
  components: {
    createdCustomer: createdCustomer,
    applyService: applyService,
    delegateUser: delegateUser,
    editServicePrice: editServicePrice
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("service/list", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$store.commit("changeTasks", {
            name: "customerServiceApplication",
            num: response.data.pagination.total
          });
          that.tableData = response.data.list;
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      return {
        search: params.search || undefined,
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        service_status: 0
      };
    },
    addApplication() {
      createdCustomer.methods.close.call(this);
    },
    readyToService() {
      this.sendToService(this.getTableAttr($("#table"), "id"));
    },
    sendToService(arr) {
      let that = this;
      arr.forEach(value => {
        that
          .$post(`service/send/customer/service/${value}`)
          .then(response => {
            if (response.status != 200) return false;
            that.refreshed();
          })
          .catch(err => {});
      });
    },
    refreshed() {
      this.refresh($("#table"));
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "service_number",
            title: "客服申请单号",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建日期",
            sortable: true
          },
          {
            field: "business_man_name",
            title: "申请联系人",
            editable: {
              type: "text",
              title: "申请联系人",
              emptytext: "空"
            }
          },
          {
            field: "customer_demand",
            title: "问题描述",
            editable: {
              type: "text",
              title: "问题描述",
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
              emptytext: "无",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "specification",
            title: "规格",
            sortable: true,
            editable: {
              type: "text",
              title: "规格",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "process_name",
            title: "订单处理状态"
          },
          {
            field: "deal_mans",
            title: "委派人员",
            sortable: true,
            formatter: (value, row, index) => {
              return row.deal_mans.join(",");
            }
          },
          {
            field: "price",
            title: "总价",
            // editable: {
            //   type: "number",
            //   title: "总价",
            //   emptytext: "未报价",
            //   validate: v => {
            //     if (!v) return "不能为空";
            //   }
            // },
            formatter: (value, row, index) => {
              return `${value || "未报价"}`;
            }
          },
          {
            field: "discount_price",
            title: "优惠价",
            // editable: {
            //   type: "number",
            //   title: "优惠卷",
            //   emptytext: "未报价",
            //   validate: v => {
            //     if (!v) return "不能为空";
            //   }
            // },
            formatter: (value, row, index) => {
              return `${value || "未报价"}`;
            }
          },
          {
            field: "yingshou",
            title: "应收价",
            formatter: (value, row, index) => {
              return `${row.price ? row.price - row.discount_price : "未报价"}`;
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
              type: "text",
              title: "备注",
              emptytext: "空"
            }
          },
          {
            field: "id",
            title: "",
            formatter: (value, row, index) => {
              let del = [
                '<button class="btn btn-danger del btn-sm">　删除　</button>'
              ];
              let service = [
                '<button class="btn btn-success service btn-sm">提交客服</button>'
              ];
              let delegate = [
                '<button class="btn btn-warning delegate btn-sm">委派人员</button>'
              ];
              let discountPrice = [
                '<button class="btn btn-success discountPrice btn-sm">优 惠 价</button>'
              ];
              switch (row.process) {
                case 0:
                case 1:
                  return service + del;
                  break;
                case 2:
                  if (row.quoted_price.price != undefined) {
                    return discountPrice + del;
                  } else return del;
                  break;
                default:
                  return del;
                  break;
              }
            },
            events: {
              "click .del": ($el, value, row, index) => {
                that
                  .$post(`/service/delete/${value}`)
                  .then(response => {
                    that.delTable($("#table"), "id", [value]);
                  })
                  .catch(err => {});
              },
              "click .service": ($el, value, row, index) => {
                // applyService.methods.close.call(this);
                // that.sendToService([value]);
                that.active = row;
                delegateUser.methods.close.call(this);
              },
              "click .apply": ($el, value, row, index) => {
                that.active = row;
                applyService.methods.close.call(this);
              },
              "click .discountPrice": ($el, val, row, index) => {
                that.active = row;
                editServicePrice.methods.close.call(this);
              }
            }
          }
        ],
        data = {
          toolbar: "#customerServiceApplication #toolbar",
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
          onEditableSave(field, mrow, oldValue, $el) {
            that
              .$post(`/service/edit/${mrow.id}`, mrow)
              .then(response => {
                if (response.status != 200) return false;
                this.refreshed();
              })
              .catch(err => {});
          },
          detailFormatter(field, mrow, oldValue, $el) {
            let html = [];
            if (mrow.customer_files.length) {
              html.push(
                `<p class="lead" align="left">客户上传文件</p><ul class="list-inline" align="left">`
              );
              mrow.customer_files.forEach(e => {
                let ess = e.url.split(".").pop();
                switch (ess) {
                  case "jpg":
                  case "png":
                  case "jpeg":
                    html.push(
                      `<li><a href="${e.url}" target="_blank"><img src="${
                        e.url
                      }" class="img-rounded" style="width: 100px;"></a></li>`
                    );
                    break;
                  default:
                    html.push(
                      `<li><a href="${e.url}" target="_blank">${e.url
                        .split("/")
                        .pop()}</a></li>`
                    );
                    break;
                }
              });
              html.push(`</ul>`);
            }
            if (mrow.business_files.length) {
              html.push(
                `<p class="lead" align="left">业务上传文件</p><ul class="list-inline" align="left">`
              );
              mrow.business_files.forEach(e => {
                let ess = e.url.split(".").pop();
                switch (ess) {
                  case "jpg":
                  case "png":
                  case "jpeg":
                    html.push(
                      `<li><a href="${e.url}" target="_blank"><img src="${
                        e.url
                      }" class="img-rounded" style="width: 100px;"></a></li>`
                    );
                    break;
                  default:
                    html.push(
                      `<li><a href="${e.url}" target="_blank">${e.url
                        .split("/")
                        .pop()}</a></li>`
                    );
                    break;
                }
              });
              html.push(`</ul>`);
            }
            if (mrow.service_files.length) {
              html.push(
                `<p class="lead" align="left">客服上传文件</p><ul class="list-inline" align="left">`
              );
              mrow.service_files.forEach(e => {
                let ess = e.url.split(".").pop();
                switch (ess) {
                  case "jpg":
                  case "png":
                  case "jpeg":
                    html.push(
                      `<li><a href="${e.url}" target="_blank"><img src="${
                        e.url
                      }" class="img-rounded" style="width: 100px;"></a></li>`
                    );
                    break;
                  default:
                    html.push(
                      `<li><a href="${e.url}" target="_blank">${e.url
                        .split("/")
                        .pop()}</a></li>`
                    );
                    break;
                }
              });
              html.push(`</ul>`);
            }
            return html.join("");
          }
        };
      $("#customerServiceApplication #table").bootstrapTable(data);
    }
  },
  mounted() {
    this.init();
  },
  created() {}
};
</script>
