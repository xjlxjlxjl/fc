<template>
  <div id="overtime">
    <div id="mattersToolbar">
      <span class="lead">签到列表</span>
      <el-date-picker
        v-model="date"
        type="daterange"
        value-format="yyyy-MM-dd"
        size="mini"
        @change="refreshed">
      </el-date-picker>
    </div>
    <table id="mattersTable"></table>
  </div>
</template>
<script>
export default {
  name: "overtime",
  data() {
    return {
      date: []
    };
  },
  components: {},
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`personnels/siginin`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        current_page: params.limit,
        member_name: params.search,
        created_start_at: this.date[0],
        created_end_at: this.date[1]
      };
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "created_at",
            title: "打卡时间",
            sortable: true
          },
          {
            field: "full_name",
            title: "打卡人",
            sortable: true
          },
          {
            field: "address",
            title: "打卡地址",
            sortable: true
          },
          {
            field: "lnglat",
            title: "经纬度",
            sortable: true,
            formatter: (value, row, index) => {
              return `${row.address_x},${row.address_y}`;
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
                  .$get(`personnels/siginin/delete/${value}`)
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
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };
      $("#mattersTable").bootstrapTable(data);
    },
    create() {
      addOvertime.methods.close.call(this);
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
#overtime {
}
</style>
