<template>
  <div id="designate" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header"><h4 class="modal-title">选择指派人员</h4></div>
        <div class="modal-body">
          <el-checkbox-group v-model="arr">
            <el-checkbox v-for="e in userBranch" :key="e.id" :label="e.id">{{ e.display_name }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="modal-footer">
          <el-button size="mini" data-dismiss="modal">取消</el-button>
          <el-button type="primary" size="mini" @click="add">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "designate",
  data() {
    return {
      userBranch: [],
      arr: []
    };
  },
  props: {
    type: String
  },
  methods: {
    getBranch() {
      this
        .$get(`members/user_group`, {
          slug: this.type
        })
        .then(response => {
          if (response.status != 200) return false;
          this.userBranch = [];
          response.data.list.forEach(e =>
            e.members.forEach(v => this.userBranch.push(v))
          );
        })
        .catch(err => console.error(err));
    },
    add() {
      this.$emit('user', this.arr);
      $('#user').modal('hide');
    }
  },
  mounted() {
    $('#split #designate').on('shown.bs.modal', () => this.getBranch())
    $('#combination #designate').on('shown.bs.modal', () => this.getBranch())
    $('#plan #designate').on('shown.bs.modal', () => this.getBranch())
    $('#inspection #designate').on('shown.bs.modal', () => this.getBranch())
    $('#product #designate').on('shown.bs.modal', () => this.getBranch())
  }
}
</script>
<style lang="less">
#designate {
}
</style>
