<template>
  <div id="purchaseOrder">
    <addOrderModal></addOrderModal>
    <div
      class="modal fade"
      id="purchaseOrderPrintModal"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div
              ref="purchaseOrderPrint"
              style="display: flex;padding: 15px;margin: auto;width: 540px;"
            >
              <div
                id="purchaseOrderPrintImg"
                style="width: 160px;padding: 15px;border-top: 1px solid;border-left: 1px solid;border-bottom: 1px solid;"
              ></div>
              <div style="width: 100px;border: 1px solid;">
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;"
                >公司</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >单号</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >创建日期</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >创建人</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                ></div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                ></div>
              </div>
              <div
                style="width: 240px;border-top: 1px solid;border-bottom: 1px solid;border-right: 1px solid;"
              >
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;"
                >{{ modalData.company }}</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >{{ modalData.number }}</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >{{ modalData.created_at }}</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >{{ modalData.created_by }}</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                ></div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                ></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-info btn-small" @click="printing">打印</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade contract" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <table class="table table-bordered" style="margin-bottom: 0;">
              <tbody>
                <tr>
                  <th>合同</th>
                  <th>上传日期</th>
                </tr>
                <tr>
                  <td><button class="btn btn-link" @click="showPDF('https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/non_standard_requirements/Using%20the%20i-20190109045615.pdf')">1111111</button></td>
                  <td>2019-01-17</td>
                </tr>
                <tr>
                  <td><button class="btn btn-link" @click="showPDF('https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/non_standard_requirements/Using%20the%20i-20190109045615.pdf')">1111111</button></td>
                  <td>2019-01-17</td>
                </tr>
                <tr>
                  <td><button class="btn btn-link" @click="showPDF('https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/non_standard_requirements/Using%20the%20i-20190109045615.pdf')">1111111</button></td>
                  <td>2019-01-17</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看报告 -->
    <div class="modal fade report" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div id="canvasBox"></div>
        </div>
      </div>
    </div>

    <div id="toolbar">
      <el-button size="mini" @click="addOrder">新建采购订单</el-button>
      <el-select v-model="params.status" size="mini" @change="refreshed">
        <el-option label="全部" :value="undefined"></el-option>
        <el-option label="未审核" :value="0"></el-option>
        <el-option label="已审核" :value="1"></el-option>
      </el-select>
    </div>
    <table id="table"></table>
  </div>
</template>

<script>
import QRCode from "qrcode";
import PDFJS from "pdfjs-dist";
import addOrderModal from "@/pages/Process/common/purchase/addOrder";

