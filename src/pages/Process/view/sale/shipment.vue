<template>
  <div id="shipment">
    <addShipment :shipment="shipment" @refresh="refreshed"></addShipment>
    <div class="modal fade bs-example-modal-lg" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div ref="print" id="shipmentOrder" style="text-align: center;">
            <h3>{{ printDetail.company.name }}</h3>
            <div style="width: 450px; margin: 20px auto;">
              <p
                style="width: 100%;white-space: nowrap;text-align: left;"
              >地址：{{ printDetail.company.address }}</p>
              <p
                style="width: 100%;white-space: nowrap;text-align: left;display: flex;justify-content: space-between;"
              >
                <span>电话：{{ printDetail.company.contact_phone }}</span>
                <span>传真：{{ printDetail.company.fax }}</span>
              </p>
            </div>
            <h3>销售出货单</h3>
            <div style="width: 800px;margin: 20px auto;">
              <p
                style="width: 100%;white-space: nowrap;display: flex;justify-content: space-between;"
              >
                <span>客户：{{ printDetail.customer_name }}</span>
                <span>单号：{{ printDetail.ship_order_no }}</span>
              </p>
              <p
                style="width: 100%;white-space: nowrap;display: flex;justify-content: space-between;"
              >
                <span>地址：{{ printDetail.receipt_address }}</span>
                <span>业务员：{{ printDetail.salesman }}</span>
                <span>日期：{{ printDetail.ship_date }}</span>
              </p>
              <p
                style="width: 100%;white-space: nowrap;display: flex;justify-content: space-between;"
              >
                <span>电话：{{ printDetail.phone }}</span>
                <span>联系人：{{ printDetail.consignee }}</span>
              </p>
            </div>
            <table
              style="width: 870px;margin: 0 auto;border-top: none;border-bottom: 1px solid #ddd;"
            >
              <tr style="border-top: 1px solid #ddd;">
                <td style="border-left: 1px solid #ddd;padding: 5px;">序号</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">订单号</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">料品编码</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">品名/规格</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">单位</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">数量</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">客户货号</td>
                <td
                  style="border-left: 1px solid #ddd;border-right: 1px solid #ddd;padding: 5px;"
                >客户订单号</td>
              </tr>
              <tr
                style="border-top: 1px solid #ddd;"
                v-for="(item, key) in printDetail.items"
                :key="item.id"
              >
                <td style="border-left: 1px solid #ddd;padding: 5px;">{{ key }}</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">{{ item.order_no }}</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">{{ item.item_code }}</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">{{ item.item_name }}</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">{{ item.item_unit }}</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">{{ item.item_num }}</td>
                <td style="border-left: 1px solid #ddd;padding: 5px;">{{ item.customer_goods_no }}</td>
                <td
                  style="border-left: 1px solid #ddd;border-right: 1px solid #ddd;padding: 5px;"
                >{{ item.customer_order_no }}</td>
              </tr>
            </table>
            <div
              style="width: 870px;margin: 0 auto;border-left: 1px solid #ddd;border-right: 1px solid #ddd;border-bottom: 1px solid #ddd;margin-bottom: 20px;padding: 5px;display: flex;justify-content: space-around;"
            >
              <span>合计</span>
              <span>{{ printDetail.total_amount }}</span>
            </div>
            <p style="text-align: left;">
              <span style="margin-left: 20px;">备注</span>
              <span style="margin-left: 20px;">客户订单号：{{ printDetail.ship_order_no }}</span>
            </p>
          </div>
          <div align="right" style="padding: 15px;">
            <button class="btn btn-primary btn-small" @click="print">打印</button>
          </div>
        </div>
      </div>
    </div>
    <div id="toolbar">
      <span class="lead">出货申请单</span>
      <!-- <el-button size="mini" @click="addSale">创建出货单</el-button> -->
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addShipment from "@/pages/Process/common/addShipment";

