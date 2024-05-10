<template>
  <view id="parameter_page" class="page_container_style">
    <scroll-view scroll-y style="height: 100%" :show-scrollbar="false">
      <view class="content_block">
        <view class="name_container content_box_style">
          <view class="param_title">{{ $t("param.name") }}</view>
          <view class="ble_name">{{ bt.connectedDevice.value?.localName }}</view>
          <view class="set_box">
            <input class="input" v-model="newName" />
            <button class="set_btn" @click="setName">SET</button>
          </view>
        </view>
        <view class="info_container content_box_style">
          <view class="param_box">
            <view class="param_title">{{ $t("param.bar_code") }}</view>
            <view class="param_value">{{ bt.barCode.value }}</view>
          </view>
          <view class="param_box" v-show="bt.isNewVersion.value">
            <view class="param_title">{{ $t("param.device_model") }}</view>
            <view class="param_value">{{ bt.batteryModel.value }}</view>
          </view>
          <view class="param_box">
            <view class="param_title">{{ $t("param.manufacturer") }}</view>
            <view class="param_value">{{ bt.manufacturer.value }}</view>
          </view>
          <view class="param_box">
            <view class="param_title">{{ $t("param.version") }}</view>
            <view class="param_value">{{ bt.softwareVersion.value }}</view>
          </view>
          <view class="param_box" v-show="bt.isNewVersion.value">
            <view class="param_title">{{ $t("param.bms_model") }}</view>
            <view class="param_value">{{ bt.BMSModel.value }}</view>
          </view>
          <view class="param_box">
            <view class="param_title">{{ $t("param.pro_date") }}</view>
            <view class="param_value">{{ bt.productionDate.value }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
    <Toast></Toast>
  </view>
</template>
<script lang="ts" setup>
import Bluetooth from "@/utils/Ble";
import i18n from "@/locale";
const { t: $t } = i18n.global;
const bt = new Bluetooth();
const newName = ref("");
let getDataTimer = 0;
let stopGetDataTimer = 0;
onNavigationBarButtonTap((opt) => {
  if (opt.index == 0) {
    // 列表按钮
    uni.navigateTo({
      url: "/pages/device/device?page=parameter",
    });
  }
});
onLoad(() => {});
onShow(() => {
  bt.isGotBarCode.value = false;
  bt.isGotManufacturer.value = false;
  if (!bt.isConnected.value) return;
  let getDeviceModelTimes = 0;
  getDataTimer = setInterval(() => {
    if (!bt.isEnterFactory.value && !bt.isNewVersion.value) {
      Bluetooth.enterFactoryMode();
      return;
    }
    if (!bt.isGotBarCode.value) {
      Bluetooth.writeGetBarCodeCmd();
      return;
    }
    if (!bt.isGotManufacturer.value) {
      Bluetooth.writeGetManufacturerInfoCmd();
      return;
    }
    if (bt.isNewVersion.value) {
      if (!bt.isGotBatteryModel.value) {
        if (getDeviceModelTimes++ >= 5) return (bt.isGotBatteryModel.value = true);
        Bluetooth.writeGetBatteryModelCmd();
      }
      if (!bt.isGotBMSModel.value) {
        Bluetooth.writeGetBMSModelCmd();
        return;
      }
    }
    if (bt.isEnterFactory.value && !bt.isNewVersion.value) {
      Bluetooth.exitFactoryMode();
    }
    clearInterval(getDataTimer);
  }, 300);
  stopGetDataTimer = setTimeout(() => {
    clearInterval(getDataTimer);
    clearTimeout(stopGetDataTimer);
  }, 10000);
});
onHide(() => {
  clearInterval(getDataTimer);
  clearTimeout(stopGetDataTimer);
});

const setName = () => {
  if (!newName.value.trim()) {
    return uni.$emit("toast", { msg: $t("param.required_name") });
  } else if (newName.value.trim().length > 22) {
    uni.$emit("toast", { msg: $t("param.name_too_long") });
  }
  bt.setNameSuccess.value = false;
  Bluetooth.SetName(newName.value.trim());
};
watch(
  () => bt.setNameSuccess.value,
  (val) => {
    if (val) {
      console.log("设置名称成功: ", val);
      uni.$emit("toast", { msg: $t("param.set_name_success") });
      bt.connectedDevice.value!.localName = newName.value;
      newName.value = "";
    }
  },
);
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
