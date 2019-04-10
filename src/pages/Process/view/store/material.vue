<template>
  <div id="material">
    <div
      class="modal fade bs-example-modal-lg"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div id="materialToolbar">
            <span class="lead">原材料库存</span>
            <el-select v-model="material_category_id" size="mini" @change="modalRefresh">
              <el-option
                v-for="item in materialAttr"
                :key="item.id"
                :label="item.remark || item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <table id="materialTable"></table>
        </div>
      </div>
    </div>
    <addWareHouse @refresh="refreshed"></addWareHouse>
    <addMaterials></addMaterials>
    <div id="wareHouseToolbar">
      <span class="lead">仓库列表</span>
      <el-button size="mini" @click="addWareHouse">创建仓库</el-button>
      <el-button size="mini" @click="addMaterial">创建创建料品</el-button>
    </div>
    <table id="wareHouseTable"></table>
  </div>
</template>
<script>
import addWareHouse from "@/pages/Process/common/addWareHouse";
import addMaterials from "@/pages/Process/common/addMaterials";
import { mapState, mapMutations } from "vuex";

export default {
  name: "material",
  data() {
    return {
      material_category_id: "",
      wareHouseId: 0
    };
  },
  components: {
    addWareHouse: addWareHouse,
    addMaterials: addMaterials
  },
  methods: {
    ...mapMutations(["setStateData"]),
    /**
     * 仓库列表
     */
    tableAjaxData(params) {
      /**
        if (this.WareHouseList.length) {
          let arr = [];
          this.WareHouseList.forEach(e => {
            arr.push(e);
            e.children.forEach(c => {
              c.parent = e.id;
              c.parentname = e.name;
              arr.push(c);
            });
          });
          params.success({
            rows: arr,
            total: arr.length
          });
          return false;
        }
      */
      let that = this;
      that
        .$get(`respositories/list`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          let arr = [];
          response.data.list.forEach(e => {
            arr.push(e);
            e.children.forEach(c => {
              c.parent = e.id;
              c.parentname = e.name;
              arr.push(c);
            });
          });
          params.success({
            rows: arr,
            total: arr.length
            // total: response.data.pagination.total
          });
          that.setStateData({ name: "WareHouseList", arr: response.data.list });
        })
        .catch(err => {});
    },
    tableAjaxParams(params) {
      // params.page = params.offset / 10 + 1;
      // params.per_page = params.limit;
      params.name = params.search;
      return params;
    },
    /**
     * 料品列表
     */
    materialAjaxData(params) {
      let that = this;
      that
        .$get(`respositories/materials/list`, params.data)
        .then(response => {
          if (response.status != 200) return false;
          params.success({
            rows: response.data.list,
            total: response.data.pagination.total
          });
        })
        .catch(err => {});
    },
    materialAjaxParams(params) {
      params.page = params.offset / 10 + 1;
      params.per_page = params.limit;
      params.name = params.search;
      params.respository_id = this.wareHouseId;
      params.material_category_id = this.material_category_id;
      return params;
    },
    /**
     * 获取料盘类别
     */
    getMaterial() {
      if (this.materialAttr.length) {
        this.tableInit();
        return false;
      }
      let that = this,
        loading = this.$loading({
          lock: true,
          background: "rgba(0, 0, 0, 0.7)"
        });
      that
        .$get(`project/material_attr`)
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.setStateData({ name: "materialAttr", arr: response.data.list });
          that.tableInit();
        })
        .catch(err => loading.close());
    },
    getWareHouseType() {
      let that = this;
      if (that.WareHouseType.length) return false;
      that
        .$get(`respositories/category`)
        .then(response => {
          if (response.status != 200) return false;
          that.setStateData({ name: "WareHouseType", arr: response.data.list });
        })
        .catch(err => {});
    },
    getBrand() {
      if (this.brandList.length) {
        this.modalInit();
        return false;
      }
      let that = this;
      that
        .$get(`store/brand`)
        .then(response => {
          if (response.status != 200) return false;
          that.setStateData({ name: "brandList", arr: response.data.list });
          that.modalInit();
        })
        .catch(error => {});
    },
    addWareHouse() {
      addWareHouse.methods.close.call(this);
    },
    addMaterial() {
      addMaterials.methods.close.call(this);
    },
    refreshed() {
      this.refresh($("#wareHouseTable"));
    },
    modalRefresh() {
      this.refresh($("#materialTable"));
    },
    tableInit() {
      let that = this;
      /**
       * 仓库列表
       */
      $("#wareHouseTable").bootstrapTable({
        toolbar: "#wareHouseToolbar",
        ajax: that.tableAjaxData,
        queryParams: that.tableAjaxParams,
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
        pageList: ["All", 5, 10, 25, 50, 100],
        // detailView: true,
        columns: [
          {
            checkbox: true
          },
          {
            field: "name",
            title: "仓库名称",
            sortable: true,
            formatter: (value, row, index, $el) => {
              return `<a class="material">${value}</a>`;
            },
            events: {
              "click .material": ($el, value, row, index) => {
                that.material_category_id = "";
                that.wareHouseId = row.id;
                that.refresh($("#materialTable"));
                $(".bs-example-modal-lg").modal("show");
              }
            }
          },
          {
            field: "parentname",
            title: "父级仓库",
            sortable: true,
            formatter: (value, row, index, $el) => {
              return `${value || "无"}`;
            }
          },
          {
            field: "member_display_name",
            title: "创建者",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建时间",
            sortable: true
          },
          {
            field: "category.slug",
            title: "仓库类别",
            sortable: true,
            editable: {
              type: "select",
              source: that.WareHouseType.arr,
              title: "仓库类别",
              emptytext: "空"
            }
          },
          {
            field: "type",
            title: "仓库类型",
            sortable: true,
            editable: {
              type: "select",
              source: [
                { value: "1", text: "仓库" },
                { value: "2", text: "仓位" }
              ],
              title: "仓库类型",
              emptytext: "空"
            }
          },
          {
            field: "enabled",
            title: "仓库状态",
            sortable: true,
            editable: {
              type: "select",
              source: [
                { value: "1", text: "启用" },
                { value: "0", text: "禁用" }
              ],
              title: "仓库状态",
              emptytext: "空"
            }
          },
          {
            field: "description",
            title: "仓库介绍",
            sortable: true,
            editable: {
              type: "textarea",
              title: "仓库介绍",
              emptytext: "空"
            }
          }
        ],
        onEditableSave(field, mrow, oldValue, $el) {
          let category = null;
          that.WareHouseType.obj.forEach(e => {
            if (mrow["category.slug"] == e.slug) category = JSON.stringify(e);
          });
          that
            .$post(`respositories/edit`, {
              name: mrow.name,
              description: mrow.description,
              type: mrow.type,
              category: category,
              remark: mrow.remark,
              enabled: mrow.enabled,
              slug: mrow.slug
            })
            .then(response => {
              if (response.status != 200) return false;
            })
            .catch(error => {});
        },
        detailFormatter(field, mrow, oldValue, $el) {}
      });
    },
    modalInit() {
      let that = this;
      /**
       * 原材料列表
       */
      $("#materialTable").bootstrapTable({
        toolbar: "#materialToolbar",
        ajax: this.materialAjaxData,
        queryParams: this.materialAjaxParams,
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
        columns: [
          {
            checkbox: true
          },
          {
            field: "name",
            title: "料品名称",
            sortable: true
          },
          {
            field: "created_at",
            title: "创建时间",
            sortable: true
          },
          {
            field: "material_number",
            title: "料品编号",
            sortable: true
          },
          {
            field: "material_specification",
            title: "料品规格",
            sortable: true
          },
          {
            field: "material_category",
            title: "料品类别（关系）",
            sortable: true,
            formatter: (value, row, index, $el) => {
              return `${value.name || "无"}`;
            }
          },
          {
            field: "respository",
            title: "仓库（关系）",
            sortable: true,
            formatter: (value, row, index, $el) => {
              return `${value.remark || value.name}`;
            }
          },
          {
            field: "project_drawing_number",
            title: "工程图号",
            sortable: true,
            formatter: (value, row, index, $el) => {
              return `${value || "无"}`;
            }
          },
          {
            field: "height",
            title: "高度",
            sortable: true
          },
          {
            field: "weight",
            title: "重量",
            sortable: true
          },
          {
            field: "width",
            title: "宽度",
            sortable: true
          },
          {
            field: "length",
            title: "长度",
            sortable: true
          },
          {
            field: "item_unit",
            title: "料品单位",
            sortable: true
          },
          {
            field: "attributes",
            title: "料品属性",
            sortable: true,
            formatter: (value, row, index, $el) => {
              let html = [];
              value.forEach(e =>
                html.push(`<p class="clear-margin">${e.remark || e.name}</p>`)
              );
              return html.join("");
            }
          },
          {
            field: "print",
            title: "是否打印",
            sortable: true,
            formatter: (value, row, index, $el) => {
              return `${value ? "是" : "否"}`;
            }
          },
          {
            field: "picture_number",
            title: "图档号",
            sortable: true
          },
          {
            field: "check",
            title: "是否需要质检",
            sortable: true,
            formatter: (value, row, index, $el) => {
              return `${value ? "需要" : "不需要"}`;
            }
          },
          {
            field: "mold_number",
            title: "模具号",
            sortable: true
          },
          {
            field: "standard_model",
            title: "标准型号",
            sortable: true
          },
          {
            field: "material_level",
            title: "料品等级",
            sortable: true
          },
          {
            field: "material_quality",
            title: "材质",
            sortable: true
          },
          {
            field: "pinyin_code",
            title: "拼音码",
            sortable: true
          },
          {
            field: "drawing_2d",
            title: "2D图纸（关系）",
            sortable: true,
            formatter: (value, row, index, $el) => {
              let html = [];
              value.forEach(e =>
                html.push(`
                <p class="clear-margin">
                  <a href="${e}" target="_blank">${e.split("/").pop()}</a>
                </p>
              `)
              );
              return html.join("");
            }
          },
          {
            field: "drawing_3d",
            title: "3D图纸（关系）",
            sortable: true,
            formatter: (value, row, index, $el) => {
              let html = [];
              value.forEach(e =>
                html.push(`
                <p class="clear-margin">
                  <a href="${e}" target="_blank">${e.split("/").pop()}</a>
                </p>
              `)
              );
              return html.join("");
            }
          },
          {
            field: "drawing_pdf",
            title: "pdf图纸（关系）",
            sortable: true,
            formatter: (value, row, index, $el) => {
              let html = [];
              value.forEach(e =>
                html.push(`
                <p class="clear-margin">
                  <a href="${e}" target="_blank">${e.split("/").pop()}</a>
                </p>
              `)
              );
              return html.join("");
            }
          },
          {
            field: "drawing_working",
            title: "加工图纸（关系）",
            sortable: true,
            formatter: (value, row, index, $el) => {
              let html = [];
              value.forEach(e =>
                html.push(`
                <p class="clear-margin">
                  <a href="${e}" target="_blank">${e.split("/").pop()}</a>
                </p>
              `)
              );
              return html.join("");
            }
          },
          {
            field: "drawing_approve",
            title: "承认图纸（关系）",
            sortable: true,
            formatter: (value, row, index, $el) => {
              let html = [];
              value.forEach(e =>
                html.push(`
                <p class="clear-margin">
                  <a href="${e}" target="_blank">${e.split("/").pop()}</a>
                </p>
              `)
              );
              return html.join("");
            }
          },
          {
            field: "project_picture",
            title: "工程图片",
            sortable: true,
            formatter: (value, row, index, $el) => {
              let html = [];
              value.forEach(e =>
                html.push(`
                <p class="clear-margin">
                  <a href="${e}" target="_blank">${e.split("/").pop()}</a>
                </p>
              `)
              );
              return html.join("");
            }
          },
          {
            field: "total_weight",
            title: "总重",
            sortable: true
          },
          {
            field: "dimension",
            title: "维度",
            sortable: true
          },
          {
            field: "barcode",
            title: "条码",
            sortable: true
          },
          {
            field: "assistant_code",
            title: "助记码",
            sortable: true
          },
          {
            field: "image",
            title: "图片（关系）",
            sortable: true,
            formatter: (value, row, index, $el) => {
              let html = [];
              value.forEach(e =>
                html.push(`
                <p class="clear-margin">
                  <a href="${e}" target="_blank">${e.split("/").pop()}</a>
                </p>
              `)
              );
              return html.join("");
            }
          },
          {
            field: "abc_category",
            title: "ABC分类",
            sortable: true
          },
          {
            field: "manufacturer",
            title: "生产厂家",
            sortable: true,
            editable: {
              type: "text",
              title: "生产厂家",
              emptytext: "空"
            }
          },
          {
            field: "brand_name.id",
            title: "品牌",
            sortable: true,
            editable: {
              type: "select",
              source: that.brandList,
              title: "品牌",
              emptytext: "空"
            }
          },
          {
            field: "begin_price",
            title: "期初单价",
            sortable: true,
            editable: {
              type: "number",
              title: "期初单价",
              emptytext: "空"
            }
          },
          {
            field: "begin_amount_money",
            title: "期初金额",
            sortable: true,
            editable: {
              type: "number",
              title: "期初金额",
              emptytext: "空"
            }
          },
          {
            field: "enter_warehouse_price",
            title: "入库单价",
            sortable: true,
            editable: {
              type: "number",
              title: "入库单价",
              emptytext: "空"
            }
          },
          {
            field: "enter_warehouse_amount",
            title: "入库金额",
            sortable: true,
            editable: {
              type: "number",
              title: "入库金额",
              emptytext: "空"
            }
          },
          {
            field: "out_warehouse_price",
            title: "出库单价",
            sortable: true,
            editable: {
              type: "number",
              title: "出库单价",
              emptytext: "空"
            }
          },
          {
            field: "out_warehouse_amount",
            title: "出库金额",
            sortable: true,
            editable: {
              type: "number",
              title: "出库金额",
              emptytext: "空"
            }
          },
          {
            field: "revise_amount",
            title: "调整金额",
            sortable: true,
            editable: {
              type: "number",
              title: "调整金额",
              emptytext: "空"
            }
          },
          {
            field: "end_period_amount",
            title: "期末金额",
            sortable: true,
            editable: {
              type: "number",
              title: "期末金额",
              emptytext: "空"
            }
          },
          {
            field: "standard_single_price",
            title: "标准单价",
            sortable: true,
            editable: {
              type: "number",
              title: "标准单价",
              emptytext: "空"
            }
          },
          {
            field: "standard_cost_price",
            title: "标准进价",
            sortable: true,
            editable: {
              type: "number",
              title: "标准进价",
              emptytext: "空"
            }
          },
          {
            field: "standard_uniform_price",
            title: "标准售价",
            sortable: true,
            editable: {
              type: "number",
              title: "标准售价",
              emptytext: "空"
            }
          },
          {
            field: "minimum_purchase_quantity",
            title: "最小采购量",
            sortable: true,
            editable: {
              type: "number",
              title: "最小采购量",
              emptytext: "空"
            }
          },
          {
            field: "enter_warehouse_quantity",
            title: "入库数量",
            sortable: true,
            editable: {
              type: "number",
              title: "入库数量",
              emptytext: "空"
            }
          },
          {
            field: "out_warehouse_quantity",
            title: "出库数量",
            sortable: true,
            editable: {
              type: "number",
              title: "出库数量",
              emptytext: "空"
            }
          },
          {
            field: "revise_quantity",
            title: "调整数量",
            sortable: true,
            editable: {
              type: "number",
              title: "调整数量",
              emptytext: "空"
            }
          },
          {
            field: "end_period_quantity",
            title: "期末数量",
            sortable: true,
            editable: {
              type: "number",
              title: "期末数量",
              emptytext: "空"
            }
          },
          {
            field: "await_stored_quantity",
            title: "待入库数量",
            sortable: true,
            editable: {
              type: "number",
              title: "待入库数量",
              emptytext: "空"
            }
          },
          {
            field: "await_delivered_quantity",
            title: "待出库数量",
            sortable: true,
            editable: {
              type: "number",
              title: "待出库数量",
              emptytext: "空"
            }
          },
          {
            field: "await_revise_quantity",
            title: "待调整数量",
            sortable: true,
            editable: {
              type: "number",
              title: "待调整数量",
              emptytext: "空"
            }
          },
          {
            field: "expected_inventory_quantity",
            title: "预计结存数量",
            sortable: true,
            editable: {
              type: "number",
              title: "预计结存数量",
              emptytext: "空"
            }
          },
          {
            field: "take_up",
            title: "占用",
            sortable: true,
            editable: {
              type: "number",
              title: "占用",
              emptytext: "空"
            }
          },
          {
            field: "max_inventory",
            title: "最大库存",
            sortable: true,
            editable: {
              type: "number",
              title: "最大库存",
              emptytext: "空"
            }
          },
          {
            field: "min_inventory",
            title: "最小库存",
            sortable: true,
            editable: {
              type: "number",
              title: "最小库存",
              emptytext: "空"
            }
          },
          {
            field: "real_inventory",
            title: "实际库存",
            sortable: true
          }
        ],
        onEditableSave(field, mrow, oldValue, $el) {
          let url = null;
          switch (field) {
            case "enter_warehouse_quantity":
            case "out_warehouse_quantity":
            case "revise_quantity":
            case "end_period_quantity":
            case "await_stored_quantity":
            case "await_delivered_quantity":
            case "await_revise_quantity":
            case "expected_inventory_quantity":
            case "take_up":
            case "max_inventory":
            case "min_inventory":
              url = `respositories/materials/edit/quantity`;
              break;
            case "manufacturer":
            case "brand_name.id":
            case "begin_price":
            case "begin_amount_money":
            case "enter_warehouse_price":
            case "enter_warehouse_amount":
            case "out_warehouse_price":
            case "out_warehouse_amount":
            case "revise_amount":
            case "end_period_amount":
            case "standard_single_price":
            case "standard_cost_price":
            case "standard_uniform_price":
            case "minimum_purchase_quantity":
              mrow.brand_name = mrow["brand_name.id"];
              url = `respositories/materials/edit/price`;
              break;
          }
          that
            .$post(url, mrow)
            .then(response => {
              if (response.status != 200) return false;
            })
            .catch(err => {});
        },
        detailFormatter(field, mrow, oldValue, $el) {}
      });
    }
  },
  computed: mapState({
    WareHouseList: state => state.WareHouseList,
    WareHouseType: state => {
      let obj = {
        arr: [],
        obj: []
      };
      state.WareHouseType.forEach(e => {
        obj.arr.push({ value: e.key.slug, text: e.value });
        obj.obj.push(e.key);
      });
      return obj;
    },
    materialAttr: state => state.materialAttr,
    brandList: state => {
      let arr = [];
      state.brandList.forEach(e => {
        arr.push({ value: e.id, text: e.name });
      });
      return arr;
    }
  }),
  mounted() {
    this.getWareHouseType();
    this.getMaterial();
    this.getBrand();
  }
};
</script>
<style lang="less">
#material {
  .bs-example-modal-lg {
    .modal-lg {
      width: 1280px;
      max-width: 100%;
    }
  }
  .clear-margin {
    margin: 0;
  }
}
</style>
