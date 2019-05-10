<template>
  <div id="approval">
    <editServicePrice :active="active" @refresh="refreshed"></editServicePrice>
    <div id="toolbar">
      <el-select v-model="check_status" @change="refreshed" size="mini">
        <el-option label="全部" :value="undefined"></el-option>
        <el-option label="待审核" value="0"></el-option>
        <el-option label="审核成功" value="1"></el-option>
        <el-option label="审核失败" value="2"></el-option>
      </el-select>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import editServicePrice from "@/pages/Process/common/editServicePrice";

export default {
  name: "approval",
  data() {
    return {
      check_status: undefined,
      active: {}
    };
  },
  components: {
    editServicePrice: editServicePrice
  },
  methods: {
    tableAjaxData(params) {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get(`approvals/checks/list`, params.data)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          this.$store.commit("changeTasks", {
            name: "/approval",
            num: response.data.pagination.total
          });
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => loading.close());
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        check_status: this.check_status
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "entry.entry_name",
            title: "审核类型",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建日期",
            sortable: true
          },
          {
            field: "created_member.last_name",
            title: "创建人",
            sortable: true
          },
          {
            field: "check_status",
            title: "审核状态",
            sortable: true,
            formatter: (value, row, index) => {
              let status = {
                0: "待审核",
                1: "审核通过",
                2: `审核失败（理由：${row.check_remark}）`
              };
              return status[value];
            }
          },
          {
            field: "check_members",
            title: "审核人",
            sortable: true,
            formatter: (value, row, index) => {
              let nameArr = [];
              value.forEach(e => nameArr.push(e.check_last));
              return nameArr.join(",");
            }
          },
          {
            field: "id",
            title: "操作",
            formatter: (value, row, index) => {
              let quoted = `<button class="btn btn-primary btn-sm quoted">设置报价</button>`,
                pass = `<button class="btn btn-success btn-sm pass">审核通过</button>`,
                refuse = `<button class="btn btn-danger btn-sm refuse" style="margin-left: 5px;">审核不通过</button>`,
                counterTrial = `<button class="btn btn-danger btn-sm counterTrial" style="margin-left: 5px;">反审</button>`,
                btn = pass + refuse;
                if (row.entry.entry_stream == "quoted_price") btn += quoted;
                if (row.is_anti_check) btn += counterTrial;
                return btn;
            },
            events: {
              "click .quoted": function(e, value, row, index) {
                // 设置报价
                that.active = row;
                editServicePrice.methods.close.call(this);
              },
              "click .pass": function(e, value, row, index) {
                that
                  .$post(`approvals/checks`, {
                    id: value,
                    check_status: 1
                  })
                  .then(response => {
                    if (response.status != 200) return false;
                    that.refreshed();
                  })
                  .catch(err => console.error(err));
              },
              "click .refuse": function(e, valued, row, index) {
                that
                  .$prompt("请输入审核失败理由", "提示", {
                    confirmButtonText: "确定"
                  })
                  .then(({ value }) => {
                    that
                      .$post(`approvals/checks`, {
                        id: valued,
                        check_status: 2,
                        check_remark: value
                      })
                      .then(response => {
                        if (response.status != 200) return false;
                        that.refreshed();
                      })
                      .catch(err => console.error(err));
                  });
              },
              "click .counterTrial": function(e, valued, row, index) {
                that
                  .$prompt("请输入反审备注", "提示", { confirmButtonText: "确定"})
                  .then(({ value }) => {
                    that
                      .$post(`approvals/anti_review`, {
                        id: valued,
                        remark: value
                      })
                      .then(response => {
                        if (response.status != 200) return false;
                        that.refreshed();
                      })
                      .catch(err => console.error(err));
                  });
              }
            }
          }
        ],
        data = {
          toolbar: "#approval #toolbar",
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
          detailView: true,
          columns: columns,
          detailFormatter: (index, row, $el) => {
            return that.createTableDom(row);
          },
          onEditableSave: (field, mrow, oldValue, $el) => {}
        };
      $("#approval #table").bootstrapTable(data);
    },
    createTableDom(data) {
      let that = this,
        url = "",
        dom = "";
      switch (data.entry.entry_stream) {
        // 采购申请
        case "request":
          url = `procurement/request/detail/${data.entry.entry_id}`;
          break;
        // 客服申请
        case "service":
          url = `service/detail/${data.entry.entry_id}`;
          break;
        // 客服报价
        case "quoted_price":
          url = `/service/quoted_price/detail/${data.entry.entry_id}`;
          break;
        // 采购计划
        case "schedule":
          url = `procurement/schedule/detail/${data.entry.entry_id}`;
          break;
        // 采购订单
        case "order":
          url = `procurement/order/detail/${data.entry.entry_id}`;
          break;
        // 委外订单
        case "outsourcing":
          url = `procurement/outsourcing/detail/${data.entry.entry_id}`;
          break;
        // 委外领料
        case "out_picking_material":
          url = `procurement/out_picking_material/print/${data.entry.entry_id}`;
          break;
        // 物料
        case "materials":
          url = `respositories/materials/info/${data.entry.entry_slug}`;
          break;
        // 客服领料
        case "receive_material":
          url = `service/receive_material/${data.entry.entry_id}/detail`;
          break;
        // BOM
        case "boms":
          url = `project/bom/details/${data.entry.entry_id}`;
          break;
      }
      that
        .$get(url)
        .then(response => {
          if(response.status != 200) return false;
          switch(data.entry.entry_stream) {
            case "request":
              dom = `
                <table class="table">
                  <tr><td>采购申请单号</td><td>${response.data.number}</td></tr>
                  <tr><td>创建日期</td><td>${response.data.created_at}</td></tr>
                  <tr><td>创建人</td><td>${response.data.created_by}</td></tr>
                  <tr><td>部门</td><td>${response.data.branch_name}</td></tr>
                  <tr><td>备注</td><td>${response.data.remark}</td></tr>
                  <tr><td>物料</td><td style="padding: 0;">
                    <table class="table">
                      <tr><th>料品编码</th><th>料品名称</th><th>料品规格</th><th>单位</th><th>需求日期</th><th>数量</th><th>备注</th><th>结案</th></tr>`;
                        if (response.data.item && response.data.item.length)
                          response.data.item.forEach((e, k) => (dom += `<tr><td>${e.material_code}</td><td>${e.name}</td><td>${e.specification}</td><td>${e.unit}</td><td>${e.demand_at}</td><td>${e.quantity}</td><td>${e.remark}</td><td>${e.is_closed ? '是' : '否'}</td></tr>`));
                      dom += `</table>
                    </td>
                  </tr>
                </table>`;
              break;
            case "service":
              dom = `
                <table class="table">
                  <tr><td>客服申请单号</td><td>${response.data.service_number}</td></tr>
                  <tr><td>创建日期</td><td>${response.data.created_at}</td></tr>
                  <tr><td>申请联系人</td><td>${response.data.business_man_name}</td></tr>
                  <tr><td>问题描述</td><td>${response.data.customer_demand}</td></tr>
                  <tr><td>客户联系人</td><td>${response.data.customer_linkman}</td></tr>
                  <tr><td>客户联系方式</td><td>${response.data.customer_contact}</td></tr>
                  <tr><td>客户其他联系方式</td><td>${response.data.customer_other_contact}</td></tr>
                  <tr><td>规格</td><td>${response.data.specification}</td></tr>
                  <tr><td>订单处理状态</td><td>${response.data.process_name}</td></tr>
                  <tr><td>委派人员</td><td>${response.data.deal_mans.join(',')}</td></tr>
                  <tr><td>总价</td><td>${response.data.price || '未报价'}</td></tr>
                  <tr><td>优惠价</td><td>${response.data.discount_price || '未报价'}</td></tr>
                  <tr><td>应收价</td><td>${response.data.price ? response.data.price - response.data.discount_price : "未报价"}</td></tr>
                  <tr><td>服务状态</td><td>${response.data.service_status_name}</td></tr>
                  <tr><td>备注</td><td>${response.data.remark}</td></tr>
                </table>`;
              break;
            case "quoted_price":
              dom = `
                <table class="table">
                  <tr><td>客服报价单号</td><td>${response.data.quoted_price_number}</td></tr>
                  <tr><td>创建日期</td><td>${response.data.created_at}</td></tr>
                  <tr><td>创建人</td><td>${response.data.created_by}</td></tr>
                  <tr><td>客户公司名称</td><td>${response.data.customer_company_name}</td></tr>
                  <tr><td>客户联系方式</td><td>${response.data.customer_contact}</td></tr>
                  <tr><td>物料</td><td style="padding: 0;">
                    <table class="table">
                      <tr><th>料品编码</th><th>料品名称</th><th>料品规格</th><th>单位</th><th>数量</th></tr>`;
                        if (response.data.detail && response.data.detail.length)
                          response.data.detail.forEach((e, k) => (dom += `<tr><td>${e.code}</td><td>${e.name}</td><td>${e.info}</td><td>${e.unit}</td><td>${e.number}</td></tr>`));
                      dom += `</table>
                    </td>
                  </tr>
                  <tr><td>总金额</td><td>${response.data.price}</td></tr>
                  <tr><td>优惠</td><td>${response.data.discount_price}</td></tr>
                  <tr><td>应收</td><td>${response.data.price}</td></tr>
                  <tr><td>联系人</td><td>${response.data.linkman}</td></tr>
                  <tr><td>报价人</td><td>${response.data.member_name}</td></tr>
                  <tr><td>销售订单</td><td>${response.data.order_number}</td></tr>
                  <tr><td>是否过保</td><td>${response.data.whether_warranty ? "在保质期" : "不在保质期"}</td></tr>
                </table>`;
              break;
            case "schedule":
              console.log(response);
              dom = `
                <table class="table">
                  <tr><td>采购计划单号</td><td>${response.data.number}</td></tr>
                  <tr><td>创建日期</td><td>${response.data.created_at}</td></tr>
                  <tr><td>创建人</td><td>${response.data.created_by}</td></tr>
                  <tr><td>备注</td><td>${response.data.remark}</td></tr>
                  <tr><td>物料</td><td style="padding: 0;">
                    <table class="table">
                      <tr><th>料品编码</th><th>料品名称</th><th>料品规格</th><th>单位</th><th>需求日期</th><th>数量</th><th>备注</th><th>结案</th></tr>`;
                        if (response.data.items && response.data.items.length)
                          response.data.items.forEach((e, k) => (dom += `<tr><td>${e.material_code}</td><td>${e.name}</td><td>${e.specification}</td><td>${e.unit}</td><td>${e.demand_at}</td><td>${e.quantity}</td><td>${e.remark}</td><td>${e.is_closed ? '是' : '否'}</td></tr>`));
                      dom += `</table>
                    </td>
                  </tr>
                </table>`;
              break;
            case "order":
              console.log(response);
              dom = `
                <table class="table">
                  <tr><td>采购订单单号</td><td>${response.data.number}</td></tr>
                  <tr><td>创建日期</td><td>${response.data.created_at}</td></tr>
                  <tr><td>创建人</td><td>${response.data.created_by}</td></tr>
                  <tr><td>备注</td><td>${response.data.remark}</td></tr>
                  <tr><td>供应商</td><td>${response.data.supplier || '无'}</td></tr>
                  <tr><td>联系电话</td><td>${response.data.phone}</td></tr>
                  <tr><td>物料</td><td style="padding: 0;">
                    <table class="table">
                      <tr><th>料品编码</th><th>料品名称</th><th>料品规格</th><th>单位</th><th>数量</th><th>备注</th><th>单价</th><th>交期</th><th>结案</th></tr>`;
                        if (response.data.items && response.data.items.length)
                          response.data.items.forEach((e, k) => (dom += `<tr><td>${e.material_code}</td><td>${e.name}</td><td>${e.specification}</td><td>${e.unit}</td><td>${e.quantity}</td><td>${e.remark}</td><td>${e.price}</td><td>${e.delivery_date}</td><td>${e.is_closed ? '是' : '否'}</td></tr>`));
                      dom += `</table>
                    </td>
                  </tr>
                </table>`;
              break;
            case "outsourcing":
              dom = `
                <table class="table">
                  <tr><td>委外订单单号</td><td>${response.data.number}</td></tr>
                  <tr><td>创建日期</td><td>${response.data.created_at}</td></tr>
                  <tr><td>创建人</td><td>${response.data.created_by}</td></tr>
                  <tr><td>需求日期</td><td>${response.data.demand_at}</td></tr>
                  <tr><td>备注</td><td>${response.data.remark}</td></tr>
                  <tr><td>供应商</td><td>${response.data.supplier}</td></tr>
                  <tr><td>联系电话</td><td>${response.data.phone}</td></tr>
                  <tr><td>物料</td><td style="padding: 0;">
                    <table class="table">
                      <tr><th>料品编码</th><th>料品名称</th><th>料品规格</th><th>单位</th><th>数量</th><th>备注</th><th>单价</th><th>交期</th><th>结案</th></tr>`;
                        if (response.data.items && response.data.items.length)
                          response.data.items.forEach((e, k) => (dom += `<tr><td>${e.material_code}</td><td>${e.name}</td><td>${e.specification}</td><td>${e.unit}</td><td>${e.quantity}</td><td>${e.remark}</td><td>${e.price}</td><td>${e.delivery_date}</td><td>${e.is_closed ? '是' : '否'}</td></tr>`));
                      dom += `</table>
                    </td>
                  </tr>
                </table>`;
              break;
            case "out_picking_material":
              dom = `
                <table class="table">
                  <tr><td>委外领料单单号</td><td>${response.data.number}</td></tr>
                  <tr><td>创建日期</td><td>${response.data.created_at}</td></tr>
                  <tr><td>创建人</td><td>${response.data.applicant_name}</td></tr>
                  <tr><td>供应商</td><td>${response.data.supplier.name}</td></tr>
                  <tr><td>物料</td><td style="padding: 0;">
                    <table class="table">
                      <tr><th>料品编码</th><th>料品名称</th><th>料品规格</th><th>单位</th><th>数量</th><th>备注</th><th>交期</th></tr>`;
                        if (response.data.items && response.data.items.length)
                          response.data.items.forEach((e, k) => (dom += `<tr><td>${e.material_code}</td><td>${e.name}</td><td>${e.specification}</td><td>${e.unit}</td><td>${e.quantity}</td><td>${e.remark}</td><td>${e.demand_at}</td></tr>`));
                      dom += `</table>
                    </td>
                  </tr>
                </table>`;
              break;
            case "materials":
              dom = `<table class="table">`;
              for (let e of response.data.list)
                dom += `<tr><td>${ e.key }</td><td>${
                  typeof e.value == 'object'
                    ? e.value.name 
                      ? e.value.name 
                      : e.value.last_name 
                        ? e.value.last_name 
                        : '无'
                    : e.value 
                }</td></tr>`;
              dom += `</table>`;
              break;
            case "receive_material":
              dom = `
                <table class="table">
                  <tr><td>客服领料单号</td><td>${response.data.number}</td></tr>
                  <tr><td>创建日期</td><td>${response.data.created_at}</td></tr>
                  <tr><td>创建人</td><td>${response.data.creator.last_name}</td></tr>
                  <tr><td>客服公司名称</td><td>${response.data.customer_company_name}</td></tr>
                  <tr><td>客户联系人</td><td>${response.data.customer_linkman}</td></tr>
                  <tr><td>客户电话</td><td>${response.data.phone}</td></tr>
                  <tr><td>备注</td><td>${response.data.remark}</td></tr>
                  <tr><td>物料</td><td style="padding: 0;">
                    <table class="table">
                      <tr><th>料品编码</th><th>料品名称</th><th>料品规格</th><th>单位</th><th>数量</th><th>已领料数量</th><th>待领料数量</th></tr>`;
                        if (response.data.items && response.data.items.length)
                          response.data.items.forEach((e, k) => (dom += `<tr><td>${e.material_number}</td><td>${e.material_name}</td><td>${e.material_specification}</td><td>${e.unit}</td><td>${e.quantity}</td><td>${e.cancel_quantity || ''}</td><td>${e.wait_quantity || ''}</td></tr>`));
                      dom += `</table>
                    </td>
                  </tr>
                </table>`;
              break;
            case "boms":
              dom = `
                <table class="table">
                  <tr><td>项目单号</td><td>${response.data.item_number}</td></tr>
                  <tr><td>bom名称</td><td>${response.data.name}</td></tr>
                  <tr><td>成品料号</td><td>${response.data.finished_product_number}</td></tr>
                  <tr><td>料品规格</td><td>${response.data.component_specifications}</td></tr>
                  <tr><td>料品版本</td><td>${response.data.version}</td></tr>
                  <tr><td>分类名称</td><td>${response.data.category_name}</td></tr>
                  <tr><td>创建人</td><td>${response.data.created_member.last_name}</td></tr>
                  <tr><td>创建时间</td><td>${response.data.created_at}</td></tr>
                  <tr><td>子物料</td><td style="padding: 0;">
                    <table class="table">
                      <tr><th>料品编码</th><th>料品名称</th><th>料品规格</th><th>单位</th><th>数量</th></tr>`;
                        if (response.data.bom_items && response.data.bom_items.length)
                          response.data.bom_items.forEach((e, k) => (dom += `<tr><td>${e.material.material_number}</td><td>${e.material.name}</td><td>${e.material.material_specification}</td><td>${e.material.item_unit}</td><td>${e.quantity}</td></tr>`));
                      dom += `</table>
                    </td>
                  </tr>
                </table>`;
              break;
          }
          $(`.waitEntry${data.id}`).html(dom);
        })
        .catch(err => console.error(err));
      return `<div class="waitEntry${data.id}">`;
    },
    refreshed() {
      this.refresh($("#approval #table"));
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#approval {
}
</style>
