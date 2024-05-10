/**画布布局 */
export interface CanvasRectInfo {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
}
/**自定义蓝牙设备 */
export interface BluetoothDeviceInfo extends UniApp.BluetoothDeviceInfo {
  [key: string]: any;
  /**信号等级 */
  signalLevel?: number | string;
  /**蓝牙设备地址 */
  macAddr?: string;
  /**是否已连接 */
  isConnected?: boolean;
}

/**蓝牙仓库 */
export interface BleStore {
  /**设备列表 */
  deviceList: BluetoothDeviceInfo[];
  /**已连接设备 */
  connectedDevice: BluetoothDeviceInfo | null;
  /**是否已连接 */
  isConnected: boolean;
}
