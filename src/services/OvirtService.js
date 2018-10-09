import CONFIG from '@/utils/config';
import axios from 'axios';

const ovirtIndexInfo = () => axios.get(CONFIG.api.ovirtIndexInfoData);
const ovirtMonitorData = () => axios.get(CONFIG.api.ovirtMonitorData);
const ovirtMonitorStoreBandWidthData = () => axios.get(CONFIG.api.ovirtMonitorStoreBandWidthData);
const ovirtMonitorNowStoreIOPSData = ()=>axios.get(CONFIG.api.ovirtMonitorNowStoreIOPSData);

export default {
  ovirtIndexInfo,
  ovirtMonitorData,
  ovirtMonitorStoreBandWidthData,
  ovirtMonitorNowStoreIOPSData
};
