<template>
  <div id="nonstandard">
    <addNonstandard :row="row" @refresh="refreshed"></addNonstandard>
    <addOffer :row="row" @refresh="refreshed"></addOffer>
    <inquiryRecordModal :arr="arr"></inquiryRecordModal>
    <div id="toolbar">
      <el-button type="default" size="mini" @click="row = {};addNonstandardModal = !addNonstandardModal">新建非标询价</el-button>
    </div>
    <table id="table"></table>
  </div>
</template>
<script>
import QRCode from "qrcode";
import addNonstandard from "@/pages/Process/common/sale/addNonstandard";
import addOffer from "@/pages/Process/common/sale/addOffer";
import inquiryRecordModal from "@/pages/Process/common/sale/inquiryRecord";

export default {
  name: "nonstandard",
  data() {
    return {
      row: {},
      arr: [],
      addNonstandardModal: false,
      addOfferModal: false,
      inquiryRecord: false,
    };
  },
  components: {
    addNonstandard: addNonstandard,
    addOffer: addOffer,
    inquiryRecordModal: inquiryRecordModal
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`orders/inquiry-price`, params.data)
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
        page: params.offset / 10 + 1,
        per_page: params.limit,
        product: params.search
      };
    },
    init() {
      let that = this,
        columns = [
          {
            field: "index",
            title: "序号",
            formatter: (value, row, index) => {
              return index + 1;
            }
          },
          {
            field: "qrCode",
            title: "二维码",
            formatter: (value, row, index) => {
              setTimeout(
                () =>
                  QRCode.toString(`https://www.factoryun.com//orders/inquiry-price/detail/${row.id}`,
                    (err, string) => (document.getElementById(`nonstandard${row.id}`).innerHTML = string)
                  ),
                500
              );
              return `<div id="nonstandard${row.id}" class="img" style="width: 50px;height: 50px;margin: auto;"></div>`;
            },
          },
          {
            field: "number",
            title: "非标询价单号"
          },
          {
            field: "linkman",
            title: "询价人"
          },
          {
            field: "inquiry_datetime",
            title: "询价日期"
          },
          {
            field: "#",
            title: "询价记录",
            formatter(value, row, index) {
              let inquiry = `<select class="form-control inquiry">`;
              row.price.forEach((e, k) => {
                if (!k) row.priceStatus = e;
                inquiry += `<option key="${k}">第 ${ k + 1 } 次报价</option>`
              });
              inquiry += `</select>`;
              return inquiry;
            },
            events: {
              "change .inquiry": function(e, value, row, index) {
                row.priceStatus = row.price[$(this).children("option:selected").attr("key")];
              }
            }
          },
          {
            field: "priceStatus",
            title: "报价状态",
            formatter(value, row, index) {
              let link = `<button class="btn btn-link">已报价（点击查看）</button>`;
              return value ? value.selling_price ? link : '未报价' : "未报价";
            },
            events: {
              "click .btn": function(e, value, row, index) {
                let obj = row.priceStatus;
                obj.inquiry_name = row.linkman;
                that.arr = [obj];
                that.inquiryRecord = !that.inquiryRecord;
              }
            }
          },
          {
            field: "slug",
            title: "操作",
            formatter: (value, row, index) => {
              let
                offer = `<button class="btn btn-primary btn-sm offer">报价</button>`,
                print = `<button class="btn btn-success btn-sm print" style="margin-left: 5px;">打印</button>`,
                edit = `<button class="btn btn-warning btn-sm edit" style="margin-left: 5px;">编辑</button>`,
                del = `<button class="btn btn-danger btn-sm del" style="margin-left: 5px;">删除</button>`;
              return `<div style="display: flex;">${ offer + print + edit + del }</div>`;
            },
            events: {
              "click .offer": function(e, value, row, index) {
                that.row = row;
                that.addOfferModal = !that.addOfferModal;
              },
              "click .print": function(e, value, row, index) {
                window.open(`/print.html#/saleNonstandard/${row.id || 123}`);
              },
              "click .edit": function(e, value, row, index) {
                that.row = row;
                that.addNonstandardModal = !that.addNonstandardModal;
              },
              "click .del": function(e, value, row, index) {
                if (confirm('是否确认删除'))
                  that
                    .$get(`orders/inquiry-price/delete/${row.id}`)
                    .then(response => {
                      if (response.status != 200) return false;
                      that.delTable($("#nonstandard #table"), 'id', [row.id]);
                    })
                    .catch(e => console.error(e));
              }
            }
          }
        ],
        data = {
          toolbar: "#nonstandard #toolbar",
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
            let content = `
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td>客户公司名</td>
                    <td>${ mrow.customer_name }</td>
                    <td>联系人</td>
                    <td>${ mrow.linkman }</td>
                    <td>联系电话</td>
                    <td>${ mrow.mobile }</td>
                    <td>职位</td>
                    <td>${ mrow.position }</td>
                  </tr>
                  <tr>
                    <td>询价描述</td>
                    <td colspan="3">${ mrow.demand }</td>
                    <td>询价附件</td>
                    <td colspan="3">
            `;
            for (let v of mrow.images) content += `<a href="${v.url}" target="__blank"><img src="${v.url}" style="max-width: 80px;max-height: 80px;"></a>`;
            content += `</td>`;
            
            mrow.param.forEach((v, k) => {
              if (k % 4 == 0) content += `</tr><tr>`;
              content += `<td>${v.label}</td><td>`;
              switch(v.type) {
                case 1:
                case 2:
                case 4:
                case 5:
                  content += v.enter;
                  break;
                case 3:
                  content += v.enter.join(',');
                  break;
                case 6:
                  for (let e of v.fileUrl) content += `<a href="${e.url}" target="__blank"><img src="${e.url}" style="max-width: 80px;max-height: 80px;"></a>`;
                break;
              }
              content += `</td>`;
            })

            content += `</tr></tbody></table>`;
            return content;
          }
        };
      $("#nonstandard #table").bootstrapTable(data);
    },
    refreshed() {
      this.refresh($("#nonstandard #table"));
    }
  },
  watch: {
    addNonstandardModal(val) {
      $("#nonstandard #addNonstandard").modal("toggle");
    },
    addOfferModal(val) {
      $("#nonstandard #addOffer").modal("toggle");
    },
    inquiryRecord(val) {
      $("#nonstandard #inquiryRecord").modal("toggle")
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="less">
#nonstandard {
}
</style>
