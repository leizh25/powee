<template>
  <view class="icon_box_comp" :style="{ width, height: height ? height : width }">
    <image :src="src ? src : `/static/icons/${name}@2x.png`" class="img" />
  </view>
</template>
<script lang="ts" setup>
defineProps({
  src: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "0",
  },
  height: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss">
.icon_box_comp {
  .img {
    width: 100%;
    height: 100%;
  }
}
</style>
