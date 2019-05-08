<template>
  <transition name="el-fade-in-linear">
    <div id="editOqc" v-show="editOqcModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">品质编辑</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form :model="row" label-width="80px" size="small" label-position="top">
              <el-form-item label="是否合格">
                <el-radio-group v-model="row.is_pass">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="row.description" placeholder></el-input>
              </el-form-item>
              <el-form-item label="产品图片">
                <el-upload
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                  :before-upload="imgUpload"
                  :file-list="row.images_url"
                  :on-remove="imagesRemove"
                  list-type="picture"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="产品pdf">
                <el-upload
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                  :before-upload="pdfUpload"
                  :file-list="row.report_url"
                  :on-remove="reportRemove"
                  list-type="picture"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="commit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
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
      console.log(file);
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
    pdfUpload(file) {
      switch (file.type) {
        case "image/jpeg":
        case "image/png":
        case "image/svg+xml":
        case "image/x-icon":
        case "application/pdf":
          this.upload(file, 1);
          break;
        default:
          this.$message({ message: "上传报告格式为pdf", type: "error" });
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
        .catch(err => {});
    },
    imagesRemove(item) {
      this.remove("images", item);
    },
    reportRemove(item) {
      this.remove("report", item);
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
      let that = this;
      that
        .$post(`quality/edit/${that.row.slug}`, {
          is_pass: that.row.is_pass,
          description: that.row.description,
          images: that.row.images.join(","),
          report: that.row.report.join(",")
        })
        .then(response => {
          if (response.status != 200) return false;
          that.close();
          that.$emit("refresh");
        })
        .catch(err => {});
    },
    close() {
      this.$store.commit("changeModal", "editOqcModal");
    }
  },
  computed: mapState(["editOqcModal"]),
  created() {}
};
</script>
<style lang="less">
#editOqc {
  .modalBox {
    .modalBoxMain {
      width: 840px;
      max-width: 100%;
      .modalBoxMainContent {
        max-height: 550px;
        overflow: auto;
        .el-form {
          max-height: 100%;
          overflow: auto;
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            width: 50%;
            @media screen and (max-width: 501px) {
              &:first-child {
                margin-bottom: 0;
              }
            }
            .el-form-item__label {
              margin-bottom: 0;
            }
            .el-upload {
              text-align: left;
            }
            .el-upload__input {
              display: none;
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
}
</style>
