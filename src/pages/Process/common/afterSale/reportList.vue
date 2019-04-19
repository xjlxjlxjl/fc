<template>
  <div id="reportList" class="modal fade">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <el-table :data="tableData" border stripe>
          <el-table-column label="添加人"></el-table-column>
          <el-table-column label="添加日期"></el-table-column>
          <el-table-column label="客服人员"></el-table-column>
          <el-table-column label="责任单位"></el-table-column>
          <el-table-column label="不良原因分析"></el-table-column>
          <el-table-column label="解决方案"></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="{ row }">
              <a target="_blank" v-for="item in row.img" :key="item.id" :href="item.url">
                <img :src="item.url">
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
    const that = this,
      params = {
        id: this.reportId
      };
    $("#application #reportList").on("shown.bs.modal", function() {
      that
        .$get(``, params)
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
  z-index: 1055;
}
</style>