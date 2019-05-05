<template>
  <div id="addInspectionBill" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document" style="max-width: 100%;width: 1280px;">
      <div class="modal-content">
        <div class="modal-body">
          <el-table :data="arr" border stripe>
            <el-table-column prop="code" label="料品编码" width="150"></el-table-column>
            <el-table-column prop="name" label="料品名称" width="150"></el-table-column>
            <el-table-column prop="info" label="料品规格" width="150"></el-table-column>
            <el-table-column prop="unit" label="单位" width="150"></el-table-column>
            <el-table-column prop="date" label="交期" width="150"></el-table-column>
            <el-table-column prop="num" label="采购数量" width="150"></el-table-column>
            <el-table-column prop="num" label="暂收数" width="150"></el-table-column>
            <el-table-column prop="verification" label="是否需检" width="150"></el-table-column>
            <el-table-column prop="remark" label="备注" width="150"></el-table-column>
            <el-table-column label="此次检数" width="150">
              <template slot-scope="{ row }">
                <el-input v-model="row.num" size="mini" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="num" label="质检结果" width="150"></el-table-column>
            <el-table-column label="合格数" width="150">
              <template slot-scope="{ row }">
                <el-input v-model="row.num" size="mini" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="不良数" width="150">
              <template slot-scope="{ row }">
                <el-input v-model="row.num" size="mini" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="需退数" width="150">
              <template slot-scope="{ row }">
                <el-input v-model="row.num" size="mini" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="实退数" width="150">
              <template slot-scope="{ row }">
                <el-input v-model="row.num" size="mini" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="不良原因" width="150">
              <template slot-scope="{ row }">
                <el-input v-model="row.num" size="mini" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="modal-footer">
          <el-button size="mini" type="info" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addInspectionBill",
  data() {
    return {};
  },
  props: {
    arr: Array
  },
  methods: {
    onSubmit() {
      /**
       * 检查数量 = 合格 + 不合格
       * 质检结果必填
       * 不良原因必填
       */
    }
  },
  mounted() {
    // $("#temporary #addInspectionBill").on("shown.bs.modal", function() {});
  }
};
</script>
<style lang="less">
  #addInspectionBill {
    .el-table {
      .el-table__body-wrapper {
        .el-table__body {
          .el-table__row {
            td {
              .cell {
                .el-input {
                  input {
                    border: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>