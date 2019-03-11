<template>
  <div id="purchasEntrust">
    <addEntrustModal></addEntrustModal>
    <div
      class="modal fade"
      id="purchasEntrustPrintModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div
              ref="purchasEntrustPrint"
              style="display: flex;padding: 15px;margin: auto;width: 540px;"
            >
              <div
                id="purchasEntrustPrintImg"
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
    <div
      class="modal fade bs-example-modal-lg materielList"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table
            :data="mater.data"
            border
            style="width: 100%"
            height="500"
            @selection-change="materChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="material_number" label="物料编码"></el-table-column>
            <el-table-column prop="name" label="物料名称"></el-table-column>
            <el-table-column prop="material_specification" label="料品规格"></el-table-column>
            <el-table-column prop="material_category" label="料品类别"></el-table-column>
            <el-table-column prop="item_unit" label="主单位"></el-table-column>
            <el-table-column prop="image" label="图片"></el-table-column>
            <el-table-column prop="drawing_pdf" label="工程图号"></el-table-column>
            <el-table-column prop="date" label="条码"></el-table-column>
            <el-table-column prop="date" label="颜色"></el-table-column>
            <el-table-column prop="date" label="有效期"></el-table-column>
            <el-table-column prop="max_inventory" label="最大库存"></el-table-column>
            <el-table-column prop="min_inventory" label="最小库存"></el-table-column>
            <el-table-column prop="date" label="生产厂家"></el-table-column>
            <el-table-column prop="respository" label="仓库"></el-table-column>
            <el-table-column prop="attributes" label="BOM单位"></el-table-column>
            <el-table-column prop="date" label="料品类别" width="400px">
              <template slot-scope="{}">
                <div class="materialsType">
                  <div>
                    <input type="checkbox">采购件
                  </div>
                  <div>
                    <input type="checkbox">自制件
                  </div>
                  <div>
                    <input type="checkbox">委外件
                  </div>
                  <div>
                    <input type="checkbox">销售件
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="attributes" label="料品属性"></el-table-column>
            <el-table-column prop="date" label="损耗率"></el-table-column>
            <el-table-column prop="weight" label="净重"></el-table-column>
            <el-table-column prop="total_weight" label="毛重"></el-table-column>
            <el-table-column prop="date" label="材积"></el-table-column>
            <el-table-column prop="date" label="备注"></el-table-column>
            <el-table-column prop="date" label="密度"></el-table-column>
            <el-table-column prop="date" label="模具号"></el-table-column>
            <el-table-column prop="date" label="料品等级"></el-table-column>
            <el-table-column prop="date" label="材质"></el-table-column>
            <el-table-column prop="date" label="进价"></el-table-column>
            <el-table-column prop="date" label="售价"></el-table-column>
            <el-table-column prop="date" label="标准价"></el-table-column>
            <el-table-column prop="date" label="英文名称"></el-table-column>
            <el-table-column prop="date" label="最小采购量"></el-table-column>
            <el-table-column prop="date" label="最小批量"></el-table-column>
            <el-table-column prop="date" label="采购提前期"></el-table-column>
            <el-table-column prop="date" label="出货免检"></el-table-column>
            <el-table-column prop="date" label="主供应商"></el-table-column>
            <el-table-column prop="date" label="供应商简称"></el-table-column>
            <el-table-column prop="created_at" label="生效"></el-table-column>
            <el-table-column prop="pinyin_code" label="拼音码"></el-table-column>
            <el-table-column prop="length" label="料品长"></el-table-column>
            <el-table-column prop="width" label="料品宽"></el-table-column>
            <el-table-column prop="height" label="料品高"></el-table-column>
            <el-table-column prop="date" label="状态"></el-table-column>
            <el-table-column prop="member" label="管理者"></el-table-column>
            <el-table-column prop="date" label="修改日期"></el-table-column>
            <el-table-column prop="date" label="修改用户"></el-table-column>
          </el-table>
          <div class="condition">
            <div>
              <span>查找关键字</span>
              <el-input size="mini" @blur="getMater"></el-input>
            </div>
            <div>
              <span>申请日期</span>
              <el-date-picker
                size="mini"
                @change="getMater"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </div>
            <div>
              <button class="btn btn-primary btn-sm" @click="addMater">确定</button>
              <button class="btn btn-default btn-sm">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="toolbar">
      <el-button size="mini" @click="addEntrust">新建委外订单</el-button>
      <el-select v-model="params.status" size="mini" @change="refreshed">
        <el-option label="未完成" :value="0"></el-option>
        <el-option label="已完成" :value="1"></el-option>
        <el-option label="全部" :value="2"></el-option>
      </el-select>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import addEntrustModal from "@/pages/Process/common/purchase/addEntrust";

