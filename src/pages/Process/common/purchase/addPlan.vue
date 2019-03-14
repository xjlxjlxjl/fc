<template>
  <div>
    <div
      class="modal fade bs-example-modal-lg"
      id="addPlan"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
    >
      <div class="modal-dialog modal-lg" style="width: 100%;" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" style="font-size: 2.7rem;">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabel">新建采购计划</h4>
          </div>
          <div class="modal-body">
            <el-form :model="form" size="mini" ref="form" label-width="80px">
              <el-form-item label="申请人" prop="applicant_id">
                <el-select v-model="form.applicant_id" placeholder="申请人" disabled>
                  <el-option
                    v-for="item in userBranch"
                    :key="item.id"
                    :label="item.display_name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门" prop="branch_id">
                <el-select v-model="form.branch_id" placeholder="部门" disabled>
                  <el-option
                    v-for="item in branch"
                    :key="item.branch_id"
                    :label="item.branch_name"
                    :value="item.branch_id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="remarks" label="备注" prop="remark">
                <el-input type="textarea" v-model="form.remark"></el-input>
              </el-form-item>
              <el-form-item label="申请日期" prop="applicant_at">
                <el-date-picker
                  type="date"
                  disabled
                  v-model="form.applicant_at"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="table">
                <el-table :data="form.items" size="mini" border style="width: 100%">
                  <el-table-column prop="material_id" label="序号">
                    <template slot-scope="{$index}">
                      <div>{{ $index + 1 }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="purchaseApply" label="关联采购申请" width="180px">
                    <template slot-scope="{$index, row}">
                      <el-input
                        v-model="row.purchaseApply"
                        placeholder="关联采购申请"
                        @blur="editItem(row)"
                      >
                        <el-button
                          slot="append"
                          icon="el-icon-arrow-down"
                          @click="getPurchaseApply(true)"
                        ></el-button>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="saleOrder" label="关联销售订单" width="180px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.saleOrder" placeholder="关联销售订单" @blur="editItem(row)">
                        <el-button
                          slot="append"
                          icon="el-icon-arrow-down"
                          @click="getSaleOrder(true)"
                        ></el-button>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="code" label="料品编码" width="180px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.code" placeholder="料品编码" @blur="editItem(row)">
                        <el-button slot="append" icon="el-icon-arrow-down" @click="getMater(true)"></el-button>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="料品名称">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.name" placeholder="料品名称" @blur="editItem(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="specification" label="料品规格">
                    <template slot-scope="{$index, row}">
                      <el-input
                        v-model="row.specification"
                        placeholder="料品规格"
                        @blur="editItem(row)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="unit" label="单位">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.unit" placeholder="单位" @blur="editItem(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="quantity" label="数量">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.quantity" placeholder="数量" @blur="editItem(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="demand_at" label="需求日期" width="150px">
                    <template slot-scope="{$index, row}">
                      <el-date-picker
                        v-model="row.demand_at"
                        type="date"
                        value-format="yyyy-MM-dd"
                        @change="editItem(row)"
                        placeholder="需求日期"
                      ></el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remarks" label="备注">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.remarks" placeholder="备注" @blur="editItem(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="{$index, row}">
                      <el-button type="danger" size="mini" @click="delItem($index, row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <!-- 采购申请列表 -->
    <div
      class="modal fade bs-example-modal-lg applyList"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table
            :data="apply.data"
            border
            style="width: 100%"
            height="500"
            @selection-change="applyChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="number" label="采购申请单号"></el-table-column>
            <el-table-column prop="applicant" label="申请人"></el-table-column>
            <el-table-column prop="applicant_at" label="申请日期"></el-table-column>
            <el-table-column prop="demand_at" label="需求日期"></el-table-column>
            <el-table-column prop="material_code" label="料品编码"></el-table-column>
            <el-table-column prop="name" label="料品名称"></el-table-column>
            <el-table-column prop="specification" label="料品规格"></el-table-column>
            <el-table-column prop="unit" label="单位"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
          </el-table>
          <div class="condition">
            <div>
              <span>查找关键字</span>
              <el-input v-model="apply.search" @blur="getPurchaseApply(true)" size="mini"></el-input>
            </div>
            <div>
              <span>申请日期</span>
              <el-date-picker
                size="mini"
                @change="getPurchaseApply(true)"
                type="daterange"
                v-model="apply.date"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </div>
            <div>
              <button class="btn btn-primary btn-sm" @click="addApply">确定</button>
              <button class="btn btn-default btn-sm" data-dismiss="modal" aria-label="Close">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 销售订单列表 -->
    <div
      class="modal fade bs-example-modal-lg orderList"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table
            :data="order.data"
            border
            style="width: 100%"
            height="500"
            @selection-change="orderChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="numbering" label="订单号"></el-table-column>
            <!-- <el-table-column prop="name" label="订单ID"></el-table-column> -->
            <!-- <el-table-column prop="consignee_code" label="客户编码"></el-table-column> -->
            <el-table-column prop="consignee" label="客户名称"></el-table-column>
            <el-table-column prop="created_at" label="创建日期"></el-table-column>
            <el-table-column prop="name" label="料品名称"></el-table-column>
            <el-table-column prop="material_specification" label="料品规格"></el-table-column>
            <el-table-column prop="type" label="料品类别"></el-table-column>
            <el-table-column prop="unit" label="单位"></el-table-column>
            <el-table-column prop="quantity" label="订单数量"></el-table-column>
            <!-- <el-table-column prop="address" label="订单备品"></el-table-column>
            <el-table-column prop="address" label="订单总数"></el-table-column>-->
            <el-table-column prop="address" label="客户要求交期"></el-table-column>
            <el-table-column prop="address" label="确认交期"></el-table-column>
            <!-- <el-table-column prop="address" label="主计划数量"></el-table-column>
            <el-table-column prop="address" label="主计划尚缺数"></el-table-column>
            <el-table-column prop="address" label="制造单数"></el-table-column>
            <el-table-column prop="address" label="制造单尚缺数"></el-table-column>
            <el-table-column prop="address" label="通知备品"></el-table-column>
            <el-table-column prop="address" label="通知尚欠数"></el-table-column>
            <el-table-column prop="address" label="通知尚备品"></el-table-column>-->
            <el-table-column prop="address" label="折扣"></el-table-column>
            <el-table-column prop="address" label="含税"></el-table-column>
            <!-- <el-table-column prop="address" label="币别"></el-table-column> -->
            <el-table-column prop="address" label="发票类型"></el-table-column>
            <el-table-column prop="address" label="仓库"></el-table-column>
            <el-table-column prop="address" label="件数"></el-table-column>
            <el-table-column prop="address" label="尾数"></el-table-column>
            <el-table-column prop="address" label="总体积"></el-table-column>
            <el-table-column prop="address" label="材料入库数量"></el-table-column>
            <el-table-column prop="address" label="材料尚欠数量"></el-table-column>
            <el-table-column prop="address" label="生产入库数量"></el-table-column>
            <el-table-column prop="address" label="生产尚欠数量"></el-table-column>
            <el-table-column prop="address" label="出货尚欠数量"></el-table-column>
            <el-table-column prop="address" label="客户订单号"></el-table-column>
            <el-table-column prop="address" label="客户料号"></el-table-column>
            <el-table-column prop="address" label="客户料品名称"></el-table-column>
            <el-table-column prop="address" label="产品说明"></el-table-column>
            <el-table-column prop="address" label="维度"></el-table-column>
            <el-table-column prop="address" label="维度描述"></el-table-column>
            <el-table-column prop="address" label="采购数量"></el-table-column>
            <el-table-column prop="address" label="采购备品"></el-table-column>
          </el-table>
          <div class="condition">
            <div>
              <span>查找关键字</span>
              <el-input size="mini" v-model="order.search" @blur="getSaleOrder(true)"></el-input>
            </div>
            <div>
              <span>申请日期</span>
              <el-date-picker
                size="mini"
                v-model="order.date"
                @change="getSaleOrder(true)"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </div>
            <div>
              <button class="btn btn-primary btn-sm" @click="addOrder">确定</button>
              <button class="btn btn-default btn-sm" data-dismiss="modal" aria-label="Close">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 料品列表 -->
    <div
      class="modal fade bs-example-modal-lg materList"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
    >
      <div class="modal-dialog modal-lg" role="document" style="width: 100%;max-width: 1280px;">
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
            <el-table-column prop="material_category.name" label="料品类别"></el-table-column>
            <el-table-column prop="item_unit" label="主单位"></el-table-column>
            <el-table-column prop="image" label="图片"></el-table-column>
            <el-table-column prop="drawing_pdf" label="工程图号">
              <template slot-scope="{ row }">
                <a
                  v-for="item in row.drawing_pdf"
                  :key="item"
                  :href="item"
                  :download="item.split('/').pop()"
                  target="_blank"
                >{{ item.split('/').pop() }}</a>
              </template>
            </el-table-column>
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
            <el-table-column prop="date" label="主供应商"></el-table-column>
            <el-table-column prop="date" label="供应商简称"></el-table-column>
            <el-table-column prop="created_at" label="生效"></el-table-column>
            <el-table-column prop="pinyin_code" label="拼音码"></el-table-column>
            <el-table-column prop="length" label="料品长"></el-table-column>
            <el-table-column prop="width" label="料品宽"></el-table-column>
            <el-table-column prop="height" label="料品高"></el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
            <el-table-column prop="member" label="管理者"></el-table-column>
            <el-table-column prop="update_at" label="修改日期"></el-table-column>
            <el-table-column prop="update_by" label="修改用户"></el-table-column>
          </el-table>
          <div class="condition">
            <div>
              <span>查找关键字</span>
              <el-input size="mini" v-model="mater.search" @blur="getMater(true)"></el-input>
            </div>
            <div>
              <span>申请日期</span>
              <el-date-picker
                size="mini"
                v-model="mater.date"
                @change="getMater(true)"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </div>
            <div>
              <button class="btn btn-primary btn-sm" @click="addMater">确定</button>
              <button class="btn btn-default btn-sm" data-dismiss="modal" aria-label="Close">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addPlan",
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || {
      user: { id: 0, current_branch: [] }
    };
    return {
      request_id: 0,
      form: {
        applicant_id: user.user.id,
        branch_id: user.user.current_branch.length
          ? user.user.current_branch[0].id
          : "",
        // demand_at: "",
        applicant_at: this.dateParse(new Date()),
        remark: "",
        items: [
          {
            material_id: "",
            purchaseApply: "",
            saleOrder: "",
            code: "",
            name: "",
            specification: "",
            unit: "",
            quantity: "",
            remarks: ""
          }
        ]
      },
      rule: {},
      branch: [],
      userBranch: [],
      apply: {
        search: "",
        pagination: {
          current_page: 0,
          per_page: 10
        },
        date: ["", ""],
        selection: [],
        data: []
      },
      order: {
        search: "",
        pagination: {
          current_page: 0,
          per_page: 10
        },
        date: ["", ""],
        selection: [],
        data: []
      },
      mater: {
        data: [],
        pagination: {
          current_page: 0,
          per_page: 10
        },
        search: "",
        date: ["", ""],
        selection: []
      }
    };
  },
  methods: {
    applyChange(val) {
      this.apply.selection = val;
    },
    orderChange(val) {
      this.order.selection = val;
    },
    getPurchaseApply(search) {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get(`procurement/request/item`, {
          per_page: that.apply.pagination.per_page,
          page: search ? 1 : ++that.apply.pagination.current_page,
          keyword: that.apply.search,
          start_time: that.apply.date[0],
          end_time: that.apply.date[1],
          is_closed: 0
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          if (search) that.apply.data = [];
          response.data.list.forEach(e =>
            that.apply.data.push({
              request_item_id: e.id,
              id: e.request_id,
              number: e.request_number,
              applicant: e.created_by,
              applicant_at: e.created_at,
              demand_at: e.demand_at,
              material_code: e.material_code,
              name: e.name,
              unit: e.unit,
              quantity: e.quantity,
              material_specification: e.specification,
              remark: e.remark
            })
          );
          that.apply.pagination = response.data.pagination;
          $("#purchasePlan .applyList").modal("show");
        })
        .catch(err => loading.close());
    },
    getSaleOrder(search) {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get(`orders/company`, {
          per_page: that.order.pagination.per_page,
          page: search ? 1 : ++that.order.pagination.current_page,
          search: that.order.search,
          start_time: that.order.date[0],
          end_time: that.order.date[1]
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          if (search) that.order.data = [];
          response.data.list.forEach(e =>
            e.products.forEach(v =>
              that.order.data.push({
                id: e.id,
                numbering: e.numbering,
                consignee: e.consignee,
                created_at: e.created_at,
                name: v.product_name,
                type: v.product_type,
                unit: v.product_unit,
                quantity: v.quantity,
                material_specification: v.product_model
              })
            )
          );
          that.order.pagination = response.data.pagination;
          $("#purchasePlan .orderList").modal("show");
        })
        .catch(err => loading.close());
    },
    addApply() {
      let that = this;
      if (this.apply.selection.length > 1 && !that.request_id) {
        let param = this.apply.selection.shift(),
          params = {
            request_item_id: param.request_item_id || undefined,
            purchaseApply: param.number,
            schedule_id: that.request_id || "",
            code: param.material_code || "",
            material_id: param.id,
            name: param.name || "",
            specification: param.material_specification || "",
            unit: param.item_unit ? param.item_unit : param.unit,
            demand_at: param.demand_at || "",
            quantity: param.quantity || 1,
            remarks: param.remarks || ""
          };
        that
          .$post(`procurement/schedule/item/create`, params)
          .then(response => {
            if (response.status != 200) return false;
            that.request_id = response.data.schedule_id;
            that.addItem("apply", $("#purchasePlan .applyList"));
            params.id = response.data.id;
            that.form.items.unshift(params);
          })
          .catch(err => console.error(err));
      } else this.addItem("apply", $("#purchasePlan .applyList"));
    },
    addOrder() {
      let that = this;
      if (this.order.selection.length > 1 && !that.request_id) {
        let param = this.order.selection.shift(),
          params = {
            request_item_id: param.request_item_id || undefined,
            saleOrder: param.numbering,
            schedule_id: that.request_id || "",
            code: param.material_code || "",
            material_id: param.id,
            name: param.name || "",
            specification: param.material_specification || "",
            unit: param.item_unit ? param.item_unit : param.unit,
            demand_at: param.demand_at || "",
            quantity: param.quantity || 1,
            remarks: param.remarks || ""
          };
        that
          .$post(`procurement/schedule/item/create`, params)
          .then(response => {
            if (response.status != 200) return false;
            that.request_id = response.data.schedule_id;
            that.addItem("order", $("#purchasePlan .orderList"));
            params.id = response.data.id;
            that.form.items.unshift(params);
          })
          .catch(err => console.error(err));
      } else this.addItem("order", $("#purchasePlan .orderList"));
    },
    getMater(search) {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get(`respositories/materials/list`, {
          per_page: that.mater.pagination.per_page,
          page: search ? 1 : ++that.mater.pagination.current_page,
          search: that.mater.search,
          start_time: that.mater.date[0],
          end_time: that.mater.date[1]
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          if (search) that.mater.data = response.data.list;
          else
            for (let item of response.data.list) {
              that.mater.data.push(item);
            }
          that.mater.pagination = response.data.pagination;
          $("#purchasePlan .materList").modal("show");
        })
        .catch(err => loading.close());
    },
    materChange(val) {
      this.mater.selection = val;
    },
    addMater() {
      let that = this;
      if (this.mater.selection.length > 1 && !that.request_id) {
        let param = this.mater.selection.shift(),
          params = {
            schedule_id: that.request_id || "",
            code: param.material_code || "",
            material_id: param.id,
            name: param.name || "",
            specification: param.material_specification || "",
            unit: param.item_unit || "",
            quantity: param.quantity || 1,
            remarks: param.remarks || ""
          };
        that
          .$post(`procurement/schedule/item/create`, params)
          .then(response => {
            if (response.status != 200) return false;
            that.request_id = response.data.schedule_id;
            that.addItem("mater", $("#purchasePlan .materList"));
            params.id = response.data.id;
            that.form.items.unshift(params);
          })
          .catch(err => console.error(err));
      } else this.addItem("mater", $("#purchasePlan .materList"));
    },
    addItem(name, $modal) {
      let that = this;
      this[name].selection.forEach(e => {
        let params = {
          request_item_id: e.request_item_id || undefined,
          purchaseApply: e.number,
          saleOrder: e.numbering,
          schedule_id: that.request_id || "",
          code: e.material_code || "",
          material_id: e.id,
          name: e.name || "",
          specification: e.material_specification || "",
          unit: e.item_unit ? e.item_unit : e.unit,
          demand_at: e.demand_at || "",
          quantity: e.quantity || 1,
          remarks: e.remarks || ""
        };
        that
          .$post(`procurement/schedule/item/create`, params)
          .then(response => {
            if (response.status != 200) return false;
            that.request_id = response.data.schedule_id;
            params.id = response.data.id;
            that.form.items.unshift(params);
          })
          .catch(err => console.error(err));
      });
      $modal.modal("hide");
    },
    editItem(row) {
      if (row.id) {
        let that = this;
        that.$post(`procurement/schedule/item/edit/${row.id}`, {
          schedule_id: that.request_id || "",
          request_item_id: row.request_item_id || undefined,
          code: row.code || "",
          material_id: row.material_id,
          name: row.name || "",
          specification: row.specification || "",
          unit: row.unit || "",
          demand_at: row.demand_at || "",
          quantity: row.quantity || 1,
          remarks: row.remarks || ""
        });
      }
    },
    delItem(index, row) {
      if (row.id) {
        this.$get(`procurement/schedule/item/delete/${row.id}`)
          .then(response => {
            if (response.status != 200) return false;
            this.form.items.splice(index, 1);
          })
          .catch(err => console.error(err));
      }
    },
    onSubmit() {
      let that = this,
        arr = [];
      that.form.items.forEach(e => {
        if (
          e.material_id ||
          // e.code ||
          e.name ||
          e.specification ||
          e.unit ||
          e.quantity
        )
          arr.push(e);
      });
      that
        .$post(`procurement/schedule/edit/${that.request_id}`, {
          applicant_id: that.form.applicant_id,
          branch_id: that.form.branch_id,
          // demand_at: that.form.demand_at,
          applicant_at: that.form.applicant_at,
          remark: that.form.remark,
          items: JSON.stringify(arr)
        })
        .then(response => {
          if (response.status != 200) return false;
          that.refresh($("#purchasePlan #table"));
          $("#addPlan").modal("hide");
          that.$refs["form"].resetFields();
          that.form.items = [
            {
              material_id: "",
              purchaseApply: "",
              saleOrder: "",
              code: "",
              name: "",
              specification: "",
              unit: "",
              quantity: "",
              remarks: ""
            }
          ];
        })
        .catch(err => {});
    }
  },
  watch: {
    form: {
      handler(val, oldVal) {
        let that = this,
          addRows = true,
          lastRow = that.form.items[that.form.items.length - 1];
        if (val.items.length - oldVal.items.length > 1) return false;
        else {
          val.items.forEach(e => {
            if (
              !e.name ||
              // !e.code ||
              !e.specification ||
              !e.unit ||
              !e.quantity
            )
              addRows = false;
          });
          if (addRows) {
            // 新增
            that.form.items.push({
              material_id: "",
              name: "",
              code: "",
              specification: "",
              unit: "",
              quantity: 1,
              remark: ""
            });
            that
              .$post(`procurement/schedule/item/create`, {
                schedule_id: that.request_id || "",
                code: lastRow.code || undefined,
                material_id: lastRow.material_id || undefined,
                name: lastRow.name || "",
                specification: lastRow.specification || "",
                unit: lastRow.unit || "",
                quantity: lastRow.quantity || 1,
                remarks: lastRow.remark || ""
              })
              .then(response => {
                if (response.status != 200) return false;
                lastRow.id = response.data.id;
                that.request_id = response.data.schedule_id;
              })
              .catch(err => console.error(err));
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    let that = this;
    $("#addPlan").on("show.bs.modal", function() {
      let arr = [],
        member = [];
      that.$store.state.userBranch.forEach(e => {
        arr.push(e);
        e.member.forEach(v => member.push(v));
      });
      that.branch = arr;
      that.userBranch = member;
    });

    $("#purchasePlan .materList .el-table__body-wrapper").scroll(function(e) {
      if (
        $(this)[0].scrollTop ===
          $(this)[0].scrollHeight - $(this)[0].clientHeight &&
        that.mater.data.length >= that.mater.pagination.per_page
      )
        that.getMater();
    });

    $("#purchasePlan .orderList .el-table__body-wrapper").scroll(function(e) {
      if (
        $(this)[0].scrollTop ===
          $(this)[0].scrollHeight - $(this)[0].clientHeight &&
        that.order.data.length >= that.order.pagination.per_page
      )
        that.getSaleOrder();
    });

    $("#purchasePlan .applyList .el-table__body-wrapper").scroll(function(e) {
      if (
        $(this)[0].scrollTop ===
          $(this)[0].scrollHeight - $(this)[0].clientHeight &&
        that.apply.data.length >= that.apply.pagination.per_page
      )
        that.getPurchaseApply();
    });
  }
};
</script>
<style lang="less">
#addPlan {
  .modal-body {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 33%;
        .remarks {
          height: 28px;
          textarea {
            height: 60px;
          }
        }
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 100%;
        }
        &.table,
        &:last-child {
          width: 100%;
          text-align: center;
          .el-form-item__content {
            margin-left: 0 !important;
            .el-table {
              .el-table__body-wrapper {
                .el-table__body {
                  .el-table__row {
                    .cell {
                      input {
                        border: none;
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
.applyList,
.orderList {
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
</style>
