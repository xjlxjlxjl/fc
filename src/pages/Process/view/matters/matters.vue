<template>
  <el-container id="matters">
    <companyAside :aside="aside"></companyAside>
    <overTimeModal @refresh="refreshed"></overTimeModal>
    <addLeaveModal @refresh="refreshed"></addLeaveModal>
    <addOutsiteModal @refresh="refreshed"></addOutsiteModal>
    <addNoteModal @refresh="refreshed"></addNoteModal>
    <el-main>
      <div class="global">
        <el-button size="mini" @click="addOverTime">新建加班申请</el-button>
        <el-button size="mini" @click="addLeave">新建请假单</el-button>
        <el-button size="mini" @click="addOutsite">新建出差申请</el-button>
        <el-button size="mini" @click="addNote">添加备忘录</el-button>
        <!-- <el-button size="mini">申请年假</el-button> -->
        <el-button size="mini" @click="addSign">签到</el-button>
      </div>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
<script>
import companyAside from "@/pages/Process/common/companyAside";
import addOvertime from "@/pages/Process/common/addOvertime";
import addLeave from "@/pages/Process/common/addLeave";
import addOutsite from "@/pages/Process/common/addOutsite";
import addNote from "@/pages/Process/common/addNote";

export default {
  name: "matters",
  data() {
    return {
      aside: this.$store.state.process.matters,
      geolocation: new BMap.Geolocation()
    };
  },
  components: {
    companyAside: companyAside,
    overTimeModal: addOvertime,
    addLeaveModal: addLeave,
    addOutsiteModal: addOutsite,
    addNoteModal: addNote
  },
  methods: {
    addOverTime() {
      addOvertime.methods.close.call(this);
    },
    addLeave() {
      addLeave.methods.close.call(this);
    },
    addOutsite() {
      addOutsite.methods.close.call(this);
    },
    addNote() {
      addNote.methods.close.call(this);
    },
    addSign() {
      let that = this;
      this.geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            that
              .$post(`personnels/siginin/create`, {
                work: "on",
                signin_address: {
                  address:
                    r.address.province +
                    r.address.city +
                    r.address.district +
                    r.address.street,
                  x: r.longitude,
                  y: r.latitude
                }
              })
              .then(response => {
                if (response.status != 200) return false;
                that.$message({ message: "打卡成功", type: "success" });
                if (that.$route.fullPath == "/Matters/sign")
                  that.refresh($("#mattersTable"));
              })
              .catch(err => {});
          } else
            that.$message({ message: "浏览器不支持获取定位", type: "error" });
        },
        { enableHighAccuracy: true }
      );
    },
    refreshed() {
      this.refresh($("#mattersTable"));
    }
  }
};
</script>
<style lang="less">
@background: #f2f2f2;
@borderBlod: solid 1rem @background;
@border: solid 1px @background;
@white: #ffffff;
@gery: #666666;
#matters {
  .global {
    padding: 11px 0 0 11px;
  }
  #mattersToolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .lead {
      margin-right: 20px;
      margin-bottom: 0;
    }
  }
  .table th,
  .table td {
    text-align: center;
    vertical-align: middle !important;
  }
  .el-main
    .bootstrap-table
    > .fixed-table-container
    > .fixed-table-body
    > .table
    > thead
    > tr
    > .bs-checkbox {
    min-width: auto;
  }
}
</style>
