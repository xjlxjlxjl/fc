<template>
  <el-container id="produce">
    <el-aside width="200px">
      <p class="lead">待完成任务
        <el-button type="info" size="mini">新建</el-button>
      </p>
      <el-menu default-active="0">
        <el-menu-item index="0">
          <i class="el-icon-menu"></i>
          <span slot="title">导航一</span>
        </el-menu-item>
        <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <div id="toolbar">
        <table>
          <el-button size="mini">审核</el-button>
          <el-button size="mini">反审</el-button>
          <el-button size="mini">送检</el-button>
          <el-button size="mini">打包</el-button>
          <el-button size="mini">生产不良</el-button>
          <el-button size="mini">转成品仓</el-button>
        </table>
      </div>
      <table id="table"></table>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: "produce",
  methods: {
    tableAjaxData(params) {
      let loading = this.$loading({
        lock: true,
        background: "rgba(0, 0, 0, 0.7)"
      });
      params.success({
        total: 200,
        rows: [
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 },
          { ORDER_NO: 1 }
        ]
      });
      loading.close();
    },
    tableAjaxParams(params) {
      console.log(params);
      params.current_page = params.offset + 1;
      return params;
    }
  },
  mounted() {
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
      data: [
        { ORDER_NO: 1 },
        { ORDER_NO: 1 },
        { ORDER_NO: 1 },
        { ORDER_NO: 1 },
        { ORDER_NO: 1 },
        { ORDER_NO: 1 },
        { ORDER_NO: 1 }
      ],
      columns: [
        {
          checkbox: true
        },
        {
          field: "ORDER_NO",
          title: "优先级",
          sortable: true
        },
        {
          field: "ORDER_NO",
          title: "物料车"
        },
        {
          field: "ORDER_NO",
          title: "任务开始时间"
        },
        {
          field: "ORDER_NO",
          title: "预计结束时间"
        },
        {
          field: "ORDER_NO",
          title: "订单号"
        },
        {
          field: "ORDER_NO",
          title: "唯一识别码"
        },
        {
          field: "ORDER_NO",
          title: "转仓单号"
        },
        {
          field: "ORDER_NO",
          title: "转仓日期"
        },
        {
          field: "ORDER_NO",
          title: "部门",
          formatter: event => {}
        },
        {
          field: "ORDER_NO",
          title: "经手人",
          sortable: true,
          editable: {
            type: "text",
            title: "收货人",
            emptytext: "空",
            validate: function(v) {
              if (!v) return "不能为空";
            }
          }
        },
        {
          field: "ORDER_NO",
          title: "备注",
          sortable: true,
          editable: {
            type: "textarea",
            title: "备注",
            emptytext: "空"
          }
        },
        {
          field: "ORDER_NO",
          title: "组装人员"
        },
        {
          field: "ORDER_NO",
          title: "工时"
        },
        {
          field: "ORDER_NO",
          title: "Bom"
        },
        {
          field: "ORDER_NO",
          title: "操作"
        }
      ],
      onEditableSave: function(field, mrow, oldValue, $el) {
        $.post(
          "order/update",
          {
            id: mrow.orderId,
            key: field,
            value: mrow[field]
          },
          function(data) {
            if (data.result != 1) {
              alert("修改失败");
            }
            $table.bootstrapTable("refresh");
          }
        );
      }
    });
  }
};
</script>
<style lang="less">
@background: #f2f2f2;
@borderBlod: solid 1rem @background;
#produce {
  .el-aside {
    border-right: @borderBlod;
    padding: 1rem;
    .lead {
      button {
        float: right;
      }
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    .fixed-table-container {
      height: 565px;
      max-height: 100%;
      #table {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
