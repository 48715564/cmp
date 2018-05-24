import CanvasService from '@/services/CanvasService.js';
import OpenStackService from '@/services/OpenStackService.js';
import Xclarity from '@/components/xclarity/xclarity.vue';
import Vue from 'vue';
import _ from 'lodash';

Vue.component('top-dashboard', {
  props: ['name', 'iconClass', 'columns', 'on_selection_change', 'data', 'isShowHight', 'count', 'height'],
  template: '<div class="item">\n' +
  '          <div :class="iconClass" style="font-size: 2rem"></div>\n' +
  '          <div class="item-right">\n' +
  '            <div style="text-align: center;font-size: x-large">\n' +
  '              <at-popover trigger="click" placement="bottom" v-if="count>0">\n' +
  '                <a href="javascript:void(0)">{{count}}</a>\n' +
  '                <template slot="content">\n' +
  '                  <at-table :columns="columns" :on-selection-change="on_selection_change" :data="data"\n' +
  '                            v-if="isShowHight" :height="height"></at-table>\n' +
  '                  <at-table :columns="columns" :on-selection-change="on_selection_change" :data="data"\n' +
  '                            v-else></at-table>\n' +
  '                </template>\n' +
  '              </at-popover>\n' +
  '                <span v-else>{{count}}</span>' +
  '            </div>\n' +
  '            <div class="small-text">{{name}}</div>\n' +
  '          </div>\n' +
  '        </div>',
});


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

Vue.component('tableCard', {
  props: ['name', 'columns', 'data', 'isShowHight', 'keyValue', 'dataStatus'],
  template: '<div class="item">\n' +
  '            <p class="item-title">{{name}}</p>\n' +
  '            <div class="item-content" style="width: 100%;height: 100%;display: flex;justify-content: center;"\n' +
  '                 v-if="dataStatus">\n' +
  '              <div v-if="isShowHight" style="height:200px;width: 100%;overflow-y: auto;"><at-table :key="keyValue" :columns="columns" :data="data" stripe style="width: 100%;margin-top: 10px;" border></at-table></div>\n' +
  '              <at-table :key="keyValue" :columns="columns" :data="data" stripe style="width: 100%;margin-top: 10px;" v-else border></at-table>\n' +
  '            </div>\n' +
  '            <div class="item-empty" v-else><p>暂无数据</p></div>\n' +
  '          </div>'
});


const loadMsg = '加载中...';
const loadErrorMsg = '服务端异常';
const netStatus = {
  ACTIVE: '激活',
  DOWN: '停止',
  BUILD: '构建',
  ERROR: '错误'
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
};

const toLocaleString = function getDate(date) {
  return new Date(date).toLocaleString();
};

const getVmPowerState = (state) => {
  switch (state) {
    case "0":
      return '无状态';
      break;
    case "1":
      return '运行中';
      break;
    case "3":
      return '暂停';
      break;
    case "4":
      return '关闭';
      break;
    case "6":
      return '坠毁';
      break;
    case "7":
      return '悬浮';
      break;
    default :
      break;
  }
}

