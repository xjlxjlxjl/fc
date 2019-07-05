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
                <div style="white-space: nowrap;" v-for="e in pic.drawing_working">
                  <a :href="e" target="_blank">{{ e.split('/').pop() }}</a>
                </div>
              </td>
              <td>
                <div style="white-space: nowrap;" v-for="e in pic.assembly_drawing">
                  <a :href="e" target="_blank">{{ e.split('/').pop() }}</a>
                </div>
              </td>
              <td>
                <div style="white-space: nowrap;" v-for="e in pic.drawing_approve">
                  <a :href="e" target="_blank">{{ e.split('/').pop() }}</a>
                </div>
              </td>
              <td>
                <div style="white-space: nowrap;" v-for="e in pic.drawing_2d">
                  <a :href="e" target="_blank">{{ e.split('/').pop() }}</a>
                </div>
              </td>
              <td>
                <div style="white-space: nowrap;" v-for="e in pic.drawing_3d">
                  <a :href="e" target="_blank">{{ e.split('/').pop() }}</a>
                </div>
              </td>
              <td>
                <div style="white-space: nowrap;" v-for="e in pic.drawing_pdf">
                  <a :href="e" target="_blank">{{ e.split('/').pop() }}</a>
                </div>
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
  },
  mounted() {
    $('#getMaterialPic').on('shown.bs.modal', () => {
      console.log(this.pic)
    })
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
