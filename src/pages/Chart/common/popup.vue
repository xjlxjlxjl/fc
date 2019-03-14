<template>
  <div id="popup" ref="popup" v-show="modal">
    <fileListModal :toUser="toUser" :state="state"></fileListModal>
    <right-menu :pop-items="popItems" :mouse="mousePosition" @ListItemClick="menuClick"></right-menu>
    <div class="popRise" @mousemove="mousemove">
      <div>
        <span>{{ userName }}</span>
      </div>
      <div>
        <i class="el-icon-download" @click="showFileList"></i>
        <i class="el-icon-close" @click="$emit('change')"></i>
      </div>
    </div>
    <div id="chatMain" class="popMian">
      <div class="chatMain">
        <div v-for="(item,index) in record.list" :key="index" class="chatMessage">
          <div
            v-if="item.msg_type == 0 || item.msg_type == 10 || item.type == 0 || item.type == 10"
            class="toast"
          >
            <span>{{ item.content }}</span>
          </div>
          <div
            v-else-if="item.from_user_id == user.user.id || item.user_id == user.user.id"
            class="formMessage"
          >
            <div class="messgaeBox">
              <p class="messageUser" align="right">
                <span>{{ item.created_at }}</span>
                <span v-if="item.user">{{ item.user.remark || item.user.display_name }}</span>
              </p>
              <div class="Bubble"></div>
              <div class="messgaeCentent" @mousedown="popMenu($event, item)">
                <span v-if="item.msg_type == 1 || item.type == 1">{{ item.content }}</span>
                <img
                  v-else-if="item.msg_type == 2 || item.type == 2"
                  :src="item.content"
                  @click="galleryShow();"
                  preview="1"
                  class="messageImg"
                >
                <div v-else-if="item.msg_type == 3 || item.type == 3" class="goodsMsg">
                  <img :src="fileImg">
                  <div>
                    <h1>{{ item.content.split('/').pop() }}</h1>
                    <!-- <span>{{ item.content }}</span> -->
                    <br>
                    <a
                      href="javascript:;"
                      @click="download(item.content,item.content.split('/').pop())"
                    >下载</a>
                  </div>
                </div>
              </div>
            </div>
            <img
              :src="user.user.avatar || 'https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/default_avatar/头像xhdpi.png'"
            >
          </div>
          <div v-else class="toMessage">
            <img :src="item.from_user ? item.from_user.avatar : item.user.avatar">
            <div class="messgaeBox">
              <p class="messageUser">
                <span v-if="item.user">{{ item.user.remark || item.user.display_name }}</span>
                <span>{{ item.created_at }}</span>
              </p>
              <div class="Bubble"></div>
              <div class="messgaeCentent" @mousedown="popMenu($event, item)">
                <span v-if="item.msg_type == 1 || item.type == 1">{{ item.content }}</span>
                <img
                  v-else-if="item.msg_type == 2 || item.type == 2"
                  :src="item.content"
                  @click="galleryShow();"
                  preview="1"
                  class="messageImg"
                >
                <div v-else-if="item.msg_type == 3 || item.type == 3" class="goodsMsg">
                  <img :src="fileImg">
                  <div>
                    <h1>{{ item.content.split('/').pop() }}</h1>
                    <!-- <span>{{ item.content }}</span> -->
                    <br>
                    <a
                      href="javascript:;"
                      @click="download(item.content,item.content.split('/').pop())"
                    >下载</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popTail">
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
</template>
<script>
import fileImg from "@/assets/img/file.png";
import fileList from "@/pages/Chart/common/fileList";
import "vue-photo-preview/dist/skin.css";

