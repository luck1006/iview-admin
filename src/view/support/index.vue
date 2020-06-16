<template>
  <div>
    <div>
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
    </div>
    <div style="margin-bottom: 20px;">
      <Collapse hide-arrow=true>
        <Panel name="support">
          度假技术支持分析
          <p slot="content"> <Input v-model="content"
                   type="textarea"
                   :autosize="{minRows:'10', maxRows: '15'}" />
            <Row type="flex"
                 justify="end"
                 class="code-row-bg">
              <i-col span="4">
                <Select v-model="receiver_to"
                        multiple
                        placeholder="email to"
                        clearable>
                  <Option v-for="item in receiverList"
                          :value="item.receiver_name"
                          :key="item.receiver_name">{{ item.receiver_name }}</Option>
                </Select>
              </i-col>
              <i-col span="4">
                <Select v-model="receiver_cc"
                        multiple
                        placeholder="email cc"
                        clearable>
                  <Option v-for="item in receiverList"
                          :value="item.receiver_name"
                          :key="item.receiver_name">{{ item.receiver_name }}</Option>
                </Select>
              </i-col>
              <i-col>
                <Button style="float:right"
                        type="primary"
                        @click="saveInfo()">save</Button>
              </i-col>
              <i-col>
                <Button style="float:right"
                        type="primary"
                        @click="sendInfo()">send</Button>
              </i-col>

            </Row>
          </p>

        </Panel>
      </Collapse>

    </div>
    <div style="margin-bottom: 20px;">
      <Row :gutter="20">
        <i-col span="10">
          <Card shadow>
            <simple-chart style="height: 300px;"
                          text="技术支持统计"
                          :option="pieOption"
                          ref="simpleChart"></simple-chart>

          </Card>
        </i-col>
        <i-col span="14">
          <Card shadow>
            <simple-chart style="height: 300px;"
                          :option="gridOption"
                          ref="simpleChart1"></simple-chart>
          </Card>
        </i-col>

      </Row>
    </div>
    <div style="margin-bottom: 20px;">
      <Row>
        <Card shadow>
          <simple-chart style="height: 310px;"
                        :option="lineOption"
                        ref="simpleChart2"></simple-chart>
        </Card>
      </Row>
    </div>
    <div style="margin-bottom: 20px;">
      <Row>
        <Card shadow>
          <simple-chart style="height: 310px;"
                        :option="lineOption1"
                        ref="simpleChart3"></simple-chart>
        </Card>
      </Row>
    </div>

    <div style="margin-bottom: 20px;">
      <Row>
        <Card shadow>
          <simple-chart style="height: 310px;"
                        :option="lineOption2"
                        ref="simpleChart4"></simple-chart>
        </Card>
      </Row>
    </div>

    <div style="margin-bottom: 20px;">
      <Row>
        <Card shadow>
          <Row type="flex"
               justify="center"
               class="code-row-bg">
            <i-col span="4">
              <Select v-model="choosetime"
                      style="width:160px"
                      @on-change="getresolutionRate">
                <Option v-for="item in timeList"
                        :value="item.value"
                        :key="item.value">{{ item.label }}</Option>
              </Select>
            </i-col>
          </Row>
          <simple-chart style="height: 310px;"
                        :option="lineOption3"
                        ref="simpleChart5"></simple-chart>
        </Card>
      </Row>
    </div>

  </div>
