<template>
  <div>
    <div class="modal fade" id="addPlan" role="dialog">
      <div class="modal-dialog modal-lg" style="width: 100%;" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" style="font-size: 2.7rem;">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabel">编辑采购计划</h4>
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
                  <el-table-column label="关联采购计划" width="200px">
                    <template slot-scope="{  }">
                      <div>{{ form.number }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="saleOrder" label="关联销售订单" width="200px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.saleOrder" placeholder="关联销售订单" @blur="editItem(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="code" label="料品编码" width="200px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.code" placeholder="料品编码" @blur="editItem(row)">
                        <el-button slot="append" icon="el-icon-arrow-down" @click="materialModal = !materialModal;index = $index"></el-button>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="料品名称" width="200px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.name" placeholder="料品名称" @blur="editItem(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="specification" label="料品规格" width="200px">
                    <template slot-scope="{$index, row}">
                      <el-input
                        v-model="row.specification"
                        placeholder="料品规格"
                        @blur="editItem(row)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="unit" label="单位" width="200px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.unit" placeholder="单位" @blur="editItem(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="quantity" label="数量" width="200px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.quantity" placeholder="数量" @blur="editItem(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="demand_at" label="需求日期" width="200px">
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
                  <el-table-column prop="remarks" label="备注" width="200px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.remarks" placeholder="备注" @blur="editItem(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="supplier_name" label="供应商" width="200px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.supplier_name" placeholder="供应商" @blur="editItem(row)">
                        <el-button
                          slot="append"
                          icon="el-icon-arrow-down"
                          @click="getSupplier(true);index = $index"
                        ></el-button>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="supplier_contract_name" label="联系人" width="200px">
                    <template slot-scope="{$index, row}">
                      <el-select v-model="row.supplier_contract_id" @change="editItem(row)" placeholder="联系人">
                        <el-option 
                          v-for="(item, index) in row.contracts"
                          :key="index"
                          :label="item.name" 
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" label="单价" width="200px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.price" placeholder="单价" @blur="editItem(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="delivery_period" label="回料交期" width="150px">
                    <template slot-scope="{$index, row}">
                      <el-date-picker
                        v-model="row.delivery_period"
                        type="date"
                        value-format="yyyy-MM-dd"
                        @change="editItem(row)"
                        placeholder="回料交期"
                      ></el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="category" label="料品类别" width="150px">
                    <template slot-scope="{$index, row}">
                      <el-select v-model="row.category" @change="editItem(row)" placeholder="料品类别">
                        <el-option label="采购件" value="1"></el-option>
                        <el-option label="委外件" value="2"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date_of_order" label="智能提示下单日期" width="150px">
                    <template slot-scope="{$index, row}">
                      <el-date-picker
                        v-model="row.date_of_order"
                        type="date"
                        value-format="yyyy-MM-dd"
                        @change="editItem(row)"
                        placeholder="智能提示下单日期"
                      ></el-date-picker>
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
                <el-button type="primary" @click="onSubmit">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <!-- 采购申请列表 -->
    <div class="modal fade applyList" role="dialog">
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
    <orderList @add="addOrder"></orderList>
    <!-- 料品列表 -->
    <materList @add="addMater"></materList>
    <!-- 供应商 -->
    <div class="modal fade supplier" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table
            :data="supplier.list"
            border
            style="width: 100%;"
            height="500"
            highlight-current-row
            @current-change="supplierChange"
          >
            <el-table-column prop="id" label="供应商编码"></el-table-column>
            <el-table-column prop="created_by" label="创建人"></el-table-column>
            <el-table-column prop="created_at" label="创建时间"></el-table-column>
            <el-table-column prop="name" label="供应商名称"></el-table-column>
            <el-table-column prop="abbreviation" label="供应商简称"></el-table-column>
            <el-table-column prop="type" label="供应商类型"></el-table-column>
            <el-table-column prop="status" label="供应商状态"></el-table-column>
            <el-table-column prop="region" label="区域"></el-table-column>
            <el-table-column prop="address" label="详细地址"></el-table-column>
            <el-table-column prop="phone" label="座机电话"></el-table-column>
            <el-table-column prop="fax" label="传真"></el-table-column>
            <el-table-column prop="website" label="网址"></el-table-column>
            <el-table-column prop="logistics_code" label="物流编码"></el-table-column>
            <el-table-column prop="grade" label="等级"></el-table-column>
            <el-table-column prop="legal_representative" label="法定代表人"></el-table-column>
            <el-table-column prop="registered_capital" label="注册资金"></el-table-column>
            <el-table-column prop="establishment_at" label="成立日期"></el-table-column>
            <el-table-column prop="due_at" label="截至日期"></el-table-column>
            <el-table-column prop="license" label="营业执照号"></el-table-column>
            <el-table-column prop="delivery_method" label="送货方式"></el-table-column>
            <el-table-column prop="shipping_address" label="送货地址"></el-table-column>
            <el-table-column prop="tag" label="标签"></el-table-column>
            <el-table-column prop="invoice_header" label="发票抬头"></el-table-column>
            <el-table-column prop="account_bank" label="开户行"></el-table-column>
            <el-table-column prop="bank_account_number" label="开户行账号"></el-table-column>
            <el-table-column prop="invoice_type" label="发票类型"></el-table-column>
            <el-table-column prop="terms_of_payment" label="付款条件"></el-table-column>
            <el-table-column prop="payment_method" label="付款方式"></el-table-column>
            <el-table-column prop="account_period_type" label="账期类型"></el-table-column>
          </el-table>
          <div class="condition">
            <div>
              <span>查找关键字</span>
              <el-input size="mini" v-model="supplier.search" @blur="getSupplier(true)"></el-input>
            </div>
            <div>
              <span>申请日期</span>
              <el-date-picker
                size="mini"
                v-model="supplier.date"
                @change="getSupplier(true)"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </div>
            <div>
              <button class="btn btn-primary btn-sm" @click="addSupplier">确定</button>
              <button class="btn btn-default btn-sm" data-dismiss="modal" aria-label="Close">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import orderList from '@/pages/Process/common/sale/orderList';
import materList from '@/pages/Process/common/materList';
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
            saleOrder: "",
            name: "",
            code: "",
            specification: "",
            unit: "",
            quantity: "",
            demand_at: "",
            remarks: "",
            supplier_id: 0,
            supplier_name: "",
            supplier_contract_id: 0,
            supplier_contract: [],
            price: 0,
            category: '1',
            date_of_order: ""
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
      supplier: {
        list: [],
        pagination: {
          current_page: 0,
          per_page: 10
        },
        date: "",
        search: ""
      },
      materialModal: false
    };
  },
  props: {
    row: Object
  },
  components: {
    orderList: orderList,
    materList: materList,
  },
  methods: {
    applyChange(val) {
      this.apply.selection = val;
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
    addOrder(v) {
      let that = this;
      if (v.length > 1 && !that.request_id) {
        let param = v.shift(),
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
    addMater(v) {
      this.form.items[this.index].code = v.material_number;
      this.form.items[this.index].material_id = v.id;
      this.form.items[this.index].name = v.name;
      this.form.items[this.index].specification = v.material_specification;
      this.form.items[this.index].unit = v.item_unit;
      this.form.items.push({});
      this.form.items.pop();
      $("#purchasePlan .materList").modal("hide");
    },
    getSupplier(search = false) {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get(`procurement/supplier`, {
          page: search ? 1 : ++that.supplier.pagination.current_page,
          per_page: that.supplier.pagination.per_page,
          start_at: that.supplier.date ? that.supplier.date[0] : "",
          end_at: that.supplier.date ? that.supplier.date[1] : "",
          name: that.supplier.search
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          response.data.date = that.supplier.date;
          response.data.search = that.supplier.search;
          if (search) that.supplier = response.data;
          else {
            that.supplier.pagination = response.data.pagination;
            for (let item of response.data.list) {
              that.supplier.list.push(item);
            }
          }
        })
        .catch(err => loading.close());
      $("#purchasePlan .supplier").modal("show");
    },
    addSupplier() {
      this.form.items[this.index].supplier_name =
        this.supplier.selection.abbreviation || this.supplier.selection.name;
      this.form.items[this.index].supplier_id = this.supplier.selection.id;
      this.form.items[this.index].contracts = this.supplier.selection.contracts;
      if (this.form.items[this.index].contracts.length)
        this.form.items[this.index].supplier_contract_id = this.form.items[this.index].contracts[0].id;
      this.form.items.push({});
      this.form.items.pop();
      this.editItem(this.form.items[this.index]);
      $("#purchasePlan .supplier").modal("hide");
    },
    supplierChange(val) {
      this.supplier.selection = val;
    },
    addItem(name, $modal) {
      let that = this;
      this[name].selection.forEach(e => {
        let params = {
          request_item_id: e.request_item_id || undefined,
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
          schedule_id: that.request_id || undefined,
          material_id: row.material_id,
          name: row.name || "",
          specification: row.specification || "",
          unit: row.unit || "",
          quantity: row.quantity || 1,
          demand_at: row.demand_at || "",
          remarks: row.remarks || "",
          supplier_id: row.supplier_id || undefined,
          supplier_contract_id: row.supplier_contract_id || undefined,
          price: row.price || 0,
          delivery_period: row.delivery_period || undefined,
          category: row.category || undefined,
          date_of_order: row.date_of_order || undefined
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
        .$post(`procurement/schedule/edit/${that.request_id || that.row.id}`, {
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
          if (that.row.id) return false;
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
    },
    materialModal() {
      $("#purchasePlan .materList").modal('toggle');
    }
  },
  mounted() {
    let that = this;
    $("#addPlan").on("shown.bs.modal", function() {
      that.form = that.row;
      that.row.items.forEach((e, k) => {
        that.form.items[k].material_id = e.material_id || "",
        that.form.items[k].saleOrder =  e.saleOrder || "",
        that.form.items[k].name =  e.name || "",
        that.form.items[k].code =  e.code || e.material_code,
        that.form.items[k].specification =  e.specification || "",
        that.form.items[k].unit =  e.unit || "",
        that.form.items[k].quantity =  e.quantity || "",
        that.form.items[k].demand_at =  e.demand_at || "",
        that.form.items[k].remarks =  e.remarks || "",
        that.form.items[k].supplier_id =  e.supplier_id || 0,
        that.form.items[k].supplier_name =  e.supplier_name || "",
        that.form.items[k].supplier_contract_id =  e.supplier_contract_id || 0,
        that.form.items[k].contracts =  e.contracts || [],
        that.form.items[k].price =  e.price || 0,
        that.form.items[k].category =  e.category || '1',
        that.form.items[k].date_of_order =  e.date_of_order || that.row.created_at
      });

      let arr = [],
        member = [];
      that.$store.state.userBranch.forEach(e => {
        arr.push(e);
        e.member.forEach(v => member.push(v));
      });
      that.branch = arr;
      that.userBranch = member;
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
.materList,
.supplier,
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
