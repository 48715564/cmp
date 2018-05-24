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

const drawCPUDepletionGraphBar = (el, data) => {
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
        radius : '55%',
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

const drawMemoryDepletionGraphBar = (el, data) => {
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
        radius : '55%',
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
      xData: null,
      yData: {
        netCountArray: null
      }
    };
  }
  Chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: $greyDark,
        },
      },
    },
    xAxis: [
      {
        type: 'category',
        data: data.xData,
        axisLabel: {
          formatter:function(value)
          {
            return value.split(" ").join("\n");
          }
        }
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

const drawStoreDepletionGraphBar = (el, data) => {
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
        radius : '55%',
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




const drawCPUDepletionGraph = (el,data) => {
  const Chart = Echarts.init(el);
  if(!data){
    data = {
      xData:null,
      yData:{
        cpuCountData:null,
        cpuUseCountData:null,
      }
    };
  }
  Chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: $greyDark,
        },
      },
    },
    xAxis : [
      {
        type : 'category',
        data: data.xData,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          formatter:function(value)
          {
            return value.split(" ").join("\n");
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        // max: '100',
        min: '0',
        minInterval: '1',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: $greyDark,
          },
        },
      },
    ],
    series: [
      {
        name: 'VCPU总数',
        type: 'line',
        stack: 'cpu',
        data: data.yData.cpuCountData,
      },
      {
        name: '已使用VCPU数量',
        type: 'line',
        stack: 'cpu',
        data: data.yData.cpuUseCountData,
      },
    ],
  });
  return Chart;
};

const drawMemoryDepletionGraph = (el,data) => {
  const Chart = Echarts.init(el);
  if(!data){
    data = {
      xData:null,
      yData:{
        memoryCountData:null,
        memoryUseCountData:null,
      }
    };
  }
  Chart.setOption({
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
    xAxis : [
      {
        type : 'category',
        data: data.xData,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          formatter:function(value)
          {
            return value.split(" ").join("\n");
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        // max: '100',
        min: '0',
        minInterval: '1',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: $greyDark,
          },
        },
      },
    ],
    series: [
      {
        name: '内存总数',
        type: 'line',
        stack: 'memory',
        data: data.yData.memoryCountData,
      },
      {
        name: '已使用内存数量',
        type: 'line',
        stack: 'memory',
        data: data.yData.memoryUseCountData,
      },
    ],
  });
  return Chart;
};


const drawStoreDepletionGraph = (el,data) => {
  const Chart = Echarts.init(el);
  if(!data){
    data = {
      xData:null,
      yData:{
        localArray:null,
        localUseArray:null
      }
    };
  }
  Chart.setOption({
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
      left: '20px',
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
        },
        axisLabel: {
          formatter:function(value)
          {
            return value.split(" ").join("\n");
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        // max: '100',
        min: '0',
        minInterval: '1',
        axisLine: {
          onZero: false,
          lineStyle: {
            color: $greyDark,
          },
        },
      },
    ],
    series: [
      {
        name: '本地储存',
        type: 'line',
        stack: 'store',
        data: data.yData.localArray,
      },{
        name: '已使用本地存储',
        type: 'line',
        stack: 'store',
        data: data.yData.localUseArray,
      },
    ],
  });
  return Chart;
};

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


export default {
  drawCPUDepletionGraphBar,
  drawMemoryDepletionGraphBar,
  drawNetWorkDepletionGraph,
  drawStoreDepletionGraphBar,
  drawCPUDepletionGraph,
  drawMemoryDepletionGraph,
  drawStoreDepletionGraph,
  DepletionGraphBar,
};
