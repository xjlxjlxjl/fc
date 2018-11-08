<template>
  <div>
    <el-row>
        <el-col :span="24">
            <header class="loginHeader">
                <i class="font_family icon-logo"></i>
                <span></span>
            </header>
        </el-col>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'loginRise',
  data () {
      return {
      }
  }
}
</script>
<style lang='less'>
@media screen and (max-width: 780px) {
  .loginContainer{
    margin-top:30px;
  }
}
@media screen and (min-width: 780px) and (max-width: 1280px) {
  .loginContainer{
    margin-top: 60px;
  }
}
@media screen and (min-width: 1280px) {
  .loginContainer{
    margin-top: 100px;
  }
}
.loginHeader{
  background-color: #0064db;
  color: #ffffff;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  i {
      font-size: 5.5rem;
  }
  span {
      font-size: 1.6rem;
  }
}
.el-input__inner{
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0px;
}
.el-input__suffix{
  display: flex;
  .el-input__suffix-inner{
    align-self: center;
  }
}
</style>
