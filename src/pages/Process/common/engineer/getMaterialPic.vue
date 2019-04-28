<template>
  <div class="modal fade" id="getMaterialPic" role="dialog">
    <div class="modal-dialog" role="document" style="width: 1280px;max-width: 100%;">
      <div class="modal-content table-responsive">
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td>加工图</td>
              <td>组装图</td>
              <td>承认图</td>
              <td>2D图纸</td>
              <td>3D图纸</td>
              <td>PDF图纸</td>
            </tr>
            <tr>
              <td>
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :file-list="pic.drawing_working"
                  list-type="picture">
                </el-upload>
              </td>
              <td>
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :file-list="pic.assembly_drawing"
                  list-type="picture">
                </el-upload>
              </td>
              <td>
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :file-list="pic.drawing_approve"
                  list-type="picture">
                </el-upload>
              </td>
              <td>
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :file-list="pic.drawing_2d"
                  list-type="picture">
                </el-upload>
              </td>
              <td>
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :file-list="pic.drawing_3d"
                  list-type="picture">
                </el-upload>
              </td>
              <td>
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :file-list="pic.drawing_pdf"
                  list-type="picture">
                </el-upload>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "getMaterialPic",
  data() {
    return {
    };
  },
  props: {
    pic: Object
  },
  methods: {
    handlePreview(file) {
      console.log(file);
    }
  }
}
</script>
<style lang="less">
#getMaterialPic {
  .table {
    margin-bottom: 0;
    tr {
      td {
        input[type=file] {
          display: none;
        }
      }
    }
  }
}
</style>
