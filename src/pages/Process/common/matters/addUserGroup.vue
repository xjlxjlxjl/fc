<template>
  <div class="modal fade" id="addUserGroup" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" size="mini" ref="form" label-width="140px">
            <el-form-item label="选择用户组">
              <el-select v-model="form.slug">
                <el-option label="客服组" value="customer"></el-option>
                <el-option label="业务组" value="business"></el-option>    
                <el-option label="报价组" value="quoted_price"></el-option>
                <el-option label="仓库组" value="storehouse"></el-option>
                <el-option label="生产组" value="production"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择用户组用户">
              <el-select v-model="form.members" multiple placeholder="请选择">
                <el-option-group
                  v-for="group in userBranch"
                  :key="group.branch_id"
                  :label="group.branch_name">
                  <el-option
                    v-for="item in group.member"
                    :key="item.id"
                    :label="item.display_name"
                    :value="item.id">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button data-dismiss="modal">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addUserGroup",
  data() {
    return {
      form: {
        slug: 'customer',
        members: []
      },
      userBranch: []
    };
  },
  props: {
    row: Object
  },
  methods: {
    onSubmit() {
      let url = ``
      if (this.row.id) url = `members/user_group/edit/${this.row.id}`;
      else url = `members/user_group/create`;

      this.$post(url, {
        slug: this.form.slug,
        members: this.form.members.join(',')
      }).then(response => {
        if (response.status != 200) return false;
        this.$emit('refresh');
        $("#userGroup #addUserGroup").modal("hide");
        this.form = {
          slug: 'customer',
          members: []
        };
      }).catch(err => console.error(err));
    },
    getUserBranch() {
      if (this.$store.state.userBranch.length)
        this.userBranch = this.$store.state.userBranch;
      else 
        this
          .$get(`members/company/branch`)
          .then(response => {
            if (response.status != 200) return false;
            this.userBranch = response.data.list;
            this.$store.commit('getUserBranch', response.data.list);
          })
          .catch(err => console.error(err));
    }
  },
  mounted() {
    this.getUserBranch();
    let that = this;
    $('#userGroup #addUserGroup').on('shown.bs.modal', function () {
      if (that.row.id)
        that.form = that.row;
      else
        that.form = {
          slug: 'customer',
          members: []
        }
    })
  }
}
</script>
<style lang="less">
#addUserGroup {
  .el-form {
    .el-select {
      width: 100%;
    }
  }
}
</style>
