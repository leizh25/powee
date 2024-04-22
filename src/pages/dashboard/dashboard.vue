<template>
  <view id="dashboard_page" class="page_container_style">
    <scroll-view scroll-y style="height: 100%">
      <view class="content_block">
        <!-- 设备名 -->
        <view class="device_name">CWW-LFP12150S-CWA000001</view>
        <!-- 剩余容量和时间 -->
        <view class="remaining_container">
          <view class="remaining_box capacity">
            <IconBox name="remaining_capacity" width="40rpx"></IconBox>
            <view class="remaining_value_box">
              <view class="remaining_value">3.51 AH</view>
              <view class="remaining_type">Remaining capacity</view>
            </view>
          </view>
          <view class="remaining_box capacity">
            <IconBox name="estimate" width="40rpx"></IconBox>
            <view class="remaining_value_box">
              <view class="remaining_value">2H:30 M</view>
              <view class="remaining_type">Estimate full time</view>
            </view>
          </view>
        </view>
        <!-- SOC展示 -->
        <view class="soc_container">
          <view class="canvas_container">
            <view class="canvas_box">
              <CircleProgress width="360rpx" :percent="0.7"></CircleProgress>
            </view>
          </view>
          <view class="switchs_status_container">
            <view class="status_box">
              <view class="status_name">ChgMos:</view>
              <view class="status_value">OFF</view>
            </view>
            <view class="status_box">
              <view class="status_name">DisMos:</view>
              <view class="status_value">OFF</view>
            </view>
            <view class="status_box">
              <view class="status_name">Balance:</view>
              <view class="status_value active">ON</view>
            </view>
            <view class="status_box">
              <view class="status_name">Protection:</view>
              <view class="status_value">OFF</view>
            </view>
          </view>
        </view>
        <!-- 数据展示列 -->
        <view class="data_column_container">
          <view class="data_column">
            <view class="data_value">3.41 AH</view>
            <view class="data_key">Remaining capacity</view>
          </view>
          <view class="data_column">
            <view class="data_value">23.08 V</view>
            <view class="data_key">ToalVolt</view>
          </view>
          <view class="data_column">
            <view class="data_value">0.00 A</view>
            <view class="data_key">Electric</view>
          </view>
        </view>
        <!-- 数据展示表格 -->
        <view class="data_table_container">
          <view class="data_box content_box_style">
            <IconBox name="max_v" width="28rpx" class="icon_box"></IconBox>
            <view class="value">3.302 V</view>
            <view class="name">Max Voltage</view>
          </view>
          <view class="data_box content_box_style">
            <IconBox name="min_v" width="28rpx" class="icon_box"></IconBox>
            <view class="value">3.009 V</view>
            <view class="name">VolLow</view>
          </view>
          <view class="data_box content_box_style">
            <IconBox name="power" width="28rpx" class="icon_box"></IconBox>
            <view class="value">0.00 W</view>
            <view class="name">Power</view>
          </view>
          <view class="data_box content_box_style">
            <IconBox name="avg" width="28rpx" class="icon_box"></IconBox>
            <view class="value">3.301 V</view>
            <view class="name">AveVol</view>
          </view>
          <view class="data_box content_box_style">
            <IconBox name="diff_v" width="28rpx" class="icon_box"></IconBox>
            <view class="value">0.003 V</view>
            <view class="name">PressureDiff</view>
          </view>
          <view class="data_box content_box_style">
            <IconBox name="cycle" width="28rpx" class="icon_box"></IconBox>
            <view class="value">0</view>
            <view class="name">Cycle-Index</view>
          </view>
        </view>
        <!-- 温度 -->
        <TitleBoard title="Temperature" icon="temp" class="temp_container">
          <view class="temp_box">
            <view class="row">
              <view class="name">BAT</view>
              <view class="value">18.1℃</view>
            </view>
            <view class="row">
              <view class="name">BMS</view>
              <view class="value">18.1℃</view>
            </view>
          </view>
        </TitleBoard>
        <!-- 单体电压 -->
        <TitleBoard title="Cell Voltage" icon="battery" class="cell_voltage_container">
          <view class="cells_container">
            <view class="place_block" v-for="(item, index) in 12" :key="index">
              <view class="ccell_box">
                <view class="icon_bg">
                  <view class="color_fill"></view>
                  <view class="cell_no">Cell {{ index }}</view>
                </view>
                <view class="value">3.412v</view>
              </view>
            </view>
          </view>
        </TitleBoard>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts" setup>
import TitleBoard from "@/components/TitleBoard/index.vue";
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
@import "./style.scss";
</style>
