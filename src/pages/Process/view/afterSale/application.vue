<template>
  <div id="application">
    <Qrmodel :url="url"></Qrmodel>
    <applyService :active="active" @refresh="refreshed"></applyService>
    <delegateUser :active="active" title="选择委派人员" type="customer" @refresh="refreshed"></delegateUser>
    <report :active="active"></report>
    <editApplication @refresh="refreshed" number="0" :row="row"></editApplication>
    <div id="toolbar">
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import Qrmodel from "@/pages/Process/common/afterSale/qrCode";
import applyService from "@/pages/Process/common/afterSale/applyService";
import delegateUser from "@/pages/Process/common/delegateUser";
import report from "@/pages/Process/common/afterSale/report";
import editApplication from "@/pages/Process/common/sale/createdCustomer";

export default {
  name: "application",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      url: '',
      active: {},
      tableData: [],
      row: {},
      geolocation: new BMap.Geolocation()
    };
  },
  components: {
    Qrmodel: Qrmodel,
    applyService: applyService,
    delegateUser: delegateUser,
    report: report,
    editApplication: editApplication
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
          that.tableData = response.data.list;
          that.$store.commit("changeTasks", {
            name: "/AfterSale/application",
            num: response.data.pagination.total
          });
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        search: params.search,
        // is_reported: 0,
        service_status: 0
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            sortable: true,
            formatter: function (value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qrcode",
            title: "二维码",
            sortable: true,
            formatter: function(value, row, index) {
              setTimeout(
                () =>
                  QRCode.toString(`https://www.factoryun.com/respositories/detail/${row.slug}`,
                    (err, string) =>
                      (document.getElementById(`application${row.id}`).innerHTML = string)
                  ),
                500
              );
              return `<div id="application${row.id}" class="img" style="margin: auto;"></div>`;
            },
            events: {
              "click .img": function($el, value, row, index) {
                that.url = 'aaaaaaaaaaaa';
                $("#application .qrCode").modal("show");
              }
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
            title: "客户公司名",
            editable: {
              type: "text",
              title: "客户公司名",
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
            title: "",
            formatter: (value, row, index) => {
              let del = `<button class="btn btn-danger del btn-sm">　删除　</button>`,
                edit = `<button class="btn btn-success edit btn-sm">　编辑　</button>`,
                apply = `<button class="btn btn-primary apply btn-sm">客服报价</button>`,
                delegate = `<button class="btn btn-warning delegate btn-sm">指派客服</button>`,
                sign = `<button class="btn btn-primary sign btn-sm">　打卡　</button>`,
                success = `<button class="btn btn-success success btn-sm">完成客服</button>`,
                report = `<button class="btn btn-warning report btn-sm">客服报告</button>`;
              if (row.process != 4) return sign + delegate + apply + report + success + del + edit;
              else return sign + delegate + apply + report + del + edit;
            },
            events: {
              "click .sign": function($el, value, row, index) {
                that.geolocation.getCurrentPosition(
                  function(r) {
                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                      that
                        .$post(`personnels/siginin/create`, {
                          work: "service",
                          signin_address: {
                            address:
                              r.address.province +
                              r.address.city +
                              r.address.district +
                              r.address.street,
                            x: r.longitude,
                            y: r.latitude
                          }
                        })
                        .then(response => {
                          if (response.status != 200) return false;
                          that
                            .$post(`service/bind_signin`, { signin_id: response.data.id, service_id: row.id })
                            .then(result => {
                              if (result.status != 200) return false;
                              that.$message({ message: "打卡成功", type: "success" });
                            })
                        })
                        .catch(err => console.error(err));
                    } else
                      that.$message({ message: "浏览器不支持获取定位", type: "error" });
                  },
                  { enableHighAccuracy: true }
                );
              },
              "click .del": ($el, value, row, index) => {
                that
                  .$post(`/service/delete/${value}`)
                  .then(response => {
                    that.delTable($("#table"), "id", [value]);
                  })
                  .catch(err => console.error(err));
              },
              "click .success": function($el, value, row, index) {
                that
                  .$post(`service/update_process/${value}`, { process: 4 })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.refreshed();
                  })
                  .catch(err => console.error(err));
              },
              "click .apply": ($el, value, row, index) => {
                that.active = row;
                applyService.methods.close.call(this);
              },
              "click .delegate": ($el, value, row, index) => {
                that.active = row;
                delegateUser.methods.close.call(this);
              },
              "click .report": ($el, value, row, index) => {
                that.active = row;
                $("#application #report").modal("show");
              },
              "click .edit": ($el, value, row, index) => {
                that.row = row;
                $("#application #createdCustomer").modal("show");
              }
            }
          }
        ],
        data = {
          toolbar: "#application #toolbar",
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
                  <td>${ e.order_no }</td>
                  <td>${ e.product_sn }</td>
                  <td>${ e.material_code }</td>
                  <td>${ e.material_specification }</td>
                  <td>${ e.material_name }</td>
                  <td>${ e.ship_date }</td>
                  <td>${ e.is_protected ? '否' : '是' }</td>
                  <td>${ e.problem }</td>
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
      $("#application #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#table"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#application {
  #table {
    svg {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
