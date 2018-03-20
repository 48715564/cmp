import CONFIG from '@/utils/config';
import axios from 'axios';

const openStackInfo = () => axios.get(CONFIG.api.openStackInfo);
const openStackInfoHistory = (page=1,limit=10) => axios.get(CONFIG.api.openStackInfoPage,{params:{page,limit}});
export default {
  openStackInfo,
  openStackInfoHistory
};
