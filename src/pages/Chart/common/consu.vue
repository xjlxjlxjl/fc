<template>
  <transition name="el-fade-in-linear">
    <div id="customerChat" v-show="chatModal">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">{{ companyName }}（{{ customer.display_name }}）</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="chatMain">
              <div class="chatMain">
                <div v-for="(item,index) in record.list" :key="index" class="chatMessage">
                  <div v-if="item.from_user_id != customer.id" class="formMessage">
                    <div class="messgaeBox">
                      <p class="messageUser" align="right">
                        <span>{{ item.created_at }}</span>
                        <span v-if="item.user">{{ item.user.remark || item.user.display_name }}</span>
                      </p>
                      <div class="Bubble"></div>
                      <div class="messgaeCentent">
                        <span v-if="item.msg_type == 1 || item.type == 1">{{ item.content }}</span>
                        <img
                          v-else-if="item.msg_type == 2 || item.type == 2"
                          :src="item.content"
                          class="messageImg"
                          preview="2"
                          @click="showImg()"
                        >
                        <div v-else-if="item.msg_type == 3 || item.type == 3" class="goodsMsg">
                          <img :src="fileImg">
                          <div>
                            <h1>{{ item.content.split('/').pop() }}</h1>
                            <br>
                            <a target="_blank" :href="item.content">下载</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <img
                      :src="user.user.avatar || 'https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/default_avatar/头像xhdpi.png'"
                    >
                  </div>
                  <div v-else class="toMessage">
                    <img :src="customer.avatar">
                    <div class="messgaeBox">
                      <p class="messageUser">
                        <span v-if="item.user">{{ item.user.remark || item.user.display_name }}</span>
                        <span>{{ item.created_at }}</span>
                      </p>
                      <div class="Bubble"></div>
                      <div class="messgaeCentent">
                        <span v-if="item.msg_type == 1 || item.type == 1">{{ item.content }}</span>
                        <img
                          v-else-if="item.msg_type == 2 || item.type == 2"
                          :src="item.content"
                          class="messageImg"
                          preview="2"
                          @click="showImg()"
                        >
                        <div v-else-if="item.msg_type == 3 || item.type == 3" class="goodsMsg">
                          <img :src="fileImg">
                          <div>
                            <h1>{{ item.content.split('/').pop() }}</h1>
                            <!-- <span>{{ item.content }}</span> -->
                            <br>
                            <a target="_blank" :href="item.content">下载</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modalBoxMainBtn">
            <div ref="uploadBox">
              <el-upload
                class="file-upload"
                action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                :show-file-list="false"
                :before-upload="uploadFile"
              >
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-upload
                class="avatar-uploader"
                action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                :show-file-list="false"
                :before-upload="uploadImg"
              >
                <i class="el-icon-picture avatar-uploader-icon"></i>
              </el-upload>
              <el-input
                type="textarea"
                id="el-textarea"
                ref="uploadText"
                v-model="message"
                @keyup.13.native="sendMessage"
              ></el-input>
              <div class="btnBox">
                <el-button type="primary" size="mini" @click="sendMessage">发送</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import fileImg from "@/assets/img/file.png";
import message from "@/pages/Chart/view/message";
import "vue-photo-preview/dist/skin.css";

export default {
  name: "consu",
  data() {
    return {
      fileImg: fileImg,
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      customer: {},
      message: "",
      state: 1,
      connectNum: 0,
      inView: true,
      record: {
        list: [],
        pagination: {
          current_page: 0,
          total: 1
        }
      }
    };
  },
  props: {
    companyId: Number,
    companyName: String
  },
  methods: {
    getServiceUser() {
      let that = this;
      console.log(that.companyId);
      that
        .$get(`workerman/service_set/member`, {
          company_id: that.companyId
        })
        .then(response => {
          if (response.status != 200) {
            that.close();
            return false;
          }
          localStorage.setItem("customer", JSON.stringify(response.data));
          that.customer = response.data;
          that.toUser = response.data.id;
          this.getRecord({
            id: that.customer.id,
            username: that.customer.display_name
          });
        })
        .catch(err => {});
    },
    getRecord({ id, username }) {
      message.methods.getRecord.call(this, { id: id, username: username });
    },
    showImg() {
      this.$preview.on("imageLoadComplete", (e, item) => console.log());
    },
    // 发信息
    sendMessage() {
      message.methods.sendMessage.call(
        this,
        0,
        this.toUser,
        1,
        this.message,
        1
      );
    },
    // 发文件
    uploadFile(file) {
      message.methods.uploadFile.call(this, file);
    },
    // 发图片
    uploadImg(file) {
      message.methods.uploadImg.call(this, file);
    },
    upload(form, type) {
      message.methods.upload.call(this, form, type);
    },
    send(url, data, params, type) {
      message.methods.send.call(this, url, data, params, type);
    },
    notify() {},
    webSocket() {
      message.methods.webSocket.call(this);
    },
    reconnect(url) {
      message.methods.reconnect.call(this, url);
    },
    webSocketLogin() {
      message.methods.webSocketLogin.call(this);
    },
    webSocketSend(action) {
      message.methods.webSocketSend.call(this, action);
    },
    webSocketClose() {
      message.methods.webSocketClose.call(this);
    },
    finishingPictures() {
      message.methods.finishingPictures.call(this);
    },
    fixLocation() {
      message.methods.fixLocation.call(this);
    },
    close() {
      this.$store.commit("changeModal", "chatModal");
    }
  },
  computed: mapState(["chatModal"]),
  watch: {
    chatModal(newVal) {
      if (!newVal) return false;
      this.getServiceUser();
    },
    record: {
      handler(val) {
        this.$previewRefresh();
      },
      deep: true
    }
  },
  beforeDestroy() {
    this.webSocketClose();
  },
  mounted() {
    message.mounted.call(this);
  },
  created() {
    this.webSocket();
  }
};
</script>
<style lang="less">
@FFF: #ffffff;
@white: #eeeeee;
@gery: #666666;
@black: #1d1d1d;
@blue: #0064db;
@border: 1px solid @gery;
@listBackground: @white;
@hoverBackground: #e6e6e6;
@background: #dedede;
@chatBackground: #fffefe;
@chatBorder: 1px solid #dedede;

