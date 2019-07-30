<template>
  <div class="modal fade" id="addExtract" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" ref="form" label-width="120px" size="mini">
            <el-form-item label="关联领料单号">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
          <el-table :data="arr" border stripe>
            <el-table-column label="序号" width="50">
              <template slot-scope="{ $index }">{{ $index + 1 }}</template>
            </el-table-column>
            <el-table-column label="料品编码">
              <template slot-scope="{ row }">
                <el-input size="mini" v-model="row.code"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料品规格">
              <template slot-scope="{ row }">
                <el-input size="mini" v-model="row.info"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="料品名称">
              <template slot-scope="{ row }">
                <el-input size="mini" v-model="row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="单位">
              <template slot-scope="{ row }">
                <el-input size="mini" v-model="row.unit"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="数量">
              <template slot-scope="{ row }">
                <el-input size="mini" v-model="row.num"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="" width="50">
              <template slot-scope="{ $index }">
                <el-button type="text" @click="arr.splice($index, 1)" icon="el-icon-delete"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button style="width: 100%;" size="mini" @click="arr.push({})" icon="el-icon-plus"></el-button>        
        </div>
        <div class="modal-footer" style="text-align: center;">
          <el-button size="mini" data-dismiss="modal">取消</el-button>
          <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addExtract",
  data() {
    return {
      form: {},
      arr: []
    };
  },
  props: {
    row: Object
  },
  methods: {
    onSubmit() {},
    clearForm() {}
  },
  mounted() {
    $("#extract #addExtract").on('shown.bs.modal', () => {})
  }
}
</script>
<style lang="less">
#addExtract {
  .el-form {
    .el-form-item {
      width: 50%;
    }
  }
}
</style>
 