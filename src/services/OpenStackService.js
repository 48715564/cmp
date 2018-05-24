import CONFIG from '@/utils/config';
import axios from 'axios';

const openStackInfo = () => axios.get(CONFIG.api.openStackInfo);
const openStackInfoHistory = () => axios.get(CONFIG.api.openStackInfoPage);
const openStackHostById = (hostID) => axios.get(CONFIG.api.openStackHostById, {params: {hostID}});
const openStackVMById = (VMID) => axios.get(CONFIG.api.openStackVMById, {params: {VMID}});
const openStackNetworkById = (networkID) => axios.get(CONFIG.api.openStackNetById, {params: {networkID}});
const openStackImagesById = (imagesID) => axios.get(CONFIG.api.openStackImagesById, {params: {imagesID}});
const openStackFlavorsById = (flavorsID) => axios.get(CONFIG.api.openStackFlavorsById, {params: {flavorsID}});
export default {
  openStackInfo,
  openStackInfoHistory,
  openStackHostById,
  openStackVMById,
  openStackNetworkById,
  openStackImagesById,
  openStackFlavorsById,
};
