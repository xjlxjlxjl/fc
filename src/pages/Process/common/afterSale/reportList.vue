<template>
  <div id="reportList" class="modal fade">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <el-table :data="tableData" border stripe>
          <el-table-column prop="creator.last_name" label="添加人"></el-table-column>
          <el-table-column prop="created_at" label="添加日期"></el-table-column>
          <el-table-column prop="members" label="客服人员"></el-table-column>
          <el-table-column prop="responsible_unit" label="责任单位"></el-table-column>
          <el-table-column prop="reason" label="不良原因分析" width="100"></el-table-column>
          <el-table-column prop="solution" label="解决方案"></el-table-column>
          <el-table-column prop="images" label="图片">
            <template slot-scope="{ row }">
              <a target="_blank" v-for="item in row.images" :key="item" :href="item">
                <img :src="item" style="max-width: 50px;max-height: 50px;">
              </a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "reportList",
  data() {
    let user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      tableData: []
    };
  },
  props: {
    reportId: Number
  },
  methods: {
  },
  mounted() {
    const that = this;
    $("#report #reportList").on("shown.bs.modal", function() {
      that
        .$get(`service/report/order/${that.reportId}/records`)
        .then(response => {
          if (response.status != 200) return false;
          that.tableData = response.data;
        })
        .catch(err => console.error(err));
    })
    $("#application #reportList").on("shown.bs.modal", function() {
      that
        .$get(`service/report/order/${that.reportId}/records`)
        .then(response => {
          if (response.status != 200) return false;
          that.tableData = response.data;
        })
        .catch(err => console.error(err));
    })
  }
};
</script>
<style lang="less">
#reportList {
  z-index: 20000;
}
</style>