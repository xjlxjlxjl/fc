<template>
  <div id="nonstandardModal">
    <addNonstandardModal></addNonstandardModal>
    <div id="toolbar">
      <el-button type="default" size="mini" @click="addNonModal = !addNonModal">新建非标询价模板</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addNonstandardModal from '@/pages/Process/common/sale/addNonstandardModal';

export default {
  name: "nonstandardModal",
  data() {
    return {
      addNonModal: false
    };
  },
  components: {
    addNonstandardModal: addNonstandardModal
  },
  methods: {
    tableAjaxData(params) {
      params.success({
        rows: [{}],
        total: 1
      });
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      return params;
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter: (value, row, index) => {
              return index + 1;
            }
          },
          {
            field: "#",
            title: "非标询价模板名称"
          },
          {
            field: "#",
            title: "创建人"
          },
          {
            field: "#",
            title: "创建日期"
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let
                edit = `<button class="btn btn-success btn-sm edit">编辑</button>`,
                del = `<button class="btn btn-danger btn-sm del" style="margin-left: 5px;">删除</button>`;
              return edit + del;
            },
            events: {
              "click .edit": function(e, value, row, index) {
                that.addNonModal = !that.addNonModal;
              },
              "click .del": function(e, value, row, index) {}
            }
          }
        ],
        data = {
          toolbar: "#nonstandardModal #toolbar",
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
          onEditableSave(field, mrow, oldValue, $el) {},
          detailFormatter(field, mrow, oldValue, $el) {}
        };
      $("#nonstandardModal #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#nonstandardModal #table"));
    }
  },
  watch: {
    addNonModal(val) {
      $("#nonstandardModal #addNonstandardModal").modal("toggle");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#nonstandardModal {
}
</style>
