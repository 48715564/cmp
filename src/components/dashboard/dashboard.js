import CanvasService from '@/services/CanvasService.js';
import OvirtService from '@/services/OvirtService.js';
import Xclarity from '@/components/xclarity/xclarity.vue';
import Myframe from '@/components/frame/myframe.vue';
import _ from 'lodash';

const loadMsg = '...';
const loadErrorMsg = [];

export default {
  name: 'dashboard',
  data() {
    return {
      dataStatus: true,
      indexInfoIsLoad: true,
      networkInfo: false,
      hostInfo: false,
      alertEvents: false,
      storageInfo: false,
      isXClarity: false,
      isLeft: false,
      isRight: false,
      cpuGraph: null,
      ramGraph: null,
      networkGraph: null,
      storeGraph: null,
      cpuGraphXData: [],
      cpuGraphYData: [],
      cpuUsed: 0,
      ramGraphXData: [],
      ramGraphYData: [],
      ramUsed: 0,
      nicReceiveYData: [],
      nicReceiveUsed: 0,
      nicGraphXData: [],
      nicTransmitYData: [],
      nicTransmitUsed: 0,
      storeIOPSReadYData: [],
      storeIOPSRead: 0,
      storeIOPSXData: [],
      storeIOPSWriteYData: [],
      storeIOPSWrite: 0,
    };
  },
  methods: {
    logout() {
      localStorage.token = '';
      location.reload(true);
    },
    getLength(obj) {
      if (obj instanceof Object) {
        return obj.length;
      }
      return loadMsg;
    },
    round(num) {
      return _.round(num, 2);
    },
    // 0:B,1:KB,2:MB,3:GB,4:TB,5:PB,6:EB,7:ZB,8:YB
    bytesToSize(bytes, i) {
      if (bytes === 0) return '0';
      const k = 1024;
      return this.round((bytes / Math.pow(k, i)), 2);
      // toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    gotoOvirt() {
      window.open('https://10.0.4.90/ovirt-engine/webadmin/?locale=zh_CN#dashboard-main');
    },

    ellipsis(value, size = 32) {
      if (!value) return '';
      if (value.length > size) {
        return `${value.slice(0, size)}...`;
      }
      return value;
    },
    networkStr(data) {
      return `网络名称：${data.name}，描述：${data.description}`;
    },

    pushNicGraphXData() {
      const date = new Date();
      const time = `${_.padStart(date.getHours(), 2, '0')}:${_.padStart(date.getMinutes(), 2, '0')}:${_.padStart(date.getSeconds(), 2, '0')}`;
      this.nicGraphXData.push(time);
      if (this.nicGraphXData.length > 20) {
        this.nicGraphXData.shift();
      }
    },

    pushNicReceiveYData(value) {
      this.nicReceiveYData.push(value);
      if (this.nicReceiveYData.length > 20) {
        this.nicReceiveYData.shift();
      }
    },

    pushNicTransmitYData(value) {
      this.nicTransmitYData.push(value);
      if (this.nicTransmitYData.length > 20) {
        this.nicTransmitYData.shift();
      }
    },

    pushCpuGraphXData() {
      const date = new Date();
      const time = `${_.padStart(date.getHours(), 2, '0')}:${_.padStart(date.getMinutes(), 2, '0')}:${_.padStart(date.getSeconds(), 2, '0')}`;
      this.cpuGraphXData.push(time);
      if (this.cpuGraphXData.length > 20) {
        this.cpuGraphXData.shift();
      }
    },

    pushCpuGraphYData(value) {
      this.cpuGraphYData.push(value);
      if (this.cpuGraphYData.length > 20) {
        this.cpuGraphYData.shift();
      }
    },

    pushRamGraphXData() {
      const date = new Date();
      const time = `${_.padStart(date.getHours(), 2, '0')}:${_.padStart(date.getMinutes(), 2, '0')}:${_.padStart(date.getSeconds(), 2, '0')}`;
      this.ramGraphXData.push(time);
      if (this.ramGraphXData.length > 20) {
        this.ramGraphXData.shift();
      }
    },

    pushRamGraphYData(value) {
      this.ramGraphYData.push(value);
      if (this.ramGraphYData.length > 20) {
        this.ramGraphYData.shift();
      }
    },

    initLoadCpuMonitorData() {
      if (document.getElementById('cpuLine')) {
        document.getElementById('cpuLine').innerHTML = loadMsg;
      }
      if (document.getElementById('storeLine')) {
        document.getElementById('storeLine').innerHTML = loadMsg;
      }
      if (document.getElementById('networkLine')) {
        document.getElementById('networkLine').innerHTML = loadMsg;
      }
      if (document.getElementById('ramLine')) {
        document.getElementById('ramLine').innerHTML = loadMsg;
      }
      this.loadMonitorData();
      this.loadDataStoreData()
    },
    loadDataStoreData(isInit = true){
      OvirtService.ovirtMonitorStoreBandWidthData().then((res) => {
        if (res.data.success) {
          // 存储IOPS信息
          this.storeIOPSXData=res.data.result.timeData;
          let readYData = [];
          _.each(res.data.result.readData,item=>{
            if(item<0){
              item = 0;
            }
            readYData.push(this.round(item))
          });
          let writeYData = [];
          _.each(res.data.result.writeDate,item=>{
            if(item<0){
              item = 0;
            }
            writeYData.push(this.round(item))
          });
          this.storeIOPSReadYData=readYData;
          this.storeIOPSWriteYData=writeYData;
          if(readYData.length>0){
            this.storeIOPSRead = readYData[readYData.length-1];
          }
          if(writeYData.length>0){
            this.storeIOPSWrite = writeYData[writeYData.length-1];
          }
          const dataStoreIOPSData = {
            xData: this.storeIOPSXData,
            yData1: this.storeIOPSReadYData,
            yData2: this.storeIOPSWriteYData,
          };
          if (isInit) {
            this.dataStoreIOPSGraph = CanvasService.DepletionTwoLineGraph(document.getElementById('storeLine'), dataStoreIOPSData, false, {
              name1: '读取(B)',
              stack1: 'transmit',
              name2: '写入(B)',
              stack2: 'receive'
            });
          }else{
            this.dataStoreIOPSGraph.setOption({
              xAxis: [
                {
                  type: 'category',
                  data: dataStoreIOPSData.xData,
                  axisTick: {
                    alignWithLabel: true,
                  },
                },
              ],
              series: [{
                data: dataStoreIOPSData.yData1,
              }, {
                data: dataStoreIOPSData.yData2,
              }],
            });
          }
        }
      });
    },
    loadMonitorData(isInit = true) {
      OvirtService.ovirtMonitorData().then((res) => {
        if (res.data.success) {
          // cpu信息
          this.pushCpuGraphXData();
          this.pushCpuGraphYData(res.data.result.cpuUsed);
          const cpuData = {xData: this.cpuGraphXData, yData: this.cpuGraphYData};
          this.cpuUsed = res.data.result.cpuUsed;
          // 内存信息
          this.pushRamGraphXData();
          this.pushRamGraphYData(res.data.result.menoryUsed);
          const ramData = {xData: this.ramGraphXData, yData: this.ramGraphYData};
          this.ramUsed = res.data.result.menoryUsed;
          // 网络IO信息
          this.pushNicGraphXData();
          this.pushNicReceiveYData(this.bytesToSize(res.data.result.nicInfo.receiveData, 1));
          this.pushNicTransmitYData(this.bytesToSize(res.data.result.nicInfo.transmitData, 1));
          this.nicTransmitUsed = this.bytesToSize(res.data.result.nicInfo.transmitData, 1);
          this.nicReceiveUsed = this.bytesToSize(res.data.result.nicInfo.receiveData, 1);
          const nicData = {
            xData: this.nicGraphXData,
            yData1: this.nicTransmitYData,
            yData2: this.nicReceiveYData,
          };
          if (isInit) {
            this.dataStatus = true;
            this.cpuGraph = CanvasService.DepletionGraph(document.getElementById('cpuLine'), cpuData, true, {
              name: 'CPU 使用率',
              stack: 'cpu'
            });
            this.ramGraph = CanvasService.DepletionGraph(document.getElementById('ramLine'), ramData, true, {
              name: '内存使用率',
              stack: 'ram'
            });
            this.nicGraph = CanvasService.DepletionTwoLineGraph(document.getElementById('networkLine'), nicData, false, {
              name1: '发送(KB)',
              stack1: 'transmit',
              name2: '接收(KB)',
              stack2: 'receive'
            });
          } else {
            this.cpuGraph.setOption({
              xAxis: [
                {
                  type: 'category',
                  data: cpuData.xData,
                  axisTick: {
                    alignWithLabel: true,
                  },
                },
              ],
              series: [{
                data: cpuData.yData,
              }],
            });

            this.ramGraph.setOption({
              xAxis: [
                {
                  type: 'category',
                  data: ramData.xData,
                  axisTick: {
                    alignWithLabel: true,
                  },
                },
              ],
              series: [{
                data: ramData.yData,
              }],
            });

            this.nicGraph.setOption({
              xAxis: [
                {
                  type: 'category',
                  data: nicData.xData,
                  axisTick: {
                    alignWithLabel: true,
                  },
                },
              ],
              series: [{
                data: nicData.yData1,
              }, {
                data: nicData.yData2,
              }],
            });
          }
        } else if (isInit) {
          this.dataStatus = false;
        }
      });
    },
  },
  mounted() {
    this.initLoadCpuMonitorData();
    OvirtService.ovirtIndexInfo().then((res) => {
        if (res.data.success) {
          this.hostInfo = res.data.result.hostInfo;
          this.indexInfoIsLoad = false;
          CanvasService.drawServerGraph(this.$refs.server, res.data.result.hostInfo.normalHostCount, res.data.result.hostInfo.unNormalHostCount);
          this.storageInfo = res.data.result.storageInfo;
          CanvasService.drawStorage(this.$refs.store, this.bytesToSize(res.data.result.storageInfo.availableCount, 4), this.bytesToSize(res.data.result.storageInfo.usedCount, 4));
          this.networkInfo = res.data.result.networkInfo;
          this.alertEvents = res.data.result.alertEvents;
        }
      },
    );

    setInterval(() => {
      this.loadMonitorData(false);
    }, 1000);

    setInterval(() => {
      this.loadDataStoreData(false);
    }, 10000);

  },
  computed: {},
  components: {Xclarity, Myframe},
};
