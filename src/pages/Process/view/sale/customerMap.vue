<template>
  <div id="customerMap">
    <div id="Map" ref="map"></div>
    <el-form :model="params" size="mini" ref="form" label-width="140px">
      <el-form-item label="距离内客户（km）">
        <el-input v-model="distance"></el-input>
        <el-button type="primary" @click="search" size="mini">搜索</el-button>
      </el-form-item>
    </el-form>
    <div ref="table">
      <el-table :data="tableData" size="mini">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="member_name" label="客户名称"></el-table-column>
        <el-table-column prop="company_company" label="公司名称"></el-table-column>
        <el-table-column prop="customer_level" label="客户级别"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="salesman" label="业务员"></el-table-column>
        <el-table-column prop="owner" label="所有者"></el-table-column>
        <el-table-column prop="primary_contact" label="主要联系人"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="recent_contacts_at" label="最近联系日期"></el-table-column>
        <el-table-column prop="recent_contacts_record" label="最近联系一次记录"></el-table-column>
        <el-table-column prop="next_contacts_at" label="最近联系一次记录"></el-table-column>
        <el-table-column prop="recent_returned_at" label="最近回访日期"></el-table-column>
        <el-table-column prop="recent_service_at" label="最近服务日期"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      map: null,
      geolocation: null,
      opts: {
        width: 250,
        height: 80,
        title: "客户信息",
        enableMessage: true
      },
      distance: 10,
      params: {
        lat: 0,
        lng: 0,
        distance: 10000
      },
      tableData: []
    };
  },
  methods: {
    search() {
      let that = this;
      that
        .$get(`customers`, {
          lat: that.params.lat,
          lng: that.params.lng,
          distance: that.params.distance
        })
        .then(response => {
          if (response.status != 200) return false;
          that.tableData = response.data.list;
          that.tableData.forEach(e => {
            let marker = new BMap.Marker(
              new BMap.Point(e.region.x, e.region.y)
            );
            that.map.addOverlay(marker);
            that.addClickHandler(
              `名称：${e.name} 电话：${e.mobile} 地址：${e.region.address}`,
              marker
            );
          });
        })
        .catch(err => console.error(err));
    },
    addClickHandler(content, marker) {
      let that = this;
      marker.addEventListener("click", function(e) {
        that.openInfo(content, e);
      });
    },
    openInfo(content, e) {
      let that = this;
      let p = e.target;
      let point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      let infoWindow = new BMap.InfoWindow(content, that.opts);
      that.map.openInfoWindow(infoWindow, point);
    }
  },
  watch: {
    distance(val) {
      this.params.distance = parseInt(val) * 1000;
    }
  },
  mounted() {
    this.$refs["map"].style.width = window.innerWidth + "px";
    this.$refs["map"].style.height = window.innerHeight - 400 + "px";
    this.$refs["table"].style.maxWidth = window.innerWidth + "px";

    let that = this;
    this.map = new BMap.Map("Map");
    this.map.centerAndZoom(new BMap.Point(116.331398, 39.897445), 16);
    this.map.enableScrollWheelZoom(true);

    this.geolocation = new BMap.Geolocation();
    this.geolocation.getCurrentPosition(
      function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          that.params.lng = r.point.lng;
          that.params.lat = r.point.lat;
          that.map.panTo(r.point);
          that.search();
        } else alert("failed" + this.getStatus());
      },
      { enableHighAccuracy: true }
    );
  }
};
</script>
<style lang="less">
#customerMap {
  #Map {
  }
  .el-form {
    .el-form-item {
      margin-bottom: 0px;
      .el-form-item__content {
        display: flex;
      }
    }
  }
}
</style>
