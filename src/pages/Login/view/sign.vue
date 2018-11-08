<template>
  <div id="sign">
    <el-container class="loginContainer">
      <el-header>
        
      </el-header>
      <el-main>
        <el-input placeholder="输入手机号" 
                  v-model="signDetail.mobile" 
                  clearable></el-input>
        <el-input placeholder="请输入密码" 
                  type="password"
                  v-model="signDetail.password"></el-input>
        <el-input placeholder="请输入验证码" 
                  v-if="signDetail.login_type != '0'"
                  v-model="signDetail.code" 
                  clearable>
          <el-button slot="suffix" type="info" @click="getCode" round>{{ codeCacheTime }}</el-button>
        </el-input>
      </el-main>
      <el-footer>
        <div><router-link to="/login"><el-button type="text" class="text-right">已有账户，登陆</el-button></router-link></div>
        <div><el-button type="primary" @click="sign">注册</el-button></div>
        <div @click="userProtocolModal"><el-checkbox v-model="userProtocol">用户协议</el-checkbox></div>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'sign',
  data() {
    return {
      signDetail: {
        mobile: '',
        password: '',
        code: ''
      },
      codeCacheTime: '获取验证码',
      isClick: false,
      agreement: '',
      userProtocol: false
    }
  },
  methods: {
    getCode() {
      let that = this;
      if(that.isClick){
        return false;
      }
      if(that.signDetail.mobile == ''){
        that.$message({ 
          message: '请输入手机号码',
          type: 'error'
        });
        return false;
      }
      if(that.signDetail.password == ''){
        that.$message({ 
          message: '请输入密码',
          type: 'error'
        });
        return false;
      }
      const loading = this.$loading({ lock: true });
      that.$get('members/send/register', that.signDetail).then( response => {
        loading.close();
        if(response.status != 200){
          return false;
        }
        that.isClick = true;
        that.lastTime();
      }).catch(error => loading.close())
    },
    lastTime() {
      let that = this;
      that.codeCacheTime = 60;
      let setTimeOut = setInterval(function(){
        if(that.codeCacheTime > 1){
          that.codeCacheTime--;
        }else{
          clearInterval(setTimeOut);
          that.codeCacheTime = '重新发送'
          that.isClick = false;
        }
      },1000);
    },
    userProtocolModal() {
      let that = this;
      that.$confirm(that.agreement, '用户协议', {
        dangerouslyUseHTMLString: true,
        center: true,
        confirmButtonText: '同意并继续',
        cancelButtonText: '拒绝',
      }).then(() => {
        that.userProtocol = true;
      }).catch(() => {
        that.userProtocol = false;
      });
    },
    sign() {
      let that = this;
      if(that.signDetail.mobile == ''){
        that.$message({ 
          message: '请输入手机号码',
          type: 'error'
        });
        return false;
      }
      if(that.signDetail.password == ''){
        that.$message({ 
          message: '请输入密码',
          type: 'error'
        });
        return false;
      }
      if(that.signDetail.code == ''){
        that.$message({ 
          message: '请输入验证码',
          type: 'error'
        });
        return false;
      }
      if(!that.userProtocol){
        that.$message({ 
          message: '请查看用户协议',
          type: 'error'
        });
        return false;
      }

      const loading = that.$loading({ lock: true });
      that.$post('members/register', that.signDetail).then( response => {
        loading.close();
        if(response.status != 200){
          return false;
        }
      }).catch( error => loading.close());
    }
  },
  created() {
    let that = this;
    const loading = that.$loading({ lock: true }); 
    that.$get('dashboard/agreement/members').then(response => {
      loading.close();
      if(response.status != 200){
        return false;
      }
      that.agreement = +response.data.agreement;
    }).catch( error => loading.close());
  }
}
</script>
<style lang="less">
.el-message-box{
  width: 820px;
  max-width: 100%;
  height: 600px;
  max-width: 100%;
  .el-message-box__content{
    height: 85%;
    overflow: auto;
  }
}
#sign{
  .text-right{
    text-align: right;
    padding-top: 0;
  }
  .el-container{
    display: block;
    box-sizing: border-box;
    width: 100%;
    max-width: 330px;
    margin-left: auto;
    margin-right: auto;
    .el-main{
      div{
        display: block;
        margin-top: 15px;
        margin-bottom: 15px;
        margin-left: auto;
        margin-right: auto;
        &:nth-child(3){
          margin-bottom: 0px;
        }
        button{
          padding: 3px;
          width: 80px;
        }
      }
    }
    .el-footer{
      width: 100%;
      text-align: center;
      button{
        width: 100%;
      }
      div{
        &:last-child{
          padding-top: 12px;
        }
      }
    }
  }
}
</style>
