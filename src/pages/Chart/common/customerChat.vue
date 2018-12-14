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
            <div id="customer">
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
// import message from "@/pages/chart/view/message";
import fileImg from "@/assets/img/file.png";

export default {
  name: "customerChat",
  data() {
    return {
      fileImg: fileImg,
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      customer: {},
      message: "",
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
      // if (that.customer.id) return false;
      that
        .$get(`workerman/service_set/member`, {
          company_id: that.companyId
        })
        .then(response => {
          if (response.status != 200) return false;
          localStorage.setItem("customer", JSON.stringify(response.data));
          that.customer = response.data;
          this.getRecord({
            id: that.customer.id,
            username: that.customer.display_name
          });
        })
        .catch(err => {});
    },
    getRecord({ id, username }) {
      let that = this,
        url = null,
        params = {
          page: ++that.record.pagination.current_page,
          to_user_id: id
        },
        pcHeight = document.getElementById("customer").scrollHeight,
        moblieHeight = document.getElementsByClassName("chatMain")[0]
          .scrollHeight;

      that
        .$get("chat/record", params)
        .then(response => {
          if (response.status != 200 || response.data.list.length == 0)
            return false;

          if (response.pagination.current_page == 1) {
            that.record.list = response.data.list;
            that.fixLocation();
          } else {
            response.data.list.reverse();
            response.data.list.forEach(e => that.record.list.unshift(e));
            setTimeout(() => {
              document.getElementById("customer").scrollTop =
                document.getElementById("customer").scrollHeight - pcHeight;
              document.getElementsByClassName("chatMain")[0].scrollTop =
                document.getElementsByClassName("chatMain")[0].scrollHeight -
                moblieHeight;
            }, 100);
          }
          that.record.pagination = response.pagination;
        })
        .catch(error => console.error(error));
    },
    // 发信息
    sendMessage() {
      let that = this,
        params = {
          req: {
            type: 1,
            content: that.message,
            from_name: this.user.user.display_name,
            avatar: this.user.user.avatar,
            to_uid: this.customer.id
          }
        };

      if (
        that.message == "" ||
        that.message.replace(/[\r\n]/g, "").length == 0
      ) {
        this.$message({ message: "发送消息不能为空", type: "error" });
        that.message = "";
        return false;
      }
      params.action = "chat";
      this.webSocketSend(params);
      this.record.list.push({
        from_user_id: that.user.user.id,
        from_user: {
          from_user_id: that.user.user.id,
          avatar: that.user.user.avatar,
          display_name: that.user.user.display_name
        },
        created_at: new Date().toLocaleString(),
        msg_type: 1,
        content: that.message
      });
      this.message = "";
    },
    // 发文件
    uploadFile(file) {
      let form = new FormData(),
        that = this;

      if (file.size / 1024 / 1024 <= 100) {
        form.append("file", file);
        that.upload(form, 3);
      } else if (file.size / 1024 / 1024 <= 500) {
        this.$notify({
          title: "文件太大暂时不能上传",
          message: "文件太大暂时无法上传"
        });
      } else if (file.size / 1024 / 1024 > 500) {
        this.$message.error("上传文件大小不能超过 500MB!");
        return false;
      }
    },
    // 发图片
    uploadImg(file) {
      let form = new FormData(),
        that = this;
      switch (file.type) {
        case "image/jpeg":
        case "image/png":
        case "image/x-icon":
          // case 'image/svg+xml':
          if (file.size / 1024 / 1024 > 10) {
            this.$message.error("上传图像大小不能超过 10MB!");
            return false;
          }
          break;
        default:
          this.$message.error("上传头像图片只能是 JPG / PNG / ico 格式!");
          return false;
          break;
      }
      form.append("file", file);
      that.upload(form, 2);
    },
    upload(form, type) {
      let that = this,
        params = {
          req: {
            type: type,
            from_name: this.user.user.display_name,
            avatar: this.user.user.avatar,
            to_uid: this.customer.id
          }
        };
      that
        .$upload("chat/upload_file", form)
        .then(response => {
          if (response.status != 200) return false;

          params.action = "chat";
          params.req.to_uid = that.customer.id;
          params.req.content = response.data.path;
          that.webSocketSend(params);

          let data = {
            from_user_id: that.user.user.id,
            from_user: {
              from_user_id: that.user.user.id,
              avatar: that.user.user.avatar,
              display_name: that.user.user.display_name
            },
            created_at: new Date().toLocaleString(),
            msg_type: type,
            content: response.data.path
          };
          that.record.list.push(data);
        })
        .catch(error => console.error(error));
    },
    webSocket() {
      let socketAddress = this.$store.state.socketAddress;
      this.ws = new WebSocket(socketAddress);
      this.ws.onmessage = event => {
        let result = JSON.parse(event.data);
        switch (result.action) {
          case "init":
            this.webSocketLogin();
            break;
          case "login":
            if (result.resp.code != 200) {
              this.webSocketLogin();
              return false;
            } else {
              this.connectNum = 0;
              clearInterval(this.pong);
              this.pong = setInterval(() => {
                this.webSocketSend({
                  action: "pong",
                  req: {
                    message: "hello"
                  }
                });
              }, 5000);
            }
          case "pong":
            break;
          case "chat":
            console.log(result);
            switch (result.resp.type) {
              case 1:
              case "1":
              // 文字消息
              case 2:
              case "2":
              // 图片消息
              case 3:
              case "3":
              // 产品
              case 4:
              case "4":
              // 语音消息
              case 5:
              case "5":
              // 视频消息
              case 6:
              case "6":
                // 位置消息
                if (result.resp_event == 200) {
                  if (result.resp.from_uid == this.customer.id) {
                    this.record.list.push({
                      from_user_id: result.resp.from_uid,
                      from_user: {
                        from_user_id: result.resp.from_uid,
                        avatar:
                          result.resp.avatar ||
                          "https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/default_avatar/%E5%A4%B4%E5%83%8Fxhdpi.png",
                        display_name: this.userName
                      },
                      created_at: new Date().toLocaleString(),
                      msg_type: result.resp.type,
                      content: result.resp.content
                    });
                  }
                  this.$notify({
                    title: `收到一条新消息`,
                    message: result.resp.content
                  });
                  let notification = new Notification("收到一条新消息", {
                    body: result.resp.content
                  });
                }
                break;
              case "7":
                // 广播消息
                break;
            }
            this.fixLocation();
            break;
          case "group":
            console.log(result);
            if (result.resp_event == 200) {
              this.$notify({
                title: `收到一条新消息`,
                message: result.resp.content
              });
              let notification = new Notification(`收到一条新消息`, {
                body: result.resp.content
              });
            }
            this.fixLocation();
            break;
          case "notice":
            console.log(result);
            this.$notify({
              title: `您有一条来自${result.resp.from_name}的通知`,
              message: result.resp.content
            });
            let notification = new Notification(
              `您有一条来自${result.resp.from_name}的通知`,
              {
                body: result.resp.content
              }
            );
            // this.getNotices();
            break;
          case "close":
            this.webSocketClose();
            break;
          default:
            console.log("抛出");
            console.log(result);
            break;
        }
      };
      this.ws.onclose = this.ws.onerror = () => {
        this.connectNum++;
        this.reconnect(socketAddress);
      };
    },
    reconnect(url) {
      if (this.lockReconnect) return false;
      this.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      if (this.connectNum > 3) this.webSocketClose();
      setTimeout(() => {
        this.webSocket(url);
        this.lockReconnect = false;
      }, 2000);
    },
    webSocketLogin() {
      this.webSocketSend({
        action: "login",
        req: {
          token: this.user.token
        }
      });
    },
    webSocketSend(action) {
      this.ws.send(JSON.stringify(action));
      this.fixLocation();
    },
    webSocketClose() {
      this.ws.close();
    },
    fixLocation() {
      setTimeout(() => {
        document.getElementById("customer").scrollTop = document.getElementById(
          "customer"
        ).scrollHeight;
        document.getElementsByClassName(
          "chatMain"
        )[0].scrollTop = document.getElementsByClassName(
          "chatMain"
        )[0].scrollHeight;
      }, 100);
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
    }
  },
  mounted() {
    this.$refs.uploadBox.ondragover = this.$refs.uploadBox.ondragleave = this.$refs.uploadBox.ondragenter = e => {
      if (e.preventDefault) e.preventDefault();
      else window.event.returnValue == false;
    };
    this.$refs.uploadBox.ondrop = e => {
      if (e.preventDefault) e.preventDefault();
      else window.event.returnValue == false;
      const data = e.dataTransfer.files; // 获取文件对象
      if (data.length < 1) {
        return false; // 检测是否有文件拖拽到页面
      }
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        this.uploadFile(e.dataTransfer.files[i]);
      }
    };
    // 粘贴上传
    document.getElementById("el-textarea").addEventListener("paste", e => {
      for (var i = 0; i < e.clipboardData.items.length; i++) {
        // 检测是否为图片类型
        if (
          e.clipboardData.items[i].kind == "file" &&
          /image\//.test(e.clipboardData.items[i].type)
        ) {
          var imageFile = e.clipboardData.items[i].getAsFile();
          // console.log(imageFile)
          this.uploadImg(imageFile);
          break;
        }
      }
    });
    // 分页
    document.getElementById(
      "customer"
    ).onscroll = document.getElementsByClassName(
      "chatMain"
    )[0].onscroll = e => {
      if (
        !e.target.scrollTop &&
        this.record.pagination.total > 15 &&
        this.record.pagination.total / 15 > this.record.pagination.current_page
      )
        this.getRecord({
          id: this.customer.id,
          username: this.customer.display_name
        });
    };

    Notification.requestPermission(status => console.log(status));
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
    top: 180px;
    @media screen and (max-width: 510px) {
      top: 0px;
    }
    .modalBoxMain {
      width: 500px;
      max-width: 100%;
      margin-top: 0px;
      @media screen and (max-width: 510px) {
        max-height: 100%;
      }
      #customer {
        overflow-y: auto;
        border-bottom: @chatBorder;
        height: 350px !important;
        .chatMain {
          padding: 2rem 1.5rem 1rem 1.5rem;
          @media screen and (max-width: 820px) {
            height: 20rem;
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
