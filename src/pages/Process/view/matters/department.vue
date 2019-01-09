<template>
  <div id="departmnt">
    <departmentModal :branchId="branchId" :items="items" :parentId="parentId" @refresh="refreshed"></departmentModal>
    <powerModal></powerModal>
    <!-- Modal -->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabel">部门架构</h4>
          </div>
          <div class="modal-body">
            <el-tree
              :data="tree"
              show-checkbox
              default-expand-all
              @node-drop="handleDrop"
              draggable
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ data.name }}</span>
                <span>
                  <el-button type="text" size="mini" @click="addChild(data.id)">添加</el-button>
                  <el-button type="text" size="mini" @click="edit(data,node.parent.data.id)">编辑</el-button>
                  <el-button type="text" size="mini" @click="del(node, data)">删除</el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div id="mattersToolbar">
      <span class="lead">部门列表</span>
      <el-button size="mini" @click="addChild(0)">创建部门</el-button>
      <el-button size="mini" @click="del">删除</el-button>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
import departmentModal from "@/pages/Process/common/departmentModal";
import powerModal from "@/pages/Process/common/powerModal";

export default {
  name: "department",
  data() {
    return {
      tree: [],
      branchId: 0,
      parentId: 0,
      items: {}
    };
  },
  components: {
    departmentModal: departmentModal,
    powerModal: powerModal
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`members/branch`, params.data)
        .then(response => {
          if (response.status != 200) {
            params.success({
              rows: [],
              total: 0
            });
            return false;
          }
          params.success({
            rows: response.data.list,
            // total: response.data.list.length
            total: response.data.pagination.total
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      params.q = params.search;
      return params;
    },
    init() {
      let that = this;
      $("#mattersTable").bootstrapTable({
        toolbar: "#mattersToolbar",
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
        columns: [
          {
            checkbox: true
          },
          {
            field: "name",
            title: "部门名字",
            sortable: true,
            editable: {
              type: "text",
              title: "部门名字",
              emptytext: "空"
            }
          },
          {
            field: "description",
            title: "部门介绍",
            sortable: true,
            editable: {
              type: "text",
              title: "部门介绍",
              emptytext: "空"
            }
          },
          {
            field: "slug",
            title: "标识代码",
            sortable: true,
            editable: {
              type: "text",
              title: "标识代码",
              emptytext: "空"
            }
          },
          {
            field: "created_at",
            title: "创建时间",
            sortable: true
          },
          {
            field: "id",
            title: "操作",
            formatter: (value, row, index) => {
              let list = [
                `<button class="btn btn-success btn-sm list">查看架构</button>`
              ];
              let power = [
                `<div><button class="btn btn-primary btn-sm power">查看权限</button></div>`
              ];
              let del = [
                `<button class="btn btn-danger btn-sm del">删　　除</button>`
              ];
              if (row.children.length) return list;
              else return del;
            },
            events: {
              "click .list": ($el, value, row, index) => {
                that.tree = [row];
                $("#myModal").modal("show");
              },
              "click .power": ($el, value, row, index) => {
                that
                  .$get(`members/branch/permission/detail/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    console.log(response);
                  })
                  .catch(err => {});
              },
              "click .del": ($el, value, row, index) =>
                that.del(null, [{ id: value }])
            }
          }
        ],
        detailFormatter: (index, row, $el) => {},
        onEditableSave: (field, mrow, oldValue, $el) => {
          this.parentId = undefined;
          this.branchId = mrow.id;
          this.items = mrow;
          departmentModal.methods.edit.call(this);
        }
      });
    },
    addChild(id) {
      $("#myModal").modal("hide");
      this.parentId = id;
      this.branchId = 0;
      this.items = {};
      departmentModal.methods.close.call(this);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      this.parentId = dropNode.parent.data.id || 0;
      this.branchId = draggingNode.data.id;
      this.items = draggingNode.data;
      departmentModal.methods.edit.call(this);
    },
    edit(item, parentId) {
      $("#myModal").modal("hide");
      this.parentId = parentId;
      this.branchId = item.id;
      this.items = item;
      departmentModal.methods.close.call(this);
    },
    del($event, arr = this.getData($("#mattersTable"))) {
      let that = this;
      arr.forEach(e => {
        that
          .$get(`members/branch/delete/${e.id}`)
          .then(response => {
            if (response.status != 200) return false;
            that.delTable($("#mattersTable"), "id", [e.id]);
          })
          .catch(err => {});
      });
    },
    refreshed() {
      this.refresh($("#mattersTable"));
    }
  },
  mounted() {
    this.init();
  },
  created() {}
};
</script>
<style lang="less">
#department {
  #myModal {
    .el-tree {
      .el-tree-node__content {
        .custom-tree-node {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
