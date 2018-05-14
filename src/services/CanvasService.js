import Echarts from 'echarts';
/* eslint-disable */
// # 颜色值
const $blue = '#3b85da';
const $lightBlue = '#a1c2e8';
const $red = '#e84747';
const $lightRed = '#fb8d8d';
const $green = '#22c36a';
const $yellow = '#f7b32b';
const $orange = '#f56e25';
const $purple = '#7354e2';

// grey
const $blackDark = '#3d444f';
const $blackDarker = '#1f2126';
const $blackLight = '#595f69';
const $greyDark = '#9ba3af';
const $greyLight = '#ccd1d9';
const $whiteDark = '#e4e7ed';
const $whiteDarkLighter = '#f1f3f6';
const $whiteLight = '#f5f7fa';
const $whiteLighter = '#fbfcfc';
const $white = '#ffffff';

const center = 'center';
const middle = 'middle';
const defaultXData = ['', '', '', '', '', '', '', '', '', ''];
/* eslint-enable */

const drawNetWorkDepletionGraph = (el, data) => {
  const Chart = Echarts.init(el);
  if (!data) {
    data = {
      title: '',
      xData: null,
      yData: []
    };
  }
  Chart.setOption({
    title: {
      text: data.title,
      x: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: $greyDark,
        },
      },
    },
    grid: {
      top: '30px',
      left: '30px',
      right: '18px',
      bottom: '10px',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: data.xData
      }
    ],
    yAxis: [
      {
        type: 'value',
        minInterval: '1'
      },
    ],
    series: [
      {
        name: '传输和接收总速度',
        type: 'line',
        stack: 'network',
        data: data.yData,
      },
    ],
  });
  return Chart;
};

const drawCPUDepletionGraph = (el,data) => {
  const Chart = Echarts.init(el);
  if(!data){
    data = {
      title:'',
      xData:null,
      yData:[]
    };
  }
  Chart.setOption({
    title:{
      text: data.title,
      x: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params, ticket, callback){
        let val = params[0].seriesName+":"+(params[0].value/100)+"%<br/>"+params[0].name;
        return val;
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: $greyDark,
        },
      },
    },
    grid: {
      top: '30px',
      left: '30px',
      right: '18px',
      bottom: '10px',
      containLabel: true,
    },
    xAxis : [
      {
        type : 'category',
        data: data.xData,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: function (val) {
            return val/100 + '%';
          }
        },
        axisPointer: {
          label: {
            formatter: function (params) {
              return ((params.value)/100).toFixed(1) + '%';
            }
          }
        },
        splitNumber: 3,
        splitLine: {
          show: false
        }
      },
    ],
    series: [
      {
        name: 'CPU使用率',
        type: 'line',
        stack: 'cpu',
        data: data.yData,
      },
    ],
  });
  return Chart;
};

const drawMemoryDepletionGraph = (el,data) => {
  const Chart = Echarts.init(el);
  if(!data){
    data = {
      title:'',
      xData:null,
      yData:[]
    };
  }
  Chart.setOption({
    title:{
      text: data.title,
      x: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params, ticket, callback){
        let val = params[0].seriesName+":"+(params[0].value/100)+"%<br/>"+params[0].name;
        return val;
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: $greyDark,
        },
      },
    },
    grid: {
      top: '30px',
      left: '30px',
      right: '18px',
      bottom: '10px',
      containLabel: true,
    },
    xAxis : [
      {
        type : 'category',
        data: data.xData,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: function (val) {
            return val/100 + '%';
          }
        },
        axisPointer: {
          label: {
            formatter: function (params) {
              return ((params.value)/100).toFixed(1) + '%';
            }
          }
        },
        splitNumber: 3,
        splitLine: {
          show: false
        }
      },
    ],
    series: [
      {
        name: '内存使用率',
        type: 'line',
        stack: 'memory',
        data: data.yData,
      }
    ],
  });
  return Chart;
};


const drawStoreDepletionGraph = (el,data) => {
  const Chart = Echarts.init(el);
  if(!data){
    data = {
      title:'',
      xData:null,
      yData:[]
    };
  }
  Chart.setOption({
    title:{
      text: data.title,
      x: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: $greyDark,
        },
      },
    },
    grid: {
      top: '30px',
      left: '30px',
      right: '18px',
      bottom: '10px',
      containLabel: true,
    },
    xAxis : [
      {
        type : 'category',
        data: data.xData,
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        // max: '100',
        min: '0',
        minInterval: '1',
        splitLine: {
          show: false
        }
      },
    ],
    series: [
      {
        name: '汇总的磁盘I/O速度',
        type: 'line',
        stack: 'store',
        data: data.yData,
      }
    ],
  });
  return Chart;
};
export default {
  drawNetWorkDepletionGraph,
  drawCPUDepletionGraph,
  drawMemoryDepletionGraph,
  drawStoreDepletionGraph,
};
