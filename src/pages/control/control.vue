<template>
  <view id="control_page" class="page_container_style">
    <view class="content_block">
      <view class="control_box content_box_style">
        <IconBox src="/static/icons/charge_battery@2x.png" width="90rpx" height="100rpx"></IconBox>
        <view class="control_title">{{ $t("control.chargeSwitch") }}</view>
        <van-switch @change="handleChargeSwitch" class="switch" v-model="bt.chargeSwitchStatus.value" active-color="#EE731C" inactive-color="#464649" />
      </view>
      <view class="control_box content_box_style">
        <IconBox src="/static/icons/disCharge_battery@2x.png" width="90rpx" height="100rpx"></IconBox>
        <view class="control_title">{{ $t("control.disChargeSwitch") }}</view>
        <van-switch @change="handleDisChargeSwitch" class="switch" v-model="bt.dischargeSwitchStatus.value" active-color="#EE731C" inactive-color="#464649" />
      </view>
    </view>
    <Toast></Toast>
  </view>
</template>
<script lang="ts" setup>
import Bluetooth from "@/utils/Ble";
const bt = new Bluetooth();
const flag = ref(false);
onNavigationBarButtonTap((opt) => {
  if (opt.index == 0) {
    // 列表按钮
    uni.navigateTo({
      url: "/pages/device/device?page=control",
    });
  }
});
let opt: { index: number; flag: boolean };
/**充电开关 */
const handleChargeSwitch = (flag: boolean) => {
  console.log("充电开关");
  opt = { index: 0, flag };
  bt.disOrChargeSwitchResponse.value = 2;
  Bluetooth.handleChargeSwitch(flag);
};
/**放电开关 */
const handleDisChargeSwitch = (flag: boolean) => {
  console.log("放电开关");
  opt = { index: 1, flag };
  bt.disOrChargeSwitchResponse.value = 2;
  Bluetooth.handleDischargingChange(flag);
};
watch(
  () => bt.disOrChargeSwitchResponse.value,
  (val) => {
    if (val == 1) {
      if (opt.index === 0) {
        bt.chargeSwitchStatus.value = opt.flag;
      } else {
        bt.dischargeSwitchStatus.value = opt.flag;
      }
      uni.$emit("toast", { msg: "operate successful" });
    } else if (val == 0) {
      uni.$emit("toast", { msg: "operate failed" });
    }
  },
);
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
