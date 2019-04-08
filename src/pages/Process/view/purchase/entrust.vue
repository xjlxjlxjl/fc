<template>
  <div id="purchasEntrust">
    <addEntrustModal></addEntrustModal>
    <div class="modal fade" id="purchasEntrustPrintModal" role="dialog" >
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
    <!-- 合同列表 -->
    <div class="modal fade contract" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <table class="table table-bordered" style="margin-bottom: 0;">
              <tbody>
                <tr>
                  <th>合同</th>
                  <th>上传日期</th>
                </tr>
                <tr v-for="item in contracts" :key="item.id">
                  <td><button class="btn btn-link" @click="showPDF(item.url)">{{ item.name }}</button></td>
                  <td>{{ item.created_at.split(' ')[0] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- 查看报告 -->
    <div class="modal fade report" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div id="canvasBox"></div>
        </div>
      </div>
    </div>
    <!-- 委外领料 -->
    <div class="modal fade outMaterList" role="dialog">
      <div class="modal-dialog" role="document" style="width: 100%;max-width: 1080px;">
        <div class="modal-content">
          <div class="modal-body">
            <el-table :data="tableData" size="mini" border style="width: 100%">
              <el-table-column label="序号" width="50">
                <template slot-scope="{ $index }"><span>{{ $index + 1 }}</span></template>
              </el-table-column>
              <el-table-column prop="material_code" label="成品料编码"></el-table-column>
              <el-table-column prop="material_code" label="料品编码">
                <template slot-scope="{ $index, row }">
                  <el-input size="mini" v-model="row.material_code">
                    <el-button slot="append" type="default" @click="addMater(true);index = $index">
                      <i class="el-icon-arrow-down"></i>
                    </el-button>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="料品名称">
                <template slot-scope="{ $index, row }">
                  <el-input size="mini" v-model="row.name">
                    <el-button slot="append" type="default" @click="addMater(true);index = $index">
                      <i class="el-icon-arrow-down"></i>
                    </el-button>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="specification" label="料品规格">
                <template slot-scope="{ $index, row }">
                  <el-input size="mini" v-model="row.specification">
                    <el-button slot="append" type="default" @click="addMater(true);index = $index">
                      <i class="el-icon-arrow-down"></i>
                    </el-button>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="unit" label="单位" width="50"></el-table-column>
              <el-table-column prop="quantity" label="数量" width="50"></el-table-column>
              <el-table-column prop="length" label="长度" width="50"></el-table-column>
              <el-table-column prop="store" label="仓库" width="50"></el-table-column>
              <el-table-column prop="demand_at" label="需求日期">
                <template slot-scope="{ row }">
                  <el-date-picker size="mini" v-model="row.demand_at" type="date" value-format="yyyy-MM-dd" placeholder="需求日期"></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注">
                <template slot-scope="{ $index, row }">
                  <el-input size="mini" v-model="row.remark"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="50">
                <template slot-scope="{ $index }">
                  <el-button type="text" @click="tableData.splice($index, 1)">
                    <i class="el-icon-delete" style="font-size: 2.1rem;"></i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" size="mini" @click="tableData.push({})" style="width: 100%;"><i class="el-icon-plus"></i></el-button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="addReceive">确定</button>
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade materielList" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table
            :data="mater.data"
            border
            style="width: 100%"
            height="500"
            highlight-current-row
            @current-change="materChange"
          >
            <el-table-column prop="material_code" label="物料编码"></el-table-column>
            <el-table-column prop="name" label="物料名称"></el-table-column>
            <el-table-column prop="specification" label="料品规格"></el-table-column>
            <el-table-column prop="material_category.name" label="料品类别"></el-table-column>
            <el-table-column prop="item_unit" label="主单位"></el-table-column>
            <el-table-column prop="image" label="图片"></el-table-column>
            <el-table-column prop="drawing_pdf" label="工程图号"></el-table-column>
            <el-table-column prop="barcode" label="条码"></el-table-column>
            <el-table-column prop="date" label="颜色"></el-table-column>
            <el-table-column prop="date" label="有效期"></el-table-column>
            <el-table-column prop="max_inventory" label="最大库存"></el-table-column>
            <el-table-column prop="min_inventory" label="最小库存"></el-table-column>
            <el-table-column prop="manufacturer" label="生产厂家"></el-table-column>
            <el-table-column prop="respository.name" label="仓库"></el-table-column>
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
            <el-table-column prop="dimension" label="材积"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="density" label="密度"></el-table-column>
            <el-table-column prop="standard_model" label="模具号"></el-table-column>
            <el-table-column prop="material_level" label="料品等级"></el-table-column>
            <el-table-column prop="date" label="材质"></el-table-column>
            <el-table-column prop="standard_cost_price" label="进价"></el-table-column>
            <el-table-column prop="standard_uniform_price" label="售价"></el-table-column>
            <el-table-column prop="standard_single_price" label="标准价"></el-table-column>
            <el-table-column prop="date" label="英文名称"></el-table-column>
            <el-table-column prop="minimum_purchase_quantity" label="最小采购量"></el-table-column>
            <el-table-column prop="date" label="最小批量"></el-table-column>
            <el-table-column prop="date" label="采购提前期"></el-table-column>
            <el-table-column prop="date" label="出货免检"></el-table-column>
            <el-table-column prop="suppler_name" label="主供应商"></el-table-column>
            <el-table-column prop="date" label="供应商简称"></el-table-column>
            <el-table-column prop="created_at" label="生效"></el-table-column>
            <el-table-column prop="pinyin_code" label="拼音码"></el-table-column>
            <el-table-column prop="length" label="料品长"></el-table-column>
            <el-table-column prop="width" label="料品宽"></el-table-column>
            <el-table-column prop="height" label="料品高"></el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
            <el-table-column prop="member" label="管理者"></el-table-column>
            <el-table-column prop="updated_at" label="修改日期"></el-table-column>
            <el-table-column prop="updated_by" label="修改用户"></el-table-column>
          </el-table>
          <div class="condition">
            <!-- <div>
              <span>查找关键字</span>
              <el-input size="mini"></el-input>
            </div>
            <div>
              <span>申请日期</span>
              <el-date-picker
                size="mini"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </div> -->
            <div></div>
            <div>
              <button class="btn btn-primary btn-sm" @click="addMater(false)">确定</button>
              <button class="btn btn-default btn-sm" data-dismiss="modal" aria-label="Close">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="toolbar">
      <!-- <el-button size="mini" @click="addEntrust">新建委外订单</el-button> -->
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
import PDFJS from "pdfjs-dist";
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
      tableData: [],
      mater: {
        data: [],
        selection: []
      },
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      contracts: [],
      activated: {}
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
      params.checks = this.params.status;
      return params;
    },
    init() {
      let that = this,
        columns = [
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
                    `https://www.factoryun.com/procurement/outsourcing/${
                      row.number
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
                  `https://www.factoryun.com/procurement/outsourcing/${
                    row.number
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
            title: "委外订单单号"
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
            field: "contract",
            title: "合同",
            formatter: () => {
              let getContract = `<button class="btn btn-link getContract">查看合同</button>`;
              return getContract;
            },
            events: {
              "click .getContract": function(e, value, row, index) {
                that.contracts = row.contracts;
                $("#purchasEntrust .contract").modal("show");
              }
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let get = `<button class="get btn btn-primary btn-sm">委外领料</button>`,
                del = `<button class="del btn btn-danger btn-sm">删除</button>`,
                print = `<button class="print btn btn-success btn-sm">打印</button>`,
                upload = `<input class="upload" style="display: inline-block;width: 70px;height: 30px;position: absolute;opacity: 0;" type="file" multiple="multiple" />
                          <button class="btn btn-warning btn-sm">上传文件</button>`;
              return `<div style="position: relative;">${upload + get + del + print}</div>`;
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
                let arr = [];
                for (let item of row.items)
                  arr.push(Object.assign(item, row));
                that.mater.data = arr;
                that.activated = row;
                $("#purchasEntrust .outMaterList").modal("show");
              },
              'click .print':function (e, value, row, index) {
                window.open(`/print.html#/purchasEntrust/${row.id}`);
              },
              "change .upload": function(e, value, row, index) {
                  let arr = [];
                  for (let e of row.contracts) arr.push(e.id);
                for (let k in $(this)[0].files) {
                  if(isNaN(parseInt(k))) return false;
                  let form = new FormData();
                  form.append("upload", $(this)[0].files[k]);
                  form.append("slug", "procurement");
                  that
                    .$upload("files/upload", form)
                    .then(response => {
                      if (response.status != 200) return false;
                      arr.push(response.data.upload.id);
                      if (k == $(this)[0].files.length - 1)
                        that.editEntrust(row.id, {
                          supplier_id: row.supplier_id,
                          supplier_contract_id: row.supplier_contract_id,
                          contract_ids: arr.join(','),
                        });
                    })
                    .catch(err => console.error(err));
                }
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
              } disabled></td>
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
    editEntrust(id, params) {
      let that = this;
      that
        .$post(`procurement/outsourcing/edit/${id}`, params)
        .then(response => {
          if (response.status != 200) return false;
          that.refreshed();
        })
        .catch(err => console.error(err));
    },
    addReceive() {
      let that = this,
        arr = [];
      that.tableData.forEach(e => arr.push({
        material_id: e.material_id,
        name: e.name,
        specification: e.specification,
        unit: e.unit,
        quantity: e.quantity,
        demand_at: e.demand_at,
        remark: e.remark
      }));
      that
        .$post(`procurement/out_picking_material/create`, {
          applicant_id: that.activated.applicant_id,
          branch_id: that.activated.branch_id,
          outsourcing_id: that.activated.id,
          supplier_id: that.activated.supplier_id,
          supplier_contract_id: that.activated.supplier_contract_id,
          items: arr
        })
        .then(response => {
          if (response.status != 200) return false;
          $("#purchasEntrust .outMaterList").modal("hide");
        })
        .catch(err => console.error(err));
    },
    materChange(val) {
      this.mater.selection = val;
    },
    addMater(state = false) {
      $("#purchasEntrust .materielList").modal("toggle");
      if (state) return false;
      this.tableData[this.index] = this.mater.selection;
      this.tableData.push({});
      this.tableData.pop();
    },
    showPDF(url) {
      let _this = this;
      $("#canvasBox").empty();
      $(".report").modal("show");
      switch(url.split('.').pop()) {
        case 'pdf':
          PDFJS.getDocument(url).then(function(pdf) {
            _this.pdfDoc = pdf;
            for (let i = 1; i < pdf.numPages + 1; i++) {
              _this.renderPage(i);
            }
          });
          break;
        default:
          let img = new Image();
          img.style.width = '100%';
          img.src = url;
          document.getElementById("canvasBox").appendChild(img);
          break;
      }
    },
    renderPage(num) {
      this.pageRendering = true;
      let _this = this;
      this.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(_this.scale);
        // let canvas = document.getElementById("the-canvas");
        let canvas = document.createElement("canvas");
        canvas.height = isNaN(viewport.height) ? 800 : viewport.height;
        canvas.width = isNaN(viewport.width) ? 600 : viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: canvas.getContext("2d"),
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        document.getElementById("canvasBox").appendChild(canvas);
        // Wait for rendering to finish
        renderTask.promise.then(function() {
          _this.pageRendering = false;
          if (_this.pageNumPending !== null) {
            // New page rendering is pending
            _this.renderPage(_this.pageNumPending);
            _this.pageNumPending = null;
          }
        });
      });
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
        data = that.getRow($("#purchasEntrust #table"), id),
        params = {};

      for (let item of data.items) {
        if (item.id == self.val()) {
          if (item.is_closed) item.is_closed = 0;
          else item.is_closed = 1;
          params = item;
        }
      }
      
      that
        .$post(`procurement/outsourcing/item/edit/${params.id}`, params)
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
  .report {
    #canvasBox {
      text-align: center;
      canvas {
        max-width: 100%;
      }
    }
  }
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
  .outMaterList {
    .el-date-editor {
      width: 100%;
      > input {
        padding-right: 0;
      }
    }
  }
}
</style>