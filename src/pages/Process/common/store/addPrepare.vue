<template>
  <div>
    <div class="modal fade" id="addPrepare" role="dialog">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
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
    <div class="modal fade lockCar" role="dialog">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
          <el-table :data="[]" border stripe>
            <el-table-column prop="" label="物料编码"></el-table-column>
            <el-table-column prop="" label="物料规格"></el-table-column>
            <el-table-column prop="" label="物料名称"></el-table-column>
            <el-table-column prop="" label="数量"></el-table-column>
            <el-table-column prop="" label="仓库"></el-table-column>
            <el-table-column prop="" label="可用数量"></el-table-column>
            <el-table-column prop="" label="单位"></el-table-column>
            <el-table-column prop="" label="转入仓库"></el-table-column>
            <el-table-column prop="" label="物料车编号"></el-table-column>
            <el-table-column prop="" label="备料数量"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addPrepare",
  data() {
    return {
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
        })
        .catch(err => loading.close());
    },
    materChange(val) {
      this.mater.selection = val;
    },
    // 当选择数较多并且没有 requset_id 过滤
    addMater() {
      console.log(this.mater.selection)
    }
  },
  mounted() {
    this.getMater();
  }
}
</script>
<style lang="less">
#addPrepare {
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
