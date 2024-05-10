<template>
  <view id="toast_container" v-show="isShowToast">
    <view class="text">{{ _msg }}</view>
  </view>
</template>
<script lang="ts" setup>
import { onLoad } from "@dcloudio/uni-app";
import { ref, watch } from "vue";
const isShowToast = ref(false);
const _duration = ref(1000);
const _msg = ref("");
onLoad(() => {
  uni.$on("toast", (data: { msg: string; duration: number }) => {
    const { msg, duration } = data;
    isShowToast.value = true;
    _msg.value = msg;
    _duration.value = duration || 1500;
  });
});

watch(
  () => isShowToast.value,
  (show) => {
    if (show) {
      setTimeout(() => {
        isShowToast.value = false;
      }, _duration.value);
    }
  },
);
</script>
<style lang="scss">
#toast_container {
  position: fixed;
  left: 50%;
  bottom: 10%;
  min-width: 100rpx;
  max-width: 90%;
  height: 90rpx;
  line-height: 90rpx;
  transform: translateX(-50%);
  background-color: #fff;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.5);
  border-radius: 15rpx;
  text-align: center;
  animation: fadein 0.5s forwards;
  .text {
    padding: 0 20rpx;
    color: #333;
  }
}
@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
