<template>
  <view id="device_page" class="page_container_style">
    <view v-if="true">
      <view class="inp_container">
        <view class="icon_container" @click="showLoading">
          <IconBox name="search" width="40rpx"></IconBox>
        </view>
        <input type="text" class="input" placeholder="Please Input Filter Name" />
      </view>
      <view class="device_conatiner">
        <scroll-view scroll-y class="scroll_view" style="" :show-scrollbar="false">
          <view class="device_box content_box_style" v-for="i in 10" :key="i">
            <view class="left">
              <view class="name">JL-12100-16800001</view>
              <view class="desc">
                <view class="mac">A4:C1:37:10:31:08</view>
                <view class="rssi">RSS1:-43db Strong</view>
              </view>
            </view>
            <view class="right">
              <IconBox :name="`${i % 2 === 0 ? 'disConnect' : 'connect'}`" width="48rpx"></IconBox>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <view v-else>
      <view class="no_device_container">
        <view class="img_box">
          <IconBox name="no_device" width="420rpx" height="395rpx"></IconBox>
        </view>
        <view class="text">No devices</view>
        <view class="btn_box">
          <button class="btn">Refresh</button>
        </view>
      </view>
    </view>
  </view>
  <Loading :is-show="isShowLoading"></Loading>
</template>
<script lang="ts" setup>
const isShowLoading = ref(false);
const showLoading = () => (isShowLoading.value = !isShowLoading.value);

onNavigationBarButtonTap((opt) => {
  if (opt.index === 0) {
    // 刷新按钮
    isShowLoading.value = false;
    console.log("刷新");
  }
});
onBackPress((opt) => {
  if (opt.from === "backbutton" && isShowLoading.value) {
    console.log("禁止返回");
    return true;
  }
});
</script>
<style lang="scss">
#device_page {
  padding: 30rpx;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  // #region
  .inp_container {
    width: 100%;
    height: 72rpx;
    background-color: #fff;
    border-radius: 60rpx;
    display: flex;
    .icon_container {
      width: 98rpx;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .input {
      flex: 1;
      height: 100%;
      font-family: "PingFang SC";
      font-size: 28rpx;
      font-weight: 400;
      &::placeholder {
        color: #aaaaaa;
      }
    }
  }
  .device_conatiner {
    width: 100%;
    flex: 1;
    margin-top: 36rpx;
    .scroll_view {
      height: calc(100vh - var(--window-top) - var(--status-bar-height) - 72rpx);
      padding-bottom: 10rpx;
      box-sizing: border-box;
      // height: 1400rpx;
    }
    .device_box {
      width: 100%;
      height: 148rpx;
      padding: 0 38rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: "PingFang SC";
      font-weight: 400;
      margin-bottom: 28rpx;
      .left {
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .name {
          font-size: 30rpx;
        }
        .desc {
          font-size: 24rpx;
          display: flex;
          font-size: 24rpx;
          color: #9f9f9f;
        }
      }
    }
  }
  // #endregion
  .no_device_container {
    width: 100%;
    .img_box {
      margin-top: 168rpx;
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .text {
      font-family: "PingFang SC";
      font-weight: 400;
      font-size: 32rpx;
      color: #9ca1a3;
      text-align: center;
      line-height: 50rpx;
    }
    .btn_box {
      margin-top: 110rpx;
      display: flex;
      justify-content: center;
      .btn {
        width: 420rpx;
        height: 104rpx;
        line-height: 104rpx;
        background: #ee731c;
        border-radius: 160rpx;
        font-family: "Archivo";
        font-weight: 700;
        font-size: 32rpx;
        color: #ffffff;
      }
    }
  }
}
</style>
