<template>
  <div id="Presentation">
    <!-- <el-aside width="200px"></el-aside> -->
    <createdCustomer @refresh="refresh" :number="$route.params.modal"></createdCustomer>
    <el-main>
      <div class="main">
        <router-link :to="`/customer/${$route.params.modal}`">
          <el-button type="primary" class="createdService">创建客服申请</el-button>
        </router-link>
        <div id="canvasBox"></div>
        <img v-for="(item,index) in data.image" :key="index" :src="item" style="width: 100%">
      </div>
    </el-main>
    <index-chart></index-chart>
  </div>
</template>
<script>
import indexChart from "@/pages/Index/common/indexChart";
import createdCustomer from "@/pages/Process/common/createdCustomer";
import PDFJS from "pdfjs-dist";

export default {
  name: "Presentation",
  data() {
    return {
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      scale: 1,
      data: {}
    };
  },
  components: {
    "index-chart": indexChart,
    createdCustomer: createdCustomer
  },
  methods: {
    getReprot(code) {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get(`quality/report/${code}`)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          if (typeof response.data.urls.product_attachment != "object")
            return false;
          that.data = response.data.urls;
          response.data.urls.pdf.forEach(e => {
            this.showPDF(e);
          });
        })
        .catch(err => loading.close());
    },
    showPDF(url) {
      let _this = this;
      PDFJS.getDocument(url).then(function(pdf) {
        _this.pdfDoc = pdf;
        for (let i = 1; i < pdf.numPages + 1; i++) {
          _this.renderPage(i);
        }
      });
    },
    renderPage(num) {
      this.pageRendering = true;
      let _this = this;
      this.pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport(_this.scale);
        // let canvas = document.getElementById("the-canvas");
        let canvas = document.createElement("canvas");
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: canvas.getContext("2d"),
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        document.getElementById("canvasBox").appendChild(canvas);
        // Wait for rendering to finish
        renderTask.promise.then(function() {
          _this.pageRendering = false;
          if (_this.pageNumPending !== null) {
            // New page rendering is pending
            _this.renderPage(_this.pageNumPending);
            _this.pageNumPending = null;
          }
        });
      });
    },
    createdService() {
      createdCustomer.methods.close.call(this);
    },
    refresh() {
      console.log("假装刷新");
    }
  },
  created() {
    this.getReprot(this.$route.params.modal);
  }
};
</script>
<style lang="less">
@white: #ffffff;
@gery: #e6e6e6;
@background: #f2f2f2;
@borderBlod: 1rem solid @background;
@border: 1px solid @background;
#Presentation {
  width: 1280px;
  max-width: 100%;
  height: 87%;
  background-color: @white;
  margin: 1.5rem auto;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  @media screen and (min-width: 820px) {
    .el-aside {
      height: 100%;
      border-right: @borderBlod;
      box-sizing: border-box;
    }
    .el-main {
      height: 100%;
      padding: 0;
      .createdService {
        position: absolute;
        right: 0;
      }
      canvas {
        width: 100%;
      }
      .main {
        width: 93.2%;
        height: 100%;
        padding: 2rem;
        position: relative;
        box-sizing: border-box;
        #the-canvas {
          width: 100%;
        }
      }
    }
  }

  @media screen and (max-width: 820px) {
    .el-aside {
      width: 100% !important;
    }
    .el-main {
      padding: 0;
      .createdService {
        position: fixed;
        right: 0;
      }
      canvas {
        width: 100%;
      }
    }
  }
}
</style>
