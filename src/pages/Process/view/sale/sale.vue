<template>
  <el-container id="sale">
    <companyAside :aside="aside"></companyAside>
    <router-view></router-view>
  </el-container>
</template>
<script>
import companyAside from "@/pages/Process/common/companyAside";
export default {
  name: "sale",
  data() {
    return {
      aside: this.$store.state.process.sale
    };
  },
  components: {
    companyAside: companyAside
  },
  methods: {}
};
</script>
<style lang="less">
@background: #f2f2f2;
@borderBlod: solid 1rem @background;
@border: solid 1px @background;
@white: #ffffff;
@gery: #666666;
#sale {
}
</style>
