<template>
  <div id="message">
    <!-- 踢出群聊，邀请群聊（ 0：邀请，1：添加 ） -->
    <groupUserCheckBox :groupId="groupId" :groupUser="groupUserList" :groupState="groupState"></groupUserCheckBox>
    <!-- 图片画廊 -->
    <transition name="el-fade-in-linear">
      <div v-if="Gallery">
        <div class="Curtain" @click="Gallery = false;"></div>
        <el-carousel class="gallery" :interval="0" :autoplay="new Boolean(false)" :loop="new Boolean(false)" :initial-index='galleryIndex'>
          <el-carousel-item v-for="(item,index) in record.list" :key="index" v-if="item.type == 2 || item.msg_type == 2">
            <img :src="item.content">
          </el-carousel-item>
        </el-carousel>
      </div>
    </transition>
    <el-container>
      <el-aside class="pcShowImportant" width="60px" v-show="!mainDisplay">
        <ul class="function">
          <li><img :src="user.user.avatar"></li>
          <li v-for="(item,index) in interface" :key="index" v-if="index < 3 || index > 4">
            <i :class="item.isDefault ? `is-active ${item.icon}` : item.icon" @click="changeView(index)" :alt="item.alt"></i>
          </li>
        </ul>
      </el-aside>
      <el-main>
        <el-container>
          <el-aside class="pcShowImportant" width="250px" :id="interface[6].isDefault ? 'notices' : ''" v-show="!mainDisplay">
            <div class="search" v-if="interface[2].isDefault || interface[4].isDefault">
              <el-input placeholder="搜索群组" v-model="searchId" size="mini" @keyup.13.native="changeView(4)">
                <i slot="prefix" class="el-input__icon el-icon-search" @click="changeView(4)"></i>
              </el-input>
              <button @click="changeView(4)">+</button>
            </div>
            <div class="search" v-else>
              <el-input placeholder="搜索用户" v-model="searchId" size="mini" @keyup.13.native="changeView(3)">
                <i slot="prefix" class="el-input__icon el-icon-search" @click="changeView(3)"></i>
              </el-input>
              <button @click="changeView(3)">+</button>
            </div>
            <el-menu default-active="0" v-if="interface[0].isDefault">
              <el-menu-item v-for="(item,index) in chatList.list" v-if="item.friend_uid != 1"
                          :key="index" :index="index.toString()" 
                          @click="state = item.friend_uid ? 1 : 2;getRecord({ id: item.friend_uid || item.group_id, username: item.friend_user ? item.friend_user.remark || item.friend_user.display_name : item.group.group_name, index: index });mainDisplay = true">
                <div class="avatarBox">
                  <img :src="item.friend_user ? item.friend_user.avatar : item.group.avatar">
                </div>
                <span slot="title">{{ item.friend_user ? item.friend_user.remark || item.friend_user.display_name : item.group.group_name }}</span>
                <el-popover
                  placement="right"
                  trigger="hover">
                  <el-button type="danger" size="mini" v-if="item.friend_user" @click="delChat(item.id, index)">删除</el-button>
                  <el-button size="mini" type="warning" v-else @click="delGroup(item.group_id, index);delChat(item.id, index)">退出</el-button>
                  <el-button type="primary" size="mini" v-if="item.friend_user" @click="joinGroup">创建群聊</el-button>
                  <el-button size="mini" type="info" v-else @click="getGroupUser(item.group_id)">查看群成员</el-button>
                  <el-button size="mini" slot="reference">操作</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[1].isDefault">
              <el-menu-item v-for="(item,index) in friendList.list" v-if="item.friend_uid != 1"
                          :key="index" :index="index.toString()" 
                          @click="state = 1;getRecord({id: item.id, username: item.remark || item.display_name, index: index });mainDisplay = true">
                <div class="avatarBox">
                  <img :src="item.avatar">
                </div>
                <span slot="title">{{ item.remark || item.display_name }}</span>
                <el-popover
                  placement="right"
                  trigger="hover">
                  <el-button type="danger" size="mini" @click="delUser(item.id,index)">删除</el-button>
                  <el-button type="primary" size="mini" @click="joinGroup">创建群聊</el-button>
                  <el-button type="success" size="mini" @click="setRemarks(item.id,index)">修改备注</el-button>
                  <el-button size="mini" slot="reference">操作</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[2].isDefault">
              <el-menu-item v-for="(item,index) in groupList.list"
                          :key="index" :index="index.toString()" 
                          @click="state = 2;getRecord({id: item.id, username: item.group_name, index: index });mainDisplay = true">
                <div class="avatarBox">
                  <img :src="item.avatar">
                </div>
                <span slot="title">{{ item.group_name }}</span>
                <el-popover
                  placement="right"
                  trigger="hover">
                  <el-button size="mini" slot="reference">操作</el-button>
                  <el-button size="mini" type="success" @click="editGroup(item.id, item.group_name, item.group_description, index)">修改群信息</el-button>
                  <el-button size="mini" type="warning" @click="delGroup(item.id, index)">退出</el-button>
                  <el-button size="mini" type="danger" v-if="item.admin_id == user.user.id" @click="dissolution(item.id, index)">解散</el-button>
                  <el-button size="mini" type="primary" v-if="item.admin_id == user.user.id" @click="joinGroup(item.id)">邀请加入群聊</el-button>
                  <el-button size="mini" type="info" @click="getGroupUser(item.id)">查看群成员</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[3].isDefault">
              <el-menu-item v-for="(item,index) in searchList" v-if="item.friend_uid != 1"
                          :key="index" :index="index.toString()" 
                          @click="state = 1;getRecord({id: item.id, username: item.last_name || item.display_name, index: index });mainDisplay = true">
                <div class="avatarBox">
                  <img :src="item.avatar">
                </div>
                <span slot="title">{{ item.last_name || item.display_name }}</span>
                <el-popover
                  placement="right"
                  trigger="hover">
                  <el-button size="mini" slot="reference">操作</el-button>
                  <el-button size="mini" type="danger" @click="addFriend(item.id)">添加好友</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[4].isDefault">
              <el-menu-item v-for="(item,index) in searchList" :key="index" :index="index.toString()">
                <div class="avatarBox">
                  <img :src="item.avatar">
                </div>
                <span slot="title">{{ item.group_name }}</span>
                <el-popover
                  placement="right"
                  trigger="hover">
                  <el-button size="mini" slot="reference">操作</el-button>
                  <el-button size="mini" type="danger" @click="addGroup(item.id)">加入群组</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[5].isDefault">
              <div v-for="(val,key) in mailList" :key="key">
                <p>{{ val.branch_name }}</p>
                <el-menu-item  v-for="(item,index) in val.member" :key="index" :index="item.id.toString()" @click="state = 1;getRecord({id: item.id, username: item.display_name, index: index });mainDisplay = true">
                  <div class="avatarBox">
                    <img :src="item.url || 'https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/chat/logo.png'">
                  </div>
                  <span slot="title">{{ item.display_name }}</span>
                  <el-popover
                    placement="right"
                    trigger="hover">
                    <el-button size="mini" slot="reference">操作</el-button>
                    <el-button size="mini" type="primary" @click="joinGroup">创建群聊</el-button>
                    <el-button size="mini" type="danger" @click="addFriend(item.id)">添加好友</el-button>
                  </el-popover>
                </el-menu-item>
              </div>
            </el-menu>
            <el-menu default-active="0" v-else-if="interface[6].isDefault">
              <el-menu-item v-for="(item,index) in noticesList.list" v-if="!item.is_read && !item.is_agree && !item.is_delete"
                          :key="index" :index="index.toString()">
                <label slot="title">{{ item.from_user ? `${ item.from_user.last_name || item.from_user.display_name }：${ item.message }`: item.message  }}</label>
                <el-popover
                  placement="right"
                  trigger="hover">
                  <el-button size="mini" slot="reference">操作</el-button>
                  <el-button size="mini" type="danger" v-if="item.type == 3" @click="acceptFriend(item.id)">添加</el-button>
                  <el-button size="mini" type="danger" v-if="item.type == 16" @click="acceptGroup(item.id)">同意添加</el-button>
                </el-popover>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main class="pcShowImportant" v-show="mainDisplay">
            <el-container v-show='toUser'>
              <el-header>
                <div><span>{{ userName }}</span></div>
                <div @click="mainDisplay = false"><i class="el-icon-back"></i></div>
              </el-header>
              <el-main id="chatMain">
                <div class="chatMain">
                  <div v-for="(item,index) in record.list" :key="index" class="chatMessage">
                    <div v-if="item.from_user_id == user.user.id || item.user_id == user.user.id" class="formMessage">
                      <div class="messgaeBox">
                        <p v-if="item.user" class="messageUser" align="right">{{ item.user.remark || item.user.display_name }}</p>
                        <div class="Bubble" :style="item.user ? 'top: 3.5rem;' : ''"></div>
                        <div class="messgaeCentent">
                          <span v-if="item.msg_type == 1 || item.type == 1">{{ item.content }}</span>
                          <img v-else-if="item.msg_type == 2 || item.type == 2" :src="item.content" @click="Gallery = true;galleryIndex = item.msgImgKey" class="messageImg">
                          <div v-else-if="item.msg_type == 3 || item.type == 3" class="goodsMsg">
                            <img :src="fileImg">
                            <div>
                              <h1>{{ item.content.split('/').pop() }}</h1>
                              <span>{{ item.content }}</span>
                              <a target="_blank" :href="item.content">下载</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <img :src="item.from_user ? item.from_user.avatar : item.user.avatar">
                    </div>
                    <div v-else class="toMessage">
                      <img :src="item.from_user ? item.from_user.avatar : item.user.avatar">
                      <div class="messgaeBox">
                        <p v-if="item.user" class="messageUser">{{ item.user.remark || item.user.display_name }}</p>
                        <div class="Bubble" :style="item.user ? 'top: 3.5rem;' : ''"></div>
                        <div class="messgaeCentent">
                          <span v-if="item.msg_type == 1 || item.type == 1">{{ item.content }}</span>
                          <img v-else-if="item.msg_type == 2 || item.type == 2" :src="item.content" @click="Gallery = true;galleryIndex = item.msgImgKey" class="messageImg">
                          <div v-else-if="item.msg_type == 3 || item.type == 3" class="goodsMsg">
                            <img :src="fileImg" >
                            <div>
                              <h1>{{ item.content.split('/').pop() }}</h1>
                              <span>{{ item.content }}</span>
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
                <el-upload class="file-upload"
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                 :show-file-list="false"
                 :before-upload="uploadFile">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-upload
                  class="avatar-uploader"
                  action="https://factoryun.oss-cn-shenzhen.aliyuncs.com/"
                 :show-file-list="false"
                 :before-upload="uploadImg">
                  <i class="el-icon-picture avatar-uploader-icon"></i>
                </el-upload>
                <el-input type="textarea" id="el-textarea" v-model="message" @keyup.13.native="sendMessage"></el-input>
                <div class="btnBox">
                  <el-button type="primary" size="mini" @click="sendMessage">发送</el-button>
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
import groupUserCheckBox from '@/pages/Chart/common/groupUserCheckBox';

