<template>
  <div>
    <div id="addMaterial" class="modal fade" role="dialog">
      <div class="modal-dialog modal-lg" style="width: 1280px;max-width: 100%;" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="80px">
              <el-form-item label="料品名称" prop="name">
                <el-input v-model="form.name" placeholder="料品名称"></el-input>
              </el-form-item>
              <el-form-item label="料品规格" prop="material_specification">
                <el-input v-model="form.material_specification" placeholder="料品规格"></el-input>
              </el-form-item>
              <el-form-item label="单位" prop="unit">
                <el-input v-model="form.unit" placeholder="单位"></el-input>
              </el-form-item>
              <el-form-item label="材质" prop="material_quality">
                <el-input v-model="form.material_quality" placeholder="材质"></el-input>
              </el-form-item>
              <el-form-item label="长度" prop="length">
                <el-input v-model="form.length" placeholder="长度"></el-input>
              </el-form-item>
              <el-form-item label="宽度" prop="width">
                <el-input v-model="form.width" placeholder="宽度"></el-input>
              </el-form-item>
              <el-form-item label="高度" prop="height">
                <el-input v-model="form.height" placeholder="高度"></el-input>
              </el-form-item>
              <el-form-item label="重量" prop="weight">
                <el-input v-model="form.weight" placeholder="重量"></el-input>
              </el-form-item>
              <el-form-item label="采购单位" prop="purchase_unit">
                <el-input v-model="form.purchase_unit" placeholder="采购单位"></el-input>
              </el-form-item>
              <el-form-item label="销售单位" prop="sales_unit">
                <el-input v-model="form.sales_unit" placeholder="销售单位"></el-input>
              </el-form-item>
              <el-form-item label="Bom单位" prop="bom_unit">
                <el-input v-model="form.bom_unit" placeholder="Bom单位"></el-input>
              </el-form-item>
              <el-form-item label="子料编码" prop="relaCoding">
                <el-input v-model="form.relaCoding" placeholder="关联子料编码">
                  <el-button 
                    slot="suffix" 
                    size="mini" 
                    icon="el-icon-arrow-down" 
                    style="border: none;"
                    @click="materialModal = !materialModal"
                  ></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="拼音码" prop="pinyin_code">
                <el-input v-model="form.pinyin_code" placeholder="拼音码"></el-input>
              </el-form-item>
              <el-form-item label="图档号" prop="picture_number">
                <el-input v-model="form.picture_number" placeholder="图档号"></el-input>
              </el-form-item>
              <el-form-item label="生产厂家" prop="producer">
                <el-input v-model="form.producer" placeholder="生产厂家"></el-input>
              </el-form-item>
              <el-form-item label="品牌" prop="brand">
                <el-input v-model="form.brand" placeholder="品牌"></el-input>
              </el-form-item>
              <el-form-item label="模具号" prop="mold_number">
                <el-input v-model="form.mold_number" placeholder="模具号"></el-input>
              </el-form-item>
              <el-form-item label="标准型号" prop="standard_model">
                <el-input v-model="form.standard_model" placeholder="标准型号"></el-input>
              </el-form-item>
              <el-form-item label="料品等级" prop="material_level">
                <el-input v-model="form.material_level" placeholder="料品等级"></el-input>
              </el-form-item>
              <el-form-item label="是否需检" prop="check">
                <el-radio-group v-model="form.check">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="仓库" prop="respository">
                <el-select v-model="form.respository">
                  <el-option
                    v-for="item in storeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生产工时" prop="product_hour">
                <el-select v-model="form.product_hour">
                  <el-option
                    v-for="item in hourList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <div class="widthFull"></div>
              <el-form-item class="widthHalf" label="料品属性" prop="attributes">
                <el-checkbox-group v-model="form.attributes">
                  <el-checkbox
                    v-for="item in attrList"
                    :key="item.id"
                    :label="item.id"
                  >{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item class="widthHalf" style="width: 40%;" label="料品类别" prop="material_category">
                <el-checkbox-group v-model="form.material_category">
                  <el-checkbox
                    v-for="item in categoriesList"
                    :key="item.id"
                    :label="item.id"
                  >{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item class="widthHalf" label="料品分类">
                <el-select v-model="form.classification">
                  <el-option
                    v-for="item in classList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  ></el-option>
                </el-select>
                <el-button type="info" size="mini" @click="addClass">新增</el-button>
              </el-form-item>
              <el-form-item label="工程图号" prop="project_drawing_number">
                <el-input v-model="form.project_drawing_number" placeholder="工程图号"></el-input>
              </el-form-item>
              <el-form-item label="加工图" prop="drawing_working">
                <el-upload action="aaa" :before-upload="upload" :file-list="drawing_working">
                  <el-button size="mini" type="info" @click="uploadType = 1">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="组装图" prop="assembly_drawing">
                <el-upload action="aaa" :before-upload="upload" :file-list="assembly_drawing">
                  <el-button size="mini" type="info" @click="uploadType = 2">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="承认图" prop="drawing_approve">
                <el-upload action="aaa" :before-upload="upload" :file-list="drawing_approve">
                  <el-button size="mini" type="info" @click="uploadType = 3">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="图片" prop="image">
                <el-upload action="aaa" :before-upload="upload" :file-list="image">
                  <el-button size="mini" type="info" @click="uploadType = 4">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="2d图纸" prop="drawing_2d">
                <el-upload action="aaa" :before-upload="upload" :file-list="drawing_2d">
                  <el-button size="mini" type="info" @click="uploadType = 5">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="3d图纸" prop="drawing_3d">
                <el-upload action="aaa" :before-upload="upload" :file-list="drawing_3d">
                  <el-button size="mini" type="info" @click="uploadType = 6">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="pdf图纸" prop="drawing_pdf">
                <el-upload action="aaa" :before-upload="upload" :file-list="drawing_pdf">
                  <el-button size="mini" type="info" @click="uploadType = 7">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
          <div class="modal-footer">
            <el-button type="info" size="mini" data-dismiss="modal">取消</el-button>
            <el-button type="info" size="mini" @click="submit">保存</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 料品列表 -->
    <div class="modal fade materList" role="dialog" >
      <div class="modal-dialog" role="document" style="width: 100%;max-width: 1280px;">
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
            <el-table-column prop="image" label="图片" width="400px">
              <template slot-scope="{ row }">
                <p style="white-space: nowrap;" v-for="(e, k) in row.image" :key="k"><a :href="e" target="_blank"> {{ e.split('/').pop() }} </a></p>
              </template>
            </el-table-column>
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
  name: "addMaterial",
  data() {
    return {
      form: {
        name: "",
        material_specification: "",
        length: "",
        check: 1,
        relaCoding: '',
        parent_id: [], // 子料id
        attributes: [],
        material_category: [],
        drawing_working_ids: "",
        assembly_drawing_ids: "",
        drawing_approve_ids: "",
        image_ids: "",
        drawing_2d_ids: "",
        drawing_3d_ids: "",
        drawing_pdf_ids: ""
      },
      rules: {
        name: [{ required: true, message: "请输入料品名称", trigger: "blur" }],
        material_specification: [
          { required: true, message: "请输入料品规格", trigger: "blur" }
        ],
        length: [
          { message: "请输入长度, 并且为数字", trigger: "blur" }
        ],
        respository: [
          { required: true, message: "请选择仓库", trigger: "change" }
        ]
      },
      drawing_working: [],
      assembly_drawing: [],
      drawing_approve: [],
      image: [],
      drawing_2d: [],
      drawing_3d: [],
      drawing_pdf: [],

      uploadType: 0,
      storeList: [],
      attrList: [
        {
          id: 1,
          name: "原材料"
        },
        {
          id: 2,
          name: "半成品"
        },
        {
          id: 3,
          name: "成品"
        }
      ],
      categoriesList: [
        {
          id: 1,
          name: "采购件"
        },
        {
          id: 2,
          name: "自制件"
        },
        {
          id: 3,
          name: "委外件"
        },
        {
          id: 4,
          name: "销售件"
        }
      ],
      classList: [],
      hourList: [],

      materialModal: false,
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
    getStore() {
      this.$get(`respositories/list`)
        .then(response => {
          if (response.status != 200) return false;
          this.storeList = response.data.list;
        })
        .catch(err => console.error(err));
    },
    getClass() {
      this
        .$get(`repositories/material/classification`)
        .then(response => {
          if (response.status != 200) return false;
          this.classList = response.data.list;
        })
        .catch(e => console.error(e));
    },
    getHour() {
      this
        .$get(`schedule/product/hour`)
        .then(response => {
          if (response.status != 200) return false;
          this.hourList = response.data.list.map(e => {
            return {
              id: e.id,
              name: `${e.name}, 发单：${e.billing}H, 拆分：${e.split}H, 委外备料：${e.outside_preparation}H, 质检：${e.incoming_quality_inspection}H, 组装：${e.assembly}H, 成品质检：${e.finished_product_quality_inspection}H, 打包：${e.packaging}H, 入库：${e.storage}H, 发货：${e.shipping}H`
            }
          })
        })
        .catch(e => console.error(e));
    },
    getFileslist() {
      this.$get(`files/folders`)
        .then(response => {
          if (response.status != 200) return false;
          console.log(response);
        })
        .catch(err => console.error(err));
    },
    addClass() {
      this
        .$prompt('分类名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(({ value }) => {
          this
            .$post(`repositories/material/classification/create`, {
              name: value
            })
            .then(response => {
              if (response.status != 200) return false;
              this.classList.unshift({
                id: response.data.id,
                name: value
              });
            })
            .catch(e => console.error(e));
        });
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
          $("#purchaseApply .materList").modal("show");
        })
        .catch(err => loading.close());
    },
    materChange(val) {
      this.mater.selection = val;
    },
    addMater() {
      this.form.relaCoding = this.mater.selection.map(e => {
        this.form.parent_id.push(e.id);
        return e.material_number;
      })
      .join(',');
      this.materialModal = !this.materialModal;
    },
    submit() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
        this.$post(`respositories/materials/create`, {
          ...this.form,
          parent_id: this.form.parent_id.join(','),
          attribute: this.form.attributes.join(','),
          category: this.form.material_category.join(',')
        })
          .then(response => {
            if (response.status != 200) return false;
            this.$emit("refresh");
            $("#material #addMaterial").modal("hide");
            this.$refs["form"].resetFields();
            this.clearForm();
          })
          .catch(err => console.error(err));
      });
    },
    clearForm() {
      this.drawing_working = [];
      this.assembly_drawing = [];
      this.drawing_approve = [];
      this.image = [];
      this.drawing_2d = [];
      this.drawing_3d = [];
      this.drawing_pdf = [];
    },
    upload(file) {
      let form = new FormData(),
        that = this,
        param = "",
        type = {
          1: () => (param = "drawing_working"),
          2: () => (param = "assembly_drawing"),
          3: () => (param = "drawing_approve"),
          4: () => (param = "image"),
          5: () => (param = "drawing_2d"),
          6: () => (param = "drawing_3d"),
          7: () => (param = "drawing_pdf")
        };
      form.append("upload", file);
      form.append("slug", "repository_material");
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          type[that.uploadType]();
          that[param].push({
            name: file.name,
            url: response.data.url
          });
          if (that.form[`${param}_ids`] == "") that.form[`${param}_ids`] = [];
          else that.form[`${param}_ids`] = that.form[`${param}_ids`].split(',');
          that.form[`${param}_ids`].push(response.data.upload.id);
          that.form[`${param}_ids`] = that.form[`${param}_ids`].join(',');
        })
        .catch(err => console.error(err));
    }
  },
  watch: {
    materialModal(val) {
      if (val && !this.mater.data.length)
        this.getMater();
      $("#material .materList").modal('toggle');
    }
  },
  mounted() {
    this.getStore();
    this.getClass();
    this.getHour();
    // this.getFileslist();
  }
};
</script>
<style lang="less">
#addMaterial {
  .modal-body {
    padding: 30px;
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 25%;
        .el-upload__input {
          display: none;
        }
      }
      .widthHalf {
        width: 30%;
      }
      .widthFull {
        width: 100%;
      }
    }
  }
  .modal-footer {
    text-align: center;
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
