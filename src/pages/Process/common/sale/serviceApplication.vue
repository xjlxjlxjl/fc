<template>
  <div id="serviceApplication" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" :rules="rules" ref="form" size="mini" label-position="left" label-width="100px">
            <el-form-item label="客户公司名" prop="customer_company_name">
              <el-input v-model="form.customer_company_name"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="customer_linkman">
              <el-input v-model="form.customer_linkman"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="customer_contact">
              <el-input v-model="form.customer_contact"></el-input>
            </el-form-item>
            <el-form-item label="客服地址" prop="customer_other_contact">
              <el-input v-model="form.customer_other_contact"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-form>
          <el-table :data="form.orders" border stripe>
            <el-table-column label="序号" width="50">
              <template slot-scope="{ $index }">
                <span>{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="销售订单编号">
              <template slot-scope="{ row }">
                <el-input v-model="row.order_no" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="产品SN码">
              <template slot-scope="{ row }">
                <el-input v-model="row.product_sn" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料品编码">
              <template slot-scope="{ row }">
                <el-input v-model="row.material_code" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料品规格">
              <template slot-scope="{ row }">
                <el-input v-model="row.material_specification" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料品名称">
              <template slot-scope="{ row }">
                <el-input v-model="row.material_name" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="出货日期">
              <template slot-scope="{ row }">
                <el-date-picker v-model="row.ship_date" type="date" size="mini"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="是否过保">
              <template slot-scope="{ row }">
                <el-select v-model="row.is_protected" size="mini">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="客服问题描述">
              <template slot-scope="{ row }">
                <el-input v-model="row.problem" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="图片" width="170">
              <template slot-scope="{ $index, row }">
                <el-upload 
                  action="a"
                  list-type="picture-card"
                  :before-upload="upload"
                  multiple
                  :file-list="row.img">
                  <i class="el-icon-plus" @click="key = $index"></i>
                </el-upload>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="{ $index }">
                <el-button type="text" @click="form.orders.splice($index, 1)">
                  <i class="el-icon-delete" style="font-size: 2.1rem;"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="default" size="small" style="width: 100%;" @click="form.orders.push({ img: [], images: '' })">
            <i class="el-icon-plus"></i>
          </el-button>
        </div>
        <div class="modal-footer" style="text-align: center;">
          <el-button size="mini" type="info" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "serviceApplication",
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: "",
      form: {
        customer_other_contact: '',
        customer_contact: '',
        customer_linkman: '',
        customer_company_name: '',
        orders: []
      },
      rules: {
        customer_company_name: [
          { required: true, message: "请填写", trigger: "blur" }
        ],
        customer_linkman: [{ required: true, message: "请填写", trigger: "blur" }],
        customer_contact: [{ required: true, message: "请填写", trigger: "blur" }],
        customer_other_contact: [{ required: true, message: "请填写", trigger: "blur" }]
      }
    };
  },
  props: {
    row: {
      type: Object
    }
  },
  methods: {
    upload(file) {
      let form = new FormData();
      form.append("upload", file);
      form.append("slug", "repository_material");
      this
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          this.form.orders[this.key].img.push({
            name: file.name,
            url: response.data.url
          });
          if (this.form.orders[this.key].images == "") this.form.orders[this.key].images = [];
          else this.form.orders[this.key].images = this.form.orders[this.key].images.split(',');
          this.form.orders[this.key].images.push(response.data.upload.id);
          this.form.orders[this.key].images = this.form.orders[this.key].images.join(',');
        })
        .catch(err => console.error(err));
    },
    onSubmit() {
      this.$refs["form"].validate(v => {
        if(!v) return false;
        this
          .$post(`service/create`, this.form)
          .then(response => {
            if (response.status != 200) return false;
            this.$message({ message: '客服申请成功', type: 'success' });
            this.clearForm();
          })
          .catch(e => console.error(e));
      })
    },
    clearForm() {
      this.form = {
        customer_other_contact: '',
        customer_contact: '',
        customer_linkman: '',
        customer_company_name: '',
        orders: []
      };
      $("#order #serviceApplication").modal('hide');
    }
  },
  mounted() {
    $("#order #serviceApplication").on('shown.bs.modal', () => {
      this.form.customer_other_contact = this.row.address;
      this.form.customer_contact = this.row.mobile;
      this.form.customer_linkman = this.row.contract;
      this.form.customer_company_name = this.row.company_name;
      this.form.orders = this.row.items.map(e => {
        return {
          order_id: this.row.id || undefined,
          material_id: e.material_id || undefined,
          order_no: this.row.numbering || undefined,
          product_sn: e.product_sn || undefined,
          material_code: e.material_code || undefined,
          material_name: e.material_name || undefined,
          material_specification: e.material_specification || undefined,
          ship_date: e.ship_date || undefined,
          problem: e.problem || undefined,
          is_protected: e.is_protected || undefined,
          img: [],
          images: ''
        }
      })
    });
  }
}
</script>
<style lang="less">
#serviceApplication {
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
    td {
      padding-top: 5px;
      padding-bottom: 5px;
      text-align: center;
      .el-date-editor {
        width: 100%;
      }
      .el-upload-list {
        .el-upload-list__item {
          width: 68px;
          height: 68px;
          margin: 0px;
          box-sizing: border-box;
        }
      }
      .el-upload--picture-card {
        width: 68px;
        height: 68px;
        line-height: 68px;
        box-sizing: border-box;
        input[type=file] {
          display: none;
        }
      }
    }
  }
}
</style>
