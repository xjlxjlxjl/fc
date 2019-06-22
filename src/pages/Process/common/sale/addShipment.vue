<template>
  <div>
    <div class="modal fade" id="addShipment" role="dialog">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
          <div class="modal-body">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
              <el-form-item prop="order_number" label="关联销售订单号">
                <el-select
                  v-model="form.order_number"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入销售订单号"
                  :remote-method="search"
                  @change="change"
                >
                  <el-option v-for="item in options" :key="item.id" :label="item.numbering" :value="item"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="consignee" label="收货人">
                <el-input v-model="form.consignee"></el-input>
              </el-form-item>
              <el-form-item prop="mobile" label="收货人手机">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item prop="address" label="收货地址">
                <el-input v-model="form.address"></el-input>
              </el-form-item>
              <el-form-item prop="postcode" label="邮政编码">
                <el-input v-model="form.postcode"></el-input>
              </el-form-item>
              <el-form-item prop="delivery_method" label="送货方式">
                <el-input v-model="form.delivery_method"></el-input>
              </el-form-item>
              <el-form-item prop="packing_method" label="包装方式">
                <el-input v-model="form.packing_method"></el-input>
              </el-form-item>
            </el-form>
            <el-table :data="form.items" border stripe>
              <el-table-column label="序号" width="50">
                <template slot-scope="{ $index }">{{ $index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="material_number" label="料品编码">
                <template slot-scope="{ $index, row }">
                  <el-input v-model="row.material_number" size="mini">
                    <el-button 
                      size="mini" 
                      slot="suffix" 
                      icon="el-icon-arrow-down" 
                      @click="materModal = !materModal;key = $index"
                    ></el-button>
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="料品名称"></el-table-column>
              <el-table-column prop="material_specification" label="料品规格"></el-table-column>
              <el-table-column prop="item_unit" label="单位"></el-table-column>
              <el-table-column prop="quantity" label="数量">
                <template slot-scope="{ row }">
                  <el-input v-model="row.quantity" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="" width="50">
                <template slot-scope="{ $index }">
                  <el-button type="text" icon="el-icon-delete" style="font-size: 21px;" @click="form.items.splice($index, 1)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button size="mini" style="width: 100%;" icon="el-icon-plus" @click="form.items.push({})"></el-button>
          </div>
          <div class="modal-footer">
            <el-button size="mini" data-dismiss="modal">取消</el-button>
            <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 物料列表 -->
    <div class="modal fade materList" role="dialog" >
      <div class="modal-dialog modal-lg" role="document" style="width: 100%;max-width: 1280px;">
        <div class="modal-content">
          <el-table
            :data="mater.data"
            border
            style="width: 100%"
            height="500"
            highlight-current-row
            @current-change="materChange"
          >
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
              <template slot-scope="{ row }">
                <div class="materialsType">
                  <div>
                    <input type="checkbox" v-if="row.attributes.onArray(1, 'id')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 采购件
                  </div>
                  <div>
                    <input type="checkbox" v-if="row.attributes.onArray(2, 'id')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 自制件
                  </div>
                  <div>
                    <input type="checkbox" v-if="row.attributes.onArray(3, 'id')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 委外件
                  </div>
                  <div>
                    <input type="checkbox" v-if="row.attributes.onArray(4, 'id')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 销售件
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
  name: "addShipment",
  data() {
    return {
      form: {
        order_id: 0,
        order_number: "",
        consignee: "",
        mobile: "",
        address: "",
        postcode: "",
        delivery_method: "",
        packing_method: "",
        items: []
      },
      rules: {
        order_number: [{ required: true, message: '此项为必填', trigger: 'blur' }],
        consignee: [{ required: true, message: '此项为必填', trigger: 'blur' }],
        mobile: [{ required: true, message: '此项为必填', trigger: 'blur' }],
        address: [{ required: true, message: '此项为必填', trigger: 'blur' }],
        delivery_method: [{ required: true, message: '此项为必填', trigger: 'blur' }],
        packing_method: [{ required: true, message: '此项为必填', trigger: 'blur' }],
      },
      options: [],
      mater: {
        data: [],
        pagination: {
          current_page: 0,
          per_page: 10
        },
        search: "",
        date: ["", ""],
        selection: {}
      },
      materModal: false
    };
  },
  props: {
    shipment: Object,
    goods: Array
  },
  methods: {
    search(v) {
      this
        .$get(`orders/company`, { number: v })
        .then(response => {
          if (response.status != 200) return false;
          this.options = response.data.list;
        })
        .catch(e => console.error(e));
    },
    change(v) {
      this.form.order_id = v.id;
      this.form.order_number = v.numbering;
      this.form.consignee = v.consignee;
      this.form.mobile = v.contract_mobile;
      this.form.address = v.address;
      this.form.postcode = v.postcode;
      this.form.delivery_method = v.delivery_method;
      this.form.packing_method = v.packing_method;
    },
    onSubmit() {
      this.$refs['form'].validate(v => {
        if (!v) return false;
        this
          .$post(this.shipment.id ? `orders/sales/shipment/edit/${this.shipment.id}` : `orders/sales/shipment/create`, this.form)
          .then(response => {
            if (response.status != 200) return false;
            this.$emit('refresh');
            $("#shipment #addShipment").modal("hide");
            this.clearForm();
          })
          .catch(e => console.error(e));
      })
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
        })
        .catch(err => loading.close());
    },
    materChange(val) {
      this.mater.selection = val;
    },
    addMater() {
      this.form.items[this.key].material_id = this.mater.selection.id;
      this.form.items[this.key].material_number = this.mater.selection.material_number;
      this.form.items[this.key].name = this.mater.selection.name;
      this.form.items[this.key].material_specification = this.mater.selection.material_specification;
      this.form.items[this.key].item_unit = this.mater.selection.item_unit;
      this.form.items.push({});
      this.form.items.pop();
      this.materModal = !this.materModal;
    },
    clearForm() {
      this.form = {
        order_id: 0,
        order_number: "",
        consignee: "",
        mobile: "",
        address: "",
        postcode: "",
        delivery_method: "",
        packing_method: "",
        items: []
      }
    }
  },
  watch: {
    materModal(val) {
      $("#shipment .materList").modal("toggle");
    }
  },
  mounted() {
    this.getMater()
    $("#shipment #addShipment").on('shown.bs.modal', () => {
      if (this.shipment.id)
        this.form = {
          order_id: this.shipment.order.id,
          order_number: this.shipment.order.number,
          consignee: this.shipment.consignee,
          mobile: this.shipment.mobile,
          address: this.shipment.address,
          postcode: this.shipment.postcode,
          delivery_method: this.shipment.delivery_method,
          packing_method: this.shipment.packing_method,
          items: this.shipment.items.map(e => {
            return {
              id: e.id,
              material_id: e.material.id,
              material_number: e.material.code,
              name: e.material.name,
              material_specification: e.material.specification,
              item_unit: e.material.unit,
              quantity: e.quantity
            }
          })
        };
    });
  }
};
</script>
<style lang="less">
#addShipment {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 25%;
    }
  }
}
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
</style>
