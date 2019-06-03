<template>
  <div class="modal fade" id="getSopData" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px; max-width: 100%;">
      <div class="modal-content">
        <el-table :data="arr.sop_step" border stripe>
          <el-table-column prop="step" label="标准步骤" width="150"></el-table-column>
          <el-table-column prop="images" label="图片" width="150">
            <template slot-scope="{ row }">
              <a v-for="(item, index) in row.images" :key="index" :href="item.url" target="_blank">
                <img :src="item.url" style="max-width: 80px;max-height: 80px;">
              </a>
            </template>
          </el-table-column>
          <el-table-column prop="problem" label="遇到的问题" width="1200">
            <template slot-scope="data">
              <el-table :data="data.row.problem" border stripe>
                <el-table-column prop="error_images" label="错误图片">
                  <template slot-scope="{ row }">
                    <a v-for="(item, index) in row.error_images" :key="index" :href="item.url" target="_blank">
                      <img :src="item.url" style="max-width: 80px;max-height: 80px;">
                    </a>
                  </template>
                </el-table-column>
                <el-table-column prop="happen_at" label="发生时间"></el-table-column>
                <el-table-column prop="numbing" label="订单号"></el-table-column>
                <el-table-column prop="images" label="问题描述"></el-table-column>
                <el-table-column prop="description" label="原因"></el-table-column>
                <el-table-column prop="reason" label="解决方法"></el-table-column>
                <el-table-column prop="solution" label="如何预防"></el-table-column>
              </el-table>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "getSopData",
  data() {
    return {};
  },
  props: {
    arr: {
      type: Object
    }
  }
}
</script>
<style lang="less">
#getSopData {
}
</style>
