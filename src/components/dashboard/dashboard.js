import CanvasService from '@/services/CanvasService.js';
import VMWareService from '@/services/VMWareService.js';
import Xclarity from '@/components/xclarity/xclarity.vue';

const loadMsg = '加载中...';
const loadErrorMsg = [];
export default {
  name: 'dashboard',
  data() {
    return {
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
                    this.on_selection_change(params.item.name)
                  }
                }
              }, '查看')
            ])
          }
        }
      ],
      data1: [],
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
      hostName: ''
    }
  },
  methods: {
    on_selection_change(data){
      if(this.hostName!=data){
        this.hostName=data;
      }
    },
    gotoVMWare(){
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
        for (let count = 0;count < hostList.length ;count++) {
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
    getLineData(data){
      let returnData = {};
      returnData.xData = data.xLine;
      for(let i = 0 ;i<data.longs.length;i++){
        if(data.longs[i].instance==''){
          returnData.yData = data.longs[i].list;
          break;
        }
      }

      return returnData;
    },
    loadMonitorData(val){
      VMWareService.getMonitorData(val).then((res) => {
        if (res.data.success) {
          this.dataStatus = true;
          CanvasService.drawCPUDepletionGraph(this.$refs.cpuLine, this.getLineData(res.data.result.cpuMap));
          CanvasService.drawMemoryDepletionGraph(this.$refs.ramLine, this.getLineData(res.data.result.memMap));
          CanvasService.drawStoreDepletionGraph(this.$refs.storeLine, this.getLineData(res.data.result.diskMap));
          CanvasService.drawNetWorkDepletionGraph(this.$refs.networkLine, this.getLineData(res.data.result.netMap));
        }else{
          this.dataStatus=false;
        }
      });
      }
  },
  mounted() {
    VMWareService.VMWareInfo().then((res) => {
      if (res.data.success) {
        this.data = res.data.result;
        if (this.data.hostList && this.data.hostList.length > 0) {
          this.hostName = this.getHostName(this.data.hostList);
          this.data1 = this.getHostTables(this.data.hostList);
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
  watch: {
    hostName(curVal, oldVal) {
      this.loadMonitorData(curVal);
    }
  },
  components: {Xclarity},
};
