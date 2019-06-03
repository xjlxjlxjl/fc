<template>
  <div class="modal fade" id="getBOM" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <el-table :data="arr" border stripe>
          <el-table-column label="序号">
            <template slot-scope="{ $index }">{{ $index }}</template>
          </el-table-column>
          <el-table-column prop="material_number" label="料品编码"></el-table-column>
          <el-table-column prop="material_specification" label="料品规格"></el-table-column>
          <el-table-column prop="material_name" label="料品名称"></el-table-column>
          <el-table-column prop="quantity" label="数量"></el-table-column>
          <el-table-column prop="length" label="长度"></el-table-column>
          <el-table-column prop="unit" label="单位"></el-table-column>
          <el-table-column prop="material_category" label="料品类别"></el-table-column>
          <el-table-column prop="bom_attributes_name" label="料品属性"></el-table-column>
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
