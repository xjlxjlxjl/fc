<template>
  <div>
    <div class="modal fade" id="addApply" role="dialog" >
      <div class="modal-dialog modal-lg" style="width: 100%;max-width: 1280px;" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true" style="font-size: 2.7rem;">&times;</span>
            </button>
            <h4 class="modal-title" id="myModalLabel">新建采购申请</h4>
          </div>
          <div class="modal-body">
            <el-form :model="form" size="mini" ref="form" label-width="80px">
              <el-form-item label="申请人" prop="applicant_id">
                <el-select v-model="form.applicant_id" placeholder="申请人" disabled>
                  <el-option
                    v-for="item in userBranch"
                    :key="item.id"
                    :label="item.display_name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="部门" prop="branch_id">
                <el-select v-model="form.branch_id" placeholder="部门" disabled>
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
                  type="date"
                  disabled
                  v-model="form.applicant_at"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="table">
                <el-table :data="form.items" border style="width: 100%">
                  <el-table-column prop="material_id" label="序号">
                    <template slot-scope="{$index}">
                      <div>{{ $index + 1 }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="name" label="料品名称">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.name" placeholder="料品名称" @blur="editItems(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="code" label="料品编码" width="180px">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.code" placeholder="料品编码" @blur="editItems(row)">
                        <el-button slot="append" icon="el-icon-arrow-down" @click="materialModal = !materialModal"></el-button>
                      </el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="specification" label="料品规格">
                    <template slot-scope="{$index, row}">
                      <el-input
                        v-model="row.specification"
                        placeholder="料品规格"
                        @blur="editItems(row)"
                      ></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="unit" label="单位">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.unit" placeholder="单位" @blur="editItems(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="quantity" label="数量">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.quantity" placeholder="数量" @blur="editItems(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="demand_at" label="需求日期" width="150px">
                    <template slot-scope="{$index, row}">
                      <el-date-picker
                        type="date"
                        @change="editItems(row)"
                        v-model="row.demand_at"
                        value-format="yyyy-MM-dd"
                        placeholder="需求日期"
                      ></el-date-picker>
                    </template>
                  </el-table-column>
                  <el-table-column prop="remark" label="备注">
                    <template slot-scope="{$index, row}">
                      <el-input v-model="row.remark" placeholder="备注" @blur="editItems(row)"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="{$index, row}">
                      <el-button type="danger" size="mini" @click="delItems($index, row)">删除</el-button>
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

    <!-- 料品列表 -->
    <materList @add="addMater"></materList>
  </div>
</template>
<script>
import materList from '@/pages/Process/common/materList';
export default {
  name: "addApply",
  data() {
    const user = JSON.parse(localStorage.getItem("user")) || {
      user: { id: 0, current_branch: [] }
    };
    return {
      request_id: 0,
      form: {
        applicant_id: user.user.id,
        branch_id: user.user.current_branch.length
          ? user.user.current_branch[0].id
          : "",
        // demand_at: "",
        applicant_at: this.dateParse(new Date()),
        remark: "",
        items: [
          {
            material_id: "",
            name: "",
            code: "",
            specification: "",
            unit: "",
            quantity: "",
            demand_at: "",
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
      userBranch: [],
      materialModal: false
    };
  },
  components: {
    materList: materList
  },
  methods: {
    // 当选择数较多并且没有 requset_id 过滤
    addMater(v) {
      let that = this;
      if (v.length > 1 && !that.request_id) {
        let param = v.shift(),
          params = {
            request_id: that.request_id || "",
            code: param.material_number || "",
            material_id: param.id,
            name: param.name || "",
            specification: param.material_specification || "",
            unit: param.item_unit || "",
            quantity: param.quantity || 1,
            remarks: param.remarks || ""
          };
        // that
        //   .$post(`procurement/request/item/create`, params)
        //   .then(response => {
        //     if (response.status != 200) return false;
        //     that.request_id = response.data.request_id;
        //     that.addItem(v);
        //     params.id = response.data.id;
            that.form.items.unshift(params);
          // })
          // .catch(err => console.error(err));
      } else this.addItem(v);
    },
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
    addItem(v) {
      let params = {
        request_id: this.request_id || "",
        code: v.material_number || "",
        material_id: v.id,
        name: v.name || "",
        specification: v.material_specification || "",
        unit: v.item_unit || "",
        quantity: v.quantity || 1,
        remarks: v.remarks || ""
      };
      this.form.items.unshift(params);
      $("#purchaseApply .materList").modal("hide");
    },
    editItems(row) {
      /**
      if (row.id) {
        let that = this;
        that.$post(`procurement/request/item/edit/${row.id}`, {
          request_id: that.request_id || "",
          code: row.code || "",
          material_id: row.material_id,
          name: row.name || "",
          specification: row.specification || "",
          unit: row.unit || "",
          quantity: row.quantity || 1,
          demand_at: row.demand_at || "",
          remarks: row.remarks || ""
        });
      }
      */
    },
    delItems(index, row) {
      if (row.id) {
        this.$get(`procurement/request/item/delete/${row.id}`)
          .then(response => {
            if (response.status != 200) return false;
            this.form.items.splice(index, 1);
          })
          .catch(err => console.error(err));
      } else 
        this.form.items.splice(index, 1);
    },
    onSubmit() {
      let that = this,
        arr = [];
      that.form.items.forEach((e, k) => {
        if (!e.material_id) e.material_id = undefined;
        if (!e.demand_at) e.demand_at = that.miniDateParse(new Date());
        if (
          // e.material_id ||
          e.name &&
          // e.code ||
          e.specification &&
          e.quantity &&
          e.demand_at
        )
          arr.push(e);
      });
      that
        .$post(`procurement/request/create`, {
          applicant_id: that.form.applicant_id,
          branch_id: that.form.branch_id,
          // demand_at: that.form.demand_at,
          applicant_at: that.form.applicant_at,
          remark: that.form.remark,
          items: arr
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
    }
  },
  watch: {
    form: {
      // val 与 oldVal 参数内容相同
      handler(val, oldVal) {
        let that = this,
          addRows = true,
          lastRow = that.form.items[that.form.items.length - 1];
        if (val.items.length - oldVal.items.length > 1) return false;
        else {
          val.items.forEach(e => {
            if (
              !e.name ||
              // !e.code ||
              !e.specification ||
              !e.unit ||
              !e.demand_at ||
              !e.quantity
            )
              addRows = false;
          });
          // 新增
          if (addRows) {
            that.form.items.push({
              material_id: "",
              name: "",
              code: "",
              specification: "",
              unit: "",
              quantity: 1,
              demand_at: "",
              remark: ""
            });
            /**
            that
              .$post(`procurement/request/item/create`, {
                request_id: that.request_id || "",
                code: lastRow.code || undefined,
                material_id: lastRow.material_id || undefined,
                name: lastRow.name || "",
                specification: lastRow.specification || "",
                unit: lastRow.unit || "",
                quantity: lastRow.quantity || 1,
                demand_at: lastRow.demand_at || "",
                remarks: lastRow.remark || ""
              })
              .then(response => {
                if (response.status != 200) return false;
                lastRow.id = response.data.id;
                that.request_id = response.data.request_id;
              })
              .catch(err => console.error(err));
            */
          }
        }
      },
      deep: true
    },
    materialModal() {
      $("#purchaseApply .materList").modal("toggle");
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

.materList {
  .el-table {
    td {
      &:nth-child(17) {
        padding: 0;
        .cell {
          padding: 0;
          .materialsType {
            display: flex;
            > div {
              white-space: nowrap;
              width: 100px;
              height: 50px;
              line-height: 50px;
              text-align: center;
            }
          }
        }
      }
    }
  }
  .condition {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    > div {
      display: flex;
      align-items: center;
      button,
      span {
        white-space: nowrap;
        margin-right: 5px;
      }
    }
  }
}
</style>
