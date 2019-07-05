<template>
  <div id="customerServiceApplication">
    <createdCustomer @refresh="refreshed" number="0" :row="row"></createdCustomer>
    <applyService :active="active"></applyService>
    <delegateUser :active="active" title="选择通知客服" type="customer" @refresh="refreshed"></delegateUser>
    <!-- <editServicePrice :active="active" @refresh="refreshed"></editServicePrice> -->
    <div id="toolbar">
      <span class="lead">客服申请表</span>
      <el-button size="mini" @click="addApplication">新建</el-button>
      <!-- <el-button size="mini" @click="readyToService">发送客服</el-button> -->
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import createdCustomer from "@/pages/Process/common/sale/createdCustomer";
import applyService from "@/pages/Process/common/afterSale/applyService";
import delegateUser from "@/pages/Process/common/delegateUser";
// import editServicePrice from "@/pages/Process/common/editServicePrice";

export default {
  name: "customerServiceApplication",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      active: {},
      tableData: [],
      row: {}
    };
  },
  components: {
    createdCustomer: createdCustomer,
    applyService: applyService,
    delegateUser: delegateUser,
    // editServicePrice: editServicePrice
  },
  methods: {
    tableAjaxData(params) {
      let that = this, loading = this.$loading({ lock: true, background: "rgba(0, 0, 0, 0.7)" });
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
            field: "qr_code_text",
            title: "二维码",
            formatter: function(value, row, index) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById( `saleApplication${row.id}` ).innerHTML = string)), 500)
              return `<svg id="saleApplication${row.id}" style="max-width: 50px;max-height: 50px;"></svg>`;
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
            field: "customer_other_contact",
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
              let del = '<button class="btn btn-danger del btn-sm">　删除　</button>',
                edit = `<button class="btn btn-success edit btn-sm">　编辑　</button>`,
                finish = `<button class="btn btn-primary finish btn-sm">完成客服</button>`,
                service = '<button class="btn btn-success service btn-sm">指派客服</button>',
                delegate = '<button class="btn btn-warning service btn-sm">委派人员</button>',
                discountPrice = '<button class="btn btn-success discountPrice btn-sm">优 惠 价</button>';

                if (row.process != 5) return delegate + finish + edit + del;
                else return delegate + edit + del;
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
              "click .edit": function($el, value, row, index) {
                that.row = row;
                that.addApplication();
              },
              "click .finish": function($el, value, row, index) {
                that
                  .$post(`service/update_process/${value}`, { process: 5 })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.refreshed();
                  })
                  .catch(err => console.error(err));
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
                // editServicePrice.methods.close.call(this);
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
            mrow.orders.forEach((e, k) => {
              content += `
                <tr>
                  <td>${ k + 1 }</td>
                  <td>${ e.order_no || '' }</td>
                  <td>${ e.product_sn || '' }</td>
                  <td>${ e.material_code || '' }</td>
                  <td>${ e.material_specification || '' }</td>
                  <td>${ e.material_name || '' }</td>
                  <td>${ e.ship_date || '' }</td>
                  <td>${ e.is_protected ? '否' : '是' }</td>
                  <td>${ e.problem || '' }</td>
                  <td>`;
                
                for (const item of e.images_url) {
                  content += `
                    <a href="${ item.url }" target="_blank">
                      <img src="${ item.url }" style="max-width: 50px;max-height: 50px;">
                    </a>
                  `;
                }
              content += `</td></tr>`;
              
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
