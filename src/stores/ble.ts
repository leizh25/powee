import type { BleStore } from "@/types";
import { defineStore } from "pinia";

export const useBleStore = defineStore("ble", {
  state: (): BleStore => {
    return {
      deviceList: [],
      connectedDevice: null,
      isConnected: false,
    };
  },
  actions: {},
});
