import type { BluetoothDeviceInfo } from "@/types";
/**
 * @ Author: Lei Zhuzheng
 * @ Create Time: 2024-04-22 15:58:00
 * @ Modified by: Your name
 * @ Modified time: 2024-04-24 09:10:20
 * @ Description:蓝牙类
 */
export default class Bluetooth {
  [key: string]: any;
  static INSTANCE: Bluetooth | null = null;
  constructor() {
    if (!Bluetooth.INSTANCE) {
      Bluetooth.INSTANCE = this;
      // Bluetooth.init();
    }
    return Bluetooth.INSTANCE;
  }
  static getInstance() {
    if (!Bluetooth.INSTANCE) {
      Bluetooth.INSTANCE = new Bluetooth();
    }
    return Bluetooth.INSTANCE;
  }
  private static readonly SERVICE_UUID = "0000FF00-0000-1000-8000-00805F9B34FB";
  private static readonly WRITE_UUID = "0000FF02-0000-1000-8000-00805F9B34FB";
  private static readonly READ_UUID = "0000FF01-0000-1000-8000-00805F9B34FB";
  private static readonly ErrMsgs: { [key: string]: string } = {
    "0": "正常",
    "-1": "已连接",
    "10000": "未初始化蓝牙适配器",
    "10001": "当前蓝牙适配器不可用",
    "10002": "没有找到指定设备",
    "10003": "连接失败",
    "10004": "没有找到指定服务",
    "10005": "没有找到指定特征",
    "10006": "当前连接已断开",
    "10007": "当前特征不支持此操作",
    "10008": "其余所有系统上报的异常",
    "10009": "Android 系统特有，系统版本低于 4.3 不支持 BLE",
    "10012": "连接超时",
    "10013": "为空或者是格式不正确",
  };
  /**已发现的设备列表 */
  deviceList = ref<BluetoothDeviceInfo[]>([]);
  /**已连接的设备 */
  connectedDevice = ref<BluetoothDeviceInfo | null>(null);
  /**是否已连接 */
  isConnected = ref(false);
  /**读取到的值 */
  // readValue: number[] = [];
  /**是否获得基本数据 */
  isGotBaseData = ref(false);

  // #region 基本数据 0x03
  /**总电压 单位V */
  totalVoltage = ref(0);
  /**总电流 单位A */
  current = ref(0);
  /**功率 */
  power = ref(0);
  /**SOC圆环  单位百分比 */
  socPercent = ref(0);
  /**剩余容量 */
  remainingCapacity = ref(0);
  /**标称容量 */
  nominalCapacity = ref(0);
  /**充电开关状态 */
  chargeSwitchStatus = ref(false);
  /**放电开关状态 */
  dischargeSwitchStatus = ref(false);
  /**温度 */
  temperatures = ref<number[]>([]);
  /**循环次数 */
  loopCount = ref(0);
  /**生产日期 */
  productionDate = ref("");
  /**BMS软件版本 */
  softwareVersion = ref("");
  /**是否新版本 */
  isNewVersion = ref(false);
  /**充放电时间 */
  chargeOrDischargeTime = ref("");
  /**均衡状态 */
  equilibriumState = ref(false);
  /**保护状态 */
  protectionState = ref(false);
  // #endregion

  // #region 硬件版本 0x05
  /**BMS硬件版本 */
  hardwareVersion = ref("");
  isGotHardwareVersion = ref(false);
  // #endregion

  // #region 充放电开关响应 0xe1
  /**
   * 充放电开关响应
   * - 应手动修改,且发送指令前置2
   * - 0:响应失败  1:响应成功 2:未响应
   */
  disOrChargeSwitchResponse = ref(2);
  // #endregion

  // #region 工厂模式
  /**工厂模式 */
  isEnterFactory = ref(false);
  // #endregion

  /** 监听写入名称响应*/
  setNameSuccess = ref(false);

  /**工厂信息 */
  manufacturer = ref("");
  isGotManufacturer = ref(false);

  /**条码 */
  barCode = ref("");
  isGotBarCode = ref(false);

  /**BMS型号 | 硬件名称 */
  BMSModel = ref("");
  isGotBMSModel = ref(false);

  /**电池型号 | 设备型号 */
  batteryModel = ref("");
  isGotBatteryModel = ref(false);

