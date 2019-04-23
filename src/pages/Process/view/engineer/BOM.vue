<template>
  <div id="Bom">
    <addBom :row="row"></addBom>
    <getPic :pic="pic"></getPic>
    <div id="toolbar">
      <el-button type="default" size="mini" @click="addBomModal = !addBomModal">新建BOM</el-button>
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
      params.success({
        rows: [{}, {}],
        total: 2
      });
    },
    tableAjaxParams(params) {
      return params;
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
            field: "#",
            title: "BOM编号",
            sortable: true
          },
          {
            field: "#",
            title: "成品料品编码",
            sortable: true
          },
          {
            field: "#",
            title: "料品名称",
            sortable: true
          },
          {
            field: "#",
            title: "料品规格",
            sortable: true
          },
          {
            field: "#",
            title: "版本号",
            sortable: true
          },
          {
            field: "#",
            title: "创建人",
            sortable: true
          },
          {
            field: "#",
            title: "创建日期",
            sortable: true
          },
          {
            field: "#",
            title: "审核状态",
            sortable: true
          },
          {
            field: "#",
            title: "审核人",
            sortable: true
          },
          {
            field: "#",
            title: "审核日期",
            sortable: true
          },
          {
            field: "#",
            title: "操作",
            formatter: function(value, row, index) {
              let edit = `<button class="edit btn btn-sm btn-success">　编辑　</button>`,
                version = `<button class="edit btn btn-sm btn-primary">版本变更</button>`,
                copy = `<button class="edit btn btn-sm btn-warning">　复制　</button>`,
                del = `<button class="edit btn btn-sm btn-danger">　删除　</button>`;
              return edit + version + copy + del;
            },
            events: {
              "click .edit": function($el, value, row, index) {
                that.addBomModal = !that.addBomModal;
              },
              "click .version": function($el, value, row, index) {
                that.addBomModal = !that.addBomModal;
              },
              "click .copy": function($el, value, row, index) {
                that.addBomModal = !that.addBomModal;
              },
              "click .del": function($el, value, row, index) {

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
            `;
            mrow.items = [{},{},{},{},{},{}]
            mrow.items.forEach((e, k) => {
              content += `
                <tr>
                  <td>${ k + 1 }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td><button class="btn btn-default btn-sm getPic" index="${field}" key="${k}">查看</button></td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                  <td>${ e.numbers }</td>
                </tr>
              `;
            })
            content += `</tbody></table>`;
            return content;
          },
          onEditableSave(field, mrow, oldValue, $el) {}
        };
      $("#Bom #table").bootstrapTable(data);
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
        self = that.getAllData($("#Bom #table"))[index].items[key];
        that.pic = self;
        $("#Bom #getMaterialPic").modal("show");
    });
  }
}
</script>
<style lang="less">
#Bom {

}
</style>
