<template>
  <div id="inspection">
    <editOqcModal :row="row" @refresh="refreshed"></editOqcModal>

    <!--startprint-->
    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
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
                      :style="`border: 1px solid #000;width: ${parseInt(width) - 312}px;height: 33px;font-weight: bold;line-height: 30px;font-size: 22px;padding-left: 5px;`"
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
    <div id="OQCtoolbar">
      <span class="lead">生产送检表</span>
      <!-- <el-button size="mini">上传质检报告</el-button> -->
    </div>
    <table id="OQCtable"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import editOqcModal from "@/pages/Process/common/editOqc";

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
      height: 462
    };
  },
  components: {
    editOqcModal: editOqcModal
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`quality/list`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      return params;
    },
    editAttr() {
      let that = this;
      that
        .$post(`/quality/print/attribute/update/${that.activeSlug}`, {
          attributes: JSON.stringify(that.print.list)
        })
        .then(response => {
          if (response.status != 200) return false;
        })
        .catch(err => {});
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
            checkbox: true
          },
          {
            field: "order",
            title: "订单号",
            sortable: true,
            formatter: (value, row, index) => {
              return `${value.numbering}`;
            }
          },
          {
            field: "slug",
            title: "唯一识别码",
            sortable: true
          },
          {
            field: "model",
            title: "料品编码",
            sortable: true
          },
          {
            field: "name",
            title: "料品名称",
            sortable: true
          },
          {
            field: "created",
            title: "送检人",
            sortable: true,
            formatter: (value, row, index) => {
              return `${value.last_name}`;
            }
          },
          {
            field: "created_at",
            title: "送检日期",
            sortable: true
          },
          {
            field: "is_pass",
            title: "质检状态",
            sortable: true,
            formatter: (value, row, index) => {
              switch (value) {
                case 0:
                  if (row.report_url.length) {
                    return "未通过";
                  } else {
                    return "待审核";
                  }
                  break;
                case 1:
                  return "通过";
                  break;
              }
            }
          },
          {
            field: "description",
            title: "质检报告",
            sortable: true
          },
          {
            field: "member_user",
            title: "质检员",
            sortable: true,
            formatter: (value, row, index) => {
              return `${value.last_name}`;
            }
          },
          {
            field: "updated_at",
            title: "修改日期",
            sortable: true
          },
          {
            field: "#",
            title: "操作",
            formatter: (value, row, index) => {
              let edit = [
                `<button class="btn btn-success btn-sm edit">上传报告</button>`
              ];
              let print = [
                `<button class="btn btn-primary btn-sm print">打　　印</button>`
              ];
              return edit + print;
            },
            events: {
              "click .edit": (e, value, row, index) => {
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
                editOqcModal.methods.close.call(this);
              },
              "click .print": (e, value, row, index) => {
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
              }
            }
          }
        ],
        data = {
          toolbar: "#OQCtoolbar",
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
          detailFormatter: (index, row, $el) => {
            let html = [`<div align="left"><ul class="list-inline">`];
            row.images_url.forEach(e => {
              // html.push(`<img src="${e.url}" style="width: 100px;">`);
              html.push(
                `<a href="${
                  e.url
                }" target="_blank" style="margin-right: 1rem;">${e.url
                  .split("/")
                  .pop()}</a>`
              );
            });
            html.push(`</ul><ul class="list-inline">`);
            row.report_url.forEach(e => {
              html.push(
                `<a href="${
                  e.url
                }" target="_blank" style="margin-right: 1rem;">${e.url
                  .split("/")
                  .pop()}</a>`
              );
            });
            html.push(`</ul></div>`);
            return html;
          },
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };
      $("#OQCtable").bootstrapTable(data);
    },
    printing() {
      this.$print(this.$refs.print);
      this.activeSlug = "";
      $("#myModal").modal("hide");
    },
    refreshed() {
      this.refresh($("#OQCtable"));
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    print: {
      handler(newVal, oldVal) {
        if (!this.activeSlug) return false;
        // if (
        //   newVal.list[newVal.list.length - 1].name &&
        //   newVal.list[newVal.list.length - 1].value
        // )
        //   this.print.list.push({
        //     name: "",
        //     slug: "",
        //     value: ""
        //   });
        // setTimeout(() => this.editAttr(), 2000);
      },
      deep: true
    }
  }
};
</script>
