<template>
  <view id="dashboard_page" class="page_container_style">
    <scroll-view scroll-y style="height: 100%">
      <view class="content_block">
        <!-- 设备名 -->
        <view class="device_name">{{ bt.connectedDevice.value?.localName }}</view>
        <!-- 剩余容量和时间 -->
        <!-- <view class="remaining_container"> -->

        <view class="remaining_container" v-show="bt.current.value !== 0">
          <!-- <view class="remaining_box capacity">
            <IconBox name="remaining_capacity" width="40rpx"></IconBox>
            <view class="remaining_value_box">
              <view class="remaining_value">{{ bt.nominalCapacity.value }} AH</view>
              <view class="remaining_type">{{ $t("dashboard.nominal") }}</view>
            </view>
          </view> -->
          <!-- v-show="bt.current.value !== 0" -->
          <view class="remaining_box capacity">
            <IconBox name="estimate" width="40rpx"></IconBox>
            <view class="remaining_value_box">
              <view class="remaining_value">{{ bt.chargeOrDischargeTime.value }}</view>
              <view class="remaining_type" v-show="bt.current.value > 0">{{ $t("dashboard.est_c_time") }}</view>
              <view class="remaining_type" v-show="bt.current.value < 0">{{ $t("dashboard.est_d_time") }}</view>
            </view>
          </view>
        </view>
        <!-- SOC展示 -->
        <view class="soc_container">
          <view class="canvas_container">
            <view class="canvas_box">
              <view class="desc_box">
                <view class="soc_txt">{{ $t("dashboard.soc") }}</view>
                <view class="value">{{ bt.socPercent }}<text class="text">%</text></view>
              </view>
              <view class="circle_box">
                <CircleProgress width="360rpx"></CircleProgress>
              </view>
            </view>
          </view>
          <view class="switchs_status_container">
            <view class="status_box">
              <view class="status_name">{{ $t("dashboard.chg_mos") }}:</view>
              <view class="status_value" :class="{ active: bt.chargeSwitchStatus.value }">{{
                bt.chargeSwitchStatus.value ? $t("dashboard.on") : $t("dashboard.off")
              }}</view>
            </view>
            <view class="status_box">
              <view class="status_name">{{ $t("dashboard.dis_mos") }}:</view>
              <view class="status_value" :class="{ active: bt.dischargeSwitchStatus.value }">{{
                bt.dischargeSwitchStatus.value ? $t("dashboard.on") : $t("dashboard.off")
              }}</view>
            </view>
            <view class="status_box">
              <view class="status_name">{{ $t("dashboard.balance") }}:</view>
              <view class="status_value" :class="{ active: bt.equilibriumState.value }">{{
                bt.equilibriumState.value ? $t("dashboard.on") : $t("dashboard.off")
              }}</view>
            </view>
            <view class="status_box">
              <view class="status_name">{{ $t("dashboard.protection") }}:</view>
              <view class="status_value" :class="{ active: bt.protectionState.value }">{{
                bt.protectionState.value ? $t("dashboard.on") : $t("dashboard.off")
              }}</view>
            </view>
          </view>
        </view>
        <!-- 数据展示列 -->
        <view class="data_column_container">
          <view class="data_column">
            <view class="data_value">{{ bt.remainingCapacity.value }} AH</view>
            <view class="data_key">{{ $t("dashboard.remaining_capacity") }}</view>
          </view>
          <view class="data_column">
            <view class="data_value">{{ bt.totalVoltage.value }} V</view>
            <view class="data_key">{{ $t("dashboard.total_voltage") }}</view>
          </view>
          <view class="data_column">
            <view class="data_value">{{ bt.current.value }} A</view>
            <view class="data_key">{{ $t("dashboard.current") }}</view>
          </view>
        </view>
        <!-- 数据展示表格 -->
        <view class="data_table_container">
          <view class="data_box content_box_style">
            <IconBox name="max_v" width="28rpx" class="icon_box"></IconBox>
            <view class="value">{{ bt.maxVoltage.value }} V</view>
            <view class="name">{{ $t("dashboard.max_voltage") }}</view>
          </view>
          <view class="data_box content_box_style">
            <IconBox name="min_v" width="28rpx" class="icon_box"></IconBox>
            <view class="value">{{ bt.minVoltage.value }} V</view>
            <view class="name">{{ $t("dashboard.min_voltage") }}</view>
          </view>
          <view class="data_box content_box_style">
            <IconBox name="power" width="28rpx" class="icon_box"></IconBox>
            <view class="value">{{ bt.power.value }} W</view>
            <view class="name">{{ $t("dashboard.power") }}</view>
          </view>
          <view class="data_box content_box_style">
            <IconBox name="avg" width="28rpx" class="icon_box"></IconBox>
            <view class="value">{{ bt.averageVoltage.value }} V</view>
            <view class="name">{{ $t("dashboard.averageVoltage") }}</view>
          </view>
          <view class="data_box content_box_style">
            <IconBox name="diff_v" width="28rpx" class="icon_box"></IconBox>
            <view class="value">{{ bt.voltageDifference.value }} V</view>
            <view class="name">{{ $t("dashboard.voltageDifference") }}</view>
          </view>
          <view class="data_box content_box_style">
            <IconBox name="cycle" width="28rpx" class="icon_box"></IconBox>
            <view class="value">{{ bt.loopCount.value }}</view>
            <view class="name">{{ $t("dashboard.loopCount") }}</view>
          </view>
        </view>
        <!-- 温度 -->
        <TitleBoard :title="$t('dashboard.temperature')" icon="temp" class="temp_container" contentHeight="178rpx">
          <view class="temp_box">
            <view class="row">
              <view class="name">{{ $t("dashboard.bat") }}</view>
              <view class="value">{{ bt.temperatures.value[0] }}℃</view>
            </view>
            <view class="row">
              <view class="name">{{ $t("dashboard.bms") }}</view>
              <view class="value">{{ bt.temperatures.value[1] }}℃</view>
            </view>
          </view>
        </TitleBoard>
        <!-- 单体电压 -->
        <TitleBoard
          :title="$t('dashboard.cellVoltage')"
          icon="battery"
          class="cell_voltage_container"
          :contentHeight="Math.ceil(bt.voltageList.value.length / 4) * 130 + 80 + 'rpx'"
        >
          <view class="cells_container" v-if="bt.voltageList.value.length">
            <view class="place_block" v-for="(item, index) in bt.voltageList.value" :key="index">
              <view class="ccell_box">
                <view class="icon_bg">
                  <view class="color_fill" :style="{ width: 100 * (item / 3.75) + 'rpx' }"></view>
                  <view class="cell_no">{{ $t("dashboard.cell") }} {{ index + 1 }}</view>
                </view>
                <view class="value">{{ item }}v</view>
              </view>
            </view>
          </view>
        </TitleBoard>
      </view>
    </scroll-view>
    <Loading :is-show="isShowLoading"></Loading>
    <Toast></Toast>
  </view>
