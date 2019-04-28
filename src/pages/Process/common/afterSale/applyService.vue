<template>
  <div class="modal fade" id="applyService">
    <div class="modal-dialog" role="document" style="width: 980px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <div id="quotation">
            <el-form :model="form" ref="form" :rules="rules" label-position="left" size="mini" label-width="80px">
              <el-form-item label="客服单号" prop="service_number">
                <el-input v-model="form.service_number"></el-input>
              </el-form-item>
              <el-form-item label="客户公司" prop="customer_company_name">
                <el-input v-model="form.customer_company_name"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="linkman">
                <el-input v-model="form.linkman"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="contact">
                <el-input v-model="form.contact"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" v-model="form.remark"></el-input>
              </el-form-item>
              <el-form-item label="明细" size="mini" style="margin-left: 0;">
                <el-table :data="form.orders" size="mini">
                  <el-table-column label="序号" width="50px">
                    <template slot-scope="{ $index }">
                      <span>{{ $index + 1 }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    v-for="(item,index) in tableLabel"
                    :prop="item.id"
                    :key="index"
                    :label="item.label"
                  >
                    <template slot-scope="{ row }">
                      <el-input v-model="row[item.prop]" @blur="row.isEdit = true" :placeholder="item.label" size="mini"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column width="50px">
                    <template slot-scope="{ $index, row }">
                      <el-button type="text" @click="delOrdersItem(row.id, $index)">
                        <i style="font-size: 2.1rem;" class="el-icon-delete"></i>
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
            <el-button type="default" size="mini" style="width: 100%;" @click="form.orders.push({ name: '', number: '' })">
              <i class="el-icon-plus"></i>
            </el-button>
          </div>
        </div>
        <div class="modal-footer" style="text-align: center;">
          <el-button size="mini" type="info" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="commit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "applyService",
  data() {
    return {
      form: {
        service_number: "",
        linkman: "",
        customer_company_name: "",
        contact: "",
        remark: "",
        orders: []
      },
      tableLabel: [
        { label: "料品编号", prop: "material_number" },
        { label: "规格", prop: "material_specification" },
        { label: "料品名称/费用名称", prop: "material_name" },
        { label: "单位", prop: "unit" },
        { label: "数量", prop: "quantity" }
      ],
      rules: {
        service_number: [{ required: true, message: '请填写客服单号', trigger: 'blur' }],
        customer_company_name: [{ required: true, message: '请填写客户公司名', trigger: 'blur' }],
        linkman: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
        contact: [{ required: true, message: '请填写联系电话', trigger: 'blur' }]
      }
    };
  },
  props: {
    active: Object
  },
  methods: {
    commit() {
      this.$refs['form'].validate(v => {
        if (!v) return false;
        
        let that = this,
          url = "",
          arr = [];

        if (this.active.quoted_price_number) {
          url = `service/quoted_price/edit/${this.active.id}`;
          for (const item of this.form.orders) {
            if (item.id) {
              if (item.isEdit) this.editOrdersItem(item.id, item);
            } else arr.push(item);
          }
        } else {
          url = "service/quoted_price/create";
          arr = that.form.orders;
        }
        
        that
          .$post(url, {
            service_id: that.active.id,
            linkman: that.form.linkman,
            customer_company_name: that.form.customer_company_name,
            phone: that.form.contact,
            mobile: that.form.contact,
            remark: that.form.remark,
            materials: arr
          })
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
          })
          .catch(err => console.error(err));
      })
    },
    close() {
      $("#applyService").modal("hide");
    },
    delOrdersItem(id, index) {
      if (this.active.quoted_price_number) {
        if (id) {
          this
            .$get(`service/quoted_price/${this.active.id}/item/${id}/delete`)
            .then(response => {
              if (response.status != 200) return false;
              this.form.orders.splice(index, 1);
            })
            .catch(err => console.error(err));
        } else this.form.orders.splice(index, 1);
      } else 
        this.form.orders.splice(index, 1);
    },
    editOrdersItem(id, item) {
      this
        .$post(`service/quoted_price/${this.active.id}/item/${id}/edit`, {
          material: item
        })
        .then(response => {
          if (response.status != 200) return false;
          console.log(response);
        })
        .catch(err => console.error(err));
    }
  },
  mounted() {
    const that = this;
    $('#applyService').on('shown.bs.modal', function () {
      if (that.active.id) {
        console.log(that.active)
        that.form.service_number = that.active.service_number || that.active.quoted_price_number;
        that.form.customer_company_name = that.active.customer_company_name;
        that.form.linkman = that.active.customer_linkman || that.active.linkman;
        that.form.contact = that.active.customer_contact || that.active.phone;
        that.form.remark = that.active.remark;
        that.form.orders = that.active.orders || that.active.items;
        that.form.orders.forEach(e => e.material_number = e.material_number || e.material_code);
      } else
        that.form = {
          service_number: "",
          linkman: "",
          customer_company_name: "",
          contact: "",
          remark: "",
          orders: []
        }
    })
  }
};
</script>
<style lang="less">
#applyService {
  #quotation {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 25%;
        padding-left: 5px;
        padding-right: 5px;
        &:nth-child(5) {
          width: 100%;
        }
        &:last-child {
          width: 100%;
          .el-form-item__content {
            margin-left: 0 !important;
            table {
              width: auto !important;
            }
          }
        }
      }
    }
  }
}
</style>
