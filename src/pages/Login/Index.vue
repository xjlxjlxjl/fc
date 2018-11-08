<template>
  <div id="app">
    <login-rise></login-rise>
  </div>
</template>

<script>
import loginRise from '@/pages/Login/common/loginRise';

export default {
  name: 'Index',
  components:{
    'login-rise': loginRise,
  }
}
</script>