<template>
  <view id="device_page" class="page_container_style">
    <view v-if="bt.deviceList.value.length">
      <view class="inp_container">
        <view class="icon_container" @click="showLoading">
          <IconBox name="search" width="40rpx"></IconBox>
        </view>
        <input type="text" class="input" v-model="searchText" :placeholder="$t('device.input')" />
      </view>
      <view class="device_conatiner">
        <scroll-view scroll-y class="scroll_view" style="" :show-scrollbar="false">
          <view class="device_box content_box_style" v-for="device in showDeviceList" :key="device.deviceId">
            <view class="left">
              <view class="name">{{ device.localName }}</view>
              <view class="desc">
                <view class="mac">{{ device.deviceId }}</view>
                &nbsp;&nbsp;
                <view class="rssi">RSSI:{{ device.RSSI }}db&nbsp;&nbsp;{{ $t(`device.${device.signalLevel}`) }}</view>
              </view>
            </view>
            <view class="right">
              <IconBox :name="`${device.isConnected === true ? 'disConnect' : 'connect'}`" width="48rpx" @click="connect(device)"></IconBox>
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
        <view class="text">{{ $t("device.no_device") }}</view>
        <view class="btn_box">
          <button class="btn" @click="refresh">{{ $t("device.refresh") }}</button>
        </view>
      </view>
    </view>
  </view>
  <Loading :is-show="isShowLoading"></Loading>
  <Toast></Toast>
</template>
<script lang="ts" setup>
import type { BluetoothDeviceInfo } from "@/types";
import Bluetooth from "@/utils/Ble.ts";
import i18n from "@/locale";
const { t: $t } = i18n.global;
const isShowLoading = ref(false);
const showLoading = () => (isShowLoading.value = !isShowLoading.value);
const bt = new Bluetooth();
const searchText = ref("");
const showDeviceList = ref<BluetoothDeviceInfo[]>([]);
let isConnectting = false;
let page = "";
onNavigationBarButtonTap((opt) => {
  if (opt.index === 0) {
    // 刷新按钮
    refresh();
  } else if (opt.index === 1) {
    console.log("返回按钮");
    if (isShowLoading.value) return;
    uni.switchTab({
      url: `/pages/${page ? page + "/" + page : "dashboard/dashboard"}`,
    });
  }
});
onBackPress((opt) => {
  if (isShowLoading.value) {
    console.log("禁止返回");
    return true;
  }
});
onLoad((e) => {
  showDeviceList.value = bt.deviceList.value;
  page = e?.page;
  if (!page) {
    isShowLoading.value = true;
    Bluetooth.init();
    delayToStop();
  }
});
onShow(() => {});
onHide(() => {
  Bluetooth.stopBluetoothDevicesDiscovery();
});
onUnload(() => {
  isShowLoading.value = false;
  Bluetooth.stopBluetoothDevicesDiscovery();
});
watchEffect(() => {
  const text = searchText.value.trim();
  if (text) {
    showDeviceList.value = bt.deviceList.value.filter((device) => {
      return device.localName.toUpperCase().includes(text.toUpperCase());
    });
  } else {
    showDeviceList.value = bt.deviceList.value;
  }
});
watch(
  () => Bluetooth.canAutoConnect.value,
  (val) => {
    if (val && !isConnectting) {
      console.log("val: ", val);
      console.log("Bluetooth.lastConnectedDevice: ", Bluetooth.lastConnectedDevice);
      connect(Bluetooth.lastConnectedDevice!, false);
    }
  },
  {
    once: true,
  },
);
const refresh = () => {
  uni.$emit("toast", { msg: $t("device.refresh") });
  console.log("刷新");
  bt.deviceList.value = [];
  bt.connectedDevice.value && bt.deviceList.value.push(bt.connectedDevice.value);
  showDeviceList.value = [];
  Bluetooth.init();
  delayToStop();
};
const connect = (device: BluetoothDeviceInfo, isCheckConnected: boolean = true) => {
  console.log("点击device: ", device);
  if (isCheckConnected) {
    if (device.isConnected) {
      Bluetooth.unLink(device);
      Bluetooth.clearPropeerties();
      return;
    }
  }
  isShowLoading.value = true;
  isConnectting = true;
  Bluetooth.connect(device)
    .then((device: BluetoothDeviceInfo) => Bluetooth.getServices(device))
    .then(({ services, device }) => Bluetooth.getCharacteristics(services, device))
    .then(() => {
      console.log("√连接成功: ", device);
      uni.$emit("toast", { msg: $t("device.con_succ") });
      Bluetooth.clearPropeerties();
      Bluetooth.listeningData();
      uni.switchTab({
        url: `/pages/dashboard/dashboard`,
      });
    })
    .catch((err) => {
      const msg = Bluetooth.getBleErrorMsg(err, true);
      console.log("连接失败: ", msg);
      isShowLoading.value = false;
      uni.$emit("toast", { msg: $t("device.con_fail") });
    })
    .finally(() => {
      isShowLoading.value = false;
      isConnectting = false;
    });
};
const delayToStop = () => {
  setTimeout(() => {
    !isConnectting && (isShowLoading.value = false);
    Bluetooth.stopBluetoothDevicesDiscovery();
  }, 5000);
};
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
