<template>
  <div id="app">
    <el-container>
      <el-header>
        <index-rise></index-rise>
      </el-header>
      <el-container class="homeContainer">
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      <el-footer class="homeFooter">
        <index-tail></index-tail>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import indexRise from '@/pages/Index/common/indexRise';
import indexTail from '@/pages/Index/common/indexTail';

export default {
  name: 'Home',
  components:{
    'index-rise': indexRise,
    'index-tail': indexTail
  }
}
</script>
<style scoped>
  .el-header,
  .el-main,
  .el-footer{
    padding: 0;
  }
  .homeContainer{
    background-color: #f2f2f2;
  }
  .homeFooter{
    position: fixed;
    width: 100%;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
  }
</style>