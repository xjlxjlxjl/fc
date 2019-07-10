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
                >{{ modalData.receipt_no }}</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >{{ modalData.created_at }}</div>
                <div
                  style="width: 100%;height: 40px;font-size: 13px;line-height: 40px;text-align: center;border-top: 1px solid;"
                >{{ modalData.receipt_user.last_name }}</div>
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
    <addTemporary :active="active" @refresh="refreshed"></addTemporary>
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
      active: {},
      modalData: {
        receipt_user: {}
      }
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
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        supplier_name: params.search || undefined
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
            field: "qr_code_text",
            title: "二维码",
            formatter(value, row, index) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`temporary${row.id}`).innerHTML = string)), 500);
              return `<div id="temporary${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            },
            events: {
              "click .img": function(e, value, row, index) {
                that.modalData = row;
                that.modalData.company = that.user.user.current_company;
                QRCode.toString(value, (err, string) => (document.getElementById("temporaryPrintImg").innerHTML = string));
                $(".temporaryPrintModal").modal("show");
              }
            }
          },
          {
            field: "receipt_no",
            title: "暂收单号",
            sortable: true
          },
          {
            field: "created_at",
            title: "暂收日期",
            sortable: true
          },
          {
            field: "receipt_user.last_name",
            title: "暂收员",
            sortable: true
          },
          {
            field: "from",
            title: "暂收来源",
            formatter: function(value) {
              return value;
            }
          },
          {
            field: "order_number",
            title: "单号",
            sortable: true
          },
          {
            field: "is_return",
            title: "是否退换货",
            editable: {
              type: "select",
              title: "是否退换货",
              source: [{value: 0, text: '否'}, {value: 1, text: '是'}]
            }
          },
          {
            field: "supplier.name",
            title: "委外商/供应商",
            sortable: true
          },
          {
            field: "supplier.contract",
            title: "联系人",
            sortable: true
          },
          {
            field: "supplier.phone",
            title: "联系电话",
            sortable: true
          },
          {
            field: "purchase_user",
            title: "采购员",
            sortable: true
          },
          {
            field: "is_inspection",
            title: "是否发送质检",
            formatter: function(value) {
              return value ? '是' : '否';
            }
          },
          {
            field: "id",
            title: "操作",
            formatter: function(value, row, index) {
              let send = `<button class="btn btn-sm btn-success send">发送品检</button>`,
                join = `<button class="btn btn-sm btn-primary join">申请入库</button>`,
                edit = `<button class="btn btn-sm btn-warning edit">编　　辑</button>`,
                del = `<button class="btn btn-sm btn-danger del">删　　除</button>`;
              return send + join + edit + del;
            },
            events: {
              "click .send": function(e, value, row, index) {
                that
                  .$get(`repositories/receipt/send/${value}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    console.log(response);
                  })
                  .catch(e => console.error(e));
              },
              "click .join": function(e, value, row, index) {},
              "click .edit": function(e, value, row, index) {
                that.active = row;
                that.add();
              },
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
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <th></th>
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
            for (let item of mrow.items) {
              html += `
                <tr>
                  <td><input type="checkbox" class="" /></td>
                  <td>${ item.material.material_number }</td>
                  <td>${ item.material.name }</td>
                  <td>${ item.material.material_specification }</td>
                  <td>${ item.material.item_unit }</td>
                  <td>${ item.order_item ? item.order_item.delivery_period : '' }</td>
                  <td>${ item.order_item ? item.order_item.quantity : '' }</td>
                  <td>${ item.cancel_quantity || '' }</td>
                  <td>${ item.wait_quantity || '' }</td>
                  <td>${ item.is_inspection ? '是' : '否' }</td>
                  <td>${ item.remark || '' }</td>
                  <td><button class="btn btn-default btn-sm">查看占用</button></td>
                </tr>
              `;
            }
            html += `</tbody></table>`;
            return html;
          },
          onEditableSave(field, mrow, oldValue, $el) {
            that
              .$post(`repositories/receipt/edit/${mrow.id}`, { is_return: mrow.is_return })
              .then(response => {
                if (response.status != 200) return false;
              })
              .catch(e => console.error(e));
          }
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