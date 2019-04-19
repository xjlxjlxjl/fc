<template>
  <div class="modal fade" id="addMaterial" role="dialog">
    <div class="modal-dialog modal-lg" style="width: 1280px;max-width: 100%;" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="80px">
            <el-form-item label="料品名称" prop="name">
              <el-input v-model="form.name" placeholder="料品名称"></el-input>
            </el-form-item>
            <el-form-item label="料品规格" prop="material_specification">
              <el-input v-model="form.material_specification" placeholder="料品规格"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" placeholder="单位"></el-input>
            </el-form-item>
            <el-form-item label="材质" prop="texture">
              <el-input v-model="form.texture" placeholder="材质"></el-input>
            </el-form-item>
            <el-form-item label="长度" prop="length">
              <el-input v-model="form.length" placeholder="长度"></el-input>
            </el-form-item>
            <el-form-item label="宽度" prop="width">
              <el-input v-model="form.width" placeholder="宽度"></el-input>
            </el-form-item>
            <el-form-item label="高度" prop="height">
              <el-input v-model="form.height" placeholder="高度"></el-input>
            </el-form-item>
            <el-form-item label="重量" prop="weight">
              <el-input v-model="form.weight" placeholder="重量"></el-input>
            </el-form-item>
            <el-form-item label="采购单位" prop="purchase_unit">
              <el-input v-model="form.purchase_unit" placeholder="采购单位"></el-input>
            </el-form-item>
            <el-form-item label="销售单位" prop="sales_unit">
              <el-input v-model="form.sales_unit" placeholder="销售单位"></el-input>
            </el-form-item>
            <el-form-item label="Bom单位" prop="bom_unit">
              <el-input v-model="form.bom_unit" placeholder="Bom单位"></el-input>
            </el-form-item>
            <el-form-item label="子料编码" prop="relaCoding">
              <el-input v-model="form.relaCoding" placeholder="关联子料编码"></el-input>
            </el-form-item>
            <el-form-item label="拼音码" prop="pinyin_code">
              <el-input v-model="form.pinyin_code" placeholder="拼音码"></el-input>
            </el-form-item>
            <el-form-item label="图档号" prop="image_number">
              <el-input v-model="form.image_number" placeholder="图档号"></el-input>
            </el-form-item>
            <el-form-item label="生产厂家" prop="producer">
              <el-input v-model="form.producer" placeholder="生产厂家"></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="form.brand" placeholder="品牌"></el-input>
            </el-form-item>
            <el-form-item label="模具号" prop="mold_number">
              <el-input v-model="form.mold_number" placeholder="模具号"></el-input>
            </el-form-item>
            <el-form-item label="标准型号" prop="standard_model">
              <el-input v-model="form.standard_model" placeholder="标准型号"></el-input>
            </el-form-item>
            <el-form-item label="料品等级" prop="material_level">
              <el-input v-model="form.material_level" placeholder="料品等级"></el-input>
            </el-form-item>
            <el-form-item label="是否需检" prop="check">
              <el-radio-group v-model="form.check">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="widthFull" label="仓库" prop="respository">
              <el-select v-model="form.respository">
                <el-option 
                  v-for="item in storeList"
                  :key="item.id"
                  :label="item.name" 
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="widthHalf" label="料品属性" prop="attributes">
              <el-checkbox-group v-model="form.attributes">
                <el-checkbox
                  v-for="item in attrList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item class="widthHalf" label="料品类别" prop="material_category">
              <el-checkbox-group v-model="form.material_category">
                <el-checkbox
                  v-for="item in categoriesList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="工程图号" prop="project_drawing_number">
              <el-input v-model="form.project_drawing_number" placeholder="工程图号"></el-input>
            </el-form-item>
            <el-form-item label="加工图" prop="drawing_working">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form.drawing_working">
                <el-button size="mini" type="info" @click="uploadType = 1">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="组装图" prop="assembly_drawing">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form.assembly_drawing">
                <el-button size="mini" type="info" @click="uploadType = 2">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="承认图" prop="drawing_approve">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form.drawing_approve">
                <el-button size="mini" type="info" @click="uploadType = 3">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="图片" prop="image">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form.image">
                <el-button size="mini" type="info" @click="uploadType = 4">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="2d图纸" prop="drawing_2d">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form['drawing_2d']">
                <el-button size="mini" type="info" @click="uploadType = 5">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="3d图纸" prop="drawing_3d">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form['drawing_3d']">
                <el-button size="mini" type="info" @click="uploadType = 6">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="pdf图纸" prop="drawing_pdf">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form.drawing_pdf">
                <el-button size="mini" type="info" @click="uploadType = 7">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button type="info" size="mini" data-dismiss="modal">取消</el-button>
          <el-button type="info" size="mini" @click="submit">保存</el-button>          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addMaterial",
  data() {
    return {
      form: {
        name: '',
        material_specification: '',
        length: '',
        check: 1,
        drawing_working: [],
        drawing_working_ids: [],
        assembly_drawing: [],
        assembly_drawing_ids: [],
        drawing_approve: [],
        drawing_approve_ids: [],
        image: [],
        image_ids: [],
        'drawing_2d': [],
        'drawing_2d_ids': [],
        'drawing_3d': [],
        'drawing_3d_ids': [],
        drawing_pdf_ids: [],
        drawing_pdf: []
      },
      rules: {
        name: [{ required: true, message: '请输入料品名称', trigger: 'blur' }],
        material_specification: [{ required: true, message: '请输入料品规格', trigger: 'blur' }],
        length: [{ required: true, message: '请输入长度, 并且为数字', trigger: 'blur' }],
        respository: [{ required: true, message: '请选择仓库', trigger: 'change' }]
      },
      uploadType: 0,
      storeList: [],
      attrList: [],
      categoriesList: []
    };
  },
  methods: {
    getStore() {
      this
        .$get(`respositories/list`)
        .then(response => {
          if (response.status != 200) return false;
          this.storeList = response.data.list;
        })
        .catch(err => console.error(err));
    },
    getAttr() {
      this
        .$get(`project/material_attr`)
        .then(response => {
          if (response.status != 200) return false;
          this.attrList = response.data.list;
        })
        .catch(err => console.error(err));
    },
    getCate() {
      this
        .$get(`project/categories`)
        .then(response => {
          if (response.status != 200) return false;
          this.categoriesList = response.data.list;
        })
        .catch(err => console.error(err));
    },
    getFileslist() {
      this
        .$get(`files/folders`)
        .then(response => {
          if (response.status != 200) return false;
          console.log(response);
        })
        .catch(err => console.error(err));
    },
    submit() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
        this
          .$post(`respositories/materials/create`, this.form)
          .then(response => {
            if (response.status != 200) return false;
            this.$emit("refresh");
            $("#material #addMaterial").modal("hide");
          })
          .catch(err => console.error(err));
      });
    },
    upload(file) {
      let form = new FormData(),
        that = this,
        param = '',
        type = {
          1: () => { param = 'drawing_working'; },
          2: () => { param = 'assembly_drawing'; },
          3: () => { param = 'drawing_approve'; },
          4: () => { param = 'image'; },
          5: () => { param = 'drawing_2d'; },
          6: () => { param = 'drawing_3d'; },
          7: () => { param = 'drawing_pdf'; }
        };
      form.append("upload", file);
      form.append("slug", "engineer");
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          type[that.uploadType]();
          that.form[param].push({
            name: file.name,
            url: response.data.url
          });
          that.form[`${param}_ids`].push(response.data.upload.id);
        })
        .catch(err => console.error(err));
    }
  },
  mounted() {
    this.getStore();
    this.getAttr();
    this.getCate();
    this.getFileslist();
  }
};
</script>
<style lang="less">
#addMaterial {
  .modal-body {
    padding: 30px;
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 25%;
        .el-upload__input {
          display: none;
        }
      }
      .widthHalf {
        width: 50%;
      }
      .widthFull {
        width: 100%;
      }
    }
  }
  .modal-footer {
    text-align: center;
  }
}
</style>
