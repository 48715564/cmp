import CONFIG from '@/utils/config';
import axios from 'axios';

const ovirtIndexInfo = () => axios.get(CONFIG.api.ovirtIndexInfoData);
const ovirtMonitorData = () => axios.get(CONFIG.api.ovirtMonitorData);

export default {
  ovirtIndexInfo,
  ovirtMonitorData
};