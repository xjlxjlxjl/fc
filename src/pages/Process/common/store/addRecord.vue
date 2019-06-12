<template>
  <div class="modal fade" id="addRecord" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-table :data="shipments" border stripe size="mini">
            <el-table-column label="序号" width="50">
              <template slot-scope="{ $index }"> {{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="shipment_company_name" label="物流公司">
              <template slot-scope="{ row }">
                <el-input v-model="row.shipment_company_name"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="shipment_number" label="物流单号">
              <template slot-scope="{ row }">
                <el-input v-model="row.shipment_number"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="product_sn" label="产品SN码">
              <template slot-scope="{ row }">
                <el-input v-model="row.product_sn"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="ship_quantity" label="发货数量">
              <template slot-scope="{ row }">
                <el-input v-model="row.ship_quantity"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="ship_at" label="发货日期">
              <template slot-scope="{ row }">
                <el-date-picker v-model="row.ship_at" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column prop="ship_user" label="发货人">
              <template slot-scope="{ row }">
                <el-input v-model="row.ship_user"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="">
              <template slot-scope="{ $index }">
                <el-button type="text" icon="el-icon-delete" @click="shipments.splice($index, 1)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="mini" style="width: 100%;" icon="el-icon-plus" @click="shipments.push({ ship_id: id })"></el-button>
        </div>
        <div class="modal-footer">
          <el-button size="mini" data-dismiss="modal">取消</el-button>
          <el-button type="primary" size="mini" @click="onSubmit">确定</el-button>          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addRecord",
  data() {
    return {
      shipments: []
    };
  },
  props: {
    id: Number
  },
  methods: {
    onSubmit() {
      this
        .$post(`repositories/delivery_record/create`, { shipments: this.shipments })
        .then(response => {
          if (response.status != 200) return false;
          $("#shipment #addRecord").modal("hide");
          this.clearFrom();
        })
        .catch(e => console.error(e));
    },
    clearFrom() {
      this.shipments = [];
    }
  }
}
</script>
<style lang="less">
#addRecord {
  .el-table {
    .el-date-editor {
      width: 100%;
    }
  }
}
</style>
