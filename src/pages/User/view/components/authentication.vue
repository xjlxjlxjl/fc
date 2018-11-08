<template>
  <div id="authentication">
    <el-form :model="formData">
      <el-form-item label="姓名">
        <el-input v-model="formData.last_name"></el-input>
      </el-form-item>
      <el-form-item label="身份证">
        <el-input v-model="formData.id_card"></el-input>
      </el-form-item>
      <!-- <el-form-item label="用户邮箱 / 手机号">
        <el-input v-model="formData.member"></el-input>
      </el-form-item> -->
      <el-container>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证正面">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :before-upload="beforeAvatarUploadPositive">
                <img v-if="formData.id_card_positive" :src="formData.id_card_positive" class="avatar">
                <i v-else class="font_family icon-shangchuan"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证背面">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :before-upload="beforeAvatarUploadNegative">
                <img v-if="formData.id_card_negative" :src="formData.id_card_negative" class="avatar">
                <i v-else class="font_family icon-shangchuan"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-button type="primary">提交</el-button>
          </el-col>
        </el-row>
      </el-container>
    </el-form>
  </div>
</template>
<script>
  export default {
    name: 'authentication',
    data() {
      return {
        formData:{}
      }
    },
    methods:{
      beforeAvatarUploadPositive(file) {
        const loading = this.$loading({ lock: true });
        let form = new FormData(),that = this;
        form.append('upload', file);
        form.append('type', 'id_card');
        that.$upload('members/user/file-upload',form).then( response => {
          loading.close();
          if(response.status != 200)
           return false;
          that.formData.id_card_positive = response.data.url;
          that.$message({ message: response.message, type: 'success' });
        }).catch( error => loading.close());
      },
      beforeAvatarUploadNegative(file) {
        const loading = this.$loading({ lock: true });
        let form = new FormData(),that = this;
        form.append('upload', file);
        form.append('type', 'id_card');
        that.$upload('members/user/file-upload',form).then( response => {
          loading.close();
          if(response.status != 200)
           return false;
          that.formData.id_card_negative = response.data.url;
          that.$message({ message: response.message, type: 'success' });
        }).catch( error => loading.close());
      },
      save() {
        const loading = this.$loading({ lock: true });
        let that = this;
        that.$post('members/user/real-verification', that.formData).then( response => {
          loading.close();
          if(response.status != 200)
            return false;
          that.$message({ message: response.message, type: 'success'});
        }).catch( error => loading.close());
      }
    },
    created() {
      const loading = this.$loading({ lock: true });
      let that = this;
      that.$get('members/user').then( response => {
        loading.close();
        if(response.status != 200)
          return false;
        
        that.formData = {
          last_name: response.data.last_name,
          id_card: response.data.id_card,
          id_card_positive: response.data.id_card_positive,
          id_card_negative: response.data.id_card_negative,
          // member: response.data.member
        }
        switch(response.data.real_status){
          case 'success':
            that.$message({ message: '您已通过实名验证', type: 'success' });
            break;
          case 'no_attest':
            that.$message({ message: '您尚未申请实名验证，请尽快申请', type: 'warning' });
            break;
          case 'wait_verify':
            that.$message({ message: '您的实名验证还在审核中，请等待' });
            break;
          case 'fail':
            that.$message({ message: '审核失败了，请检查后，重新发起审核', type: 'error' });
            break;
        }
      }).catch( error => loading.close());
    }
  }
</script> 
<style lang="less">
  #authentication{
    margin: auto;
    color: #606266;
    width: 100%;
    max-width: 30rem;
    .el-form{
      .el-form-item{

      }
      .el-container{
        .el-row{
          width: 100%;
          .el-col{
            text-align: center;
            .el-form-item{
              .el-form-item__label{
                white-space: nowrap;
              }
              .el-form-item__content{
                clear: both;
                .avatar-uploader{
                  text-align: center;
                  box-sizing: border-box;
                  padding: 2rem;
                  border: 1px dashed #606266;
                  margin: .5rem;
                  border-radius: .6rem;
                  .el-upload{
                    .font_family{
                      font-size: 5rem;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
