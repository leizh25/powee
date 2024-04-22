<template>
  <view id="control_page" class="page_container_style">
    <view class="content_block">
      <view class="control_box content_box_style">
        <IconBox src="/static/icons/charge_battery@2x.png" width="90rpx" height="100rpx"></IconBox>
        <view class="control_title">Charge Switch</view>
        <van-switch class="switch" v-model="flag" active-color="#EE731C" inactive-color="#464649" />
      </view>
      <view class="control_box content_box_style">
        <IconBox src="/static/icons/disCharge_battery@2x.png" width="90rpx" height="100rpx"></IconBox>
        <view class="control_title">Discharge Switch</view>
        <van-switch class="switch" v-model="flag" active-color="#EE731C" inactive-color="#464649" />
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
const flag = ref(false);
onNavigationBarButtonTap((opt) => {
  if (opt.index == 0) {
    // 列表按钮
    uni.navigateTo({
      url: "/pages/device/device",
    });
  }
});
</script>
<style lang="scss">
#control_page {
  .content_block {
    padding: 24rpx 30rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .control_box {
      width: 330rpx;
      height: 400rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .control_title {
        font-family: "PingFang SC";
        font-weight: 400;
        font-size: 28rpx;
        color: #ffffff;
        margin: 44rpx 0 32rpx;
      }
      .switch {
        --van-switch-width: 70px;
        --van-switch-height: 32px;
      }
    }
  }
}
</style>
