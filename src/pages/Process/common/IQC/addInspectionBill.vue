<template>
  <div id="addInspectionBill" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document" style="max-width: 100%;width: 1280px;">
      <div class="modal-content">
        <div class="modal-body">
          <el-table :data="form.items" size="mini" border stripe>
            <el-table-column prop="code" label="料品编码" width="150"></el-table-column>
            <el-table-column prop="name" label="料品名称" width="150"></el-table-column>
            <el-table-column prop="specification" label="料品规格" width="150"></el-table-column>
            <el-table-column prop="unit" label="单位" width="150"></el-table-column>
            <el-table-column prop="delivery_period" label="交期" width="150"></el-table-column>
            <el-table-column prop="num" label="采购数量" width="150"></el-table-column>
            <el-table-column prop="cancel_quantity" label="暂收数" width="150"></el-table-column>
            <el-table-column prop="is_inspection" label="是否需检" width="150"></el-table-column>
            <el-table-column prop="remark" label="备注" width="150"></el-table-column>
            <el-table-column label="此次检数" width="150">
              <template slot-scope="{ row }">
                <el-input v-model="row.quantity" size="mini" placeholder="请输入"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="质检结果" width="450">
              <template slot-scope="{ row }">
                <table>
                  <tr>
                    <td>合格数量</td>
                    <td colspan="3"><el-input v-model="row.qualification" size="mini" placeholder="请输入"></el-input></td>
                  </tr>
                  <tr>
                    <td>不良数量</td>
                    <td><el-input v-model="row.bad" size="mini" placeholder="请输入"></el-input></td>
                    <td>不良原因</td>
                    <td><el-input v-model="row.bad_cause" size="mini" placeholder="请输入"></el-input></td>
                  </tr>
                </table>
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
    return {
      form: {
        temp_storage_id: 0,
        items: []
      }
    };
  },
  props: {
    arr: Object
  },
  methods: {
    onSubmit() {
      /**
       * 检查数量 = 合格 + 不合格
       * 质检结果必填
       * 不良原因必填
       */
      for (let e of this.form.items) {
        if (parseInt(e.quantity) != parseInt(e.qualification) + parseInt(e.bad || 0)) {
          this.$message({ message: '此次检数 = 合格 + 不合格', type: 'error' });
          return false;
        }
        if (parseInt(e.bad || 0)) {
          e.bad = e.bad || 0;
          e.grade = 0;
          if (!e.bad_cause) {
            this.$message({ message: '不良原因为必填', type: 'error' });
            return false;
          }
        } else e.grade = 1;
      }
      this
        .$post(`icm_qty_ctrl/quality/create`, this.form)
        .then(response => {
          if (response.status != 200) return false;
          $("#temporary #addInspectionBill").modal("hide");
        })
        .catch(e => console.error(e));
    }
  },
  mounted() {
    let that = this;
    $("#temporary #addInspectionBill").on("shown.bs.modal", function() {
      that.form.items = [];
      that.form.temp_storage_id = that.arr.id;
      for (let e of that.arr.items)
        that.form.items.push({
          temp_storage_item_id: e.id,
          code: e.material.material_number,
          name: e.material.name,
          specification: e.material.material_specification,
          unit: e.material.item_unit,
          delivery_period: e.delivery_period.date || '',
          num: e.purchase_quantity || '0',
          cancel_quantity: e.cancel_quantity,
          is_inspection: e.is_inspection ? '是' : '否',
          remark: e.remark,
          quantity: e.cancel_quantity,
          bad: e.bad_count || 0,
          bad_cause: e.bad_reason || ''
        })
    });
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
              &:last-child {
                padding: 0;
                .cell {
                  padding: 0;
                  table {
                    white-space: nowrap;
                    td:nth-child(2n - 1) {
                      padding: 5px 10px;
                    }
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