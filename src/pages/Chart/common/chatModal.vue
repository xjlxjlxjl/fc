<template>
  <div>
    <!-- 
      传递聊天记录
      当前用户聊天名称 id
      发送消息方法
    -->
    <popup
      :record="record"
      :toUser="toUser"
      :userName="userName"
      :state="state"
      :modal="modalShow"
      @send="send"
      @menuClick="menuClick"
      @getRecord="getRecord"
      @change="modalShow =! modalShow"
    ></popup>
    <div id="msgBox" v-show="modal">
      <!-- 踢出群聊，邀请群聊（ 0：邀请，1：添加 ） -->
      <groupUserCheckBox
        :groupId="groupId"
        :groupUser="groupUserList"
        :group="groupList.list"
        :groupState="groupState"
        @send="menuClick"
        @refresh="getChatList"
      ></groupUserCheckBox>
      <div class="msgRise">
        <div class="avatar"></div>
        <div class="switch">
          <i class="el-icon-close" @click="$emit('change', 'modalShow', false)"></i>
        </div>
      </div>
      <div class="msgMain">
        <div class="msgSearch">
          <el-input
            size="mini"
            v-if="msg.interface[2].isDefault || msg.interface[4].isDefault"
            v-model="searchId"
            placeholder="搜索群组"
            @keyup.13.native="changeView(4)"
            prefix-icon="el-icon-search"
          ></el-input>
          <el-input
            size="mini"
            v-else
            v-model="searchId"
            placeholder="搜索用户"
            @keyup.13.native="changeView(3)"
            prefix-icon="el-icon-search"
          ></el-input>
        </div>
        <keep-alive>
          <!-- 消息 -->
          <div class="msgList" v-if="msg.interface[0].isDefault">
            <el-menu default-active="0">
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
                  <el-button size="mini" type="info" v-else @click="getGroupUser(item.group_id)">查看群成员</el-button>
                  <el-button size="mini" slot="reference">操作</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
          </div>
          <!-- 好友 -->
          <div class="msgList" v-else-if="msg.interface[1].isDefault">
            <el-menu default-active="0">
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
          </div>
          <!-- 群聊 -->
          <div class="msgList" v-else-if="msg.interface[2].isDefault">
            <el-menu default-active="0">
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
          </div>
          <!-- 用户搜索 -->
          <div class="msgList" v-else-if="msg.interface[3].isDefault">
            <el-menu default-active="0">
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
          </div>
          <!-- 群搜索 -->
          <div class="msgList" v-else-if="msg.interface[4].isDefault">
            <el-menu default-active="0">
              <el-menu-item v-for="(item,index) in searchList" :key="index" :index="index.toString()">
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
          </div>
          <!-- 同事 -->
          <div class="msgList" v-else-if="msg.interface[5].isDefault">
            <el-menu default-active="0">
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
          </div>
          <!-- 通知 -->
          <div class="msgList" id="notices" v-else-if="msg.interface[6].isDefault">
            <el-menu default-active="0">
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
          </div>
        </keep-alive>
      </div>
      <div class="msgTail">
        <div
          v-for="item in msg.interface"
          :key="item.index"
          v-show="item.isShow"
          @click="changeView(item.index)"
          class="tailBox"
        >
          <i :class="item.isDefault ? item.activeIcon : item.icon"></i>
          <p>{{ item.alt }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import fileImg from "@/assets/img/file.png";
import groupUserCheckBox from "@/pages/Chart/common/groupUserCheckBox";
import popup from "@/pages/Chart/common/popup";

export default {
  name: "chatModal",
  data() {
    return {
      fileImg: fileImg,
      user: JSON.parse(localStorage.getItem("user")) || null,
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
      inView: true,
      modalShow: false,
      // 群聊变量
      checkBoxList: [],
      groupId: 0,
      groupState: 0,
      groupUserList: [],
      // socket
      lockReconnect: false
    };
  },
  components: {
    popup: popup,
    groupUserCheckBox: groupUserCheckBox
  },
  props: {
    modal: Boolean
  },
  methods: {
    changeView(index) {
      this.msg.interface.forEach((e, k) => {
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
        case 5:
          if (this.user.slug) this.getBranch();
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
        .catch(err);
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
          if (that.messageTips == 0) {
            for (let item of that.chatList.list) {
              that.messageTips += parseInt(item.unread_message_num);
            }
          }
        })
        .catch(err => console.error(err));
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

          that.modalShow = true;
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
        .catch(err => console.log(err));
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
          };

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
      if (that.$store.state.userBranch.length)
        that.mailList = that.$store.state.userBranch;
      else
        that
          .$get("members/company/branch")
          .then(response => {
            if (response.status != 200) return false;
            that.mailList = response.data.list;
            that.$store.commit("getUserBranch", response.data.list);
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
          that.noticesList.pagination = response.pagination;
        })
        .catch(error => console.error(error));
    },
    getNoticesDetail(item, key) {
      this.$alert(
        `${
          item.created_at ? "<p>通知时间：" + item.created_at + "</p>" : ""
        } <p>通知内容：<b>${item.message}</b> </p>`,
        "通知",
        {
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true,
          callback: action => {}
        }
      );
    },
    menuClick(i, text, forwardData) {
      switch (i) {
        case 0:
          this.groupId = 0;
          this.groupUserList = this.checkBoxList.repeatDepth();
          this.groupState = 2;
          this.forwardData = forwardData;
          groupUserCheckBox.methods.close.call(this);
          break;
        case 1:
          var save = e => {
            e.clipboardData.setData("text/plain", text.target.innerText); //下面会说到clipboardData对象
            e.preventDefault(); //阻止默认行为
          };
          document.addEventListener("copy", save);
          document.execCommand("copy");
          this.$message({ message: "复制成功", type: "success" });
          break;
        case 2:
          let msgSendId = forwardData.from_user_id || forwardData.user_id;
          if (msgSendId != this.user.user.id) {
            this.$message({ message: "只能撤回个人消息", type: "error" });
            return false;
          }
          if (new Date() - new Date(forwardData.created_at) > 2 * 60 * 1000) {
            this.$message({
              message: "只能撤回不超过2分钟的消息",
              type: "error"
            });
            return false;
          }
          let params = {
            action: "withdrawal",
            req: {
              msg_id: forwardData.id
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
                popup.methods.sendMessage.call(
                  this,
                  0,
                  e,
                  type,
                  msg.content,
                  state
                );
              }, 500)
            );
          }
          break;
      }
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
      new Notification(`${result.resp.from_name}`, {
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
              console.log("%c 链接成功!", "color: #359028;background:#a6dc9e;");
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
              }
              if (!this.modal) this.$emit("tips");
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
              }
              if (!this.modal) this.$emit("tips");
              if (result.resp.from_uid) this.notify(result, 2);
            }
            this.fixLocation();
            break;
          case "notice":
            console.log(result);
            if (!this.modal) this.$emit("tips");
            this.$notify({
              title: `您有一条来自${result.resp.from_name}的通知`,
              message: result.resp.content
            });
            new Notification(`您有一条来自${result.resp.from_name}的通知`, {
              body: result.resp.content
            });
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
        if (!this.inView) return false;
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
          console.error(`断线重连中：${this.connectNum}`);
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
      this.inView = false;
      clearInterval(this.pong);
      this.ws.close();
    },
    fixLocation() {
      popup.methods.fixLocation.call(this);
    }
  },
  computed: mapState(["chatModal", "msg"]),
  watch: {
    toUser() {
      this.record.pagination = { total: 1, current_page: 0 };
    },
    state() {
      this.record.pagination = { total: 1, current_page: 0 };
    }
  },
  mounted() {
    this.$on("send", (url, data, params, msgType) =>
      this.send(url, data, params, msgType)
    );
  },
  created() {
    this.getChatList();
    this.webSocket();
    this.getMembers();
    this.getNotices();
  }
};
</script>
<style lang="less">
@grey: #d9d9d9;
@gery: #666666;
@smallGrey: #f6f6f6;
@white: #ffffff;
@eee: #eeeeee;
@dedede: #dedede;
@e6e6e6: #e6e6e6;
@black: #1d1d1d;
@shadow: 1px 1px 50px rgba(0, 0, 0, 0.3);
@border: 1px solid @grey;

#msgBox {
  position: fixed;
  bottom: 10%;
  left: 0;
  z-index: 10;
  width: 300px;
  // height: 600px;
  height: 730px;
  border: @border;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: @shadow;
  background-color: @smallGrey;
  .msgRise {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    color: @black;
    .switch {
      > i {
        cursor: pointer;
        font-size: 3rem;
        font-weight: bold;
      }
    }
  }
  .msgMain {
    .msgSearch {
      padding: 0 0.5rem;
    }
    .msgList {
      // height: 475px;
      height: 600px;
      background-color: @white;
      overflow-y: auto;
      margin-top: 0.5rem;
      .el-menu {
        background-color: @white;
        p {
          padding: 1rem 1.5rem;
          background-color: @white;
          color: @gery;
          border-bottom: @border;
          margin-bottom: 0;
          background-color: #eeeeee;
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
            background-color: @e6e6e6;
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
            height: 40px;
            .el-badge__content {
              top: 5px;
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
          background-color: @dedede;
        }
      }
    }
  }
  .msgTail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 45px;
    background-color: @smallGrey;
    color: @gery;
    .tailBox {
      box-sizing: border-box;
      text-align: center;
      flex-grow: 2;
    }
  }
}
</style>
