<template>
  <el-container id="contrast">
    <join-project :join-project="joinProject" :quantity="parseInt(1)"></join-project>
    <el-aside width="200px">
      <el-menu default-active="0">
        <el-menu-item
          v-for="(item,index) in type"
          :key="index"
          :index="index.toString()"
          @click="Arrangement(contrast[item], index)"
        >
          <i class="el-icon-location"></i>
          <span slot="title">{{ item }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <ul class="attr" v-if="type.length">
        <li></li>
        <li v-for="(item,index) in attribute" :key="index">{{ item.name }}</li>
      </ul>
      <div class="goodsAttr">
        <ul v-for="(val, key) in item" :key="key">
          <li>
            <el-button type="primary" size="mini" @click="addProject(val.id, val.historySlug)">加入项目</el-button>
            <i class="el-icon-close" @click="delProject(key)"></i>
          </li>
          <li v-for="(item,index) in val.attr" :key="index">&nbsp;&nbsp;{{ item.value }}&nbsp;&nbsp;</li>
        </ul>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import joinProjectModel from "@/pages/Index/common/joinProject";

export default {
  name: "contrast",
  data() {
    return {
      contrast: JSON.parse(localStorage.getItem("contrast") || "{}"),
      type: [],
      item: [],
      attribute: [],
      typeKey: 0,
      joinProject: {
        id: 0,
        projectList: [],
        projectSlug: "",
        history: 0,
        status: 0,
        newProjectName: "",
        member: [],
        memberId: [],
        description: ""
      }
    };
  },
  components: {
    "join-project": joinProjectModel
  },
  methods: {
    aside() {
      this.type = Object.keys(this.contrast);
      if (this.type.length)
        this.Arrangement(this.contrast[this.type[this.typeKey]], this.typeKey);
    },
    Arrangement(arr, key) {
      this.typeKey = key;
      this.attribute = [];
      arr.forEach(e => {
        e.assigned.concat(e.attribute);
        e.assigned.forEach(item => {
          let inArr = false;
          this.attribute.forEach(val => {
            if (val.slug == item.slug) inArr = true;
          });
          if (!inArr) this.attribute.push(item);
        });
      });
      this.setGoods(arr);
    },
    setGoods(item) {
      let attr = [];
      item.forEach(e => {
        e.attr = [];
        e.assigned.concat(e.attribute);
        this.attribute.forEach(item => {
          let inArr = false;
          e.assigned.forEach(val => {
            if (val.slug == item.slug) inArr = true;
          });
          if (inArr) e.attr.push(item);
          else e.attr.push({ slug: item.slug, name: item.name, value: "-" });
        });
      });
      this.item = item;
    },
    addProject(id, history) {
      if (!this.$ifLogin()) return false;
      this.joinProject.id = id;
      this.joinProject.history = history;
      joinProjectModel.methods.getProject.call(this);
    },
    delProject(key) {
      this.contrast[this.type[this.typeKey]].splice(key, 1);
      localStorage.setItem("contrast", JSON.stringify(this.contrast));
    }
  },
  created() {
    this.aside();
  }
};
</script>
<style lang="less">
@background: #f2f2f2;
@borderBold: solid 1rem @background;
@org: #ff9900;
@white: #ffffff;
@border: solid 1px @white;
@gery: #666666;
@borderGery: solid 1px @background;
#contrast {
  > .el-aside {
    border-right: @borderBold;
    i {
      display: none;
    }
    .is-active {
      i {
        display: inline-block;
      }
    }
  }
  > .el-main {
    padding: 2rem;
    display: flex;
    justify-content: flex-start;
    overflow-y: auto;
    .attr {
      list-style: none;
      background-color: @org;
      height: max-content;
      li {
        display: flex;
        align-items: center;
        color: @white;
        padding: 1rem;
        border-bottom: @border;
        height: 3.5rem;
        box-sizing: border-box;
        &:first-child {
          height: 4rem;
          box-sizing: border-box;
        }
      }
    }
    .goodsAttr {
      display: flex;
      ul {
        list-style: none;
        height: max-content;
        border-top: @borderGery;
        border-right: @borderGery;
        li {
          display: flex;
          align-items: center;
          color: @gery;
          padding: 1rem;
          border-bottom: @borderGery;
          font-size: 1.3rem;
          width: 14rem;
          height: 3.5rem;
          box-sizing: border-box;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &:nth-child(2n) {
            background-color: @background;
          }
          &:first-child {
            height: 4rem;
            box-sizing: border-box;
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            i {
              font-size: 1.8rem;
            }
          }
        }
      }
    }
  }
}
</style>
