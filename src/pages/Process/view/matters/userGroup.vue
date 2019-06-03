<template>
  <div id="userGroup">
    <addUserGroup :row="form" @refresh="refreshed"></addUserGroup>
    <div id="mattersToolbar">
      <span class="lead">用户组列表</span>
      <el-select v-model="slug" size="mini" @change="refreshed">
        <el-option label="全部" :value="undefined"></el-option>
        <el-option label="客服组" value="customer"></el-option>
        <el-option label="业务组" value="business"></el-option>
        <el-option label="报价组" value="quoted_price"></el-option>
        <el-option label="仓库组" value="storehouse"></el-option>
        <el-option label="生产组" value="production"></el-option>
      </el-select>
      <el-button size="mini" @click="addUserGroup();form.id = 0">新建用户组</el-button>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
import addUserGroup from "@/pages/Process/common/matters/addUserGroup";
export default {
  name: "userGroup",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      slug: undefined,
      form: {
        id: 0,
        slug: undefined,
        members: []
      }
    };
  },
  components: {
    addUserGroup: addUserGroup
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("members/user_group", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      params.slug = this.slug;
      return params;
    },
    init() {
      const that = this,
        columns = [
          {
            field: "created_at",
            title: "创建时间",
            sortable: true
          },
          {
            field: "created_by",
            title: "创建人",
            sortable: true
          },
          {
            field: "updated_at",
            title: "更新时间",
            sortable: true
          },
          {
            field: "updated_by",
            title: "更新人",
            sortable: true
          },
          {
            field: "delete_at",
            title: "删除时间",
            sortable: true
          },
          {
            field: "name",
            title: "名称",
            sortable: true
          },
          {
            field: "company_name",
            title: "公司名称",
            sortable: true
          },
          {
            field: "id",
            title: "操作",
            formatter: (value, row, index) => {
              let del = `<button class="btn btn-danger btn-sm del">删除</button>`,
                add = `<button class="btn btn-success btn-sm add">添加成员</button>`;
              
              return del + add;
            },
            events: {
              'click .del': function($el, value, row, index) {
                that
                  .$get(`members/user_group/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#mattersTable"), 'id', [value]);
                  }).catch(err => console.error(err));
              },
              'click .add': function($el, value, row, index) {
                let arr = [];
                row.members.forEach(e => arr.push(e.id));
                that.form = {
                  id: row.id,
                  slug: row.slug,
                  members: arr
                }
                that.addUserGroup();
              }
            }
          }
        ],
        data = {
          toolbar: "#mattersToolbar",
          ajax: this.tableAjaxData,
          queryParams: this.tableAjaxParams,
          search: false,
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
          detailFormatter: (index, row, $el) => {
            let html = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>用户名称</td>
                    <td>用户昵称</td>
                    <td>成员头像</td>
                    <td>操作</td>
                  </tr>
            `;
            row.members.forEach(e => (html += `
              <tr>
                <td>${e.username}</td>
                <td>${e.display_name}</td>
                <td><img src="${e.avatar}" style="width: 50px;max-height: 50px;"></td>
                <td>
                  <button index="${index}" mid="${e.id}" class="delUser btn btn-danger btn-sm">删除</button>
                </td>
              </tr>
            `));
            return html;
          },
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };
      $("#mattersTable").bootstrapTable(data);
    },
    addUserGroup() {
      $("#userGroup #addUserGroup").modal("show");
    },
    refreshed() {
      this.refresh($("#mattersTable"));
    }
  },
  mounted() {
    const that = this;
    this.init();
    $("#userGroup").on('click', '.delUser', function(e) {
      const index = $(this).attr('index'),
        id = $(this).attr('mid'),
        data = that.getAllData($("#mattersTable")),
        self = data[index],
        arr = [];
        self.members.forEach(e => arr.push(e.id));
        arr.splice(arr.indexOf(id), 1);

        that.$post(`members/user_group/edit/${self.id}`, {
          slug: self.slug,
          members: arr.join(',')
        }).then(response => {
          if (response.status != 200) return false;
          $(this).parent().parent().remove();
        }).catch(err => console.error(err));
    })
  },
  created() {}
};
</script>
