<template>
  <div id="baleRecord" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" ref="form" label-width="80px">
            <el-form-item label="备注">
              <el-upload
                action="a"
                :before-upload="upload"
                :before-remove="remove"
                :file-list="form.images_url">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="form.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button size="mini" data-dismiss="modal">取消</el-button>
          <el-button size="mini" @click="onSubmit">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "baleRecord",
  data() {
    return {
      form: {
        images: [],
        images_url: []
      }
    };
  },
  props: {
    id: Number
  },
  methods: {
    upload(file) {
      let form = new FormData();
      form.append("upload", file);
      form.append("slug", "bale_images");
      this
        .$upload(`files/upload`, form)
        .then(response => {
          if (response.status != 200) return false;
          this.form.images.push(response.data.upload.id);
          this.form.images_url.push({
            name: file.name,
            url: response.data.url,
            uid: response.data.upload.id
          });
        })
        .catch(err => console.error(err));
    },
    remove(data) {
      this.form.images.forEach((e, k) => {
        if (e == data.uid) {
          this.form.images.splice(k, 1);
          this.form.images_url.splice(k, 1);
        }
      });
    },
    onSubmit() {
      this
        .$post(`produces/bale/edit`, {
          id: this.id,
          remark: this.form.remark,
          images: this.form.images.join(',')
        })
        .then(response => {
          if (response.status != 200) return false;
          this.clearForm();
        })
        .catch(e => console.error(e));
    },
    clearForm() {
      this.form = {
        images: [],
        images_url: []
      };
      $("#bale #baleRecord").modal("hide");
    }
  }
}
</script>
<style lang="less">
#baleRecord {
  input[type="file"] {
    display: none;
  }
}
</style>
