<template>
  <transition>
    <div id="fileList" v-show="fileListModal">
      <div class="Curtain" @click="close"></div>
      <div class="modalBox">
        <div class="modalBoxMain">
          <div class="modalBoxMainHeader">
            <div class="modalBoxMainHeaderTitle">文件列表</div>
            <div class="modalBoxMainHeaderBtn" @click="close">
              <i class="el-message-box__close el-icon-close"></i>
            </div>
          </div>
          <div ref="box" class="modalBoxMainContent">
            <el-table :data="fileList.list">
              <el-table-column label="文件">
                <template slot-scope="{row}">
                  <span>{{ row.content.split('/').pop() }}</span>
                </template>
              </el-table-column>
              <el-table-column label="上传时间">
                <template slot-scope="{row}">
                  <span>{{ row.created_at }}</span>
                </template>
              </el-table-column>
              <el-table-column label="上传者">
                <template slot-scope="{row}">
                  <span>{{ row.user ? row.user.display_name : row.from_user ? row.from_user.display_name : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column label=" ">
                <template slot-scope="{row}">
                  <a
                    href="javascript:;"
                    @click="downFile(row.content,row.content.split('/').pop())"
                  >
                    <i class="el-icon-download"></i>
                  </a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="modalBoxMainBtn">
            <el-button size="mini" type="primary" @click="onSubmit">确定</el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "fileList",
  data() {
    return {
      fileList: {
        list: [],
        pagination: {
          current_page: 0,
          total_page: 1
        }
      }
    };
  },
  props: {
    toUser: Number,
    state: Number
  },
  methods: {
    onSubmit() {
      this.close();
    },
    downFile(content, filename) {
      this.download(content, filename);
    },
    close() {
      this.$store.commit("changeModal", "fileListModal");
    },
    getFileList() {
      if (
        this.fileList.pagination.current_page <
        this.fileList.pagination.total_page
      ) {
        let that = this,
          url = null,
          boxTop = this.$refs["box"].scrollTop,
          params = {
            page: ++this.fileList.pagination.current_page
          },
          setUrl = {
            1: () => {
              url = `chat/files`;
              params.friend_id = this.toUser;
            },
            2: () => {
              url = `group/files`;
              params.group_id = this.toUser;
            }
          };
        setUrl[this.state]();

        that
          .$get(url, params)
          .then(response => {
            if (response.status != 200) return false;
            if (params.page == 1) {
              that.fileList = {
                list: response.data,
                pagination: response.pagination
              };
              this.$nextTick(() => (this.$refs["box"].scrollTop = 0));
            } else {
              response.data.forEach(e => that.fileList.list.push(e));
              that.fileList.pagination = response.pagination;
              this.$nextTick(() => (this.$refs["box"].scrollTop = boxTop));
            }
          })
          .catch(err => console.error(err));
      }
    }
  },
  computed: mapState(["fileListModal"]),
  watch: {
    fileListModal(val) {
      if (!val) return false;
      this.getFileList();
      this.$refs["box"].onscroll = e => {
        if (
          this.$refs["box"].scrollTop ==
          this.$refs["box"].scrollHeight - e.target.clientHeight
        )
          this.getFileList();
      };
    },
    toUser(val) {
      this.fileList.pagination = {
        current_page: 0,
        total_page: 1
      };
      this.$refs["box"].scrollTop = 0;
    },
    state(val) {
      this.fileList.pagination = {
        current_page: 0,
        total_page: 1
      };
      this.$refs["box"].scrollTop = 0;
    }
  }
};
</script>
<style lang="less">
@gery: #666666;
#fileList {
  .modalBox {
    position: absolute;
    .modalBoxMain {
      width: 680px;
      margin-top: 0 !important;
      .modalBoxMainContent {
        height: 480px;
        overflow: auto;
        .el-table {
          .el-table__body-wrapper {
            .el-table__row {
              td {
                .cell {
                  > span {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  > a {
                    text-decoration: none;
                    color: @gery;
                    > i {
                      font-size: 2rem;
                      font-weight: bold;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>