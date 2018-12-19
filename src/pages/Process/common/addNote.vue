<template>
  <transition name="el-fade-in-linear">
    <div id="addNote" v-show="addNoteModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">添加备忘录</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form label-position="top" :model="form">
              <el-form-item label="备忘录内容">
                <el-input type="textarea" v-model="form.note" placeholder="备忘录内容"></el-input>
              </el-form-item>
              <el-form-item label="文件列表">
                <el-upload
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                  :before-upload="upload"
                  :file-list="form.fileList"
                  list-type="picture"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="onSubmit">立即创建</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "addNote",
  data() {
    return {
      form: {
        note: "",
        files: [],
        fileList: []
      }
    };
  },
  methods: {
    upload(file) {
      let that = this,
        form = new FormData();
      form.append("upload", file);
      form.append("slug", "non_standard_requirements");
      that
        .$upload(`files/upload`, form)
        .then(response => {
          if (response.status != 200) return false;
          that.form.files.push(response.data.upload.id);
          that.form.fileList.push({
            name: file.name,
            url: response.data.url
          });
        })
        .catch(err => {});
    },
    onSubmit() {
      let that = this;
      that
        .$post(`personnels/memos/create`, {
          note: that.form.note,
          files: that.form.files.join(",")
        })
        .then(response => {
          if (response.status != 200) return false;
          that.close();
          that.$emit("refresh");
        })
        .catch(err => {});
    },
    close() {
      this.$store.commit("changeModal", "addNoteModal");
    }
  },
  computed: mapState(["addNoteModal"])
};
</script>
<style lang="less">
#addNote {
  .modalBoxMain {
    .el-form {
      .el-form-item {
        &:last-child {
          margin-bottom: 0;
          .el-form-item__content {
            .el-upload {
              text-align: left;
            }
            .el-upload-list {
              max-height: 250px;
              overflow: auto;
            }
            .el-upload__input {
              opacity: 0;
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>

