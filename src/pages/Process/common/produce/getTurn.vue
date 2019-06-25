<template>
  <div class="modal fade" id="getTurn" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <el-table :data="arr" border stripe highlight-current-row @current-change="change">
          <el-table-column label="序号">
            <template slot-scope="{ $index }">{{ $index + 1 }}</template>
          </el-table-column>
          <el-table-column prop="name" label="生产工序名称"></el-table-column>
          <el-table-column prop="created_member.last_name" label="创建人"></el-table-column>
          <el-table-column prop="created_at" label="创建日期"></el-table-column>
          <el-table-column prop="material.name" label="关联料品编码"></el-table-column>
        </el-table>
        <div class="modal-footer">
          <el-button data-dismiss="modal">取消</el-button>
          <el-button type="primary" @click="add">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "getTurn",
  data() {
    return {
      arr: []
    };
  },
  props: {
    id: Number
  },
  methods: {
    getData() {
      this
        .$get(`produces/procedure`)
        .then(response => {
          if (response.status != 200) return false;
          this.arr = response.data.list;
        })
        .catch(e => console.error(e));
    },
    change(val) {
      this.trun = val;
    },
    add() {
      this
        .$post(`produces/plan/edit`, {
          id: this.id,
          procedure_id: this.trun.id
        })
        .then(response => {
          if (response.status != 200) return false;
          this.$emit('refresh');
          $("#plan #getTurn").modal("hide");
        })
        .catch(e => console.error(e));
    },
  },
  mounted() {
    $("#plan #getTurn").on("shown.bs.modal", () => this.getData());
    $("#product #getTurn").on("shown.bs.modal", () => this.getData());
  }
}
</script>
<style lang="less">
#getTurn {
  .modal-footer {
    padding: 0;
    display: flex;
    .el-button {
      width: 50%;
      margin-left: 0;
      border-radius: 0;
    }
  }
}
</style>
