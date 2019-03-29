<template>
  <div id="purchasePlan">
    <addPlanModal :row="row"></addPlanModal>
    <div
      class="modal fade"
      id="purchasePlanPrintModal"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div
              ref="purchasePlanPrint"
              style="display: flex;padding: 15px;margin: auto;width: 540px;"
            >
              <div
                id="purchasePlanPrintImg"
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
    <div id="toolbar">
      <!-- <el-button size="mini" @click="addPlan">新建采购计划</el-button> -->
      <el-select v-model="params.status" size="mini" @change="refreshed">
        <el-option label="全部" :value="undefined"></el-option>
        <el-option label="未审核" :value="0"></el-option>
        <el-option label="已审核" :value="1"></el-option>
      </el-select>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import addPlanModal from "@/pages/Process/common/purchase/addPlan";

export default {
  name: "purchasePlan",
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    return {
      user: user,
      modalData: {
        company: "",
        created_at: "",
        created_by: "",
        number: ""
      },
      params: {
        status: undefined
      },
      row: {
        id: 0,
        items: []
      }
    };
  },
  components: {
    addPlanModal: addPlanModal,
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("procurement/schedule", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
          that.$store.commit("changeTasks", {
            name: "/Purchase/plan",
            num: response.data.pagination.total
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      params.checks = this.params.status;
      return params;
    },
    init() {
      let that = this,
        columns = [
          // {
          //   checkbox: true
          // },
          {
            field: "id",
            title: "序号",
            sortable: true,
            formatter: (value, row, index) => {
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
                    `https://www.factoryun.com/procurement/schedule/${
                      row.number
                    }`,
                    (err, string) =>
                      (document.getElementById(
                        `purchasePlanQrcode${row.id}`
                      ).innerHTML = string)
                  ),
                500
              );
              return `<div id="purchasePlanQrcode${
                row.id
              }" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            },
            events: {
              "click .img": function(e, value, row, index) {
                that.modalData = row;
                that.modalData.company = that.user.user.current_company;
                QRCode.toString(
                  `https://www.factoryun.com/procurement/schedule/${
                    row.number
                  }`,
                  (err, string) =>
                    (document.getElementById(
                      "purchasePlanPrintImg"
                    ).innerHTML = string)
                );
                $("#purchasePlanPrintModal").modal("show");
              }
            }
          },
          {
            field: "number",
            title: "采购计划单号"
          },
          {
            field: "created_by",
            title: "创建人"
          },
          {
            field: "created_at",
            title: "创建日期"
          },
          // {
          //   field: "demand_at",
          //   title: "需求日期"
          // },
          // {
          //   field: "number",
          //   title: "关联采购申请单号"
          // },
          // {
          //   field: "order_number",
          //   title: "关联销售单号"
          // },
          {
            field: "remark",
            title: "备注",
            editable: {
              type: "text",
              title: "备注",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "check_status",
            title: "审核状态"
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let del = `<button class="del btn btn-danger btn-sm">删除</button>`,
                closeCase = `<button class="closeCase btn btn-warning btn-sm" style="margin-left: 5px;">结案</button>`,
                print = `<button class="print btn btn-success btn-sm" style="margin-left: 5px;">打印</button>`,
                create = `<button class="create btn btn-primary btn-sm" style="margin-left: 5px;">生成订单</button>`,
                edit = `<button class="edit btn btn-info btn-sm" style="margin-left: 5px;">编辑</button>`;
              return del + closeCase + print + create + edit;
            },
            events: {
              "click .del": function(e, value, row, index) {
                that
                  .$get(`procurement/schedule/delete/${row.id}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#purchasePlan #table"), "id", [row.id]);
                  })
                  .catch(err => console.error(err));
              },
              "click .closeCase": function(e, value, row, index) {
                that
                  .$post(`approvals/checks`, {
                    ids: "",
                    check_status: "",
                    check_remark: "",
                    is_end_status: "",
                    end_remark: "",
                    remark: ""
                  })
                  .then(response => {
                    if (response.status != 200) return false;
                  })
                  .catch(err => console.error(err));
              },
              "click .print": function(e, value, row, index) {
                window.open(`/print.html#/purchasePlan/${row.id}`);
              },
              "click .create": function(e, value, row, index) {
                  let arr = [];
                  if ($(`.selectCase${row.id}:checked`).length) {
                    for (let e of $(`.selectCase${row.id}:checked`))
                      arr.push($(e).val());
                  } else {
                    that.$message({ message: '请打开详情选择生成订单料品', type: 'error' });
                    return false;
                  }
                  that.$post(`procurement/schedule/order/${row.id}`, {
                    ids: arr.join(',')
                  })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.$message({ message: '订单生成成功', type: 'success' });
                  })
                  .catch(err => console.error(err));
              },
              "click .edit": function(e, value, row, index) {
                that.row = row;
                that.addPlan();
              }
            }
          }
        ],
        data = {
          toolbar: "#purchasePlan #toolbar",
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
          uniqueId: "id",
          idField: "id",
          showToggle: true,
          showExport: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: columns,
          detailFormatter: (index, row, $el) => {
            let html = [
              `<table class="table table-bordered" style="white-space: nowrap;">
                <tr>
                  <th>序号</th>
                  <th>是否生成订单</th>
                  <th>关联采购计划</th>
                  <th>关联销售订单</th>
                  <th>料品编码</th>
                  <th>料品名称</th>
                  <th>料品规格</th>
                  <th>单位</th>
                  <th>数量</th>
                  <th>需求日期</th>
                  <th>备注</th>
                  <th>供应商</th>
                  <th>单价</th>
                  <th>交期</th>
                  <th>料品类别</th>                  
                  <th>结案</th>
                </tr>`
            ];
            row.items.forEach((e, k) =>
              html.push(`
                  <tr>
                    <td>${k + 1}</td>
                    <td>
                      <input 
                        type="checkbox" 
                        class="selectCase${row.id}" 
                        value="${e.id}"
                        ${e.is_closed ? 'disabled="disabled"' : ""}
                      >
                    </td>
                    <td>${row.number || ""}</td>
                    <td>${e.saleOrder || ""}</td>
                    <td>${e.material_code || ""}</td>
                    <td>${e.name || ""}</td>
                    <td>${e.specification || ""}</td>
                    <td>${e.unit || ""}</td>
                    <td>${e.quantity || ""}</td>
                    <td>${e.demand_at || ""}</td>
                    <td>${e.remark || ""}</td>
                    <td>${e.supplier || ""}</td>
                    <td>${e.price || ""}</td>
                    <td>${e.delivery_date || ""}</td>
                    <td>${e.type || ""}</td>
                    <td>
                      <input 
                        type="checkbox" 
                        aid="${row.id}" 
                        class="closeCase" 
                        index="${row.id}" 
                        value="${e.id}" 
                        ${e.is_closed ? 'checked="checked"' : ""}
                      >
                    </td>
                  </tr>
                `)
            );
            html.push(`</table>`);
            return html.join("");
          },
          onEditableSave: (field, mrow, oldValue, $el) => {
            mrow.items = JSON.stringify(mrow.items);
            that
              .$post(`procurement/schedule/edit/${mrow.id}`, mrow)
              .then(response => {
                if (response.status != 200) return false;
              })
              .catch(err => console.error(err));
          }
        };
      $("#purchasePlan #table").bootstrapTable(data);
    },
    printing() {
      this.$print(this.$refs.purchasePlanPrint);
      $("#purchasePlanPrintModal").modal("hide");
    },
    addPlan() {
      $("#addPlan").modal("show");
    },
    refreshed() {
      this.refresh($("#purchasePlan #table"));
    }
  },
  mounted() {
    const that = this;
    this.init();
    $("#purchasePlan").on("change", ".closeCase", function() {
      let self = $(this),
        id = self.attr("index"),
        data = that.getRow($("#purchasePlan #table"), id),
        params = {};

      for (let item of data.items) {
        if (item.id == self.val()) {
          if (item.is_closed) item.is_closed = 0;
          else item.is_closed = 1;

          if (isNaN(item.demand_at)) item.demand_at = undefined;
          else
            item.demand_at = that.dateParse(new Date(item.demand_at || null));

          params = item;
        }
      }

      that
        .$post(`procurement/schedule/item/edit/${params.id}`, params)
        .then(response => {
          if (response.status != 200) return false;
          that.editRow($("#purchasePlan #table"), id, data);
        })
        .catch(err => console.error(err));
    });
  }
};
</script>
<style lang="less">
#purchasePlan {
  .detail-view {
    > td {
      padding: 0;
    }
  }
  .img {
    width: 100%;
  }
}
</style>