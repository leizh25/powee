<template>
  <view id="parameter_page" class="page_container_style">
    <scroll-view scroll-y style="height: 100%" :show-scrollbar="false">
      <view class="content_block">
        <view class="name_container content_box_style">
          <view class="param_title">Bluetooth name</view>
          <view class="ble_name">JL-12100-16800001</view>
          <view class="set_box">
            <input class="input" />
            <button class="set_btn">SET</button>
          </view>
        </view>
        <view class="info_container content_box_style">
          <view class="param_box">
            <view class="param_title">Bar code</view>
            <view class="param_value">JL-12100-16800001</view>
          </view>
          <view class="param_box">
            <view class="param_title">Device model</view>
            <view class="param_value">SP14S004P14S50A</view>
          </view>
          <view class="param_box">
            <view class="param_title">Manufacturer</view>
            <view class="param_value">DGJBD</view>
          </view>
          <view class="param_box">
            <view class="param_title">Version</view>
            <view class="param_value">2.9</view>
          </view>
          <view class="param_box">
            <view class="param_title">BMS Model</view>
            <view class="param_value">SP14S004 V1.0</view>
          </view>
          <view class="param_box">
            <view class="param_title">Production date</view>
            <view class="param_value">2024-02-221</view>
          </view>
          <view class="param_box">
            <view class="param_title">BMS ID</view>
            <view class="param_value">000000000000000000000000</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts" setup>
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
@mixin param_title {
  font-family: "PingFang SC";
  font-weight: 400;
  font-size: 28rpx;
  color: #bfcdd4;
}
#parameter_page {
  box-sizing: border-box;
  // background: linear-gradient(143deg, #17191d 0%, #2c3137 100%);
  .content_block {
    padding: 28rpx 30rpx;
    box-sizing: border-box;
    .name_container {
      height: 260rpx;
      padding-left: 38rpx;
      box-sizing: border-box;
      margin-bottom: 28rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .param_title {
        @include param_title;
      }
      .ble_name {
        font-family: "PingFang SC";
        font-weight: 400;
        font-size: 36rpx;
        color: #ffffff;
        margin-top: 12rpx;
        margin-bottom: 18rpx;
      }
      .set_box {
        display: flex;
        align-items: center;
        padding-right: 38rpx;
        box-sizing: border-box;
        .input {
          // width: 400rpx;
          flex: 1;
          height: 72rpx;
          color: #fff;
          padding-left: 22rpx;
          font-family: "PingFang SC";
          border-radius: 8rpx 8rpx 8rpx 8rpx;
          border: 1rpx solid rgba(255, 255, 255, 0.5);
          margin-right: 28rpx;
          &:focus {
            border-color: #ee731c;
            background-color: #fff;
          }
        }

        .set_btn {
          width: 172rpx;
          height: 72rpx;
          line-height: 72rpx;
          text-align: center;
          font-family: "PingFang SC";
          font-weight: 400;
          font-size: 28rpx;
          color: #ffffff;
          background: #ee731c;
          border-radius: 12rpx;
        }
      }
    }
    .info_container {
      height: 754rpx;
      padding: 0 32rpx;
      padding-top: 10rpx;
      box-sizing: border-box;
      .param_box {
        height: 106rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2rpx solid rgba(255, 255, 255, 0.1);
        box-sizing: border-box;
        &:last-child {
          border-bottom: none;
        }
        .param_title {
          @include param_title;
        }
        .param_value {
          font-family: "PingFang SC";
          font-weight: 400;
          font-size: 28rpx;
          color: #ee731c;
        }
      }
    }
  }
}
</style>
