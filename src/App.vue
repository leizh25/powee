<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import Bluetooth from "./utils/Ble";
onLaunch(() => {
  console.log("App Launch");
  nextTick(() => {
    new Bluetooth();
    // Bluetooth.init();
    console.log("new Bluetooth");
    Bluetooth.lastConnectedDevice = uni.getStorageSync("currentDevice") || null;
    console.log("Bluetooth.lastConnectedDevice: ", Bluetooth.lastConnectedDevice);
  });
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss"></style>
