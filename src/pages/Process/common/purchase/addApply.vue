<template>
  <div>
    <div
      class="modal fade bs-example-modal-lg"
      id="addApply"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
    >
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
                        <el-button slot="append" icon="el-icon-arrow-down" @click="getMater(true)"></el-button>
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
    <div
      class="modal fade bs-example-modal-lg materList"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
    >
      <div class="modal-dialog modal-lg" role="document" style="width: 100%;max-width: 1280px;">
        <div class="modal-content">
          <el-table
            :data="mater.data"
            border
            style="width: 100%"
            height="500"
            @selection-change="materChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="material_number" label="物料编码"></el-table-column>
            <el-table-column prop="name" label="物料名称"></el-table-column>
            <el-table-column prop="material_specification" label="料品规格"></el-table-column>
            <el-table-column prop="material_category.name" label="料品类别"></el-table-column>
            <el-table-column prop="item_unit" label="主单位"></el-table-column>
            <el-table-column prop="image" label="图片"></el-table-column>
            <el-table-column prop="drawing_pdf" label="工程图号">
              <template slot-scope="{ row }">
                <a
                  v-for="item in row.drawing_pdf"
                  :key="item"
                  :href="item"
                  :download="item.split('/').pop()"
                  target="_blank"
                >{{ item.split('/').pop() }}</a>
              </template>
            </el-table-column>
            <el-table-column prop="barcode" label="条码"></el-table-column>
            <el-table-column prop="date" label="颜色"></el-table-column>
            <el-table-column prop="date" label="有效期"></el-table-column>
            <el-table-column prop="max_inventory" label="最大库存"></el-table-column>
            <el-table-column prop="min_inventory" label="最小库存"></el-table-column>
            <el-table-column prop="manufacturer" label="生产厂家"></el-table-column>
            <el-table-column prop="respository.name" label="仓库"></el-table-column>
            <el-table-column prop="attributes" label="BOM单位"></el-table-column>
            <el-table-column prop="date" label="料品类别" width="400px">
              <template slot-scope="{}">
                <div class="materialsType">
                  <div>
                    <input type="checkbox">采购件
                  </div>
                  <div>
                    <input type="checkbox">自制件
                  </div>
                  <div>
                    <input type="checkbox">委外件
                  </div>
                  <div>
                    <input type="checkbox">销售件
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="attributes" label="料品属性"></el-table-column>
            <el-table-column prop="date" label="损耗率"></el-table-column>
            <el-table-column prop="weight" label="净重"></el-table-column>
            <el-table-column prop="total_weight" label="毛重"></el-table-column>
            <el-table-column prop="dimension" label="材积"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="density" label="密度"></el-table-column>
            <el-table-column prop="standard_model" label="模具号"></el-table-column>
            <el-table-column prop="material_level" label="料品等级"></el-table-column>
            <el-table-column prop="date" label="材质"></el-table-column>
            <el-table-column prop="standard_cost_price" label="进价"></el-table-column>
            <el-table-column prop="standard_uniform_price" label="售价"></el-table-column>
            <el-table-column prop="standard_single_price" label="标准价"></el-table-column>
            <el-table-column prop="date" label="英文名称"></el-table-column>
            <el-table-column prop="minimum_purchase_quantity" label="最小采购量"></el-table-column>
            <el-table-column prop="date" label="最小批量"></el-table-column>
            <el-table-column prop="date" label="采购提前期"></el-table-column>
            <el-table-column prop="date" label="出货免检"></el-table-column>
            <el-table-column prop="date" label="主供应商"></el-table-column>
            <el-table-column prop="date" label="供应商简称"></el-table-column>
            <el-table-column prop="created_at" label="生效"></el-table-column>
            <el-table-column prop="pinyin_code" label="拼音码"></el-table-column>
            <el-table-column prop="length" label="料品长"></el-table-column>
            <el-table-column prop="width" label="料品宽"></el-table-column>
            <el-table-column prop="height" label="料品高"></el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
            <el-table-column prop="member" label="管理者"></el-table-column>
            <el-table-column prop="update_at" label="修改日期"></el-table-column>
            <el-table-column prop="update_by" label="修改用户"></el-table-column>
          </el-table>
          <div class="condition">
            <div>
              <span>查找关键字</span>
              <el-input size="mini" v-model="mater.search" @blur="getMater(true)"></el-input>
            </div>
            <div>
              <span>申请日期</span>
              <el-date-picker
                size="mini"
                v-model="mater.date"
                @change="getMater(true)"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </div>
            <div>
              <button class="btn btn-primary btn-sm" @click="addMater">确定</button>
              <button class="btn btn-default btn-sm" data-dismiss="modal" aria-label="Close">取消</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
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
      mater: {
        data: [],
        pagination: {
          current_page: 0,
          per_page: 10
        },
        search: "",
        date: ["", ""],
        selection: []
      }
    };
  },
  methods: {
    getMater(search) {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get(`respositories/materials/list`, {
          per_page: that.mater.pagination.per_page,
          page: search ? 1 : ++that.mater.pagination.current_page,
          search: that.mater.search,
          start_time: that.mater.date[0],
          end_time: that.mater.date[1]
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          if (search) that.mater.data = response.data.list;
          else
            for (let item of response.data.list) {
              that.mater.data.push(item);
            }
          that.mater.pagination = response.data.pagination;
          $("#purchaseApply .materList").modal("show");
        })
        .catch(err => loading.close());
    },
    materChange(val) {
      this.mater.selection = val;
    },
    // 当选择数较多并且没有 requset_id 过滤
    addMater() {
      let that = this;
      if (this.mater.selection.length > 1 && !that.request_id) {
        let param = this.mater.selection.shift(),
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
        //     that.addItem();
        //     params.id = response.data.id;
            that.form.items.unshift(params);
          // })
          // .catch(err => console.error(err));
      } else this.addItem();
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
    addItem() {
      let that = this;
      this.mater.selection.forEach(e => {
        let params = {
          request_id: that.request_id || "",
          code: e.material_number || "",
          material_id: e.id,
          name: e.name || "",
          specification: e.material_specification || "",
          unit: e.item_unit || "",
          quantity: e.quantity || 1,
          remarks: e.remarks || ""
        };
        // that
        //   .$post(`procurement/request/item/create`, params)
        //   .then(response => {
        //     if (response.status != 200) return false;
        //     that.request_id = response.data.request_id;
        //     params.id = response.data.id;
            that.form.items.unshift(params);
          // })
          // .catch(err => console.error(err));
      });
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
      }
    },
    onSubmit() {
      let that = this,
        arr = [];
      that.form.items.forEach((e, k) => {
        if (!e.material_id) e.material_id = undefined;
        if (
          // e.material_id ||
          e.name &&
          // e.code ||
          e.specification &&
          e.unit &&
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
    }
  },
  mounted() {
    let that = this;
    $("#purchaseApply .materList .el-table__body-wrapper").scroll(function(e) {
      if (
        $(this)[0].scrollTop ===
          $(this)[0].scrollHeight - $(this)[0].clientHeight &&
        that.mater.data.length >= that.mater.pagination.per_page
      )
        that.getMater();
    });
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
