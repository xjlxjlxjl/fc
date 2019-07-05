<template>
  <div id="split">
    <addSplit @refresh="refreshed"></addSplit>
    <designate type="storehouse" @user="assignUser"></designate>
    <div id="toolbar">
      <el-button size="mini" @click="addModal = !addModal">新建拆分单</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import addSplit from "@/pages/Process/common/store/addSplit";
import designate from "@/pages/Process/common/store/designate";

export default {
  name: "split",
  data() {
    return {
      addModal: false,
      userModal: false
    };
  },
  components: {
    addSplit: addSplit,
    designate: designate
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`repositories/split_order`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(e => console.error(e));
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "#",
            title: "序号",
            formatter(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qrCode",
            title: "二维码",
            formatter(value, row, index) {
              setTimeout(() => QRCode.toString(qr_code_text, (err, string) => (document.getElementById(`splitQrcode${row.id}`).innerHTML = string)), 500);
              return `<div id="splitQrcode${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            },
          },
          {
            field: "order_no",
            title: "拆分单号"
          },
          {
            field: "creator",
            title: "创建人"
          },
          {
            field: "created_at",
            title: "创建日期"
          },
          {
            field: "tip_at",
            title: "智能提示拆分日期"
          },
          {
            field: "member",
            title: "仓库专员"
          },
          {
            field: "split_at",
            title: "拆分时间"
          },
          {
            field: "slug",
            title: "操作",
            formatter(value, row, index) {
              const 
                print = `<button class="btn btn-success btn-sm print">打印</button>`,
                assign = `<button class="btn btn-primary btn-sm assign" style="margin-left: 5px;">指派仓库专员</button>`,
                split = `<button class="btn btn-warning btn-sm split" style="margin-left: 5px;">完成拆分</button>`,
                del = `<button class="btn btn-danger btn-sm del" style="margin-left: 5px;">删除</button>`;
                return `<div style="display: flex;">${ print + assign + split + del }</div>`;
            },
            events: {
              "click .print"($el, value, row, index) {
                window.open(`/print.html#/storeSplit/${row.id}`);
              },
              "click .assign"($el, value, row, index) {
                that.activeId = row.id;
                that.userModal = !that.userModal;
              },
              "click .split"($el, value, row, index) {
                if (confirm('确认完成所有拆分'))
                  that
                    .$post(`repositories/split_order/edit/${row.id}`, {
                      is_split: 1
                    })
                    .then(response => {
                      if (response.status != 200) return false;
                      that.refreshed();
                    })
                    .catch(e => console.error(e));
              },
              "click .del"($el, value, row, index) {
                if (confirm('确认删除'))
                  that
                    .$get(`repositories/split_order/delete/${row.id}`)
                    .then(response => {
                      if (response.status != 200) return false;
                      that.delTable($("#split #table"), 'id', [row.id]);
                    })
                    .catch(e => console.error(e));
              },
            }
          }
        ],
        data = {
          toolbar: "#split #toolbar",
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
          detailView: true,
          columns: columns,
          detailFormatter(field, mrow, oldValue, $el) {
            let content = `<div>`,
              label = `
                <tr>
                  <td>序号</td>
                  <td>料品编码</td>
                  <td>料品规格</td>
                  <td>料品名称</td>
                  <td>可用数量</td>
                  <td>长度</td>
                  <td>数量</td>
                  <td>百分比</td>
                  <td>单位</td>
                  <td>仓库</td>
                  <td>料品类别</td>
                  <td>料品属性</td>
                  <td>备注</td>
                </tr>`;
            content += `<table class="table table-bordered"><tbody><tr><td style="text-align: left;" colspan="13">原料</td></tr>${ label }`;
            mrow.items.origin.forEach(
              (e, k) => content += `<tr><td>${k + 1}</td><td>${e.material_info.material_number}</td><td>${e.material_info.material_specification}</td><td>${e.material_info.name}</td><td>${e.material_info.end_period_quantity}</td><td>${e.material_info.length}</td><td>${e.count}</td><td>${e.percentage}%</td><td>${e.material_info.unit}</td><td>${e.material_info.repository}</td><td>${e.material_info.material_category}</td><td>${e.material_info.attributes}</td><td>${e.remark}</td></tr>`)
            content += `</tbody></table>`;

            content += `<table class="table table-bordered"><tbody><tr><td style="text-align: left;" colspan="13">拆分料</td></tr>${ label }`;
            mrow.items.split.forEach(
              (e, k) => content += `<tr><td>${k + 1}</td><td>${e.material_info.material_number}</td><td>${e.material_info.material_specification}</td><td>${e.material_info.name}</td><td>${e.material_info.end_period_quantity}</td><td>${e.material_info.length}</td><td>${e.count}</td><td>${e.percentage}%</td><td>${e.material_info.unit}</td><td>${e.material_info.repository}</td><td>${e.material_info.material_category}</td><td>${e.material_info.attributes}</td><td>${e.remark}</td></tr>`)
            content += `</tbody></table>`;

            content += `<table class="table table-bordered"><tbody><tr><td style="text-align: left;" colspan="13">余料</td></tr>${ label }`;
            mrow.items.other.forEach(
              (e, k) => content += `<tr><td>${k + 1}</td><td>${e.material_info.material_number}</td><td>${e.material_info.material_specification}</td><td>${e.material_info.name}</td><td>${e.material_info.end_period_quantity}</td><td>${e.material_info.length}</td><td>${e.count}</td><td>${e.percentage}%</td><td>${e.material_info.unit}</td><td>${e.material_info.repository}</td><td>${e.material_info.material_category}</td><td>${e.material_info.attributes}</td><td>${e.remark}</td></tr>`)
            content += `</tbody></table>`;
            
            content += `</div>`;
            return content;
          }
        };
      $("#split #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#split #table"));
    },
    assignUser(val) {
      this
        .$post(`repositories/split_order/edit/${this.activeId}`, { member_id: val.join(',') })
        .then(response => {
          if (response.status != 200) return false;
          this.refreshed();
          this.userModal = !this.userModal;
        })
        .catch(e => console.error(e));
    }
  },
  watch: {
    addModal(val) {
      $("#split #addSplit").modal("toggle");
    },
    userModal(val) {
      $("#split #designate").modal("toggle");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style>
#split {
}
</style>