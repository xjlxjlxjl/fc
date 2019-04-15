<template>
  <div id="manage">
    <addManage :row="row" @refresh="refreshed"></addManage>
    <addPosition :row="placeRow" @refresh="refreshed"></addPosition>
    <div class="modal fade managePrintModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div
              ref="managePrint"
              style="display: flex;padding: 15px;margin: auto;width: 540px;"
            >
              <div
                id="managePrintImg"
                style="width: 160px;padding: 15px;border-top: 1px solid;border-left: 1px solid;border-bottom: 1px solid;"
              ></div>
              <div style="width: 100px;border: 1px solid;">
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;"
                >公司</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >单号</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >创建日期</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                ></div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                ></div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                ></div>
              </div>
              <div
                style="width: 240px;border-top: 1px solid;border-bottom: 1px solid;border-right: 1px solid;"
              >
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;"
                >{{ modalData.company }}</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >{{ modalData.number }}</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >{{ modalData.created_at }}</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                ></div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                ></div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                ></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-info btn-small" @click="printing">打印</button>
          </div>
        </div>
      </div>
    </div>
    <div id="toolbar">
      <el-button type="default" size="mini" @click="row = { id: 0 };addStore()">新建仓库</el-button>
    </div>
    <table id="table"></table>
  </div>  
</template>
<script>
import QRCode from "qrcode";
import addManage from "@/pages/Process/common/store/addManage";
import addPosition from "@/pages/Process/common/store/addPosition";

export default {
  name: 'manage',
  data() {
    const user = JSON.parse(localStorage.getItem("user") || "{ user: { current_company: '' } }")
    return {
      user: user,
      modalData: {},
      row: { id: 0 },
      placeRow: { id: 0 }
    };
  },
  components: {
    addManage: addManage,
    addPosition: addPosition
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`respositories/list`)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.list.length
          });
        })
        .catch(err => console.error(err));
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      return params;
    },
    init() {
      const that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "number",
            title: "仓库编号",
            sortable: true
          },
          {
            field: "img",
            title: "二维码",
            formatter: (value, row, index) => {
              setTimeout(
                () =>
                  QRCode.toString(`https://www.factoryun.com/respositories/detail/${row.slug}`,
                    (err, string) =>
                      (document.getElementById(`manage${row.id}`).innerHTML = string)
                  ),
                500
              );
              return `<div id="manage${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            },
            events: {
              "click .img": function(e, value, row, index) {
                that.modalData = row;
                that.modalData.company = that.user.user.current_company;
                QRCode.toString(
                  `https://www.factoryun.com/respositories/detail/${row.slug}`,
                  (err, string) =>
                    (document.getElementById("managePrintImg").innerHTML = string)
                );
                $(".managePrintModal").modal("show");
              }
            }
          },
          {
            field: "name",
            title: "仓库名",
            sortable: true
          },
          {
            field: "type",
            title: "属性",
            sortable: true,
            formatter: function(value, row, index) {
              return value == 1 ? '仓库' : '仓位';
            }
          },
          {
            field: "description",
            title: "描述",
            sortable: true
          },
          {
            field: "address",
            title: "地址",
            sortable: true
          },
          {
            field: "enabled",
            title: "是否启用",
            formatter: function(value, row, index) {
              let checkBox = `<input type="checkbox" class="switch" checked="${value || ''}" disabled />`;
              return checkBox;
            },
            events: {
              'change .switch': function(e, value, row, index) {

              }
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: function(value, row, index) {
              let add = `<button class="btn btn-sm btn-success add">添加仓位</button>`,
                edit = `<button class="btn btn-sm btn-warning edit" style="margin-left: 5px;">编辑</button>`,
                del = `<button class="btn btn-sm btn-danger del" style="margin-left: 5px;">删除</button>`;
              return `<div style="display: flex;"> ${add + edit + del} </div>`;
            },
            events: {
              'click .add': function(e, value, row, index) {
                that.placeRow = { id: 0, parent_id: row.id };
                that.addPlace();
              },
              'click .edit': function(e, value, row, index) {
                that.row = row;
                that.addStore();
              },
              'click .del': function(e, value, row, index) {
                that
                  .$get(`respositories/delete/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#manage #table"), 'id', [row.id]);
                  }).catch(err => console.error(err));
              }
            }
          }
        ],
        data = {
          toolbar: "#manage #toolbar",
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
            let table = `
              <table class="table table-bordered">
                <tr class="active">
                  <td>仓位编号</td>
                  <td>仓位名称</td>
                  <td>描述</td>
                  <td>是否启用</td>
                  <td>操作</td>
                </tr>
            `;
            mrow.children.forEach((item, k) => {
              table += `
                <tr>
                  <td>${ item.number }</td>
                  <td>${ item.name }</td>
                  <td>${ item.description }</td>
                  <td>
                    <input type="checkbox" name="iStart" Sid="${item.id}" checked="${ item.enabled ? true : false }" disabled />
                  </td>
                  <td>
                    <button class="btn btn-warning btn-xs positionEdit" row="${field}" index="${k}">编辑</button>
                    <button class="btn btn-danger btn-xs positionDel" row="${field}" index="${k}" style="margin-left: 5px;">删除</button>
                  </td>
                </tr>
              `
            })
            table += `</table>`;
            return table;
          }
        };
      $("#manage #table").bootstrapTable(data);
    },
    addStore() {
      $("#manage #addManage").modal("show");
    },
    addPlace() {
      $("#manage #addPosition").modal("show");
    },
    printing() {
      this.$print(this.$refs.managePrint);
      $(".managePrintModal").modal("hide");
    },
    refreshed() {
      this.refresh($("#manage #table"));
    }
  },
  mounted() {
    this.init();
    let that = this;
    $("#manage").on('click', '.positionEdit', function() {
      let self = $(this),
        data = that.getAllData($("#manage #table"));
        that.placeRow = data[self.attr("row")].children[self.attr("index")];
        $("#manage #addPosition").modal("show");
    });
    $("#manage").on('click', '.positionDel', function() {
      let self = $(this),
        data = that.getAllData($("#manage #table")),
        slug = data[self.attr("row")].children[self.attr("index")].slug;
      that
        .$get(`respositories/delete/${slug}`)
        .then(response => {
          if (response.status != 200) return false;
          self.parent().parent().remove();
        })
        .catch(err => console.error(err));
    });
  }
}
</script>
<style lang="less">
#manage {

}
</style>
