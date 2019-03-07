<template>
  <div
    class="modal fade bs-example-modal-lg"
    id="addReceive"
    tabindex="-1"
    role="dialog"
    aria-labelledby="myLargeModalLabel"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" style="font-size: 2.7rem;">&times;</span>
          </button>
          <h4 class="modal-title" id="myModalLabel">新建委外领料单</h4>
        </div>
        <div class="modal-body">
          <el-form :model="form" size="mini" ref="form" label-width="80px">
            <el-form-item label="申请人" prop>
              <el-input></el-input>
            </el-form-item>
            <el-form-item label="部门" prop>
              <el-input></el-input>
            </el-form-item>
            <el-form-item class="remarks" label="备注" prop>
              <el-input type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="申请日期" prop>
              <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="需求日期" prop>
              <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item class="table">
              <el-table :data="form.tableData" size="mini" border style="width: 100%">
                <el-table-column prop="date" label="序号">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.date" placeholder="序号"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="料品编码">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.name" placeholder="料品编码"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="料品名称">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.address" placeholder="料品名称"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="料品规格">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.address" placeholder="料品规格"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="单位">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.address" placeholder="单位"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="数量">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.address" placeholder="数量"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="备注">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.address" placeholder="备注"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addReceive",
  data() {
    return {
      form: {
        tableData: [
          {
            date: "",
            name: "",
            address: ""
          }
        ]
      },
      rule: {}
    };
  },
  methods: {
    onSubmit() {}
  },
  watch: {
    form: {
      handler(val) {
        let addRows = true,
          lastRow = val.tableData[val.tableData.length - 1];
        val.tableData.forEach(e => {
          if (!e.date || !e.name || !e.address) addRows = false;
        });
        if (addRows)
          this.form.tableData.push({
            date: "",
            name: "",
            address: ""
          });
        // else if (!addRows && !lastRow.date && !lastRow.name && !lastRow.address)
        //   this.form.tableData.pop();
      },
      deep: true
    }
  }
};
</script>
<style lang="less">
#addReceive {
  .modal-body {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 33%;
        .remarks {
          height: 28px;
          textarea {
            height: 60px;
          }
        }
        .el-date-editor.el-input,
        .el-date-editor.el-input__inner {
          width: 100%;
        }
        &.table,
        &:last-child {
          width: 100%;
          text-align: center;
          .el-form-item__content {
            margin-left: 0 !important;
            .el-table {
              .el-table__body-wrapper {
                .el-table__body {
                  .el-table__row {
                    .cell {
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
    }
  }
}
</style>
