<template>
  <div id="inspection">
    <editOqcModal :row="row" @refresh="refreshed"></editOqcModal>
    <designate type="self_check" @user="user"></designate>
    <!--startprint-->
    <div class="modal fade" id="myModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content" style="width: 700px;">
          <div id="print" ref="print" class="modal-body" style="box-sizing:box-sizing;">
            <div :style="`border:1px solid #000;width: ${width}px;height: ${height}px;`">
              <div style="display: flex;flex-wrap: wrap;">
                <div id="qrcode" style="border:1px solid #000;width: 160px;height: 160px;"></div>
                <div :style="`width: ${parseInt(width)-162}px`">
                  <div style="border: 1px solid #000;padding: 10px;display:flex;">
                    <div style="flex-grow: 3;text-align: center;">
                      <img :src="print.company.logo" width="50px" height="50px">
                    </div>
                    <div style="flex-grow: 9;">
                      <p
                        style="font-size:24px;margin: 0 0 7px;font-weight: bold;"
                      >{{ print.company.name }}</p>
                      <p style="margin-bottom: 0;">
                        <span style="font-size:22px;font-weight: bold;">{{ print.company.website }}</span>
                        <span
                          style="font-size:22px;font-weight: bold;"
                        >{{ print.company.contact_phone }}</span>
                      </p>
                    </div>
                  </div>
                  <div style="display: flex;">
                    <div
                      :style="`border: 1px solid #000;width: 150px;font-weight: bold;text-align: center;font-size: 22px;line-height: 30px;`"
                    >型号</div>
                    <div
                      :style="`border: 1px solid #000;width: ${parseInt(width) - 312}px;height: 33px;font-weight: bold;line-height: 30px;font-size: ${ print.model.length < 28 ? '22px' : print.model.length < 34 ? '17px' : print.model.length < 41 ? '14px' : '12px' };padding-left: 5px;`"
                    >{{ print.model }}</div>
                  </div>
                  <div style="display: flex;">
                    <div
                      :style="`border: 1px solid #000;width: 150px;font-weight: bold;text-align: center;font-size: 22px;line-height: 30px;`"
                    >SN</div>
                    <div
                      :style="`border: 1px solid #000;width: ${parseInt(width) - 312}px;height: 33px;font-weight: bold;line-height: 30px;font-size: 22px;padding-left: 5px;`"
                    >{{ print.sn }}</div>
                  </div>
                </div>
              </div>
              <div style="display:flex;height:300px;flex-wrap:wrap;align-content: stretch;">
                <div
                  style="display: flex;box-sizing: box-border;width: 50%;"
                  v-for="(item,index) in print.list"
                  :key="index"
                >
                  <div
                    style="width: 50%;box-sizing: box-border;border: 1px solid #000;padding: 5px;font-size: 21px;display: flex;align-item: center;"
                  >
                    <input
                      type="text"
                      style="width: 100%;border: none;outline:none"
                      v-model="item.name"
                      @keyup="editAttr"
                    >
                  </div>
                  <div
                    style="width: 50%;box-sizing: box-border;border: 1px solid #000;padding: 5px;font-size: 21px;display: flex;align-item: center;"
                  >
                    <input
                      type="text"
                      style="width: 100%;border: none;outline:none"
                      v-model="item.value"
                      @keyup="editAttr"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <!-- <div>
              <label for>
                <el-input size="mini" v-model="width">
                  <span slot="prefix">宽</span>
                </el-input>
              </label>
              <label for>
                <el-input size="mini" v-model="height">
                  <span slot="prefix">高</span>
                </el-input>
              </label>
            </div>-->
            <button type="button" class="btn btn-success btn-small" @click="addlist">添加属性</button>
            <button type="button" class="btn btn-danger btn-small" @click="dellist">删除列尾属性</button>
            <button type="button" class="btn btn-info btn-small" @click="printing">打印</button>
          </div>
        </div>
      </div>
    </div>
    <!--endprint-->

    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import PDFJS from "pdfjs-dist";
import editOqcModal from "@/pages/Process/common/OQC/editOqc";
import designate from '@/pages/Process/common/store/designate';

