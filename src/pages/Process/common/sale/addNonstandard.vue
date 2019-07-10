<template>
  <div id="addNonstandard" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document" style="width: 900px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" ref="form" :rules="rule" size="mini" label-width="100px">
            <el-form-item class="widthFull" label="选择模板">
              <el-select 
                v-model="choice"
                filterable remote 
                :filter-method="search"
                @change="changModal">
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户公司名">
              <el-select v-model="form.customer_id" @change="cusId">
                <el-option v-for="item in customers" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系人">
              <el-input v-model="form.linkman"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="职位">
              <el-input v-model="form.position"></el-input>
            </el-form-item>
            <el-form-item label="询价描述">
              <el-input v-model="form.demand"></el-input>
            </el-form-item>
            <el-form-item label="询价附件">
              <el-upload
                action="a"
                :before-upload="upload"
                :on-remove="remove"
                :file-list="form.fileUrl"
                list-type="picture">
                <el-button size="mini" type="primary" @click="key = -1">上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item v-for="(item, index) in form.param" :key="index" :label="item.label">
              <el-input v-if="item.type == 1" v-model="item.enter"></el-input>
              <el-radio-group v-else-if="item.type == 2" v-model="item.enter">
                <el-radio v-for="(v, k) in item.value" :key="k" :label="v"></el-radio>
              </el-radio-group>
              <el-checkbox-group v-else-if="item.type == 3" v-model="item.enter">
                <el-checkbox v-for="(v, k) in item.value" :key="k" :label="v" @change="cbgc(index, v)"></el-checkbox>
              </el-checkbox-group>
              <el-select v-else-if="item.type == 4" v-model="item.enter">
                <el-option v-for="(v, k) in item.value" :key="k" :label="v" :value="v"></el-option>
              </el-select>
              <el-input v-else-if="item.type == 5" v-model="item.enter" type="textarea"></el-input>
              <el-upload
                v-else-if="item.type == 6"
                action="a"
                :before-upload="upload"
                :on-remove="remove"
                :file-list="item.fileUrl"
                list-type="picture">
                <el-button size="small" type="primary" @click="key = index">上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button data-dismiss="modal" size="mini" >取消</el-button>
          <el-button type="primary" size="mini" @click="onSubmit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addNonstandard",
  data() {
    return {
      choice: {},
      form: {
        customer_id: "",
        linkman: "",
        mobile: "",
        position: "",
        demand: "",
        file_ids: [],
        fileUrl: [],
        param: []
      },
      rule: {},
      options: [],
      customers: []
    };
  },
  props: {
    row: Object
  },
  methods: {
    upload(file) {
      let form = new FormData(), fileUrl = null, ids = null;
      form.append("upload", file);
      form.append("slug", "non_standard_requirements");
      switch(this.key) {
        case -1:
          fileUrl = this.form.fileUrl;
          ids = this.form.file_ids;
          break;
        default:
          if (typeof this.form.param[this.key].fileUrl != 'object') {
            this.form.param[this.key].fileUrl = [];
            this.form.param[this.key].enter = [];
          }
          fileUrl = this.form.param[this.key].fileUrl;
          ids = this.form.param[this.key].enter;
          break;
      }
      this
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          fileUrl.push({
            name: file.name,
            uid: response.data.upload.id,
            url: response.data.url
          });
          ids.push(response.data.upload.id);
          this.form.param.push({ label: "", type: 2, value: [] });
          this.form.param.pop();
        })
        .catch(err => console.error(err));
    },
    remove(val) {
    },
    search(val) {
      this
        .$get(`orders/inquiry-template`, {
          name: val
        })
        .then(response => {
          if (response.status != 200) return false;
          this.options = response.data.list;
        })
        .catch(e => console.error(e));
    },
    changModal(val) {
      this.form.param = val.data;
    },
    cbgc(index, val) {
      if (typeof this.form.param[index].enter != 'object') this.form.param[index].enter = [val];
    },
    getCustomer() {
      this.$get(`customers/list`).then(response => {
        if (response.status != 200) return false;
        this.customers = response.data.list;
      }).catch(e => console.error(e));
    },
    cusId(val) {
      let contact = this.customers.onArray(val, 'id', 'contact').pop();
      this.form.customer_id = val;
      this.form.linkman = contact.name;
      this.form.mobile = contact.mobile;
      this.form.position = contact.position;
    },
    onSubmit() {
      this.$refs["form"].validate(v => {
        if (!v) return fasle;
        let url = this.row.id ? `orders/inquiry-price/edit/${this.row.id}` : `orders/inquiry-price/create`;
        this
          .$post(url,{
            customer_id: this.form.customer_id,
            demand: this.form.demand,
            linkman: this.form.linkman,
            mobile: this.form.mobile,
            position: this.form.position,
            param: JSON.stringify(this.form.param),
            file_ids: this.form.file_ids.join(','),
          })
          .then(response => {
            if (response.status != 200) return false;
            this.$emit('refresh');
            $("#nonstandard #addNonstandard").modal("hide");
            this.clearForm();
          })
          .catch(e => console.error(e));
      });
    },
    clearForm() {
      this.choice = {},
      this.form = {
        customer_id: "",
        linkman: "",
        mobile: "",
        position: "",
        demand: "",
        file_ids: [],
        fileUrl: [],
        param: []
      }
    }
  },
  mounted() {
    this.getCustomer();
    $("#nonstandard #addNonstandard").on("shown.bs.modal", () => {
      if (this.row.id) {
        this.form.customer_id = this.row.customer_id;
        this.form.linkman = this.row.linkman;
        this.form.mobile = this.row.mobile;
        this.form.position = this.row.position;
        this.form.demand = this.row.demand;
        this.form.param = this.row.param;
        this.form.file_ids = [];
        this.form.fileUrl = [];
        this.row.images.forEach(e => {
          let name = e.url.split('/').pop();
          this.form.file_ids.push(e.id);
          this.form.fileUrl.push({
            name: name,
            uid: e.id,
            url: e.url
          });
        })
      } else 
        this.form = {
          customer_id: "",
          linkman: "",
          mobile: "",
          position: "",
          demand: "",
          file_ids: [],
          fileUrl: [],
          param: []
        }
    })
  }
};
</script>
<style lang="less">
#addNonstandard {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 50%;
    }
    .widthFull {
      width: 100%;
    }
  }
  .el-upload {
    input[type="file"] {
      display: none;
    }
  }
}
</style>
