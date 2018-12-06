<template>
  <transition name="el-fade-in-linear">
    <div id="groupUserCheckBox" v-show="ModalShow">
      <div class="Curtain"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">{{ groupState == 0 ? '群聊用户' : '用户列表'}}</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div class="modalBoxMainContent">
            <div id="userList">
              <el-checkbox-group v-model="userList">
                <el-checkbox
                  v-for="item in groupUser"
                  :key="item.id"
                  :label="item.id"
                  v-if="item.id != user.user.id"
                >
                  <span>{{ item.last_name }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>
            <el-button
              size="mini"
              type="primary"
              v-if="groupState == 1"
              @click="joinGroup(userList, '群聊', groupId)"
            >邀请加入</el-button>
            <el-button size="mini" type="danger" v-else-if="groupState == 0" @click="kick">踢出</el-button>
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
      userList: []
    };
  },
  props: {
    groupId: Number,
    groupState: Number,
    groupUser: Array
  },
  methods: {
    joinGroup(userId, groupName = "", groupId = 0) {
      let that = this,
        params = { user_ids: userId.join(",") };
      if (groupId) params.group_id = groupId;
      else params.group_name = groupName;
      that
        .$post("group/invite", params)
        .then(response => {
          if (response.status != 200) return false;
          that.close();
        })
        .catch(error => console.error(error));
    },
    kick() {
      let that = this;
      that
        .$post("group/remove/user", {
          group_id: that.groupId,
          user_ids: that.userList.join(",")
        })
        .then(response => {
          if (response.status != 200) return false;
          that.close();
        })
        .catch(err => console.error(err));
    },
    close() {
      this.$store.commit("change");
    }
  },
  computed: mapState(["ModalShow"])
};
</script>
<style lang="less">
#groupUserCheckBox {
  .modalBox {
    #userList {
      height: 20rem;
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
</style>
