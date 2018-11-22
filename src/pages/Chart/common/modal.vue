<template>
  <div id="modal">
    <transition name="el-fade-in-linear">
      <div v-show="modalShow">
        <div class="Curtain"></div>
        <div class="modalBox">
          <div class="modalBoxMain">
            <div class="modalBoxMainHeader">
              <div class="modalBoxMainHeaderTitle">
                加入项目
              </div>
              <div class="modalBoxMainHeaderBtn" @click="modalShow = false;">
                <i class="el-message-box__close el-icon-close"></i>
              </div>
            </div>
            <div class="modalBoxMainContent">
              
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less">

</style>
