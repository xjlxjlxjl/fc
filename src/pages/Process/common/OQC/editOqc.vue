<template>
  <div class="modal fade" id="editOqc" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="row" label-width="80px" size="small" label-position="top">
            <el-form-item label="是否合格">
              <el-radio-group v-model="row.is_pass">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="描述">
              <el-input v-model="row.description" placeholder></el-input>
            </el-form-item> -->
            <el-form-item label="产品图片">
              <el-upload
                action="a"
                :before-upload="imgUpload"
                :file-list="row.images_url"
                :on-remove="imagesRemove"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button size="mini" type="primary" @click="commit">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "editOqc",
  data() {
    return {};
  },
  props: {
    row: Object
  },
  methods: {
    ...mapMutations([""]),
    imgUpload(file) {
      switch (file.type) {
        case "image/jpeg":
        case "image/png":
        case "image/svg+xml":
        case "image/x-icon":
          this.upload(file, 0);
          break;
        default:
          this.$message({ message: "上传图片格式错误", type: "error" });
          break;
      }
    },
    upload(file, type) {
      let that = this,
        form = new FormData();
      form.append("upload", file);
      form.append("slug", "non_standard_requirements");
      that
        .$upload(`files/upload`, form)
        .then(response => {
          if (response.status != 200) return false;
          switch (type) {
            case 0:
              that.row.images.push(response.data.upload.id);
              that.row.images_url.push({
                name: file.name,
                url: response.data.url
              });
              break;
            case 1:
              that.row.report.push(response.data.upload.id);
              that.row.report_url.push({
                name: file.name,
                url: response.data.url
              });
              break;
          }
        })
        .catch(err => console.error(err));
    },
    imagesRemove(item) {
      this.remove("images", item);
    },
    remove(name, item) {
      this.row[`${name}_url`].forEach((e, k) => {
        if (e.url == item.url) {
          this.row[`${name}_url`].splice(k, 1);
          this.row[name].splice(k, 1);
        }
      });
    },
    commit() {
      this
        .$post(`quality/edit/${this.row.slug}`, {
          is_pass: this.row.is_pass,
          description: this.row.description,
          images: this.row.images.join(","),
          report: this.row.report.join(",")
        })
        .then(response => {
          if (response.status != 200) return false;
          this.close();
          this.$emit("refresh");
        })
        .catch(err => console.error(err));
    },
    close() {
      $("#inspection #editOqc").modal("toggle");
    }
  }
};
</script>
<style lang="less">
#editOqc {
  input[type="file"] {
    display: none;
  }
}
</style>
