<template>
  <div id="plan">
    <editPriority :row="active"></editPriority>
    <getBOM :arr="arr"></getBOM>
    <getSOP :id="activeId" @refresh="refreshed"></getSOP>
    <getMaterialPic :pic="pic"></getMaterialPic>
    <smartOccupy :arr="row"></smartOccupy>
    <designate @user="user" type="production"></designate>
    <div id="toolbar"></div>
    <table id="table"></table>
  </div>
</template>
<script>
import editPriority from '@/pages/Process/common/produce/editPriority';
import getMaterialPic from '@/pages/Process/common/engineer/getMaterialPic';
import smartOccupy from '@/pages/Process/common/purchase/smartOccupy';
import getBOM from '@/pages/Process/common/produce/getBOM';
import getSOP from '@/pages/Process/common/produce/getSOP';
import designate  from '@/pages/Process/common/store/designate';

export default {
  name: "plan",
  data() {
    return {
      activeId: 0,
      active: {},
      arr: [],
      row: [],
      pic: {
        drawing_working: [],
        assembly_drawing: [],
        drawing_approve: [],
        drawing_2d: [],
        drawing_3d: [],
        drawing_pdf: []
      }
    };
  },
  components: {
    editPriority: editPriority,
    getBOM: getBOM,
    getSOP: getSOP,
    getMaterialPic: getMaterialPic,
    smartOccupy: smartOccupy,
    designate: designate
  },
  methods: {
    tableAjaxData(params) {
      this
        .$get(`produces/plan`, params.data)
        .then(response => {
          if (response.status != 200);
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          })
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
            title: "优先级",
            formatter(value, row, index) {
              return index + 1;
            }
          },
          {
            field: "plan_number",
            title: "生产计划号"
          },
          {
            field: "created_member.last_name",
            title: "创建人"
          },
          {
            field: "created_at",
            title: "创建时间"
          },
          {
            field: "order_number",
            title: "销售订单号"
          },
          {
            field: "id",
            title: "操作",
            formatter(value, row, index) {
              const 
                pick = `<button class="btn btn-warning btn-sm pick">生产领料</button>`,
                send = `<button class="btn btn-primary btn-sm send" style="margin-left: 5px;">发送生产看板</button>`,
                priority = `<button class="btn btn-danger btn-sm priority" style="margin-left: 5px;">调优级</button>`;
              return pick + send + priority;
            },
            events: {
              "click .send"($el, value, row, index) {
                if(confirm('确定发送生产看板吗？'))
                that
                  .$post(`produces/show/create`, { id: value })
                  .then(response => {
                    if (response.status != 200) return false;

                  })
                  .catch(e => console.error(e));
              },
              "click .priority"($el, value, row, index) {
                that.active = row;
                $("#plan #editPriority").modal("show");
              }
            }
          }
        ],
        data = {
          toolbar: "#plan #toolbar",
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
            let html = `
              <table class="table table-bordered" style="white-space: nowrap;">
                <tbody>
                  <tr>
                    <th>　　</th>
                    <th>序号</th>
                    <th>SN码</th>
                    <th>料品编码</th>
                    <th>料品名称</th>
                    <th>料品规格</th>
                    <th>单位</th>
                    <th>数量</th>
                    <th>出货计划交期</th>
                    <th>关联BOM</th>
                    <th>图纸</th>
                    <th>智能占用表</th>
                    <th>智能提示生产日期</th>
                    <th>生产领料单号</th>
                    <th>SOP</th>
                    <th>生产组员</th>
                  </tr>
            `;
            mrow.plan_item.forEach((e, k) => {
              html += `
                <tr>
                  <td><input type="checkbox"></td>
                  <td>${ e.sn_code || '' }</td>
                  <td>${ e.material.material_number || '' }</td>
                  <td>${ e.material.name || '' }</td>
                  <td>${ e.material.material_specification || '' }</td>
                  <td>${ e.material.item_unit || '' }</td>
                  <td>${ e.quantity || '' }</td>
                  <td>${ e.delivery_period_at || '' }</td>
                  <td>${ e.bom_item || '' }</td>
                  <td><button key="${field}" index="${k}" class="btn btn-xs btn-link BOM">BOM</button></td>
                  <td><button key="${field}" index="${k}" class="btn btn-xs drawing">查看图纸</button></td>
                  <td><button key="${field}" index="${k}" class="btn btn-xs occupy">查看占用</button></td>
                  <td>${ e.prompt_at_at || '' }</td>
                  <td>${ e.schedule.numbering || '' }</td>
                  <td>${ e.sop_manage.name || '直线电机组装流程'} <button key="${field}" index="${k}" class="btn btn-xs process">关联</button></td>
                  <td>`;
                  if (e.members.length)
                    for (const v of e.members)
                       html += `${v.last_name}　`;
                  else html += `未指派`;
                  html += `<button key="${field}" index="${k}" class="btn btn-xs assign">指派</button></td>
                </tr>
              `;
            })
            html += `</tbody></table>`;
            return html;
          },
          onEditableSave(field, mrow, oldValue, $el) {
            console.log(mrow);
            that
              .$post(`produces/plan/sort`)
              .then(response => {
                if (response.status != 200) return false;
              })
              .catch(e => console.error(e));
          }
        };
      $("#plan #table").bootstrapTable(data);
    },
    user(arr) {
      this
        .$post(`produces/plan/edit`,{
          id: this.activeId,
          members: arr.join(',')
        })
        .then(response => {
          if (response.status != 200) return false;
          this.refreshed();
          $("#plan #designate").modal("hide");
        })
        .catch(e => console.log(e));
    },
    refreshed() {
      this.refresh($("#plan #table"));
    }
  },
  mounted() {
    this.init();
    let that = this;
    $("#plan").on("click", ".BOM", function() {
      const
        key = $(this).attr("key"),
        index = $(this).attr("index"),
        data = that.getAllData($("#plan #table"));
      that.arr = data[key].plan_item[index].bom_item;
      $("#plan #getBOM").modal("show");
    });
    $("#plan").on("click", ".drawing", function() {
      const
        key = $(this).attr("key"),
        index = $(this).attr("index"),
        data = that.getAllData($("#plan #table"));
      that.pic = {
        drawing_working: data[key].plan_item[index].material.drawing_working || [],
        assembly_drawing: data[key].plan_item[index].material.assembly_drawing || [],
        drawing_approve: data[key].plan_item[index].material.drawing_approve || [],
        drawing_2d: data[key].plan_item[index].material.drawing_2d || [],
        drawing_3d: data[key].plan_item[index].material.drawing_3d || [],
        drawing_pdf: data[key].plan_item[index].material.drawing_pdf || []
      };
      $("#plan #getMaterialPic").modal("show");
    });
    $("#plan").on("click", ".occupy", function() {
      const
        key = $(this).attr("key"),
        index = $(this).attr("index"),
        data = that.getAllData($("#plan #table"));
      that.row = [{}];
      $("#plan #smartOccupy").modal("show");
    });
    $("#plan").on("click", ".process", function() {
      const
        key = $(this).attr("key"),
        index = $(this).attr("index"),
        data = that.getAllData($("#plan #table"));
      that.activeId = data[key].plan_item[index].id;
      $("#plan #getSOP").modal("show");
    });
    $("#plan").on("click", ".assign", function() {
      const
        key = $(this).attr("key"),
        index = $(this).attr("index"),
        data = that.getAllData($("#plan #table"));
      that.activeId = data[key].plan_item[index].id;
      $("#plan #designate").modal("show");
    });
  }
}
</script>
<style lang="less">
#plan {}
</style>
