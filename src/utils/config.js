const API = process.env.BASE_URL;

module.exports = {
  api: {
    userLogin: `${API}/auth`,
    VMWareInfo: `${API}/VMware/all`,
    VMHostMonitorData: `${API}/VMware/getHostMonitorData`,
    VMDataCenterMonitorData: `${API}/VMware/getDataCenterMonitorData`,
    VMClusterMonitorData: `${API}/VMware/getClusterMonitorData`,
    VMMonitorData: `${API}/VMware/getVMMonitorData`,
    VMDSMonitorData: `${API}/VMware/getDSMonitorData`,
    VMNetworkMonitorData: `${API}/VMware/getNetworkMonitorData`,
    xClarity_hardwareList: `${API}/XClarity/hardwareList`,
    xClarity_configPatterns: `${API}/XClarity/configPatterns`,
    xClarity_systemImages: `${API}/XClarity/systemImages`,
    xClarity_firmwares: `${API}/XClarity/firmwares`,
    xClarity_jobs: `${API}/XClarity/jobs`,
    xClarity_sessions: `${API}/XClarity/sessions`,
    xClarity_sysResources: `${API}/XClarity/sysResources`,
    ovirtIndexInfoData: `${API}/ovirt/indexInfo`,
    ovirtMonitorData: `${API}/ovirt/monitorData`,

  },
  BASE_URL: API,
  POST_URL: process.env.POST_URL,
  DOMAIN: process.env.DOMAIN,
};
