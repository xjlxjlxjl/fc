<template>
  <div id="addNonstandard" class="modal fade" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <el-form :model="form" ref="form" size="mini" label-width="80px">
            <el-form-item label="选择模板">
              <el-select 
                v-model="form.choice"
                filterable remote 
                :filter-method="search"
                @change="changModal">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "addNonstandard",
  data() {
    return {
      form: {
        choice: '',
      },
      options: []
    };
  },
  methods: {
    search(val) {
      console.log(val)
      this.options = [
        {
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }
      ]
    },
    changModal(val) {
      console.log(val)
    }
  }
};
</script>
<style lang="less">
#addNonstandard {
}
</style>
