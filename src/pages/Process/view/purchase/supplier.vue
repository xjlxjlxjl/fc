<template>
  <div id="purchaseSupplier">
    <addSupplier @refresh="refreshed"></addSupplier>
    <div id="toolbar">
      <el-button size="mini" @click="addSupplier">新建供应商</el-button>
      <el-upload action :before-upload="upload">
        <el-button size="mini">导入供应商</el-button>
      </el-upload>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import addSupplier from "@/pages/Process/common/purchase/addSupplier";

export default {
  name: "purchaseSupplier",
  data() {
    return {};
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
            name: 'supplierList',
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
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let html = "";
              return html;
            },
            events: {
              "": function(e, value, row, index) {}
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
            console.log(mrow);
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
    upload(file) {
      let that = this,
        form = new FormData();
      form.append("file", file);
      that
        .$upload("procurement/supplier/import", form)
        .then(response => {
          if (response.status != 200) return false;
          that.$message({ message: '导入成功', type: 'success' });
          that.refreshed();
        })
        .catch(err => console.error(err));
    },
    addSupplier() {
      $("#addSupplier").modal("show");
    },
    refreshed() {
      this.refresh($("#purchaseSupplier #table"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
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