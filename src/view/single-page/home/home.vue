<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12"
             :md="8"
             :lg="4"
             v-for="(infor, i) in inforCardData"
             :key="`infor-${i}`"
             style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow
                    :color="infor.color"
                    :icon="infor.icon"
                    :icon-size="36">
          <count-to :end="infor.count"
                    count-class="count-style" />
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20"
         style="margin-top: 10px;">
      <i-col :md="24"
             :lg="8"
             style="margin-bottom: 20px;">
        <Card shadow>
          <simple-chart style="height: 300px;"
                        text="自动化覆盖"
                        :option="gaugeOption"
                        ref="simpleChart"></simple-chart>
        </Card>
      </i-col>
      <i-col :md="24"
             :lg="16"
             style="margin-bottom: 20px;">
        <Card shadow>
          <simple-chart style="height: 300px;"
                        text="各系统自动化覆盖"
                        :option="barOption"
                        ref="simpleChart2">
          </simple-chart>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <simple-chart style="height: 310px;"
                      :option="gridOption"
                      ref="simpleChart3"></simple-chart>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import Example from './example.vue'
import simpleChart from '_c/charts/simpleChart.vue'
import { autoComplete, orderLogin, timeStatistic } from '@/api/data'
import { on, off } from '@/libs/tools'

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    simpleChart,
    Example
  },

  data () {
    return {
      timer: null,
      // gaugeOption: {},
      // barOption: {},
      // inforCardData: [],
      // gridOption: {},
      color: ['#2d8cf0', '#19be6b', '#ff9900', '#ed3f14', '#E46CBB', '#9A66E4'],
      icon: ['md-cart', 'ios-cart-outline', 'md-boat', 'ios-boat-outline', 'ios-contact', 'ios-contact-outline'],
      // 初始化--订单+会员登陆统计
      inforCardData: [
        { title: '零售下单成功', icon: 'md-cart', count: 4293, color: '#2d8cf0' },
        { title: '零售下单失败', icon: 'ios-cart-outline', count: 383, color: '#19be6b' },
        { title: '度假下单成功', icon: 'md-boat', count: 48484, color: '#ff9900' },
        { title: '度假下单失败', icon: 'ios-boat-outline', count: 49, color: '#ed3f14' },
        { title: '会员登录成功', icon: 'ios-contact', count: 14842, color: '#E46CBB' },
        { title: '会员登录失败', icon: 'ios-contact-outline', count: 1314, color: '#9A66E4' }],
      // 初始化 --自动化覆盖率
      gaugeOption: {
        title: {
          // text: this.text,
          // subtext: this.subtext,
          // x: 'center'
        },
        series: [{
          data: [{ value: 200, name: '自动化覆盖' }],
          type: 'gauge',
          min: 0,
          max: 1260,
          splitNumber: 10,
          precision: 0,
          radius: '100%',
          detail: {
            backgroundColor: 'rgba(30,144,255,0.8)',
            borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#fff', // 默认透明
            shadowBlur: 5,
            offsetCenter: [0, '50%'], // x, y，单位px
            // textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'bolder',
            color: '#fff'
          }
        }]
      },
      // 自动化各系统覆盖率
      barOption: {
        title: {
          text: '已完成 vs 全部',
          subtext: '各系统自动化覆盖情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['已完成', '全部']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        // grid: { y: 70, y2: 30, x2: 20 },
        xAxis: [
          {
            type: 'category',
            data: ['聚合', '详情预定', '供应链', '零售', '会员', '订单', '任务中心']
          },
          {
            type: 'category',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            data: ['聚合', '详情预定', '供应链', '零售', '会员', '订单', '任务中心']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: { formatter: '{value}' }
          }
        ],
        series: [
          {
            name: '已完成',
            radius: '100%',
            type: 'bar',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 10, 10, 10, 10, 10],
                color: 'rgba(193,35,43,1)',
                label: { show: true }
              }
            },
            data: [36, 31, 60, 81, 20, 45, 20]
          },
          {
            name: '全部',
            radius: '100%',
            type: 'bar',
            xAxisIndex: 1,
            itemStyle: {
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                barBorderRadius: [10, 10, 10, 10, 10, 10, 10],
                color: 'rgba(193,35,43,0.5)',
                label: {
                  show: true,
                  formatter: function (p) { return p.value > 0 ? (p.value + '\n') : '' }
                }
              }
            },
            data: [265, 184, 598, 211, 235, 270, 150]
          }
        ]
      },
      // 初始化 资本化工时
      // colors =['#5793f3', '#d14a61', '#675bba']
      gridOption: {
        title: {
          text: '资本化工时统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['技术支持', '项目工时', '研发资本化', '理论工时']
        },
        grid: {
          // top: '3%',
          left: '1.2%',
          right: '1%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['14w', '15w', '16w', '17w', '19w', '20w', '21w', '22w']
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 1000
          },
          {
            type: 'value',
            min: 0,
            max: 1000,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#675bba'
              }
            }
          }
        ],
        series: [

          {
            name: '技术支持',
            type: 'line',
            stack: '总量',
            areaStyle: {
              normal: {
                // color: '#0C17A6'
              }
            },
            data: [30, 34, 25, 26, 29, 28, 30, 30]
          },
          {
            name: '项目工时',
            type: 'line',
            stack: '总量',
            areaStyle: {
              normal: {
                // color: '#4608A6'
              }
            },
            data: [40, 60, 70, 80, 40, 50, 56, 67]
          },
          {
            name: '研发资本化',
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'bottom',
                color: '#675bba'
              }
            },
            areaStyle: {
              normal: {
                // color: '#398DBF'
              }
            },
            data: [317, 327, 333, 345, 356, 467, 467, 367]
          },
          {
            name: '理论工时',
            type: 'line',
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: [476, 476, 456, 468, 567, 678, 689, 589]
          }
        ]
      }

      // gaugeData: [{ value: 209, name: '自动化覆盖' }],
    }
  },
  methods: {
    handleData (dataList) {
      let moduleList = dataList.interfaceInfos
      let maxData = dataList.interfaceCount
      let isautoCount = dataList.isautoCount
      let langed = moduleList.map(val => val.moduleName)
      let interfaceCount = moduleList.map(val => val.interfaceCount)
      let isauto = moduleList.map(val => val.isauto)

      // let gaugeData = [{ value: isautoCount, name: '自动化覆盖' }]
      // 自动化总体覆盖情况
      this.gaugeOption = {
        title: {
          // text: this.text,
          // subtext: this.subtext,
          // x: 'center'
        },
        series: [{
          data: [{ value: isautoCount, name: '自动化覆盖' }],
          type: 'gauge',
          min: 0,
          max: maxData,
          splitNumber: 10,
          precision: 0,
          radius: '100%',
          detail: {
            backgroundColor: 'rgba(30,144,255,0.8)',
            borderWidth: 1,
            borderColor: '#fff',
            shadowColor: '#fff', // 默认透明
            shadowBlur: 5,
            offsetCenter: [0, '50%'], // x, y，单位px
            // textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
            fontWeight: 'bolder',
            color: '#fff'
          }
        }]
      }
      // 自动化各系统覆盖率
      this.barOption = {
        title: {
          text: '已完成 vs 全部',
          subtext: '各系统自动化覆盖情况'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['已完成', '全部']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        // grid: { y: 70, y2: 30, x2: 20 },
        xAxis: [
          {
            type: 'category',
            data: langed
          },
          {
            type: 'category',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            data: langed
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: { formatter: '{value}' }
          }
        ],
        series: [
          {
            name: '已完成',
            radius: '100%',
            type: 'bar',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 10, 10, 10, 10],
                color: 'rgba(193,35,43,1)',
                label: { show: true }
              }
            },
            data: isauto
          },
          {
            name: '全部',
            radius: '100%',
            type: 'bar',
            xAxisIndex: 1,
            itemStyle: {
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                barBorderRadius: [10, 10, 10, 10, 10, 10],
                color: 'rgba(193,35,43,0.5)',
                label: {
                  show: true,
                  formatter: function (p) { return p.value > 0 ? (p.value + '\n') : '' }
                }
              }
            },
            data: interfaceCount
          }
        ]
      }
    },
    orderData (data) {
      let orderList = data.orderCount
      console.log(orderList)
      let i = 0
      this.inforCardData = []
      orderList.forEach(data => {
        // let productType = data.map(val => val.productType)
        let type = data.productType
        let Success = data.successCount
        let Failed = data.failCount
        // let color = ['#2d8cf0', '#19be6b', '#ff9900', '#ed3f14', '#E46CBB', '#9A66E4']
        // let icon = ['md-person-add', 'md-locate', 'md-help-circle', 'md-share', 'md-chatbubbles', 'md-map']
        let successInfo = { title: type + '成功', icon: this.icon[i], count: Success, color: this.color[i] }
        let failedInfo = { title: type + '失败', icon: this.icon[i + 1], count: Failed, color: this.color[i + 1] }
        this.inforCardData.push(successInfo)
        this.inforCardData.push(failedInfo)
        i += 2
      })

      // console.log(this.inforCardData)

      // this.inforCardData = [
      //   { title: '零售下单成功', icon: 'md-person-add', count: mallSuccess, color: '#2d8cf0' },
      //   { title: '度假下单成功', icon: 'md-locate', count: 232, color: '#19be6b' },
      //   { title: '会员登录成功', icon: 'md-help-circle', count: 142, color: '#ff9900' },
      //   { title: '零售下单失败', icon: 'md-share', count: mallFailed, color: '#ed3f14' },
      //   { title: '度假下单失败', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
      //   { title: '会员登录失败', icon: 'md-map', count: 14, color: '#9A66E4' }
      // ]
    },
    // 工时统计
    workTime (data) {
      let gridData = data.workingTime
      console.log(gridData)
      let xshow = gridData.map(val => val.week)
      let capitalizationTime = gridData.map(val => val.capitalizationTime)
      let projectTime = gridData.map(val => val.projectTime)
      let supportTime = gridData.map(val => val.supportTime)
      let theoreticalTime = gridData.map(val => val.theoreticalTime)

      let colors = ['#5793f3', '#d14a61', '#675bba']
      this.gridOption = {
        title: {
          text: '资本化工时统计'
        },
        color: ['#0C17A6', '#4608A6', '#398DBF'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['技术支持', '项目工时', '研发资本化', '理论工时']
        },
        grid: {
          // top: '3%',
          left: '1%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xshow
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 1000
          },
          {
            type: 'value',
            min: 0,
            max: 1000,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[2]
              }
            }
          }
        ],
        series: [

          {
            name: '技术支持',
            type: 'line',
            stack: '总量',
            areaStyle: {
              normal: {
                // color: '#0C17A6'
              }
            },
            data: supportTime
          },
          {
            name: '项目工时',
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top',
                color: colors[1]
              }
            },
            areaStyle: {
              normal: {
                // color: '#4608A6'
              }
            },
            data: projectTime
          },
          {
            name: '研发资本化',
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'bottom',
                color: colors[2]
              }
            },
            areaStyle: {
              normal: {
                // color: '#398DBF'
              }
            },
            data: capitalizationTime
          },
          {
            name: '理论工时',
            type: 'line',
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: theoreticalTime
          }
        ]
      }
    },
    chartResize (e) {
      if (e.type === 'transitionend' && e.target !== e.currentTarget) return
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.$refs.simpleChart && this.$refs.simpleChart2 && this.$refs.simpleChart3) {
          this.$refs.simpleChart.resize()
          this.$refs.simpleChart2.resize()
          this.$refs.simpleChart3.resize()
        }
      }, 200)
    }

  },

  mounted () {
    autoComplete().then(res => {
      if (res.data && res.data.data) {
        this.handleData(res.data.data)
      }
    })
    orderLogin().then(res => {
      if (res.data && res.data.data) {
        this.orderData(res.data.data)
      }
    })
    timeStatistic().then(res => {
      if (res.data && res.data.data) {
        this.workTime(res.data.data)
      }
    })
    on(window, 'resize', this.chartResize)
    on(
      document.getElementById('left-sider'),
      'transitionend',
      this.chartResize
    )
  },
  beforeDestroy () {
    off(window, 'resize', this.chartResize)
    off(
      document.getElementById('left-sider'),
      'transitionend',
      this.chartResize
    )
  }

}
</script>

<style lang="less">
.count-style {
  font-size: 20px;
}
</style>
