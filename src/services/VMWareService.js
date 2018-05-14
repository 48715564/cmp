import CONFIG from '@/utils/config';
import axios from 'axios';

const VMWareInfo = () => axios.get(CONFIG.api.VMWareInfo);
const getMonitorData = (hostName) => axios.get(CONFIG.api.VMMonitorData,{params:{hostName}});
export default {
  VMWareInfo,getMonitorData
};