export default {
  name: "purchaseOrder",
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    return {
      user: user,
      modalData: {
        company: "",
        created_at: "",
        created_by: "",
        number: ""
      },
      params: {
        status: 0
      },
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      scale: 1
    };
  },
  components: {
    addOrderModal: addOrderModal
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("procurement/order", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$store.commit("changeTasks", {
            name: "/Purchase/order",
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
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      params.checks = this.params.status;
      return params;
    },
    init() {
      let that = this,
        columns = [
          // {
          //   checkbox: true
          // },
          {
            field: "id",
            title: "序号",
            sortable: true,
            formatter: (value, row, index) => {
              return index + 1;
            }
          },
          {
            field: "img",
            title: "二维码",
            formatter: (value, row, index) => {
              setTimeout(
                () =>
                  QRCode.toString(
                    `https://www.factoryun.com/procurement/order/item/detail/${
                      row.id
                    }`,
                    (err, string) =>
                      (document.getElementById(
                        `purchaseOrderQrcode${row.id}`
                      ).innerHTML = string)
                  ),
                500
              );
              return `<div id="purchaseOrderQrcode${
                row.id
              }" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            },
            events: {
              "click .img": function(e, value, row, index) {
                that.modalData = row;
                that.modalData.company = that.user.user.current_company;
                QRCode.toString(
                  `https://www.factoryun.com/procurement/order/item/detail/${
                    row.id
                  }`,
                  (err, string) =>
                    (document.getElementById(
                      "purchaseOrderPrintImg"
                    ).innerHTML = string)
                );
                $("#purchaseOrderPrintModal").modal("show");
              }
            }
          },
          {
            field: "number",
            title: "采购订单单号"
          },
          {
            field: "created_by",
            title: "创建人"
          },
          {
            field: "created_at",
            title: "创建日期"
          },
          // {
          //   field: "demand_at",
          //   title: "需求日期"
          // },
          // {
          //   field: "status",
          //   title: "关联采购申请单号"
          // },
          // {
          //   field: "status",
          //   title: "关联销售单号"
          // },
          {
            field: "remark",
            title: "备注",
            editable: {
              type: "text",
              title: "备注",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "status",
            title: "供应商"
          },
          {
            field: "address",
            title: "联系电话"
          },
          {
            field: "contract",
            title: "合同",
            formatter: () => {
              let getContract = `<button class="btn btn-link getContract">查看合同</button>`;
              return getContract;
            },
            events: {
              "click .getContract": function(e, value, row, index) {
                $("#purchaseOrder .contract").modal("show");
              }
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let del = `<button class="del btn btn-danger btn-sm">删除</button>`,
                print = `<button class="print btn btn-success btn-sm">打印</button>`;
              return del + print;
            },
            events: {
              "click .del": function(e, value, row, index) {
                that
                  .$get(`procurement/order/delete/${row.id}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#purchaseOrder #table"), "id", [row.id]);
                  })
                  .catch(err => console.error(err));
              },
              "click .print": function(e, value, row, index) {
                window.open(`/print.html#/purchaseOrder/${row.id}`);
              }
            }
          }
        ],
        data = {
          toolbar: "#purchaseOrder #toolbar",
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
          uniqueId: "id",
          idField: "id",
          showToggle: true,
          showExport: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: columns,
          detailFormatter: (index, row, $el) => {
            let html = [
              `<table class="table table-bordered">
                <tr>
                  <th>料品编码</th>
                  <th>料品名称</th>
                  <th>料品规格</th>
                  <th>单位</th>
                  <th>数量</th>
                  <th>备注</th>
                  <th>单价</th>
                  <th>交期</th>
                  <th>结案</th>
                </tr>`
            ];
            row.items.forEach(e =>
              html.push(`
                  <tr>
                    <td>${e.material_code || ""}</td>
                    <td>${e.name || ""}</td>
                    <td>${e.specification || ""}</td>
                    <td>${e.unit || ""}</td>
                    <td>${e.quantity || ""}</td>
                    <td>${e.remark || ""}</td>
                    <td>${e.price || ""}</td>
                    <td>${e.delivery_date || ""}</td>
                    <td><input type="checkbox" aid="${
                      row.id
                    }" class="closeCase" index="${row.id}" value="${e.id}" ${
                e.is_closed ? 'checked="checked"' : ""
              } disabled></td>
                  </tr>
                `)
            );
            html.push(`</table>`);
            return html.join("");
          },
          onEditableSave: (field, mrow, oldValue, $el) => {
            mrow.items = JSON.stringify(mrow.items);
            that
              .$post(`procurement/order/edit/${mrow.id}`, mrow)
              .then(response => {
                if (response.status != 200) return false;
                console.log(response);
              })
              .catch(err => console.error(err));
          }
        };
      $("#purchaseOrder #table").bootstrapTable(data);
    },
    printing() {
      this.$print(this.$refs.purchaseOrderPrint);
      $("#purchaseOrderPrintModal").modal("hide");
    },
    addOrder() {
      $("#addOrder").modal("show");
    },
    showPDF(url) {
      let _this = this;
      $("#canvasBox").empty();
      $(".report").modal("show");
      PDFJS.getDocument(url).then(function(pdf) {
        _this.pdfDoc = pdf;
        for (let i = 1; i < pdf.numPages + 1; i++) {
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
    },
    refreshed() {
      this.refresh($("#purchaseOrder #table"));
    }
  },
  mounted() {
    const that = this;
    this.init();
    $("#purchaseOrder").on("change", ".closeCase", function() {
      let self = $(this),
        id = self.attr("index"),
        data = that.getRow($("#purchaseOrder #table"), id),
        params = {};
      for (let item of data.items) {
        if (item.id == self.val()) {
          if (item.is_closed) item.is_closed = 0;
          else item.is_closed = 1;
          params = item;
        }
      }
      that
        .$post(`procurement/order/item/edit/${params.id}`, params)
        .then(response => {
          if (response.status != 200) return false;
          that.editRow($("#purchaseOrder #table"), id, data);
        })
        .catch(err => console.error(err));
    });
  }
};
</script>
<style lang="less">
#purchaseOrder {
  .report {
    #canvasBox {
      text-align: center;
      canvas {
        max-width: 100%;
      }
    }
  }
  #table {
    .detail-view {
      > td {
        padding: 0;
      }
    }
  }
  .img {
    width: 100%;
  }
}
</style>