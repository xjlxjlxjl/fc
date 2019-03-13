<template>
  <div id="approval">
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
export default {
  name: "approval",
  data() {
    return {};
  },
  methods: {
    tableAjaxData(params) {
      this.$store.commit('changeTasks', {
        name: '/approval',
        num: 2
      })
      params.success({
        rows: [{ id: 1 }, { id: 2 }],
        total: 2
      })
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      return params;
    },
    init() {
      let that = this,
        columns = [
          {
            field: "work_no",
            title: "任务编号",
            sortable: true
          },
          {
            field: "number",
            title: "单号",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建日期",
            sortable: true
          },
          {
            field: "created_by",
            title: "创建人",
            sortable: true
          },
          {
            field: "check",
            title: "审核状态",
            sortable: true
          },
          {
            field: "slug",
            title: "操作",
            formatter: function(value, row, index) {
              let pass = `<button class="btn btn-success btn-sm pass">审核通过</button>`,
                refuse = `<button class="btn btn-danger btn-sm refuse" style="margin-left: 5px;">审核通过</button>`;
              return pass + refuse;
            },
            event: {
              'click .pass': function(e, value, row, index) {

              },
              'click .refuse': function(e, value, row, index) {

              },
            }
          },
        ],
        data = {
          toolbar: "#approval #toolbar",
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
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: columns,
          detailFormatter: (index, row, $el) => {
            return that.createTableDom(row);
          },
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };
      $("#approval #table").bootstrapTable(data);
    },
    createTableDom(data) {
      let dom = {
        1: () => {
          return `
            <table class="table">
              <tr>
                <td>客服报价单</td>
                <td>KFBJ20181010-002</td>
              </tr>
              <tr>
                <td>创建日期</td>
                <td>2018-10-10 15:00</td>
              </tr>
              <tr>
                <td>创建人</td>
                <td>客服_小余</td>
              </tr>
              <tr>
                <td>关联客服申请单</td>
                <td>KFSQ20181010-002</td>
              </tr>
              <tr>
                <td>客户公司名</td>
                <td>深圳大族激光科技有限公司</td>
              </tr>
              <tr>
                <td>联系人</td>
                <td>小族</td>
              </tr>
              <tr>
                <td>联系电话</td>
                <td>13600001112</td>
              </tr>
              <tr>
                <td>报价明细</td>
                <td>
                  <table class="table">
                    <tr>
                      <th>序号</th>
                      <th>料品编码</th>
                      <th>规格</th>
                      <th>品名</th>
                      <th>数量</th>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>DT0001</td>
                      <td>10-20</td>
                      <td>读头</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>DT0001</td>
                      <td>10-20</td>
                      <td>读头</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>DT0001</td>
                      <td>10-20</td>
                      <td>读头</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>DT0001</td>
                      <td>10-20</td>
                      <td>读头</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>DT0001</td>
                      <td>10-20</td>
                      <td>读头</td>
                      <td>1</td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>总金额</td>
                <td>未报价</td>
              </tr>
              <tr>
                <td>优惠金额</td>
                <td>0</td>
              </tr>
              <tr>
                <td>应收金额</td>
                <td>未报价</td>
              </tr>
              <tr>
                <td>发送状态</td>
                <td>未发送</td>
              </tr>
              <tr>
                <td>审核状态</td>
                <td>未审核</td>
              </tr>
            </table>
          `
        },
        2: () => {
          return `
            <table class="table">
              <tr>
                <td>请假单号</td>
                <td>QJSQ20181010-001</td>
              </tr>
              <tr>
                <td>创建日期</td>
                <td>2018-10-10 13：00</td>
              </tr>
              <tr>
                <td>截至日期</td>
                <td>2018-10-10 18：30</td>
              </tr>
              <tr>
                <td>创建人</td>
                <td>小杨_业务助理</td>
              </tr>
              <tr>
                <td>请假原因</td>
                <td>身体不舒服回家看病</td>
              </tr>
              <tr>
                <td>请假类型</td>
                <td>病假</td>
              </tr>
              <tr>
                <td>审核状态</td>
                <td>未审核</td>
              </tr>
              <tr>
                <td>审核失败说明</td>
                <td>假的 面色红润有光泽拒绝通过</td>
              </tr>
            </table>
          `
        }
      }
      return dom[data.id]();
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#approval {
}
</style>
