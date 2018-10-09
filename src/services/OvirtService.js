import CONFIG from '@/utils/config';
import axios from 'axios';

const ovirtIndexInfo = () => axios.get(CONFIG.api.ovirtIndexInfoData);
const ovirtMonitorData = () => axios.get(CONFIG.api.ovirtMonitorData);
const ovirtMonitorStoreIOPSData = () => axios.get(CONFIG.api.ovirtMonitorStoreIOPSData);
const ovirtMonitorNowStoreIOPSData = ()=>axios.get(CONFIG.api.ovirtMonitorNowStoreIOPSData);

export default {
  ovirtIndexInfo,
  ovirtMonitorData,
  ovirtMonitorStoreIOPSData,
  ovirtMonitorNowStoreIOPSData
};
