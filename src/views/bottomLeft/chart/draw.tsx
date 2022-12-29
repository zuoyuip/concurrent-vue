import {defineComponent, ref, watch} from 'vue'
import * as echarts from 'echarts'
// 声明类型
const PropsType = {
  cdata: {
    type: Object,
    require: true
  }
} as const

// 定义主体
export default defineComponent({
  props: PropsType,
  setup(props) {
    // 定义 ref
    const chartRef = ref()
    // 配置项
    let options = {}

    // 监听
    watch(
      () => props.cdata,
      (val: any) => {
        options = {
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: "none"
              },
              dataView: {
                readOnly: true
              },
              saveAsImage: { show: true }
            },
            right: "5%",
            top: -8
          },
          dataZoom: [{
            textStyle: {
              color: "#FFFFFF",
              fontStyle: "italic",
              fontWeight: "bold"
            },
            bottom: 12,
            // start: 60,
            // end: 100
          }],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            show: true,
            type: 'plain',
            textStyle: {
              fontSize: 16
            }
          },
          grid: {
            x: "8%",
            width: "88%",
            top: "5%",
            bottom: '7%'
          },
          xAxis: {
            data: val.dateTime,
            axisLine: {
              lineStyle: {
                color: "#B4B4B4"
              }
            },
            axisTick: {
              show: false
            },
            scale: true,
            splitLine: { show: true },
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax',

          },
          yAxis: [
            {
              splitLine: { show: false },
              axisLine: {
                lineStyle: {
                  color: "#B4B4B4"
                }
              },
              axisLabel: {
                formatter: "{value} "
              }
            },
            {
              splitLine: {show: false},
              axisLine: {
                lineStyle: {
                  color: "#B4B4B4"
                }
              },
              axisLabel: {
                formatter: "{value} %"
              },
              axisPointer: {
                label: {
                  formatter: "{value} %"
                }
              },
            }
          ],
          series: [
            {
              name: "成功率",
              type: "line",
              smooth: true,
              showAllSymbol: true,
              symbol: "emptyCircle",
              symbolSize: 8,
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: "#409EFF"
                }
              },
              tooltip: {
                valueFormatter: (value) => value.toFixed(2) + '%'
              },
              data: val.successRate
            },
            {
              name: "超时率",
              type: "line",
              smooth: true,
              showAllSymbol: true,
              symbol: "emptyCircle",
              symbolSize: 8,
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: "#E6A23C"
                }
              },
              tooltip: {
                valueFormatter: (value) => value.toFixed(2) + '%'
              },
              data: val.timeOutRate
            },
            {
              name: "失败率",
              type: "line",
              smooth: true,
              showAllSymbol: true,
              symbol: "emptyCircle",
              symbolSize: 8,
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: "#F56C6C"
                }
              },
              tooltip: {
                valueFormatter: (value) => value.toFixed(2) + '%'
              },
              data: val.failRate
            },
            {
              name: "有效率",
              type: "line",
              smooth: true,
              showAllSymbol: true,
              symbol: "emptyCircle",
              symbolSize: 8,
              yAxisIndex: 1,
              itemStyle: {
                normal: {
                  color: "#67C23A"
                }
              },
              tooltip: {
                valueFormatter: (value) => value.toFixed(2) + '%'
              },
              data: val.validRate
            },
            {
              name: "查询数量",
              type: "bar",
              barGap: "-100%",
              barWidth: 10,
              itemStyle: {
                normal: {
                  barBorderRadius: 5,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: "rgba(156,107,211,0.8)"},
                    {offset: 0.2, color: "rgba(156,107,211,0.5)"},
                    {offset: 1, color: "rgba(156,107,211,0.2)"}
                  ])
                }
              },
              z: -12,
              data: val.count
            }
          ]
        }
        // 手动触发更新
        if (chartRef.value) {
          // 通过初始化参数打入数据
          chartRef.value.initChart(options)
        }
      },
      {
        immediate: true,
        deep: true
      }
    )

    return () => {
      const height = "860px"
      const width = "100%"

      return <div>
        <echart ref={chartRef} height={height} width={width} />
      </div>
    }
  }
})

