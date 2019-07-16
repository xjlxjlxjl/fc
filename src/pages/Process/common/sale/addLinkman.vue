<template>
  <div class="modal fade" id="addLinkman" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" ref="form" size="mini" label-width="80px">
            <el-form-item label="联系人">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="职务">
              <el-input v-model="form.position"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button type="primary" @click="onSubmit">确定</el-button>
          <el-button data-dismiss="modal">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {}
    };
  },
  props: {
    slug: String,
    contact: Array
  },
  methods: {
    onSubmit() {
      let json = [];
      for (const e of this.contact) json.unshift(e);
      json.unshift(this.form);
      this
        .$post(`customers/edit`, {
          slug: this.slug,
          contact: JSON.stringify(json)
        })
        .then(response => {
          if (response.status != 200) return false;
          this.contact.unshift(this.form);
          this.$emit('change');
          this.clearForm();
        })
        .catch(e => console.error(e));
    },
    clearForm() {
      this.form = {};
      $("#nonstandard #addLinkman").modal("hide");
    }
  }
}
</script>
<style lang="less">
#addLinkman {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 50%;
    }
  }
}
</style>