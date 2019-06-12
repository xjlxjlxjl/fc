<template>
  <div id="turn">
    <addTurn :rows="rows" @refresh="refreshed"></addTurn>
    <div id="toolbar">
      <el-button size="mini" @click="addModal = !addModal;rows.id = 0;">新建生产工序</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addTurn from "@/pages/Process/common/produce/addTurn.vue";
export default {
  name: "turn",
  data() {
    return {
      addModal: false,
      rows: {
        id: 0
      }
    };
  },
  components: {
    addTurn: addTurn
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`produces/procedure`, params.data)
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
        name: params.search || undefined
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "#",
            title: "序号",
            formatter(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "name",
            title: "生产工序名称"
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
              return `<div style="display: flex;">${edit + del}</div>`;
            },
            events: {
              "click .edit"(e, value, row, index) {
                that.addModal = !that.addModal;
                that.rows = row;
              },
              "click .del"(e, value, row, index) {
                if (confirm('确定删除?'))
                  that
                    .$get(`produces/procedure/delete`, { id: value })
                    .then(response => {
                      if (response.status != 200) return false;
                      that.delTable($("#turn #table"), 'id', [value]);
                    })
                    .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#turn #toolbar",
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
                    <th>序号</th>
                    <th>生产步骤</th>
                  </tr>
            `;
            mrow.steps.forEach((e, k) => {
              html += `
                <tr>
                  <td>${ k + 1}</td>
                  <td>${ e.step }</td>
                </tr>
              `;
            })
            html += `</tbody></table>`;
            return html;
          }
        };
      $("#turn #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#turn #table"));
    }
  },
  watch: {
    addModal(val) {
      $("#turn #addTurn").modal("show");
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less">
#turn {
}
</style>
