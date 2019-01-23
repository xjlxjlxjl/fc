<template>
  <transition name="el-fade-in-linear">
    <div v-show="demandModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">编辑需求</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="demand">
              <el-form label-position="top" :model="demand">
                <el-form-item label="非标产品需求描述">
                  <el-input type="textarea" placeholder="请填写" v-model="demand.demand"></el-input>
                </el-form-item>
                <el-form-item label="上传附件">
                  <el-upload
                    class="upload-demo"
                    action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                    :file-list="demand.fileList"
                    :before-upload="upload"
                    :on-remove="handleRemove"
                    list-type="picture"
                  >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">单文件上传100M以内</div>
                  </el-upload>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="edit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "demand",
  data() {
    return {};
  },
  props: {
    demand: Object
  },
  methods: {
    edit() {
      let that = this,
        loading = this.$loading({ lock: true }),
        params = {
          demand: that.demand.demand
        };
      if (that.demand.images_ids.length)
        params.images_ids = that.demand.images_ids.join(",");
      that
        .$post(`orders/inquiry-price/update/${that.demand.id}`, params)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.close();
        })
        .catch(err => loading.close());
    },
    upload(file) {
      let that = this,
        form = new FormData();
      form.append("upload", file);
      form.append("slug", "non_standard_requirements");
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          that.demand.fileList.push({
            name: file.name,
            url: response.data.url
          });
          that.demand.images_ids.push(response.data.upload.id);
        })
        .catch(err => console.error(err));
    },
    handleRemove(file, fileList) {
      let delArr = [],
        inArr = false;
      this.demand.fileList.forEach((e, k) => {
        inArr = false;
        fileList.forEach(item => {
          if (item.name == e.name) inArr = true;
        });
        if (!inArr) delArr.push(k);
      });
      this.demand.fileList = fileList;
    },
    close() {
      this.$store.commit("demandModalDisplay");
    }
  },
  computed: mapState(["demandModal"])
};
</script>
<style lang="less">
</style>