</template>
<script>
import { ChartPie } from '_c/charts'
import { technicalSupport, shotEmail, saveAnalysis, getAnalysis, getReceiver, resolutionRate } from '@/api/data'
import { on, off } from '@/libs/tools'
import simpleChart from '_c/charts/simpleChart.vue'
import Loading from '@/components/loading'
// import { createHash } from 'crypto'
export default {
  components: {
    ChartPie,
    simpleChart,
    Loading
  },
  data () {
    return {
      isLoading: true,
      pieOption: {},
      pieData: [],
      newNum: [],
      unsolvedNum: [],
      closeNum: [],
      xshow: [],
      week: [],
      gridOption: {},
      // 新增趋势
      lineOption: {},
      // 未解决趋势
      lineOption1: {},
      lineOption2: {},
      lineOption3: {},
      content: '',
      stack: '总量',
      hisunsolved: [],
      receiverList: [],
      receiver_to: '',
      receiver_cc: '',
      resolutionrate: [],
      time: [],
      timeList: [{ value: 'week', label: '周' }, { value: 'month', label: '月' }, { value: 'quarter', label: '季' }],
      choosetime: 'week',
      choosetime1: '周'
    }
  },
  methods: {
    pieclick (param) {
      console.log('pieclick', param)
    },
    getresolutionRate (val) {
      let param = {
        time: val
      }
      if (val === 'week') {
        this.choosetime1 = '周'
      } else if (val === 'month') {
        this.choosetime1 = '月'
      } else if (val === 'quarter') {
        this.choosetime1 = '季'
      }
      resolutionRate(param).then(res => {
        this.handleDataTwo(res.data.data)
      })
    },
    handleData (dataList) {
      dataList.forEach(data => {
        let dataArr = data.data
        this.week = dataArr.map(val => val.week)
        let dic = { value: dataArr[(dataArr.length) - 1].newnum, name: data.name }
        this.pieData.push(dic)
        this.xshow = dataArr[(dataArr.length) - 1].week
        let newD = dataArr[(dataArr.length) - 1].newnum
        this.newNum = this.newNum.concat(newD)
        let closeD = dataArr[(dataArr.length) - 1].closenum
        this.closeNum = this.closeNum.concat(closeD)
        let unsolveD = dataArr[(dataArr.length) - 1].unsolvednum
        this.unsolvedNum = this.unsolvedNum.concat(unsolveD)
        this.hisunsolved = dataArr.map(val => val.hisunsolved)
      })
      console.log(this.hisunsolved)
      this.isLoading = false
      // let dataArr = data.data
      let legend = dataList.map(val => val.name)

      let insteadl = legend
      insteadl.pop()
      // 每周新增技术支持
      this.pieOption = {
        title: {
          text: this.xshow + '新增技术支持统计',
          subtext: '度假系统',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          // left: 'bottom',
          y: 'bottom',
          data: insteadl
        },

        series: [
          {
            name: '新增技术支持',
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            data: this.pieData,

            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                label: {
                  show: true,
                  formatter: '{b} : {c} ({d}%)'
                },
                labelLine: { show: true }
              }
            }
          }
        ]
      }

      // 初始化饼图的点击事件
      this.$refs.simpleChart.pieclick((param) => {
        window.name = param.data.name
        this.$router.push({ path: '/supportmodule' })
      })
      // 每周累计流量图
      this.gridOption = {
        title: {
          text: this.xshow + '度假技术支持累计流量图'
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
          x: 'right',
          y: 'top',
          data: ['未解决', '已解决']
        },
        color: ['#ed3f14', '#00C78C'],
        grid: {
          // top: '3%',
          left: '1.2%',
          right: '5%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: legend
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0
            // max: 500
          },
          {
            type: 'value',
            min: 0,
            // max: 600,
            position: 'left',
            axisLine: {
              lineStyle: {
                // color: colors[2]
              }
            }
          }
        ],
        series: [
          {
            name: '未解决',
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top',
                color: '#ed3f14'
              }
            },
            areaStyle: {
              normal: {
                color: '#ed3f14'
              }
            },
            data: this.unsolvedNum
          },
          {
            name: '已解决',
            type: 'line',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'top'
                // color: colors[1]
              }
            },
            areaStyle: {
              normal: {
                // color: '#4608A6'
              }
            },
            data: this.closeNum
          }
        ]
      }
      // 新增技术支持趋势
      this.lineOption = {
        title: {
          text: '当周新增技术支持曲线'
        },
        label: {
          normal: {
            show: true,
            position: 'top'
            // color: '#ed3f14'
          }
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
          data: insteadl
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.week
        },
        yAxis: {
          type: 'value'
        },

        series: dataList.map(serie => {
          let obj = {
            name: serie.name,
            type: 'line',
            stack: serie.name,
            label: {
              normal: {
                show: true,
                position: 'top'
                // textStyle: {
                //   color: 'white'
                // }
              }
            },
            data: serie.data.map(val => val.newnum)
          }
          // console.log(serie.name)
          // console.log(obj)
          return obj
        })
      }
      this.lineOption1 = {
        title: {
          text: '当周未解决技术支持曲线'
        },
        // color: ['#0C17A6', '#4608A6', '#398DBF'],
        label: {
          normal: {
            show: true,
            position: 'top'
            // color: '#ed3f14'
          }
        },
        areaStyle: {
          normal: {
            // color: '#ed3f14'
          }
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
          data: legend
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.week
        },
        yAxis: {
          type: 'value'
        },

        series: dataList.map(serie => {
          // if (serie.name === '历史未解决总数') { this.stack = '历史' }
          let obj = {
            name: serie.name,
            type: 'line',
            // stack: this.stack,
            label: {
              normal: {
                show: true,
                position: 'top'
                // color: colors[1]
              }
            },
            // if ('aa'=== 'aa'){ console.log('aa') }
            // areaStyle: {},
            data: serie.data.map(val => val.unsolvednum)
          }
          // if (serie.name !== '历史未解决总数') { obj.areaStyle = {} }
          return obj
        })

      }

      this.lineOption2 = {
        title: {
          text: '截止目前遗留未解决技术曲线'
        },
        label: {
          normal: {
            show: true,
            position: 'top'
            // color: '#ed3f14'
          }
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
          data: insteadl
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.week
        },
        yAxis: {
          type: 'value'
        },

        series: [
          {
            name: '历史未解决总数',
            // radius: '100%',
            type: 'line',
            label: {
              normal: {
                show: true,
                position: 'top'
                // textStyle: {
                //   color: 'white'
                // }
              }
            },
            data: this.hisunsolved
          }]
      }
    },
    handleDataTwo (dataList) {
      let dataArr = dataList
      this.time = dataArr.map(val => val.time)
      this.resolutionrate = dataArr.map(val => Number(val.resolutionrate * 100).toFixed(2))
      this.isLoading = false
      // let dataArr = data.data
      let legend = dataList.map(val => val.name)

      let insteadl = legend
      insteadl.pop()

      // 技术支持解决率
      this.lineOption3 = {
        title: {
          // text: '历史技术支持解决率'
          text: '历史技术支持解决率' + '(' + this.choosetime1 + ')'
        },
        label: {
          normal: {
            show: true,
            position: 'top'
            // color: '#ed3f14'
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{b0}<br/>{a0}:{c0}%',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: insteadl
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.time
        },
        yAxis: [{
          type: 'value',
          interval: 5,
          axisLabel: {
            show: true,
            // interval: 'auto',
            formatter: '{value} %',
            lineHeight: 5
          },
          show: true
        }, {
          type: 'value',
          interval: 5,
          axisLabel: {
            show: true,
            // interval: 'auto',
            formatter: '{value} %',
            lineHeight: 5
          },
          show: true
        }
        ],

        series: [
          {
            type: 'line',
            name: '技术支持解决率',
            // label: {
            //   normal: {
            //     show: true,
            //     position: 'top',
            //     formatter: function (val) {
            //       return val.data + '%'
            //     }
            //   }
            // },
            data: this.resolutionrate
          },
          {
            type: 'line',
            yAxisIndex: 1,
            data: this.resolutionrate
          }
        ]
      }
    },
    chartResize (e) {
      if (e.type === 'transitionend' && e.target !== e.currentTarget) return
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.$refs.simpleChart && this.$refs.simpleChart1 && this.$refs.simpleChart2) {
          this.$refs.simpleChart.resize()
          this.$refs.simpleChart1.resize()
          this.$refs.simpleChart2.resize()
          this.$refs.simpleChart3.resize()
          this.$refs.simpleChart4.resize()
          this.$refs.simpleChart5.resize()
        }
      }, 200)
    },
    sendInfo (msg) {
      let params = {
        url: window.location.href,
        subject: this.xshow + '度假技术支持分析',
        to: this.receiver_to.join(','),
        cc: this.receiver_cc.join(','),
        type: 'support', // 截图类型,
        row: '.content-wrapper', // selector 选择器,
        panel: '.ivu-card', // selector 选择器
        content: this.content

      }
      shotEmail(JSON.stringify(params)).then((response) => {
        let res = response.data
        if (res.success === 'true') {
          // alert('保存数据成功～～')
          this.$Message.success(res.msg)
        } else {
          this.$Message.error(res.msg)
        }
      })
    },
    saveInfo () {
      saveAnalysis({ content: this.content }).then(res => {
        if (res.data.success === 'true') {
          this.$Message.success(res.data.msg)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    }
  },
  created () {
    // 获取邮件接收者的列表
    getReceiver(this.$route.data).then(res => {
      if (res.data && res.data.data) {
        this.receiverList = res.data.data.receiver_name
      }
    })
  },
  mounted () {
    technicalSupport().then(res => {
      if (res.data && res.data.data && res.data.data.length > 0) {
        this.handleData(res.data.data)
      }
    })
    on(window, 'resize', this.chartResize)
    on(
      document.getElementById('left-sider'),
      'transitionend',
      this.chartResize
    )

    getAnalysis().then(res => {
      this.content = res.data.data[0].content
    })

    resolutionRate(this.choosetime).then(res => {
      // console.log(res)
      if (res && res.data && res.data.data && res.data.data.length > 0) {
        this.handleDataTwo(res.data.data)
        // this.resolutionRate = res.data.data;
      }
    })
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
