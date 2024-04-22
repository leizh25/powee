<template>
  <view class="board_container content_box_style">
    <view class="header_bar">
      <view class="header_left">
        <IconBox :name="icon" width="48rpx" style="margin-right: 12rpx"></IconBox>
        <view class="text">{{ title }}</view>
      </view>
      <view class="header_right">
        <IconBox name="down_arrow" width="32rpx"></IconBox>
      </view>
    </view>
    <view class="slot_container">
      <slot></slot>
    </view>
  </view>
</template>
<script lang="ts" setup>
defineProps({
  title: { type: String, default: "" },
  icon: { type: String, default: "" },
});
</script>
<style lang="scss">
.board_container {
  width: 100%;
  margin-top: 28rpx;
  padding: 0 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .header_bar {
    height: 116rpx;
    border-bottom: 2rpx solid #3a3d43;
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
}
</style>
