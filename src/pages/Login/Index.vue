<template>
  <div id="app">
    <login-rise></login-rise>
  </div>
</template>

<script>
import loginRise from "@/pages/Login/common/loginRise";

export default {
  name: "Index",
  components: {
    "login-rise": loginRise
  }
};
</script>
<style>
@import "element-ui/lib/theme-chalk/index.css";
@import "../../assets/icon/iconfont.css";
@import "../../assets/css/init.css";
</style>