<template>
  <transition name="el-fade-in-linear">
    <div id="groupUserCheckBox" v-show="ModalShow">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div
              class="modalBoxMainHeaderTitle"
            >{{ groupState == 0 ? '群聊用户' : groupState == 1 ? '用户列表' : '转发'}}</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="userList">
              <el-checkbox-group v-model="userList" v-if="!groupState">
                <el-checkbox
                  v-for="(item,index) in groupUser"
                  :key="index"
                  :label="item.id"
                  :checked="item.isClick"
                  :disabled="item.id == user.user.id"
                >
                  <span>{{ item.last_name }}</span>
                </el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-model="userList" v-else>
                <el-checkbox
                  v-for="(item,index) in groupUser"
                  :key="index"
                  :label="item.id"
                  v-show="item.id != user.user.id"
                  :checked="item.isClick"
                >
                  <span>{{ item.last_name }}</span>
                </el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-model="groupList" v-if="groupState == 2">
                <el-checkbox
                  v-for="(item,index) in group"
                  :key="index"
                  :label="item.id"
                  :checked="item.isClick"
                >
                  <span>{{ item.group_name }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <el-button
              size="mini"
              type="primary"
              v-if="groupState == 1"
              @click="joinGroup(userList, '群聊', groupId)"
            >{{groupId ? '邀请加入' : '创建群聊'}}</el-button>
            <el-button size="mini" type="danger" v-else-if="groupState == 0" @click="kick">踢出</el-button>
            <el-button
              size="mini"
              type="info"
              v-else-if="groupState == 2"
              @click="$emit('send', {user: userList, group: groupList}),close()"
            >确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "groupUserCheckBox",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      userList: [],
      groupList: []
    };
  },
  props: {
    groupId: Number,
    groupState: Number,
    groupUser: Array,
    group: Array
  },
  methods: {
    joinGroup(userId, groupName = "", groupId = 0) {
      let that = this,
        params = { user_ids: userId.join(",") },
        membersArr = [];
      this.groupUser.forEach(e =>
        userId.forEach(i => {
          if (e.id == i) membersArr.push(e.last_name);
        })
      );
      params.invite_username = membersArr.join(",");
      if (groupId) params.group_id = groupId;
      else {
        if (userId.length > 6) params.group_name = groupName;
        else params.group_name = membersArr.join(",");
      }
      that
        .$post("group/invite", params)
        .then(response => {
          if (response.status != 200) return false;
          setTimeout(() => {
            if (!groupId) that.$emit("refresh");
          }, 1000);

          that.close();
        })
        .catch(error => console.error(error));
    },
    kick() {
      let that = this,
        membersArr = [];
      this.groupUser.forEach(e =>
        this.userList.forEach(i => {
          if (e.id == i) membersArr.push(e.last_name);
        })
      );
      that
        .$post("group/remove/user", {
          group_id: that.groupId,
          user_ids: that.userList.join(","),
          remove_username: membersArr.join(",")
        })
        .then(response => {
          if (response.status != 200) return false;
          that.close();
        })
        .catch(err => console.error(err));
    },
    clearForm() {
      this.userList = [];
      this.groupList = [];
    },
    close() {
      this.$store.commit("change");
    }
  },
  computed: mapState(["ModalShow"]),
  watch: {
    ModalShow(val) {
      this.clearForm();
    }
  }
};
</script>
<style lang="less">
#groupUserCheckBox {
  .modalBox {
    .modalBoxMain {
      width: 480px;
      max-width: 100%;
      max-height: 100%;
      padding-bottom: 0;
      margin-top: 0px !important;
      #userList {
        height: 460px;
        overflow-y: auto;
        .el-checkbox-group {
          .el-checkbox {
            min-width: 60px;
            width: 25%;
            margin-right: 30px;
            margin-left: 0px;
            margin-bottom: 0.5rem;
            &:last-child {
              margin-right: 0px;
            }
          }
        }
      }
      button {
        margin-top: 1rem;
      }
    }
  }
}
</style>
