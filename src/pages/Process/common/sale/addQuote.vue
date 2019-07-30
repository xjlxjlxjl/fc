<template>
  <div class="modal fade" id="addQuote" role="dialog">
    <div class="modal-dialog" role="document" style="max-width: 1280px;width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <p class="lead">基本信息</p>
          <el-form :model="form" ref="form" size="mini" label-width="100px">
            <el-form-item label="客户名称">
              <el-select v-model="form.customer_id" filterable remote placeholder="请输入" :remote-method="remoteMethod" @change="getContact">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系人">
              <el-input v-model="form.linkman"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="报价有效期">
              <el-date-picker v-model="form.validity" value-format="yyyy-MM-dd" type="date"></el-date-picker>
            </el-form-item>
            <el-form-item label="币别">
              <el-input v-model="form.currency"></el-input>
            </el-form-item>
            <el-form-item label="客户来源">
              <el-input v-model="form.source"></el-input>
            </el-form-item>
          </el-form>
          <p class="lead">产品信息</p>
          <el-table :data="form.items" border stripe>
            <el-table-column label="序号" width="50">
              <template slot-scope="{ $index }">
                {{ $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="产品名称">
              <template slot-scope="{ row }">
                <!-- <el-select v-model="row.material_id" filterable remote size="mini" placeholder="请输入" :remote-method="getMaterial" @change="chioceMaterial">
                  <el-option 
                    v-for="item in material_options" 
                    :key="item.id" 
                    :label="'名称：' + item.name + '｜规格：' + item.material_specification + '｜单位：' + item.item_unit" 
                    :value="item.id"
                    @click="key = $index"
                  ></el-option>
                </el-select> -->
                <el-input v-model="row.name" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="产品规格型号">
              <template slot-scope="{ row }">
                <el-input v-model="row.model" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量">
              <template slot-scope="{ row }">
                <el-input-number v-model="row.quantity" size="mini" :min="1"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="单位">
              <template slot-scope="{ row }">
                <el-input v-model="row.unit" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价">
              <template slot-scope="{ row }">
                <el-input-number v-model="row.price" size="mini" :min="0"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="产品需求描述">
              <template slot-scope="{ row }">
                <el-input v-model="row.description" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="" width="50">
              <template slot-scope="{ $index }">
                <el-button type="text" icon="el-icon-delete" @click="form.items.splice($index, 1)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="mini" @click="form.items.push({})" style="width: 100%;" icon="el-icon-plus"></el-button>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" @click="onSubmit">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addQuote",
  data() {
    return {
      form: {
        customer_id: "",
        linkman: "",
        mobile: "",
        address: "",
        validity: "",
        currency: "",
        source: "",
        items: []
      },
      options: [],
      material_options: [],
      key: 0
    };
  },
  props: {
    row: {
      type: Object
    }
  },
  methods: {
    remoteMethod(params) {
      this
        .$get(`customers/list`, { name: params })
        .then(response => {
          if (response.status != 200) return false;
          this.options = response.data.list;
        })
        .catch(e => console.error(e));
    },
    getContact(val) {
      let 
        company = this.options.find(e => e.id == val),
        people = company.contact.length ? company.contact[0] : { mobile: "", name: "" };

      this.form.linkman = people.name;
      this.form.mobile = people.mobile;
    },
    getMaterial(params) {
      this
        .$get(`respositories/materials/list`, { name: params })
        .then(response => {
          if (response.status != 200) return false;
          this.material_options = response.data.list;
        })
        .catch(e => console.error(e));
    },
    chioceMaterial(val) {
      let stuff = this.material_options.find(e => e.id == val);
      this.form.items[this.key].material_specification = stuff.material_specification;
      this.form.items[this.key].item_unit = stuff.item_unit;
    },
    onSubmit() {
      this
        .$post(this.row.id ? `orders/sales/quoted_price/edit/${this.row.id}` : `orders/sales/quoted_price/create`, this.form)
        .then(response => {
          if (response.status != 200) return false;
          this.$emit('refresh');
          $("#offer #addQuote").modal("hide");
          this.clearForm();
        })
        .catch(e => console.error(e));
    },
    clearForm() {
      this.form = {
        customer_id: "",
        linkman: "",
        mobile: "",
        address: "",
        validity: "",
        currency: "",
        source: "",
        items: []
      };
    }
  },
  mounted() {
    $("#offer #addQuote").on('shown.bs.modal', () => {
      if (this.row.id) {
        this.form = {
          customer_id: this.row.customer.id,
          linkman: this.row.linkman,
          mobile: this.row.mobile,
          address: this.row.address,
          validity: this.row.validity,
          currency: this.row.currency,
          source: this.row.source,
          items: this.row.items.map(e => {
            return {
              id: e.id,
              name: e.name,
              model: e.model,
              quantity: e.quantity,
              unit: e.unit,
              price: e.price,
              description: e.description,
            }
          })
        }
      }
    });
    $("#offer #addQuote").on('hiden.bs.modal', () => {
      if (this.row.id) this.clearForm();
    })
  }
}
</script>
<style lang="less">
#addQuote {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 25%;
    }
  }
}
</style>
