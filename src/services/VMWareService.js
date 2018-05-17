import CONFIG from '@/utils/config';
import axios from 'axios';

const VMWareInfo = () => axios.get(CONFIG.api.VMWareInfo);
const getHostMonitorData = (hostName) => axios.get(CONFIG.api.VMHostMonitorData,{params:{hostName}});
const getDataCenterMonitorData = (dataCenterName) => axios.get(CONFIG.api.VMDataCenterMonitorData,{params:{dataCenterName}});
const getClusterMonitorData = (clusterName) => axios.get(CONFIG.api.VMClusterMonitorData,{params:{clusterName}});
const getVMMonitorData = (vmName) => axios.get(CONFIG.api.VMMonitorData,{params:{vmName}});
const getDSMonitorData = (dsName) => axios.get(CONFIG.api.VMDSMonitorData,{params:{dsName}});
const getNetworkMonitorData = (networkName) => axios.get(CONFIG.api.VMNetworkMonitorData,{params:{networkName}});
export default {
  VMWareInfo,getHostMonitorData,getDataCenterMonitorData,getClusterMonitorData,getVMMonitorData,getDSMonitorData,getNetworkMonitorData
};