export default {
  name: "shipment",
  data() {
    return {
      shipment: {
        customer_name: "",
        salesman: "",
        mobile: "",
        receipt_address: ""
      },
      printDetail: {
        company: {},
        items: []
      }
    };
  },
  components: {
    addShipment: addShipment
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`ship_orders`, params.data)
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
      return params;
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "created_user",
            title: "出库申请人",
            sortable: true,
            formatter: (value, row, index) => {
              return `${value ? value.display_name : "无"}`;
            }
          },
          {
            field: "ship_order_no",
            title: "发货单号",
            sortable: true
          },
          {
            field: "customer_name",
            title: "客户名称",
            sortable: true,
            editable: {
              type: "text",
              title: "客户名称",
              emptytext: "空"
            }
          },
          // {
          //   field: "total_amount",
          //   title: "总金额",
          //   sortable: true,
          //   editable: {
          //     type: "text",
          //     title: "总金额",
          //     emptytext: "空"
          //   }
          // },
          {
            field: "ship_date",
            title: "发货日期",
            sortable: true,
            editable: {
              type: "text",
              title: "发货日期",
              emptytext: "空"
            }
          },
          {
            field: "salesman",
            title: "销售人员",
            sortable: true,
            editable: {
              type: "text",
              title: "销售人员",
              emptytext: "空"
            }
          },
          {
            field: "ship_address",
            title: "发货地址",
            sortable: true,
            editable: {
              type: "text",
              title: "发货地址",
              emptytext: "空"
            }
          },
          {
            field: "consignee",
            title: "客户公司/客户联系人",
            sortable: true,
            editable: {
              type: "text",
              title: "客户公司/客户联系人",
              emptytext: "空"
            }
          },
          {
            field: "mobile",
            title: "客户手机",
            sortable: true,
            editable: {
              type: "text",
              title: "客户手机",
              emptytext: "空"
            }
          },
          {
            field: "phone",
            title: "客户电话",
            sortable: true,
            editable: {
              type: "text",
              title: "客户电话",
              emptytext: "空"
            }
          },
          // {
          //   field: "address",
          //   title: "客户地址",
          //   sortable: true,
          //   editable: {
          //     type: "text",
          //     title: "客户地址",
          //     emptytext: "空"
          //   }
          // },
          {
            field: "ship_method",
            title: "发货方式",
            sortable: true,
            editable: {
              type: "text",
              title: "发货方式",
              emptytext: "空"
            }
          },
          // {
          //   field: "receipt_amount",
          //   title: "收款金额",
          //   sortable: true,
          //   editable: {
          //     type: "text",
          //     title: "收款金额",
          //     emptytext: "空"
          //   }
          // },
          {
            field: "receipt_address",
            title: "收件人地址",
            sortable: true,
            editable: {
              type: "text",
              title: "收件人地址",
              emptytext: "空"
            }
          },
          {
            field: "receipt_name",
            title: "收件人名称",
            sortable: true,
            editable: {
              type: "text",
              title: "收件人名称",
              emptytext: "空"
            },
            formatter: (value, row, index) => {
              return `${
                value ? value : row.customer_name ? row.customer_name : "无"
              }`;
            }
          },
          {
            field: "receipt_mobile",
            title: "收件人手机",
            sortable: true,
            editable: {
              type: "text",
              title: "收件人手机",
              emptytext: "空"
            }
          },
          {
            field: "remark",
            title: "备注",
            sortable: true,
            editable: {
              type: "text",
              title: "备注",
              emptytext: "空"
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let print = `<button class="btn btn-primary btn-sm print">打印</button>`;
              return print;
            },
            events: {
              "click .print": (e, value, row, index) => {
                that
                  .$get(`ship_order/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.printDetail = response.data;
                    $(".bs-example-modal-lg").modal("show");
                  })
                  .catch(err => console.error);
              }
            }
          }
        ],
        data = {
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
          detailView: true,
          columns: columns,
          onEditableSave(field, mrow, oldValue, $el) {
            that
              .$post(`ship_order/edit/${mrow.slug}`, mrow)
              .then(response => {
                if (response.status != 200) return false;
              })
              .catch(err => {});
          },
          detailFormatter(field, mrow, oldValue, $el) {
            let content = [
              `<table class="table">`,
              `<tr><th>序号</th><th>订单号</th><th>料品编码</th><th>品名/规格</th><th>单位</th><th>数量</th><th>客户货号</th><th>客户订单号</th><th>备注</th></tr>`
            ];
            mrow.items.forEach(e =>
              content.push(
                ` <tr><td>${e.order_id}</td><td>${e.order_no}</td><td>${
                  e.item_code
                }</td><td>${e.item_name}</td><td>${e.item_unit}</td><td>${
                  e.item_num
                }</td><td>${e.customer_goods_no}</td><td>${
                  e.customer_order_no
                }</td><td>${e.remark}</td></tr>`
              )
            );
            content.push(`</table>`);
            return content.join("");
          }
        };
      $("#table").bootstrapTable(data);
    },
    print() {
      this.$print(this.$refs.print);
      $("#myModal").modal("hide");
    },
    addSale() {
      addShipment.methods.close.call(this);
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
#shipment {
}
</style>
