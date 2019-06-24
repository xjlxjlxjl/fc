<template>
  <div>
    <div class="modal fade" id="addBom" role="dialog">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
          <div class="modal-body">
            <el-form
              :model="form"
              :rules="rules"
              ref="form"
              size="mini"
              label-position="left"
              label-width="110px"
            >
              <el-form-item v-if="!row.id" label="关联订单号" prop="order_numbers">
                <el-input v-model="form.order_numbers" placeholder="请选择">
                  <el-button slot="suffix" type="default" @click="orderModal = !orderModal">
                    <i class="el-icon-arrow-down"></i>
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="成品料号编码" prop="material_code">
                <el-input v-model="form.material_code" placeholder="请选择">
                  <el-button slot="suffix" type="default" @click="getMaterial(-1)">
                    <i class="el-icon-arrow-down"></i>
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="料品规格" prop="material_specification">
                <el-input v-model="form.material_specification" placeholder="请选择">
                  <el-button slot="suffix" type="default" @click="getMaterial(-1)">
                    <i class="el-icon-arrow-down"></i>
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="料品名称" prop="name">
                <el-input v-model="form.name" placeholder="请选择">
                  <el-button slot="suffix" type="default" @click="getMaterial(-1)">
                    <i class="el-icon-arrow-down"></i>
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item v-if="row.id" label="BOM版本" prop="version">
                <el-input v-model="form.version"></el-input>
              </el-form-item>
            </el-form>
            <el-table :data="form.bom_items" size="mini" border stripe>
              <el-table-column label="序号" width="50">
                <template slot-scope="{ $index }">
                  <span>{{ $index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作方法">
                <template slot-scope="{ row }">
                  <el-select v-model="row.operation_method" @change="row.isEdit = true" size="mini">
                    <el-option label="新增" :value="1"></el-option>
                    <el-option label="变更" :value="2"></el-option>
                    <el-option label="作废" :value="3"></el-option>
                    <el-option label="新增替代材料" :value="4"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="料品编码">
                <template slot-scope="{ $index, row }">
                  <el-input v-model="row.material_code" @blur="row.isEdit = true" size="mini">
                    <el-button
                      slot="suffix"
                      size="mini"
                      type="default"
                      @click="getMaterial($index);row.isEdit = true"
                    >
                      <i class="el-icon-arrow-down"></i>
                    </el-button>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="料品规格">
                <template slot-scope="{ $index, row }">
                  <el-input v-model="row.material_specification" @blur="row.isEdit = true" size="mini">
                    <el-button
                      slot="suffix"
                      size="mini"
                      type="default"
                      @click="getMaterial($index);row.isEdit = true"
                    >
                      <i class="el-icon-arrow-down"></i>
                    </el-button>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="料品名称">
                <template slot-scope="{ $index, row }">
                  <el-input v-model="row.name" @blur="row.isEdit = true" size="mini">
                    <el-button
                      slot="suffix"
                      size="mini"
                      type="default"
                      @click="getMaterial($index);row.isEdit = true"
                    >
                      <i class="el-icon-arrow-down"></i>
                    </el-button>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="单位">
                <template slot-scope="{ row }">
                  <el-input v-model="row.unit" @blur="row.isEdit = true" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="料品类别">
                <template slot-scope="{ row }">
                  <el-input v-model="row.material_category_name" @blur="row.isEdit = true" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="图纸">
                <template slot-scope="{ row }">
                  <el-button
                    type="info"
                    style="width: 100%;"
                    size="mini"
                    @click="$emit('showImg', row)"
                  >查看</el-button>
                </template>
              </el-table-column>
              <el-table-column label="数量">
                <template slot-scope="{ row }">
                  <el-input v-model="row.quantity" @blur="row.isEdit = true" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="是否有效" v-if="row.id">
                <template slot-scope="{ row }">
                  <el-select v-model="row.valid" @change="row.isEdit = true" size="mini">
                    <el-option label="有效" :value="1"></el-option>
                    <el-option label="作废" :value="2"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="价格特性">
                <template slot-scope="{ row }">
                  <el-select v-model="row.bom_item_attributes" @change="row.isEdit = true" size="mini">
                    <el-option label="行程" value="stroke"></el-option>
                    <el-option label="可选" value="optional"></el-option>
                    <el-option label="标准" value="standard"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column width="50">
                <template slot-scope="{ $index, row }">
                  <el-button type="text" size="mini" @click="delBomItems($index, row.id)">
                    <i class="el-icon-delete" style="font-size: 2.1rem;"></i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              type="default"
              size="mini"
              style="width: 100%;"
              @click="form.bom_items.push({})"
            >
              <i class="el-icon-plus"></i>
            </el-button>
          </div>
          <div class="modal-footer" style="text-align: center;">
            <el-button type="info" size="mini" data-dismiss="modal">取消</el-button>
            <el-button type="primary" size="mini" @click="onSubmit">保存</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 订单列表 -->
    <div class="modal fade orders" role="dialog">
      <div class="modal-dialog" role="document" style="width: 820px;max-width: 100%;">
        <div class="modal-content">
          <div class="modal-body">
            <div class="orders-toolbar"></div>
            <table class="orders-table"></table>
          </div>
          <div class="modal-footer" style="text-align: center;">
            <el-button type="info" size="mini" data-dismiss="modal">取消</el-button>
            <el-button type="primary" size="mini" @click="choiceOrder">确定</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 料品列表 -->
    <div class="modal fade material" role="dialog">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
          <div class="modal-body">
            <div class="material-toolbar">
              <el-form :model="params" size="mini" label-position="left" label-width="100px">
                <el-form-item label="仓库">
                  <el-select v-model="params.respository_id" @change="getMaterial"></el-select>
                </el-form-item>
                <el-form-item label="查找关键字">
                  <el-input v-model="params.name" @blur="getMaterial"></el-input>
                </el-form-item>
                <el-form-item label="创建日期">
                  <el-date-picker
                    v-model="params.date"
                    type="daterange"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    @change="getMaterial"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <table class="material-table"></table>
          </div>
          <div class="modal-footer" style="text-align: center;">
            <el-button type="info" size="mini" data-dismiss="modal">取消</el-button>
            <el-button type="primary" size="mini" @click="choiceMaterial">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addBom",
  data() {
    return {
      form: {
        order_numbers: "",
        material_code: "",
        material_specification: "",
        name: "",
        bom_items: []
      },
      rules: {
        material_code: [
          { required: true, message: "请输入料品编码", trigger: "blur" }
        ],
        material_specification: [
          { required: true, message: "请输入料品规格", trigger: "blur" }
        ]
      },
      params: {
        date: []
      },
      orderModal: false
    };
  },
  props: {
    row: Object
  },
  methods: {
    choiceOrder() {
      let params = this.getAllData($("#Bom .orders .orders-table")),
        $el = $("[name=material]:checked"),
        index = $el.attr("index"),
        key = $el.attr("key"),
        data = params[index],
        item = data.items[key];

      this.form.material_id = item.id;
      this.form.order_numbers = data.numbering;
      this.form.material_code = item.material_code;
      this.form.material_specification = item.material_specification;
      this.form.name = item.material_name;
      this.orderModal = !this.orderModal;
    },
    getMaterial(key) {
      this.key = key;
      this.refresh($("#Bom .material-table"));
      $("#Bom .material").modal("show");
    },
    choiceMaterial() {
      let data = this.getData($("#Bom .material .material-table")).pop();
      if (this.key == -1) {
        this.form.material_id = data.id;
        this.form.material_code = data.material_number;
        this.form.material_specification = data.material_specification;
        this.form.name = data.name;
      } else {
        this.form.bom_items[this.key].material_code = data.material_number;
        this.form.bom_items[this.key].material_id = data.id;
        this.form.bom_items[this.key].material_specification =
          data.material_specification;
        this.form.bom_items[this.key].name = data.name;
        this.form.bom_items[this.key].quantity = this.form.bom_items[this.key].quantity || 1;
        this.form.bom_items[this.key].valid = this.form.bom_items[this.key].valid || 1;
        this.form.bom_items[this.key].unit = data.item_unit;
        this.form.bom_items[this.key].bom_item_attributes = this.form.bom_items[this.key].bom_item_attributes || "stroke";
        this.form.bom_items[this.key].operation_method = this.form.bom_items[this.key].operation_method || 1;
        this.form.bom_items[this.key].material_category_id = data.classification.id;
        this.form.bom_items[this.key].material_category_name = data.classification.name;

        this.form.bom_items[this.key].assembly_drawing = data.assembly_drawing;
        this.form.bom_items[this.key].drawing_2d = data.drawing_2d;
        this.form.bom_items[this.key].drawing_3d = data.drawing_3d;
        this.form.bom_items[this.key].drawing_approve = data.drawing_approve;
        this.form.bom_items[this.key].drawing_pdf = data.drawing_pdf;
        this.form.bom_items[this.key].drawing_working = data.drawing_working;

        this.form.bom_items.push({});
        this.form.bom_items.pop();
      }

      $("#Bom .material").modal("hide");
    },
    orderInit() {
      const that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter: function(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "numbering",
            title: "销售订单号",
            sortable: true
          },
          {
            field: "created_at",
            title: "下单日期",
            sortable: true
          },
          {
            field: "delivery_period",
            title: "客户要求交期",
            sortable: true
          },
          {
            field: "clerk_name",
            title: "业务员",
            sortable: true
          }
        ],
        data = {
          toolbar: "#Bom .orders-toolbar",
          ajax(params) {
            that
              .$get(`orders/company`, params.data)
              .then(response => {
                if (response.status != 200) return false;
                params.success({
                  rows: response.data.list,
                  total: response.data.pagination.total
                });
              })
              .catch(err => console.error(err));
          },
          queryParams(params) {
            return {
              page: params.offset / params.limit + 1,
              per_page: params.limit
            };
          },
          sidePagination: "server",
          singleSelect: true,
          clickToSelect: true,
          pagination: true,
          classes: "table",
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          detailView: true,
          columns: columns,
          detailFormatter(field, mrow, oldValue, $el) {
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td></td>
                    <td>料品编码</td>
                    <td>料品名称</td>
                    <td>料品规格</td>
                    <td>单位</td>
                    <td>数量</td>
                  </tr>
            `;
            mrow.items.forEach((e, k) => {
              content += `
                <tr>
                  <td><input type="radio" name="material" index="${field}" key="${k}"></td>
                  <td>${e.material_code}</td>
                  <td>${e.material_name}</td>
                  <td>${e.material_specification}</td>
                  <td>${e.material_unit}</td>
                  <td>${e.quantity}</td>
                </tr>
              `;
            });
            content += `</tbody></table>`;
            return content;
          }
        };
      $("#Bom .orders-table").bootstrapTable(data);
    },
    materialInit() {
      const that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "material_number",
            title: "料品编码",
            sortable: true
          },
          {
            field: "name",
            title: "料品名称"
          },
          {
            field: "material_specification",
            title: "料品规格",
            sortable: true
          },
          {
            field: "item_unit",
            title: "单位",
            sortable: true
          },
          {
            field: "material_category.name",
            title: "料品类别",
            formatter: function(value, row, index) {
              const checkbox = `
                <div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.onArray(1, 'id') ? '' : ''} disabled />采购件</label>
                  </div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.onArray(2, 'id') ? '' : ''} disabled />自制件</label>
                  </div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.onArray(3, 'id') ? '' : ''} disabled />委外件</label>
                  </div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.onArray(4, 'id') ? '' : ''} disabled />销售件</label>
                  </div>
                </div>
              `;
              return checkbox;
            },
            events: {
              "change input": function(e, value, row, index) {}
            }
          },
          {
            field: "attributes",
            title: "料品属性",
            formatter: function(value, row, index) {
              const checkbox = `
                <div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.onArray(1, 'id') ? '' : ''} disabled />原材料</label>
                  </div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.onArray(2, 'id') ? '' : ''} disabled />半成品</label>
                  </div>
                  <div>
                    <label><input type="checkbox" ${row.attributes.onArray(3, 'id') ? '' : ''} disabled />成品</label>
                  </div>
                </div>
              `;
              return checkbox;
            },
            events: {
              "change input": function(e, value, row, index) {}
            }
          },
          {
            field: "respository.name",
            title: "仓库",
            sortable: true
          },
          {
            field: "length",
            title: "长度",
            sortable: true
          },
          {
            field: "width",
            title: "宽度",
            sortable: true
          },
          {
            field: "height",
            title: "高度",
            sortable: true
          },
          {
            field: "weight",
            title: "重量",
            sortable: true
          },
          {
            field: "purchase_unit",
            title: "采购单位",
            sortable: true
          },
          {
            field: "sales_unit",
            title: "销售单位",
            sortable: true
          },
          {
            field: "bom_unit",
            title: "Bom单位",
            sortable: true
          },
          {
            field: "children",
            title: "关联子料编码",
            sortable: true
          },
          {
            field: "pinyin_code",
            title: "拼音码",
            sortable: true
          },
          {
            field: "material_quality",
            title: "材质",
            sortable: true
          },
          {
            field: "picture_number",
            title: "图档号",
            sortable: true
          },
          {
            field: "manufacturer",
            title: "生产厂家",
            sortable: true
          },
          {
            field: "mold_number",
            title: "模具号",
            sortable: true
          },
          {
            field: "standard_model",
            title: "标准型号",
            sortable: true
          },
          {
            field: "material_level",
            title: "料品等级",
            sortable: true
          },
          {
            field: "brand_name.name",
            title: "品牌",
            sortable: true
          },
          {
            field: "check",
            title: "是否需检",
            formatter: function(value, row, index) {
              return `${value ? "需要" : "不需要"}`;
            }
          },
          {
            field: "min_inventory",
            title: "最小库存量",
            sortable: true
          },
          {
            field: "max_inventory",
            title: "最大库存量",
            sortable: true
          },
          {
            field: "safety_stock",
            title: "安全库存量",
            sortable: true
          },
          {
            field: "stocking_volume",
            title: "备货量",
            sortable: true
          },
          {
            field: "purchase_cycle",
            title: "采购周期",
            sortable: true
          },
          {
            field: "image",
            title: "图片",
            sortable: true
          },
          {
            field: "project_drawing_number",
            title: "工程图号",
            sortable: true
          },
          {
            field: "drawing_working",
            title: "加工图",
            sortable: true
          },
          {
            field: "drawing_approve",
            title: "承认图",
            sortable: true
          },
          {
            field: "drawing_2d",
            title: "2D图纸",
            sortable: true
          },
          {
            field: "drawing_3d",
            title: "3D图纸",
            sortable: true
          },
          {
            field: "drawing_pdf",
            title: "pdf图纸",
            sortable: true
          },
          {
            field: "assembly_drawing",
            title: "组装图",
            sortable: true
          },
          {
            field: "begin_price",
            title: "期初单价",
            sortable: true
          },
          {
            field: "enter_warehouse_price",
            title: "入库单价",
            sortable: true
          },
          {
            field: "out_warehouse_price",
            title: "出库单价",
            sortable: true
          },
          {
            field: "enter_warehouse_amount",
            title: "入库金额",
            sortable: true
          },
          {
            field: "out_warehouse_amount",
            title: "出库金额",
            sortable: true
          },
          {
            field: "enter_warehouse_quantity",
            title: "入库数量",
            sortable: true
          },
          {
            field: "out_warehouse_quantity",
            title: "出库数量",
            sortable: true
          },
          {
            field: "end_period_quantity",
            title: "期末数量",
            sortable: true
          },
          {
            field: "end_period_amount",
            title: "期末金额",
            sortable: true
          },
          {
            field: "revise_quantity",
            title: "调整数量",
            sortable: true
          },
          {
            field: "revise_amount",
            title: "调整金额",
            sortable: true
          },
          {
            field: "tax",
            title: "税额",
            sortable: true
          },
          {
            field: "real_inventory",
            title: "库存可用数量",
            sortable: true
          },
          {
            field: "way_quantity",
            title: "在途数量",
            sortable: true
          },
          {
            field: "take_up",
            title: "占用数量",
            sortable: true
          }
        ],
        data = {
          ajax(params) {
            that
              .$get(`respositories/materials/list`, params.data)
              .then(response => {
                if (response.status != 200) return false;
                params.success({
                  rows: response.data.list,
                  total: response.data.pagination.total
                });
              })
              .catch(err => console.error(err));
          },
          queryParams(params) {
            return {
              created_at: that.params.date[0],
              end_at: that.params.date[1],
              name: that.params.name,
              respository_id: that.params.respository_id,
              page: params.offset / params.limit + 1,
              per_page: params.limit
            };
          },
          sidePagination: "server",
          toolbar: "#Bom .material-toolbar",
          pagination: true,
          singleSelect: true,
          clickToSelect: true,
          classes: "table",
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          columns: columns
        };
      $("#Bom .material-table").bootstrapTable(data);
    },
    onSubmit() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
        let url = "";
        if (this.row.id) {
          switch (this.row.type) {
            case 'edit':
              url = `project/bom/edit`;
              this.form.bom_items.forEach(e => {
                if (e.isEdit) this.editBomItems(e.id, e)
              })
              break;
            case 'copy':
              url = `project/bom/cope`;
              break;
            case 'version':
              url = `project/bom/change`;
              break;
          }
        } else url = `project/bom/create`;

        this.$post(url, this.form)
          .then(response => {
            if (response.status != 200) return false;
            this.$emit("refresh");
            $("#Bom #addBom").modal("hide");
          })
          .catch(err => console.error(err));
      });
    },
    editBomItems(id, params) {
      if (!id) return false;
      this
        .$post(`project/bom_items/edit`, params)
        .then(response => {
          if (response.status != 200) return false;
        })
        .catch(e => console.error(e));
    },
    delBomItems($index, id) {
      if (id) {
        this
          .$post(`project/bom_items/delete`, { id: id })
          .then(response => {
            if (response.status != 200) return false;
            this.form.bom_items.splice($index, 1)
          })
          .catch(e => console.error(e))
      } else this.form.bom_items.splice($index, 1)
    }
  },
  watch: {
    orderModal(val) {
      $("#Bom .orders").modal("toggle");
    }
  },
  mounted() {
    this.orderInit();
    this.materialInit();
    let that = this;
    $("#Bom #addBom").on("shown.bs.modal", function() {
      if (that.row.id) {
        that.form = {
          order_numbers: undefined,
          material_id: that.row.finished_product_id,
          material_code: that.row.finished_product_number,
          material_specification: that.row.component_specifications,
          name: that.row.name,
          version: that.row.version,
          bom_items: []
        };
        switch (that.row.type) {
          case 'edit':
            that.form.id = that.row.id;
            break;
          case 'copy':
            that.form.bom_item_cope_id = that.row.id;
            break;
          case 'version':
            that.form.bom_version_change_id = that.row.id;
            break;
        }
        that.row.bom_items.forEach(e =>
          that.form.bom_items.push({
            id: e.id,
            material_id: e.material.id,
            name: e.material.name,
            material_code: e.material.material_number,
            material_specification: e.material.material_specification,
            material_category_id: e.material.material_category.id,
            material_category_name: e.material.material_category.name,
            assembly_drawing: e.material.assembly_drawing,
            drawing_2d: e.material.drawing_2d,
            drawing_3d: e.material.drawing_3d,
            drawing_approve: e.material.drawing_approve,
            drawing_pdf: e.material.drawing_pdf,
            drawing_working: e.material.drawing_working,

            quantity: e.quantity,
            valid: e.valid || 1,
            unit: e.unit,
            bom_item_attributes: e.bom_item_attributes || "stroke",
            operation_method: e.operation_method || 1
          })
        );
      } else
        that.form = {
          order_numbers: "",
          material_code: "",
          material_specification: "",
          name: "",
          version: undefined,
          bom_items: []
        };
    });
  }
};
</script>
<style lang="less">
#addBom {
  .modal-content {
    .modal-body {
      .el-form {
        display: flex;
        flex-wrap: wrap;
        .el-form-item {
          width: 25%;
          padding-left: 5px;
          padding-right: 5px;
          .el-button {
            border: none;
          }
        }
      }
      .el-table {
        .el-table__body-wrapper {
          tbody {
            .el-table__row {
              td {
                .cell {
                  .el-input {
                    .el-input__suffix {
                      .el-button {
                        border: none;
                        margin-top: 3px;
                        padding: 5px 9px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
.material {
  .material-toolbar {
    .el-form {
      display: flex;
      .el-form-item {
        padding-left: 5px;
        padding-right: 5px;
        margin-bottom: 0px;
      }
    }
  }
}
</style>
