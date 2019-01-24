<template>
  <div id="message" @click="mousePosition = ['close']">
    <!-- 踢出群聊，邀请群聊（ 0：邀请，1：添加 ） -->
    <groupUserCheckBox
      :groupId="groupId"
      :groupUser="groupUserList"
      :group="groupList.list"
      :groupState="groupState"
      @send="menuClick"
      @refresh="getChatList"
    ></groupUserCheckBox>
    <!-- 图片画廊 -->
    <!-- <gallery :record="record" :galleryIndex="galleryIndex"></gallery> -->
    <fileListModal :toUser="toUser" :state="state"></fileListModal>
    <right-menu :pop-items="popItems" :mouse="mousePosition" @ListItemClick="menuClick"></right-menu>
    <el-container>
      <el-aside class="pcShowImportant" width="60px" v-show="!mainDisplay">
        <ul class="function">
          <li>
            <img :src="user.user.avatar">
          </li>
          <li v-for="(item,index) in interface" :key="index" v-if="index < 3 || index > 4">
            <i
              :class="item.isDefault ? `is-active ${item.activeIcon}` : item.icon"
              @click="changeView(index)"
              :alt="item.alt"
            ></i>
            <span :class="item.isDefault ? `is-active` : ''">{{ item.alt }}</span>
          </li>
        </ul>
      </el-aside>
      <el-main>
        <el-container>
          <el-aside
            class="pcShowImportant"
            width="250px"
            :id="interface[6].isDefault ? 'notices' : ''"
            v-show="!mainDisplay"
          >
            <div class="search" v-if="interface[2].isDefault || interface[4].isDefault">
              <el-input
                placeholder="搜索群组"
                v-model="searchId"
                size="mini"
                @keyup.13.native="changeView(4)"
              >
                <i slot="prefix" class="el-input__icon el-icon-search" @click="changeView(4)"></i>
              </el-input>
              <button @click="changeView(4)">+</button>
            </div>
            <div class="search" v-else>
              <el-input
                placeholder="搜索用户"
                v-model="searchId"
                size="mini"
                @keyup.13.native="changeView(3)"
              >
                <i slot="prefix" class="el-input__icon el-icon-search" @click="changeView(3)"></i>
              </el-input>
              <button @click="changeView(3)">+</button>
            </div>
            <el-menu default-active="0" v-if="interface[0].isDefault">
              <el-menu-item
                v-for="(item,index) in chatList.list"
                v-if="item.friend_uid != 1 && item.friend_uid != user.user.id"
                :key="index"
                :index="index.toString()"
                @click="state = item.friend_uid ? 1 : 2;getRecord({ id: item.friend_uid || item.group_id, username: item.friend_user ? item.friend_user.remark || item.friend_user.display_name : item.group.group_name, index: index });mainDisplay = true"
              >
                <el-badge
                  :value="item.unread_message_num"
                  class="item"
                  v-if="parseInt(item.unread_message_num)"
                >
                  <div class="avatarBox">
                    <img :src="item.friend_user ? item.friend_user.avatar : item.group.avatar">
                  </div>
                </el-badge>
                <div class="avatarBox" v-else>
                  <img :src="item.friend_user ? item.friend_user.avatar : item.group.avatar">
                </div>
                <span
                  slot="title"
                >{{ item.friend_user ? item.friend_user.remark || item.friend_user.display_name : item.group.group_name }}</span>
                <el-popover placement="right" trigger="hover">
                  <el-button
                    type="danger"
                    size="mini"
                    v-if="item.friend_user"
                    @click="delChat(item.id, index)"
                  >删除</el-button>
                  <el-button
                    size="mini"
                    type="warning"
                    v-else
                    @click="delGroup(item.group_id, index);chatList.list.splice(index, 1);"
                  >退出</el-button>
                  <!-- @click="delGroup(item.group_id, index);delChat(item.id, index)" -->
                  <el-button
                    type="primary"
                    size="mini"
                    v-if="item.friend_user"
                    @click="joinGroup"
                  >创建群聊</el-button>
                  <el-button
                    size="mini"
                    type="info"
                    v-else
                    @click="getGroupUser(item.group_id)"
                  >查看群成员</el-button>
                  <el-button size="mini" slot="reference">操作</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[1].isDefault">
              <el-menu-item
                v-for="(item,index) in friendList.list"
                v-if="item.friend_uid != 1 && item.friend_uid != user.user.id"
                :key="index"
                :index="index.toString()"
                @click="state = 1;getRecord({id: item.id, username: item.remark || item.display_name, index: index });mainDisplay = true"
              >
                <div class="avatarBox">
                  <img :src="item.avatar">
                </div>
                <span slot="title">{{ item.remark || item.display_name }}</span>
                <el-popover placement="right" trigger="hover">
                  <el-button type="danger" size="mini" @click="delUser(item.id,index)">删除</el-button>
                  <el-button type="primary" size="mini" @click="joinGroup">创建群聊</el-button>
                  <el-button type="success" size="mini" @click="setRemarks(item.id,index)">修改备注</el-button>
                  <el-button size="mini" slot="reference">操作</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[2].isDefault">
              <el-menu-item
                v-for="(item,index) in groupList.list"
                :key="index"
                :index="index.toString()"
                @click="state = 2;getRecord({id: item.id, username: item.group_name, index: index });mainDisplay = true"
              >
                <div class="avatarBox">
                  <img :src="item.avatar">
                </div>
                <span slot="title">{{ item.group_name }}</span>
                <el-popover placement="right" trigger="hover">
                  <el-button size="mini" slot="reference">操作</el-button>
                  <el-button
                    size="mini"
                    type="success"
                    @click="editGroup(item.id, item.group_name, item.group_description, index)"
                  >修改群信息</el-button>
                  <el-button size="mini" type="warning" @click="delGroup(item.id, index)">退出</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    v-if="item.admin_id == user.user.id"
                    @click="dissolution(item.id, index)"
                  >解散</el-button>
                  <el-button
                    size="mini"
                    type="primary"
                    v-if="item.admin_id == user.user.id"
                    @click="joinGroup(item.id)"
                  >邀请加入群聊</el-button>
                  <el-button size="mini" type="info" @click="getGroupUser(item.id)">查看群成员</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[3].isDefault">
              <el-menu-item
                v-for="(item,index) in searchList"
                v-if="item.friend_uid != 1 && item.friend_uid != user.user.id"
                :key="index"
                :index="index.toString()"
                @click="state = 1;getRecord({id: item.id, username: item.last_name || item.display_name, index: index });mainDisplay = true"
              >
                <div class="avatarBox">
                  <img :src="item.avatar">
                </div>
                <span slot="title">{{ item.last_name || item.display_name }}</span>
                <el-popover placement="right" trigger="hover">
                  <el-button size="mini" slot="reference">操作</el-button>
                  <el-button size="mini" type="danger" @click="addFriend(item.id)">添加好友</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[4].isDefault">
              <el-menu-item
                v-for="(item,index) in searchList"
                :key="index"
                :index="index.toString()"
              >
                <div class="avatarBox">
                  <img :src="item.avatar">
                </div>
                <span slot="title">{{ item.group_name }}</span>
                <el-popover placement="right" trigger="hover">
                  <el-button size="mini" slot="reference">操作</el-button>
                  <el-button size="mini" type="danger" @click="addGroup(item.id)">加入群组</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[5].isDefault">
              <div v-for="(val,key) in mailList" :key="key">
                <p>{{ val.branch_name }}</p>
                <el-menu-item
                  v-for="(item,index) in val.member"
                  :key="index"
                  :index="item.id.toString()"
                  v-if="item.id != user.user.id"
                  @click="state = 1;getRecord({id: item.id, username: item.display_name, index: index });mainDisplay = true"
                >
                  <div class="avatarBox">
                    <img
                      :src="item.url || 'https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/chat/logo.png'"
                    >
                  </div>
                  <span slot="title">{{ item.display_name }}</span>
                  <el-popover placement="right" trigger="hover">
                    <el-button size="mini" slot="reference">操作</el-button>
                    <el-button size="mini" type="primary" @click="joinGroup">创建群聊</el-button>
                    <el-button size="mini" type="danger" @click="addFriend(item.id)">添加好友</el-button>
                  </el-popover>
                </el-menu-item>
              </div>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[6].isDefault">
              <el-menu-item
                v-for="(item,index) in noticesList.list"
                :key="index"
                :index="index.toString()"
                @click="getNoticesDetail(item, index)"
              >
                <label
                  slot="title"
                >{{ item.from_user ? `${ item.from_user ? item.from_user.last_name ? item.from_user.last_name: item.from_user.display_name ? item.from_user.display_name : '通知' : '通知' }：${ item.message }`: item.message }}</label>
                <el-popover
                  placement="right"
                  trigger="hover"
                  v-if="item.type != 15 && item.type != 4 && item.is_read == 0 && item.is_agree == 0 && item.is_delete == 0"
                >
                  <el-button size="mini" slot="reference">操作</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    v-if="item.type == 3"
                    @click="acceptFriend(item.id)"
                  >添加</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    v-if="item.type == 16"
                    @click="acceptGroup(item.id)"
                  >同意添加</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main class="pcShowImportant" v-show="mainDisplay">
            <el-container v-show="toUser">
              <el-header>
                <div>
                  <span>{{ userName }}</span>
                </div>
                <div class="mobileHide" @click="showFileList">
                  <i class="el-icon-download"></i>
                </div>
                <div class="pcHide" @click="mainDisplay = false">
                  <i class="el-icon-back"></i>
                </div>
              </el-header>
              <el-main id="chatMain">
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
                              <a target="_blank" :href="item.content">下载</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-main>
              <el-footer>
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
              </el-footer>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import fileImg from "@/assets/img/file.png";
