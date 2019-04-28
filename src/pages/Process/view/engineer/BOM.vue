<template>
  <div id="Bom">
    <addBom :row="row" @showImg="showImg" @refresh="refreshed"></addBom>
    <getPic :pic="pic"></getPic>
    <div id="toolbar">
      <el-button type="default" size="mini" @click="row = { id: 0 };addBomModal = !addBomModal">新建BOM</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addBom from "@/pages/Process/common/engineer/addBom";
import getPic from "@/pages/Process/common/engineer/getMaterialPic";

export default {
  name: "BOM",
  data() {
    return {
      addBomModal: false,
      row: {
        id: 0
      },
      pic: {}
    };
  },
  components: {
    addBom: addBom,
    getPic: getPic
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`project/bom`, params.data)
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
        search: params.search,
      }
      return p;
    },
    init() {
      const that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter: function(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "item_number",
            title: "BOM编号",
            sortable: true
          },
          {
            field: "finished_product_number",
            title: "成品料品编码",
            sortable: true
          },
          {
            field: "name",
            title: "料品名称",
            sortable: true
          },
          {
            field: "component_specifications",
            title: "料品规格",
            sortable: true
          },
          {
            field: "version",
            title: "版本号",
            sortable: true
          },
          {
            field: "created_member.last_name",
            title: "创建人",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建日期",
            sortable: true
          },
          {
            field: "check.check_status",
            title: "审核状态",
            formatter: function(value, row, index) {
              return value ? value == 1 ? '审核通过' : '审核失败' : '待审核';
            }
          },
          {
            field: "check.check_member.check_last",
            title: "审核人",
            sortable: true
          },
          {
            field: "check.check_at",
            title: "审核日期",
            sortable: true
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let edit = `<button class="btn btn-sm btn-success edit">　编辑　</button>`,
                version = `<button class="btn btn-sm btn-primary version">版本变更</button>`,
                copy = `<button class="btn btn-sm btn-warning copy">　复制　</button>`,
                del = `<button class="btn btn-sm btn-danger del">　删除　</button>`;
              return edit + version + copy + del;
            },
            events: {
              "click .edit": function($el, value, row, index) {
                that.row = row;
                row.type = 'edit';
                that.addBomModal = !that.addBomModal;
              },
              "click .copy": function($el, value, row, index) {
                that.row = row;
                row.type = 'copy';
                that.addBomModal = !that.addBomModal;
              },
              "click .version": function($el, value, row, index) {
                that.row = row;
                row.type = 'version';
                that.addBomModal = !that.addBomModal;
              },
              "click .del": function($el, value, row, index) {
                that
                  .$post(`project/bom/delete`, { id: value })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#Bom #table"), 'id', [value]);
                  })
                  .catch(e => coonsole.error(e));
              },
            }
          }
        ],
        data = {
          toolbar: "#Bom #toolbar",
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
          detailFormatter(field, mrow, oldValue, $el) {
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>序号</td>
                    <td>操作方式</td>
                    <td>料品编码</td>
                    <td>料品规格</td>
                    <td>料品名称</td>
                    <td>数量</td>
                    <td>单位</td>
                    <td>料品类别</td>
                    <td>图纸</td>
                    <td>是否有效</td>
                    <td>价格特性</td>
                  </tr>
              `,
              operation_method = {
                1: '新增',
                2: '变更',
                3: '作废',
                4: '新增替代料'
              },
              bom_item_attributes = {
                'stroke': '行程',
                'optional': '可选',
                'standard': '标准'
              };
            mrow.bom_items.forEach((e, k) => {
              content += `
                <tr>
                  <td>${ k + 1 }</td>
                  <td>${ operation_method[e.operation_method] }</td>
                  <td>${ e.material.material_number }</td>
                  <td>${ e.material.material_specification }</td>
                  <td>${ e.material.name }</td>
                  <td>${ e.quantity }</td>
                  <td>${ e.unit }</td>
                  <td>${ e.material_category_name }</td>
                  <td><button class="btn btn-default btn-sm getPic" index="${field}" key="${k}">查看</button></td>
                  <td>${ e.valid == 1 ? '有效' : '无效' }</td>
                  <td>${ bom_item_attributes[e.bom_item_attributes] }</td>
                </tr>
              `;
            })
            content += `</tbody></table>`;
            return content;
          }
        };
      $("#Bom #table").bootstrapTable(data);
    },
    showImg(row) {
      // 没有id 阻止进行
      if (!row.material_id) return false;
      this.pic = row;
      $("#Bom #getMaterialPic").modal("show");
    },
    refreshed() {
      this.refresh($("#Bom #table"));
    }
  },
  watch: {
    addBomModal() {
      $("#Bom #addBom").modal("toggle");
    }
  },
  mounted() {
    this.init();
    let that = this;
    $("#Bom #table").on("click", ".getPic", function(e) {
      let index = $(this).attr("index"),
        key = $(this).attr("key"),
        self = that.getAllData($("#Bom #table"))[index].bom_items[key];
        that.pic = self;
        self.material.material_id = self.material.id;
        that.showImg(self.material);
    });
  }
}
</script>
<style lang="less">
#Bom {

}
</style>
