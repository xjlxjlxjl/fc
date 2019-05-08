<template>
  <div id="addTemporary" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document" style="max-width: 100%;width: 1280px;">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" ref="form" size="mini" label-width="100px">
            <el-form-item label="关联单号">
              <el-select 
                v-model="form.numbers" 
                filterable 
                remote 
                reserve-keyword 
                :disabled="active.id ? true : false"
                :remote-method="searchNumbers"
                @change="choice">
                <el-option
                  v-for="(item, key) in options"
                  :key="key"
                  :label="item.number"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="暂收来源">
              <el-input :disabled="true" v-model="form.source"></el-input>
            </el-form-item>
            <el-form-item label="是否退换货">
              <el-radio-group v-model="form.is_return">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-table :data="form.materials" border stripe>
            <el-table-column label="序号">
              <template slot-scope="{ $index }"><span>{{ $index + 1 }}</span></template>
            </el-table-column>
            <el-table-column prop="material_code" label="料品编码" width="150"></el-table-column>
            <el-table-column prop="name" label="料品名称" width="150"></el-table-column>
            <el-table-column prop="specification" label="料品规格" width="150"></el-table-column>
            <el-table-column prop="unit" label="单位" width="150"></el-table-column>
            <el-table-column prop="delivery_period" label="交期" width="150"></el-table-column>
            <el-table-column label="是否需检" width="150">
              <template slot-scope="{ row }"><span>{{ row.whether_check ? '是' : '否' }}</span></template>
            </el-table-column>
            <el-table-column prop="quantity" label="采购数量" width="150"></el-table-column>
            <el-table-column label="已暂收数量" width="150">
              <template slot-scope="data"><span>0</span></template>
            </el-table-column>
            <el-table-column label="暂收数量" width="150">
              <template slot-scope="{ row }">
                <el-input-number v-model="row.cancel_quantity" :max="parseInt(row.quantity)" size="mini" placeholder="请输入"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="150">
              <template slot-scope="{ row }">
                <el-input v-model="row.remark" size="mini" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="modal-footer">
          <el-button size="mini" type="info" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addTemporary",
  data() {
    return {
      form: {
        numbers: '',
        order_id: '',
        is_return: 0,
        materials: []
      },
      options: []
    };
  },
  props: {
    active: Object
  },
  methods: {
    searchNumbers(val) {
      if (!val) return false;
      /**
       * 采购订单 PO order_type: 1
       * 委外订单 TO order_type: 2
       * 搜索字段 number
       */
      let params = { number: val }, url = '', order_type = 0;
      if (val.includes("PO")) {
        url = `procurement/order`;
        order_type = 1;
      } else if (val.includes("TO")) {
        url = `procurement/outsourcing`;
        order_type = 2;
      } else {
        this
          .$get(`procurement/order`, params)
          .then(response => {
            if (response.status != 200) return false;
            for (let item of response.data.list)
              item.order_type = 1;
            this
              .$get(`procurement/outsourcing`, params)
              .then(result => {
                if (result.status != 200) return false;
                for (let item of result.data.list)
                  item.order_type = 2;
                this.filterNumbers(result.data.list.concat(response.data.list), true);
              });
          });
        return false;
      }
      this
        .$get(url, params)
        .then(response => {
          if (response.status != 200) return false;
          for (let item of response.data.list)
            item.order_type = order_type;
          this.filterNumbers(response.data.list, true);
        })
        .catch(e => console.error(e));
    },
    filterNumbers(arr, filter = false) {
      if (filter) 
        this.options = [];
      this.options = arr;
    },
    choice(val) {
      for (let e of val.items)
        e.order_item_id = e.id;

      this.form = {
        numbers: val.number,
        order_id: val.id,
        from: val.order_type,
        source: val.order_type == 1 ? '采购订单' : '委外订单',
        is_return: 0,
        materials: val.items
      }
    },
    onSubmit() {
      let url = '';
      if (this.active.id) url = `repositories/receipt/edit/${this.active.id}`;
      else url = `repositories/receipt/create`;
      this
        .$post(url, this.form)
        .then(response => {
          if (response.status != 200) return false;
          this.$emit('refresh');
          $("#temporary #addTemporary").modal("hide");
          this.form = {
            numbers: '',
            order_id: '',
            is_return: 0,
            materials: []
          };
        })
        .catch(e => console.error(e));
    }
  },
  mounted() {
    let that = this;
    $("#temporary #addTemporary").on("shown.bs.modal", function() {
      if (that.active.id) {
        that.form = {
          numbers: that.active.order_number,
          source: that.active.form,
          is_return: that.active.is_return,
          materials: that.active.order_items
        };
      } else {
        that.form = {
          numbers: '',
          order_id: '',
          is_return: 0,
          materials: []
        }
      }
    });
  }
};
</script>
<style lang="less">
#addTemporary {
  .modal-body {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 30%;
      }
    }
  }
}
</style>