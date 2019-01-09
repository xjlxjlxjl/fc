<template>
  <div id="report">
    <div id="afterSaleToolbar">
      <span class="lead">客服报告列表</span>
      <el-date-picker
        v-model="date"
        size="mini"
        value-format="yyyy-MM-dd hh:mm:ss"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
    </div>
    <table id="afterSaleTable"></table>
  </div>
</template>
<script>
export default {
  name: "report",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      date: []
    };
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`service/report`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => console.error(err));
    },
    tableAjaxParams(params) {
      let p = {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        member: this.user.user.display_name,
        start_at: this.date[0],
        end_at: this.date[1]
      };
      p.number = params.search || undefined;
      return p;
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "number",
            title: "客服报告单号",
            sortable: true
          },
          {
            field: "customer_name",
            title: "客户名称",
            sortable: true
          },
          {
            field: "customer_linkman",
            title: "联系人",
            sortable: true
          },
          {
            field: "customer_mobile",
            title: "客户手机",
            sortable: true
          },
          {
            field: "specification",
            title: "规格",
            sortable: true
          },
          {
            field: "quantity",
            title: "数量",
            sortable: true
          },
          {
            field: "description",
            title: "描述",
            sortable: true
          },
          {
            field: "analysis",
            title: "原因分析",
            sortable: true
          },
          {
            field: "content",
            title: "处理方案",
            sortable: true
          },
          {
            field: "organization",
            title: "责任单位",
            sortable: true
          },
          {
            field: "advice",
            title: "维修建议",
            sortable: true
          },
          {
            field: "service_at",
            title: "服务时间",
            sortable: true
          },
          {
            field: "member_name",
            title: "创建人",
            sortable: true
          },
          {
            field: "company_name",
            title: "创建人公司",
            sortable: true
          }
        ],
        data = {
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
          columns: columns,
          detailFormatter(field, mrow, oldValue, $el) {
            let content = [`<table><tr>`];
            mrow.files.forEach(e =>
              content.push(
                `<td><img src="${e.url}" style="width: 150px;" /></td>`
              )
            );
            content.push(`</tr></table>`);
            return content.join("");
          },
          onEditableSave(field, mrow, oldValue, $el) {}
        };
      $("#report #afterSaleTable").bootstrapTable(data);
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#report {
}
</style>