export default {
  name: "purchasEntrust",
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
        status: 0
      },
      mater: {
        active: {},
        data: [{}]
      }
    };
  },
  components: {
    addEntrustModal: addEntrustModal
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("procurement/outsourcing", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$store.commit("changeTasks", {
            name: "/Purchase/entrust",
            num: response.data.pagination.total
          });
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      params.status = this.params.status;
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
            sortable: true
          },
          {
            field: "img",
            title: "二维码",
            formatter: (value, row, index) => {
              setTimeout(
                () =>
                  QRCode.toString(
                    `https://www.factoryun.com/procurement/outsourcing/detail/${
                      row.id
                    }`,
                    (err, string) =>
                      (document.getElementById(
                        `purchasEntrustQrcode${row.id}`
                      ).innerHTML = string)
                  ),
                500
              );
              return `<div id="purchasEntrustQrcode${
                row.id
              }" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            },
            events: {
              "click .img": function(e, value, row, index) {
                that.modalData = row;
                that.modalData.company = that.user.user.current_company;
                QRCode.toString(
                  `https://www.factoryun.com/procurement/outsourcing/detail/${
                    row.id
                  }`,
                  (err, string) =>
                    (document.getElementById(
                      "purchasEntrustPrintImg"
                    ).innerHTML = string)
                );
                $("#purchasEntrustPrintModal").modal("show");
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
          {
            field: "demand_at",
            title: "需求日期"
          },
          {
            field: "number",
            title: "关联采购申请单号"
          },
          {
            field: "number",
            title: "关联销售单号"
          },
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
            field: "supplier",
            title: "供应商"
          },
          {
            field: "phone",
            title: "联系电话"
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let get = `<button class="get btn btn-primary btn-sm">委外领料</button>`;
              let del = `<button class="del btn btn-danger btn-sm">删除</button>`;
              return del;
            },
            events: {
              "click .del": function(e, value, row, index) {
                that
                  .$get(`procurement/outsourcing/delete/${row.id}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#purchasEntrust #table"), "id", [row.id]);
                  })
                  .catch(err => console.error(err));
              },
              "click .get": function(e, value, row, index) {
                that.mater.active = row;
                that.getMater();
              }
            }
          }
        ],
        data = {
          toolbar: "#purchasEntrust #toolbar",
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
              `<table class="table table-bordered">
                <tr>
                  <th>料品编码</th>
                  <th>料品名称</th>
                  <th>料品规格</th>
                  <th>单位</th>
                  <th>数量</th>
                  <th>备注</th>
                  <th>单价</th>
                  <th>交期</th>
                  <th>结案</th>
                </tr>`
            ];
            row.items.forEach(e =>
              html.push(`
                  <tr>
                    <td>${e.material_code || ""}</td>
                    <td>${e.name || ""}</td>
                    <td>${e.specification || ""}</td>
                    <td>${e.unit || ""}</td>
                    <td>${e.quantity || ""}</td>
                    <td>${e.remark || ""}</td>
                    <td>${e.price || ""}</td>
                    <td>${e.delivery_date || ""}</td>
                    <td><input type="checkbox" aid="${
                      row.id
                    }" class="closeCase" index="${row.id}" value="${e.id}" ${
                e.is_closed ? 'checked="checked"' : ""
              }></td>
                  </tr>
                `)
            );
            html.push(`</table>`);
            return html.join("");
          },
          onEditableSave: (field, mrow, oldValue, $el) => {
            mrow.items = JSON.stringify(mrow.items);
            that
              .$post(`procurement/outsourcing/edit/${mrow.id}`, mrow)
              .then(response => {
                if (response.status != 200) return false;
                console.log(response);
              })
              .catch(err => console.error(err));
          }
        };
      $("#purchasEntrust #table").bootstrapTable(data);
    },
    printing() {
      this.$print(this.$refs.purchasEntrustPrint);
      $("#purchasEntrustPrintModal").modal("hide");
    },
    addEntrust() {
      $("#addEntrust").modal("show");
    },
    getMater() {
      let that = this;
      that
        .$get(`respositories/materials/list`)
        .then(response => {
          if (response.status != 200) return false;
          that.mater.data = response.data.list;
          $("#purchasEntrust .materielList").modal("show");
        })
        .catch(err => console.error(err));
    },
    materChange(val) {
      this.mater.selection = val;
    },
    addMater() {
      this.mater.selection.forEach(e =>
        this.form.items.unshift({
          material_id: e.id,
          code: e.material_number || "",
          name: e.name || "",
          specification: e.material_specification || "",
          unit: e.item_unit || "",
          quantity: e.quantity || "",
          remarks: e.remarks || ""
        })
      );
      $("#purchasEntrust .materielList").modal("hide");
    },
    refreshed() {
      this.refresh($("#purchasEntrust #table"));
    }
  },
  mounted() {
    const that = this;
    this.init();
    $("#purchasEntrust").on("change", ".closeCase", function() {
      let self = $(this),
        id = self.attr("index"),
        data = that.getRow($("#purchasEntrust #table"), id);
      for (let item of data.items) {
        if (item.id == self.val())
          if (item.is_closed) item.is_closed = 0;
          else item.is_closed = 1;
      }
      let params = data;
      params.item = JSON.stringify(params.item);
      that
        .$post(`procurement/request/edit/${id}`, params)
        .then(response => {
          if (response.status != 200) return false;
          that.editRow($("#purchasEntrust #table"), id, data);
        })
        .catch(err => console.error(err));
    });
  }
};
</script>
<style lang="less">
#purchasEntrust {
  .materielList,
  .materList {
    .el-table {
      td {
        &:nth-child(17) {
          padding: 0;
          .cell {
            padding: 0;
            .materialsType {
              display: flex;
              > div {
                border: 1px solid;
                white-space: nowrap;
                width: 100px;
                height: 50px;
                line-height: 50px;
                text-align: center;
              }
            }
          }
        }
      }
    }
    .condition {
      display: flex;
      justify-content: space-between;
      padding: 1rem;
      > div {
        display: flex;
        align-items: center;
        button,
        span {
          white-space: nowrap;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>