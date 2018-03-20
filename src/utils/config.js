const API = process.env.BASE_URL;

module.exports = {
  api: {
    userLogin: `${API}/auth`,
    openStackInfo: `${API}/OpenStack/info`,
    openStackInfoPage: `${API}/OpenStack/infoPage`,
    xClarity_hardwareList: `${API}/XClarity/hardwareList`,
    xClarity_configPatterns:`${API}/XClarity/configPatterns`,
    xClarity_systemImages:`${API}/XClarity/systemImages`,
    xClarity_firmwares:`${API}/XClarity/firmwares`,
    xClarity_jobs:`${API}/XClarity/jobs`,
    xClarity_sessions:`${API}/XClarity/sessions`,
    xClarity_sysResources:`${API}/XClarity/sysResources`,
  },
  BASE_URL: API,
  POST_URL: process.env.POST_URL,
  DOMAIN: process.env.DOMAIN,
};
