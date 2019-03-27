<template>
  <div id="purchaseSupplier">
    <addSupplier :id="row.id" :row="row" @refresh="refreshed"></addSupplier>

    <div class="modal fade" id="contract" role="dialog" aria-labelledby="myLargeModalLabel">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div id="toolbar-container"></div>
            <div id="editor"></div>
          </div>
        </div>
      </div>
    </div>

    <div id="toolbar" style="display: flex;">
      <el-button size="mini" @click="addSupplier">新建供应商</el-button>
      <el-upload action :before-upload="upload">
        <el-button size="mini">导入供应商</el-button>
      </el-upload>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
import addSupplier from "@/pages/Process/common/purchase/addSupplier";

export default {
  name: "purchaseSupplier",
  data() {
    let i = 0,arr = [];
    while (i < 30) {
      i++;
      arr.push({text: `${i}号`, value: i});
    };
    return {
      row: {
        id: 0,
        contracts: [
          {
            name: "",
            position: "",
            mobile: "",
            email: "",
          }
        ]
      },
      date: arr
    };
  },
  components: {
    addSupplier: addSupplier
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get("procurement/supplier", params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.$store.commit("changeTasks", {
            name: "/Purchase/supplier",
            num: response.data.pagination.total
          });
          // 存储进仓库
          that.$store.commit("setStateData", {
            name: "supplierList",
            arr: response.data
          });
          params.success({
            total: response.data.pagination.total,
            rows: response.data.list
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      params.page = params.offset / params.limit + 1;
      params.per_page = params.limit;
      return params;
    },
    init() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "id",
            title: "供应商编码",
            sortable: true
          },
          {
            field: "created_by",
            title: "创建人",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建时间"
          },
          {
            field: "name",
            title: "供应商名称",
            editable: {
              type: "text",
              title: "供应商名称",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "abbreviation",
            title: "供应商简称",
            editable: {
              type: "text",
              title: "供应商简称",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "type",
            title: "供应商类型",
            editable: {
              type: "text",
              title: "供应商类型",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "product",
            title: "供应产品",
            sortable: true
          },
          {
            field: "status",
            title: "供应商状态",
            editable: {
              type: "text",
              title: "供应商状态",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "region",
            title: "区域",
            editable: {
              type: "text",
              title: "区域",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "address",
            title: "详细地址",
            editable: {
              type: "text",
              title: "详细地址",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "linkman",
            title: "联系人",
            editable: {
              type: "text",
              title: "联系人",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "mobile",
            title: "手机号",
            editable: {
              type: "text",
              title: "手机号",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "phone",
            title: "座机电话",
            editable: {
              type: "text",
              title: "座机电话",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "fax",
            title: "传真",
            editable: {
              type: "text",
              title: "传真",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "email",
            title: "电子邮件",
            editable: {
              type: "text",
              title: "电子邮件",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "website",
            title: "网址",
            editable: {
              type: "text",
              title: "网址",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "logistics_code",
            title: "物流编码",
            editable: {
              type: "text",
              title: "物流编码",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "grade",
            title: "等级",
            editable: {
              type: "text",
              title: "等级",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "legal_representative",
            title: "法定代表人",
            editable: {
              type: "text",
              title: "法定代表人",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "registered_capital",
            title: "注册资金",
            editable: {
              type: "text",
              title: "注册资金",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "establishment_at",
            title: "成立日期",
            editable: {
              type: "date",
              title: "成立日期",
              emptytext: "空",
              placement: "right",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "due_at",
            title: "截至日期",
            editable: {
              type: "date",
              title: "截至日期",
              emptytext: "空",
              placement: "right",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "businesslicenseNumber",
            title: "营业执照号"
          },
          {
            field: "delivery_method",
            title: "送货方式",
            editable: {
              type: "text",
              title: "送货方式",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "shipping_address",
            title: "送货地址",
            editable: {
              type: "text",
              title: "送货地址",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "tag",
            title: "标签",
            editable: {
              type: "text",
              title: "标签",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "invoice_header",
            title: "发票抬头",
            editable: {
              type: "text",
              title: "发票抬头",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "account_bank",
            title: "开户行",
            editable: {
              type: "text",
              title: "开户行",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "bank_account_number",
            title: "开户行账号",
            editable: {
              type: "text",
              title: "开户行账号",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "invoice_type",
            title: "发票类型",
            editable: {
              type: "text",
              title: "发票类型",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "terms_of_payment",
            title: "付款条件",
            editable: {
              type: "text",
              title: "付款条件",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "payment_method",
            title: "付款方式",
            editable: {
              type: "text",
              title: "付款方式",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "account_period_type",
            title: "账期类型",
            editable: {
              type: "text",
              title: "账期类型",
              emptytext: "空",
              validate: v => {
                if (!v) return "不能为空";
              }
            }
          },
          {
            field: "invoicing_date",
            title: "开票日期",
            editable: {
              type: "select",
              source: that.date,
              title: "开票日期",
              emptytext: "空"
            }
          },
          {
            field: "date_of_reconciliation",
            title: "对账日期",
            editable: {
              type: "select",
              source: that.date,
              title: "对账日期",
              emptytext: "空"
            }
          },
          {
            field: "terms_of_contract",
            title: "合同条款",
            formatter: (value, row, index) => {
              return `<button class="btn btn-default btn-sm getTerms">查看条款</button>`;
            },
            events: {
              "click .getTerms": (e, value, row, index) => {
                that.editor.setData(row.terms_of_contract);
                $("#contract").modal("show");
              }
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let edit = `<button class="btn btn-success btn-sm edit">修改</button>`
              return edit;
            },
            events: {
              "click .edit": function(e, value, row, index) {
                that.row = row;
                $("#addSupplier").modal("show");
              }
            }
          }
        ],
        data = {
          toolbar: "#purchaseSupplier #toolbar",
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
          pageSize: 10,
          pageList: [10, 25, 50, 100, "All"],
          detailView: false,
          columns: columns,
          detailFormatter: (index, row, $el) => {},
          onEditableSave: (field, mrow, oldValue, $el) => {
            that
              .$post(`procurement/supplier/edit/${mrow.id}`, mrow)
              .then(response => {
                if (response.status != 200) return false;
                console.log(response);
              })
              .catch(err => console.error(err));
          }
        };
      $("#purchaseSupplier #table").bootstrapTable(data);
    },
    initCKEditor() {
      const that = this;
      class UploadAdapter {
        constructor(loader) {
          this.loader = loader;
        }
        upload() {
          //重置上传路径
          return new Promise((resolve, reject) => {
            let form = new FormData();
            form.append('imageFile', this.loader.file);
            console.log(form);
          });
        }
        abort() {}
      }
      //初始化编辑器
      CKEditor.create(document.querySelector("#editor"), {
        removePlugins: ["MediaEmbed"], //除去视频按钮
        language: "zh-cn", // 中文
        ckfinder: {
          uploaded: 1,
          url: "/"
          // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
        }
      })
        .then(editor => {
          const toolbarContainer = document.querySelector("#toolbar-container");
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
          // 加载了适配器
          editor.plugins.get("FileRepository").createUploadAdapter = loader => {
            return new UploadAdapter(loader);
          };
          this.editor = editor; // 将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
        })
        .catch(error => console.error(error));
    },
    upload(file) {
      let that = this,
        form = new FormData();
      form.append("file", file);
      that
        .$upload("procurement/supplier/import", form)
        .then(response => {
          if (response.status != 200) return false;
          that.$message({ message: "导入成功", type: "success" });
          that.refreshed();
        })
        .catch(err => console.error(err));
    },
    addSupplier() {
      this.row = { 
        id: 0,
        contracts: [
          {
            name: "",
            position: "",
            mobile: "",
            email: "",
          }
        ]
      };
      $("#addSupplier").modal("show");
    },
    refreshed() {
      this.row = { 
        id: 0,
        contracts: [
          {
            name: "",
            position: "",
            mobile: "",
            email: "",
          }
        ]
      };
      this.refresh($("#purchaseSupplier #table"));
    }
  },
  mounted() {
    this.init();
    this.initCKEditor();
  }
};
</script>
<style lang="less">
.ck.ck-reset_all {
  >div {
    z-index: 1051;
  }
}
#purchaseSupplier {
  #toolbar {
    display: flex;
    div {
      margin-left: 5px;
      display: flex;
      input[type="file"] {
        opacity: 0;
      }
    }
  }
}
</style>