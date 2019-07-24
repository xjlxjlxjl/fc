<template>
  <div>
    <div class="modal fade" id="smartOccupy" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table :data="arr" border stripe>
            <el-table-column label="序号">
              <template slot-scope="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="schedule.sn_code" label="智能计划单号"></el-table-column>
            <el-table-column prop="occupancy_material.material_number" label="物料编码"></el-table-column>
            <el-table-column prop="occupancy_material.material_specification" label="料品规格"></el-table-column>
            <el-table-column prop="occupancy_material.name" label="料品名称"></el-table-column>
            <el-table-column prop="C_occupancy" label="数量"></el-table-column>
            <el-table-column prop="occupancy_material.length" label="长度"></el-table-column>
            <el-table-column prop="occupancy_material.children" label="关联子料">
              <template slot-scope="{ row }">
                <p v-for="e in row.occupancy_material.children" :key="e.id">{{ e.material_number }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="occupancy_material.item_unit" label="单位"></el-table-column>
            <el-table-column prop="occupancy_material" label="料品属性">
              <template slot-scope="{ row }">
              <div class="materialsType">
                <div>
                  <input type="checkbox" v-if="typeof row.occupancy_material.material_attributes == 'object' && row.occupancy_material.material_attributes.includes('1')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 采购件
                </div>
                <div>
                  <input type="checkbox" v-if="typeof row.occupancy_material.material_attributes == 'object' && row.occupancy_material.material_attributes.includes('2')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 自制件
                </div>
                <div>
                  <input type="checkbox" v-if="typeof row.occupancy_material.material_attributes == 'object' && row.occupancy_material.material_attributes.includes('3')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 委外件
                </div>
                <div>
                  <input type="checkbox" v-if="typeof row.occupancy_material.material_attributes == 'object' && row.occupancy_material.material_attributes.includes('4')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 销售件
                </div>
              </div>
            </template>
            </el-table-column>
            <el-table-column prop="stock_can_occupancy_quality" label="库存可占用数量"></el-table-column>
            <el-table-column prop="stock_occupancy_quality" label="库存占用数量"></el-table-column>
            <el-table-column prop="stock_remain_quality" label="库存剩余数量"></el-table-column>
            <el-table-column prop="produce_can_occupancy_quality" label="生产可占用数量"></el-table-column>
            <el-table-column prop="produce_occupancy_quality" label="生产占用数量"></el-table-column>
            <el-table-column prop="produce_remain_quality" label="生产剩余数量"></el-table-column>
            <el-table-column prop="quality_can_occupancy_quality" label="品质可占用数量"></el-table-column>
            <el-table-column prop="quality_occupancy_quality" label="品质占用数量"></el-table-column>
            <el-table-column prop="quality_remain_quality" label="品质剩余数量"></el-table-column>
            <el-table-column prop="purchase_can_occupancy_quality" label="采购可占用数量"></el-table-column>
            <el-table-column prop="purchase_occupancy_quality" label="采购占用数量"></el-table-column>
            <el-table-column prop="purchase_remain_quality" label="采购剩余数量"></el-table-column>
            <el-table-column prop="plan_can_occupancy_quality" label="计划可占用数量"></el-table-column>
            <el-table-column prop="plan_occupancy_quality" label="计划占用数量"></el-table-column>
            <el-table-column prop="plan_remain_quality" label="计划剩余数量"></el-table-column>
            <!-- <el-table-column prop="" label="占用仓库">
              <template slot-scope="{ $index, row }">
                <el-button size="mini" @click="inStoreModal = !inStoreModal">查看</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </div>
      </div>
    </div>
    <div class="modal fade" id="inStock" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table :data="inStore" border stripe>
            <el-table-column label="序号" width="50"></el-table-column>
            <el-table-column prop="" label="占用订单号"></el-table-column>
            <el-table-column prop="" label="SN码"></el-table-column>
            <el-table-column prop="" label="料品编码"></el-table-column>
            <el-table-column prop="" label="料品规格"></el-table-column>
            <el-table-column prop="" label="料品名称"></el-table-column>
            <el-table-column prop="" label="占用数量"></el-table-column>
            <el-table-column prop="" label="占用仓库"></el-table-column>
            <el-table-column prop="" label="占用方式"></el-table-column>
            <el-table-column prop="" label="调整占用">
              <template slot-scope="{ row }">
                <el-button size="mini" @click="AdjustmentModal = !AdjustmentModal">调整</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="modal fade" id="Adjustment" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <el-table :data="inStore" border stripe>
            <el-table-column prop="" label="可占用仓库"></el-table-column>
            <el-table-column prop="" label="可用数量"></el-table-column>
            <el-table-column prop="" label="已占用数量"></el-table-column>
            <el-table-column prop="" label="调整占用数量"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "smartOccupy",
  data() {
    return {
      inStore: [{}],
      Adjustment: [],
      inStoreModal: false,
      AdjustmentModal: false,
    };
  },
  props: {
    arr: Array
  },
  methods: {},
  watch: {
    inStoreModal(val) {
      $("#inStock").modal("toggle");
    },
    AdjustmentModal(val) {
      $("#Adjustment").modal("toggle");
    }
  }
}
</script>
<style lang="less">
#smartOccupy {
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
</style>
