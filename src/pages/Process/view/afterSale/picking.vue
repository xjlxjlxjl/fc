<template>
  <div id="picking">
    <servicePick type="2" :active="active" @refresh="refreshed"></servicePick>
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import servicePick from "@/pages/Process/common/afterSale/servicePick";

export default {
  name: "picking",
  data() {
    return {
      active: {}
    };
  },
  components: {
    servicePick: servicePick
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`service/receive_material`, params.data)
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
        search: params.search,
        page: params.offset / 10 + 1,
        per_page: params.limit
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter: (value, row, index) => {
              return `${index + 1}`;
            }
          },
          {
            field: "qrCode",
            title: "二维码",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "客服领料单号",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "创建人",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "创建日期",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "客服申请单号",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "客户公司名",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "客户联系人",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "pickId",
            title: "联系电话",
            formatter: (value, row, index) => {
              return `${value}`;
            }
          },
          {
            field: "check_status",
            title: "审核状态",
            formatter: (value, row, index) => {
              return `${value ? '审核中' : '已审核' }`;
            }
          },
          {
            field: "id",
            title: "操作",
            formatter: (value, row, index) => {
              let edit = `<button class="btn btn-success btn-sm">编辑</button>`,
                del = `<button class="btn btn-danger btn-sm">删除</button>`;
              return edit + del;
            },
            events: {
              "click .edit": function() {
                that.active = row;
                $("#picking #servicePick").modal("show");
              },
              "click .del": ($el, value, row, index) => {
                that
                  .$post(`/service/delete/${value}`)
                  .then(response => {
                    that.delTable($("#table"), "id", [value]);
                  })
                  .catch(err => {});
              }
            }
          }
        ],
        data = {
          toolbar: "#picking #toolbar",
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
          onEditableSave(field, mrow, oldValue, $el) {
            that
              .$post(`/service/edit/${mrow.id}`, mrow)
              .then(response => {
                if (response.status != 200) return false;
                this.refreshed();
              })
              .catch(err => {});
          },
          detailFormatter(field, mrow, oldValue, $el) {
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>序号</td>
                    <td>料品编码</td>
                    <td>料品规格</td>
                    <td>料品名称</td>
                    <td>单位</td>
                    <td>数量</td>
                    <td>已领数量</td>
                    <td>待领数量</td>
                  </tr>
            `;
            mrow.items.forEach((e, k) => {
              content += `
                <tr>
                  <td>${ k + 1 }</td>
                  <td>${ e.code }</td>
                  <td>${ e.info }</td>
                  <td>${ e.name }</td>
                  <td>${ e.unit }</td>
                  <td>${ e.nums }</td>
                  <td>${ e.out_num }</td>
                  <td>${ e.get_num }</td>
                </tr>
              `
            });
            content += `
                </tbody>
              </table>
            `;
            return content;
          }
        };
      $("#picking #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#picking #table"));
    }
  },
  mounted() {
    this.init();
  },
  created() {}
};
</script>
<style lang="less">
#picking {
}
</style>
