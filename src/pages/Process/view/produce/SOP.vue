<template>
  <div id="SOP">
    <addSOP @refresh="refreshed" :row="row"></addSOP>
    <div id="toolbar">
      <el-button size="mini" @click="row = {};addModal = !addModal">新建SOP</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addSOP from "@/pages/Process/common/produce/addSOP";

export default {
  name: "SOP",
  data() {
    return {
      row: {},
      addModal: false
    };
  },
  components: {
    addSOP: addSOP
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`produces/sop_manage`, params.data)
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
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        name: params.search || undefined
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
            field: "name",
            title: "SOP名称"
          },
          {
            field: "created_member.last_name",
            title: "创建人"
          },
          {
            field: "created_at",
            title: "创建日期"
          },
          {
            field: "material.material_number",
            title: "关联料品编码"
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let edit = `<button class="btn btn-sm btn-success edit">编辑</button>`,
                  del = `<button class="btn btn-sm btn-danger del" style="margin-left: 5px;">删除</button>`;
              return `<div style="display: flex;">${ edit + del }</div>`;
            },
            events: {
              "click .edit"(e, value, row, index) {
                that.row = row;
                that.addModal = !that.addModal;
              },
              "click .del": function(e, value, row, index) {
                if (confirm('确认删除'))
                  that
                    .$get(`produces/sop_manage/delete`, { id: value })
                    .then(response => {
                      if (response.status != 200) return false;
                      that.delTable($("#SOP #table"), 'id', [value]);
                    })
                    .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#SOP #toolbar",
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
                    <th>标准步骤</th>
                    <th>图片</th>
                    <th>遇到的问题</th>
                  </tr>
            `;
            mrow.sop_step.forEach((e, k) => {
              html += `<tr><td>${e.step}</td><td>`
              for (const v of e.images) html += `<a href="${v.url || v}" style="display: block;" target="_blank"><img src="${v.url || v}" style="max-width: 80px;max-height: 80px;"></a>`;
              html += `</td><td style="padding: 0;"><table class="table table-bordered"><tbody><tr><td>错误图片</td><td>发生时间</td><td>订单号</td><td>问题描述</td><td>原因</td><td>解决方法</td><td>如何预防</td></tr>`;
              for (const v of e.problem) {
                html += `<tr><td>`;
                for (const val of v.error_images || [])
                  html += `<a href="${val.url}" style="display: block;" target="_blank"><img src="${val.url}" style="max-width: 80px;max-height: 80px;"></a>`;
                html += `</td><td>${v.happen_at || ""}</td><td>${v.numbing || ""}</td><td>${v.description || ""}</td><td>${v.reason || ""}</td><td>${v.solution || ""}</td><td>${v.prevent || ""}</td></tr>`;
              }
              html += `</tbody></table></td></tr>`;
            })
            html += `</tbody></table>`;
            return html;
          }
        };
      $("#SOP #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#SOP #table"));
    }
  },
  watch: {
    addModal(val) {
      $("#SOP #addSOP").modal("toggle");
    }
  },
  mounted() {
    this.init();
    let that = this;
  }
}
</script>
<style lang="less">
#SOP {
  
}
</style>
