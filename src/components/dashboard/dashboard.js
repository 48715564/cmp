import CanvasService from '@/services/CanvasService.js';
import OpenStackService from '@/services/OpenStackService.js';
import Xclarity from '@/components/xclarity/xclarity.vue';
import Vue from 'vue';

Vue.component('top-dashboard', {
  props: ['name', 'iconClass', 'columns','on_selection_change','data','isShowHight','count'],
  template: '<div class="item">\n' +
  '          <div :class="iconClass" style="font-size: 2rem"></div>\n' +
  '          <div class="item-right">\n' +
  '            <div style="text-align: center">\n' +
  '              <at-popover trigger="click" placement="bottom">\n' +
  '                <a href="javascript:void(0)">{{count}}</a>\n' +
  '                <template slot="content">\n' +
  '                  <at-table :columns="columns" :on-selection-change="on_selection_change" :data="data"\n' +
  '                            v-if="isShowHight" height="350"></at-table>\n' +
  '                  <at-table :columns="columns" :on-selection-change="on_selection_change" :data="data"\n' +
  '                            v-else></at-table>\n' +
  '                </template>\n' +
  '              </at-popover>\n' +
  '            </div>\n' +
  '            <div class="small-text">{{name}}</div>\n' +
  '          </div>\n' +
  '        </div>',
});