export default {
  data() {
    return {
      fileImg: fileImg,
      user: JSON.parse(localStorage.getItem("user")) || null,
      message: "",
      // 右键效果
      members: {},
      popItems: this.$store.state.msg.popItems,
      mousePosition: [],
      forwardData: {},
      // 移动
      isMove: false
    }
  },
  components: {
    fileListModal: fileList
  },
  props: {
    record: Object,
    toUser: Number,
    userName: String,
    state: Number,
    modal: Boolean
  },
  methods: {
    // 发信息
    sendMessage(
      $event = 0,
      toUser = this.toUser,
      msgType = 1,
      message = this.message,
      state = this.state
    ) {
      let that = this,
        url = null,
        data = {
          content: message,
          msg_type: msgType
        },
        params = {
          req: {
            type: msgType,
            content: message,
            from_name: this.user.user.display_name,
            avatar: this.user.user.avatar
          }
        };

      if (msgType == 1) {
        if (message == "" || message.replace(/[\r\n]/g, "").length == 0) {
          this.$message({ message: "发送消息不能为空", type: "error" });
          message = "";
          return false;
        }
        if (message.length > 1000) {
          this.$message({ message: "消息内容不能超过1000个字", type: "error" });
          return false;
        }
      }
      if (state == 1) {
        params.action = "chat";
        params.req.to_uid = toUser;
        url = `chat/message/create`;
        data.to_uid = toUser;
      } else if (state == 2) {
        params.action = "group";
        params.req.to_group_id = toUser;
        url = `group/message/create`;
        data.to_group_id = toUser;
      } else return false;

      that.message = "";
      that.$emit('send', url, data, params, msgType);
    },
    // 发文件
    uploadFile(file) {
      console.log(file)
      let form = new FormData(),
        that = this;

      if (file.size / 1024 / 1024 <= 100) {
        form.append("file", file);
        that.upload(form, 3);
      } else if (file.size / 1024 / 1024 <= 500)
        this.$notify({
          title: "文件太大暂时不能上传",
          message: "文件太大暂时无法上传"
        });
      else if (file.size / 1024 / 1024 > 500)
        this.$message.error("上传文件大小不能超过 500MB!");
    },
    // 发图片
    uploadImg(file) {
      let form = new FormData(),
        that = this,
        reader = new FileReader();
      switch (file.type) {
        case "image/jpeg":
        case "image/png":
        case "image/svg+xml":
        case "image/x-icon":
          if (file.size / 1024 / 1024 > 10) {
            this.$message.error("上传图像大小不能超过 10MB!");
            return false;
          }
          break;
        default:
          this.$message.error("上传图片只能是 JPG / PNG / SVG / ico 格式!");
          return false;
          break;
      }
      reader.readAsDataURL(file);
      reader.onload = e => {
        this.$alert(
          `<img src="${
            reader.result
          }" style="max-height: 500px;max-width: 100%;">`,
          "上传",
          {
            dangerouslyUseHTMLString: true
          }
        )
          .then(result => {
            form.append("file", file);
            that.upload(form, 2);
          })
          .catch(err => console.error("err", err));
      };
    },
    upload(form, type) {
      let that = this,
        url = null,
        data = {
          msg_type: type
        },
        params = {
          req: {
            type: type,
            from_name: this.user.user.display_name,
            avatar: this.user.user.avatar
          }
        };
      that
        .$upload("chat/upload_file", form)
        .then(response => {
          if (response.status != 200) return false;

          if (that.state == 1) {
            params.action = "chat";
            params.req.to_uid = that.toUser;
            url = `chat/message/create`;
            data.to_uid = that.toUser;
          } else if (that.state == 2) {
            params.action = "group";
            params.req.to_group_id = that.toUser;
            url = `group/message/create`;
            data.to_group_id = that.toUser;
          } else return false;

          params.req.content = response.data.path;
          data.content = response.data.path;
          that.$emit('send', url, data, params, type);
        })
        .catch(error => console.error(error));
    },
    // 右键弹窗
    popMenu(e, item) {
      let that = this;
      this.e = e;
      // e.preventDefault();
      if (e.button === 2) {
        let x = e.clientX,
          y = e.clientY;
        that.mousePosition = [x, y];
        that.forwardData = item;
      } else if (e.button === 0) that.mousePosition = ["close"];
    },
    menuClick(i) {
      this.$emit('menuClick', i, this.e, this.forwardData);
      this.e = null;
      this.mousePosition = ["close"];
    },
    galleryShow() {
      this.$preview.on("imageLoadComplete", (e, item) => console.log());
    },
    showFileList() {
      fileList.methods.close.call(this);
    },
    fixLocation() {
      setTimeout(() => {
        let $chatMain = document.getElementById("chatMain"),
          chatMain = document.getElementsByClassName("chatMain")[0];
        $chatMain.scrollTop = $chatMain.scrollHeight;
        chatMain.scrollTop = chatMain.scrollHeight;
      }, 100);
    },
    resizePosition() {
      this.$refs.popup.style.left = (window.innerWidth - 600) / 2 + 'px';
      this.$refs.popup.style.top = (window.innerHeight - 520) / 2 + 'px';
    },
    // 长按移动
    mousemove(event) {
      if(!this.isMove) return false;
      this.$refs.popup.style.top = Math.abs(event.clientY) - 30 + 'px';
      this.$refs.popup.style.left = Math.abs(event.clientX) - 300 + 'px';
    }
  },
  watch: {
    record: {
      handler(val) {
        this.$previewRefresh();
      },
      deep: true
    }
  },
  mounted() {
    this.resizePosition();
    let that = this,
      $uploadBox = this.$refs["uploadBox"],
      $elTextarea = document.getElementById("el-textarea"),
      $chatMain = document.getElementById("chatMain"),
      chatMain = document.getElementsByClassName("chatMain")[0],
      popRise = document.querySelector('.popRise'),
      body = document.querySelector('body');

    body.onclick = e => (that.mousePosition = ["close"]);
    popRise.onmousedown = e => (this.isMove = true);
    popRise.onmouseup = popRise.onmouseout = e => (this.isMove = false);

    $uploadBox.ondragover = $uploadBox.ondragleave = $uploadBox.ondragenter = e => {
      if (e.preventDefault) e.preventDefault();
      else window.event.returnValue == false;
    };
    $uploadBox.ondrop = e => {
      if (e.preventDefault) e.preventDefault();
      else window.event.returnValue == false;
      const data = e.dataTransfer.files; // 获取文件对象
      if (data.length < 1) return false; // 检测是否有文件拖拽到页面
      for (const item of data) {
        switch (item.type) {
          case "image/jpeg":
          case "image/png":
          case "image/svg+xml":
          case "image/x-icon":
            this.uploadImg(item);
            break;
          default:
            this.uploadFile(item);
            break;
        }
      }
    };
    // 粘贴上传
    $elTextarea.addEventListener("paste", e => {
      for (const item of e.clipboardData.items) {
        // 检测是否为图片类型
        if (item.kind == "file" && /image\//.test(item.type))
          this.uploadImg(item.getAsFile());
      }
    });
    // 分页
    $chatMain.onscroll = chatMain.onscroll = e => {
      const page = this.record.pagination,
        total = page.total > 15,
        current_page = page.total / 15 > page.current_page;
      if (!e.target.scrollTop && total && current_page)
        this.$emit('getRecord', {
          id: this.toUser,
          username: this.userName,
          index: this.key
        });
    };


    Notification.requestPermission(status => console.log(status));
  },
  created() {
    window.onresize = e => this.resizePosition();
  }
}
</script>
<style lang="less">
@grey: #d9d9d9;
@gery: #666666;
@smallGrey: #f6f6f6;
@white: #ffffff;
@blue: #197ef7;
@eee: #eeeeee;
@dedede: #dedede;
@e6e6e6: #e6e6e6;
@black: #1d1d1d;
@shadow: 1px 1px 50px rgba(0, 0, 0, 0.3);
@border: 1px solid @grey;
@menuBoxColor: #f1f1f1;
@menuBoxBorder: 1px solid @menuBoxColor;

.Bubble() {
  padding: 0;
  margin: 0;
  width: 0px;
  height: 0px;
  box-sizing: content-box;
  position: absolute;
  top: 3rem;
}

#popup {
  position: fixed;
  z-index: 12;
  width: 600px;
  height: 520px;
  background-color: @white;
  box-shadow: @shadow;
  .popRise {
    display: flex;
    justify-content: space-between;
    background-color: @smallGrey;
    color: @black;
    padding: 1.5rem;
    cursor: move;
    div {
      span,
      i {
        font-size: 2rem;
        font-weight: bold;
      }
      span {
        cursor: default;
      }
      i {
        cursor: pointer;
        &:hover {
          color: @gery;
        }
      }
    }
  }
  .popMian {
    height: 315px;
    overflow-y: auto;
    box-sizing: border-box;
    .chatMain {
      position: relative;
      padding: 2rem 2.5rem 1rem 1.5rem;
      @media screen and (max-width: 820px) {
        height: 20rem;
        overflow-y: auto;
      }
      .toast {
        text-align: center;
        margin-bottom: 15px;
        span {
          padding: 5px;
          border-radius: 10px;
          color: @white;
          background-color: #bdb9b9;
        }
      }
      .chatMessage {
        position: relative;
        .messageImg {
          max-width: 200px;
          position: inherit;
          background-color: @white;
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
            color: @white;
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
              border-top: 0.5rem solid @white;
              border-left: 0.5rem solid @blue;
              border-right: 0.5rem solid @white;
              border-bottom: 0.5rem solid @white;
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
            color: @white;
            word-break: break-word;
            margin-left: 36px;
            .messageUser {
              color: @gery;
            }
            .messgaeCentent {
              background-color: @eee;
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
              border-top: 0.5rem solid @white;
              border-left: 0.5rem solid @white;
              border-right: 0.5rem solid @eee;
              border-bottom: 0.5rem solid @white;
            }
          }
        }
      }
    }
  }
  .popTail {
    border-top: @border;
    box-sizing: border-box;
    padding: 1rem 0.5rem 0rem 0.5rem;
    position: relative;
    .file-upload,
    .avatar-uploader {
      display: inline-block;
      i {
        font-size: 2rem;
        margin: 0 0.5rem;
        color: @black;
      }
    }
    .el-textarea {
      margin-top: .5rem;
      textarea {
        border: none;
        resize: none;
        padding: 0;
        height: 65px;
      }
    }
    .btnBox {
      margin-top: .5rem;
      text-align: right;
    }
  }

  .menu-box {
    position: fixed;
    padding: 0;
    border-radius: 4px;
    > ul {
      list-style: none;
      background-color: @white;
      overflow: hidden;
      box-sizing: border-box;
      border-radius: 4px;
      > li {
        min-width: 125px;
        display: list-item;
        box-sizing: border-box;
        text-decoration: none;
        color: @gery;
        font-size: 14px;
        border-bottom: @menuBoxBorder;
        text-align: left;
        &:last-child {
          border-bottom: none;
        }
        &:hover {
          background-color: @menuBoxColor;
        }
      }
    }
  }
}
</style>
