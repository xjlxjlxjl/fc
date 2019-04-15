<template>
  <div class="modal fade" id="addMaterial" role="dialog">
    <div class="modal-dialog modal-lg" style="width: 1280px;max-width: 100%;" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="80px">
            <el-form-item label="料品名称" prop="name">
              <el-input v-model="form.name" placeholder="料品名称"></el-input>
            </el-form-item>
            <el-form-item label="料品规格" prop="specifications">
              <el-input v-model="form.specifications" placeholder="料品规格"></el-input>
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
            <el-form-item label="采购单位" prop="buyUnit">
              <el-input v-model="form.buyUnit" placeholder="采购单位"></el-input>
            </el-form-item>
            <el-form-item label="销售单位" prop="saleUnit">
              <el-input v-model="form.saleUnit" placeholder="销售单位"></el-input>
            </el-form-item>
            <el-form-item label="Bom单位" prop="BomUnit">
              <el-input v-model="form.BomUnit" placeholder="Bom单位"></el-input>
            </el-form-item>
            <el-form-item label="子料编码" prop="relaCoding">
              <el-input v-model="form.relaCoding" placeholder="关联子料编码"></el-input>
            </el-form-item>
            <el-form-item label="拼音码" prop="pinyinCode">
              <el-input v-model="form.pinyinCode" placeholder="拼音码"></el-input>
            </el-form-item>
            <el-form-item label="图档号" prop="mapNumber">
              <el-input v-model="form.mapNumber" placeholder="图档号"></el-input>
            </el-form-item>
            <el-form-item label="生产厂家" prop="producer">
              <el-input v-model="form.producer" placeholder="生产厂家"></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="brand">
              <el-input v-model="form.brand" placeholder="品牌"></el-input>
            </el-form-item>
            <el-form-item label="模具号" prop="moldNumber">
              <el-input v-model="form.moldNumber" placeholder="模具号"></el-input>
            </el-form-item>
            <el-form-item label="标准型号" prop="standardModel">
              <el-input v-model="form.standardModel" placeholder="标准型号"></el-input>
            </el-form-item>
            <el-form-item label="料品等级" prop="level">
              <el-input v-model="form.level" placeholder="料品等级"></el-input>
            </el-form-item>
            <el-form-item label="是否需检" prop="needCheck">
              <el-radio-group v-model="form.needCheck">
                <el-radio :value="1" label="是"></el-radio>
                <el-radio :value="0" label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="widthFull" label="仓库" prop="store">
              <el-select v-model="form.store">
              </el-select>
            </el-form-item>
            <el-form-item class="widthHalf" label="料品属性" prop="property">
              <el-checkbox-group v-model="form.property">
                <el-checkbox :value="1" label="原材料"></el-checkbox>
                <el-checkbox :value="2" label="半成品"></el-checkbox>
                <el-checkbox :value="3" label="成品"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item class="widthHalf" label="料品类别" prop="category">
              <el-checkbox-group v-model="form.category">
                <el-checkbox :value="1" label="采购件"></el-checkbox>
                <el-checkbox :value="2" label="自制件"></el-checkbox>
                <el-checkbox :value="3" label="委外件"></el-checkbox>
                <el-checkbox :value="4" label="销售件"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="工程图号" prop="projectDraw">
              <el-input v-model="form.projectDraw" placeholder="工程图号"></el-input>
            </el-form-item>
            <el-form-item label="加工图" prop="processMap">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form.processMap">
                <el-button size="mini" type="info" @click="uploadType = 1">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="组装图" prop="assemblyDraw">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form.assemblyDraw">
                <el-button size="mini" type="info" @click="uploadType = 2">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="承认图" prop="admitDrwa">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form.admitDrwa">
                <el-button size="mini" type="info" @click="uploadType = 3">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="图片" prop="picture">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form.picture">
                <el-button size="mini" type="info" @click="uploadType = 4">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="2D图纸" prop="2d">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form['2d']">
                <el-button size="mini" type="info" @click="uploadType = 5">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="3D图纸" prop="3d">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form['3d']">
                <el-button size="mini" type="info" @click="uploadType = 6">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="pdf图纸" prop="pdf">
              <el-upload
                action="aaa"
                :before-upload="upload"
                :file-list="form.pdf">
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
        specifications: '',
        length: '',
        needCheck: 1,
        processMap: [],
        processMap_ids: [],
        assemblyDraw: [],
        assemblyDraw_ids: [],
        admitDrwa: [],
        admitDrwa_ids: [],
        picture: [],
        picture_ids: [],
        '2d': [],
        '2d_ids': [],
        '3d': [],
        '3d_ids': [],
        pdf_ids: [],
        pdf: []
      },
      rules: {
        name: [{ required: true, message: '请输入料品名称', trigger: 'blur' }],
        specifications: [{ required: true, message: '请输入料品规格', trigger: 'blur' }],
        length: [{ required: true, message: '请输入长度', trigger: 'blur' }]
      },
      uploadType: 0
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(v => {
        if (!v) return false;
      });
    },
    upload(file) {
      let form = new FormData(),
        that = this,
        param = '',
        type = {
          1: () => { param = 'processMap'; },
          2: () => { param = 'assemblyDraw'; },
          3: () => { param = 'admitDrwa'; },
          4: () => { param = 'picture'; },
          5: () => { param = '2d'; },
          6: () => { param = '3d'; },
          7: () => { param = 'pdf'; }
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
