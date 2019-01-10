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
          <div class="modalBoxMainContent">
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
                  <span>{{ row.user.display_name }}</span>
                </template>
              </el-table-column>
              <el-table-column label=" ">
                <template slot-scope="{row}">
                  <a :href="row.content" target="_blank">
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
    return {};
  },
  props: {
    fileList: Object
  },
  methods: {
    onSubmit() {
      this.close();
    },
    close() {
      this.$store.commit("changeModal", "fileListModal");
    }
  },
  computed: mapState(["fileListModal"])
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