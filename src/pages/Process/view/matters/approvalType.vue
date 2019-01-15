<template>
  <div id="approvalType">
    <addAppType @refresh="refreshed"></addAppType>
    <div id="mattersToolbar">
      <span class="lead">审批类型列表</span>
      <el-button size="mini" @click="add">新建</el-button>
      <el-button size="mini" @click="del">删除</el-button>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
import addAppType from "@/pages/Process/common/addAppType";
export default {
  name: "approvalType",
  data() {
    return {
      addonList: []
    };
  },
  components: {
    addAppType: addAppType
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`approvals/type`, params.data)
        .then(response => {
          if (response.status == 400) {
            params.success({
              total: 10,
              rows: []
            });
          }
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => console.error(err));
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      params.d = params.search;
      return params;
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "name",
            title: "类型名称",
            sortable: true,
            editable: {
              type: "text",
              title: "名称",
              emptytext: "空"
            }
          },
          {
            field: "description",
            title: "详情",
            sortable: true,
            editable: {
              type: "text",
              title: "详情",
              emptytext: "空"
            }
          },
          {
            field: "addon",
            title: "类型的插件",
            editable: {
              type: "select",
              source: this.addonList,
              title: "插件",
              emptytext: "空"
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let del = [
                `<button class="btn btn-danger btn-sm del">删除</button>`
              ];
              return del;
            },
            events: {
              "click .del": ($el, value, row, index) => {
                that
                  .$post(`approvals/type/delete`, {
                    slug: value
                  })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#mattersTable"), "id", [row.id]);
                  })
                  .catch(err => {});
              }
            }
          }
        ],
        data = {
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
          columns: columns,
          onEditableSave: (field, mrow, oldValue, $el) => {
            that
              .$post(`approvals/type/edit`, {
                name: mrow.name,
                addon: mrow.addon,
                description: mrow.description,
                slug: mrow.slug
              })
              .then(response => {
                if (response.status != 200) return false;
              })
              .catch(err => {});
          }
        };
      $("#mattersTable").bootstrapTable(data);
    },
    add() {
      addAppType.methods.close.call(this);
    },
    del() {
      let that = this;
      that.getData($("#mattersTable")).forEach(e => {
        that
          .$post(`approvals/type/delete`, {
            slug: e.slug
          })
          .then(response => {
            if (response.status != 200) return false;
            that.delTable($("#mattersTable"), "id", [e.id]);
          })
          .catch(err => {});
      });
    },
    refreshed() {
      this.refresh($("#mattersTable"));
    },
    getType() {
      if (this.$store.state.addonList.length) {
        this.addonList = this.$store.state.addonList;
        this.init();
        return false;
      }
      let that = this;
      that
        .$get(`approvals/type/addon`)
        .then(response => {
          if (response.status != 200) return false;
          let arr = [];
          for (const key in response.data) {
            for (const k in response.data[key]) {
              arr.push({ text: response.data[key][k], value: k });
            }
          }
          this.$store.commit("setStateData", { name: "addonList", arr: arr });
          this.addonList = this.$store.state.addonList;
          this.init();
        })
        .catch(err => console.error(err));
    }
  },
  mounted() {
    this.getType();
  }
};
</script>
<style lang="less">
#approvalType {
}
</style>
