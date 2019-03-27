<template>
  <div>
    <transition name="el-fade-in-linear">
      <div id="addVisit" v-show="addVisitModal">
        <div class="Curtain"></div>
        <div class="modalBox">
          <div class="modalBoxMain">
            <div class="modalBoxMainHeader">
              <div class="modalBoxMainHeaderTitle">添加访问记录</div>
              <div class="modalBoxMainHeaderBtn" @click="close">
                <i class="el-message-box__close el-icon-close"></i>
              </div>
            </div>
            <div class="modalBoxMainContent">
              <el-form
                label-position="right"
                ref="form"
                :rules="rules"
                label-width="80px"
                :model="form"
                size="mini"
              >
                <el-form-item label="公司名称" prop="client_company">
                  <el-input v-model="form.client_company" placeholder="公司名称"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="contactJson.name">
                  <el-select v-model="form.linkman" placeholder="联系人" @change="changeContact">
                    <el-option 
                      v-for="(item, index) in form.contact"
                      :key="index" 
                      :label="item.name" 
                      :value="item"
                    ></el-option>
                  </el-select>
                  <el-button type="info" @click="addContactModal = !addContactModal">新增</el-button>
                </el-form-item>
                <el-form-item label="职务" prop="contactJson.position">
                  <el-input v-model="form.contactJson.position" placeholder="职务"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="contactJson.mobile">
                  <el-input v-model="form.contactJson.mobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="contactJson.email">
                  <el-input v-model="form.contactJson.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="拜访时间" prop="access_at">
                  <el-date-picker 
                    v-model="form.access_at" 
                    type="date" 
                    value-format="yyyy-MM-dd HH:mm"
                    placeholder="拜访时间"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="同行人" prop="together">
                  <el-input v-model="form.together" placeholder="同行人"></el-input>
                </el-form-item>
                <el-form-item label="拜访内容" class="widthFull" prop="visiting_content">
                  <el-input type="textarea" v-model="form.visiting_content" placeholder="拜访内容"></el-input>
                </el-form-item>
                <el-form-item label="图片" class="widthFull" prop="images">
                  <!-- <el-input v-model="form.images" placeholder="图片"></el-input> -->
                  <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    list-type="picture-card"
                    :file-list="fileList"
                    :before-upload="upload"
                    :before-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-form>
            </div>
            <div class="modalBoxMainBtn">
              <el-button size="mini" type="primary" @click="onSubmit">保存</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="modal fade addContact" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <el-form 
              :model="contactForm" 
              ref="contactForm" 
              :rules="contactRule" 
              label-width="80px">
              <el-form-item label="联系人" prop="name">
                <el-input v-model="contactForm.name"></el-input>
              </el-form-item>
              <el-form-item label="职务" prop="position">
                <el-input v-model="contactForm.position"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="contactForm.mobile"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="contactForm.email"></el-input>
              </el-form-item>
              <el-form-item align="center">
                <el-button data-dismiss="modal">取消</el-button>
                <el-button type="primary" @click="addContact">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "addVisit",
  data() {
    return {
      form: {
        client_company: "",
        visiting_content: "",
        visiting_date: "",
        contactJson: {
          name: "",
          mobile: "",
          email: "",
          position: ""
        },
        contact: [],
        linkman: "",
        together: "",
        images: []
      },
      rules: {
        client_company: [
          { required: true, message: "公司名称", trigger: "blur" }
        ],
        visiting_content: [
          { required: true, message: "拜访内容", trigger: "blur" }
        ]
      },
      fileList: [],
      addContactModal: false,
      contactForm: {
        name: '',
        position: '',
        mobile: '',
        email: ''
      },
      contactRule: {
        name: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        position: [
          { required: true, message: "职务不能为空", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机不能为空", trigger: "blur" }
        ],
      }
    };
  },
  props: {
    rows: Object
  },
  methods: {
    changeContact(val) {
      this.form.contactJson = val;
      this.form.linkman = val.name;
    },
    addContact() {
      let that = this;
      this.$refs["contactForm"].validate(v => {
        if (!v) return false;
        that.$post(`customers/create_contact`, {
          customer_id: that.rows.id,
          contact: JSON.stringify([that.contactForm])
        })
        .then(response => {
          if (response.status != 200) return false;
          that.form.linkman = that.contactForm.name;
          that.form.contactJson = that.contactForm;
          that.form.contact.push(that.contactForm);
          $("#customer .addContact").modal("hide");
          that.contactForm = {
            name: '',
            position: '',
            mobile: '',
            email: ''
          };
        })
        .catch(err => console.error(err));
      })
    },
    upload(file) {
      let that = this,
        form = new FormData();
      form.append("upload", file);
      form.append("slug", "visit_images");
      that
        .$upload("files/upload", form)
        .then(response => {
          if (response.status != 200) return false;
          that.fileList.push({ 
            name: response.data.upload.name,
            url: response.data.upload.url,
            id: response.data.upload.id
          });
          that.form.images.push(response.data.upload.id);
        })
        .catch(err => console.error(err));
    },
    handleRemove(file, fileList) {
      let index = this.form.images.indexOf(file.id);
      this.fileList.splice(index, 1);
      this.form.images.splice(index, 1);
    },
    onSubmit() {
      let that = this;
      this.$refs["form"].validate(v => {
        if (!v) return false;
        that
          .$post(`customers/visit/create`, {
            slug: that.rows.slug || undefined,
            access_at: that.form.access_at,
            client_company: that.form.client_company,
            contact: JSON.stringify(that.form.contactJson),
            together: that.form.together,
            visiting_content: that.form.visiting_content,
            images: that.form.images.join(',')
          })
          .then(response => {
            if (response.status != 200) return false;
            that.$emit("refresh");
            that.close();
            that.clearForm();
          })
          .catch(err => console.error(err));
      });
    },
    clearForm() {
      this.$refs["form"].resetFields();
    },
    close() {
      this.$store.commit("changeModal", "addVisitModal");
    }
  },
  computed: mapState(["addVisitModal"]),
  watch: {
    addContactModal(val) {
      $("#customer .addContact").modal("show");
    },
    addVisitModal(val) {
      this.form.client_company = this.rows.name;
      this.form.contact = this.rows.contact;
    }
  }
};
</script>
<style lang="less">
#addVisit {
  .modalBoxMain {
    max-width: 820px;
    width: 100%;
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 33%;
        .el-form-item__content {
          display: flex;
        }
        &:last-child {
          margin-bottom: 0;
          .el-form-item__content {
            .el-upload {
              text-align: center;
            }
            .el-upload-list {
              max-height: 250px;
              overflow: auto;
            }
            .el-upload__input {
              opacity: 0;
              display: none;
            }
          }
        }
      }
      .widthFull {
        width: 100%;
      }
    }
  }
}
.addContact {
  .modal-body {
    padding: 30px;
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 50%;
        &:last-child {
          width: 100%;
          margin-bottom: 0px;
          .el-form-item__content {
            margin-left: 0 !important;
          }
        }
      }
    }
  }
}
</style>