export default {
  name: "message",
  data() {
    return {
      fileImg: fileImg,
      user: JSON.parse(localStorage.getItem("user")),
      interface: [
        {
          alt: "聊天",
          id: "chat",
          icon: "font_family icon-yuyin",
          isDefault: true
        },
        {
          alt: "通讯录",
          id: "mail",
          icon: "font_family icon-yonghuliebiao",
          isDefault: false
        },
        {
          alt: "群组",
          id: "group",
          icon: "font_family icon-qunzu",
          isDefault: false
        },
        {
          alt: "用户搜索",
          id: "search",
          icon: "el-input__icon el-icon-search",
          isDefault: false
        },
        {
          alt: "群搜索",
          id: "search",
          icon: "el-input__icon el-icon-search",
          isDefault: false
        },
        {
          alt: "公司成员",
          id: "member",
          icon: "el-input__icon el-icon-tickets",
          isDefault: false
        },
        {
          alt: "通知",
          id: "notices",
          icon: "el-input__icon el-icon-bell",
          isDefault: false
        }
      ],
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
          current_page: 1
        }
      },
      // 公用变量
      key: 0,
      toUser: 0,
      userName: "",
      message: "",
      // 群聊变量
      checkBoxList: [],
      Gallery: false,
      galleryIndex: 0,
      msgImgArr: [],
      groupId: 0,
      groupState: 0,
      groupUserList: [],
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
                e.target.scrollHeight - e.target.offsetHeight;
              if (isLoad && 
                this.noticesList.pagination.total > 15 &&
                this.noticesList.pagination.total / 15 >
                (this.noticesList.pagination.currentPage ||
                this.noticesList.pagination.current_page))
                this.getNotices();
            };
          }, 100);
          break;
      }
    },
    getFriendList() {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get("friend/list")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.friendList = response.data;
        })
        .catch(err => loading.close());
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
            console.log(key);
            that.friendList.list[key].remark = value;
            that.userName = value;
          })
          .catch(err => console.error(err));
      });
    },
    addFriend(id) {
      let that = this;
      this.$prompt("请输入验证信息", "发送验证消息")
        .then(({ value }) => {
          that
            .$post("/friend/add/verify", {
              friend_id: id,
              content: value
            })
            .then(response => {
              if (response.status != 200) return false;
              that.$message({ message: "发送成功", type: "success" });
            })
            .catch(error => console.error(error));
        })
        .catch(err => console.error(err));
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
        .$post("/friend/del", {
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
    getChatList() {
      let that = this;
      that
        .$get("chat/session/record")
        .then(response => {
          if (response.status != 200) return false;
          that.chatList = response.data;
          if (!that.chatList.list.length) return false;
          switch (that.chatList.list[0].friend_uid) {
            case 0:
              that.state = 2;
              that.getRecord({
                id: that.chatList.list[0].group_id,
                username: that.chatList.list[0].group.group_name
              });
              break;
            case 1:
              if (that.chatList.list[1].friend_uid) {
                that.state = 1;
                that.getRecord({
                  id: that.chatList.list[1].friend_uid,
                  username: that.chatList.list[1].friend_user.display_name
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
              that.state = 1;
              that.getRecord({
                id: that.chatList.list[0].friend_uid,
                username: that.chatList.list[0].friend_user.display_name
              });
              break;
          }
        })
        .catch(err => console.error(err));
    },
    getRecord({ id, username, index = 0 }) {
      if (id != this.toUser)
        this.record.pagination = { total: 1, current_page: 1 };

      let that = this,
        url = null,
        params = {
          page:
            ++that.record.pagination.currentPage ||
            that.record.pagination.current_page
        },
        pcHeight = document.getElementById("chatMain").scrollHeight,
        moblieHeight = document.getElementsByClassName("chatMain")[0].scrollHeight;

      that.key = index;
      that.toUser = id;
      that.userName = username;
      if (that.state == 1) {
        url = "chat/record";
        params.to_user_id = id;
      } else if (that.state == 2) {
        url = "group/chat/record";
        params.group = id;
      } else return false;
      that
        .$get(url, params)
        .then(response => {
          if (response.status != 200) return false;
          if (response.data.list.length) {
            response.data.list.forEach(e => {
              if (e.msg_type == 2 || e.type == 2) {
                that.msgImgArr.push(e);
                that.msgImgArr.forEach((item, k) => (e.msgImgKey = k));
              }
            });
          }
          if (
            response.pagination.current_page == 1 ||
            response.pagination.currentPage == 1
          ) {
            that.record.list = response.data.list;
            that.fixLocation();
          } else {
            // 跳跃到 div 高度 / 页面数 - 显示高度
            // document.getElementById("chatMain").scrollTop = (document.getElementById("chatMain").scrollHeight / response.pagination.currentPage) - document.getElementById('chatMain').offsetHeight;
            response.data.list.forEach(e => that.record.list.unshift(e));
            setTimeout(() => {
              document.getElementById("chatMain").scrollTop = document.getElementById("chatMain").scrollHeight - pcHeight;
              document.getElementsByClassName("chatMain")[0].scrollTop = document.getElementsByClassName("chatMain")[0].scrollHeight - moblieHeight;
            }, 100);
          }
          that.record.pagination = response.pagination;
        })
        .catch(error => console.error(error));
    },
    delChat(id, key) {
      let that = this;
      that
        .$post("/chat/session/remove", {
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
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get("group/list")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.groupList.list = response.data.list;
        })
        .catch(err => loading.close());
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
        .$post("/group/join", {
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
        .$post("/group/exit", {
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
          this.$store.commit("change");
        })
        .catch(err => console.error(err));
    },
    groupSearch() {
      let that = this;
      that
        .$get("group/search", { name: that.searchId })
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
    joinGroup(groupId = 0){
      this.groupId = parseInt(groupId);
      this.groupUserList = this.checkBoxList;
      this.groupState = 1;
      this.$store.commit("change");
    },
    // 发信息
    sendMessage() {
      let that = this,
        params = {
          req: {
            type: 1,
            content: that.message
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
      if (that.state == 1) {
        params.action = "chat";
        params.req.to_uid = that.toUser;
      } else if (that.state == 2) {
        params.action = "group";
        params.req.to_group_id = that.toUser;
      } else return false;
      this.webSocketSend(params);
      this.record.list.push({
        from_user_id: that.user.user.id,
        from_user: {
          from_user_id: that.user.user.id,
          avatar: that.user.user.avatar,
          last_name: that.user.user.display_name
        },
        msg_type: 1,
        content: that.message
      });
      this.message = "";
    },
    // 发文件
    uploadFile(file) {
      let form = new FormData(),
        that = this,
        params = {
          req: {
            type: 3
          }
        };
      if (file.size / 1024 / 1024 > 100) {
        this.$message.error("上传文件大小不能超过 100MB!");
        return false;
      }
      form.append("file", file);
      that
        .$upload("chat/upload_file", form)
        .then(response => {
          if (response.status != 200) return false;

          if (that.state == 1) {
            params.action = "chat";
            params.req.to_uid = that.toUser;
          } else if (that.state == 2) {
            params.action = "group";
            params.req.to_group_id = that.toUser;
          } else return false;

          params.req.content = response.data.path;
          that.webSocketSend(params);
          that.record.list.push({
            from_user_id: that.user.user.id,
            from_user: {
              from_user_id: that.user.user.id,
              avatar: that.user.user.avatar,
              last_name: that.user.user.display_name
            },
            msg_type: 3,
            content: response.data.path
          });
        })
        .catch(error => console.error(error));
    },
    // 发图片
    uploadImg(file) {
      let form = new FormData(),
        that = this,
        params = {
          req: {
            type: 2
          }
        };

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
      that
        .$upload("chat/upload_file", form)
        .then(response => {
          if (response.status != 200) return false;
          if (that.state == 1) {
            params.action = "chat";
            params.req.to_uid = that.toUser;
          } else if (that.state == 2) {
            params.action = "group";
            params.req.to_group_id = that.toUser;
          } else return false;
          params.req.content = response.data.path;
          that.webSocketSend(params);
          that.record.list.push({
            from_user_id: that.user.user.id,
            from_user: {
              from_user_id: that.user.user.id,
              avatar: that.user.user.avatar,
              last_name: that.user.user.display_name
            },
            msg_type: 2,
            content: response.data.path
          });
        })
        .catch(error => console.error(error));
    },
    getMembers() {
      let that = this;
      that
        .$get("chat/select/members")
        .then(response => {
          if (response.status != 200) return false;
          let arr = [];
          response.data.colleagues.forEach(e => arr.push(e));
          response.data.friends.forEach(e => arr.push(e));
          response.data.strangers.forEach(e => arr.push(e));
          that.checkBoxList = arr;
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
    webSocket() {
      let socketAddress = "wss://factoryun.com/wss";
      // let socketAddress = "ws://skyliu.cn/ws";
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
                  this.record.list.push({
                    from_user_id: result.resp.from_uid,
                    from_user: {
                      from_user_id: result.resp.from_uid,
                      avatar:
                        result.resp.avatar ||
                        "https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/default_avatar/%E5%A4%B4%E5%83%8Fxhdpi.png",
                      last_name: this.userName
                    },
                    msg_type: result.resp.type,
                    content: result.resp.content
                  });
                  // this.getRecord({ id: this.toUser, username: this.userName });
                  this.$notify({ title: `收到一条新消息`, message: result.resp.content });
                  let notification = new Notification("收到一条新消息",{ body: result.resp.content });
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
              this.record.list.push({
                from_user_id: result.resp.from_uid,
                from_user: {
                  from_user_id: result.resp.from_uid,
                  avatar:
                    result.resp.avatar ||
                    "https://factoryun.oss-cn-shenzhen.aliyuncs.com/aliyun_oss/default_avatar/%E5%A4%B4%E5%83%8Fxhdpi.png",
                  last_name: this.userName
                },
                msg_type: result.resp.type,
                content: result.resp.content
              });
              // this.getRecord({ id: this.toUser, username: this.userName });
              this.$notify({ title: `${ this.userName }收到一条群消息`, message: result.resp.content });
              let notification = new Notification(`${ this.userName }收到一条群消息`,{ body: result.resp.content });
            }
            this.fixLocation();
            break;
          case "notice":
            console.log(result);
            this.$notify({
              title: `您有一条来自${ result.resp.from_name }的通知`,
              message: result.resp.content
            });
            let notification = new Notification(
              `您有一条来自${ result.resp.from_name }的通知`, {
                body: result.resp.content
              }
            );
            this.noticesList.list.unshift({
              id: result.resp.notice_id,
              from_user: {
                last_name: result.resp.from_name,
              },
              message: result.resp.content,
              type: result.resp.type,
              user_id: result.resp.user_id
            })
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
      let that = this;
      this.ws.send(JSON.stringify(action));
    },
    webSocketClose() {
      clearInterval(this.pong);
      this.ws.close();
    },
    fixLocation() {
      setTimeout(() => {
        document.getElementById("chatMain").scrollTop = document.getElementById("chatMain").scrollHeight;
        document.getElementsByClassName("chatMain")[0].scrollTop = document.getElementsByClassName("chatMain")[0].scrollHeight;
      }, 100);
    }
  },
  components: {
    groupUserCheckBox: groupUserCheckBox
  },
  mounted() {
    Notification.requestPermission(status => console.log(status));
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

    document.getElementById("chatMain").onscroll = e => {
      if (!e.target.scrollTop && this.record.pagination.total > 15 && (this.record.pagination.total / 15) > this.record.pagination.currentPage)
        this.getRecord({ id: this.toUser, username: this.userName, index: this.key });
    };
    document.getElementsByClassName("chatMain")[0].onscroll = e => {
      if (!e.target.scrollTop && this.record.pagination.total > 15 && (this.record.pagination.total / 15) > this.record.pagination.currentPage)
        this.getRecord({ id: this.toUser, username: this.userName, index: this.key });
    }
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
  top: 2rem;
}
#message {
  width: 100%;
  box-sizing: border-box;
  .el-container {
    height: 100%;
    @media screen and (min-width: 820px){
      .pcShowImportant{
        display: block !important;
      }
    }
    .el-aside {
      height: 100%;
      background-color: @black;
      box-sizing: border-box;
      padding: 2rem 1rem;
      @media screen and (max-width: 820px){
        
      }
      .function {
        list-style: none;
        li {
          margin-bottom: 1.5rem;
          text-align: center;
          height: 3rem;
          overflow: hidden;
          img {
            width: 100%;
            border-radius: 0.5rem;
          }
          i {
            font-size: 27px;
            color: @gery;
          }
          .is-active {
            color: @blue;
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
          @media screen and (max-width: 820px){
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
              &:hover {
                background-color: @hoverBackground;
              }
              .avatarBox {
                width: 50px;
                height: 50px;
                overflow: hidden;
                display: inline-block;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
              > span {
                margin-left: 1rem;
              }
              label{
                display: block;
                width: 85%;
                overflow: hidden;
                text-overflow: ellipsis;
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
          @media screen and (max-width: 820px){
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
              > i {
                @media screen and (min-width: 820px){
                  display: none;
                }
                font-size: 2rem;
                font-weight: bold;
              }
            }
          }
          .el-main {
            overflow-y: auto;
            border-bottom: @chatBorder;
            .chatMain {
              padding: 2rem 2.5rem 1rem 1.5rem;
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
                            color: @white;
                          }
                        }
                      }
                    }
                    .Bubble {
                      .Bubble();
                      left: 0;
                      border-top: 0.5rem solid @FFF;
                      border-left: 0.5rem solid @FFF;
                      border-right: 0.5rem solid @blue;
                      border-bottom: 0.5rem solid @FFF;
                    }
                  }
                }
              }
            }
          }
          ::-webkit-scrollbar{
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
        }
      }
    }
  }
}
</style>
