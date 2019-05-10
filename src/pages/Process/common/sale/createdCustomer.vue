<template>
  <div v-if="state == 0">
    <div class="modal fade" id="createdCustomer" role="dialog">
      <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
        <div class="modal-content">
          <div class="modal-body">
            <div id="createdCustomerForm">
              <el-form :model="form" :rules="rules" label-position="left" size="mini" label-width="80px">
                <el-form-item label="客户公司" prop="customer_company_name">
                  <el-input v-model="form.customer_company_name" placeholder="客户公司"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="customer_linkman">
                  <el-input v-model="form.customer_linkman" placeholder="联系人"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="customer_contact">
                  <el-input v-model="form.customer_contact" placeholder="联系电话"></el-input>
                </el-form-item>
                <el-form-item label="客服地址" prop="customer_other_contact">
                  <el-input v-model="form.customer_other_contact" placeholder="客服地址"></el-input>
                </el-form-item>
                <el-form-item class="widthFull" label="备注">
                  <el-input type="textarea" v-model="form.remark" placeholder="备注"></el-input>
                </el-form-item>
                <el-form-item class="widthFull">
                  <el-table :data="form.orders" border stripe>
                    <el-table-column label="序号" width="50">
                      <template slot-scope="{ $index }">
                        <span>{{ $index + 1 }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="销售订单编号" width="150">
                      <template slot-scope="{ row }">
                        <el-input v-model="row.order_no" @blur="row.isEdit = true"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="产品SN码" width="150">
                      <template slot-scope="{ row }">
                        <el-input v-model="row.product_sn" @blur="row.isEdit = true"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="料品编码" width="150">
                      <template slot-scope="{ row }">
                        <el-input v-model="row.material_code" @blur="row.isEdit = true"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="料品规格" width="150">
                      <template slot-scope="{ row }">
                        <el-input v-model="row.material_specification" @blur="row.isEdit = true"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="料品名称" width="150">
                      <template slot-scope="{ row }">
                        <el-input v-model="row.material_name" @blur="row.isEdit = true"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="出货日期" width="150">
                      <template slot-scope="{ row }">
                        <el-date-picker style="width: 100%;" value-format="yyyy-MM-dd HH:mm:ss" v-model="row.ship_date" @change="row.isEdit = true;" type="date"></el-date-picker>
                      </template>
                    </el-table-column>
                    <el-table-column label="是否过保" width="100">
                      <template slot-scope="{ row }">
                        <el-select v-model="row.is_protected" @blur="row.isEdit = true">
                          <el-option label="是" :value="1"></el-option>
                          <el-option label="不是" :value="0"></el-option>
                        </el-select>
                      </template>
                    </el-table-column>
                    <el-table-column label="客服问题描述" width="350">
                      <template slot-scope="{ row }">
                        <el-input v-model="row.problem" @blur="row.isEdit = true"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="图片" width="200">
                      <template slot-scope="{ $index, row }">
                        <el-upload
                          action="a"
                          list-type="picture-card"
                          :on-preview="handlePictureCardPreview"
                          :before-upload="upload"
                          :before-remove="remove"
                          :file-list="row.fileUrl"
                        >
                          <el-button size="small" type="primary" @click="key = $index">点击上传</el-button>
                        </el-upload>
                      </template>
                    </el-table-column>
                    <el-table-column width="50">
                      <template slot-scope="{ row, $index }">
                        <el-button type="text" @click="delRow(row.id, $index)">
                          <i class="el-icon-delete" style="font-size: 2.1rem;"></i>
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button type="default" class="widthFull" @click="form.orders.push({ fileUrl: [], images: [] })">
                    <i class="el-icon-plus"></i>
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="modal-footer">
            <el-button size="mini" type="primary" @click="commit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "createdCustomer",
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      form: {
        customer_company_name: "",
        customer_linkman: "",
        customer_contact: "",
        customer_other_contact: "",
        remark: "",
        orders: [],

        number: "",
        apply_linkman: "",
        date: "",
        customer_demand: "",
        specification: "",
        code: "",
        customer_file_ids: [],
        business_file_ids: [],
        fileUrl: [],
        token: ""
      },
      rules: {
        customer_company_name: [{ required: true, message: '请输入客户公司名称', trigger: 'blur' }],
        customer_linkman: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        customer_contact: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        customer_other_contact: [{ required: true, message: '请输入客服地址', trigger: 'blur' }],
      },
      sendCodeTips: "发送验证码",
      isClick: false
    };
  },
  props: {
    number: String,
    row: Object
  },
  methods: {
    sendCode() {
      if (!this.form.customer_contact) {
        this.$message({ message: "请填写联系人手机号", type: "error" });
        return false;
      }
      let that = this;
      if (that.isClick) return false;
      that.isClick = true;
      that
        .$get(`service/send/mobile/code`, {
          mobile: that.form.customer_contact
        })
        .then(response => {
          if (response.status != 200) return false;
          that.form.token = response.data.token;
          that.sendCodeTips = 60;
          that.lock = setInterval(() => {
            if (that.sendCodeTips > 1) --that.sendCodeTips;
            else {
              clearInterval(that.lock);
              that.isClick = false;
              that.sendCodeTips = "重新发送";
            }
          }, 1000);
        })
        .catch(err => (that.isClick = false));
    },
    upload(file) {
      let form = new FormData(),
        that = this;
      form.append("slug", "customer_service");
      form.append("upload", file);
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          that.form.orders[that.key].fileUrl.push({
            name: file.name,
            uid: response.data.upload.id,
            url: response.data.url
          });
          that.form.orders[that.key].images.push(response.data.upload.id);

          that.form.orders.push({});
          that.form.orders.pop();
        })
        .catch(err => console.error(err));
    },
    remove(item) {
      for (let val of this.form.orders) {
        val.fileUrl.forEach((e, k) => {
          if (e.uid == item.uid) {
            val.fileUrl.splice(k, 1);
            val.images.splice(k, 1);
          }
        });
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    commit() {
      let that = this,
        url = '',
        params = {};
      if (this.row && this.row.id) url = `service/edit/${ this.row.id }`
      else url = `service/create`
      switch (this.state) {
        case 0:
          params.customer_company_name = this.form.customer_company_name;
          params.customer_linkman = this.form.customer_linkman;
          params.customer_contact = this.form.customer_contact;
          params.customer_other_contact = this.form.customer_other_contact;
          params.remark = this.form.remark;
          params.orders = [];
          // 判断验证
          this.form.orders.forEach(e => {
            if (e.id) {
              if (e.isEdit) {
                let data = e
                data.images = data.images.join(',');
                data.fileUrl = undefined;
                data.isEdit = undefined;
                this.editRow(e.id, data);
              }
            } else
              params.orders.push(e);
          });
          for (const item of params.orders) {
            item.images = item.images.join(',');
            item.fileUrl = undefined;
            item.isEdit = undefined;
          }
          break;
        case 1:
          params = this.form;
          for (let e of params.orders) {
            e.fileUrl = undefined;
            e.images = e.images.join(',');
          }
          break;
        default:
          break;
      }
      let loading = this.$loading({ lock: true });
      this.$post(url, params)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          if (that.state) {
            that.$message({ message: "客服申请成功，请耐心等待回复。", type: "success" });
            setTimeout(() => that.$router.go(-1), 1000);
          } else {
            that.$emit('refresh');
            that.close();
          }
        })
        .catch(err => loading.close());
    },
    editRow(id, params) {
      if (id)
        this
          .$post(`service/edit/order/${id}`, params)
          .then(response => {
            if (response.status != 200 ) return false;
            console.log(response);
          })
          .catch(err => console.error(err));
    },
    delRow(id, index) {
      if (id) {
        this
          .$get(`/service/delete/order/${id}`)
          .then(response => {
            if (response.status != 200) return false;
            this.form.orders.splice(index, 1);
            this.$emit('refresh');
          })
          .catch(err => console.error(err));
      } else 
        this.form.orders.splice(index, 1)
    },
    close() {
      $('#createdCustomer').modal("toggle");
    }
  },
  mounted() {
    const that = this;
    $('#customerServiceApplication #createdCustomer').on('shown.bs.modal', function(e) {
      console.log(that.row)
      if (that.row && that.row.id) {
        that.form.customer_company_name = that.row.customer_company_name;
        that.form.customer_linkman = that.row.customer_linkman;
        that.form.customer_contact = that.row.customer_contact;
        that.form.customer_other_contact = that.row.customer_other_contact;
        that.form.remark = that.row.remark;
        that.form.orders = [];
        that.row.orders.forEach(e => {
          let images = [],
            fileUrl = [];
            e.images_url.forEach(item => {
              images.push(item.id);
              fileUrl.push({
                name: item.url.split('/').pop(),
                uid: item.id,
                url: item.url
              });
            });
          that.form.orders.push({
            id: e.id,
            order_no: e.order_no,
            product_sn: e.product_sn,
            material_code: e.material_code,
            material_specification: e.material_specification,
            material_name: e.material_name,
            ship_date: e.ship_date,
            is_protected: e.is_protected,
            problem: e.problem,
            images: images,
            fileUrl: fileUrl
          });
        });
      } else 
        that.form = {
          customer_company_name: "",
          customer_linkman: "",
          customer_contact: "",
          customer_other_contact: "",
          remark: "",
          orders: [],

          number: "",
          apply_linkman: "",
          date: "",
          customer_demand: "",
          specification: "",
          code: "",
          customer_file_ids: [],
          business_file_ids: [],
          fileUrl: [],
          token: ""
        }
    });
    $('#application #createdCustomer').on('shown.bs.modal', function(e) {
      console.log(that.row)
      if (that.row && that.row.id) {
        that.form.customer_company_name = that.row.customer_company_name;
        that.form.customer_linkman = that.row.customer_linkman;
        that.form.customer_contact = that.row.customer_contact;
        that.form.customer_other_contact = that.row.customer_other_contact;
        that.form.remark = that.row.remark;
        that.form.orders = [];
        that.row.orders.forEach(e => {
          let images = [],
            fileUrl = [];
            e.images_url.forEach(item => {
              images.push(item.id);
              fileUrl.push({
                name: item.url.split('/').pop(),
                uid: item.id,
                url: item.url
              });
            });
          that.form.orders.push({
            id: e.id,
            order_no: e.order_no,
            product_sn: e.product_sn,
            material_code: e.material_code,
            material_specification: e.material_specification,
            material_name: e.material_name,
            ship_date: e.ship_date,
            is_protected: e.is_protected,
            problem: e.problem,
            images: images,
            fileUrl: fileUrl
          });
        });
      } else 
        that.form = {
          customer_company_name: "",
          customer_linkman: "",
          customer_contact: "",
          customer_other_contact: "",
          remark: "",
          orders: [],

          number: "",
          apply_linkman: "",
          date: "",
          customer_demand: "",
          specification: "",
          code: "",
          customer_file_ids: [],
          business_file_ids: [],
          fileUrl: [],
          token: ""
        }
    });
  },
  created() {
    this.form.number = this.number;
    switch (location.pathname) {
      case "/":
      case "/index.html":
        this.state = 1;
        break;
      default:
        this.state = 0;
        break;
    }
  }
};
</script>
<style lang="less">
#createdCustomer {
  #createdCustomerForm {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 25%;
        padding-left: 5px;
        padding-right: 5px;
        &:last-child {
          .el-form-item__content {
            margin-left: 0px !important;
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
        }
      }
      .widthFull {
        width: 100%;
      }
    }
  }
}
</style>
