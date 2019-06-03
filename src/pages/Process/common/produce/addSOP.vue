<template>
  <div>
    <div class="modal fade" id="addSOP" role="dialog">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
          <div class="modal-body">
            <el-form :model="form" ref="form" label-width="80px" size="mini">
              <el-form-item label="SOP名称">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="关联料品">
                <el-input v-model="form.material_number">
                  <el-button slot="suffix" size="mini" icon="el-icon-arrow-down" @click="getMater(true)"></el-button>
                </el-input>
              </el-form-item>
            </el-form>
            <el-table :data="arr" border stripe>
              <el-table-column label="标准步骤" width="120">
                <template slot-scope="{ row }">
                  <el-input type="textarea" rows="3" @blur="row.isEdit = true" v-model="row.step"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="图片" width="250">
                <template slot-scope="{ $index, row }">
                  <el-upload
                    action="a"
                    :before-upload="upload"
                    :file-list="row.images_arr"
                    list-type="picture">
                    <el-button size="mini" @click="type = 1;index = $index;row.isEdit = true" type="primary">点击上传</el-button>
                  </el-upload>
                </template>
              </el-table-column>
              <el-table-column label="遇到的问题" width="1000">
                <template slot-scope="data">
                  <el-table :data="data.row.problem" border stripe size="mini">
                    <el-table-column label="错误图片" width="120">
                      <template slot-scope="{ $index, row }">
                        <el-upload
                          action="a"
                          :before-upload="upload"
                          :file-list="row.error_images"
                          list-type="picture">
                          <el-button size="mini" @click="type = 2;index = data.$index;key = $index" type="primary">点击上传</el-button>
                        </el-upload>
                      </template>
                    </el-table-column>
                    <el-table-column label="发生时间" width="150">
                      <template slot-scope="{ row }">
                        <el-date-picker style="width: 100%;" value-format="yyyy-MM-dd" @change="data.row.isEdit = true" v-model="row.happen_at" size="mini" type="date" placeholder="选择日期时间"></el-date-picker>
                      </template>
                    </el-table-column>
                    <el-table-column label="订单号">
                      <template slot-scope="{ row }">
                        <el-input type="textarea" @blur="data.row.isEdit = true" v-model="row.numbing"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="问题描述">
                      <template slot-scope="{ row }">
                        <el-input type="textarea" @blur="data.row.isEdit = true" v-model="row.description"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="原因">
                      <template slot-scope="{ row }">
                        <el-input type="textarea" @blur="data.row.isEdit = true" v-model="row.reason"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="解决方法">
                      <template slot-scope="{ row }">
                        <el-input type="textarea" @blur="data.row.isEdit = true" v-model="row.solution"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="如何预防">
                      <template slot-scope="{ row }">
                        <el-input type="textarea" @blur="data.row.isEdit = true" v-model="row.prevent"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column width="65">
                      <template slot-scope="{ $index }">
                        <el-button type="text" @click="data.row.problem.splice($index + 1, 0, { error_images: [] })" icon="el-icon-plus"></el-button>
                        <el-button type="text" @click="data.row.problem.splice($index, 1)" icon="el-icon-close"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button v-if="!data.row.problem.length" style="width: 100%;" size="mini" @click="data.row.problem.push({ error_images: [] })" icon="el-icon-plus"></el-button>        
                </template>
              </el-table-column>
              <el-table-column width="65">
                <template slot-scope="{ $index }">
                  <el-button type="text" @click="arr.splice($index + 1, 0, { problem:[{}] })" icon="el-icon-plus"></el-button>
                  <el-button type="text" @click="arr.splice($index, 1)" icon="el-icon-close"></el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button v-if="!arr.length" style="width: 100%;" size="mini" @click="arr.push({ images_arr: [], problem:[{ error_images: [] }] })" icon="el-icon-plus"></el-button>        
          </div>
          <div class="modal-footer" style="text-align: center;">
            <el-button size="mini" data-dismiss="modal">取消</el-button>
            <el-button size="mini" type="primary" @click="add">确定</el-button>          
          </div>
        </div>
      </div>
    </div>

    <!-- 料品列表 -->
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
  name: "addSOP",
  data() {
    return {
      form: {
        name: "",
        material_number: "",
        material_id: 0,
      },
      arr: [{ images_arr: [], problem: [{ error_images: [] }] }],
      mater: {
        data: [],
        pagination: {
          current_page: 0,
          per_page: 10
        },
        search: "",
        date: ["", ""],
        selection: {}
      }
    }
  },
  props: {
    row: Object
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
          $("#SOP .materList").modal("show");
        })
        .catch(err => loading.close());
    },
    materChange(val) {
      this.mater.selection = val;
    },
    addMater() {
      this.form.material_id = this.mater.selection.id;
      this.form.material_number = this.mater.selection.material_number;
      $("#SOP .materList").modal("hide");
    },
    upload(file) {
      let that = this,
        form = new FormData();
      form.append("upload", file);
      if (this.type == 1) form.append("slug", "problem_images");
      else form.append("slug", "problem_error_images");
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          if (this.type == 1) {
            if (!this.arr[this.index].images) this.arr[this.index].images = response.data.upload.id;
            else this.arr[this.index].images += `,${response.data.upload.id}`;
            if (!this.arr[this.index].images_arr) this.arr[this.index].images_arr = [];
            this.arr[this.index].images_arr.push({
              name: file.name,
              url: response.data.url,
              uid: response.data.upload.id
            });
          } else {
            if (!this.arr[this.index].problem[this.key].error_images) this.arr[this.index].problem[this.key].error_images = [];
            this.arr[this.index].problem[this.key].error_images.push({
              name: file.name,
              url: response.data.url,
              uid: response.data.upload.id
            });
          }
          let arr = this.arr;
          this.arr = [];
          setTimeout(() => this.arr = arr, 10)
        })
        .catch(err => console.error(err));
    },
    add() {
      let arr = this.arr.map(e => {
        if (e.id) this.edItem(e);
        else {
          e.problem.error_images == e.problem.error_images || [];
          return {
            step: e.step,
            images: e.images,
            problem: JSON.stringify(e.problem)
          }
        }
      })
      this
        .$post(this.row.id ? `produces/sop_manage/edit` : `produces/sop_manage/create`, {
          id: this.row.id || undefined,
          name: this.form.name,
          material_id: this.form.material_id,
          remark: this.form.remark,
          sop_step: arr
        })
        .then(response => {
          if (response.status != 200) return false;
          this.$emit('refresh');
          $("#SOP #addSOP").modal("hide");
          this.clearForm();
        })
        .catch(e => console.error(e));
    },
    edItem(v) {
      if (!v.id) return false;
      this
        .$post(`produces/sop_step/edit`, {
          id: v.id,
          step: v.step,
          images: v.images,
          problem: JSON.stringify(v.problem)
        })
        .then(response => {
          if (response.status != 200) return false;
        })
        .catch(e => console.error(e));
    },
    clearForm() {
      this.form = {
        name: "",
        material_number: "",
        material_id: 0
      };
      this.arr = [{ problem: [{}] }];
    }
  },
  mounted() {
    $("#SOP #addSOP").on('shown.bs.modal', () => {
      if (this.row.id) {
        this.form.name = this.row.name;
        this.form.material_number = this.row.material.material_number;
        this.form.material_id = this.row.material.id;
        this.arr = this.row.sop_step;
      } else this.clearForm();
      
    })
  }
}
</script>
<style lang="less">
#addSOP {
  .modal-body {
    > .el-form {
      display: flex;
      .el-form-item {
        width: 33%;
        .el-input__suffix {
          button {
            padding: 7px 5px;
            border: none;
          }
        }
      }
    }
    > .el-table {
      > .el-table__body-wrapper {
        > .el-table__body {
          > tbody {
            > tr {
              > td {
                input[type=file] {
                  display: none;
                }
                &:nth-child(3) {
                  padding: 0;
                  > .cell {
                    padding: 0;
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
 