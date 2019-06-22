<template>
  <div id="customer">
    <addCustomer @refresh="refreshed" :rows="rows"></addCustomer>
    <addVisit :rows="rows" @refresh="refreshed"></addVisit>

    <div class="modal fade contactModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <el-table :data="contact" border style="width: 100%">
            <el-table-column prop="name" label="联系人"></el-table-column>
            <el-table-column prop="position" label="职务"></el-table-column>
            <el-table-column prop="mobile" label="手机号"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="modal fade payment_termsModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <el-table :data="payment_terms" border style="width: 100%">
            <el-table-column label="付款条件" width="100">
              <template slot-scope="{ row, $index}">
                <div>付款条件{{$index + 1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="text" label="详细"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="modal fade visitModal" role="dialog">
      <div class="modal-dialog" role="document" style="width: 100%;max-width: 1280px;">
        <div class="modal-content">
          <el-table :data="visit" border style="width: 100%">
            <el-table-column prop="client_company" label="公司"></el-table-column>
            <el-table-column prop="contact_v1.name" label="联系人"></el-table-column>
            <el-table-column prop="contact_v1.mobile" label="电话"></el-table-column>
            <el-table-column prop="contact_v1.position" label="职位"></el-table-column>
            <el-table-column prop="created_member.last_name" label="创建人"></el-table-column>
            <el-table-column prop="access_at" label="拜访时间"></el-table-column>
            <el-table-column prop="visiting_content" label="拜访内容"></el-table-column>
            <el-table-column prop="images" label="图片">
              <template slot-scope="{ row }">
                <div>
                  <img 
                    v-for="(item, index) in row.images"
                    :key="index" 
                    :src="item" 
                    style="max-width: 50px;max-height: 50px;">
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="together" label="同行人"></el-table-column>
            <el-table-column prop="supervisor_reply" label="主管回复">
              <template slot-scope="{ row }">
                <p class="text-muted">{{ row.supervisor_reply }}</p>
                <el-button v-if="row.is_reply" type="primary" size="mini" @click="slug = row.slug;addReply()">主管回复</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="reply_at" label="回复时间"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="modal fade sigininModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <el-table :data="siginin" border style="width: 100%">
            <el-table-column prop="customer.name" label="客户公司名"></el-table-column>
            <el-table-column prop="full_name" label="打卡人"></el-table-column>
            <el-table-column prop="created_at" label="打卡时间"></el-table-column>
            <el-table-column prop="signin_address.address" label="打卡地址"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <div class="modal fade contractModal" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <div id="toolbar-container"></div>
            <div id="editor"></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="edit">保存</button>
            <button class="btn btn-default" data-dismiss="modal">取消</button>
          </div>
        </div>
      </div>
    </div>

    <div id="toolbar">
      <el-button size="mini" @click="add">新建客户</el-button>
      <router-link to="/customerMap" style="margin-left: 5px;">
        <el-button size="mini">附近客户</el-button>
      </router-link>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import CKEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
import addCustomer from "@/pages/Process/common/sale/addCustomer";
import addVisit from "@/pages/Process/common/sale/addVisit";

export default {
  name: "customer",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user") || "{}"),
      slug: "",
      contact: [],
      payment_terms: [],
      visit: [],
      siginin: [],
      rows: {
        id: 0
      }
    };
  },
  components: {
    addCustomer: addCustomer,
    addVisit: addVisit
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`customers`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      params.address = params.search;
      params.work = "visit";
      // params.salesman_id = this.user.user.id;
      return params;
    },
    add() {
      this.rows = {
        id: 0
      }
      addCustomer.methods.close.call(this);
    },
    edit() {
      let that = this;
      that
        .$post(`customers/edit`, {
          name: that.row.name,
          slug: that.row.slug,
          contact: JSON.stringify(that.row.contact),
          abbreviation: that.row.abbreviation,
          area: that.row.area,
          contract_terms: that.editor.getData()
        })
        .then(response => {
          if (response.status != 200) return false;
          that.refreshed();
          $("#customer .contractModal").modal("hide");
        })
        .catch(err => console.error(err));
    },
    addReply() {
      let that = this;
      that
        .$prompt("主管回复内容", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
        .then(({ value }) => {
          that
            .$post(`customers/visit/reply`, {
              slug: that.slug,
              supervisor_reply: value
            })
            .then(response => {
              if (response.status != 200) return false;
              that.$message({ message: "回复成功", type: "success" });
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    },
    refreshed() {
      this.refresh($("#customer #table"));
    },
    tableInit() {
      let that = this,
        columns = [
          {
            checkbox: true
          },
          {
            field: "code",
            title: "客户编码",
            sortable: true
          },
          {
            field: "created_member.display_name",
            title: "创建人",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建时间",
            sortable: true
          },
          {
            field: "name",
            title: "客户公司全称",
            sortable: true,
            editable: {
              type: "text",
              title: "客户公司全称",
              emptytext: "空"
            }
          },
          {
            field: "abbreviation",
            title: "客户公司简称",
            sortable: true,
            editable: {
              type: "text",
              title: "客户公司简称",
              emptytext: "空"
            }
          },
          {
            field: "customer_level",
            title: "客户级别",
            editable: {
              type: "text",
              title: "客户级别",
              emptytext: "空"
            }
          },
          {
            field: "salesman",
            title: "业务员",
            sortable: true
          },
          {
            field: "business_license_number",
            title: "工商营业执照号码",
            sortable: true,
            editable: {
              type: "text",
              title: "工商营业执照号码",
              emptytext: "空"
            }
          },
          {
            field: "legal_representative",
            title: "法人代表",
            sortable: true,
            editable: {
              type: "text",
              title: "法人代表",
              emptytext: "空"
            }
          },
          {
            field: "registered_capital",
            title: "注册资金",
            sortable: true,
            editable: {
              type: "text",
              title: "注册资金",
              emptytext: "空"
            }
          },
          {
            field: "establish_at",
            title: "成立日期",
            sortable: true,
            editable: {
              type: "text",
              title: "成立日期",
              emptytext: "空"
            }
          },
          {
            field: "url",
            title: "网址",
            sortable: true,
            editable: {
              type: "text",
              title: "网址",
              emptytext: "空"
            }
          },
          {
            field: "phone",
            title: "座机号码",
            sortable: true,
            editable: {
              type: "text",
              title: "座机号码",
              emptytext: "空"
            }
          },
          {
            field: "fax",
            title: "传真",
            sortable: true,
            editable: {
              type: "text",
              title: "传真",
              emptytext: "空"
            }
          },
          {
            field: "enabled",
            title: "状态",
            editable: {
              type: "select",
              title: "状态",
              source: [{ text: "启用", value: 1 }, { text: "禁用", value: 0 }],
              emptytext: "空"
            }
          },
          {
            field: "market_status",
            title: "市场状况",
            sortable: true,
            editable: {
              type: "text",
              title: "市场状况",
              emptytext: "空"
            }
          },
          {
            field: "product_used",
            title: "所用产品",
            sortable: true,
            editable: {
              type: "text",
              title: "所用产品",
              emptytext: "空"
            }
          },
          {
            field: "purchase_quantity_year",
            title: "年采购量",
            sortable: true,
            editable: {
              type: "text",
              title: "年采购量",
              emptytext: "空"
            }
          },
          {
            field: "business_content",
            title: "营业内容",
            sortable: true,
            editable: {
              type: "text",
              title: "营业内容",
              emptytext: "空"
            }
          },
          {
            field: "area",
            title: "区域",
            sortable: true,
            editable: {
              type: "text",
              title: "区域",
              emptytext: "空"
            }
          },
          {
            field: "tags",
            title: "标签",
            sortable: true,
            editable: {
              type: "text",
              title: "标签",
              emptytext: "空"
            }
          },
          {
            field: "remark",
            title: "备注",
            sortable: true,
            editable: {
              type: "textarea",
              title: "备注",
              emptytext: "空"
            }
          },
          {
            field: "detailed_address",
            title: "详细地址",
            sortable: true,
            editable: {
              type: "text",
              title: "详细地址",
              emptytext: "空"
            }
          },
          {
            field: "contact",
            title: "联系人",
            sortable: true,
            formatter: (value, row, index) => {
              let contact = `<button class="btn btn-sm btn-primary">查看联系人</button>`;
              return contact;
            },
            events: {
              'click .btn': function(e, value, row, index) {
                that.contact = row.contact;
                $('#customer .contactModal').modal('show');
              }
            }
          },
          {
            field: "bank_account",
            title: "开户银行",
            sortable: true,
            editable: {
              type: "text",
              title: "开户银行",
              emptytext: "空"
            }
          },
          {
            field: "account_name",
            title: "银行账户名",
            sortable: true,
            editable: {
              type: "text",
              title: "银行账户名",
              emptytext: "空"
            }
          },
          {
            field: "account_number",
            title: "银行账号",
            sortable: true,
            editable: {
              type: "text",
              title: "银行账号",
              emptytext: "空"
            }
          },
          {
            field: "tax_id",
            title: "税号",
            sortable: true,
            editable: {
              type: "text",
              title: "税号",
              emptytext: "空"
            }
          },
          {
            field: "account_period_type",
            title: "账期类型",
            sortable: true,
            editable: {
              type: "text",
              title: "账期类型",
              emptytext: "空"
            }
          },
          {
            field: "payment_type",
            title: "付款方式",
            sortable: true,
            editable: {
              type: "text",
              title: "付款方式",
              emptytext: "空"
            }
          },
          {
            field: "invoice_type",
            title: "发票类型",
            sortable: true,
            editable: {
              type: "text",
              title: "发票类型",
              emptytext: "空"
            }
          },
          {
            field: "invoice_head",
            title: "发票抬头",
            sortable: true,
            editable: {
              type: "text",
              title: "发票抬头",
              emptytext: "空"
            }
          },
          {
            field: "payment_terms",
            title: "付款条件",
            sortable: true,
            formatter: (value, row, index) => {
              let payment_terms = `<button class="btn btn-sm btn-primary">查看条件</button>`;
              return payment_terms;
            },
            events: {
              'click .btn': function(e, value, row, index) {
                that.payment_terms = row.payment_terms_vl;
                $('#customer .payment_termsModal').modal('show');
              }
            }
          },
          {
            field: "logistics_code",
            title: "物流编码",
            sortable: true,
            editable: {
              type: "text",
              title: "物流编码",
              emptytext: "空"
            }
          },
          {
            field: "delivery_methods",
            title: "送货方式",
            sortable: true,
            editable: {
              type: "text",
              title: "送货方式",
              emptytext: "空"
            }
          },
          {
            field: "delivery_address",
            title: "交货地址",
            sortable: true,
            editable: {
              type: "text",
              title: "交货地址",
              emptytext: "空"
            }
          },
          {
            field: "contract_terms",
            title: "合同模板",
            formatter: (value, row, index) => {
              let get = `<button class="btn btn-primary btn-sm get">查看模板</button>`;
              return get;
            },
            events: {
              "click .btn": function(e, value, row, index) {
                that.row = row;
                that.editor.setData(value);
                $("#customer .contractModal").modal("show");
              }
            }
          },
          {
            field: "recent_contacts_at",
            title: "最近联系日期",
            sortable: true,
            editable: {
              type: "text",
              title: "最近联系日期",
              emptytext: "空"
            }
          },
          {
            field: "recent_contacts_record",
            title: "近一次联系记录",
            sortable: true,
            editable: {
              type: "text",
              title: "近一次联系记录",
              emptytext: "空"
            }
          },
          {
            field: "recent_service_at",
            title: "最近服务日期",
            sortable: true,
            editable: {
              type: "text",
              title: "最近服务日期",
              emptytext: "空"
            }
          },
          {
            field: "recent_shipping_at",
            title: "最近出货日期",
            sortable: true,
            editable: {
              type: "text",
              title: "最近出货日期",
              emptytext: "空"
            }
          },
          {
            field: "visit",
            title: "拜访记录",
            formatter: (value, row, index) => {
              let list = `<button class="btn btn-primary btn-sm list">查看记录</button>`;
              return list;
            },
            events: {
              "click .btn": function(e, value, row, index) {
                that.visit = row.visit;
                $("#customer .visitModal").modal("show");
              }
            }
          },
          {
            field: "siginin",
            title: "打卡记录",
            formatter: (value, row, index) => {
              let list = `<button class="btn btn-primary btn-sm list">查看记录</button>`;
              return list;
            },
            events: {
              "click .list": function(e, value, row, index) {
                that.siginin = row.siginin;
                $("#customer .sigininModal").modal("show");
              }
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let visit = `<button class="btn btn-success btn-sm visit">添加访问</button>`,
                del = `<button class="btn btn-danger btn-sm del">删除</button>`,
                edit = `<button class="btn btn-warning btn-sm edit">编辑</button>`;
              return visit + del + edit;
            },
            events: {
              "click .visit": function (e, value, row, index) {
                that.rows = row;
                addVisit.methods.close.call(that);
              },
              "click .del": function (e, value, row, index) {
                that
                  .$post(`customers/delete`, { slug: value })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.delTable($("#table"), 'id', [row.id]);
                  })
                  .catch(err => console.error(err));
                
              },
              "click .edit": function (e, value, row, index) {
                that.add();
                that.rows = row;
              }
            }
          }
        ],
        data = {
          toolbar: "#toolbar",
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
          pageList: [10, 25, 50, 100, "All"],
          // detailView: true,
          columns: columns,
          onEditableSave(field, mrow, oldValue, $el) {
            that
              .$post(`customers/edit`, mrow)
              .then(response => {
                if (response.status != 200) return false;
              })
              .catch(err => {});
          },
          detailFormatter(field, mrow, oldValue, $el) {}
        };
      $("#customer #table").bootstrapTable(data);
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
      CKEditor.create(document.querySelector(".contractModal #editor"), {
        removePlugins: ["MediaEmbed"], //除去视频按钮
        language: "zh-cn", // 中文
        ckfinder: {
          uploaded: 1,
          url: "/"
          // 后端处理上传逻辑返回json数据,包括uploaded(选项true/false)和url两个字段
        }
      })
        .then(editor => {
          const toolbarContainer = document.querySelector(".contractModal #toolbar-container");
          toolbarContainer.appendChild(editor.ui.view.toolbar.element);
          // 加载了适配器
          editor.plugins.get("FileRepository").createUploadAdapter = loader => {
            return new UploadAdapter(loader);
          };
          this.editor = editor; // 将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作
        })
        .catch(error => console.error(error));
    }
  },
  mounted() {
    this.tableInit();
    this.initCKEditor();
  }
};
</script>
<style lang="less">
#customer {
}
</style>