export default {
  name: "inspection",
  data() {
    return {
      activeSlug: "",
      row: {},
      print: {
        code: "screw_module",
        company: {
          logo: {
            company_id: 0,
            created_at: "",
            created_by_id: 0,
            deleted_at: "",
            disk_id: 0,
            entry_id: "",
            entry_type: "",
            extension: "",
            folder_id: 0,
            height: "",
            id: 0,
            keywords: "",
            location: "",
            mime_type: "",
            name: "",
            path: "",
            size: 0,
            sort_order: 0,
            updated_at: "",
            updated_by_id: 0,
            width: 0
          },
          name: "",
          website: "",
          contact_phone: ""
        },
        list: [],
        model: "",
        qrcode: "",
        sn: ""
      },
      width: 670,
      height: 462,
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      scale: 1
    };
  },
  components: {
    editOqcModal: editOqcModal,
    designate: designate
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`quality/list`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => console.error(e));
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        search: params.search || undefined
      };
    },
    editAttr() {
      this
        .$post(`quality/print/attribute/update/${this.activeSlug}`, {
          attributes: JSON.stringify(this.print.list)
        })
        .then(response => {
          if (response.status != 200) return false;
        })
        .catch(err => console.error(err));
    },
    addlist() {
      this.print.list.push({
        name: "",
        slug: "",
        value: ""
      });
      this.editAttr();
    },
    dellist() {
      this.print.list.pop();
      this.editAttr();
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "订单号",
            formatter(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qr_code_text",
            title: "二维码",
            formatter(value, row) {
              setTimeout(() =>QRCode.toString(value, (err, string) => (document.getElementById(`inspection${row.id}`).innerHTML = string)), 500);
              return `<div id="inspection${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            }
          },
          {
            field: "send_number",
            title: "送检单号"
          },
          {
            field: "created.last_name",
            title: "送检人",
          },
          {
            field: "created_at",
            title: "送检日期",
          },
          {
            field: "order.numbering",
            title: "订单号",
          },
          {
            field: "schedule.sn_code",
            title: "SN码"
          },
          {
            field: "material.material_number",
            title: "料品编码",
          },
          {
            field: "material.material_specification",
            title: "料品规格",
          },
          {
            field: "material.name",
            title: "料品名称",
          },
          {
            field: "inspector",
            title: "质检员",
            formatter(value, row, index) {
              return value.map(e => e.last_name).join(',');
            }
          },
          {
            field: "check_status",
            title: "质检状态",
            formatter(value, row, index) {
              switch (value) {
                case 'wait_verify':
                  return "待审核";
                default:
                  return "通过";
              }
            }
          },
          {
            field: "id",
            title: "操作",
            formatter: (value, row, index) => {
              let assign = `<button class="btn btn-danger btn-sm assign">指派质检</button>`,
                edit =  `<button class="btn btn-success btn-sm edit">质检报告</button>`,
                print = `<button class="btn btn-primary btn-sm print">打印标签</button>`,
                notice = `<button class="btn btn-warning btn-sm notice">通知打包</button>`;
              return assign + edit + print + notice;
            },
            events: {
              "click .assign"(e, value, row, index) {
                that.id = value;
                $('#inspection #designate').modal("show");
              },
              "click .edit"(e, value, row, index) {
                let imgArr = [],
                  pdfArr = [],
                  images = [],
                  report = [];
                row.images_url.forEach(e => {
                  imgArr.push({
                    name: e.url.split("/").pop(),
                    url: e.url
                  });
                  images.push(e.id);
                });
                row.report_url.forEach(e => {
                  pdfArr.push({
                    name: e.url.split("/").pop(),
                    url: e.url
                  });
                  report.push(e.id);
                });
                row.images_url = imgArr;
                row.report_url = pdfArr;
                row.images = images;
                row.report = report;
                that.row = row;
                editOqcModal.methods.close.call(that);
              },
              "click .print"(e, value, row, index) {
                that
                  .$get(`quality/print/${row.slug}`)
                  .then(response => {
                    if (response.status != 200) return false;
                    QRCode.toString(
                      response.data.qrcode,
                      (err, string) =>
                        (document.getElementById("qrcode").innerHTML = string)
                    );
                    that.activeSlug = row.slug;
                    response.data.list
                      ? response.data.list
                      : (response.data.list = []);
                    that.print = response.data;
                    $("#myModal").modal("show");
                  })
                  .catch(err => {});
              },
              "click .notice"(e, value, row, index) {
                that
                  .$post(`produces/bale/create`, { quality_id: value })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.$message({ message: '通知成功', type: 'success' });
                  })
                  .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#inspection #toolbar",
          ajax: this.tableAjaxData,
          queryParams: this.tableAjaxParams,
          search: true,
          strictSearch: true,
          showRefresh: true,
          sidePagination: "server",
          pagination: true,
          striped: true,
          clickToSelect: true,
          showColumns: true,
          sortName: "createTime",
          sortOrder: "desc",
          idField: "id",
          showToggle: true,
          showExport: true,
          exportDataType: "all",
          exportTypes: ["csv", "txt", "sql", "doc", "excel", "xlsx", "pdf"],
          classes: "table",
          pageList: [15, 25, 50, 100, "All"],
          detailView: true,
          columns: columns,
          detailFormatter(index, row, $el) {
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>序号</td>
                    <td>质检人</td>
                    <td>质检日期</td>
                    <td>是否合格</td>
                    <td>报告文件</td>
                  </tr>`;
            content += `
              <tr>
                <td>1</td>
                <td>${row.supervisor.map(e => e.last_name).join(',')}</td>
                <td>${row.operate_at}</td>
                <td>${row.is_pass ? '是' : '否' }</td>
                <td>`;
                  for (let e of row.images_url)
                    content += `<p><a href="${e.url}" target="__blank">${e.url.split('/').pop()}</a></p>`;
            
            content += `</td></tr></tbody></table>`;
            return content;
          }
        };
      $("#inspection #table").bootstrapTable(data);
    },
    printing() {
      this.$print(this.$refs.print);
      this.activeSlug = "";
      $("#inspection #myModal").modal("hide");
    },
    refreshed() {
      this.refresh($("#inspection #table"));
    },
    user(ids) {
      this
        .$post(`quality/inspection/user`, {
          id: this.id,
          inspector: ids.join(',')
        })
        .then(response => {
          if (response.status != 200) return false;
          $('#inspection #designate').modal("hide");
        })
        .catch(e => console.error(e));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
.modal-lg {
  width: 100%;
  max-width: 1280px;
  #canvasBox{
    img,
    canvas {
      display: block;
      margin: auto;
      max-width: 100%;
    }
  }
}
</style>