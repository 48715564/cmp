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

const drawCPUDepletionGraph = (el, data) => {
  const Chart = Echarts.init(el);
  Chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    series: [
      {
        name: 'cpu使用情况',
        type: 'pie',
        data: data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
  return Chart;
};

const drawMemoryDepletionGraph = (el, data) => {
  const Chart = Echarts.init(el);
  Chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: "{b}MB : {c}MB ({d}%)"
    },
    series: [
      {
        name: '内存使用情况',
        type: 'pie',
        data: data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
  return Chart;
};

const drawNetWorkDepletionGraph = (el, data) => {
  const Chart = Echarts.init(el);
  if (!data) {
    data = {
      title: '',
      xData: null,
      yData: {
        netCountArray: null
      }
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
      left: '0',
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
        name: '网络数',
        type: 'line',
        stack: 'network',
        data: data.yData.netCountArray,
      },
    ],
  });
  return Chart;
};

const drawStoreDepletionGraph = (el, data) => {
  const Chart = Echarts.init(el);
  Chart.setOption({
    tooltip : {
      trigger: 'item',
      formatter: "{b}GB : {c}GB ({d}%)"
    },
    series : [
      {
        name: '磁盘使用情况',
        type: 'pie',
        data: data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
  return Chart;
};

export default {
  drawCPUDepletionGraph,
  drawMemoryDepletionGraph,
  drawNetWorkDepletionGraph,
  drawStoreDepletionGraph,
};
