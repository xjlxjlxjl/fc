<template>
  <div class="modal fade" id="missMaterial" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <el-table :data="arr" border stripe>
          <el-table-column label="序号" width="50">
            <template slot-scope="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="" label="料品编码"></el-table-column>
          <el-table-column prop="" label="料品规格"></el-table-column>
          <el-table-column prop="" label="料品名称"></el-table-column>
          <el-table-column prop="" label="数量"></el-table-column>
          <el-table-column prop="" label="长度"></el-table-column>
          <el-table-column prop="" label="关联子料"></el-table-column>
          <el-table-column prop="" label="单位"></el-table-column>
          <el-table-column prop="" label="料品类别"></el-table-column>
          <el-table-column prop="" label="料品属性"></el-table-column>
          <el-table-column prop="" label="智能占用"></el-table-column>
          <el-table-column prop="" label="尚缺数量"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "missMaterial",
  data() {
    return {};
  },
  props: {
    arr: Array
  },
  methods: {},
  mounted() {}
}
</script>
