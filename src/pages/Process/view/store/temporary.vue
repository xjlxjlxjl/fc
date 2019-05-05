<template>
  <div id="temporary">
    <div class="modal fade temporaryPrintModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div
              ref="temporaryPrint"
              style="display: flex;padding: 15px;margin: auto;width: 540px;"
            >
              <div
                id="temporaryPrintImg"
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
                >创建人</div>
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
                >{{ modalData.created_by }}</div>
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
    <addTemporary @refresh="refreshed"></addTemporary>
    <div id="toolbar">
      <el-button type="default" size="mini" @click="add">新建来料暂收</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import addTemporary from '@/pages/Process/common/store/addTemporary';

export default {
  name: "temporary",
  data() {
    let user = JSON.parse(
      localStorage.getItem("user") || "{ user: { current_company: '' } }"
    );
    return {
      user: user,
      modalData: {}
    };
  },
  components: {
    addTemporary: addTemporary
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`repositories/receipt`, params.data)
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
        supplier_name: params.search
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
            field: "img",
            title: "二维码",
            formatter: (value, row, index) => {
              setTimeout(
                () =>
                  QRCode.toString(
                    `https://www.factoryun.com/procurement/request/${
                      row.number
                    }`,
                    (err, string) =>
                      (document.getElementById(
                        `temporary${row.id}`
                      ).innerHTML = string)
                  ),
                500
              );
              return `<div id="temporary${
                row.id
              }" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            },
            events: {
              "click .img": function(e, value, row, index) {
                that.modalData = row;
                that.modalData.company = that.user.user.current_company;
                QRCode.toString(
                  `https://www.factoryun.com/procurement/request/${row.number}`,
                  (err, string) =>
                    (document.getElementById(
                      "temporaryPrintImg"
                    ).innerHTML = string)
                );
                $(".temporaryPrintModal").modal("show");
              }
            }
          },
          {
            field: "aaa",
            title: "暂收单号",
            sortable: true
          },
          {
            field: "aaa",
            title: "暂收日期",
            sortable: true
          },
          {
            field: "aaa",
            title: "暂收员",
            sortable: true
          },
          {
            field: "aaa",
            title: "暂收来源",
            sortable: true
          },
          {
            field: "aaa",
            title: "单号",
            sortable: true
          },
          {
            field: "aaa",
            title: "委外商/供应商",
            sortable: true
          },
          {
            field: "aaa",
            title: "联系人",
            sortable: true
          },
          {
            field: "aaa",
            title: "联系电话",
            sortable: true
          },
          {
            field: "aaa",
            title: "采购员",
            sortable: true
          },
          {
            field: "aaa",
            title: "是否发送质检",
            sortable: true
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let send = `<button class="btn btn-sm btn-success send">发送品检</button>`,
                join = `<button class="btn btn-sm btn-primary join">申请入库</button>`,
                edit = `<button class="btn btn-sm btn-warning del">编　　辑</button>`,
                del = `<button class="btn btn-sm btn-danger del">删　　除</button>`;
              return send + join + edit + del;
            },
            events: {
              "click .send": function(e, value, row, index) {},
              "click .join": function(e, value, row, index) {},
              "click .edit": function(e, value, row, index) {},
              "click .del": function(e, value, row, index) {
                if (confirm('是否确认删除'))
                  that
                    .$get(`/repositories/receipt/delete/${value}`)
                    .then(response => {
                      if (response.status != 200) return false
                      that.delTable($("#temporary #table"), 'id', [value]);
                    })
                    .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#temporary #toolbar",
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
              <table>
                <tr>
                  <th>料品编码</th>
                  <th>料品名称</th>
                  <th>料品规格</th>
                  <th>单位</th>
                  <th>交期</th>
                  <th>采购数量</th>
                  <th>暂收数</th>
                  <th>尚缺数量</th>
                  <th>是否需检</th>
                  <th>备注</th>
                  <th>料品智能占用</th>
                </tr>
            `;
            html += `</table>`;

            return html;
          },
          onEditableSave(field, mrow, oldValue, $el) {}
        };
      $("#temporary #table").bootstrapTable(data);
    },
    add() {
      $("#temporary #addTemporary").modal("show");
    },
    printing() {
      this.$print(this.$refs.temporaryPrint);
      $(".temporaryPrintModal").modal("hide");
    },
    refreshed() {
      this.refresh($("#temporary #table"));
    }
  },
  mounted() {
    let that = this;
    this.init();
  }
};
</script>
<style lang="less">
#temporary {
}
</style>