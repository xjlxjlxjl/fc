<template>
  <div id="customerServiceQuotation">
    <div id="toolbar">
      <span class="lead">客服报价表</span>
      <el-button size="mini" @click="sendContract">发送合同给客户</el-button>
      <el-button size="mini" @click="sendEngineer">工程细化图纸BOM</el-button>
      <el-button size="mini" @click="sendProduct">排单生产</el-button>
      <el-button size="mini" @click="sendService">发送给客服</el-button>
      <el-button size="mini" @click="sendCustomer">发送报价给客户</el-button>
      <el-button size="mini" @click="auditPass">审核通过</el-button>
      <br>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import PDFJS from "pdfjs-dist";

export default {
  name: "customerServiceQuotation",
  data() {
    return {
      tableData: [],
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      scale: 1
    };
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("service/quoted_price", params.data)
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
    sendContract() {
      let that = this,
        arr = this.getTableAttr($("#table"), id);
    },
    sendEngineer() {
      let that = this,
        arr = this.getTableAttr($("#table"), id);
    },
    sendProduct() {
      let that = this,
        arr = this.getTableAttr($("#table"), id);
    },
    sendService() {
      let that = this,
        arr = this.getTableAttr($("#table"), id);
    },
    auditPass() {},
    sendCustomer() {
      let arr = this.getData($("#table")),
        that = this;
      if (arr.length && arr.length > 1) {
        this.$message({ message: "只能选择一个客户发送", type: "error" });
      }
      let detail = arr.pop();
      this.$get("service/quoted_price/generate_pdf", {
        id: detail.id
      })
        .then(response => {
          if (response.status != 200) return false;
          that
            .$get(`service/quoted_price/pdf`, {
              id: detail.id,
              download: 1
            })
            .then(res => {
              if (res.status != 200) return false;
              that
                .$alert(`<div id="canvasBox"></div>`, "报价模板", {
                  dangerouslyUseHTMLString: true
                })
                .then(() => that.sendEmail(res.data.url));
              that.showPDF(res.data.url);
            })
            .catch(erro => {});
        })
        .catch(err => {});
    },
    sendEmail(url) {
      this.$prompt("请输入邮箱", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: "邮箱格式不正确"
      }).then(({ value }) => {
        this.$post(`service/quoted_price/pdf/email`, {
          email: value,
          url: url
        })
          .then(response => {
            if (response.status != 200) return false;
            this.$message({ message: "发送成功", type: "success" });
          })
          .catch(err => {});
      });
    },
    showPDF(url) {
      let _this = this;
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
      detailView: true,
      columns: [
        {
          checkbox: true
        },
        {
          field: "quoted_price_number",
          title: "客服报价单",
          sortable: true
        },
        {
          field: "member_name",
          title: "报价人",
          sortable: true
        },
        {
          field: "create_at",
          title: "申请日期",
          sortable: true
        },
        {
          field: "whether_send_customer",
          title: "是否发送",
          sortable: true
        },
        {
          field: "customer_company_name",
          title: "客户",
          sortable: true
        },
        {
          field: "linkman",
          title: "联系人",
          sortable: true
        },
        {
          field: "customer_contact",
          title: "联系电话",
          sortable: true
        },
        {
          field: "order_number",
          title: "销售订单",
          sortable: true
        },
        {
          field: "whether_warranty",
          title: "是否过保",
          sortable: true
        },
        {
          field: "price",
          title: "总金额",
          sortable: true
        },
        {
          field: "discount_price",
          title: "优惠",
          sortable: true
        },
        {
          field: "creator",
          title: "应收",
          sortable: true
        }
      ],
      onEditableSave: (field, mrow, oldValue, $el) => {},
      detailFormatter: (field, mrow, oldValue, $el) => {
        let html = [
          `<table class="table">
              <tr>
                <th>物料编码</th>
                <th>物料名称</th>
                <th>规格</th>
                <th>单位</th>
                <th>价格</th>
                <th>数量</th>
              </tr>`
        ];
        mrow.detail.forEach(e =>
          html.push(`
                <tr>
                  <td>${e.code || "无"}</td>
                  <td>${e.name}</td>
                  <td>${e.info}</td>
                  <td>${e.unit}</td>
                  <td>${e.price}</td>
                  <td>${e.number}</td>
                </tr>
              `)
        );
        html.push("</table>");
        return html.join("");
      }
    });
  },
  created() {
    $(".el-message-box").width("600");
  }
};
</script>
<style lang="less">
#customerServiceQuotation {
}
#canvasBox {
  max-height: 100%;
  height: 400px;
  overflow: auto;
  canvas {
    max-width: 100% !important;
    height: auto;
  }
}
</style>
