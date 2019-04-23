<template>
<div>
  <div class="modal fade" id="editApplication" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            size="mini"
            label-position="left"
            label-width="100px"
          >
            <el-form-item label="客户公司名" prop="customer_company_name">
              <el-input v-model="form.customer_company_name"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="form.linkman"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="客服地址" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-form>
          <el-table :data="form.item" border stripe>
            <el-table-column label="序号" width="50">
              <template slot-scope="{ $index }">
                <span>{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="销售订单编号">
              <template slot-scope="{ row }">
                <el-input v-model="row.order_number" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="产品SN码">
              <template slot-scope="{ row }">
                <el-input v-model="row.sn" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料品编码">
              <template slot-scope="{ row }">
                <el-input v-model="row.code" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料品规格">
              <template slot-scope="{ row }">
                <el-input v-model="row.specification" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料品名称">
              <template slot-scope="{ row }">
                <el-input v-model="row.name" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="出货日期">
              <template slot-scope="{ row }">
                <el-input v-model="row.date" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="是否过保">
              <template slot-scope="{ row }">
                <el-select v-model="row.id" size="mini">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="客服问题描述">
              <template slot-scope="{ row }">
                <el-input v-model="row.desc" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="图片" width="170">
              <template slot-scope="{ row }">
                <el-upload 
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card"
                  :before-upload="a"
                  :on-remove="a"
                  :on-preview="show"
                  multiple
                  :file-list="row.img">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="{ $index }">
                <el-button type="text" @click="form.item.splice($index, 1)">
                  <i class="el-icon-delete" style="font-size: 2.1rem;"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="default" size="small" style="width: 100%;" @click="form.item.push({})">
            <i class="el-icon-plus"></i>
          </el-button>
        </div>
        <div class="modal-footer">
          <el-button type="info" size="mini" data-dismiss="modal">取消</el-button>
          <el-button type="info" size="mini" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
  <el-dialog :visible.sync="dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
</div>
</template>
<script>
export default {
  name: "editApplication",
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      form: {
        item: [{}]
      },
      rules: {
        customer_company_name: [
          { required: true, message: "请填写", trigger: "blur" }
        ],
        linkman: [{ required: true, message: "请填写", trigger: "blur" }],
        mobile: [{ required: true, message: "请填写", trigger: "blur" }],
        address: [{ required: true, message: "请填写", trigger: "blur" }]
      }
    };
  },
  methods: {
    show(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    a() {},
    onSubmit() {},
  },
  mounted() {}
};
</script>
<style lang="less">
#editApplication {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 25%;
      padding-left: 5px;
      padding-right: 5px;
      &:last-child {
        width: 100%;
      }
    }
  }
  .el-table {
    .el-table__body-wrapper {
      .el-table__body {
        .el-table__row {
          td {
            &:nth-child(10) {
              padding: 0;
              .cell {
                .el-upload-list {
                  .el-upload-list__item {
                    width: 50%;
                    height: auto;
                    margin: 0;
                  }
                }
                .el-upload {
                  border: none;
                  width: 82px;
                  height: 32px;
                  line-height: 30px;
                  .el-upload__input {
                    display: none;
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
