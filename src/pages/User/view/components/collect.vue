<template>
  <div id="collect">
    <el-table :data="collectList.list" style="width: 100%">
      <el-table-column prop="products" label="商品">
        <template slot-scope="{ row, $index}">
          <div class="flex">
            <div>
              <img :src="row.products.image">
            </div>
            <div>
              <p>{{ row.products.name }}</p>
              <p>{{ row.products.categories }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="company_name" label="供应商"></el-table-column>
      <el-table-column prop="products.sales_price" label="价格"></el-table-column>
      <el-table-column prop="id" label="操作">
        <template slot-scope="{ row, $index}">
          <el-button type="info" size="mini" @click="delCollect(row.products.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
 <script>
export default {
  name: "collect",
  data() {
    return {
      collectList: {}
    };
  },
  methods: {
    getList() {
      let that = this,
        loading = this.$loading({ lock: true });
      that
        .$get("members/collects")
        .then(response => {
          loading.close();
          if (response.status != 200) return false;
          that.collectList = response.data;
        })
        .catch(error => loading.close());
    },
    delCollect(id) {
      let that = this;
      that.$post("members/collects/delete", { products: id }).then(response => {
        if (response.status != 200) return false;
        that.getList();
      });
    }
  },
  created() {
    this.getList();
  }
};
</script> 
<style lang="less">
#collect {
  width: 100%;
  .flex {
    display: flex;
    img {
      width: 80px;
      height: 80px;
      margin-right: 1rem;
    }
  }
}
</style>
