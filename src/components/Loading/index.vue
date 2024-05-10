<template>
  <view id="loading_container" v-show="isShow">
    <view class="loading_box">
      <IconBox name="loading" width="100rpx" class="icon_box"></IconBox>
      <view class="text">{{ $t("loading.text") }}</view>
    </view>
  </view>
</template>
<script lang="ts" setup>
const props = defineProps({
  isShow: { type: Boolean, default: false },
});
</script>
<style lang="scss">
#loading_container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff25;
  animation: fade 0.2s linear forwards;

  .loading_box {
    width: 400rpx;
    height: 240rpx;
    padding: 42rpx 0;
    padding-bottom: 30rpx;
    box-sizing: border-box;
    background: #38383a;
    border-radius: 21rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    transform: translate(-50%, -50%);
    animation: scale 0.2s linear forwards;

    .icon_box {
      width: 100rpx;
      height: 100rpx;
      animation: rotate 1s linear infinite;
    }
    .text {
      font-family: "PingFang SC";
      font-weight: 400;
      font-size: 34rpx;
      color: #ee731c;
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes scale {
  0% {
    transform: scale(0.8);
  }
  100% {
    transform: scale(1);
  }
}
</style>
