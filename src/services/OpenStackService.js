import CONFIG from '@/utils/config';
import axios from 'axios';

const openStackInfo = () => axios.get(CONFIG.api.openStackInfo);
const openStackInfoHistory = (page=1,limit=10) => axios.get(CONFIG.api.openStackInfoPage,{params:{page,limit}});
const openStackHostById = (hostID) => axios.get(CONFIG.api.openStackHostById,{params:{hostID}});
const openStackVMById = (VMID) => axios.get(CONFIG.api.openStackVMById,{params:{VMID}});
export default {
  openStackInfo,
  openStackInfoHistory,
  openStackHostById,
  openStackVMById
};