const propertiesColumn = [{
  title: '属性名称',
  key: 'name'
}, {
  title: '属性值',
  key: 'value'
},];
const nameColumn = {
  title: '名称',
  key: 'name'
};
const propertiesTable = {
  columns: propertiesColumn,
  data: [],
};
export default {
  name: 'dashboard',
  data() {
    return {
      DepletionGraph1: null,
      DepletionGraph2: null,
      DepletionGraph3: null,
      DepletionGraph4: null,
      DepletionGraph5: null,
      DepletionGraph6: null,
      DepletionGraph7: null,
      DepletionGraph8: null,
      mainType: 0,
      moName: '',
      graphNames: {
        name1: '',
        name2: '',
        name3: '',
        name4: ''
      },
      tableInfo: {
        infoTable: _.clone(propertiesTable),
        vmBaseTable: _.clone(propertiesTable),
        vmSpecTable: _.clone(propertiesTable),
        vmIPTable: _.clone(propertiesTable),
        vmImagesTable: _.clone(propertiesTable),
        netBaseTable: _.clone(propertiesTable),
        netSupplierTable: _.clone(propertiesTable),
        subNetTable: {
          columns: [{
            title: '名称',
            key: 'name'
          }, {
            title: 'CIDR',
            key: 'cidr'
          }, {
            title: 'IP版本',
            key: 'ip_version'
          }, {
            title: '网关IP',
            key: 'gateway_ip'
          }],
          data: [],
        },
        netPortTable: {
          columns: [{
            title: '名称',
            key: 'name_str'
          }, {
            title: '固定IP',
            key: 'fixed_ips_str'
          }, {
            title: '连接设备',
            key: 'device_owner'
          }, {
            title: '状态',
            key: 'status'
          }, {
            title: '管理状态',
            key: 'admin_state_up'
          }],
          data: [],
        },
        DHCPAgentsTable: {
          columns: [nameColumn, {
            title: '状态',
            key: 'value'
          }, {
            title: '管理状态',
            key: 'value'
          }],
          data: [],
        },
        imagesTable: {
          columns: [
            nameColumn,
            {
              title: '状态',
              key: 'status'
            },
            {
              title: '可见性',
              key: 'visibility'
            },
            {
              title: '操作',
              render: (h, params) => {
                return this.tableRender(h, params, '3', false, 'id', 'name');
              }
            }
          ],
          data: []
        },
        imagesBaseTable: _.clone(propertiesTable),
        imagesSpecTable: _.clone(propertiesTable),
        imagesCAttrTable: _.clone(propertiesTable),
        imagesSecurityTable: _.clone(propertiesTable),
        flavorsTable: {
          columns: [
            nameColumn,
            {
              title: '是否公有',
              key: 'os-flavor-access:is_public'
            },
            {
              title: '操作',
              render: (h, params) => {
                return this.tableRender(h, params, '4', false, 'id', 'name');
              }
            }
          ],
          data: []
        },
        flavorsInfoTable: _.clone(propertiesTable),
        flavorsInfoVmTable: {
          columns: [
            {title: 'id', key: 'id'},
            {title: '名称', key: 'name'},
            {
              title: '创建时间',
              render: (h, params) => {
                return h('div', {}, toLocaleString(params.item['created']));
              }
            }
          ],
          data: [],
        },
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
                return this.tableRender(h, params, '1', false, 'id', 'hypervisor_hostname');
              }
            }
          ],
          data: []
        },
        vmTable: {
          columns: [nameColumn,
            {
              title: '电源状态',
              key: 'status',
              render: (h, params) => {
                return h('div', {}, getVmPowerState(params.item['OS-EXT-STS:power_state']));
              }
            },
            {
              title: '操作',
              render: (h, params) => {
                return this.tableRender(h, params, '2', false, 'id', 'name');
              }
            }
          ],
          data: []
        },
        netTable: {
          columns: [nameColumn,
            {
              title: '状态',
              key: 'status',
              render: (h, params) => {
                return h('div', {}, netStatus[params.item.status.toUpperCase()])
              }
            },
            {
              title: '操作',
              render: (h, params) => {
                return this.tableRender(h, params, '6', false, 'id', 'name');
              }
            }],
          data: []
        },
      },
      data: {
        hypervisorCount: loadMsg,
        imagesCount: loadMsg,
        flavorsCount: loadMsg,
        memory: loadMsg,
        networkCount: loadMsg,
        runningVmCount: loadMsg,
      },
      infoMap: null,
      dataStatus: true,
      historyData: true,
      isXClarity: false,
    }
  },
  methods: {
    on_selection_change(id, name, type) {
      this.mainType = type;
      this.moName = name;
      switch (type) {
        case '1':
          this.graphNames = {name1: '主机信息', name2: 'VCPU使用情况', name3: '内存使用情况(MB)', name4: '本地磁盘使用情况(GB)'};
          this.loadMonitorData(id, OpenStackService.openStackHostById, [{
            name: 'VCPU使用情况'
          }, {name: '内存使用情况'}, {name: '本地磁盘使用情况'}], ["bar1", "bar2", "bar3"], this.hostCallbackFun);
          break;
        case '2':
          this.graphNames = {name1: '概况', name2: '规格信息', name3: 'IP信息', name4: '镜像信息'};
          this.loadMonitorData(id, OpenStackService.openStackVMById, null, null, this.vmCallbackFun);
          break;
        case '3':
          this.graphNames = {name1: '概况', name2: '规格信息', name3: '定制属性', name4: '安全'};
          this.loadMonitorData(id, OpenStackService.openStackImagesById, null, null, this.imagesCallbackFun);
          break;
        case '4':
          this.graphNames = {name1: '概况', name2: '生成虚拟机列表'};
          this.loadMonitorData(id, OpenStackService.openStackFlavorsById, null, null, this.flavorsCallbackFun);
          break;
        case '6':
          this.graphNames = {name1: '基本信息', name2: '供应商网络', name3: '子网', name4: '端口'};
          this.loadMonitorData(id, OpenStackService.openStackNetworkById, null, null, this.netCallbackFun);
          break;
        default:
          break;
      }
    },

    tableRender(h, params, type, disable = false, propetiesID, propetiesName) {
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
              this.on_selection_change(params.item[propetiesID], params.item[propetiesName], type)
            }
          }
        }, '查看')
      ])
    },
    reloadPage() {
      window.location.reload();
    },
    isShowHight: function (size, length = 7) {
      if (size > length) {
        return true
      } else {
        return false;
      }
    },
    gotoOpenStack() {
      window.open("http://10.0.2.5");
    },
    bytesToSize: function (bytes, i) {
      if (bytes === 0) return '0';
      let k = 1024;
      return (bytes / Math.pow(k, i));
      //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
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
        dateArray.push(data[i].createTm);
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
    changeDataFun(data) {
      if (data.type == 'host') {
        let infoArray = [];
        infoArray.push({'name': '主机名', 'value': data.item.hypervisor_hostname});
        infoArray.push({'name': '主机类型', 'value': data.item.hypervisor_type});
        infoArray.push({'name': '虚拟机个数', 'value': data.item.running_vms});
        infoArray.push({'name': '启用状态', 'value': data.item.status});
        infoArray.push({'name': '开关状态', 'value': data.item.state});
        infoArray.push({'name': '主机IP', 'value': data.item.host_ip});
        let barData = [];
        let barData1 = [];
        barData1.push({'name': '可用', 'value': (data.item.vcpus - data.item.vcpus_used)});
        barData1.push({'name': '已用', 'value': data.item.vcpus_used});
        barData.push(barData1);
        let barData2 = [];
        barData2.push({'name': '可用', 'value': (data.item.memory_mb - data.item.memory_mb_used)});
        barData2.push({'name': '已用', 'value': data.item.memory_mb_used});
        barData.push(barData2);
        let barData3 = [];
        barData3.push({'name': '可用', 'value': (data.item.local_gb - data.item.local_gb_used)});
        barData3.push({'name': '已用', 'value': data.item.local_gb_used});
        barData.push(barData3);
        return {infoArray: infoArray, barData: barData};
      } else if (data.type == 'vm') {
        let vmBaseArray = [];
        vmBaseArray.push({'name': '虚拟机名', 'value': data.item.name});
        vmBaseArray.push({'name': 'ID', 'value': data.item.id});
        vmBaseArray.push({'name': '电源状态', 'value': getVmPowerState(data.item['OS-EXT-STS:power_state'])});
        vmBaseArray.push({'name': '可用域', 'value': data.item['OS-EXT-AZ:availability_zone']});
        vmBaseArray.push({'name': '创建时间', 'value': toLocaleString(data.item.created)});
        vmBaseArray.push({'name': '主机', 'value': data.item['OS-EXT-SRV-ATTR:host']});
        let vmSpecArray = [];
        vmSpecArray.push({'name': '实例类型名称', 'value': data.item.flavor.name});
        vmSpecArray.push({'name': '实例类型ID', 'value': data.item.flavor.id});
        vmSpecArray.push({'name': '内存(MB)', 'value': data.item.flavor.ram});
        vmSpecArray.push({'name': 'VCPU数量', 'value': data.item.flavor.vcpus});
        vmSpecArray.push({'name': '磁盘(GB)', 'value': data.item.flavor.disk});
        let vmIPArray = [];
        for (var p in data.item.addresses.addresses) {
          vmIPArray.push({'name': p, 'value': _.join(_.map(data.item.addresses.addresses[p], 'addr'), ',<br/>')});
        }
        let vmImagesArray = [];
        vmImagesArray.push({'name': '镜像名称', 'value': data.item.image.name});
        vmImagesArray.push({'name': '镜像ID', 'value': data.item.image.id});
        vmImagesArray.push({'name': '最小内存(MB)', 'value': data.item.image.minRam});
        vmImagesArray.push({'name': '最小磁盘(GB)', 'value': data.item.image.minDisk});
        return {vmBaseArray: vmBaseArray, vmSpecArray: vmSpecArray, vmIPArray: vmIPArray, vmImagesArray: vmImagesArray};
      } else if (data.type == 'network') {
        let netBaseTableArray = [];
        netBaseTableArray.push({'name': '名称', 'value': data.item.network.name});
        netBaseTableArray.push({'name': 'ID', 'value': data.item.network.id});
        netBaseTableArray.push({'name': '项目ID', 'value': data.item.network.tenant_id});
        netBaseTableArray.push({'name': '状态', 'value': netStatus[data.item.network.status.toUpperCase()]});
        netBaseTableArray.push({'name': '管理状态', 'value': data.item.network.admin_state_up});
        netBaseTableArray.push({'name': '共享的', 'value': data.item.network.shared});
        netBaseTableArray.push({'name': '外部网络', 'value': data.item.network['router:external ']});
        netBaseTableArray.push({'name': 'MTU', 'value': data.item.network.mtu});

        let netSupplierTableArray = [];
        netSupplierTableArray.push({'name': '网络类型', 'value': data.item.network['provider:network_type']});
        netSupplierTableArray.push({
          'name': '物理网络',
          'value': data.item.network['provider:physical_network'] == null ? "-" : data.item.network['provider:physical_network']
        });
        netSupplierTableArray.push({'name': '段ID', 'value': data.item.network['provider:segmentation_id']});

        let subNetTableArray = data.item.network.neutronSubnets;
        _.each(data.item.portList, item => {
          let name_str = item.name ? item.name : item.id.split('-')[0];
          item.name_str = name_str
          let fixed_ips_str = _.join(_.map(item.fixed_ips, 'ip_address'), ',');
          item.fixed_ips_str = fixed_ips_str;
        })
        let netPortTableArray = data.item.portList;
        return {
          netBaseTableArray: netBaseTableArray,
          netSupplierTableArray: netSupplierTableArray,
          subNetTableArray: subNetTableArray,
          netPortTableArray: netPortTableArray
        };
      } else if (data.type == 'image') {
        let imagesBaseTable = [], imagesSpecTable = [], imagesCAttrTable = [], imagesSecurityTable = [];
        imagesBaseTable.push({'name': '名称', 'value': data.item.name});
        imagesBaseTable.push({'name': 'ID', 'value': data.item.id});
        imagesBaseTable.push({'name': '状态', 'value': data.item.status.toUpperCase()});
        imagesBaseTable.push({'name': '创建于', 'value': toLocaleString(data.item.created_at)});
        imagesBaseTable.push({'name': '更新于', 'value': toLocaleString(data.item.updated_at)});

        imagesSpecTable.push({'name': '大小(MB)', 'value': this.bytesToSize(data.item.size, 2)});
        imagesSpecTable.push({'name': '最小磁盘大小(GB)', 'value': data.item.min_disk});
        imagesSpecTable.push({'name': '最小内存(MB)', 'value': data.item.min_ram});
        imagesSpecTable.push({'name': '磁盘格式', 'value': data.item.disk_format});
        imagesSpecTable.push({'name': '容器格式', 'value': data.item.container_format});

        imagesCAttrTable.push({'name': 'schema', 'value': data.item.schema});
        imagesCAttrTable.push({'name': '虚拟大小', 'value': data.item.virtual_size});
        imagesCAttrTable.push({'name': 'file', 'value': data.item.file});
        imagesCAttrTable.push({'name': '标签', 'value': _.join(data.item.tags, ',')});

        imagesSecurityTable.push({'name': '所有者', 'value': data.item.owner});
        imagesSecurityTable.push({'name': '可见性', 'value': data.item.visibility});
        imagesSecurityTable.push({'name': '受保护的', 'value': data.item.protected});
        imagesSecurityTable.push({'name': '校验和', 'value': data.item.checksum});
        return {
          imagesBaseTable: imagesBaseTable,
          imagesSpecTable: imagesSpecTable,
          imagesCAttrTable: imagesCAttrTable,
          imagesSecurityTable: imagesSecurityTable
        };
      } else if (data.type == 'flavor') {
        let flavorsInfoTable = [], flavorsInfoVmTable = [];
        flavorsInfoTable.push({'name': 'ID', 'value': data.item.flavor.id});
        flavorsInfoTable.push({'name': '名称', 'value': data.item.flavor.name});
        flavorsInfoTable.push({'name': 'VCPU数量', 'value': data.item.flavor.vcpus});
        flavorsInfoTable.push({'name': '内存(GB)', 'value': this.bytesToSize(data.item.flavor.ram, 1)});
        flavorsInfoTable.push({'name': '根磁盘(GB)', 'value': data.item.flavor.disk});
        flavorsInfoTable.push({'name': '临时磁盘(GB)', 'value': data.item.flavor['OS-FLV-EXT-DATA:ephemeral']});
        flavorsInfoTable.push({'name': 'Swap磁盘(MB)', 'value': data.item.flavor.swap});
        flavorsInfoTable.push({'name': 'RX/TX 因子', 'value': data.item.flavor.rxtx_factor});
        flavorsInfoTable.push({'name': '公有', 'value': data.item.flavor['os-flavor-access:is_public']});

        flavorsInfoVmTable = data.item.vmList;
        return {flavorsInfoTable: flavorsInfoTable, flavorsInfoVmTable: flavorsInfoVmTable};
      }
    },
    changeNullData(data) {
      if (data) {
        return data;
      } else {
        return [];
      }
    },
    hostCallbackFun(result, divIds, series) {
      let count = 0;
      let changeData = this.changeDataFun(result);
      this.tableInfo.infoTable.data = this.changeNullData(changeData.infoArray);
      _.each(divIds, item => {
        CanvasService.DepletionGraphBar(document.getElementById(item), changeData.barData[count], series[count]);
        count++;
      });
    },
    flavorsCallbackFun(result) {
      let changeData = this.changeDataFun(result);
      this.tableInfo.flavorsInfoTable.data = this.changeNullData(changeData.flavorsInfoTable);
      this.tableInfo.flavorsInfoVmTable.data = this.changeNullData(changeData.flavorsInfoVmTable);
    },
    imagesCallbackFun(result) {
      let changeData = this.changeDataFun(result);
      this.tableInfo.imagesBaseTable.data = this.changeNullData(changeData.imagesBaseTable);
      this.tableInfo.imagesSpecTable.data = this.changeNullData(changeData.imagesSpecTable);
      this.tableInfo.imagesCAttrTable.data = this.changeNullData(changeData.imagesCAttrTable);
      this.tableInfo.imagesSecurityTable.data = this.changeNullData(changeData.imagesSecurityTable);
    },
    netCallbackFun(result) {
      let changeData = this.changeDataFun(result);
      this.tableInfo.netBaseTable.data = this.changeNullData(changeData.netBaseTableArray);
      this.tableInfo.netSupplierTable.data = this.changeNullData(changeData.netSupplierTableArray);
      this.tableInfo.subNetTable.data = this.changeNullData(changeData.subNetTableArray);
      this.tableInfo.netPortTable.data = this.changeNullData(changeData.netPortTableArray);
    },
    vmCallbackFun(result) {
      let changeData = this.changeDataFun(result);
      this.tableInfo.vmBaseTable.data = this.changeNullData(changeData.vmBaseArray);
      this.tableInfo.vmSpecTable.data = this.changeNullData(changeData.vmSpecArray);
      this.tableInfo.vmIPTable.data = this.changeNullData(changeData.vmIPArray);
      this.tableInfo.vmImagesTable.data = this.changeNullData(changeData.vmImagesArray);
    },
    loadMonitorData(val, fun, series, divIds, callbackFun) {
      _.each(divIds, item => {
        if (document.getElementById(item)) {
          document.getElementById(item).innerHTML = loadMsg;
        }
      })
      fun(val).then((res) => {
        if (res.data.success) {
          this.dataStatus = true;
          callbackFun(res.data.result, divIds, series);
        } else {
          this.dataStatus = false;
        }
      });
    },
  },
  mounted() {
    OpenStackService.openStackInfo().then((res) => {
      if (res.data.success) {
        this.data = res.data.result;
        this.infoMap = res.data.result.infoMap;
        this.DepletionGraph1 = CanvasService.drawCPUDepletionGraphBar(document.getElementById('cpu'), this.getCpuChartData(this.data));
        this.DepletionGraph2 = CanvasService.drawMemoryDepletionGraphBar(document.getElementById('ram'), this.getMemoryChartData(this.data));
        this.DepletionGraph3 = CanvasService.drawStoreDepletionGraphBar(document.getElementById('store'), this.getStoreChartData(this.data));
      } else {
        this.dataStatus = false;
        this.data = {
          hypervisorCount: loadErrorMsg,
          imagesCount: loadErrorMsg,
          flavorsCount: loadErrorMsg,
          memory: loadErrorMsg,
          networkCount: loadErrorMsg,
          runningVmCount: loadErrorMsg,
        }
      }
    });
    OpenStackService.openStackInfoHistory().then((res) => {
      if (res.data.success) {
        const tmpData = res.data.result;
        const xLineData = this.getChartXLineData(tmpData);
        const yLineData = this.getCpuChartYLineData(tmpData);
        const cpuData = {...xLineData, yData: yLineData};
        this.DepletionGraph4 = CanvasService.drawCPUDepletionGraph(document.getElementById('cpuLine'), cpuData);
        const yMemoryData = this.getMemoryChartYLineData(tmpData);
        const memoryData = {...xLineData, yData: yMemoryData};
        this.DepletionGraph5 = CanvasService.drawMemoryDepletionGraph(document.getElementById('ramLine'), memoryData);
        const yNetWorkData = this.getNetChartYLineData(tmpData);
        const netData = {...xLineData, yData: yNetWorkData};
        this.DepletionGraph6 = CanvasService.drawNetWorkDepletionGraph(document.getElementById('network'), netData);
        const yStoreData = this.getStoreChartYLineData(tmpData);
        const storeData = {...xLineData, yData: yStoreData};
        this.DepletionGraph7 = CanvasService.drawStoreDepletionGraph(document.getElementById('storeLine'), storeData);
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
        this.tableInfo.imagesTable.data = val.imagesList;
        this.tableInfo.flavorsTable.data = val.flavorsList;
      }
    }
  },
  computed: {
    mainTypeName: function () {
      switch (this.mainType) {
        case '1':
          return '主机:' + this.moName;
          break;
        case '2':
          return '虚拟机:' + this.moName;
          break;
        case '3':
          return '镜像:' + this.moName;
          break;
        case '4':
          return '实例类型:' + this.moName;
          break;
        case '5':
          return '卷:' + this.moName;
          break;
        case '6':
          return '网络:' + this.moName;
          break;
        default:
          break;
      }
    },
  },
  components: {Xclarity},
};
