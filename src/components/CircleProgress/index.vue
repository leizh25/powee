<template>
  <view id="circle_progress" :style="{ width: width, height: width }">
    <canvas id="canvas" canvas-id="canvas"></canvas>
  </view>
</template>
<script lang="ts" setup>
import type { CanvasRectInfo } from "@/types";
import Bluetooth from "@/utils/Ble";
const bt = new Bluetooth();
const query = uni.createSelectorQuery();
const canvasRect = ref<CanvasRectInfo>({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
const ctx = uni.createCanvasContext("canvas");

const props = defineProps({
  width: {
    type: String,
    default: "0",
  },
  height: {
    type: String,
    default: "",
  },
});
/**获取画布尺寸 */
const getCanvasRect = async () => {
  return new Promise((resolve, reject) => {
    query
      .select("#canvas")
      .boundingClientRect((data: any) => {
        canvasRect.value = data;
        resolve(data);
      })
      .exec();
  });
};
onMounted(() => {
  getCanvasRect().then((data: any) => {
    canvasRect.value = data;
    // console.log("canvasRect.value: ", canvasRect.value);
    draw();
  });
});
watch(
  () => bt.socPercent.value,
  (val) => {
    draw(+(val / 100).toFixed(2));
  },
);
const draw = (percent: number = 0) => {
  const { width, height } = canvasRect.value;
  const center = width / 2;
  const lineWidth = (ctx.lineWidth = 18);
  let radius = center - lineWidth / 2;
  ctx.clearRect(0, 0, canvasRect.value.width, canvasRect.value.height);
  if (radius < 0) radius = 0;
  //外圈
  ctx.beginPath();
  ctx.arc(center, center, radius, 0.6 * Math.PI, 0.2 * 2 * Math.PI);
  ctx.setStrokeStyle("#111315");
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();

  //内圈
  ctx.beginPath();
  let color = "#EE731C";
  ctx.setStrokeStyle(color);
  ctx.arc(center, center, radius, 0.6 * Math.PI, (0.6 + 1.8 * percent) * Math.PI);
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.draw();
};
</script>
<style lang="scss">
#circle_progress {
  #canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
