<template>
  <div id="security">
    <el-tabs>
      <el-tab-pane v-for="(item,index) in elTabs" :key="index" 
                  :label="item.label" :name="item.value">
        <div class="securityContant" v-if="item.value == 0">
          <el-input
            type="password"
            placeholder="输入原密码"
            v-model="changePass.oldpassword">
            <i slot="prefix" class="font_family icon-password"></i>
          </el-input>
          <el-input
            type="password"
            placeholder="输入新密码"
            v-model="changePass.password">
            <i slot="prefix" class="font_family icon-password"></i>
          </el-input>
          <el-input
            type="password"
            placeholder="确认新密码"
            v-model="changePass.repassword">
            <i slot="prefix" class="font_family icon-password"></i>
          </el-input>
          <el-button type="primary" @click="changePassMethod">确定</el-button>
        </div>
        <div class="securityContant" v-else-if="item.value == 1">
          <div v-if="changeMobileState == 1">
            <el-input
              placeholder="输入原手机号"
              v-model="changeMobile.oldMobile">
              <i slot="prefix" class="font_family icon-shouji"></i>
            </el-input>
            <el-input
              type="password"
              placeholder="输入密码"
              v-model="changeMobile.password">
              <i slot="prefix" class="font_family icon-password"></i>
            </el-input>
            <el-input
              placeholder="输入验证码"
              v-model="changeMobile.oldCode">
              <i slot="prefix" class="font_family icon-yanzhengma"></i>
              <el-button slot="suffix" type="warning" @click="getCode" round>{{ codeCacheTime }}</el-button>
            </el-input>
            <el-button type="primary" @click="checkCode">确定</el-button>
          </div>
          <div v-else>
            <el-input
              placeholder="输入新手机号"
              v-model="changeMobile.newMobile">
              <i slot="prefix" class="font_family icon-shouji"></i>
            </el-input>
            <el-input
              placeholder="输入验证码"
              v-model="changeMobile.newCode">
              <i slot="prefix" class="font_family icon-yanzhengma"></i>
              <el-button slot="suffix" type="warning" @click="getNewCode" round>{{ codeCacheTime }}</el-button>
            </el-input>
            <el-button type="primary" @click="changeNewMobile">确定</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    name: 'security',
    data() {
      return {
        elTabs: [
          { label: '修改密码', value: '0' },
          { label: '更换注册手机号', value: '1' }
        ],
        changePass: {
          oldpassword: '',
          password: '',
          repassword: ''
        },
        changeMobileState: 1,
        changeMobile: {
          password: '',
          oldMobile: '',
          oldCode: '',
          newMobile: '',
          newCode: ''
        },
        isClick: false,
        setTimeOut: null,
        codeCacheTime: '发送验证码',
      }
    },
    methods:{
      changePassMethod() {
        const loading = this.$loading({ lock: true }),that = this;
        that.$post('members/change-pass', that.changePass).then( response => {
          loading.close();
          if(response.status !== 200)
            return false;
          
          that.changePass = {
            oldpassword: '',
            password: '',
            repassword: ''
          }
          that.$message({ message: response.message, type: 'success' });
        }).catch( error => loading.close());
      },
      getCode() {
        let that = this;
        if(that.isClick)
            return false;

        that.isClick = true;
        if (!that.changeMobile.password) {
            that.$message({ showClose: true, message: '密码不能为空', type: 'error' });
            return false;
        }
        // 发送短信
        that.$post('members/user/send-old',{
          password: that.changeMobile.password
        }).then(response => {
          if(response.status != 200)
            that.isClick = false;return false;

            // 开始倒计时
            that.lastTime();
        }).catch(error => loading.close());
      },
      getNewCode() {
        if (!this.changeMobile.newMobile) {
            this.$message({ showClose: true, message: '手机号不能为空', type: 'error' });
            return false;
        }
        const that = this,loading = this.$loading({ lock: true });
        that.$post('members/user/new-send', { mobile: that.changeMobile.newMobile }).then( response => {
          loading.close();
          if(response.status != 200)
            that.isClick = false;return false;

            that.lastTime();
        }).catch(error => loading.close());
      },
      lastTime() {
        let that = this;
        that.codeCacheTime = 60;
        that.setTimeOut = setInterval(function(){
            if(that.codeCacheTime > 1){
                that.codeCacheTime--;
            }else{
                clearInterval(that.setTimeOut);
                that.codeCacheTime = '重新发送'
                that.isClick = false;
            }
        },1000);
      },
      checkCode() {
        const that = this,loading = this.$loading({ lock: true });
        that.$post('members/user/send-verify',{
          code: that.changeMobile.oldCode
        }).then(response => {
          loading.close();
          if(response.status != 200)
            return false;

            that.isClick = false;
            that.codeCacheTime = '发送验证码';
            that.changeMobileState = 2;
        }).catch(error => loading.close());
      },
      changeNewMobile() {
        if (!this.changeMobile.newMobile) {
            this.$message({ showClose: true, message: '手机号不能为空', type: 'error' });
            return false;
        }
        if (!this.changeMobile.newCode) {
            this.$message({ showClose: true, message: '验证码不能为空', type: 'error' });
            return false;
        }
        const that = this,loading = this.$loading({ lock: true });
        
        that.$post('members/user/change-mobile',{
          code: that.changeMobile.newCode,
          mobile: that.changeMobile.newmobile
        }).then(response => {
          loading.close();
          if(response.status != 200)
            return false;  
          
          that.isClick = false;
          window.location.href = './login.html';
        }).catch(error => loading.close());
      }
    }
  }
</script> 
<style lang="less">
@gery: #c7c7c7;
@black: #8e8e8e;
@border: 1px solid @gery;
  #security{
    box-sizing: border-box;
    width: 100%;
    padding: 1rem 2rem;
    .securityContant{
      width: 300px;
      margin: auto;
      @media screen and (min-width: 720px){
        padding-top: 5rem;
      }
      .el-input{
        margin-top: 1.5rem;
        input{
          border-radius: 0;
          border: none;
          border-bottom: @border;
        }
        .el-input__prefix{
          display: flex;
          align-items: center;
          i{
            font-weight: bold;
            color: @black;
          }
        }
        .el-input__suffix{
          button{
            padding: .3rem .5rem;
            margin-top: 10%;
            width: 80px;
          }
        }
      }
      .el-button{
        display: block;
        width: 100%;
        margin-top: 1.5rem;
      }
    }
  }
</style>
