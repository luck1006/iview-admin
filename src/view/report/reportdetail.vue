<template>
  <div>
    <div>
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
    </div>
    <div style="margin-bottom: 20px;">
      <Row :gutter="20">
        <!-- <i-col span="10"> -->
        <Card shadow>
          <simple-chart style="height: 400px;"
                        text="自动化报告构建详情"
                        :option="barOption"
                        ref="simpleChart"></simple-chart>

        </Card>
        <!-- </i-col> -->

      </Row>
      <br>
      <Row :gutter="20">
        <!-- <i-col span="10"> -->
        <Card shadow>
          <simple-chart style="height: 400px;"
                        text="自动化报告用例详情"
                        :option="barOption1"
                        ref="simpleChart1"></simple-chart>

        </Card>
        <!-- </i-col> -->

      </Row>
    </div>

  </div>
</template>
<script>
import { ChartPie } from '_c/charts'
import { queryRunDetail } from '@/api/data'
import { on, off } from '@/libs/tools'
import simpleChart from '_c/charts/simpleChart.vue'
import Loading from '@/components/loading'
// import { createHash } from 'crypto'
// const SERIESNAME = [
//   {
//     name: 'sit环境',
//     value: 'sitData',
//     chartType: 'bar',
//     type: 'number'
//   },
//   {
//     name: 'pre',
//     value: 'preData',
//     chartType: 'bar',
//     type: 'number'
//   },
//   {
//     name: 'prd',
//     value: 'prdData',
//     chartType: 'bar',
//     type: 'number'
//   },
//   {
//     name: 'sit构建成功率',
//     value: 'sitBuildRate',
//     chartType: 'line',
//     type: 'percent'
//   },
//   {
//     name: 'pre构建成功率',
//     value: 'preBuildRate',
//     chartType: 'line',
//     type: 'percent'
//   },
//   {
//     name: 'prd构建成功率',
//     value: 'prdBuildRate',
//     chartType: 'line',
//     type: 'percent'
//   }
// ]
const env = ['sit', 'pre', 'prd']

const color = ['#2d8cf0', '#19be6b', '#ff9900']

