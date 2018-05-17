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
const defaultTooltip = {
  trigger: 'axis',
  axisPointer: {
    type: 'cross',
    label: {
      backgroundColor: $greyDark,
    },
  },
};
const percentageTooltip = {
  trigger: 'axis',
  formatter: function (params, ticket, callback) {
    if (params[0].value) {
      let val = params[0].seriesName + ":" + (params[0].value / 100) + "%<br/>" + params[0].name;
      return val;
    } else {
      return params[0].seriesName + ":-";
    }
  },
  axisPointer: {
    type: 'cross',
    label: {
      backgroundColor: $greyDark,
    },
  },
};

const defaultYAxis = [
  {
    type: 'value',
    minInterval: '1'
  },
];

const percentageYAxis = [
  {
    axisLabel: {
      formatter: function (val) {
        return val / 100 + '%';
      }
    },
    axisPointer: {
      label: {
        formatter: function (params) {
          return ((params.value) / 100).toFixed(1) + '%';
        }
      }
    },
    splitNumber: 3,
    splitLine: {
      show: false
    }
  },
];


const DepletionGraphBar = (el, data,series) => {
  if (data) {
    Echarts.dispose(el);
    const Chart = Echarts.init(el);
    Chart.setOption({
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: series.name,
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
  }else{
    el.innerHTML='暂无数据';
  }
};

const DepletionGraph = (el, data, isPercentage, series) => {
  if (data) {
    Echarts.dispose(el);
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
      tooltip: isPercentage ? percentageTooltip : defaultTooltip,
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
          data: data.xData,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: isPercentage ? percentageYAxis : defaultYAxis,
      series: [
        {
          name: series.name,
          type: 'line',
          stack: series.stack,
          data: data.yData,
        },
      ],
    });
    return Chart;
  }else{
    el.innerHTML='暂无数据';
  }
};
export default {
  DepletionGraph,DepletionGraphBar
};
