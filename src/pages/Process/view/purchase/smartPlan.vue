<template>
  <div id="smartPlan">
    <getMaterialPic :pic="pic"></getMaterialPic>
    <missMaterial :arr="arr"></missMaterial>
    <smartOccupy :arr="row"></smartOccupy>
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import getMaterialPic from '@/pages/Process/common/engineer/getMaterialPic';
import missMaterial from '@/pages/Process/common/purchase/missMaterial';
import smartOccupy from '@/pages/Process/common/purchase/smartOccupy';

export default {
  name: "smartPlan",
  data() {
    return {
      pic: {
        drawing_working: [],
        assembly_drawing: [],
        drawing_approve: [],
        drawing_2d: [],
        drawing_3d: [],
        drawing_pdf: []
      },
      arr: [],
      row: []
    };
  },
  components: {
    getMaterialPic: getMaterialPic,
    missMaterial: missMaterial,
    smartOccupy: smartOccupy
  },
  methods: {
    tableAjaxData(params) {
      params.success({
        rows: [{ id: 1 }],
        total: 1
      });
      return false
      this
        .$get(``, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(e => console.error(e));
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / 10 + 1,
        per_page: params.limit,
        grade: 1
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "#",
            title: "序号",
            formatter: function(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "number",
            title: "智能计划单号",
            sortable: true
          },
          {
            field: "created_at",
            title: "排单人",
            sortable: true
          },
          {
            field: "created_by",
            title: "排单时间",
            sortable: true
          },
          {
            field: "temp_storage.number",
            title: "订单号",
            sortable: true
          },
          {
            field: "temp_storage.source",
            title: "客户要求交期",
            sortable: true
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let plan = `<button class="btn btn-sm btn-info plan">生产计划</button>`;
              return plan;
            },
            events: {
              "click .plan": function(e, value, row, index) {
                if (confirm('是否确定删除'))
                  that
                    .$get(`icm_qty_ctrl/quality/delete/${value}`)
                    .then(response => {
                      if (response.status != 200) return false;
                    })
                    .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#smartPlan #toolbar",
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
            let html = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th>　　</th>
                    <th>SN码</th>
                    <th>料品编码</th>
                    <th>料品名称</th>
                    <th>料品规格</th>
                    <th>单位</th>
                    <th>数量</th>
                    <th>出货计划交期</th>
                    <th>关联BOM</th>
                    <th>图纸</th>
                    <th>智能占用表</th>
                    <th>尚缺物料</th>
                    <th>总工时</th>
                    <th>发单</th>
                    <th>拆分</th>
                    <th>委外备料</th>
                    <th>组装</th>
                    <th>成品质检</th>
                    <th>打包</th>
                    <th>入库</th>
                    <th>发货</th>
                    <th>生产计划</th>
                    <th>结案</th>
                  </tr>
            `;
            mrow.items = [{}]
            mrow.items.forEach((e, k) => {
              html += `
                <tr>
                  <td><input type="checkbox"></td>
                  <td>${ e.sn }</td>
                  <td>${ e.code }</td>
                  <td>${ e.name }</td>
                  <td>${ e.specification }</td>
                  <td>${ e.unit }</td>
                  <td>${ e.quantity }</td>
                  <td>${ e.delivery_period }</td>
                  <td>${ e.bom }</td>
                  <td><button key="${field}" index="${k}" class="btn btn-xs drawing">查看图纸</button></td>
                  <td><button key="${field}" index="${k}" class="btn btn-xs occupy">查看占用</button></td>
                  <td><button key="${field}" index="${k}" class="btn btn-xs material">查看缺少物料</button></td>
                  <td>${ e.a }</td>
                  <td>${ e.b }</td>
                  <td>${ e.c }</td>
                  <td>${ e.d }</td>
                  <td>${ e.e }</td>
                  <td>${ e.f }</td>
                  <td>${ e.g }</td>
                  <td>${ e.h }</td>
                  <td>${ e.i }</td>
                  <td>${ e.j }</td>
                  <td><input type="checkbox"></td>
                </tr>
              `;
            })
            html += `</tbody></table>`;
            return html;
          }
        };
      $("#smartPlan #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#smartPlan #table"));
    }
  },
  mounted() {
    this.init();
    let that = this;
    $("#smartPlan").on("click", ".drawing", function() {
      const
        key = $(this).attr("key"),
        index = $(this).attr("index"),
        data = that.getAllData($("#smartPlan #table"));
      that.pic = {
        drawing_working: [],
        assembly_drawing: [],
        drawing_approve: [],
        drawing_2d: [],
        drawing_3d: [],
        drawing_pdf: []
      };
      $("#smartPlan #getMaterialPic").modal("show");
    });
    $("#smartPlan").on("click", ".occupy", function() {
      const
        key = $(this).attr("key"),
        index = $(this).attr("index"),
        data = that.getAllData($("#smartPlan #table"));
      that.row = [{}];
      $("#smartPlan #smartOccupy").modal("show");
    });
    $("#smartPlan").on("click", ".material", function() {
      const
        key = $(this).attr("key"),
        index = $(this).attr("index"),
        data = that.getAllData($("#smartPlan #table"));
      that.arr = [{},{}];
      $("#smartPlan #missMaterial").modal("show");
    });
  }
}
</script>
<style lang="less">
#smartPlan {
  
}
</style>
