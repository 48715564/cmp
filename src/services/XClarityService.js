import CONFIG from '@/utils/config';
import axios from 'axios';

const hardware = () => axios.get(CONFIG.api.xClarity_hardwareList);
const configPatterns = () => axios.get(CONFIG.api.xClarity_configPatterns);
const systemImages = () => axios.get(CONFIG.api.xClarity_systemImages);
const firmwares = () => axios.get(CONFIG.api.xClarity_firmwares);
const jobs = () => axios.get(CONFIG.api.xClarity_jobs);
const sessions = () => axios.get(CONFIG.api.xClarity_sessions);
const sysResources = () => axios.get(CONFIG.api.xClarity_sysResources);
export default {
  hardware,
  configPatterns,
  systemImages,
  firmwares,
  jobs,
  sessions,
  sysResources
};