.Bubble() {
  padding: 0;
  margin: 0;
  width: 0px;
  height: 0px;
  box-sizing: content-box;
  position: absolute;
  top: 3rem;
}
#customerChat {
  .modalBox {
    // top: 180px;
    @media screen and (max-width: 510px) {
      top: 80px;
    }
    .modalBoxMain {
      width: 500px;
      max-width: 100%;
      margin-top: 0px;
      @media screen and (max-width: 510px) {
        max-height: 100%;
      }
      #chatMain {
        overflow-y: auto;
        height: 500px;
        @media screen and (max-width: 510px) {
          max-height: 225px;
        }
        border-bottom: @chatBorder;
        .chatMain {
          padding: 2rem 1.5rem 1rem 1.5rem;
          @media screen and (max-width: 820px) {
            height: 15rem;
            overflow-y: auto;
          }
          .chatMessage {
            position: relative;
            .messageImg {
              max-width: 200px;
              position: inherit;
              background-color: #fff;
            }
            .formMessage {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              > img {
                width: 36px;
                height: 36px;
                position: absolute;
                top: 1rem;
              }
              .messgaeBox {
                position: relative;
                box-sizing: border-box;
                padding: 1rem;
                padding-right: 1rem;
                color: @FFF;
                word-break: break-word;
                margin-right: 36px;
                .messageUser {
                  color: @gery;
                }
                .messgaeCentent {
                  background-color: @blue;
                  border-radius: 8px;
                  padding: 1rem;
                  width: fit-content;
                  float: right;
                  .goodsMsg {
                    display: flex;
                    align-items: center;
                    width: 250px;
                    height: 100px;
                    img {
                      position: inherit;
                      width: 5rem;
                      height: 5rem;
                    }
                    div {
                      padding: 0.5rem;
                      span {
                        max-height: 60px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        word-wrap: break-word;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 3;
                      }
                      a {
                        color: @white;
                      }
                    }
                  }
                }
                .Bubble {
                  .Bubble();
                  right: 0;
                  border-top: 0.5rem solid @FFF;
                  border-left: 0.5rem solid @blue;
                  border-right: 0.5rem solid @FFF;
                  border-bottom: 0.5rem solid @FFF;
                }
              }
            }
            .toMessage {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              > img {
                width: 36px;
                height: 36px;
                position: absolute;
                top: 1rem;
              }
              .messgaeBox {
                position: relative;
                box-sizing: border-box;
                padding: 1rem;
                padding-left: 1rem;
                color: @FFF;
                word-break: break-word;
                margin-left: 36px;
                .messageUser {
                  color: @gery;
                }
                .messgaeCentent {
                  background-color: @white;
                  color: @gery;
                  border-radius: 8px;
                  padding: 1rem;
                  width: fit-content;
                  .goodsMsg {
                    display: flex;
                    align-items: center;
                    width: 200px;
                    height: 70px;
                    img {
                      position: inherit;
                      width: 5rem;
                      height: 5rem;
                      margin-right: 0.5rem;
                    }
                    div {
                      padding: 0.5rem;
                      word-break: break-all;
                      span {
                        max-height: 60px;
                        min-height: 50px;
                        margin: 0.3rem 0;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        word-wrap: break-word;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 3;
                      }
                      a {
                        color: @gery;
                      }
                    }
                  }
                }
                .Bubble {
                  .Bubble();
                  left: 0;
                  border-top: 0.5rem solid @FFF;
                  border-left: 0.5rem solid @FFF;
                  border-right: 0.5rem solid @white;
                  border-bottom: 0.5rem solid @FFF;
                }
              }
            }
          }
        }
        &::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      }
    }
    .modalBoxMainBtn {
      box-sizing: border-box;
      padding: 1rem 1.5rem 1rem 1.5rem;
      position: relative;
      .file-upload,
      .avatar-uploader {
        display: inline-block;
        i {
          font-size: 2rem;
          margin: 0 0.5rem;
        }
      }
      textarea {
        border: none;
        resize: none;
      }
      .btnBox {
        margin-top: 1rem;
        text-align: right;
      }
    }
  }
}
</style>