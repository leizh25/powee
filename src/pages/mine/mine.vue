<template>
  <view id="mine_page" class="page_container_style">
    <view class="icon_container">
      <IconBox name="app_icon" width="200rpx" class="app_icon_box"></IconBox>
      <view class="version font_color_style">Version:1.0</view>
    </view>
    <view class="info_container">
      <view class="info_box content_box_style" @click="webHandle">
        <IconBox name="web" width="44rpx" class="icon_box"></IconBox>
        <text class="text font_color_style">www.powee.fr</text>
      </view>
      <view class="info_box content_box_style" @click="emailHandle">
        <IconBox name="envelope" width="44rpx" class="icon_box"></IconBox>
        <text class="text font_color_style">contact@powee.fr</text>
      </view>
      <view class="info_box content_box_style" @click="callHandle">
        <IconBox name="phone" width="44rpx" class="icon_box"></IconBox>
        <text class="text font_color_style">0610086824</text>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
const callHandle = () => {
  uni.makePhoneCall({
    phoneNumber: "0610086824",
  });
};
const emailHandle = () => {
  uni.setClipboardData({
    data: "contact@powee.fr",
    success: () => {
      uni.showToast({
        title: "cpoied",
        icon: "none",
      });
    },
  });
};
const webHandle = () => {
  plus.runtime.openURL("https://www.powee.fr");
};
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
#mine_page {
  .icon_container {
    height: 400rpx;
    padding-top: 100rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    .app_icon_box {
      margin-bottom: 12rpx;
    }
    .version {
      font-family: Arial;
      font-weight: 400;
      font-size: 32rpx;
    }
  }
  .info_container {
    box-sizing: border-box;
    padding: 0 30rpx;
    .info_box {
      height: 108rpx;
      display: flex;
      align-items: center;
      margin-bottom: 28rpx;
      .icon_box {
        margin-left: 50rpx;
        margin-right: 32rpx;
      }
      .text {
        font-family: "PingFang SC";
        font-weight: 400;
        font-size: 28rpx;
      }
    }
  }
}
</style>
