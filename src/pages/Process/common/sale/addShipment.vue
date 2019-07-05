<template>
  <div>
    <div class="modal fade" id="addShipment" role="dialog">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
          <div class="modal-body">
            <el-form :model="form" size="mini" :rules="rules" ref="form" label-width="120px">
              <el-form-item prop="order_number" label="关联销售订单号">
                <el-input v-model="form.order_number">
                  <el-button 
                    size="mini" 
                    slot="suffix" 
                    icon="el-icon-arrow-down" 
                    @click="orderModal = !orderModal;"
                  ></el-button>
                </el-input>
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
    <orderList @add="change"></orderList>
    <materList @add="addMaterial"></materList>
  </div>
</template>
<script>
import orderList from '@/pages/Process/common/sale/orderList';
import materList from '@/pages/Process/common/materList';

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
      orderModal: false,
      materModal: false
    };
  },
  props: {
    shipment: Object,
    goods: Array
  },
  components: {
    orderList: orderList,
    materList: materList
  },
  methods: {
    change(v) {
      this.form.order_id = v.id;
      this.form.order_number = v.numbering;
      this.form.consignee = v.consignee;
      this.form.mobile = v.mobile;
      this.form.address = v.address;
      this.form.postcode = v.postcode;
      this.form.delivery_method = v.delivery_method;
      this.form.packing_method = v.packing_method;
      
      this.orderModal = !this.orderModal;
    },
    addMaterial(v) {
      this.form.items[this.key].material_id = v.id;
      this.form.items[this.key].material_number = v.material_number;
      this.form.items[this.key].name = v.name;
      this.form.items[this.key].material_specification = v.material_specification;
      this.form.items[this.key].item_unit = v.item_unit;
      this.form.items.push({});
      this.form.items.pop();
      this.materModal = !this.materModal;
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
    orderModal(v) {
      $("#shipment #orderList").modal("toggle")
    },
    materModal(val) {
      $("#shipment .materList").modal("toggle");
    }
  },
  mounted() {
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
</style>
