<template>
  <div id="application">
    <div id="afterSaleToolbar">
      <span class="lead">客服历史报告</span>
    </div>
    <table id="afterSaleTable"></table>
  </div>
</template>
<script>
export default {
  name: "application",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      active: {},
      tableData: []
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
        .$get("service/list", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
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
        page: params.offset / 10 + 1,
        per_page: params.limit,
        search: params.search,
        service_status: 1
      };
    }
  },
  mounted() {
    let that = this;
    $("#afterSaleTable").bootstrapTable({
      toolbar: "#afterSaleToolbar",
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
          field: "service_number",
          title: "订单号",
          sortable: true
        },
        {
          field: "created_at",
          title: "创建日期",
          sortable: true
        },
        {
          field: "business_man_name",
          title: "申请联系人"
        },
        {
          field: "customer_demand",
          title: "客户需求"
        },
        {
          field: "customer_linkman",
          title: "客户联系人"
        },
        {
          field: "customer_contact",
          title: "客户联系方式",
          sortable: true
        },
        {
          field: "customer_other_contact",
          title: "客户其他联系方式",
          sortable: true
        },
        {
          field: "specification",
          title: "规格",
          sortable: true
        },
        {
          field: "process_name",
          title: "订单处理状态"
        },
        {
          field: "deal_mans",
          title: "委派人员"
        },
        {
          field: "reason_analysis",
          title: "原因分析",
          sortable: true
        },
        {
          field: "deal_method",
          title: "处理方式",
          sortable: true
        },
        {
          field: "deal_result",
          title: "处理结果",
          sortable: true
        },
        {
          field: "price",
          title: "维修报价",
          formatter: (value, row, index) => {
            return `${value || "未报价"}`;
          }
        },
        {
          field: "discount_price",
          title: "折扣价",
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
          field: "deal_advice",
          title: "处理建议"
        },
        {
          field: "service_status_name",
          title: "服务状态"
        },
        {
          field: "remark",
          title: "备注"
        }
      ],
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
                  `<li><img src="${
                    e.url
                  }" class="img-rounded" style="width: 100px;"></li>`
                );
                break;
              default:
                html.push(`<li><a href="${e.url}" target="_blank"></a></li>`);
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
                  `<li><img src="${
                    e.url
                  }" class="img-rounded" style="width: 100px;"></li>`
                );
                break;
              default:
                html.push(`<li><a href="${e.url}" target="_blank"></a></li>`);
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
                  `<li><img src="${
                    e.url
                  }" class="img-rounded" style="width: 100px;"></li>`
                );
                break;
              default:
                html.push(`<li><a href="${e.url}" target="_blank"></a></li>`);
                break;
            }
          });
          html.push(`</ul>`);
        }
        return html.join("");
      }
    });
  },
  created() {}
};
</script>
<style lang="less">
#application {
}
</style>
