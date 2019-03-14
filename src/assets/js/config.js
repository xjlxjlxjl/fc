String.prototype.removeNumber = function () {
  return this.replace(/\d+[a-zA-Z&\|\\\*^%$#@\-]\d+/g, "");
};

Array.prototype.inArray = function (n) {
  return this.includes(n);
};
/**
 * n: 是否存在于数组内元素
 * attr: 判断字段名
 * name: 需要返回字段名
 */
Array.prototype.onArray = function (n, attr, name) {
  for (const item of this) {
    if (item[attr] == n) return item[name];
  }
  return false;
}

// 数组去重
Array.prototype.rep = function () {
  return Array.from(new Set(this));
};
Array.prototype.repeat = function () {
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    if (arr.indexOf(this[i]) == -1) arr.push(this[i]);
  }
  return arr;
};
// 数组内 id 去重
Array.prototype.repeatDepth = function () {
  // return Array.from(new Set(this.map(v => v.id)));
  var inArray,
    arr = [];
  for (var i = 0; i < this.length; i++) {
    inArray = false;
    for (var j = 0; j < arr.length; j++) {
      if (this[i].id == arr[j].id) inArray = true;
    }
    if (!inArray) arr.push(this[i]);
  }
  return arr;
};
Array.prototype.sum = function (num = "number", price = "price", fix = 2) {
  return this.reduce((sumSoFar, item) => {
    return parseFloat(
      sumSoFar +
      parseInt(item[num] ? item[num] : item.quantity ? item.quantity : 1) *
      parseFloat(item[price] ? item[price] : item.money ? item.money : 0)
    ).toFixed(fix);
  }, 0);
};
Array.prototype.limit = function (cond, ition) {
  if (cond) return this.filter(n => n > ition);
  else return this.filter(n => n[cond] > ition);
};

export default {
  install: function (Vue, options) {
    Vue.prototype.dateParse = date => {
      return `${date.getFullYear()}-${
        date.getMonth() + 1 < 9
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1
      }-${date.getDate() < 9 ? "0" + date.getDate() : date.getDate()} ${
        date.getHours() < 9 ? "0" + date.getHours() : date.getHours()
      }:${
        date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes()
      }:${date.getSeconds() < 9 ? "0" + date.getSeconds() : date.getSeconds()}`;
    };

    Vue.prototype.miniDateParse = date => {
      return `${date.getFullYear()}-${
        date.getMonth() + 1 < 9
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1
      }-${date.getDate() < 9 ? "0" + date.getDate() : date.getDate()} ${
        date.getHours() < 9 ? "0" + date.getHours() : date.getHours()
      }:${date.getMinutes() < 9 ? "0" + date.getMinutes() : date.getMinutes()}`;
    };

    Vue.prototype.download = (content, filename) => {
      let folder = content.split("/"),
        link = document.createElement("a");
      link.setAttribute("download", filename);
      link.href = `https://api.factoryun.com/files/download/${folder[folder.length - 2]}/${filename}`;
      link.style.display = "none";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    Vue.prototype.getTableAttr = ($el, attr) => {
      let arr = [],
        selected = $el.bootstrapTable("getAllSelections");
      selected.forEach(e => {
        arr.push(e[attr]);
      });
      return arr;
    };
    Vue.prototype.getData = $el => {
      return $el.bootstrapTable("getSelections");
    };
    Vue.prototype.getRow = ($el, params) => {
      return $el.bootstrapTable('getRowByUniqueId', params);
    }

    Vue.prototype.addTable = ($el, index, data) => {
      $el.bootstrapTable("insertRow", {
        index: index,
        row: data
      });
    };
    /**
     * type String 'id'
     * data Array [ id, id, id ]
     */
    Vue.prototype.delTable = ($el, type, data) => {
      $el.bootstrapTable("remove", {
        field: type,
        values: data
      });
    };
    Vue.prototype.ediTable = ($el, index, data) => {
      $el.bootstrapTable("updateRow", {
        index: index,
        row: data
      });
    };
    Vue.prototype.editRow = ($el, params) => {
      $el.bootstrapTable("updateByUniqueId", params);
    };
    Vue.prototype.refresh = ($el, data = {}) => {
      $el.bootstrapTable("refresh", data);
    };
  }
};
