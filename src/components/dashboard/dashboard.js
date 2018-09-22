import CanvasService from '@/services/CanvasService.js';
import OvirtService from '@/services/OvirtService.js';
import Xclarity from '@/components/xclarity/xclarity.vue';
import _ from 'lodash';

const loadMsg = '加载中...';
const loadErrorMsg = [];

export default {
  name: 'dashboard',
  data() {
    return {
      dataStatus:true,
      indexInfoIsLoad: true,
      networkInfo: false,
      hostInfo: false,
      alertEvents: false,
      storageInfo: false,
      isXClarity: false,
      cpuGraph:null,
      ramGraph:null,
      networkGraph:null,
      storeGraph:null,
      cpuGraphXData:[],
      cpuGraphYData:[],
      cpuUsed:0,
      ramGraphXData:[],
      ramGraphYData:[],
      ramUsed:0,
      nicReceiveYData:[],
      nicReceiveUsed:0,
      nicGraphXData:[],
      nicTransmitYData:[],
      nicTransmitUsed:0,
    }
  },
  methods: {
    logout() {
      localStorage.token = '';
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
      return this.round((bytes / Math.pow(k, i)),2);
      //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    gotoVMWare() {
      window.open('https://172.16.90.253/ui');
    },

    ellipsis (value,size=32) {
      if (!value) return ''
      if (value.length > size) {
        return value.slice(0,size) + '...'
      }
      return value
    },
    networkStr(data){
      return `网络名称：${data.name}，描述：${data.description}`;
    },

    pushNicGraphXData(){
      var date = new Date();
      var time = _.padStart(date.getHours(),2,'0')+":"+ _.padStart(date.getMinutes(),2,'0')+":"+ _.padStart(date.getSeconds(),2,'0');
      this.nicGraphXData.push(time);
      if(this.nicGraphXData.length>20){
        this.nicGraphXData.shift();
      }
    },

    pushNicReceiveYData(value){
      this.nicReceiveYData.push(value);
      if(this.nicReceiveYData.length>20){
        this.nicReceiveYData.shift();
      }
    },

    pushNicTransmitYData(value){
      this.nicTransmitYData.push(value);
      if(this.nicTransmitYData.length>20){
        this.nicTransmitYData.shift();
      }
    },

    pushCpuGraphXData(){
      var date = new Date();
      var time = _.padStart(date.getHours(),2,'0')+":"+ _.padStart(date.getMinutes(),2,'0')+":"+ _.padStart(date.getSeconds(),2,'0');
      this.cpuGraphXData.push(time);
      if(this.cpuGraphXData.length>20){
        this.cpuGraphXData.shift();
      }
    },

    pushCpuGraphYData(value){
      this.cpuGraphYData.push(value);
      if(this.cpuGraphYData.length>20){
        this.cpuGraphYData.shift();
      }
    },

    pushRamGraphXData(){
      var date = new Date();
      var time = _.padStart(date.getHours(),2,'0')+":"+ _.padStart(date.getMinutes(),2,'0')+":"+ _.padStart(date.getSeconds(),2,'0');
      this.ramGraphXData.push(time);
      if(this.ramGraphXData.length>20){
        this.ramGraphXData.shift();
      }
    },

    pushRamGraphYData(value){
      this.ramGraphYData.push(value);
      if(this.ramGraphYData.length>20){
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
    },
    loadMonitorData(isInit=true) {
      OvirtService.ovirtMonitorData().then((res)=>{
        if (res.data.success) {
          //cpu信息
          this.pushCpuGraphXData();
          this.pushCpuGraphYData(res.data.result.cpuUsed);
          let cpuData = {xData: this.cpuGraphXData, yData:this.cpuGraphYData};
          this.cpuUsed = res.data.result.cpuUsed;
          //内存信息
          this.pushRamGraphXData();
          this.pushRamGraphYData(res.data.result.menoryUsed);
          let ramData = {xData: this.ramGraphXData, yData:this.ramGraphYData};
          this.ramUsed = res.data.result.menoryUsed;
          //网络IO信息
          this.pushNicGraphXData();
          this.pushNicReceiveYData(this.bytesToSize(res.data.result.nicInfo.receiveData,1));
          this.pushNicTransmitYData(this.bytesToSize(res.data.result.nicInfo.transmitData,1));
          this.nicTransmitUsed = this.bytesToSize(res.data.result.nicInfo.transmitData,1);
          this.nicReceiveUsed = this.bytesToSize(res.data.result.nicInfo.receiveData,1);
          let nicData = {
            xData: this.nicGraphXData,
            yData1: this.nicTransmitYData,
            yData2: this.nicReceiveYData
          };
          if(isInit){
            this.dataStatus = true;
            this.cpuGraph =  CanvasService.DepletionGraph(document.getElementById('cpuLine'), cpuData, true, {name: 'cpu使用率', stack: 'cpu'});
            this.ramGraph =  CanvasService.DepletionGraph(document.getElementById('ramLine'), ramData, true, {name: '内存使用率', stack: 'ram'});
            this.nicGraph =  CanvasService.DepletionTwoLineGraph(document.getElementById('networkLine'), nicData, false, {name1: '发送(KB)', stack1: 'transmit',name2:'接收(KB)',stack2:'receive'});
          }else {
            this.cpuGraph.setOption({
              xAxis: [
                {
                  type: 'category',
                  data: cpuData.xData,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              series: [{
                data: cpuData.yData
              }]
            });

            this.ramGraph.setOption({
              xAxis: [
                {
                  type: 'category',
                  data: ramData.xData,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              series: [{
                data: ramData.yData
              }]
            });

            this.nicGraph.setOption({
              xAxis: [
                {
                  type: 'category',
                  data: nicData.xData,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              series: [{
                data: nicData.yData1
              },{
                data: nicData.yData2
              }]
            });
          }
        }else {
          if(isInit) {
            this.dataStatus = false;
          }
        }
      });
    },
  },
  mounted() {
    OvirtService.ovirtIndexInfo().then((res) => {
        if (res.data.success) {
          this.hostInfo=res.data.result.hostInfo;
          this.indexInfoIsLoad = false;
          CanvasService.drawServerGraph(this.$refs.server,res.data.result.hostInfo.normalHostCount,res.data.result.hostInfo.unNormalHostCount);
          this.storageInfo = res.data.result.storageInfo;
          CanvasService.drawStorage(this.$refs.store,this.bytesToSize(res.data.result.storageInfo.availableCount,4),this.bytesToSize(res.data.result.storageInfo.usedCount,4));
          this.networkInfo = res.data.result.networkInfo;
          this.alertEvents = res.data.result.alertEvents;
        }
      }
    );
    this.initLoadCpuMonitorData();
    setInterval(()=>{
      this.loadMonitorData(false);
    },1000);
  },
  computed: {},
  components: {Xclarity},
};
