<template>
  <div id="order">
    <addOrderModal :row="row" @refresh="refreshed"></addOrderModal>
    <!-- <addShipment :shipment="shipment" :goods="goods" @refresh="refreshed"></addShipment> -->
    <serviceApplication></serviceApplication>
  
    <div class="modal fade" id="contractMiniModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <table class="table table-bordered">
              <tbody>
                <tr>
                  <td>合同</td>
                  <td>上传日期</td>
                </tr>
                <tr v-for="item in contractList" :key="item.date">
                  <td><a href="javascript:;" @click="showPDF(item.url)">{{ item.name }}</a></td>
                  <td>{{ item.created_at }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer" style="text-align: center;">
            <el-button type="info" data-dismiss="modal">关闭</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 合同 -->
    <div class="modal fade" id="contractModal" role="dialog">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
          <div class="modal-body" id="canvasBox"></div>
        </div>
      </div>
    </div>
    <!-- 发票 -->
    <div class="modal fade" id="invoiceModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <table class="table table-bordered">
              <tbody>
                <tr>
                  <td>发票</td>
                  <td>上传日期</td>
                </tr>
                <tr v-for="item in invoiceData" :key="item.date">
                  <td><a :href="item.url">{{ item.name }}</a></td>
                  <td>{{ item.created_at }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer" style="text-align: center;">
            <el-button type="info" data-dismiss="modal">关闭</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 出货计划 -->
    <div class="modal fade" id="shipping_schedule" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <table class="table table-bordered">
              <tbody>
                <tr>
                  <td>出货日期</td>
                  <td>出货数量</td>
                </tr>
                <tr v-for="item in shipping_schedule" :key="item.date">
                  <td>{{ item.date }}</td>
                  <td>{{ item.number }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer" style="text-align: center;">
            <el-button type="info" data-dismiss="modal">关闭</el-button>
          </div>
        </div>
      </div>
    </div>

    <div id="toolbar">
      <span class="lead">销售订单</span>
      <el-button size="mini" :goods="goods" @click="row = { id:0 };addOrder()">新建销售订单</el-button>
      <!-- <el-button size="mini" @click="addSale">新建出货单</el-button> -->
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import PDFJS from "pdfjs-dist";
import QRCode from "qrcode";
import addOrderModal from "@/pages/Process/common/sale/addOrderModal";
import serviceApplication from "@/pages/Process/common/sale/serviceApplication";
// import addShipment from "@/pages/Process/common/sale/addShipment";

export default {
  name: "saleOrder",
  data() {
    return {
      row: {
        id: 0
      },
      invoiceData: [],
      shipment: {
        customer_name: "",
        salesman: "",
        mobile: "",
        receipt_address: "",
        invoiceData: []
      },
      goods: [],

      // pdf
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      scale: 1,

      contractList: [],
      shipping_schedule: []
    };
  },
  components: {
    addOrderModal: addOrderModal,
    // addShipment: addShipment,
    serviceApplication: serviceApplication
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`orders/company`, params.data)
        .then(response => {
          if (response.status != 200) {
            params.success({
              rows: [],
              total: 0
            });
            return false;
          }
          that.$store.commit("changeTasks", {
            name: "/Sale/order",
            num: response.data.pagination.total
          });
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      return params;
    },
    addOrder() {
      addOrderModal.methods.close.call(this);
    },
    addSale() {
      let arr = this.getData($("#table"));
      this.goods = [];
      arr.forEach((e, k) => {
        if (!k)
          this.shipment = {
            customer_name: e.consignee,
            salesman: e.created_by_name,
            mobile: e.mobile,
            receipt_address: e.address
          };

        e.products.forEach(p =>
          this.goods.push({
            order_id: e.id,
            order_no: e.numbering,
            item_id: p.id,
            item_code: p.product_model,
            item_name: `${p.product_name} / ${p.product_model}`,
            item_unit: p.unit || "件",
            item_num: p.quantity,
            customer_goods_no: "",
            customer_order_no: e.numbering,
            remark: p.product_specification
          })
        );
      });
      // addShipment.methods.close.call(this);
    },
    refreshed() {
      this.refresh($("#order #table"));
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            sortable: true,
            formatter(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "img",
            title: "二维码",
            formatter(value, row, index) {
              setTimeout(
                () =>
                  QRCode.toString(
                    `https://www.factoryun.com/orders/orders/${row.numbering}`,
                    (err, string) =>
                      (document.getElementById(`saleOrder${row.id}`).innerHTML = string)
                  ),
                500
              );
              return `<div id="saleOrder${row.id}" class="img" style="max-width: 85px;max-height: 85px;margin: auto;"></div>`;
            },
            events: {
              "click .img": function(e, value, row, index) {
              }
            }
          },
          {
            field: "numbering",
            title: "销售订单号",
            sortable: true
          },
          {
            field: "created_at",
            title: "下单日期",
            sortable: true
          },
          {
            field: "delivery_period",
            title: "客户要求交期",
            sortable: true
          },
          {
            field: "clerk_name",
            title: "业务员",
            sortable: true
          },
          {
            field: "total_price",
            title: "订单总金额",
            sortable: true
          },
          {
            field: "currency",
            title: "币别",
            sortable: true
          },
          {
            field: "consignee",
            title: "收货人",
            sortable: true
          },
          {
            field: "contract_mobile",
            title: "收货人手机",
            sortable: true
          },
          {
            field: "address",
            title: "收货地址",
            sortable: true
          },
          {
            field: "postcode",
            title: "邮政编码",
            sortable: true
          },
          {
            field: "customer_code",
            title: "客户编码",
            sortable: true
          },
          {
            field: "customer_name",
            title: "客户名",
            sortable: true
          },
          {
            field: "contract",
            title: "联系人",
            sortable: true
          },
          {
            field: "contract_mobile",
            title: "手机号",
            sortable: true
          },
          {
            field: "status",
            title: "订单状态",
            sortable: true,
            formatter(value, row, index) {
              return `${value ? "已关闭" : "未关闭"}`;
            }
          },
          {
            field: "pay_status",
            title: "支付状态",
            sortable: true,
            formatter(value, row, index) {
              return `${value ? "已支付" : "未支付"}`;
            }
          },
          {
            field: "order_status",
            title: "合同状态",
            sortable: true
          },
          {
            field: "operate_status",
            title: "排单状态",
            sortable: true,
            formatter(value, row, index) {
              return `${value ? "已排单" : "未排单"}`;
            }
          },
          {
            field: "check_status_name",
            title: "审核状态",
            sortable: true,
            formatter(value, row, index) {
              return `${value || "待审核"}`;
            }
          },
          {
            field: "delivery_method",
            title: "送货方式",
            sortable: true
          },
          {
            field: "packing_method",
            title: "包装方式",
            sortable: true
          },
          {
            field: "terms_of_payment",
            title: "付款条件",
            formatter(value, row, index) {
              let payment = `<button class="payment btn btn-sm btn-primary">付款条件</button>`;
              return payment;
            },
            events: {
              "click .payment": function(event, value, row, index) {
                that.$alert( value ? value.text : '无', '付款条件', {
                  confirmButtonText: '确定',
                  center: true
                });
              }
            }
          },
          {
            field: "terms_of_contract",
            title: "合同",
            formatter(value, row, index) {
              let contract = `<button class="contract btn btn-sm btn-primary">查看合同</button>`;
              return contract;
            },
            events: {
              "click .contract": function(event, value, row, index) {
                that.contractList = row.contract_files;
                $("#order #contractMiniModal").modal("show");
                // this.showPDF('https://factoryun.oss-cn-shenzhen.aliyuncs.com/kl6666_aliyun_oss/lwhwm2ltrz4f/LK140-XXXX-103-289 承认图.PDF');
                // $("#order #contractModal").modal("show");
              }
            }
          },
          {
            field: "invoice_record",
            title: "发票记录",
            formatter(value, row, index) {
              let invoice = `<button class="invoice btn btn-sm btn-primary">查看发票</button>`;
              return invoice;
            },
            events: {
              "click .invoice": function(event, value, row, index) {
                that.invoiceData = row.invoice_files;
                $("#order #invoiceModal").modal("show");
              }
            }
          },
          {
            field: "slug",
            title: "操作",
            sortable: true,
            formatter(value, row, index) {
              let schedule = `<button class="schedule btn btn-sm btn-success">添加排单</button>`,
                server = `<button class="server btn btn-sm btn-danger">申请客服</button>`,
                upload = `
                  <input type="file" class="upload" style="position: absolute;opacity: 0; width: 68px;height: 28px;">
                  <button class="btn btn-sm btn-primary">上传合同</button>
                `,
                print = `<a href="/print.html#/saleOrder/${row.id}" target="_blank">
                  <button class="print btn btn-sm btn-primary">　打印　</button>
                </a>`,
                edit = `<button class="edit btn btn-sm btn-success">　编辑　</button>`,
                del = `<button class="del btn btn-sm btn-danger">　删除　</button>`;
              if (!row.operate_status) return `<div style="position: relative">${upload + schedule + server + print + edit + del}</div>`;
              else return `<div style="position: relative">${upload + server + print + edit + del}</div>`;
            },
            events: {
              "click .schedule": function(event, value, row, index) {
                // let arr = [];
                // row.items.forEach((e, k) => {
                //   arr.push({
                //     id: e.material_id,
                //     cancel_count: k + 1,
                //     wait_count: k + 2,
                //     spare_count: k + 3
                //   })
                // });
                // that
                //   .$post(`repositories/material/receive/create`, {
                //     sale_order_id: row.id,
                //     materials: arr
                //   })

                that
                  .$get(`schedule/create`, { slug: row.slug })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.$message({
                      message: '已生成智能计划',
                      type: 'success'
                    });
                  })
                  .catch(e => console.error(e));
              },
              "click .edit": function(event, value, row, index) {
                that.row = row;
                $("#order #addOrderModal").modal("show");
              },
              "click .del": function(event, value, row, index) {
                that.$get(`orders/close/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.$message({ message: "关闭成功", type: "success" });
                    // that.delTable($("#order #table"), "id", [row.id]);
                  })
                  .catch(err => console.error(err));
              },
              "click .server": function() {
                $("#order #serviceApplication").modal("show");
              },
              "change .upload": function(event, value, row, index) {
                for (let k in $(this)[0].files) {
                  if(isNaN(parseInt(k))) return false;
                  let form = new FormData();
                  form.append("upload", $(this)[0].files[k]);
                  form.append("slug", "order_module");
                  that
                    .$upload("files/upload", form)
                    .then(response => {
                      if (response.status != 200) return false;
                      let arr = [response.data.upload.id];
                      row.contract_files.forEach(e => arr.push(e.id));
                      row.items.forEach(e => {
                        e.price = e.purchase_price;
                        e.shipping_schedule = JSON.stringify(e.shipping_schedule)
                      });
                      that.editAjaxData(row.id, {
                        customer_id: row.customer_id,
                        contact: row.contact,
                        contact_mobile: row.contact_mobile,
                        clerk_id: row.clerk_id,
                        consignee: row.consignee,
                        mobile: row.mobile,
                        address: row.address,
                        delivery_period: row.delivery_period || that.dateParse(new Date()),
                        items: row.items,
                        contract_file_id: arr.join(',')
                      });
                    })
                    .catch(err => console.error(err));
                }
              }
            }
          }
        ],
        data = {
          toolbar: "#order #toolbar",
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
          idField: "id",
          showToggle: true,
          showExport: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: columns,
          onEditableSave(field, mrow, oldValue, $el) {},
          detailFormatter(field, mrow, oldValue, $el) {
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th>序号</th>
                    <th>图片</th>
                    <th>料品编码</th>
                    <th>料品名称</th>
                    <th>料品规格</th>
                    <th>单位</th>
                    <th>数量</th>
                    <th>出货计划</th>
                    <th>备注</th>
                    <th>单价</th>
                    <th>已出货数量（日期）</th>
                    <th>未出货数量</th>
                    <th>结案</th>
                  </tr>
            `;
            mrow.items.forEach((e, k) => {
              let date = '', images = '';
              for (let item of e.shipping_schedule) {
                if (new Date(item.date) <= new Date)
                  date = item.date;
              }
              if (typeof e.images == Array)
                e.images.forEach(e => images += `<a href="${e}" target="_blank"><img src="${e}" style="max-width:50px;max-height: 50px;"></a>`);
              
              content += `<tr>
                  <td>${k + 1}</td>
                  <td>${images}</td>
                  <td>${e.material_code}</td>
                  <td>${e.material_name}</td>
                  <td>${e.material_specification}</td>
                  <td>${e.material_unit}</td>
                  <td>${e.quantity}</td>
                  <td><button class="btn btn-sm shipping_schedule" index="${field}" k="${k}">查看</button></td>
                  <td>${e.remark}</td>
                  <td>${e.purchase_price / e.quantity}</td>
                  <td>${e.shipped_quantity}(${date})</td>
                  <td>${e.quantity - e.delivery_period}</td>
                  <td><input type="checkbox" class="closed" value="${mrow.id}" ${e.closed ? 'checked="checked"' : '' }></td>
                </tr>`;
            })
            content += `</tbody></table>`;
            return content;
          }
        };
      $("#order #table").bootstrapTable(data);
    },
    editAjaxData(id, params) {
      this
        .$post(`orders/company/edit/${id}`, params)
        .then(result => {
          if (result.status != 200) return false;
          console.log(result)
          this.refreshed();
        }).catch(err => console.error(err));
    },
    showPDF(url) {
      let _this = this;
      $("#order #contractModal").modal("show");
      PDFJS.getDocument(url).then(function(pdf) {
        _this.pdfDoc = pdf;
        for (let i = 1; i < pdf.numPages + 1; i++) {
          if (i == 1) $("#canvasBox").empty();
          _this.renderPage(i);
        }
      });
    },
    renderPage(num) {
      this.pageRendering = true;
      let _this = this;
      this.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(_this.scale);
        // let canvas = document.getElementById("the-canvas");
        let canvas = document.createElement("canvas");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: canvas.getContext("2d"),
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        document.getElementById("canvasBox").appendChild(canvas);
        // Wait for rendering to finish
        renderTask.promise.then(function() {
          _this.pageRendering = false;
          if (_this.pageNumPending !== null) {
            // New page rendering is pending
            _this.renderPage(_this.pageNumPending);
            _this.pageNumPending = null;
          }
        });
      });
    }
  },
  mounted() {
    this.init();
    const that = this;
    $("#order").on("click", ".shipping_schedule", function(e) {
      let data = that.getAllData($("#order #table")),
        index = $(this).attr("index"),
        k = $(this).attr("k");
        that.shipping_schedule = data[index].items[k].shipping_schedule;
        $("#order #shipping_schedule").modal("show");
    });
    $("#order").on("change", ".closed", function(e) {
      console.log($(this).val())
    })
  }
};
</script>
<style lang="less">
#order {
  #contractModal {
    canvas {
      max-width: 100%;
    }
  }
}
</style>
