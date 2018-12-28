<template>
  <div id="powerModal"></div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "powerModal",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")),
      label: [],
      item: [],
      columns: [
        {
          field: "name",
          title: "部门名称"
        }
      ]
    };
  },
  methods: {
    ...mapMutations(["setStateData"]),
    getPowerList() {
      let that = this;
      that
        .$get(`members/branch/addon/permission`)
        .then(response => {
          if (response.status != 200) return false;
          that.setStateData({ name: "powerList", arr: response.data.list });
          that.init();
        })
        .catch(err => {});
    },
    init() {
      let that = this,
        self = this.powerList;
      self.forEach(e =>
        this.columns.push({
          field: e.name,
          title: e.label,
          formatter: function(val, row, index) {
            let content = [];
            content.push(`<table class="table table-bordered">`);
            if (
              val == undefined ||
              val == "undefined" ||
              typeof val == undefined
            ) {
              content.push(`</table>`);
              return content.join("");
            }
            for (const item in val.options) {
              content.push(
                `<tr>
                  <td>${val.options[item]}</td>
                  <td><input type='checkbox' name="powerBox" class="power" key="${
                    this.field
                  }" value='${item}' ${
                  val.value.indexOf(item) != -1 ? 'checked="checked"' : ""
                }'></td>
                </tr>`
              );
            }
            content.push(`</table>`);
            return content.join("");
          },
          events: {
            "change .power": function(event, value, row, index) {
              let val = $(this).val(),
                key = $(this).attr("key"),
                list = Object.values(row),
                arr = [];
              for (let item of list) {
                if (typeof item == "object")
                  item.value.forEach(e => arr.push(e));
              }
              if (arr.indexOf(val) == -1) arr.push(val);
              else arr.splice(arr.indexOf(val), 1);
              that
                .$post(`members/branch/permission/edit/${row.id}`, {
                  permission: JSON.stringify(arr)
                })
                .then(response => {
                  if (response.status != 200) return false;
                  let data = {
                    id: row.id,
                    name: row.name
                  };
                  response.data.permission.forEach(p => {
                    data[p.name] = {
                      options: p.options,
                      value: p.value
                    };
                  });
                  that.ediTable($("#mattersTable"), index, data);
                })
                .catch(err => {});
            }
          }
        })
      );
      this.$emit("init", { columns: this.columns });
    }
  },
  computed: mapState(["powerList"]),
  mounted() {
    if (!this.powerList.length) this.getPowerList();
    else this.init();
  }
};
</script>
<style lang='less'>
#powerModal {
  table,
  th,
  td {
    white-space: nowrap;
  }
}
</style>