  /**单体电压列表 */
  voltageList = ref<number[]>([]);
  isGotVoltageList = ref(false);
  /**最高电压 */
  maxVoltage = ref(0);
  /**最低电压 */
  minVoltage = ref(0);
  /**平均电压 */
  averageVoltage = ref(0);
  /**电压差 */
  voltageDifference = ref(0);

  /**发送指令回调 */
  private static sendCommandCallback: Function | null = null;
  /**上次连接设备 */
  static lastConnectedDevice: BluetoothDeviceInfo | null = null;
  /**是否检测到上次连接设备 */
  static canAutoConnect = ref(false);

  /**ArrayBuffer转16进制字符串 */
  private static ab2hex(buffer: ArrayBuffer): string {
    const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
      return ("00" + bit.toString(16)).slice(-2);
    });
    return hexArr.join("");
  }
  /**
   * 获取蓝牙错误信息
   * @param error 错误对象
   * @param flag 是否中文
   */
  static getBleErrorMsg(error: { code: number; errMsg: string }, isZh_CN: boolean = false) {
    if (!error.code) {
      return error;
    }
    if (isZh_CN) {
      // 获取中文描述
      const arr = Bluetooth.ErrMsgs[error.code].split(":");
      return arr[arr.length - 1];
    } else {
      // 获取英文描述
      const arr = error.errMsg.split(":");
      return arr[arr.length - 1];
    }
  }
  /**十六进制转十进制 */
  private static hexToDecimal(hex: string) {
    let decimal = 0;
    const hexMap: AnyObject = {
      A: 10,
      B: 11,
      C: 12,
      D: 13,
      E: 14,
      F: 15,
    };
    for (let i = 0; i < hex.length; i++) {
      const currentDigit = hex[i];
      if (hexMap.hasOwnProperty(currentDigit)) {
        decimal = decimal * 16 + hexMap[currentDigit];
      } else {
        //@ts-ignore
        //parseFloat() 函数可解析一个字符串，并返回一个浮点数,第二个参数表示要转换的进制
        decimal = decimal * 16 + parseFloat(currentDigit, 16);
      }
    }
    return decimal;
  }
  /** 十进制转十六进制*/
  private static decimalToHex(decimal: number, padding = 2) {
    const hexDigits = [];
    const hexMap: AnyObject = {
      10: "A",
      11: "B",
      12: "C",
      13: "D",
      14: "E",
      15: "F",
    };

    while (decimal > 0) {
      const remainder: number = decimal % 16;
      if (remainder >= 10) {
        hexDigits.unshift(hexMap[remainder]);
      } else {
        hexDigits.unshift(`${remainder}`);
      }
      decimal = Math.floor(decimal / 16);
    }

    const hex = hexDigits.join("").padStart(padding, "0");
    return hex;
  }
  /**获取校验码 */
  private static getParamCheck = (content: number[]) => {
    // 命令码+数据长度
    let sum: string | number = content.reduce((pre, cur) => {
      return pre + (cur & 0xff);
    }, 0);
    sum = sum ^ 0xffff;
    // 此为十进制数据
    sum = sum + 1;
    // 转为十六进制 并拆分为两个字节
    sum = Bluetooth.decimalToHex(sum);
    let check1 = sum.substring(0, 2);
    let check2 = sum.substring(2, 4);

    return { check1: Number("0x" + check1), check2: Number("0x" + check2) };
  };
  // 取ascii码转十六进制
  private static convertASCIItoHex = (str: string) => {
    let asciiCode = str.charCodeAt(0);
    let hexValue = this.decimalToHex(asciiCode);
    return hexValue;
  };
  /**小时单位转分钟单位 eg: 1.5H -> 1H30m */
  private static transformToTime = (hours: number) => {
    const hour = Math.floor(hours);
    const minute = Math.floor((hours - hour) * 60);
    return `${hour}H${minute}M`;
  };
  /**存储设备信息 */
  private static setDeviceToStorage(device: BluetoothDeviceInfo) {
    uni.setStorageSync("currentDevice", device);
  }
  /**清除存储的设备信息 */
  private static clearStorageDevice() {
    uni.removeStorageSync("currentDevice");
  }

  // #region 蓝牙初始化 连接 断开 获取服务特征值
  /**点火 */
  static init() {
    uni.openBluetoothAdapter({
      success(result) {
        Bluetooth.startBluetoothDevicesDiscovery();
      },
      fail(error) {
        console.log("❌打开蓝牙:失败");
        console.log(Bluetooth.getBleErrorMsg(error.code));
        if (error.code === 10001) {
          uni.showModal({
            title: "tip",
            content: "please turn on the bluetooth",
            showCancel: false,
            success(result) {
              //监听蓝牙适配器状态变化事件
              uni.onBluetoothAdapterStateChange((res) => {
                if (res.available) {
                  Bluetooth.startBluetoothDevicesDiscovery();
                }
              });
            },
          });
        }
      },
    });
    // });
  }
  /**
   * 开始搜寻附近的蓝牙外围设备
   * - 此操作比较耗费系统资源，请在搜索到需要的设备后及时调用 wx.stopBluetoothDevicesDiscovery 停止搜索。
   * */
  static startBluetoothDevicesDiscovery() {
    uni.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      services: [Bluetooth.SERVICE_UUID],
      success(result) {
        console.log("🟢开始搜寻附近的蓝牙外围设备");
        Bluetooth.onBluetoothDeviceFound();
      },
      fail(error) {
        console.log("❌开搜寻设备失败 ", Bluetooth.getBleErrorMsg(error));
        uni.showModal({
          title: "tip",
          content: "Search for Bluetooth device failed",
          showCancel: false,
        });
      },
    });
    // });
  }

  /**监听搜索到新设备的事件 */
  static onBluetoothDeviceFound() {
    console.log("监听搜索到新设备的事件");
    uni.onBluetoothDeviceFound((res) => {
      res.devices.forEach((item: BluetoothDeviceInfo) => {
        if (!item.advertisData) return;
        let deviceData = Bluetooth.ab2hex(item.advertisData as unknown as ArrayBuffer).slice(-12);
        let deviceid = deviceData
          .toUpperCase()
          .match(/(.{2})/g)
          ?.join(":") as string;
        // 以下字符结尾的都要翻转
        if (deviceid.endsWith("A5") || deviceid.endsWith("A4") || deviceid.endsWith("12") || deviceid.endsWith("52") || deviceid.endsWith("00")) {
          // 嘉佰达的设备都是倒叙,需翻转
          let arr = deviceid.split(":");
          arr.reverse();
          deviceid = arr.join(":");
        }

        item.macAddr = deviceid;
        if (item.RSSI >= -50) {
          item.signalLevel = "Strong";
        } else if (item.RSSI >= -70) {
          item.signalLevel = "Medium";
        } else if (item.RSSI >= -80) {
          item.signalLevel = "Medium";
        } else if (item.RSSI >= -90) {
          item.signalLevel = "Weak";
        } else {
          item.signalLevel = "Weak";
        }
        let index = this.INSTANCE!.deviceList.value.findIndex((item2) => item2.deviceId === item.deviceId);
        if (index === -1) {
          this.INSTANCE!.deviceList.value.push(item);
        } else {
          this.INSTANCE!.deviceList.value[index] = item;
        }
        // 根据RSSI信号强度降序排序
        this.INSTANCE!.deviceList.value.sort((a, b) => b.RSSI - a.RSSI);
        Bluetooth.autoConnect(item);
      });
    });
  }
  /**连接设备 */
  static connect = (device: BluetoothDeviceInfo): Promise<BluetoothDeviceInfo> => {
    return new Promise((resolve, reject) => {
      this.INSTANCE!.deviceList.value.forEach((item) => {
        if (item.isConnected) {
          Bluetooth.unLink(item);
          item.isConnected = false;
        }
      });
      uni.createBLEConnection({
        deviceId: device.deviceId,
        timeout: 10000,
        success(result) {
          setTimeout(() => resolve(device), 2000);
        },
        fail: (error) => {
          if (error.code === -1) {
            console.log("🟢设备已连接");
            setTimeout(() => resolve(device), 2000);
            return;
          }
          this.INSTANCE!.connectedDevice.value = null;
          Bluetooth.clearStorageDevice();
          console.log("❌连接设备🔗失败", Bluetooth.getBleErrorMsg(error, true));
          reject(error);
        },
      });
    });
  };
  /**获取蓝牙低功耗设备所有服务 (service) */
  static getServices(device: BluetoothDeviceInfo): Promise<{ services: UniApp.GetBLEDeviceServicesSuccessData[]; device: BluetoothDeviceInfo }> {
    return new Promise((resolve, reject) => {
      uni.getBLEDeviceServices({
        deviceId: device.deviceId,
        success(result) {
          console.log("🟢获取服务成功");
          resolve({ services: result.services, device });
        },
        fail(error) {
          console.log("❌获取服务失败", Bluetooth.getBleErrorMsg(error, true));
          Bluetooth.unLink();
          reject(error);
        },
        complete() {},
      });
    });
  }

  /**获取蓝牙低功耗设备某个服务中所有特征 (characteristic) */
  static getCharacteristics(services: UniApp.GetBLEDeviceServicesSuccessData[], device: BluetoothDeviceInfo): Promise<BluetoothDeviceInfo> {
    return new Promise((resolve, reject) => {
      let service = services.find((item) => {
        return item.uuid.toUpperCase() === this.SERVICE_UUID;
      });
      if (!service || !service.isPrimary) {
        return reject("没有正确的特征值");
      }
      uni.getBLEDeviceCharacteristics({
        deviceId: device.deviceId,
        serviceId: service.uuid,
        success: (result) => {
          this.INSTANCE!.isConnected.value = true;
          this.INSTANCE!.connectedDevice.value = device;
          device.isConnected = true;
          this.toUpDevice();
          this.stopBluetoothDevicesDiscovery();
          resolve(device);
        },
        fail(error) {
          reject(error);
          Bluetooth.clearStorageDevice();
        },
        complete() {},
      });
    });
  }
  /**自动连接 */
  static autoConnect(device: BluetoothDeviceInfo) {
    if (!this.INSTANCE?.isConnected.value && Bluetooth.lastConnectedDevice && device.deviceId === Bluetooth.lastConnectedDevice?.deviceId) {
      this.canAutoConnect.value = true;
    }
  }
  // 置顶已连接
  static toUpDevice() {
    console.log("置顶已连接");
    let connectedDevice = this.INSTANCE!.connectedDevice;
    let index = this.INSTANCE!.deviceList.value.findIndex((item) => item.deviceId === connectedDevice.value!.deviceId);
    this.INSTANCE!.deviceList.value.splice(index, 1);
    this.INSTANCE!.deviceList.value.unshift(connectedDevice.value!);
  }
  /**停止搜寻 */
  static stopBluetoothDevicesDiscovery = () => {
    console.log("停止监听");
    uni.stopBluetoothDevicesDiscovery();
  };
  /**断开链接 */
  static unLink(device: BluetoothDeviceInfo | any = this.INSTANCE!.connectedDevice) {
    uni.closeBLEConnection({
      deviceId: device.deviceId,
      success: (result) => {
        console.log("断开连接成功");
        device.isConnected = false;
        this.INSTANCE!.connectedDevice.value = null;
        this.INSTANCE!.isConnected.value = false;
        this.clearPropeerties();
      },
      fail: (error) => {},
    });
  }

  // #endregion

  // region 监听数据
  static listeningData() {
    console.log("开始监听数据");
    let readValue: number[] = [];
    // 启用蓝牙低功耗设备特征值变化时的 notify 功能，订阅特征。
    uni.notifyBLECharacteristicValueChange({
      deviceId: this.INSTANCE!.connectedDevice.value!.deviceId,
      serviceId: Bluetooth.SERVICE_UUID,
      characteristicId: Bluetooth.READ_UUID,
      state: true,
      fail(error) {
        console.log("❌订阅失败", Bluetooth.getBleErrorMsg(error, true));
        uni.showModal({
          title: "提示",
          content: "订阅失败，返回设备列表",
          showCancel: false,
          success: () => {
            uni.navigateTo({ url: "/pages/device/device" });
          },
        });
      },
    });
    const _this = this.INSTANCE!;
    uni.onBLECharacteristicValueChange((res) => {
      // ArrayBuffer转数组
      const intArr: number[] = Array.prototype.map.call(new Uint8Array(res.value), (bit) => bit) as number[];
      // console.log("intArr: ", intArr);
      // 判断起始位
      if (intArr[0] === 0xdd) {
        readValue = intArr;
      } else {
        readValue = readValue.concat(intArr);
      }

      //判断停止位
      if (readValue[0] === 0xdd && readValue[readValue.length - 1] === 0x77) {
        const _readValue = [...readValue];
        // 记录历史连接设备
        Bluetooth.setDeviceToStorage(_this.connectedDevice.value!);
        //获取指令
        const cmd = readValue[1];
        console.log("cmd: ", cmd.toString(16));
        //根据指令解析数据
        if (cmd === 0x00) {
          console.log("🟢进入工厂模式成功");
          _this.isEnterFactory.value = true;
        } else if (cmd === 0x01) {
          console.log("🟢退出工厂模式成功");
          _this.isEnterFactory.value = false;
        } else if (cmd === 0x03) {
          // #region
          console.log("🟢解析基础数据");
          console.log("readValue: ", readValue);
          _this.isGotBaseData.value = true;

          //解析总电压
          _this.totalVoltage.value = ((readValue[4] << 8) + (readValue[5] & 0x0ff)) / 100;
          _this.totalVoltage.value = +_this.totalVoltage.value.toFixed(2);
          // console.log("totalVoltage.value: ", totalVoltage.value);

          //解析电流  单位: A
          _this.current.value = (readValue[6] << 8) + (readValue[7] & 0x0ff);
          if (_this.current.value > 32768) _this.current.value = (_this.current.value - 65536) / 100;
          else _this.current.value = _this.current.value / 100;
          _this.current.value = +_this.current.value.toFixed(2);

          //解析功率
          _this.power.value = parseFloat(_this.totalVoltage.value + "") * parseFloat(String(_this.current.value));
          _this.power.value = +_this.power.value.toFixed(2);

          //soc圆环
          _this.socPercent.value = readValue[23]; //单位:百分比

          //解析剩余容量  单位 Ah
          let hexVolume1 = String(Bluetooth.decimalToHex(readValue[8])) + String(Bluetooth.decimalToHex(readValue[9]));
          let deciamlVolume1 = (Bluetooth.hexToDecimal(hexVolume1) * 10) / 1000;
          _this.remainingCapacity.value = Number(deciamlVolume1.toFixed(2));

          //解析标称容量 单位 Ah
          let hexVolume2 = String(Bluetooth.decimalToHex(readValue[10])) + String(Bluetooth.decimalToHex(readValue[11]));
          let deciamlVolume2 = (Bluetooth.hexToDecimal(hexVolume2) * 10) / 1000;
          _this.nominalCapacity.value = Number(deciamlVolume2.toFixed(2));

          //解析充电开关
          _this.chargeSwitchStatus.value = readValue[24] === 1 || readValue[24] === 3 || false;

          //解析放电开关
          _this.dischargeSwitchStatus.value = readValue[24] === 2 || readValue[24] === 3 || false;

          // 均衡状态
          _this.equilibriumState.value = readValue[16] == 0 && readValue[17] == 0 ? false : true;

          // 保护状态
          _this.protectionState.value = readValue[20] == 0 && readValue[21] == 0 ? false : true;

          //解析温度
          let ntcNum = readValue[26] & 0xff;
          for (let i = 0; i < ntcNum; i++) {
            let temp_h = readValue[26 + i * 2 + 1] & 0xff;
            let temp_l = readValue[26 + i * 2 + 2] & 0xff;
            _this.temperatures.value[i] = +((temp_h * 256 + temp_l - 2731) / 10).toFixed(1);
          }

          //解析循环次数
          let hexcycle = String(Bluetooth.decimalToHex(readValue[12])) + String(Bluetooth.decimalToHex(readValue[13]));
          _this.loopCount.value = Bluetooth.hexToDecimal(hexcycle);

          // 生产日期
          let hexDate = String(Bluetooth.decimalToHex(readValue[14])) + String(Bluetooth.decimalToHex(readValue[15]));
          let day = Number("0x" + hexDate) & 0x1f;
          let month = (Number("0x" + hexDate) >> 5) & 0x0f;
          let year = (Number("0x" + hexDate) >> 9) + 2000;
          _this.productionDate.value = year + "-" + month + "-" + day;

          // 软件版本
          let versionCode = readValue[22].toString();
          _this.softwareVersion.value = versionCode[0] + "." + versionCode[1];

          // 协议判断 旧协议读取参数需进出工厂
          if (readValue[3] > 22 + ntcNum * 2 + 5) {
            // 新版本
            _this.isNewVersion.value = true;
            console.log("新版本");
          } else {
            //旧版本
            _this.isNewVersion.value = false;
            console.log("旧版本");
          }

          /**充放电时间 */
          (() => {
            const { current, remainingCapacity, nominalCapacity, chargeOrDischargeTime } = _this;
            if (current.value === 0) chargeOrDischargeTime.value = "--";
            else if (current.value > 0) {
              // 充电 (标称容量 - 剩余容量) / 电流
              let m = (nominalCapacity.value - remainingCapacity.value) / current.value;
              chargeOrDischargeTime.value = Bluetooth.transformToTime(m);
            } else if (current.value < 0) {
              // 放电  剩余容量 / 电流
              let m = remainingCapacity.value / -current.value;
              chargeOrDischargeTime.value = Bluetooth.transformToTime(m);
            }
          })();
          //#endregion
        } else if (cmd === 0x04) {
          console.log("🟢解析单体电压");
          const { voltageList } = _this;
          voltageList.value = [];
          // 需获取一个新数组，长度为readValue[3]的值，新数组的值为数组第5位开始，每'两位'的十六进制数相结合的值
          // 由于是从下标4开始，所以index最大值需 +4
          for (let index = 4; index < parseInt(readValue[3] + "") + 4; index += 2) {
            // 注意：此处不是求和，所以需转换为字符串拼接
            let element = String(this.decimalToHex(readValue[index])) + String(this.decimalToHex(readValue[index + 1]));
            // 获取到十六进制后需再转换为十进制 即为电压值（mV）转换为(V)
            element = this.hexToDecimal(element) / 1000 + "";
            voltageList.value.push(+parseFloat(element).toFixed(2));
          }
          if (voltageList.value.length > 0) {
            // 最高电压
            _this.maxVoltage.value = +Math.max(...voltageList.value).toFixed(2);
            // 最低电压
            _this.minVoltage.value = +Math.min(...voltageList.value).toFixed(2);
            const sum = voltageList.value.reduce((acc, cur) => parseFloat(String(acc)) + parseFloat(String(cur)));
            const average = parseFloat(String(sum)) / voltageList.value.length;
            _this.averageVoltage.value = +average.toFixed(2);
            //压差
            _this.voltageDifference.value = +parseFloat(String(_this.maxVoltage.value - _this.minVoltage.value)).toFixed(2);
            _this.isGotVoltageList.value = true;
          }
        } else if (cmd === 0x05) {
          // 解析硬件版本号
          console.log("🟢解析硬件版本号");
          _this.hardwareVersion.value = String.fromCharCode(...readValue.splice(4, readValue[3]));
          _this.isGotHardwareVersion.value = true;
        } else if (cmd === 0xfa) {
          console.log("🟢0xfa读取参数");
          console.log(readValue);
          if (readValue[5] == 88) {
            console.log("🟢解析新版条码");
            _this.barCode.value = String.fromCharCode(...readValue.splice(8, readValue[7]));
            console.log("_this.barCode.value: ", _this.barCode.value);
            _this.isGotBarCode.value = true;
          } else if (readValue[5] == 56) {
            console.log("🟢解析新版厂商");
            _this.manufacturer.value = String.fromCharCode(...readValue.splice(8, readValue[7]));
            console.log("_this.manufacturer.value: ", _this.manufacturer.value);
            _this.isGotManufacturer.value = true;
          } else if (readValue[5] === 158) {
            console.log("🟢解析设备|电池型号");
            _this.batteryModel.value = String.fromCharCode(...readValue.splice(8, readValue[7]));
            _this.isGotBatteryModel.value = true;
          } else if (readValue[5] === 176) {
            console.log("🟢解析BMS型号|硬件名称");
            _this.BMSModel.value = String.fromCharCode(...readValue.splice(8, readValue[7]));
            _this.isGotBMSModel.value = true;
            console.log(" _this.BMSModel.value: ", _this.BMSModel.value);
          }
        } else if (cmd === 0xe1) {
          console.log("🟢解析充放电开关");
          if (readValue[2] === 0) {
            // 响应成功
            _this.disOrChargeSwitchResponse.value = 1;
          } else {
            _this.disOrChargeSwitchResponse.value = 0;
          }
        } else if (cmd === 0xa0) {
          console.log("🟢解析旧版生产商");
          console.log("readValue: ", readValue);
          _this.manufacturer.value = String.fromCharCode(...readValue.splice(5, readValue[4]));
          console.log("_this.manufacturer.value: ", _this.manufacturer.value);
          _this.isGotManufacturer.value = true;
        } else if (cmd === 0xa2) {
          console.log("🟢解析旧版条码");
          console.log("readValue: ", readValue);
          _this.barCode.value = String.fromCharCode(...readValue.splice(5, readValue[4]));
          _this.isGotBarCode.value = true;
        }
        this.sendCommandCallback?.(_readValue);
      }
      if (intArr[0] === 0xff && intArr[1] === 0xaa) {
        let _intArr = [...intArr];
        if (intArr[2] === 0x06) {
          console.log("🟢解析读取名称");
          _this.connectedDevice.value!.localName = String.fromCharCode(...intArr.slice(4, -1));
        } else if (intArr[2] === 0x07) {
          console.log("🟢解析设置名称响应");
          _this.setNameSuccess.value = true;
        }
        this.sendCommandCallback?.(_intArr);
      }
    });
    uni.readBLECharacteristicValue({
      deviceId: _this.connectedDevice.value!.deviceId,
      serviceId: Bluetooth.SERVICE_UUID,
      characteristicId: Bluetooth.READ_UUID,
    });
  }

  /**清空类中所有属性值 */
  static clearPropeerties() {
    console.log("清空类中所有属性值");
    const { INSTANCE } = this;
    if (INSTANCE) {
      Object.keys(INSTANCE).forEach((key) => {
        if (["deviceList", "connectedDevice", "isConnected"].includes(key)) return;
        let t = typeof INSTANCE[key].value;
        if (t === "number") {
          INSTANCE[key].value = 0;
        } else if (t === "string") {
          INSTANCE[key].value = "";
        } else if (t === "boolean") {
          INSTANCE[key].value = false;
        } else if (t === "object") {
          if (Object.prototype.toString.call(INSTANCE[key].value) === "[object Array]") {
            INSTANCE[key].value = [];
          } else if (Object.prototype.toString.call(INSTANCE[key].value) === "[object Object]") {
            INSTANCE[key].value = {};
          } else if (Object.prototype.toString.call(INSTANCE[key].value) === "[object Null]") {
            INSTANCE[key].value = null;
          } else if (Object.prototype.toString.call(INSTANCE[key].value) === "[object Function]") {
            INSTANCE[key].value = null;
          }
        } else {
          console.log("type error: ", typeof INSTANCE[key].value);
          console.log(INSTANCE[key]);
          console.log(INSTANCE.connectedDevice.value);
        }
      });
    }
  }

  // #region 发送指令
  /**发送指令 */
  static async sendCommand(arr: number[]) {
    if (arr[0] === 0xdd && arr[arr.length - 1] !== 0x77) {
      // 加工
      const cmd = arr[2];
      const length = arr[3];
      const content = arr.slice(4, 4 + length);
      const { check1, check2 } = Bluetooth.getParamCheck([cmd, length, ...content]);
      arr.push(check1, check2, 0x77);
    }
    const buffer = new ArrayBuffer(arr.length);
    const dataview = new DataView(buffer);
    arr.forEach((item, index) => {
      dataview.setUint8(index, item);
    });
    console.log("指令:", arr);
    const sectionArr: ArrayBuffer[] = [];
    for (let i = 0; i < buffer.byteLength; i += 20) {
      sectionArr.push(buffer.slice(i, i + 20));
    }
    const pArr = [];
    for (const buf of sectionArr) {
      pArr.push(await this.sendBuffer(buf));
    }
    Promise.all(pArr)
      .then((res) => {
        console.log("✅发送指令成功");
      })
      .catch((err) => {
        console.log("❌发送指令失败： ", this.getBleErrorMsg(err));
      });
    // 🔴🟠🟡🟢✔️
  }
  static sendBuffer(buffer: BufferSource) {
    return new Promise((resolve, reject) => {
      uni.writeBLECharacteristicValue({
        deviceId: Bluetooth.INSTANCE!.connectedDevice.value!.deviceId,
        serviceId: Bluetooth.SERVICE_UUID,
        characteristicId: Bluetooth.WRITE_UUID,
        //@ts-ignore
        value: buffer,
        writeType: "writeNoResponse",
        success: () => {
          resolve(true);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  }

  /**退出工厂模式 */
  static exitFactoryMode() {
    console.log("退出工厂模式指令");
    let content = [0xdd, 0x5d, 0x01, 0x02, 0x28, 0x28];
    this.sendCommand(content);
  }
  /**进入工厂模式 */
  static enterFactoryMode() {
    console.log("进入工厂模式指令");
    let content = [0xdd, 0x5a, 0x00, 0x02, 0x56, 0x78];
    this.sendCommand(content);
  }
  /**获取单体电压指令 */
  static writeGetCellVoltagesCmd() {
    console.log("获取单体电压指令");
    let content = [0xdd, 0xa5, 0x04, 0x00];
    this.sendCommand(content);
  }

  /**
   * 获取FA参数指令
   * @param index 索引
   * @param length 长度
   * @param cb 可选回调函数,会注入readValue,可对其进行处理
   */
  static writeFAParamCmd(index: number, length: number, cb?: (readValue: number[]) => void) {
    let content = [0xdd, 0xa5, 0xfa, 0x03, 0x00, index, length];
    this.sendCommandCallback = cb ?? null;
    this.sendCommand(content);
  }
  /**获取 BMS型号 | 硬件名称 指令 */
  static writeGetBMSModelCmd() {
    console.log("获取BMS型号指令");
    this.writeFAParamCmd(176, 4);
  }
  /**获取 电池型号 | 设备型号 指令 */
  static writeGetBatteryModelCmd() {
    console.log("获取电池型号指令");
    this.writeFAParamCmd(158, 12, (arr) => {});
  }

  /**获取条码 */
  static writeGetBarCodeCmd() {
    console.log("获取条码指令");
    let content: number[] = [];
    if (Bluetooth.INSTANCE!.isNewVersion.value) {
      content = [0xdd, 0xa5, 0xfa, 0x03, 0x00, 88, 16];
    } else {
      content = [0xdd, 0xa5, 0xa2, 0];
    }
    this.sendCommand(content);
  }

  /**获取生产厂商信息 */
  static writeGetManufacturerInfoCmd() {
    console.log("获取工厂信息指令");
    let content: number[] = [];
    if (Bluetooth.INSTANCE!.isNewVersion.value) {
      content = [0xdd, 0xa5, 0xfa, 0x03, 0x00, 56, 16];
    } else {
      content = [0xdd, 0xa5, 0xa0, 0];
    }
    this.sendCommand(content);
  }

  /**获取硬件版本号 */
  static writeGetHardwareVersionCmd() {
    console.log("获取硬件版本号指令");
    const content = [0xdd, 0xa5, 0x05, 0x00, 0xff, 0xfb, 0x77];
    this.sendCommand(content);
  }

  /**获取设备基础数据 */
  static writeGetBaseDataCmd() {
    console.log("获取设备基础数据指令");
    const content = [0xdd, 0xa5, 0x03, 0x00, 0xff, 0xfd, 0x77];
    this.sendCommand(content);
  }

  /**设置名字 */
  static SetName(name: string) {
    console.log("设置名字指令");
    // 将输入的每个字符对应的ASCII码转为十六进制  数组
    let nameArr: number[] = [];
    for (let i = 0; i < name.length; i++) {
      let value = this.convertASCIItoHex(name[i]);
      nameArr.push(+("0x" + value));
    }
    let content = [0xff, 0xaa, 0x07, nameArr.length];
    nameArr.forEach((item) => content.push(item));
    this.sendCommand(content);
  }

  /**充电开关  flag: true 开 false 关 */
  static handleChargeSwitch(flag: boolean) {
    console.log("flag: ", flag);
    let code: number;
    // 打开充电
    if (flag) {
      // 当正在放电  // ====== 00 全打开
      if (this.INSTANCE?.dischargeSwitchStatus.value) code = 0x00;
      // 当不在放电  // ====== 02 关闭放电,打开充电
      else code = 0x02;
      // 关闭充电
    } else {
      // 当正在放电  // ======= 01 关闭充电,打开放电
      if (this.INSTANCE?.dischargeSwitchStatus.value) code = 0x01;
      // 当不在放电 // 03 全关闭
      else code = 0x03;
    }
    let content: number[] = [0xdd, 0x5a, 0xe1, 0x02, 0x0, code];
    this.sendCommand(content);
  }

  /**放电开关 */
  static handleDischargingChange(flag: boolean) {
    console.log("flag: ", flag);
    let code: number;
    // 打开放电
    if (flag) {
      // 当正在充电  // ====== 00 全打开
      if (this.INSTANCE?.chargeSwitchStatus.value) code = 0x00;
      // 当不在充电  // ====== 01 打开放电 关闭充电
      else code = 0x01;
      // 关闭放电
    } else {
      // 当正在充电 // ======= 02 关闭放电,打开充电
      if (this.INSTANCE?.chargeSwitchStatus.value) code = 0x02;
      // 当不在充电// 03 全关闭
      else code = 0x03;
    }
    let content: number[] = [0xdd, 0x5a, 0xe1, 0x02, 0, code];
    this.sendCommand(content);
  }
}

// #endregion
