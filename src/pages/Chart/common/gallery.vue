<template>
  <transition name="el-fade-in-linear">
    <div v-if="galleryModal" id="gallery">
      <div class="Curtain" @click="close"></div>
      <el-carousel
        class="gallery"
        :interval="0"
        :autoplay="new Boolean(false)"
        :loop="new Boolean(false)"
        :initial-index="galleryIndex"
      >
        <el-carousel-item
          v-for="(item,index) in record.list"
          :key="index"
          v-if="item.type == 2 || item.msg_type == 2"
        >
          <img :src="item.content">
        </el-carousel-item>
      </el-carousel>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "gallery",
  data() {
    return {};
  },
  props: {
    galleryIndex: Number,
    record: Object
  },
  methods: {
    close() {
      this.$store.commit("changeModal", "galleryModal");
    }
  },
  computed: mapState(["galleryModal"])
};
</script>
<style lang="less">
#gallery {
}
</style>