export default {
  components: {
    ChartPie,
    simpleChart,
    Loading
  },
  data () {
    return {
      isLoading: true,
      barOption: {},
      barOption1: {},
      list: [],
      sitBuildRate: [],
      preBuildRate: [],
      prdBuildRate: [],
      sitData: [],
      preData: [],
      prdData: [],
      runEnv: [],
      sitCaseRate: [],
      preCaseRate: [],
      prdCaseRate: [],
      sitCaseData: [],
      preCaseData: [],
      prdCaseData: []
    }
  },
  methods: {
    handleData (dataList) {
      console.log(dataList)
      let weeks = Object.keys(dataList)
      // console.log(weeks)
      let values = Object.values(dataList)
      // console.log(values)
      values.forEach(data => {
        this.list = data.list
        this.runEnv = this.list.map(val => val.env)
        env.forEach((v, i) => {
          let arrIndex = this.runEnv.indexOf(v)
          if (arrIndex > -1) {
            let buildCount = this.list[arrIndex].successBuildCount + this.list[arrIndex].failBuildCount
            let caseCount = this.list[arrIndex].successCaseCount + this.list[arrIndex].failCaseCount
            if (v === 'sit') {
              this.sitData.push(buildCount)
              this.sitCaseData.push(caseCount)
              if (buildCount > 0) {
                let buildRate = parseInt((this.list[arrIndex].successBuildCount / buildCount) * 100)
                let caseRate = parseInt((this.list[arrIndex].successCaseCount / caseCount) * 100)
                this.sitBuildRate.push(buildRate)
                this.sitCaseRate.push(caseRate)
              } else {
                this.sitBuildRate.push(100)
                this.sitCaseRate.push(100)
              }
            } else if (v === 'pre') {
              this.preData.push(buildCount)
              this.preCaseData.push(caseCount)
              if (buildCount > 0) {
                let buildRate = parseInt((this.list[arrIndex].successBuildCount / buildCount) * 100)
                let caseRate = parseInt((this.list[arrIndex].successCaseCount / caseCount) * 100)
                this.preBuildRate.push(buildRate)
                this.preCaseRate.push(caseRate)
              } else {
                this.preBuildRate.push(100)
                this.preCaseRate.push(100)
              }
            } else {
              this.prdData.push(buildCount)
              this.prdCaseData.push(caseCount)
              if (buildCount > 0) {
                let buildRate = parseInt((this.list[arrIndex].successBuildCount / buildCount) * 100)
                let caseRate = parseInt((this.list[arrIndex].successCaseCount / caseCount) * 100)
                this.prdBuildRate.push(buildRate)
                this.prdCaseRate.push(caseRate)
              } else {
                this.prdBuildRate.push(100)
                this.prdCaseRate.push(100)
              }
            }
          } else {
            if (v === 'sit') {
              this.sitData.push(0)
              this.sitBuildRate.push(100)
              this.sitCaseData.push(0)
              this.sitCaseRate.push(100)
            } else if (v === 'pre') {
              this.preData.push(0)
              this.preBuildRate.push(100)
              this.preCaseData.push(0)
              this.preCaseRate.push(100)
            } else {
              this.prdData.push(0)
              this.prdBuildRate.push(100)
              this.prdCaseData.push(0)
              this.prdCaseRate.push(100)
            }
          }
        })
      }

      )

      this.isLoading = false
      this.barOption = {
        title: {
          text: '自动化报告构建详情'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {

          left: 'center',
          top: 'bottom',

          data: ['sit构建次数', 'pre构建次数', 'prd构建次数', 'sit构建成功率', 'pre构建成功率', 'prd构建成功率']
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ['line', 'bar'] },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        calculable: true,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: weeks
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '构建次数'
          },
          {
            type: 'value',
            name: '构建成功率',
            min: 0,
            max: 100,
            // // interval: 10,
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: 'sit构建次数',
            type: 'bar',
            color: color[0],
            itemStyle: { // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                // color: '#9A66E4',
                label: {
                  show: true // 是否展示
                  // textStyle: {
                  //   fontWeight: 'bolder',
                  //   fontSize: '12',
                  //   fontFamily: '微软雅黑'
                  // }
                }
              }

            },
            data: this.sitData
          },

          {
            name: 'pre构建次数',
            type: 'bar',
            color: color[1],
            itemStyle: { // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                // color: '#9A66E4',
                label: {
                  show: true // 是否展示
                  // textStyle: {
                  //   fontWeight: 'bolder',
                  //   fontSize: '12',
                  //   fontFamily: '微软雅黑'
                  // }
                }
              }

            },
            data: this.preData
          },

          {
            name: 'prd构建次数',
            type: 'bar',
            color: color[2],
            itemStyle: { // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                // color: '#9A66E4',
                label: {
                  show: true // 是否展示
                  // textStyle: {
                  //   fontWeight: 'bolder',
                  //   fontSize: '12',
                  //   fontFamily: '微软雅黑'
                  // }
                }
              }

            },
            data: this.prdData
          },
          {
            label: {
              show: true,
              formatter: '{c}%'
            },
            name: 'sit构建成功率',
            type: 'line',
            color: color[0],
            yAxisIndex: 1,
            data: this.sitBuildRate
          },
          {
            label: {
              show: true,
              formatter: '{c}%'
            },
            name: 'pre构建成功率',
            type: 'line',
            color: color[1],
            yAxisIndex: 1,
            data: this.preBuildRate
          },
          {
            label: {
              show: true,
              formatter: '{c}%'
            },
            name: 'prd构建成功率',
            type: 'line',
            color: color[2],
            yAxisIndex: 1,
            data: this.prdBuildRate
          }

        ]
      }

      this.barOption1 = {
        title: {
          text: '自动化报告运行用例详情'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 'center',
          top: 'bottom',
          data: ['sit运行用例数', 'pre运行用例数', 'prd运行用例数', 'sit运行用例成功率', 'pre运行用例成功率', 'prd运行用例成功率']
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ['line', 'bar'] },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        calculable: true,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: weeks
          }
        ],
        yAxis: [

          {
            type: 'value',
            name: '用例数'
            // min: 0,
            // max: 700
          },
          {
            type: 'value',
            name: '运行成功率',
            show: true,
            min: 0,
            max: 100,
            // // interval: 10,
            axisLabel: {
              show: true,
              formatter: '{value}%',
              interval: 'auto'
            }
          }
        ],
        series: [
          {
            name: 'sit运行用例数',
            type: 'bar',
            color: color[0],
            itemStyle: { // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                // color: '#9A66E4',
                label: {
                  show: true // 是否展示
                  // textStyle: {
                  //   fontWeight: 'bolder',
                  //   fontSize: '12',
                  //   fontFamily: '微软雅黑'
                  // }
                }
              }

            },
            data: this.sitCaseData
          },

          {
            name: 'pre运行用例数',
            type: 'bar',
            color: color[1],
            itemStyle: { // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                // color: '#9A66E4',
                label: {
                  show: true // 是否展示
                  // textStyle: {
                  //   fontWeight: 'bolder',
                  //   fontSize: '12',
                  //   fontFamily: '微软雅黑'
                  // }
                }
              }

            },
            data: this.preCaseData
          },

          {
            name: 'prd运行用例数',
            type: 'bar',
            color: color[2],
            itemStyle: { // 柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                // 柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 10, 10],
                // color: '#9A66E4',
                label: {
                  show: true // 是否展示
                  // textStyle: {
                  //   fontWeight: 'bolder',
                  //   fontSize: '12',
                  //   fontFamily: '微软雅黑'
                  // }
                }
              }

            },
            data: this.prdCaseData
          },
          {
            label: {
              show: true,
              formatter: '{c}%'
            },
            name: 'sit运行用例成功率',
            type: 'line',
            color: color[0],
            yAxisIndex: 1,
            data: this.sitCaseRate
          },
          {
            label: {
              show: true,
              formatter: '{c}%'
            },
            name: 'pre运行用例成功率',
            type: 'line',
            color: color[1],
            yAxisIndex: 1,
            data: this.preCaseRate
          },
          {
            label: {
              show: true,
              formatter: '{c}%'
            },
            name: 'prd运行用例成功率',
            type: 'line',
            color: color[2],
            yAxisIndex: 1,
            data: this.prdCaseRate
          }

        ]
      }
    },

    queryInfo () {
      let params = {
        groupName: '全部'
      }
      queryRunDetail(params).then(res => {
        if (res.data && res.data.data) {
          this.handleData(res.data.data)
        }
      })
    },

    chartResize (e) {
      if (e.type === 'transitionend' && e.target !== e.currentTarget) return
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.$refs.simpleChart && this.$refs.simpleChart1) {
          this.$refs.simpleChart.resize()
          this.$refs.simpleChart1.resize()
        }
      }, 200)
    }
  },
  created () {

  },
  mounted () {
    this.queryInfo()

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
