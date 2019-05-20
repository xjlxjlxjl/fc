<template>
  <div id="nonstandardModal">
    <addNonstandardModal :row="row" @refresh="refreshed"></addNonstandardModal>
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
      addNonModal: false,
      row: {}
    };
  },
  components: {
    addNonstandardModal: addNonstandardModal
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`orders/inquiry-template`, params.data)
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
        name: params.search
      };
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
            field: "name",
            title: "非标询价模板名称"
          },
          {
            field: "created_by",
            title: "创建人"
          },
          {
            field: "created_at",
            title: "创建日期"
          },
          {
            field: "id",
            title: "操作",
            formatter: (value, row, index) => {
              let
                edit = `<button class="btn btn-success btn-sm edit">编辑</button>`,
                del = `<button class="btn btn-danger btn-sm del" style="margin-left: 5px;">删除</button>`;
              return edit + del;
            },
            events: {
              "click .edit": function(e, value, row, index) {
                that.row = row;
                that.addNonModal = !that.addNonModal;
              },
              "click .del": function(e, value, row, index) {
                that
                  .$get(`orders/inquiry-template/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#nonstandardModal #table"), 'id', [value]);
                  })
                  .catch(e => console.error(e));
              }
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
          detailFormatter(field, mrow, oldValue, $el) {
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>客户公司名</td>
                    <td>　　　　</td>
                    <td>联系人</td>
                    <td>　　　　</td>
                    <td>联系电话</td>
                    <td>　　　　</td>
                    <td>职位</td>
                    <td>　　　　</td>
                  </tr>
                  <tr>
                    <td>需求描述</td>
                    <td colspan="3"></td>
                    <td>需求附件</td>
                    <td colspan="3"></td>
                  </tr>
            `;
            mrow.data.forEach((v, k) => {
              if (k % 4 == 0) content += `</tr><tr>`;
              content += `<td>${v.label}</td><td>　　　　</td>`;
            })
            content += `</tr></tbody></table>`;
            return content;
          }
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
