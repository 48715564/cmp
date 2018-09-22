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
      let val = params[0].seriesName + ":" + (params[0].value) + "%<br/>" + params[0].name;
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
        return val + '%';
      }
    },
    axisPointer: {
      label: {
        formatter: function (params) {
          return ((params.value)).toFixed(1) + '%';
        }
      }
    },
    splitNumber: 3,
    splitLine: {
      show: false
    }
  },
];

const drawServerGraph = (el,normalHostCount,unNormalHostCount) => {
  const scale = 1;
  const total = normalHostCount + unNormalHostCount;

  const Chart = Echarts.init(el);
  Chart.setOption({
    title: {
      text: total,
      left: center,
      top: '35%',
      textStyle: {
        color: $blackDark,
        fontSize: 16 * scale,
      },
      subtext: '台主机',
      subtextStyle: {
        color: $greyDark,
        fontSize: 12 * scale,
      },
      padding: 0,
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {d}%',
    },
    legend: {
      selectedMode: false,
    },
    series: [{
      name: '主机',
      type: 'pie',
      radius: ['50%', '90%'],
      // hover时 动画效果
      hoverAnimation: true,
      hoverOffset: 3,
      avoidLabelOverlap: false,
      labelLine: {
        normal: {
          show: true,
        },
      },
      data: [
        {
          value: normalHostCount,
          name: '在线主机',
          itemStyle: {
            normal: {
              color: $blue,
            },
          },
          label: {
            normal: {
              show: false,
              position: 'inside',
            },
          },
        },
        {
          value: unNormalHostCount,
          name: '离线主机',
          itemStyle: {
            normal: {
              color: $red,
            },
          },
          label: {
            normal: {
              show: false,
              position: 'inside',
            },
          },
        },
      ],
    },
    ],
  });
};


const drawStorage = (el,availableCount,usedCount) => {
  const scale = 1;
  const total = availableCount + usedCount;

  const Chart = Echarts.init(el);
  Chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a}:<br/> {c} TB',
    },
    grid: {
      top: '28%',
      left: '-15px',
      right: '0',
      bottom: '28%',
      containLabel: true,
    },
    xAxis: {
      show: false,
      type: 'value',
    },
    yAxis: {
      show: false,
      type: 'category',
      data: ['R'],
    },
    series: [{
      name: '可用',
      type: 'bar',
      stack: 'total',
      label: {
        normal: {
          show: false,
          fontSize: 12,
          position: 'inside',
        },
      },
      itemStyle: {
        normal: {
          barBorderRadius: [100, 0, 0, 100],
          color: $blue,
        },
      },
      data: [availableCount],
    },{
      name: '已用',
      type: 'bar',
      stack: 'total',
      label: {
        normal: {
          show: false,
          fontSize: 12,
          position: 'inside',
        },
      },
      itemStyle: {
        normal: {
          barBorderRadius: [0, 50, 50, 0],
          color: $red,
        },
      },
      data: [usedCount],
    },
    ],
  });
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

const DepletionTwoLineGraph = (el, data, isPercentage, series) => {
  if (data) {
    Echarts.dispose(el);
    const Chart = Echarts.init(el);
    if (!data) {
      data = {
        title: '',
        xData: null,
        yData1: [],
        yData2: []
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
          name: series.name1,
          type: 'line',
          stack: series.stack1,
          data: data.yData1,
        },{
          name: series.name2,
          type: 'line',
          stack: series.stack2,
          data: data.yData2,
        },
      ],
    });
    return Chart;
  }else{
    el.innerHTML='暂无数据';
  }
};
export default {
  DepletionTwoLineGraph,DepletionGraph,drawServerGraph,drawStorage
};
