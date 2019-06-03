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
      this
        .$get(`schedule`, params.data)
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
        numbering: params.search
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
            field: "numbering",
            title: "智能计划单号"
          },
          {
            field: "created_by",
            title: "排单人"
          },
          {
            field: "created_at",
            title: "排单时间"
          },
          {
            field: "numbering",
            title: "订单号"
          },
          {
            field: "customer_delivery_at",
            title: "客户要求交期"
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
                if (confirm('确定要生产生产计划和生产领料吗？'))
                  that
                    .$get(`schedule/product/schedule/${value}`)
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
              <table class="table table-bordered" style="white-space: nowrap;">
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
                    <th>来料质检</th>
                    <th>备料</th>
                    <th>组装</th>
                    <th>成品质检</th>
                    <th>打包</th>
                    <th>入库</th>
                    <th>发货</th>
                    <th>生产计划</th>
                    <th>结案</th>
                  </tr>
            `;
            mrow.items.forEach((e, k) => {
              html += `
                <tr>
                  <td><input type="checkbox"></td>
                  <td>${ e.sn }</td>
                  <td>${ e.material.code }</td>
                  <td>${ e.material.name }</td>
                  <td>${ e.material.specification }</td>
                  <td>${ e.material.unit }</td>
                  <td>${ e.quantity }</td>
                  <td>${ e.delivery_period }</td>
                  <td>${ e.bom }</td>
                  <td><button key="${field}" index="${k}" class="btn btn-xs drawing">查看图纸</button></td>
                  <td><button key="${field}" index="${k}" class="btn btn-xs occupy">查看占用</button></td>
                  <td><button key="${field}" index="${k}" class="btn btn-xs material">查看缺少物料</button></td>
                  <td>${ (e.billing ? e.billing.hour : 0) + (e.split ? e.split.hour : 0) + (e.outside_preparation ? e.outside_preparation.hour : 0) + (e.incoming_quality_inspection ? e.incoming_quality_inspection.hour : 0) + (e.preparation ? e.preparation.hour : 0) + (e.assembly ? e.assembly.hour : 0) +(e.finished_product_quality_inspection ? e.finished_product_quality_inspection.hour : 0) + (e.packaging ? e.packaging.hour : 0) + (e.storage ? e.storage.hour : 0) + (e.shipping ? e.shipping.hour : 0) }</td>
                  <td>${ e.billing ? e.billing.hour : '' }</td>
                  <td>${ e.split ? e.split.hour : '' }</td>
                  <td>${ e.outside_preparation ? e.outside_preparation.hour : '' }</td>
                  <td>${ e.incoming_quality_inspection ? e.incoming_quality_inspection.hour : '' }</td>
                  <td>${ e.preparation ? e.preparation.hour : '' }</td>
                  <td>${ e.assembly ? e.assembly.hour : '' }</td>
                  <td>${ e.finished_product_quality_inspection ? e.finished_product_quality_inspection.hour : '' }</td>
                  <td>${ e.packaging ? e.packaging.hour : '' }</td>
                  <td>${ e.storage ? e.storage.hour : '' }</td>
                  <td>${ e.shipping ? e.shipping.hour : '' }</td>
                  <td>${ e.status || '未排单' }</td>
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
