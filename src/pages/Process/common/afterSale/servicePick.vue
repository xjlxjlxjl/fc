<template>
  <div class="modal fade" id="servicePick" role="dialog">
    <div class="modal-dialog" role="document" style="width: 980px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" :rules="rules" ref="form" size="mini" label-position="left" label-width="100px">
            <el-form-item label="客服单号" prop="order_number">
              <el-input v-model="form.order_number"></el-input>
            </el-form-item>
            <el-form-item label="客户公司名" prop="customer_company_name">
              <el-input v-model="form.customer_company_name"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="customer_linkman">
              <el-input v-model="form.customer_linkman"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remark" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
          <el-table :data="form.materials" border stripe>
            <el-table-column label="序号" width="50">
              <template slot-scope="{ $index }">
                <span>{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-for="col in columns"
              :prop="col.value"
              :key="col.key"
              :label="col.label">
              <template slot-scope="{ row }">
                <el-input size="mini" v-model="row[col.value]" @blur="row.isEdit = true"></el-input>
              </template>
            </el-table-column>
            <el-table-column width="50">
              <template slot-scope="{ $index, row }">
                <el-button type="text" @click="delItem(row.id, $index);">
                  <i class="el-icon-delete" style="font-size: 2.1rem;"></i>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button type="default" size="small" style="width: 100%;" @click="form.materials.push({})">
            <i class="el-icon-plus"></i>
          </el-button>
        </div>
        <div class="modal-footer" style="text-align: center;">
          <el-button type="info" size="small" data-dismiss="modal">取消</el-button>
          <el-button type="info" size="small" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "servicePick",
  data() {
    return {
      form: {
        materials: []
      },
      rules: {
        order_number: [{ required: true, message: "请填写客服单号", trigger: "blur" }],
        customer_company_name: [{ required: true, message: "请填写客户公司名", trigger: "blur" }],
        customer_linkman: [{ required: true, message: "请填写联系人", trigger: "blur" }],
        phone: [{ required: true, message: "请填写联系方式", trigger: "blur" }],
      },
      columns: [
        {
          label: "料品编码",
          value: "material_number",
          key: 1
        },
        {
          label: "料品规格",
          value: "material_specification",
          key: 2
        },
        {
          label: "料品名称",
          value: "material_name",
          key: 3
        },
        {
          label: "单位",
          value: "unit",
          key: 4
        },
        {
          label: "数量",
          value: "quantity",
          key: 5
        },
      ]
    };
  },
  props: {
    type: String,
    active: Object
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate(v => {
        if(!v) return false;
        let url = '',
          arr = [];

        switch (this.type) {
          case "1":
            url = `service/receive_material/create`;
            break;
          case "2":
            url = `service/receive_material/${this.active.id}/edit`;
            this.form.materials.forEach((e, k) => {
              if (e.id) {
                if (e.isEdit) this.editItems(e.id, e);
              } else arr.push(e);
            });
            this.form.materials = arr;
            break;
        }
        this
          .$post(url, this.form)
          .then(response => {
            if (response.status != 200) return false;
            $("#servicePick").modal("hide");
            this.clearForm();
          })
          .catch(e => console.error(e));
      })
    },
    clearForm() {
      this.form = {
        service_id: 0,
        quoted_price_id: 0,
        order_number: '',
        customer_company_name: '',
        customer_linkman: '',
        phone: '',
        materials: []
      }
    },
    delItem(id, $index) {
      if (id){
        this
          .$get(`service/receive_material/${this.active.id}/item/${id}/delete`)
          .then(response => {
            if (response.status != 200) return false;
            this.form.materials.splice($index, 1);
          })
          .catch(e => console.error(e));
      } else this.form.materials.splice($index, 1);
    },
    editItems(id, data) {
      if (id) 
        this
          .$post(`service/receive_material/${this.active.id}/item/${id}/edit`, data)
          .then(response => {
            if (response.status != 200) return false;
          })
          .catch(e => console.error(e));
    }
  },
  mounted() {
    const that = this;
    $("#servicePick").on("shown.bs.modal", function() {
      that.form = {
        service_id: that.active.service_id,
        order_number: that.active.quoted_price_number || that.active.service_number,
        customer_company_name: that.active.customer_company_name,
        customer_linkman: that.active.linkman || that.active.customer_linkman,
        phone: that.active.phone,
        materials: that.active.items
      }
      switch (that.type) {
        case '1':
          that.form.quoted_price_id = that.active.id;
          break;
        case '2':
          break;
      }
    });
  }
}
</script>
<style lang="less">
#servicePick {
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
      .el-input__inner {
        border: none;
      }
    }
  }
}
</style>