const loadMsg = '加载中...';
const loadErrorMsg = '服务端异常';
const netStatus = {
  ACTIVE:'激活',
  DOWN:'停止',
  BUILD:'构建',
  ERROR:'错误'
};
const vmStatus = {
  ACTIVE: '活动状态',
  BUILD: '尚未完成原始构建过程。',
  DELETED: '被永久删除。',
  ERROR: '出错了。',
  HARD_REBOOT: '很难重新启动。这相当于拔下物理服务器上的电源插头，将其插回，然后重新启动它。',
  MIGRATING: '正在迁移到新主机。',
  PASSWORD: '密码正在重置。',
  PAUSED: '在暂停状态下，服务器的状态存储在RAM中。暂停的服务器继续以冻结状态运行。',
  REBOOT: '服务器处于软重启状态。重新启动命令已传递给操作系统。',
  REBUILD: '服务器当前正在从图像重建。',
  RESCUE: '服务器处于救援模式。救援图像在附带原始服务器映像的情况下运行。',
  RESIZE: '服务器正在执行初始复制期间更改的数据的差异副本。服务器在这个阶段停机。',
  REVERT_RESIZE: '由于某种原因，服务器的大小调整或迁移失败。目标服务器正在清理并且原始源服务器正在重新启动。',
  SHELVED: '服务器处于搁置状态。根据搁置卸载时间，服务器将自动卸载。',
  SHELVED_OFFLOADED: '搁置的服务器已卸载（从计算主机中移除），并且需要未保存的操作才能再次使用。',
  SHUTOFF: '服务器已关闭，磁盘映像仍然存在。',
  SOFT_DELETED: '服务器被标记为已删除，但磁盘映像仍可用于还原。',
  SUSPENDED: '服务器被挂起，无论是通过请求还是必要的。',
  UNKNOWN: '服务器的状态是未知的。联系您的云提供商。',
  VERIFY_RESIZE: '系统正在等待移动或调整大小后确认服务器正在运行。',
}
const nameColumn = {
  title: '名称',
  key: 'name'
};
export default {
  name: 'dashboard',
  data() {
    return {
      tableInfo: {
        hostTable: {
          columns: [
            {
              title: '名称',
              key: 'hypervisor_hostname'
            },
            {
              title: '启用状态',
              key: 'status'
            },
            {
              title: '开关状态',
              key: 'state'
            },
            {
              title: '操作',
              render: (h, params) => {
                return this.tableRender(h, params, '5', false, 'id');
              }
            }
          ],
          data: []
        },
        vmTable: {
          columns: [nameColumn,
            {
              title: '状态',
              key: 'status',
              render: (h, params) => {
                return h('div', {},vmStatus[params.item.status.toUpperCase()])
              }
            },
            {
              title: '操作',
              render: (h, params) => {
                return this.tableRender(h, params, '5', false, 'id');
              }
            }
          ],
          data: []
        },
        netTable: {
          columns: [{
            title: '名称',
            key: 'name'
          },
            {
              title: '状态',
              key: 'status',
              render: (h, params) => {
                return h('div', {},netStatus[params.item.status.toUpperCase()])
              }
            },
            {
              title: '操作',
              render: (h, params) => {
                return this.tableRender(h, params, '5', false, 'id');
              }
            }],
          data: []
        },
      },
      data: {
        hypervisorCount: loadMsg,
        runningVmCount: loadMsg,
        local: loadMsg,
        virtualCpu: loadMsg,
        memory: loadMsg,
        networkCount: loadMsg,
      },
      infoMap: null,
      dataStatus: true,
      historyData: true,
      isXClarity: false,
    }
  },
  methods: {
    on_selection_change(data, type) {

    },

    tableRender(h, params, type, disable = false, propetiesName) {
      return h('div', [
        h('AtButton', {
          props: {
            size: 'small',
            hollow: true,
            disabled: disable
          },
          style: {
            marginRight: '8px'
          },
          on: {
            click: () => {
              this.on_selection_change(params.item[propetiesName], type)
            }
          }
        }, '查看')
      ])
    },
    isShowHight: function (size) {
      if (size > 7) {
        return true
      } else {
        return false;
      }
    },
    gotoOpenStack() {
      window.open("http://10.0.2.5");
    },
    logout() {
      localStorage.token = '';
      location.reload(true);
    },
    //拆分时间
    getChartXLineData(data) {
      let dateArray = [];
      let startDate = '';
      let endDate = '';
      let title = '';
      for (let i = 0; i < data.length; i++) {
        dateArray.push(data[i].createTm.split(" ")[0]);
        if (i == 0) {
          startDate = data[i].createTm.split(" ")[0];
        } else if (i == data.length - 1) {
          endDate = data[i].createTm.split(" ")[0];
        }
      }
      if (startDate == endDate) {
        title = startDate + "数据";
      } else {
        title = startDate + "至" + endDate + "数据";
      }
      return {xData: dateArray, title: title};
    },
    //获得cpu信息
    getCpuChartData(data) {
      return [{
        name: '可用',
        value: data.virtualCpu - data.virtualUsedCpu,
      }, {
        name: '已用',
        value: data.virtualUsedCpu,
      }
      ]
    },
    //获得内存信息
    getMemoryChartData(data) {
      return [{
        name: '可用',
        value: data.memory - data.memoryUsed,
      }, {
        name: '已用',
        value: data.memoryUsed,
      }
      ]
    },
    //获得存储信息
    getStoreChartData(data) {
      return [{
        name: '可用',
        value: data.freeDisk,
      }, {
        name: '已用',
        value: data.localUsed,
      }]
    },
    //获得cpu信息
    getCpuChartYLineData(data) {
      let cpuCountArray = [];
      let cpuUseCountArray = [];
      for (let i = 0; i < data.length; i++) {
        cpuCountArray.push(data[i].virtualCpu);
        cpuUseCountArray.push(data[i].virtualUsedCpu);
      }
      return {
        cpuCountData: cpuCountArray,
        cpuUseCountData: cpuUseCountArray,
      }
    },
    //获得内存信息
    getMemoryChartYLineData(data) {
      let memoryCountArray = [];
      let memoryUseCountArray = [];
      for (let i = 0; i < data.length; i++) {
        memoryCountArray.push(data[i].memory);
        memoryUseCountArray.push(data[i].memoryUsed);
      }
      return {
        memoryCountData: memoryCountArray,
        memoryUseCountData: memoryUseCountArray,
      }
    },
    //获得存储信息
    getStoreChartYLineData(data) {
      let localArray = [];
      let localUseArray = [];
      for (let i = 0; i < data.length; i++) {
        localArray.push(data[i].local);
        localUseArray.push(data[i].localUsed);
      }
      return {
        localArray,
        localUseArray
      }
    },
    //获得网络信息
    getNetChartYLineData(data) {
      let netCountArray = [];
      for (let i = 0; i < data.length; i++) {
        netCountArray.push(data[i].networkCount);
      }
      return {
        netCountArray: netCountArray
      }
    },
    server() {
    },
  },
  mounted() {
    OpenStackService.openStackInfo().then((res) => {
      if (res.data.success) {
        this.data = res.data.result;
        this.infoMap = res.data.result.infoMap;
        CanvasService.drawCPUDepletionGraphBar(this.$refs.cpu, this.getCpuChartData(this.data));
        CanvasService.drawMemoryDepletionGraphBar(this.$refs.ram, this.getMemoryChartData(this.data));
        CanvasService.drawStoreDepletionGraphBar(this.$refs.store, this.getStoreChartData(this.data));
      } else {
        this.dataStatus = false;
        this.data = {
          hypervisorCount: loadErrorMsg,
          runningVmCount: loadErrorMsg,
          local: loadErrorMsg,
          virtualCpu: loadErrorMsg,
          memory: loadErrorMsg,
          networkCount: loadErrorMsg
        }
      }
    });
    OpenStackService.openStackInfoHistory().then((res) => {
      if (res.data.success) {
        const tmpData = res.data.result.list;
        const xLineData = this.getChartXLineData(tmpData);
        const yLineData = this.getCpuChartYLineData(tmpData);
        const cpuData = {...xLineData, yData: yLineData};
        CanvasService.drawCPUDepletionGraph(this.$refs.cpuLine, cpuData);
        const yMemoryData = this.getMemoryChartYLineData(tmpData);
        const memoryData = {...xLineData, yData: yMemoryData};
        CanvasService.drawMemoryDepletionGraph(this.$refs.ramLine, memoryData);
        const yNetWorkData = this.getNetChartYLineData(tmpData);
        const netData = {...xLineData, yData: yNetWorkData};
        CanvasService.drawNetWorkDepletionGraph(this.$refs.network, netData);
        const yStoreData = this.getStoreChartYLineData(tmpData);
        const storeData = {...xLineData, yData: yStoreData};
        CanvasService.drawStoreDepletionGraph(this.$refs.storeLine, storeData);
      } else {
        this.historyData = false;
      }
    });
  },
  watch: {
    infoMap: function (val, oldVal) {
      if (val) {
        this.tableInfo.hostTable.data = val.hostList;
        this.tableInfo.vmTable.data = val.vmList;
        this.tableInfo.netTable.data = val.netList;
      }
    }
  },
  components: {Xclarity},
};
