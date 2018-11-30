<template>
  <el-container id="produce">
    <el-aside width="200px"></el-aside>
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
      <table
        id="table"
        data-toolbar="#toolbar"
        :data-ajax="tableAjaxData()"
        :data-query-params="tableAjaxParams()"
        data-search="true"
        data-show-refresh="true"
        data-side-pagination="server"
        data-pagination="true"
        data-striped="true"
        data-click-to-select="true"
        data-show-columns="true"
        data-sort-name="createTime"
        data-sort-order="desc"
        data-id-field="orderId"
        data-show-toggle="true"
        data-show-export="true"
        data-classes="table table-no-bordered "
      ></table>
      <!-- data-card-view="true" -->
    </el-main>
  </el-container>
</template>
<script>
import "bootstrap-table/dist/bootstrap-table.min.js";
import "bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js";
export default {
  name: "produce",
  methods: {
    tableAjaxData(params) {
      console.log(123213);
      return [
        { ORDER_NO: 1 },
        { ORDER_NO: 1 },
        { ORDER_NO: 1 },
        { ORDER_NO: 1 },
        { ORDER_NO: 1 },
        { ORDER_NO: 1 },
        { ORDER_NO: 1 }
      ];
    },
    tableAjaxParams(params) {}
  },
  mounted() {
    $("#table").bootstrapTable({
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
          title: "部门"
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
        showLoading();
        $.post(
          "order/update",
          {
            id: mrow.orderId,
            key: field,
            value: mrow[field]
          },
          function(data) {
            hideLoading();
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
  }
  .el-main {
    #table {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
