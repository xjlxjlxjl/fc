<template>
  <div id="customerServiceApplication">
    <createdCustomer @refresh="refreshed" number></createdCustomer>
    <applyService :active="active"></applyService>
    <delegateUser :active="active" title="选择通知客服" type="customer" @refresh="refreshed"></delegateUser>
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
import applyService from "@/pages/Process/common/afterSale/applyService";
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
            name: "/Sale/customerServiceApplication",
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
      this.refresh($("#customerServiceApplication #table"));
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter: function(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qrCode",
            title: "二维码",
            formatter: function(value, row, index) {
              return value;
            }
          },
          {
            field: "service_number",
            title: "客服申请单号",
            sortable: true
          },
          {
            field: "business_man_name",
            title: "申请人",
            editable: {
              type: "text",
              title: "申请人",
              emptytext: "空"
            }
          },
          {
            field: "created_at",
            title: "申请日期",
            sortable: true
          },
          {
            field: "customer_company_name",
            title: "客户公司名"
          },
          {
            field: "customer_linkman",
            title: "客户联系人",
            editable: {
              type: "text",
              title: "客户联系人",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "customer_contact",
            title: "联系电话",
            sortable: true,
            editable: {
              type: "text",
              title: "联系电话",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "address",
            title: "客服地址",
            sortable: true,
            editable: {
              type: "text",
              title: "客服地址",
              emptytext: "无",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "process_name",
            title: "处理进度"
          },
          {
            field: "id",
            title: "操作",
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
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>序号</td>
                    <td>订单编号</td>
                    <td>产品SN码</td>
                    <td>料品编码</td>
                    <td>料品规格</td>
                    <td>料品名称</td>
                    <td>出货日期</td>
                    <td>是否过保</td>
                    <td>产品故障描述</td>
                    <td>图片</td>
                  </tr>
            `;
            mrow.business_files.forEach((e, k) => {
              content += `
                <tr>
                  <td>${ k + 1 }</td>
                  <td>${ e.order_number }</td>
                  <td>${ e.sn }</td>
                  <td>${ e.code }</td>
                  <td>${ e.specification }</td>
                  <td>${ e.name }</td>
                  <td>${ e.date }</td>
                  <td>${ e.guarantee }</td>
                  <td>${ e.desc }</td>
                  <td>
                    <a href="${ e.url }" target="_blank">
                      <img src="${ e.url }" style="max-width: 50px;max-height: 50px;">
                    </a>
                  </td>
                </tr>
              `
            });
            content += `</tbody></table>`;
            return content;
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
