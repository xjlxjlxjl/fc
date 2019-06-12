<template>
  <div class="modal fade" id="seTurn" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-table :data="arr" border stripe>
            <el-table-column label="序号" width="80">
              <template slot-scope="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="step" label="生产步骤"></el-table-column>
            <el-table-column label="生产员">
              <template slot-scope="{ row }">
                <el-select v-model="row.members" multiple placeholder="请选择">
                  <el-option v-for="item in member" :key="item.id" :label="item.last_name" :value="item.id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="生产时间">
              <template slot-scope="{ row }">
                <el-date-picker v-model="row.produces_at" type="date" value-format="yyyy-MM-dd"></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column label="图片">
              <template slot-scope="{ row, $index }">
                <el-upload action="a" :before-upload="upload" :file-list="row.images">
                  <el-button size="small" type="primary" @click="key = $index">点击上传</el-button>
                </el-upload>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="modal-footer">
          <el-button size="mini" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "seTurn",
  data() {
    return {};
  },
  props: {
    arr: {
      type: Array
    },
    member: {
      type: Array
    }
  },
  methods: {
    upload(file) {
      let form = new FormData();
      form.append("upload", file);
      form.append("slug", "procedure_step");
      this
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          this.arr[this.key].images.push({
            name: file.name,
            url: response.data.url,
            id: response.data.upload.id
          });
        })
        .catch(err => console.error(err));
    },
    onSubmit() {
      let params = [];
      for (const e of this.arr)
        params.push({
          id: e.id,
          images: e.images.map(v => v.id).join(','),
          members: e.members.join(','),
          produces_at: e.produces_at
        });
      this
        .$post(`produces/procedure_step/edit`, { procedure: params })
        .then(response => {
          if (response.status != 200) return false;
          this.c = setTimeout(() => {
            this.$emit('refresh');
            $('#product #seTurn').modal("hide");
          }, 200)
        })
        .catch(e => console.error(e));
    }
  },
  mounted() {
    $("#product #seTurn").on('shown.bs.modal', () => {
      for (let e of this.arr)
        e.members = e.members_step.map(e => e.id);
    })
  }
}
</script>
<style lang="less">
#seTurn {
  input[type=file] {
    display: none;
  }
}
</style>