import groupUserCheckBox from "@/pages/Chart/common/groupUserCheckBox";
import fileList from "@/pages/Chart/common/fileList";
// import gallery from "@/pages/Chart/common/gallery";
import "vue-photo-preview/dist/skin.css";

export default {
  name: "message",
  data() {
    return {
      fileImg: fileImg,
      user: JSON.parse(localStorage.getItem("user")),
      interface: this.$store.state.msg.interface,
      mainDisplay: false,
      searchId: "",
      chatList: {
        list: []
      },
      friendList: {
        list: []
      },
      groupList: {
        list: []
      },
      searchList: {
        list: []
      },
      mailList: {},
      noticesList: {
        list: [],
        pagination: {
          total: 1,
          current_page: 0
        }
      },
      record: {
        list: [],
        pagination: {
          total: 1,
          current_page: 0
        }
      },
      // 公用变量
      key: 0,
      toUser: 0,
      state: 0,
      userName: "",
      message: "",
      timeOut: null,
      connectNum: 0,
      // 群聊变量
      checkBoxList: [],
      // msgImgArr: [],
      // galleryIndex: 0,
      groupId: 0,
      groupState: 0,
      groupUserList: [],
      // socket
      lockReconnect: false,
      // 右键效果
      members: {},
      popItems: this.$store.state.msg.popItems,
      mousePosition: [],
      forwardData: {}
    };
  },
  methods: {
    changeView(index) {
      this.interface.forEach((e, k) => {
        if (index == k) e.isDefault = true;
        else e.isDefault = false;
      });
      switch (index) {
        case 0:
          this.getChatList();
          break;
        case 1:
          this.getFriendList();
          break;
        case 2:
          this.getGroupList();
          break;
        case 3:
          this.userSearch();
          break;
        case 4:
          this.groupSearch();
          break;
        case 6:
          // this.getNotices();
          setTimeout(() => {
            document.getElementById("notices").onscroll = e => {
              let isLoad =
                  e.target.scrollTop >=
                  e.target.scrollHeight - e.target.offsetHeight,
                total = this.noticesList.pagination.total,
                currentPage =
                  this.noticesList.pagination.total / 15 >
                  (this.noticesList.pagination.currentPage ||
                    this.noticesList.pagination.current_page);
              if (isLoad && total && currentPage) this.getNotices();
            };
          }, 100);
          break;
      }
    },
    getFriendList() {
      let that = this;
      that
        .$get("friend/list")
        .then(response => {
          if (response.status != 200) return false;
          that.friendList = response.data;
        })
        .catch(err => console.error(err));
    },
    setRemarks(id, key) {
      let that = this;
      this.$prompt("", "设置备注", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: name
      }).then(({ value, action }) => {
        that
          .$post("friend/remark", {
            friend_id: id,
            remark: value
          })
          .then(response => {
            if (response.status != 200) return false;
            that.friendList.list[key].remark = value;
            if (id == that.toUser) that.userName = value;
          })
          .catch(err => console.error(err));
      });
    },
    addFriend(id) {
      let that = this;
      this.$prompt("请输入验证信息", "发送验证消息")
        .then(({ value }) => {
          that
            .$post("friend/add/verify", {
              friend_id: id,
              content: value
            })
            .then(response => {
              if (response.status != 200) return false;
              that.$message({ message: "发送成功", type: "success" });
            })
            .catch(error => console.error(error));
        })
        .catch(err => console.log("添加取消"));
    },
    acceptFriend(noticeId) {
      let that = this;
      that
        .$post("friend/add", { notice_id: noticeId })
        .then(response => {
          if (response.status != 200) return false;
          that.getFriendList();
        })
        .catch(err => console.error(err));
    },
    delUser(id, index) {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$post("friend/del", {
          friend_id: id
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.friendList.list.splice(index, 1);
        })
        .catch(err => loading.close());
    },
    userSearch() {
      let that = this;
      that
        .$get("users/search", { name: that.searchId })
        .then(response => {
          if (response.status != 200) return false;
          that.searchList = response.data.list;
        })
        .catch(err => console.error(err));
    },
    getChatList(state = true) {
      let that = this;
      that
        .$get("chat/session/record")
        .then(response => {
          if (response.status != 200) return false;
          that.chatList = response.data;
          if (!that.chatList.list.length) return false;
          if (state) that.recordTo();
        })
        .catch(err => console.error(err));
    },
    // 中间过滤显示聊天显示第一个
    recordTo() {
      let that = this;
      switch (that.chatList.list[0].friend_uid) {
        case 0:
          // 群聊
          that.state = 2;
          that.getRecord({
            id: that.chatList.list[0].group_id,
            username: that.chatList.list[0].group.group_name
          });
          break;
        case 1:
          // 私聊 用户 id = 1，选择第二个
          if (that.chatList.list[1].friend_uid) {
            that.state = 1;
            that.getRecord({
              id: that.chatList.list[1].friend_uid,
              username:
                that.chatList.list[1].friend_user.remark ||
                that.chatList.list[1].friend_user.display_name
            });
          } else {
            that.state = 2;
            that.getRecord({
              id: that.chatList.list[1].group.group_id,
              username: that.chatList.list[1].group.group_name
            });
          }
          break;
        default:
          // 其他用户
          that.state = 1;
          that.getRecord({
            id: that.chatList.list[0].friend_uid,
            username:
              that.chatList.list[0].friend_user.remark ||
              that.chatList.list[0].friend_user.display_name
          });
          break;
      }
    },
    getRecord({ id, username, index = 0 }) {
      if (id != this.toUser || username != this.userName)
        this.record.pagination = { total: 1, current_page: 0 };

      let that = this,
        url = null,
        params = { page: ++that.record.pagination.current_page },
        clear_unread_message_num = { action: "clear", req: {} },
        pcHeight = document.getElementById("chatMain").scrollHeight,
        moblieHeight = document.getElementsByClassName("chatMain")[0]
          .scrollHeight;

      that.key = index;
      that.toUser = id;
      that.userName = username;
      if (that.chatList && that.chatList.list.length)
        that.chatList.list[that.key].unread_message_num = 0;
      if (that.state == 1) {
        url = "chat/record";
        params.to_user_id = id;
        clear_unread_message_num.req.to_uid = id;
      } else if (that.state == 2) {
        url = "group/chat/record";
        params.group = id;
        clear_unread_message_num.req.group_id = id;
      } else return false;
      that.webSocketSend(clear_unread_message_num);
      that
        .$get(url, params)
        .then(response => {
          if (response.status != 200) return false;

          if (response.pagination.current_page == 1) {
            that.record.list = response.data.list;
            that.fixLocation();
          } else {
            if (response.data.list.length == 0) return false;
            response.data.list.reverse();
            response.data.list.forEach(e => that.record.list.unshift(e));
            setTimeout(() => {
              let $chatMain = document.getElementById("chatMain"),
                chatMain = document.getElementsByClassName("chatMain")[0];
              $chatMain.scrollTop = $chatMain.scrollHeight - pcHeight;
              chatMain.scrollTop = chatMain.scrollHeight - moblieHeight;
            }, 100);
          }
          // that.finishingPictures();
          that.record.pagination = response.pagination;
        })
        .catch(error => console.error(error));
    },
    galleryShow() {
      this.$preview.on("imageLoadComplete", (e, item) => console.log());
    },
    /*
      finishingPictures() {
        this.msgImgArr = [];
        this.record.list.forEach(e => {
          // 赋值 msgImgKey
          if (e.msg_type == 2 || e.type == 2) {
            this.msgImgArr.push(e);
            this.msgImgArr.forEach((item, k) => (e.msgImgKey = k));
          }
        });
      },
    */
    delChat(id, key) {
      let that = this;
      that
        .$post("chat/session/remove", {
          cid: id
        })
        .then(response => {
          if (response.status != 200) return false;
          that.toUser = 0;
          that.chatList.list.splice(key, 1);
        })
        .catch(err => console.error(err));
    },
    getGroupList() {
      let that = this;
      that
        .$get("group/list")
        .then(response => {
          if (response.status != 200) return false;
          that.groupList.list = response.data.list;
        })
        .catch(err => console.error(err));
    },
    addGroup(id) {
      let that = this;
      that
        .$prompt("请输入验证消息", "验证消息", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
        .then(({ value }) => {
          that
            .$post("group/join/verify", {
              group_id: id,
              content: value
            })
            .then(response => {
              if (response.status != 200) return false;
              that.getGroupList();
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    },
    acceptGroup(id) {
      let that = this;
      that
        .$post("group/join", {
          notice_id: id
        })
        .then(response => {
          if (response.status != 200) return false;
          that.getGroupList();
        })
        .catch(err => console.error(err));
    },
    delGroup(id, index) {
      let that = this;
      that
        .$post("group/exit", {
          group_id: id
        })
        .then(response => {
          if (response.status != 200) return false;
          that.toUser = 0;
          that.groupList.list.splice(index, 1);
        })
        .catch(err => console.error(err));
    },
    getGroupUser(id) {
      let that = this;
      this.groupId = id;
      that
        .$get("group/users", { group_id: id })
        .then(response => {
          if (response.status != 200) return false;
          that.groupUserList = response.data.list;
          that.groupState = 0;
          groupUserCheckBox.methods.close.call(this);
        })
        .catch(err => console.error(err));
    },
    groupSearch() {
      let that = this;
      that
        .$get("group/search", { group_name: that.searchId })
        .then(response => {
          if (response.status != 200) return false;
          that.searchList = response.data.list;
        })
        .catch(err => console.error(err));
    },
    editGroup(id, name, desc, key) {
      let that = this;
      this.$prompt("", "修改群名", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: name
      }).then(({ value, action }) => {
        that
          .$post("group/modify", {
            group_id: id,
            group_name: value
          })
          .then(response => {
            if (response.status != 200) return false;
            that.groupList.list[key].group_name = value;
            that.userName = value;
          })
          .catch(err => console.error(err));
      });
    },
    dissolution(id, key) {
      let that = this;
      this.$confirm("此操作将永久解散该群组, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          that
            .$post("group/dissolution", { group_id: id })
            .then(response => {
              if (response.status != 200) return false;
              that.toUser = 0;
              that.groupList.list.splice(key, 1);
            })
            .catch(error => console.error(error));
        })
        .catch(err => console.log("点错了"));
    },
    joinGroup(groupId = 0) {
      this.groupId = parseInt(groupId);
      this.groupUserList = this.checkBoxList.repeatDepth();
      this.groupState = 1;
      groupUserCheckBox.methods.close.call(this);
    },
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
      that.send(url, data, params, msgType);
    },
    // 发文件
    uploadFile(file) {
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
          that.send(url, data, params, type);
        })
        .catch(error => console.error(error));
    },
    send(url, data, params, type) {
      let that = this;
      that
        .$post(url, data)
        .then(response => {
          if (response.status != 200) return false;
          params.req.msg_id = response.data.msg_id;
          that.webSocketSend(params);
          let msg = {
              from_user_id: that.user.user.id,
              from_user: {
                from_user_id: that.user.user.id,
                avatar: that.user.user.avatar,
                display_name: that.user.user.display_name
              },
              created_at: that.dateParse(new Date()),
              msg_type: type,
              id: response.data.msg_id,
              content: data.content
            },
            msgType = {
              1: () => (that.message = ""),
              2: () => {
                // if (that.msgImgArr) that.msgImgArr.push(msg);
                // msg.msgImgKey = that.msgImgArr.length - 1;
              },
              3: () => {}
            };
          msgType[type]();
          if (data.to_uid == that.toUser || data.to_group_id == that.toUser)
            that.record.list.push(msg);
        })
        .catch(err => console.error(err));
    },
    getMembers() {
      let that = this;
      that
        .$get("chat/select/members")
        .then(response => {
          if (response.status != 200) return false;
          let arr = [],
            user = ["colleagues", "friends", "strangers"];
          for (const key in response.data) {
            if (user.indexOf(key) != -1)
              response.data[key].forEach(e => {
                e.isClick = false;
                arr.push(e);
              });
          }
          that.checkBoxList = arr;
          that.members = response.data;
        })
        .catch(error => console.error(error));
    },
    getBranch() {
      let that = this;
      that
        .$get("members/company/branch")
        .then(response => {
          if (response.status != 200) return false;
          that.mailList = response.data.list;
        })
        .catch(error => console.error(error));
    },
    getNotices() {
      let that = this;
      that
        .$get("chat/notices", {
          page:
            ++that.noticesList.pagination.currentPage ||
            ++that.noticesList.pagination.current_page
        })
        .then(response => {
          if (response.status != 200) return false;

          response.data.list.forEach(e => that.noticesList.list.push(e));
          // response.data.list.forEach(e => that.noticesList.list.unshift(e));
          that.noticesList.pagination = response.pagination;
        })
        .catch(error => console.error(error));
    },
    showFileList() {
      fileList.methods.close.call(this);
    },
    getNoticesDetail(item, key) {
      this.$alert(
        `${item.created_at ? "<p>通知时间：" + item.created_at + "</p>" : ""} 
          <p>通知内容：<b>${item.message}</b>
        </p>`,
        "通知",
        {
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          callback: action => {}
        }
      );
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
      switch (i) {
        case 0:
          this.groupId = 0;
          this.groupUserList = this.checkBoxList.repeatDepth();
          this.groupState = 2;
          groupUserCheckBox.methods.close.call(this);
          break;
        case 1:
          var save = e => {
            e.clipboardData.setData("text/plain", this.e.target.innerText); //下面会说到clipboardData对象
            e.preventDefault(); //阻止默认行为
          };
          document.addEventListener("copy", save);
          document.execCommand("copy");
          this.$message({ message: "复制成功", type: "success" });
          break;
        case 2:
          let msgSendId =
            this.forwardData.from_user_id || this.forwardData.user_id;
          if (msgSendId != this.user.user.id) {
            this.$message({ message: "只能撤回个人消息", type: "error" });
            return false;
          }
          if (
            new Date() - new Date(this.forwardData.created_at) >
            2 * 60 * 1000
          ) {
            this.$message({
              message: "只能撤回不超过2分钟的消息",
              type: "error"
            });
            return false;
          }
          let params = {
            action: "withdrawal",
            req: {
              msg_id: this.forwardData.id
            }
          };
          if (this.state == 1) params.req.to_uid = this.toUser;
          else if (this.state == 2) params.req.group_id = this.toUser;
          else return false;
          this.webSocketSend(params);
          break;
        default:
          // 转发
          for (const item in i) {
            i[item].forEach(e =>
              setTimeout(() => {
                let msg = this.forwardData,
                  type = msg.msg_type || msg.type,
                  state = item == "user" ? 1 : 2;
                this.sendMessage(0, e, type, msg.content, state);
              }, 500)
            );
          }
          break;
      }
      this.e = null;
      this.mousePosition = ["close"];
    },
    notify(result, state) {
      let msg = null,
        title = {
          1: result.resp.content,
          2: "[图片]",
          3: "[文件]"
        },
        getRequset = {
          1: () => this.getFriendList(),
          2: () => this.getGroupList()
        };

      this.$notify({
        title: `${result.resp.from_name}`,
        message: title[result.resp.type]
      });
      let notification = new Notification(`${result.resp.from_name}`, {
        body: title[result.resp.type]
      });

      clearTimeout(this.timeOut);
      this.timeOut = setTimeout(() => {
        this.getChatList(false);
        getRequset[state]();
      }, 2000);
    },
    webSocket() {
      let socketAddress = this.$store.state.socketAddress;
      this.ws = new WebSocket(socketAddress);
      this.ws.onmessage = event => {
        const result = JSON.parse(event.data);
        switch (result.action) {
          case "init":
            this.webSocketLogin();
            break;
          case "login":
            if (result.resp.code != 200) {
              if (result.resp.code == 400) {
                this.$notify({
                  title: "过多的连接",
                  message: "请关闭其他本网站网页"
                });
                return false;
              }
              this.webSocketLogin();
            } else {
              clearInterval(this.pong);
              this.connectNum = 0;
              this.pong = setInterval(
                () =>
                  this.webSocketSend({
                    action: "pong",
                    req: {
                      message: "hello"
                    }
                  }),
                5000
              );
            }
            break;
          case "pong":
            break;
          case "chat":
            console.log(result);
            if (result.resp_event == 200) {
              if (result.resp.from_uid == this.toUser) {
                let msg = {
                  from_user_id: result.resp.from_uid,
                  from_user: {
                    from_user_id: result.resp.from_uid,
                    avatar:
                      result.resp.avatar ||
                      "https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/default_avatar/%E5%A4%B4%E5%83%8Fxhdpi.png",
                    display_name: this.userName
                  },
                  id: result.msg_id,
                  created_at: this.dateParse(new Date()),
                  msg_type: result.resp.type,
                  content: result.resp.content
                };
                this.record.list.push(msg);
                // if (msg.msg_type == 2) {
                //   this.msgImgArr.push(msg);
                //   msg.msgImgKey = this.msgImgArr.length - 1;
                // }
              }
              // this.getRecord({ id: this.toUser, username: this.userName });
              if (result.resp.from_uid) this.notify(result, 1);
            }
            this.fixLocation();
            break;
          case "group":
            console.log(result);
            if (result.resp_event == 200) {
              if (result.resp.group == this.toUser) {
                let msg = {
                  from_user_id: result.resp.from_uid,
                  user: {
                    from_user_id: result.resp.from_uid,
                    avatar:
                      result.resp.avatar ||
                      "https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/default_avatar/%E5%A4%B4%E5%83%8Fxhdpi.png",
                    display_name: result.resp.from_name
                  },
                  id: result.msg_id,
                  created_at: this.dateParse(new Date()),
                  msg_type: result.resp.type,
                  content: result.resp.content
                };
                this.record.list.push(msg);
                // if (msg.msg_type == 2) {
                //   this.msgImgArr.push(msg);
                //   msg.msgImgKey = this.msgImgArr.length - 1;
                // }
              }
              // this.getRecord({ id: this.toUser, username: this.userName });
              if (result.resp.from_uid) this.notify(result, 2);
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
            this.noticesList.list.unshift({
              id: result.resp.notice_id,
              from_user: {
                last_name: result.resp.from_name || ""
              },
              message: result.resp.content,
              type: result.resp.type,
              user_id: result.resp.user_id
            });
            // this.getNotices();
            break;
          case "withdrawal":
            if (result.msg_id) {
              this.record.list.forEach((e, k) => {
                if (e.id == result.msg_id) this.record.list.splice(k, 1);
              });
            }
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
      this.ws.onclose = this.ws.onerror = e => {
        this.connectNum++;
        this.reconnect(socketAddress);
      };
    },
    reconnect(url) {
      if (this.lockReconnect) return false;
      this.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      setTimeout(
        () => {
          clearInterval(this.pong);
          this.webSocket(url);
          this.lockReconnect = false;
        },
        2000 * (this.connectNum + 1) > 64000
          ? 64000
          : 2000 * (this.connectNum + 1)
      );
    },
    webSocketLogin() {
      this.webSocketSend({
        action: "login",
        req: {
          token: this.user.token,
          client_type: "web"
        }
      });
    },
    webSocketSend(action) {
      this.ws.send(JSON.stringify(action));
    },
    webSocketClose() {
      clearInterval(this.pong);
      this.ws.close();
    },
    fixLocation() {
      setTimeout(() => {
        let $chatMain = document.getElementById("chatMain"),
          chatMain = document.getElementsByClassName("chatMain")[0];
        $chatMain.scrollTop = $chatMain.scrollHeight;
        chatMain.scrollTop = chatMain.scrollHeight;
      }, 100);
    }
  },
  components: {
    groupUserCheckBox: groupUserCheckBox,
    // gallery: gallery,
    fileListModal: fileList
  },
  watch: {
    toUser() {
      this.record.pagination = { total: 1, current_page: 0 };
    },
    state() {
      this.record.pagination = { total: 1, current_page: 0 };
    },
    record: {
      handler(val) {
        this.$previewRefresh();
      },
      deep: true
    },
    connectNum(val) {
      console.log(val);
    }
  },
  mounted() {
    let $uploadBox = this.$refs["uploadBox"],
      $elTextarea = document.getElementById("el-textarea"),
      $chatMain = document.getElementById("chatMain"),
      chatMain = document.getElementsByClassName("chatMain")[0];

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
        this.getRecord({
          id: this.toUser,
          username: this.userName,
          index: this.key
        });
    };
    Notification.requestPermission(status => console.log(status));
  },
  created() {
    this.getChatList();
    this.getFriendList();
    this.getGroupList();
    this.webSocket();
    this.getMembers();
    this.getNotices();

    if (this.user.slug) this.getBranch();
  }
};
</script>
<style lang="less">
@FFF: #ffffff;
@white: #eeeeee;
@gery: #666666;
@black: #1d1d1d;
@blue: #0064db;
@menuBoxColor: #f1f1f1;
@listBackground: @white;
@hoverBackground: #e6e6e6;
@background: #dedede;
@chatBackground: #fffefe;
@border: 1px solid @gery;
@chatBorder: 1px solid #dedede;
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
#message {
  width: 100%;
  max-height: 100%;
  box-sizing: border-box;
  .el-container {
    height: 100%;
    @media screen and (min-width: 820px) {
      .pcShowImportant {
        display: block !important;
      }
    }
    .el-aside {
      height: 100%;
      background-color: @black;
      box-sizing: border-box;
      padding: 2rem 1rem;
      @media screen and (max-width: 820px) {
      }
      .function {
        list-style: none;
        li {
          margin-bottom: 1.5rem;
          text-align: center;
          height: 45px;
          overflow: hidden;
          img {
            width: 100%;
            border-radius: 0.5rem;
          }
          i {
            font-size: 27px;
            color: @gery;
            display: block;
          }
          span {
            color: @gery;
          }
          .is-active {
            color: @menuBoxColor;
          }
        }
      }
    }
    .el-main {
      .el-container {
        height: 100%;
        .el-aside {
          height: 100%;
          background-color: @listBackground;
          padding: 0;
          @media screen and (max-width: 820px) {
            width: 100% !important;
          }
          .search {
            padding: 2rem 0.5rem 1rem 0.5rem;
            display: flex;
            > div {
              margin: 0.5rem;
            }
            button {
              padding: 0.5rem;
              line-height: 1;
              margin: 0.5rem;
              width: 30px;
              cursor: pointer;
              background-color: @background;
              color: @gery;
              border: none;
              border-radius: 0.5rem;
              outline: none;
            }
            input {
              background-color: @background;
              color: @gery;
            }
            ::-webkit-input-placeholder {
              color: @gery;
            }
          }
          .el-menu {
            background-color: @listBackground;
            height: 100px;
            p {
              padding: 1rem 1.5rem;
              background-color: @white;
              color: @gery;
              border-bottom: @border;
            }
            .el-menu-item {
              color: @gery;
              display: flex;
              align-items: center;
              box-sizing: border-box;
              * {
                vertical-align: unset;
              }
              &:hover {
                background-color: @hoverBackground;
              }
              .avatarBox {
                width: 40px;
                height: 40px;
                overflow: hidden;
                display: inline-block;

                img {
                  width: 100%;
                  height: 100%;
                  border-radius: 50px;
                }
              }
              .el-badge {
                height: 50px;
                .el-badge__content {
                  top: 10px;
                }
              }
              > span {
                margin-left: 1rem;
                &:last-child {
                  display: block;
                  width: 120px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
              label {
                display: block;
                width: 85%;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 1.4rem;
              }
              button {
                position: absolute;
                right: 1rem;
                top: 1.3rem;
              }
            }
            .is-active {
              background-color: @background;
            }
          }
        }
        .el-main {
          background-color: @chatBackground;
          color: @gery;
          @media screen and (max-width: 820px) {
            display: block;
          }
          .el-header {
            border-bottom: @chatBorder;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            div {
              > span {
                font-size: 2rem;
              }
              > button {
                > span {
                  font-size: 1.2rem;
                }
              }
            }
            @media screen and (min-width: 820px) {
              .pcHide {
                display: none;
              }
              .mobileHide {
                > i {
                  font-size: 2rem;
                  font-weight: bold;
                }
              }
            }
            @media screen and (max-width: 820px) {
              .pcHide {
                > i {
                  font-size: 2rem;
                  font-weight: bold;
                }
              }
              .mobileHide {
                display: none;
              }
            }
          }
          .el-main {
            overflow-y: auto;
            border-bottom: @chatBorder;
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
                  color: @FFF;
                  background-color: #bdb9b9;
                }
              }
              .chatMessage {
                position: relative;
                .messageImg {
                  max-width: 200px;
                  position: inherit;
                  background-color: @FFF;
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
          }
          #chatMain {
            height: 260px !important;
          }
          ::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }
          .el-footer {
            box-sizing: border-box;
            padding: 2rem 2.5rem 1rem 1.5rem;
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
    }
  }
  .gallery {
    z-index: 2001;
    .el-carousel__container {
      height: 680px;
      .el-carousel__item {
        text-align: center;
        img {
          max-width: 100%;
          height: 100%;
        }
      }
    }
  }
  .menu-box {
    position: fixed;
    padding: 0;
    border-radius: 4px;
    > ul {
      list-style: none;
      background-color: @FFF;
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
