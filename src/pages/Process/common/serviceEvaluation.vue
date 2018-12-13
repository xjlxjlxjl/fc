<template>
  <transition name="el-fade-in-linear">
    <div id="serviceEvaluation">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">对此次服务进行评价</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="evaluation">
              <el-form ref="form" label-width="40px" label-position="right">
                <el-form-item label="评论">
                  <el-input type="textarea" v-model="form.comment"></el-input>
                </el-form-item>
                <el-form-item label="建议">
                  <el-input type="textarea" v-model="form.advice"></el-input>
                </el-form-item>
                <el-form-item label="服务">
                  <el-rate
                    v-model="form.score"
                    :icon-classes="['icon-rate-face-1', 'icon-rate-face-2', 'icon-rate-face-3']"
                    void-icon-class="icon-rate-face-off"
                    :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                  ></el-rate>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="commit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "serviceEvaluation",
  data() {
    return {
      form: {
        comment: "",
        advice: "",
        score: null,
        created_at: this.dateParse(new Date())
      }
    };
  },
  methods: {
    ...mapMutations([""]),
    commit() {
      console.log(form);
      return false;
      let that = this;
      that
        .$(`/service/score/create`, form)
        .then(response => {
          if (response.status != 200) return false;
          that.close();
        })
        .catch(err => {});
    },
    close() {
      this.$store.commit("changeModal", "");
    }
  }
  // computed: {
  //   ...mapState([""])
  // }
};
</script>
<style lang="less">
#serviceEvaluation {
  #evaluation {
  }
}
</style>
