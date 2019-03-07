<template>
  <div
    class="modal fade bs-example-modal-lg"
    id="addApply"
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
          <h4 class="modal-title" id="myModalLabel">新建采购申请</h4>
        </div>
        <div class="modal-body">
          <el-form :model="form" :rules="rule" size="mini" ref="form" label-width="80px">
            <el-form-item label="申请人" prop="applicant_id">
              <el-select v-model="form.applicant_id" placeholder="申请人">
                <el-option
                  v-for="item in userBranch"
                  :key="item.id"
                  :label="item.display_name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="部门" prop="branch_id">
              <el-select v-model="form.branch_id" placeholder="部门">
                <el-option
                  v-for="item in branch"
                  :key="item.branch_id"
                  :label="item.branch_name"
                  :value="item.branch_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="remarks" label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item label="申请日期" prop="applicant_at">
              <el-date-picker
                type="datetime"
                v-model="form.applicant_at"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="需求日期" prop="demand_at">
              <el-date-picker
                type="datetime"
                v-model="form.demand_at"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="table">
              <el-table :data="form.items" border style="width: 100%">
                <el-table-column prop="material_id" label="序号">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.material_id" placeholder="序号"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="料品名称">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.name" placeholder="料品名称"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="code" label="料品编码">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.code" placeholder="料品编码"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="specification" label="料品规格">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.specification" placeholder="料品规格"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="unit" label="单位">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.unit" placeholder="单位"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="quantity" label="数量">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.quantity" placeholder="数量"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                  <template slot-scope="{$index, row}">
                    <el-input v-model="row.remark" placeholder="备注"></el-input>
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
  name: "addApply",
  data() {
    return {
      form: {
        applicant_id: "",
        branch_id: "",
        demand_at: "",
        applicant_at: "",
        remark: "",
        items: [
          {
            material_id: "",
            name: "",
            code: "",
            specification: "",
            unit: "",
            quantity: "",
            remark: ""
          }
        ]
      },
      rule: {
        applicant_id: [
          { required: true, message: "请选择申请人", trigger: "change" }
        ],
        branch_id: [
          { required: true, message: "请选择部门", trigger: "change" }
        ],
        applicant_at: [
          { required: true, message: "请选择申请时间", trigger: "change" }
        ],
        demand_at: [
          { required: true, message: "请选择需求时间", trigger: "change" }
        ]
      },
      branch: [],
      userBranch: []
    };
  },
  methods: {
    getBranch() {
      if (this.$store.state.userBranch.length)
        this.$store.state.userBranch.forEach(e => {
          this.branch.push(e);
          e.member.forEach(v => this.userBranch.push(v));
        });
      else {
        let that = this;
        that
          .$get(`members/company/branch`, {})
          .then(response => {
            if (response.status != 200) return false;
            response.data.list.forEach(e => {
              that.branch.push(e);
              e.member.forEach(v => that.userBranch.push(v));
            });
            that.$store.commit("getUserBranch", response.data.list);
          })
          .catch(err => console.error(err));
      }
    },
    onSubmit() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
        let that = this,
          arr = [];
        that.form.items.forEach((e, k) => {
          if (
            e.material_id ||
            e.name ||
            e.code ||
            e.specification ||
            e.unit ||
            e.quantity
          )
            arr.push(e);
        });
        that
          .$post(`procurement/request/create`, {
            applicant_id: that.form.applicant_id,
            branch_id: that.form.branch_id,
            demand_at: that.form.demand_at,
            applicant_at: that.form.applicant_at,
            remark: that.form.remark,
            items: JSON.stringify(arr)
          })
          .then(response => {
            if (response.status != 200) return false;
            that.refresh($("#purchaseApply #table"));
            $("#addApply").modal("hide");
            that.$refs["form"].resetFields();
            that.form.items = [
              {
                material_id: "",
                name: "",
                code: "",
                specification: "",
                unit: "",
                quantity: "",
                remark: ""
              }
            ];
          })
          .catch(err => console.error(err));
      });
    }
  },
  watch: {
    form: {
      handler(val) {
        let addRows = true,
          lastRow = val.items[val.items.length - 1];
        val.items.forEach(e => {
          if (
            !e.material_id ||
            !e.name ||
            !e.code ||
            !e.specification ||
            !e.unit ||
            !e.quantity
          )
            addRows = false;
        });
        if (addRows)
          this.form.items.push({
            material_id: "",
            name: "",
            code: "",
            specification: "",
            unit: "",
            quantity: "",
            remark: ""
          });
        // else if (
        //   !addRows &&
        //   !lastRow.material_id &&
        //   !lastRow.name &&
        //   !lastRow.code &&
        //   !lastRow.specification &&
        //   !lastRow.unit &&
        //   !lastRow.quantity
        // )
        //   this.form.items.pop();
      },
      deep: true
    }
  },
  created() {
    this.getBranch();
  }
};
</script>
<style lang="less">
#addApply {
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
