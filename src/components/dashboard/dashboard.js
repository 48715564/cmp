import CanvasService from '@/services/CanvasService.js';
import VMWareService from '@/services/VMWareService.js';
import Xclarity from '@/components/xclarity/xclarity.vue';
import _ from 'lodash';
import Vue from 'vue';

Vue.component('graph', {
  props: ['name', 'refname', 'dataStatus'],
  template: '<div class="item">\n' +
  '            <p class="item-title">{{name}}</p>\n' +
  '            <div class="item-content" style="width: 100%;height: 100%;display: flex;" v-if="dataStatus">\n' +
  '              <div class="item-canvas" style="flex:1" :id="refname">加载中...</div>\n' +
  '            </div>\n' +
  '            <div class="item-empty" v-else><p>暂无数据</p></div>\n' +
  '          </div>'
});

const loadMsg = '加载中...';
const loadErrorMsg = [];
export default {
  name: 'dashboard',
  data() {
    return {
      mainType: 0,
      tableHeight: 350,
      graphNames: {
        name1: '',
        name2: '',
        name3: '',
        name4: ''
      },
      graphDatas: [],
      cpuAndMenInfo: {
        freeMemorySize: 0,
        freeCpuMhz: 0,
        usedCpuMhz: 0,
        usedMemorySize: 0,
        cpuMhz: 0,
        memorySize: 0,
      },
      storeInfo: {
        freeStore: 0,
        usedStore: 0,
        store: 0
      },
      DepletionGraph1: null,
      DepletionGraph2: null,
      DepletionGraph3: null,
      DepletionGraph4: null,
      columns1: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '健康状态',
          key: 'overallStatus'
        },
        {
          title: '连接状态',
          key: 'runtime.connectionState'
        }, {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('AtButton', {
                props: {
                  size: 'small',
                  hollow: true
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.on_selection_change(params.item.name, '3')
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      data1: [],
      columns2: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '健康状态',
          key: 'overallStatus'
        }, {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('AtButton', {
                props: {
                  size: 'small',
                  hollow: true
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.on_selection_change(params.item.name, '1')
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      data2: [],
      columns3: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '健康状态',
          key: 'overallStatus'
        }, {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('AtButton', {
                props: {
                  size: 'small',
                  hollow: true
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.on_selection_change(params.item.name, '2')
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      data3: [],
      columns4: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '健康状态',
          key: 'overallStatus'
        }, {
          title: '电源状态',
          key: 'runtime.powerState'
        }, {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('AtButton', {
                props: {
                  size: 'small',
                  hollow: true,
                  disabled: params.item['runtime.powerState'] == 'poweredOff'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.on_selection_change(params.item.name, '4')
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      data4: [],
      columns5: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '健康状态',
          key: 'overallStatus'
        },
        {
          title: '是否可以访问',
          key: 'summary.accessible'
        }, {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('AtButton', {
                props: {
                  size: 'small',
                  hollow: true
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.on_selection_change(params.item.name, '5')
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      data5: [],
      columns6: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '健康状态',
          key: 'overallStatus'
        }, {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('AtButton', {
                props: {
                  size: 'small',
                  hollow: true
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.on_selection_change(params.item.name, '6')
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      data6: [],
      dataNetWorkHost: [],
      columnsNetWorkHost: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '健康状态',
          key: 'overallStatus'
        },
        {
          title: '连接状态',
          key: 'runtime.connectionState'
        }
      ],
      dataNetWorkVM: [],
      columnsNetWorkVM: [
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '健康状态',
          key: 'overallStatus'
        },
        {
          title: '连接状态',
          key: 'runtime.powerState'
        }
      ],
      data: {
        dataCenterList: loadMsg,
        hostList: loadMsg,
        clusterList: loadMsg,
        vmList: loadMsg,
        dsList: loadMsg,
        networkList: loadMsg,
      },
      dataStatus: true,
      historyData: true,
      isXClarity: false,
      moName: ''
    }
  },
  methods: {
    logout(){
      localStorage.token='';
      location.reload(true);
    },
    getLength(obj) {
      if (obj instanceof Object) {
        return obj.length;
      } else {
        return loadMsg;
      }
    },
    round: function (num) {
      return _.round(num, 2);
    },
    //0:B,1:KB,2:MB,3:GB,4:TB,5:PB,6:EB,7:ZB,8:YB
    bytesToSize: function (bytes, i) {
      if (bytes === 0) return '0';
      let k = 1024;
      return (bytes / Math.pow(k, i));
      //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    getStoreInfo: function (storeList) {
      if (storeList) {
        let freeStore = 0, usedStore = 0, store = 0;
        _.each(storeList, (items) => {
          let summary = _.find(items.propSet, (item) => {
            return item.name == 'summary';
          }).val;
          if (summary) {
            if (summary.accessible) {
              freeStore = freeStore + this.bytesToSize(summary.freeSpace, 4);
            }
            store = store + this.bytesToSize(summary.capacity, 4);
          }
        });
        usedStore = store - freeStore;
        return {store, usedStore, freeStore};
      }
    },
    getCpuAndMemInfo: function (hostList) {
      if (hostList) {
        let cpuMhz = 0, memorySize = 0, usedCpuMhz = 0, usedMemorySize = 0;
        for (let i = 0; i < hostList.length; i++) {
          let summary = _.find(hostList[i].propSet, (item) => {
            return item.name == 'summary';
          }).val;
          if (summary) {
            cpuMhz = cpuMhz + (summary.hardware.cpuMhz * summary.hardware.numCpuCores) / 1000
            memorySize = memorySize + summary.hardware.memorySize;
            usedCpuMhz = usedCpuMhz + summary.quickStats.overallCpuUsage / 1000;
            usedMemorySize = usedMemorySize + summary.quickStats.overallMemoryUsage;
          }
        }
        let freeCpuMhz = cpuMhz - usedCpuMhz;
        memorySize = this.bytesToSize(memorySize, 3);
        usedMemorySize = this.bytesToSize(usedMemorySize, 1);
        let freeMemorySize = memorySize - usedMemorySize;
        return {freeCpuMhz, freeMemorySize, cpuMhz, memorySize, usedCpuMhz, usedMemorySize};
      }
    },
    isShowHight: function (size) {
      if (size > 7) {
        return true
      } else {
        return false;
      }
    },
    on_selection_change(data, type) {
      // if (this.mainType != type || this.moName != data) {
        this.moName = data;
        this.mainType = type;
        switch (type) {
          case '1':
            this.graphNames = {name1: '虚拟机打开电源次数', name2: '虚拟机关闭电源次数', name3: '虚拟机克隆次数', name4: '虚拟机创建次数'};
            this.loadMonitorData(data, VMWareService.getDataCenterMonitorData, [false, false, false, false], [{
              name: '虚拟机打开电源次数',
              stack: 'numPoweron'
            }, {name: '虚拟机关闭电源次数', stack: 'numPoweroff'}, {name: '虚拟机克隆次数', stack: 'numClone'}, {
              name: '虚拟机创建次数',
              stack: 'numCreate'
            }]);
            break;
          case '2':
            this.graphNames = {name1: 'cpu使用率', name2: 'cpu使用情况(MHZ)', name3: '内存使用率', name4: '内存已消耗情况(KB)'};
            this.loadMonitorData(data, VMWareService.getClusterMonitorData, [true, false, true, false], [{
              name: 'CPU使用率',
              stack: 'cpu'
            }, {name: 'cpu使用情况', stack: 'cpumhz'}, {name: '内存使用率', stack: 'mem'}, {name: '内存已消耗情况', stack: 'memkb'}]);
            break;
          case '3':
            this.graphNames = {name1: 'CPU使用率', name2: '内存使用率', name3: '磁盘使用情况(KBps)', name4: '网络使用情况(KBps)'};
            this.loadMonitorData(data, VMWareService.getHostMonitorData, [true, true, false, false], [{
              name: 'CPU使用率',
              stack: 'cpu'
            }, {name: '内存使用率', stack: 'memory'}, {name: '汇总的磁盘I/O速度', stack: 'store'}, {
              name: '传输和接收总速度',
              stack: 'network'
            }]);
            break;
          case '4':
            this.graphNames = {name1: 'CPU使用率', name2: '内存使用率', name3: '磁盘最长滞后时间(毫秒)', name4: '网络使用情况(KBps)'};
            this.loadMonitorData(data, VMWareService.getVMMonitorData, [true, true, false, false], [{
              name: 'CPU使用率',
              stack: 'cpu'
            }, {name: '内存使用率', stack: 'memory'}, {name: '最长滞后时间', stack: 'store'}, {
              name: '传输和接收总速度',
              stack: 'network'
            }]);
            break;
          case '5':
            this.loadStoreMonitorData(data, [{name: '存储使用情况'}, {name: '已使用', stack: 'used'}, {
              name: '已分配',
              stack: 'provisioned'
            }, {name: '总容量', stack: 'capacity'}]);
            break;
          case '6':
            this.loadNetworkMonitorData(data);
            break;
          default:
            break;
        }
      // }
    },
    gotoVMWare() {
      window.open('https://10.0.7.45/');
    },
    getHostName(hostList) {
      if (hostList && hostList.length > 0) {
        let temp = hostList[0]['propSet'];
        for (let i = 0; i < temp.length; i++) {
          if (temp[i]['name'] == 'name') {
            return temp[i]['val'];
          }
        }
      }
    },
    getHostTables(hostList) {
      let data = [];
      if (hostList && hostList.length > 0) {
        for (let count = 0; count < hostList.length; count++) {
          let temp = hostList[count]["propSet"];

          let json = {};
          for (let i = 0; i < temp.length; i++) {
            json[temp[i].name] = temp[i]['val'];
          }
          data.push(json);
        }
      }
      return data;
    },
    getLineData(data, type = 0) {
      if (data) {
        let returnData = {};
        returnData.xData = data.xLine;
        for (let i = 0; i < data.longs.length; i++) {
          if (data.longs[i].instance == '') {
            if (type != 0) {
              let array = [];
              _.each(data.longs[i].list, item => {
                array.push(this.round(this.bytesToSize(item, type)));
              });
              returnData.yData = array;
            } else {
              returnData.yData = data.longs[i].list;
            }
            break;
          }
        }
        return returnData;
      } else {
        return null;
      }
    },
    loadNetworkMonitorData(val) {
      VMWareService.getNetworkMonitorData(val).then((res) => {
        if (res.data.success) {
          this.dataStatus = true;
          this.dataNetWorkHost = this.getHostTables(this.data.hostList);
          this.dataNetWorkVM = this.getHostTables(this.data.vmList);
        } else {
          this.dataStatus = false;
        }
      });
    },
    loadStoreMonitorData(val, series) {
      if (document.getElementById('bar1')) {
        document.getElementById('bar1').innerHTML = loadMsg;
      }
      if (document.getElementById('line1')) {
        document.getElementById('line1').innerHTML = loadMsg;
      }
      if (document.getElementById('line2')) {
        document.getElementById('line2').innerHTML = loadMsg;
      }
      if (document.getElementById('line3')) {
        document.getElementById('line3').innerHTML = loadMsg;
      }
      VMWareService.getDSMonitorData(val).then((res) => {
        if (res.data.success) {
          this.dataStatus = true;
          let capacity = res.data.result.summary.capacity;
          let freeSpace = res.data.result.summary.freeSpace;
          let usedSpace = capacity - freeSpace;
          freeSpace = _.round(this.bytesToSize(freeSpace, 3), 2);
          usedSpace = _.round(this.bytesToSize(usedSpace, 3), 2);
          this.DepletionGraph1 = CanvasService.DepletionGraphBar(document.getElementById('bar1'), [{
            name: '空闲',
            value: freeSpace
          }, {name: '已用', value: usedSpace}], series[0]);
          this.DepletionGraph2 = CanvasService.DepletionGraph(document.getElementById('line1'), this.getLineData(res.data.result.usedMap, 2), false, series[1]);
          this.DepletionGraph3 = CanvasService.DepletionGraph(document.getElementById('line2'), this.getLineData(res.data.result.provisionedMap, 2), false, series[2]);
          this.DepletionGraph4 = CanvasService.DepletionGraph(document.getElementById('line3'), this.getLineData(res.data.result.capacityMap, 2), false, series[3]);
        } else {
          this.dataStatus = false;
        }
      });
    },
    loadMonitorData(val, fun, isPercentage, series) {
      if (document.getElementById('line1')) {
        document.getElementById('line1').innerHTML = loadMsg;
      }
      if (document.getElementById('line2')) {
        document.getElementById('line2').innerHTML = loadMsg;
      }
      if (document.getElementById('line3')) {
        document.getElementById('line3').innerHTML = loadMsg;
      }
      if (document.getElementById('line4')) {
        document.getElementById('line4').innerHTML = loadMsg;
      }
      fun(val).then((res) => {
        if (res.data.success) {
          this.dataStatus = true;
          this.DepletionGraph1 = CanvasService.DepletionGraph(document.getElementById('line1'), this.getLineData(res.data.result.data1), isPercentage[0], series[0]);
          this.DepletionGraph2 = CanvasService.DepletionGraph(document.getElementById('line2'), this.getLineData(res.data.result.data2), isPercentage[1], series[1]);
          this.DepletionGraph3 = CanvasService.DepletionGraph(document.getElementById('line3'), this.getLineData(res.data.result.data3), isPercentage[2], series[2]);
          this.DepletionGraph4 = CanvasService.DepletionGraph(document.getElementById('line4'), this.getLineData(res.data.result.data4), isPercentage[3], series[3]);
        } else {
          this.dataStatus = false;
        }
      });
    },
  },
  mounted() {
    VMWareService.VMWareInfo().then((res) => {
      if (res.data.success) {
        this.data = res.data.result;
        if (this.data.hostList && this.data.hostList.length > 0) {
          this.data1 = this.getHostTables(this.data.hostList);
          this.data2 = this.getHostTables(this.data.dataCenterList);
          this.data3 = this.getHostTables(this.data.clusterList);
          this.data4 = this.getHostTables(this.data.vmList);
          this.data5 = this.getHostTables(this.data.dsList);
          this.data6 = this.getHostTables(this.data.networkList);
          this.cpuAndMenInfo = this.getCpuAndMemInfo(this.data.hostList);
          this.storeInfo = this.getStoreInfo(this.data.dsList);
        }
      } else {
        this.dataStatus = false;
        this.data = {
          dataCenterList: loadErrorMsg,
          hostList: loadErrorMsg,
          clusterList: loadErrorMsg,
          vmList: loadErrorMsg,
          dsList: loadErrorMsg,
          networkList: loadErrorMsg
        }
      }
    });
  },
  computed: {
    mainTypeName:function () {
      switch (this.mainType){
        case '1':return '数据中心:'+this.moName;break;
        case '2':return '集群:'+this.moName;break;
        case '3':return '主机:'+this.moName;break;
        case '4':return '虚拟机:'+this.moName;break;
        case '5':return '存储:'+this.moName;break;
        case '6':return '网络:'+this.moName;break;
        default:break;
      }
    },
    cpuPercent: function () {
      if (this.cpuAndMenInfo.usedCpuMhz && this.cpuAndMenInfo.cpuMhz) {
        return _.round(this.cpuAndMenInfo.usedCpuMhz * 100 / this.cpuAndMenInfo.cpuMhz, 2);
      } else {
        return 0;
      }
    },
    memPercent: function () {
      if (this.cpuAndMenInfo.usedMemorySize && this.cpuAndMenInfo.memorySize) {
        return _.round(this.cpuAndMenInfo.usedMemorySize * 100 / this.cpuAndMenInfo.memorySize, 2);
      }
      else {
        return 0;
      }
    },
    storePercent: function () {
      if (this.storeInfo.usedStore && this.storeInfo.store) {
        return _.round(this.storeInfo.usedStore * 100 / this.storeInfo.store, 2);
      } else {
        return 0;
      }
    },
    vmPowerOn: function () {
      if (this.data.vmList instanceof Object) {
        let count = 0;
        _.each(this.data.vmList, (item) => {
          if (_.find(item.propSet, (i) => {
              return i.name == 'runtime.powerState';
            }).val == 'poweredOn') {
            count++;
          }
        });
        return count;
      } else {
        return loadMsg;
      }
    },
    vmPowerOff: function () {
      if (this.data.vmList instanceof Object) {
        let count = 0;
        _.each(this.data.vmList, (item) => {
          if (_.find(item.propSet, (i) => {
              return i.name == 'runtime.powerState';
            }).val == 'poweredOff') {
            count++;
          }
        });
        return count;
      } else {
        return loadMsg;
      }
    },
    suspended: function () {
      if (this.data.vmList instanceof Object) {
        let count = 0;
        _.each(this.data.vmList, (item) => {
          if (_.find(item.propSet, (i) => {
              return i.name == 'runtime.powerState';
            }).val == 'suspended') {
            count++;
          }
        });
        return count;
      } else {
        return loadMsg;
      }
    },
    hostConnected: function () {
      if (this.data.hostList instanceof Object) {
        let count = 0;
        _.each(this.data.hostList, (item) => {
          if (_.find(item.propSet, (i) => {
              return i.name == 'runtime.connectionState';
            }).val == 'connected') {
            count++;
          }
        });
        return count;
      } else {
        return loadMsg;
      }
    },
    hostDisconnected: function () {
      if (this.data.hostList instanceof Object) {
        let count = 0;
        _.each(this.data.hostList, (item) => {
          if (_.find(item.propSet, (i) => {
              return i.name == 'runtime.connectionState';
            }).val == 'disconnected') {
            count++;
          }
        });
        return count;
      } else {
        return loadMsg;
      }
    },
    hostNotResponding: function () {
      if (this.data.hostList instanceof Object) {
        let count = 0;
        _.each(this.data.hostList, (item) => {
          if (_.find(item.propSet, (i) => {
              return i.name == 'runtime.connectionState';
            }).val == 'notResponding') {
            count++;
          }
        });
        return count;
      } else {
        return loadMsg;
      }
    },
  },
  components: {Xclarity},
};
