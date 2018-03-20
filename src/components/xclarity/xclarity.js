import XClarityService from '@/services/XClarityService.js';

const loadMsg = '0';
export default {
  name: 'xclarity',
  data() {
    return {
      hardwareStatus: true,
      configPatternsStatus: true,
      systemImagesStatus: true,
      firmwaresStatus: true,
      jobsStatus: true,
      sessionsStatus: true,
      sysResourcesStatus: true,
      server: {
        allCount: loadMsg,
        criticalCount: loadMsg,
        warningCount: loadMsg,
        offlineCount: loadMsg,
        unknownCount: loadMsg,
        pendingCount: loadMsg,
        informationalCount: loadMsg,
        okCount: loadMsg
      },
      storage: {
        allCount: loadMsg,
        criticalCount: loadMsg,
        warningCount: loadMsg,
        offlineCount: loadMsg,
        unknownCount: loadMsg,
        pendingCount: loadMsg,
        informationalCount: loadMsg,
        okCount: loadMsg
      },
      switchInfo: {
        allCount: loadMsg,
        criticalCount: loadMsg,
        warningCount: loadMsg,
        offlineCount: loadMsg,
        unknownCount: loadMsg,
        pendingCount: loadMsg,
        informationalCount: loadMsg,
        okCount: loadMsg
      },
      chassis: {
        allCount: loadMsg,
        criticalCount: loadMsg,
        warningCount: loadMsg,
        offlineCount: loadMsg,
        unknownCount: loadMsg,
        pendingCount: loadMsg,
        informationalCount: loadMsg,
        okCount: loadMsg
      },
      rack: {
        allCount: loadMsg,
        criticalCount: loadMsg,
        warningCount: loadMsg,
        offlineCount: loadMsg,
        unknownCount: loadMsg,
        pendingCount: loadMsg,
        informationalCount: loadMsg,
        okCount: loadMsg
      },
      configPatterns: {
        withoutAssignedPatternsCount: 0,
        withAssignedPatternsCount: 0,
        deploysInProgressCount: 0,
      },
      systemImages: {
        availableOSImagesCount: 0,
        deploysInProgressCount: 0,
      },
      firmwares: {
        compliantDevicesCount: 0,
        noncompliantDevicesCount: 0,
        notSetCompliancePolicyCount: 0,
        updatesInProgressCount: 0,
      },
      jobs: {
        jobsCount: 0,
      },
      sessions: {
        columns: [
          {
            title: '用户标识',
            key: 'UserId'
          },
          {
            title: 'IP 地址',
            key: 'Address'
          }
        ],
        data: []
      },
      sysResources:{
        columns: [
          {
            title: '资源',
            key: 'Resource'
          },
          {
            title: '使用情况',
            key: 'FlatUtil'
          },{
            title: '总容量',
            key: 'Maximum'
          },
        ],
        data: []
      },
    }
  },
  methods: {
    loadHardwareInfo() {
      XClarityService.hardware().then((res) => {
        if (res.data.success) {
          const infoArray = res.data.result;
          for (let i = 0; i < infoArray.length; i++) {
            const item = infoArray[i];
            switch (item.name) {
              case 'server':
                this.server = item;
                break;
              case 'storage':
                this.storage = item;
                break;
              case 'switch':
                this.switchInfo = item;
                break;
              case 'chassis':
                this.chassis = item;
                break;
              case 'rack':
                this.rack = item;
                break;
            }
          }
        } else {
          this.hardwareStatus = false;
        }
      })
    },
    loadConfigPatterns() {
      XClarityService.configPatterns().then((res) => {
        if (res.data.success) {
          this.configPatterns = res.data.result;
        } else {
          this.configPatternsStatus = false;
        }
      })
    },
    loadSystemImages() {
      XClarityService.systemImages().then((res) => {
        if (res.data.success) {
          this.systemImages = res.data.result;
        } else {
          this.systemImagesStatus = false;
        }
      })
    },
    loadFirmwares() {
      XClarityService.firmwares().then((res) => {
        if (res.data.success) {
          this.firmwares = res.data.result;
        } else {
          this.firmwaresStatus = false;
        }
      })
    },
    loadJobs() {
      XClarityService.jobs().then((res) => {
        if (res.data.success) {
          this.jobs = res.data.result;
        } else {
          this.jobsStatus = false;
        }
      })
    },
    loadSessions() {
      XClarityService.sessions().then((res) => {
        if (res.data.success) {
          this.sessions.data = res.data.result;
        } else {
          this.sessionsStatus = false;
        }
      })
    },
    loadSysResources() {
      XClarityService.sysResources().then((res) => {
        if (res.data.success) {
          const array = [];
          for(let i = 0; i < res.data.result.length; i++){
            const item = res.data.result[i];
            let tempData = {};
            switch (item.Resource){
              case 'processor':tempData={Resource:'处理器',FlatUtil:item.Utilization,Maximum:item.Maximum+'核心'}; break;
              case 'ram':tempData={Resource:'RAM',FlatUtil:item.Utilization+`%(${item.FlatUtil}GB)`,Maximum:item.Maximum+'GB'}; break;
              case 'hdd':tempData={Resource:'硬盘',FlatUtil:item.Utilization+`%(${item.FlatUtil}GB)`,Maximum:item.Maximum+'GB'}; break;
            }
            array.push(tempData);
          }
          this.sysResources.data = array;
        } else {
          this.sysResourcesStatus = false;
        }
      })
    },
  },
  created() {
    this.loadConfigPatterns();
    this.loadHardwareInfo();
    this.loadSystemImages();
    this.loadFirmwares();
    this.loadJobs();
    this.loadSessions();
    this.loadSysResources();
  },
  mounted() {

  }
};