</template>
<script lang="ts" setup>
import Bluetooth from "@/utils/Ble";
import i18n from "@/locale";
const { t: $t } = i18n.global;
const isShowLoading = ref(false);
const bt = new Bluetooth();
/**获取基本数据定时器 */
let getBaseDataTimer = 0;
/**判断是否获取数据定时器 */
let isGetBaseDataTimer = 0;
let getDataTimer = 0;
let getDataTimer2 = 0;
let isGettingData = false;
let isBreak = false;
// 后台获取数据定时器
onNavigationBarButtonTap((opt) => {
  if (opt.index == 0) {
    // 列表按钮
    uni.navigateTo({
      url: "/pages/device/device?page=dashboard",
    });
  }
});
onLoad(() => {
  if (!bt.isConnected.value) return;
  Bluetooth.listeningData();
});
onShow(() => {
  console.log("bt.isConnected.value: ", bt.isConnected.value);
  if (!bt.isConnected.value) {
    uni.$emit("toast", { msg: $t("dashboard.nodevice") });
    isShowLoading.value = false;
    clearInterval(getBaseDataTimer);
    return;
  }
  if (isGettingData) return;
  isShowLoading.value = true;
  bt.isGotBaseData.value = false;
  bt.isGotVoltageList.value = false;
  isGettingData = true;
  getDataTimer = setInterval(() => {
    if (!bt.isGotBaseData.value) {
      Bluetooth.writeGetBaseDataCmd();
      return;
    }
    if (!bt.isGotVoltageList.value) {
      Bluetooth.writeGetCellVoltagesCmd();
      return;
    }
    isShowLoading.value = false;
    isGettingData = false;
    clearInterval(getDataTimer);
    clearTimeout(isGetBaseDataTimer);
    isBreak = false;
    getData();
  }, 500);
  isGetBaseDataTimer = setTimeout(() => {
    if (!bt.isGotBaseData.value) {
      uni.$emit("toast", { msg: $t("dashboard.getDataFail") });
      clearInterval(isGetBaseDataTimer);
      setTimeout(() => uni.navigateTo({ url: "/pages/device/device" }), 500);
    }
  }, 10000);
});

onHide(() => {
  clearInterval(getBaseDataTimer);
  clearTimeout(isGetBaseDataTimer);
  isBreak = true;
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const getData = async () => {
  while (!isBreak) {
    await sleep(2000);
    Bluetooth.writeGetBaseDataCmd();
    await sleep(2000);
    Bluetooth.writeGetCellVoltagesCmd();
  }
};
</script>
<style lang="scss">
@import "./style.scss";
</style>
