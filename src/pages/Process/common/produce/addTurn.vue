<template>
  <div>
    <div id="addTurn" class="modal fade" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <el-form :model="form" ref="form" size="mini" label-width="100px">
              <el-form-item label="生产工序名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="关联料品">
                <el-input v-model="form.material_number">
                  <el-button slot="suffix" icon="el-icon-arrow-down" @click="materModal = !materModal"></el-button>
                </el-input>
              </el-form-item>
            </el-form>
            <el-table :data="form.data" border stripe>
              <el-table-column label="序号" width="80">
                <template slot-scope="{ $index }">{{ $index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="step" label="生产步骤">
                <template slot-scope="{ row }">
                  <el-input v-model="row.step" size="mini" @blur="row.isEdit = true;"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="" width="80">
                <template slot-scope="{ $index }">
                  <el-button size="mini" type="text" icon="el-icon-plus" @click="form.data.splice($index, 0, {})"></el-button>
                  <el-button size="mini" type="text" icon="el-icon-minus" @click="form.data.splice($index, 1)"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button size="mini" style="width: 100%;" icon="el-icon-plus" @click="form.data.push({})"></el-button>
          </div>
          <div class="modal-footer">
            <el-button size="mini" data-dismiss="modal">取消</el-button>
            <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade materList" role="dialog" >
      <div class="modal-dialog modal-lg" role="document" style="width: 100%;max-width: 1280px;">
        <div class="modal-content">
          <el-table
            :data="mater.data"
            border
            style="width: 100%"
            height="500"
            highlight-current-row
            @current-change="materChange"
          >
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
              <template slot-scope="{ row }">
                <div class="materialsType">
                  <div>
                    <input type="checkbox" v-if="row.attributes.onArray(1, 'id')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 采购件
                  </div>
                  <div>
                    <input type="checkbox" v-if="row.attributes.onArray(2, 'id')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 自制件
                  </div>
                  <div>
                    <input type="checkbox" v-if="row.attributes.onArray(3, 'id')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 委外件
                  </div>
                  <div>
                    <input type="checkbox" v-if="row.attributes.onArray(4, 'id')" checked="checked" disabled>
                    <input type="checkbox" v-else disabled> 销售件
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
  name: "addTurn",
  data() {
    return {
      form: {
        material_number: "",
        data: []
      },
      mater: {
        data: [],
        pagination: {
          current_page: 0,
          per_page: 10
        },
        search: "",
        date: ["", ""],
        selection: {}
      },
      materModal: false
    };
  },
  props: {
    rows: {
      type: Object
    }
  },
  methods: {
    onSubmit() {
      this
        .$post( this.rows.id ? `produces/procedure/edit` : `produces/procedure/create`, {
          id: this.rows.id || undefined,
          name: this.form.name,
          material_id: this.form.material_id,
          data: JSON.stringify(this.form.data)
        })
        .then(response => {
          if (response.status != 200) return false;
          this.$emit('refresh');
          this.clearForm();
          $("#turn #addTurn").modal("hide");
        })
        .catch(e => console.error(e));
    },
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
        })
        .catch(err => loading.close());
    },
    materChange(val) {
      this.mater.selection = val;
    },
    addMater() {
      this.form.material_id = this.mater.selection.id;
      this.form.material_number = this.mater.selection.material_number;
      this.materModal = !this.materModal;
    },
    clearForm() {
      this.form = {
        material_number: "",
        data: []
      };
    }
  },
  watch: {
    materModal(val) {
      $("#turn .materList").modal("toggle");
    }
  },
  mounted() {
    this.getMater()
    $("#turn #addTurn").on('shown.bs.modal', () => {
      if (this.rows.id) {
        this.form.name = this.rows.name;
        this.form.material_number = this.rows.material.material_number;
        this.form.material_id = this.rows.material.id;
        this.form.data = this.rows.steps;
      } else this.clearForm();
    })
  }
}
</script>
<style lang="less">
#addTurn {
  .el-form {
    display: flex;
    .el-form-item {
      width: 50%;
      .el-form-item__content {
        .el-input__suffix {
          .el-button {
            border: none;
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
