<template>
  <div id="shipment">
    <getRecord :arr="arr"></getRecord>
    <addRecord :id="uid"></addRecord>
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import getRecord from '@/pages/Process/common/store/getRecord'
import addRecord from '@/pages/Process/common/store/addRecord'

export default {
  name: "shipment",
  data() {
    return {
      uid: 0,
      arr: [],
      getModal: false,
      addModal: false
    };
  },
  components: {
    getRecord: getRecord,
    addRecord: addRecord
  },
  methods: {
    tableAjaxData(params) {
      let that = this;
      that
        .$get(`orders/sales/shipment`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => console.error(err));
    },
    tableAjaxParams(params) {
      return {
        page: params.offset / params.limit + 1,
        per_page: params.limit,
        number: params.search || undefined
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "qr_code_text",
            title: "二维码",
            formatter(value, row, index) {
              setTimeout(() => QRCode.toString(value, (err, string) => (document.getElementById(`saleShipment${row.id}`).innerHTML = string)), 500);
              return `<div id="saleShipment${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            }
          },
          {
            field: "number",
            title: "出货申请单号"
          },
          {
            field: "created_by",
            title: "申请人"
          },
          {
            field: "created_at",
            title: "申请日期"
          },
          {
            field: "order.number",
            title: "关联销售单号"
          },
          {
            field: "consignee",
            title: "收货人"
          },
          {
            field: "mobile",
            title: "收货人手机"
          },
          {
            field: "address",
            title: "收货地址"
          },
          {
            field: "postcode",
            title: "邮政编码"
          },
          {
            field: "delivery_method",
            title: "送货方式"
          },
          {
            field: "packing_method",
            title: "包装方式"
          },
          {
            field: "check.man",
            title: "审核人"
          },
          {
            field: "check.datetime",
            title: "审核日期"
          },
          {
            field: "check.status",
            title: "审核状态",
            formatter(value) {
              return value ? `审核成功` : `未审核`;
            }
          },
          {
            field: "record",
            title: "出货记录",
            formatter(value) {
              return `<button class="btn">查看记录</button>`;
            },
            events: {
              "click .btn"(e, value, row, index) {
                that
                  .$get(`repositories/shipment/records`, { ship_id: row.id })
                  .then(response => {
                    if (response.status != 200) return false
                    that.arr = response.data;
                    that.getModal = !that.getModal;
                  })
                  .catch(e => console.error(e));

              }
            }
          },
          {
            field: "id",
            title: "操作",
            formatter(value, row, index) {
              let add = `<button class="btn btn-primary btn-sm add">添加出货记录</button>`,
                success = `<button class="btn btn-success btn-sm success" style="margin-left: 5px;">出货完成</button>`;
              return `<div style="display: flex;">${add + success}</div>`;
            },
            events: {
              "click .add"(e, value, row, index) {
                that.uid = value;
                that.addModal = !that.addModal;
              },
              "click .success"(e, value, row, index) {
                if (confirm("确定完成了吗?"))
                  that
                    .$get(`repositories/shipment/update/${value}`)
                    .then(response => {
                      if (response.status != 200) return false;
                    })
                    .catch(err => console.error);
              }
            }
          }
        ],
        data = {
          toolbar: "#shipment #toolbar",
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
            let content = [
              `<table class="table">`,
              `<tr><th>序号</th><th>料品编码</th><th>料品名称</th><th>料品规格</th><th>单位</th><th>数量</th></tr>`
            ];
            mrow.items.forEach((e, k) =>
              content.push(
                `<tr><td>${k + 1}</td><td>${e.material.code}</td><td>${e.material.name}</td><td>${e.material.specification}</td><td>${e.material.unit}</td><td>${e.quantity}</td></tr>`
              )
            );
            content.push(`</table>`);
            return content.join("");
          }
        };
      $("#shipment #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#shipment #table"));
    }
  },
  watch: {
    getModal(val) {
      $("#shipment #getRecord").modal("toggle");
    },
    addModal(val) {
      $("#shipment #addRecord").modal("toggle");
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#shipment {
}
</style>
