<template>
  <view class="board_container content_box_style">
    <view class="header_bar">
      <view class="header_left">
        <IconBox :name="icon" width="48rpx" style="margin-right: 12rpx"></IconBox>
        <view class="text">{{ title }}</view>
      </view>
      <view class="header_right">
        <IconBox
          name="down_arrow"
          width="32rpx"
          @click="collapsed = !collapsed"
          :style="{ transform: collapsed ? '' : 'rotate(180deg)' }"
          style="transition: all 0.3s"
        ></IconBox>
      </view>
    </view>
    <view class="slot_container" :style="{ height: collapsed ? '0' : contentHeight }" style="transition: height 0.3s ease">
      <slot></slot>
    </view>
  </view>
</template>
<script lang="ts" setup>
const collapsed = ref(true);
defineProps({
  title: { type: String, default: "" },
  icon: { type: String, default: "" },
  contentHeight: { type: String, default: "auto" },
});
</script>
<style lang="scss">
.board_container {
  width: 100%;
  height: auto;
  margin-top: 28rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: height 1s ease;
  overflow: hidden;
  .header_bar {
    height: 116rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header_left {
      display: flex;
      align-items: center;
      .text {
        font-family: "PingFang SC";
        font-weight: 400;
        font-size: 28rpx;
        color: #ebebf5;
      }
    }
  }
  .slot_container {
    transition: all 1s ease;
  }
}
</style>
