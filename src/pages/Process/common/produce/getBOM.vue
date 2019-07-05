<template>
  <div class="modal fade" id="getBOM" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <el-table :data="arr" border stripe>
          <el-table-column label="序号">
            <template slot-scope="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="material_number" label="料品编码"></el-table-column>
          <el-table-column prop="material_specification" label="料品规格"></el-table-column>
          <el-table-column prop="material_name" label="料品名称"></el-table-column>
          <el-table-column prop="quantity" label="数量"></el-table-column>
          <el-table-column prop="length" label="长度"></el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column prop="material_category" label="料品类别">
            <template slot-scope="{ row }">
                <div class="materialsType">
                  <div>
                    <input type="checkbox" v-if="row.material_category.includes('1')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 采购件
                  </div>
                  <div>
                    <input type="checkbox" v-if="row.material_category.includes('2')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 自制件
                  </div>
                  <div>
                    <input type="checkbox" v-if="row.material_category.includes('3')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 委外件
                  </div>
                  <div>
                    <input type="checkbox" v-if="row.material_category.includes('4')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 销售件
                  </div>
                </div>
            </template>
          </el-table-column>
          <el-table-column prop="bom_attributes_name" label="料品属性">
            <template slot-scope="{ row }">
              <div class="materialsType">
                <div>
                  <input type="checkbox" v-if="row.bom_attributes_name.includes('1')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 原材料
                </div>
                <div>
                  <input type="checkbox" v-if="row.bom_attributes_name.includes('2')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 半成品
                </div>
                <div>
                  <input type="checkbox" v-if="row.bom_attributes_name.includes('3')" checked="checked" disabled>
                  <input type="checkbox" v-else disabled> 成品
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "getBOM",
  data() {
    return {
    };
  },
  props: {
    arr: Array
  },
  methods: {
    add() {

    }
  }
}
</script>
<style lang="less">
#getBOM {
}
</style>
