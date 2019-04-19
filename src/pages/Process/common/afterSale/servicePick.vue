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
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="form.linkman"></el-input>
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remark" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
          <el-table :data="form.item" border stripe>
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
              <template slot-scope="{row}">
                <el-input size="mini" v-model="row[col.value]"></el-input>
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
        item: []
      },
      rules: {
        order_number: [{ required: true, message: "请填写客服单号", trigger: "blur" }],
        customer_company_name: [{ required: true, message: "请填写客户公司名", trigger: "blur" }],
        linkman: [{ required: true, message: "请填写联系人", trigger: "blur" }],
        mobile: [{ required: true, message: "请填写联系方式", trigger: "blur" }],
      },
      columns: [
        {
          label: "料品编码",
          value: "code",
          key: 1
        },
        {
          label: "料品规格",
          value: "specification",
          key: 2
        },
        {
          label: "料品名称",
          value: "name",
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
    active: Object
  },
  methods: {
    onSubmit() {
      this.$refs["form"].validate(v => {
        if(!v) return false;
        console.log(this.form)
      })
    }
  },
  mounted() {
    const that = this;
    $("#application #servicePick").on("shown.bs.modal", function() {
      that.form = that.active;
      that.form.item.forEach((e, k) => {
        if(!e.code) that.form.item.splice(k, 1);
      })
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
