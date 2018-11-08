<template>
  <footer>
    <span>联系电话：{{ tel }}</span>
    <div class="text-center">
      <img :src="recordImgUrl">
      <span>{{ Record }}</span>
    </div>
    <span>版权声明：{{ Copyright }}</span>
  </footer>
</template>
<script>
  export default {
    name: 'indexTail',
    data() {
      return {
        tel: '0755-86090058',
        recordImgUrl: 'https://img.alicdn.com/tps/TB1yEqRPXXXXXXPXpXXXXXXXXXX-20-20.png',
        Record: '粤ICP备16106537号-2',
        Copyright: 'xyz.factoryun.com'
      }
    }
  }
</script>
<style lang="less" scoped>
  .blocking{
    display: block;
    height: 110px;
  }
  @media screen and (max-width: 820px){
    footer{
      background-color: #353535;
      padding: 1rem;
      line-height: 2;
      color: #f2f2f2;
      >span{
        display: block;
        text-align: right;
      }
      >div{
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
        img{
          width: 15px;
          height: 15px;
          margin-top: -3px;
        }
        span{
          margin-right: 5px;
        }
      }
    }
  }
  @media screen and (min-width: 820px){
    footer{
      display: flex;
      background-color: #353535;
      height: 100px;
      justify-content: space-around;
      align-items: center;
      color: #ffffff;
    }
  }
</style>
