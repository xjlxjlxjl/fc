<template>
  <transition name="el-fade-in-linear">
    <div id="addMaterials" v-show="addMaterials">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">新建料品</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <el-form :model="form" size="mini" label-width="100px">
              <el-form-item label="料品名称">
                <el-input v-model="form.name" placeholder="料品名称"></el-input>
              </el-form-item>
              <el-form-item label="料品编号">
                <el-input v-model="form.material_number" placeholder="料品编号"></el-input>
              </el-form-item>
              <el-form-item label="料品规格">
                <el-input v-model="form.material_specification" placeholder="料品规格"></el-input>
              </el-form-item>
              <el-form-item label="仓库">
                <el-select v-model="form.respository" size="mini" placeholder="仓库">
                  <el-option
                    v-for="(item,index) in WareHouseList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  >
                    <span prefix="slot">{{ item.name }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >{{ item.type == 1 ? '仓库' : '仓位' }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工程图号">
                <el-input v-model="form.project_drawing_number" placeholder="工程图号"></el-input>
              </el-form-item>
              <el-form-item label="高度">
                <el-input v-model="form.height" placeholder="高度"></el-input>
              </el-form-item>
              <el-form-item label="重量">
                <el-input v-model="form.weight" placeholder="重量"></el-input>
              </el-form-item>
              <el-form-item label="长度">
                <el-input v-model="form.length" placeholder="长度"></el-input>
              </el-form-item>
              <el-form-item label="料品单位">
                <el-input v-model="form.item_unit" placeholder="料品单位"></el-input>
              </el-form-item>
              <el-form-item label="料品属性">
                <el-select v-model="form.attributes" :multiple="true" placeholder="料品属性">
                  <el-option
                    v-for="item in materialAttr"
                    :key="item.id"
                    :label="item.remark || item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否可打印">
                <el-radio-group v-model="form.print">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="图档号">
                <el-input v-model="form.picture_number" placeholder="图档号"></el-input>
              </el-form-item>
              <el-form-item label="是否需要质检">
                <el-radio-group v-model="form.check">
                  <el-radio :label="1">需要</el-radio>
                  <el-radio :label="0">不需要</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="模具号">
                <el-input v-model="form.mold_number" placeholder="模具号"></el-input>
              </el-form-item>
              <el-form-item label="标准型号">
                <el-input v-model="form.standard_model" placeholder="标准型号"></el-input>
              </el-form-item>
              <el-form-item label="料品等级">
                <el-input v-model="form.material_level" placeholder="料品等级"></el-input>
              </el-form-item>
              <el-form-item label="材质">
                <el-input v-model="form.material_quality" placeholder="材质"></el-input>
              </el-form-item>
              <el-form-item label="拼音码">
                <el-input v-model="form.pinyin_code" placeholder="拼音码"></el-input>
              </el-form-item>
              <el-form-item label="2D图纸">
                <el-upload
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                  :before-upload="drawing_2d"
                  :file-list="drawing_2dFilelist"
                >
                  <el-button size="small" type="primary">点击上传2D图纸</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="3D图纸">
                <el-upload
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                  :before-upload="drawing_3d"
                  :file-list="drawing_3dFilelist"
                >
                  <el-button size="small" type="primary">点击上传3D图纸</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="pdf图纸">
                <el-upload
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                  :before-upload="drawing_pdf"
                  :file-list="drawing_pdfFilelist"
                >
                  <el-button size="small" type="primary">点击上传pdf图纸</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="加工图纸">
                <el-upload
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                  :before-upload="drawing_working"
                  :file-list="drawing_workingFilelist"
                >
                  <el-button size="small" type="primary">点击上传加工图纸</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="承认图纸">
                <el-upload
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                  :before-upload="drawing_approve"
                  :file-list="drawing_approveFilelist"
                >
                  <el-button size="small" type="primary">点击上传承认图纸</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="工程图片">
                <el-upload
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                  :before-upload="project_picture"
                  :file-list="project_pictureFilelist"
                >
                  <el-button size="small" type="primary">点击上传工程图片</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="总重">
                <el-input v-model="form.total_weight" placeholder="总重"></el-input>
              </el-form-item>
              <el-form-item label="维度">
                <el-input v-model="form.dimension" placeholder="维度"></el-input>
              </el-form-item>
              <el-form-item label="条码">
                <el-input v-model="form.barcode" placeholder="条码"></el-input>
              </el-form-item>
              <el-form-item label="助记码">
                <el-input v-model="form.assistant_code" placeholder="助记码"></el-input>
              </el-form-item>
              <el-form-item label="图片">
                <el-upload
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                  :before-upload="image"
                  :file-list="imageFilelist"
                >
                  <el-button size="small" type="primary">点击上传图片</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="ABC分类">
                <el-input v-model="form.abc_category" placeholder="ABC分类"></el-input>
              </el-form-item>
              <el-form-item label="料品类别">
                <el-select v-model="form.material_category" size="mini" placeholder="料品类别">
                  <el-option
                    v-for="item in materialType"
                    :key="item.id"
                    :label="item.remark || item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
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
  name: "addMaterials",
  data() {
    return {
      form: {
        name: "",
        material_number: "",
        material_specification: "",
        respository: "",
        project_drawing_number: "",
        height: "",
        weight: "",
        length: "",
        item_unit: "",
        attributes: "",
        print: 1,
        picture_number: "",
        check: 1,
        mold_number: "",
        standard_model: "",
        material_level: "",
        material_quality: "",
        pinyin_code: "",
        drawing_2d: [],
        drawing_3d: [],
        drawing_pdf: [],
        drawing_working: [],
        drawing_approve: [],
        project_picture: [],
        total_weight: "",
        dimension: "",
        barcode: "",
        assistant_code: "",
        image: [],
        abc_category: "",
        material_category: ""
      },
      drawing_2dFilelist: [],
      drawing_3dFilelist: [],
      drawing_pdfFilelist: [],
      drawing_workingFilelist: [],
      drawing_approveFilelist: [],
      project_pictureFilelist: [],
      imageFilelist: []
    };
  },
  methods: {
    ...mapMutations(["setStateData"]),
    drawing_2d(file) {
      this.upload(file, 0);
    },
    drawing_3d(file) {
      this.upload(file, 1);
    },
    drawing_pdf(file) {
      this.upload(file, 2);
    },
    drawing_working(file) {
      this.upload(file, 3);
    },
    drawing_approve(file) {
      this.upload(file, 4);
    },
    project_picture(file) {
      this.upload(file, 5);
    },
    image(file) {
      this.upload(file, 6);
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
              that.form.drawing_2d.push(response.data.upload.id);
              that.drawing_2dFilelist.push({
                name: file.name,
                url: response.data.url
              });
              break;
            case 1:
              that.form.drawing_3d.push(response.data.upload.id);
              that.drawing_3dFilelist.push({
                name: file.name,
                url: response.data.url
              });
              break;
            case 2:
              that.form.drawing_pdf.push(response.data.upload.id);
              that.drawing_pdfFilelist.push({
                name: file.name,
                url: response.data.url
              });
              break;
            case 3:
              that.form.drawing_working.push(response.data.upload.id);
              that.drawing_workingFilelist.push({
                name: file.name,
                url: response.data.url
              });
              break;
            case 4:
              that.form.drawing_approve.push(response.data.upload.id);
              that.drawing_approveFilelist.push({
                name: file.name,
                url: response.data.url
              });
              break;
            case 5:
              that.form.project_picture.push(response.data.upload.id);
              that.project_pictureFilelist.push({
                name: file.name,
                url: response.data.url
              });
              break;
            case 6:
              that.form.image.push(response.data.upload.id);
              that.imageFilelist.push({
                name: file.name,
                url: response.data.url
              });
              break;
          }
        })
        .catch(err => {});
    },
    onSubmit() {
      if (!this.form.name || !this.form.respository) {
        this.$message({ message: "料品名称和仓库为必填", type: "error" });
        return false;
      }
      let that = this,
        loading = this.$loading({ lock: true });
      that.form.drawing_2d = that.form.drawing_2d.join(",");
      that.form.drawing_3d = that.form.drawing_3d.join(",");
      that.form.drawing_pdf = that.form.drawing_pdf.join(",");
      that.form.drawing_working = that.form.drawing_working.join(",");
      that.form.drawing_approve = that.form.drawing_approve.join(",");
      that.form.project_picture = that.form.project_picture.join(",");
      that.form.image = that.form.image.join(",");
      that
        .$post(`respositories/materials/create`, that.form)
        .then(response => {
          that.formToArr();
          loading.close();
          if (response.status != 200) return false;
          that.$emit("refresh");
          that.clearForm();
          that.close();
        })
        .catch(err => loading.close());
    },
    formToArr() {
      this.form.drawing_2d = this.form.drawing_2d.split(",");
      this.form.drawing_3d = this.form.drawing_3d.split(",");
      this.form.drawing_pdf = this.form.drawing_pdf.split(",");
      this.form.drawing_working = this.form.drawing_working.split(",");
      this.form.drawing_approve = this.form.drawing_approve.split(",");
      this.form.project_picture = this.form.project_picture.split(",");
      this.form.image = this.form.image.split(",");
    },
    clearForm() {
      this.form = {
        name: "",
        material_number: "",
        material_specification: "",
        respository: "",
        project_drawing_number: "",
        height: "",
        weight: "",
        length: "",
        item_unit: "",
        attributes: "",
        print: 1,
        picture_number: "",
        check: 1,
        mold_number: "",
        standard_model: "",
        material_level: "",
        material_quality: "",
        pinyin_code: "",
        drawing_2d: [],
        drawing_3d: [],
        drawing_pdf: [],
        drawing_working: [],
        drawing_approve: [],
        project_picture: [],
        total_weight: "",
        dimension: "",
        barcode: "",
        assistant_code: "",
        image: [],
        abc_category: "",
        material_category: ""
      };
      this.drawing_2dFilelist = [];
      this.drawing_3dFilelist = [];
      this.drawing_pdfFilelist = [];
      this.drawing_workingFilelist = [];
      this.drawing_approveFilelist = [];
      this.project_pictureFilelist = [];
      this.imageFilelist = [];
    },
    getMaterialType() {
      if (this.materialType.length) return false;
      let that = this;
      that
        .$get(`project/categories`)
        .then(response => {
          if (response.status != 200) return false;
          that.setStateData({ name: "materialType", arr: response.data.list });
        })
        .catch(err => {});
    },
    close() {
      this.$store.commit("changeModal", "addMaterials");
    }
  },
  computed: mapState({
    addMaterials: state => state.addMaterials,
    materialAttr: state => state.materialAttr,
    materialType: state => state.materialType,
    WareHouseType: state => state.WareHouseType,
    WareHouseList: state => {
      let arr = [];
      state.WareHouseList.forEach(e => {
        arr.push(e);
        e.children.forEach(c => arr.push(c));
      });
      return arr;
    }
  }),
  created() {
    this.getMaterialType();
  }
};
</script>
<style lang="less">
#addMaterials {
  .modalBox {
    max-height: 70%;
    overflow-y: auto;
    .modalBoxMain {
      width: 800px;
      .modalBoxMainContent {
        // height: 590px;
        // overflow-y: auto;
        .el-form {
          display: flex;
          flex-wrap: wrap;
          .el-form-item {
            box-sizing: border-box;
            width: 50%;
            .el-upload__input {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
