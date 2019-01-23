<template>
  <div id="contract">
    <div class="tabs-nav">
      <div
        v-for="(item,index) in tabsNav"
        :key="index"
        :class="state == item.state ? 'isActive' : ''"
        @click="getContract(item.state, item.contractStatus)"
      >{{ item.name }}</div>
    </div>
    <div id="contractList" class="contractList">
      <div class="contractDetail" v-for="(item,index) in tableData" :key="index">
        <div class="contractHeader">
          <div>
            <span>合同编号：{{ item.contract_no || '无'}}</span>
            <span>生成日期：{{ item.created_at || '无'}}</span>
            <span>签订日期：{{ item.updated_at || '无' }}</span>
          </div>
          <div>
            <span>{{ item.enabled == 0 ? '待签订' : '已签订' }}</span>
          </div>
        </div>
        <div class="contractContant">
          <div>甲方：{{ item.a_company }}</div>
          <div>乙方：{{ item.b_company }}</div>
          <div>
            <a
              :href="`https://factoryun.com/orders/contract/pdf/${ item.slug }?download=1`"
              target="_blank"
              rel="noopener noreferrer"
            >下载合同</a>
            <router-link :to="'/contractDetail/' + item.slug" target="_blank">查看合同</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "contract",
  data() {
    return {
      baseUrl: baseUrl,
      state: 0,
      tabsNav: [
        { name: "全部", state: 0, contractStatus: "" },
        { name: "已签订", state: 1, contractStatus: 1 },
        { name: "待签订", state: 2, contractStatus: 0 }
      ],
      tableData: [],
      contractList: {
        list: [],
        pagination: {
          page: 0,
          per_page: 10
        }
      },
      // 已签订
      alreadyList: {
        list: [],
        pagination: {
          page: 0,
          per_page: 10
        }
      },
      // 待签订
      signedList: {
        list: [],
        pagination: {
          page: 0,
          per_page: 10
        }
      }
    };
  },
  methods: {
    changeContractState(state, contractStatus) {
      let that = this;
      switch (state) {
        case 1:
          that.tableData = that.alreadyList.list;
          that.alreadyList.page++;
          break;
        case 2:
          that.tableData = that.signedList.list;
          that.signedList.page++;
          break;
        default:
          that.tableData = that.contractList.list;
          that.contractList.page++;
          break;
      }
      that.state = state;
    },
    getContract(state, contractStatus) {
      const loading = this.$loading({ lock: true }),
        that = this;
      let self = null;
      switch (state) {
        case 1:
          self = that.alreadyList;
          break;
        case 2:
          self = that.signedList;
          break;
        default:
          self = that.contractList;
          break;
      }
      that
        .$get("orders/contract/me", {
          status: contractStatus,
          page: ++self.pagination.page,
          per_page: self.pagination.per_page
        })
        .then(response => {
          loading.close();
          if (response.status != 200) return false;

          for (let item of response.data.list) {
            self.list.push(item);
          }
          that.changeContractState(state, contractStatus);
        })
        .catch(error => {
          that.changeContractState(state, contractStatus);
          --self.pagination.page;
          loading.close();
        });
    }
  },
  mounted() {
    document.getElementById("contractList").onscroll = e => {
      if (e.target.scrollTop == e.target.scrollHeight - e.target.offsetHeight)
        this.getContract(this.state, this.tabsNav[this.state].contractStatus);
    };
  },
  created() {
    this.getContract(0, "");
  }
};
</script> 
<style lang="less" scoped>
@white: #ffffff;
@bule: #0064db;
@sky: #2288ff;
@gery: #f3f4f7;
@black: #000000;
@org: #ff9900;
@border: 1px solid @gery;
.flex-center() {
  display: flex;
  justify-content: center;
  align-items: center;
}
#contract {
  padding: 2rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: #666666;
  .tabs-nav {
    width: 100%;
    > div {
      width: 33.33333%;
      text-align: center;
      box-sizing: border-box;
      color: @bule;
      background-color: @gery;
      border: 1px solid @white;
      padding: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        background-color: @sky;
        color: @white;
      }
    }
    > div.isActive {
      background-color: @bule;
      color: @white;
    }
    .flex-center;
  }
  .contractList {
    padding-top: 2rem;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    .contractDetail {
      min-width: 900px;
      box-sizing: border-box;
      margin-bottom: 2rem;
      border: @border;
      .contractHeader {
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        background-color: @gery;
        padding: 1rem;
        > div:first-child {
          width: 80%;
          display: flex;
          justify-content: space-between;
          > span:first-child {
            color: @black;
          }
        }
        > div:last-child {
          color: @org;
        }
      }
      .contractContant {
        display: flex;
        box-sizing: border-box;
        > div {
          flex-basis: 40%;
          box-sizing: border-box;
          padding: 1rem;
          border-right: @border;
          &:last-child {
            flex-basis: 20%;
            border: none;
            text-align: center;
            a {
              text-decoration: none;
              background: @sky;
              padding: 0.3rem 0.5rem;
              border-radius: 0.5rem;
              color: @white;
            }
          }
        }
      }
    }
  }
}
</style>