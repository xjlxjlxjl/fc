<template>
  <transition id="moveProject" name="el-fade-in-linear">
    <div v-show="moveModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">移入项目</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="moveItem">
              <el-select v-model="moveSlug" placeholder="请选择移入项目">
                <el-option
                  v-for="(item,index) in projectList.list"
                  :key="index"
                  v-if="!item.is_default"
                  :label="item.name"
                  :value="item.slug"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="moveProject">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";
import "@/assets/css/modal.css";

export default {
  name: 'moveProject',
  data() {
    return {
      moveSlug: ""
    };
  },
  props: {
    multipleSelection: Array,
    projectList: Object,
  },
  methods: {
    moveProject() {
      if (this.moveSlug == "") {
        this.$message.error("没有选择加入项目");
        return false;
      }

      let that = this,
        loading = this.$loading({ lock: true }),
        ids = [];
        
      this.multipleSelection.forEach(e => {
        that
          .$post("carts/move-item", {
            // str_id: ids.join(','),
            str_id: e.str_id,
            slug: that.moveSlug
          })
          .then(response => {
            loading.close();
            if (response.status != 200) return false;
            that.close();
          })
          .catch(error => loading.close());
      });
    },
    close() {
      if (!this.multipleSelection.length) {
        this.$message.error("你没有选择商品");
        return false;
      }
      this.$store.commit('changeModal','moveModal')
    }
  },
  computed: mapState(["moveModal"])
}
</script>
<style lang="less">
  #moveItem {
    @media screen and (min-width: 500px) {
      .modalBoxMain {
        margin-top: 180px;
      }
    }
    .el-select {
      width: 100%;
    }
  }
</style>
