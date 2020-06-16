<template>
  <div>
    <!-- <template> -->

    <!-- </template> -->
    <Row :gutter="20"
         type="flex"
         justify="end"
         align="middle"
         class="code-row-bg">
      <div>
        <transition name="fade">
          <loading v-if="isLoading"></loading>
        </transition>
      </div>
      <i-col>
        <p>所属topic</p>
      </i-col>
      <i-col span="4">
        <Select v-model="topic" @on-change="selecttopic(topic)">
          <Option v-for="(item,index) in topiclist" :value="item" :key="index">
            {{ item }}
          </Option>
        </Select>
      </i-col>
      <!-- <i-col span="4">
        <Button type="primary" @click="topicsearch">查询</Button>
      </i-col> -->
      <i-col span="4"><Input v-model="vers"
               placeholder="版本号，例：20.01.0" />

      </i-col>
      <i-col span="4"> <Button type="primary"
                @click="syncInfo">同步信息</Button></i-col>
    </Row>
    <br>
    <div>
      <Row :gutter="20">
        <template v-for="(option, i) in optionList">
          <i-col :md="24"
                 :lg="16"
                 :key="`team-mix-${i}`"
                 style="margin-bottom: 20px;">
            <Card shadow>
              <simple-chart style="height: 300px;"
                            :option="option.mixLineBarOption"
                            ref="simpleChart"></simple-chart>
            </Card>
          </i-col>
          <i-col :md="24"
                 :lg="8"
                 :key="`team-radar-${i}`"
                 style="margin-bottom: 20px;">
            <Card shadow>
              <simple-chart style="height: 300px;"
                            :option="option.radarOption"
                            ref="simpleChart"></simple-chart>
            </Card>
          </i-col>
        </template>
      </Row>
    </div>
  </div>
</template>

<script>
import simpleChart from './simpleChart.vue'
import { queryChart, syncScrum } from '@/api/data'
import { on, off } from '@/libs/tools'
import Loading from '@/components/loading'

const SERIESNAME = [
  {
    name: '需求个数',
    value: 'reqnum',
    chartType: 'bar',
    type: 'number'
  },
  {
    name: '计划point',
    value: 'planpoint',
    chartType: 'bar',
    type: 'number'
  },
  {
    name: '实际point',
    value: 'actualpoint',
    chartType: 'bar',
    type: 'number'
  },
  {
    name: '验收缺陷率',
    value: 'bugrate',
    chartType: 'line',
    type: 'percent'
  }
]
const RADARNAME = [
  {
    name: '职责共享',
    max: 12
  },
  {
    name: '需求',
    max: 12
  },
  {
    name: '交付保障',
    max: 12
  },
  {
    name: '度量',
    max: 12
  },
  {
    name: '自组织',
    max: 12
  },
  {
    name: '测试',
    max: 12
  }

]
export default {
  name: 'chart',
  data () {
    return {
      isLoading: true,
      optionList: [],
      timer: null,
      dataList: [],
      topiclist: [],
      topic: '',
      // sumpoint: 0,
      vers: ''
      // optionList: [{ mixLineBarOption: mixLineBar, radarOption: radar }]
    }
  },
  components: {
    simpleChart,
    Loading
  },
  methods: {
    topicsearch (topic, dataList) {
      let searchdatalist = []
      for (var i = 0; i < dataList.length; i++) {
        if (topic === dataList[i].teamtopic) {
          searchdatalist.push(dataList[i])
        }
      }
      // console.log(2)
      // console.log(searchdatalist)
      this.optionList.splice(0)
      searchdatalist.forEach(data => {
        let scrumInfo = data.scrumInfo
        let mixLineBarOption = {
          title: {
            text: data.teamCode,
            subtext: data.teamName,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            },
            formatter: params => {
              let arr = params.map(val => {
                let symbol = `<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  val.color};'></span>`
                let text = `${val.seriesName}: ${val.value}`
                if (
                  SERIESNAME.find(serie => serie.name === val.seriesName)
                    .type === 'percent'
                ) {
                  text += '%'
                }
                return symbol + text
              })
              arr.unshift(params[0].name)
              return arr.join('<br />')
            }
          },
          legend: {
            left: 'center',
            top: 'bottom'
          },
          xAxis: [
            {
              type: 'category',
              data: scrumInfo.map(val => val.vers),
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: 'point'
            },
            {
              type: 'value',
              name: 'bug折算率',
              axisLabel: {
                formatter: '{value}%'
              },
              axisPointer: {
                label: {
                  formatter: '{value}%'
                }
              }
            }
          ],
          series: SERIESNAME.map(serie => {
            let obj = {
              name: serie.name,
              type: serie.chartType,
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

              yAxisIndex: serie.chartType === 'bar' ? 0 : 1,
              lineStyle: {
                normal: {
                  width: 5
                }
              },
              data: scrumInfo.map(val => {
                let value = val[serie.value]
                if (serie.type === 'percent') {
                  value = Number(value.replace('%', ''))
                }
                return value
              })
            }
            if (serie.value === 'bugrate') {
              Object.assign(obj, {
                markLine: {
                  symbol: 'none',
                  label: {
                    show: false
                  },
                  data: [
                    {
                      lineStyle: {
                        type: 'dotted',
                        color: '#ed3f14',
                        width: 5
                      },
                      yAxis: 15
                    }
                  ]
                },
                label: {
                  show: true,
                  formatter: '{c}%'
                }
              })
            }
            return obj
          })
        }

        let ammInfo = data.ammInfo
        let titleAll = ammInfo.reduce((result, amm) => {
          return new Set([...result, ...amm.data.map(val => val.title)])
        }, new Set())
        titleAll = [...titleAll]
        let radarOption = {
          title: {
            text: data.teamCode,
            subtext: '成熟度'
            // left: 'center'
          },
          tooltip: {},
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            // left: 'center',
            top: 'bottom'
          },
          radar: {

            indicator: titleAll.map(title => {
              let findTitle = RADARNAME.find(val => val.name === title)
              let max = (findTitle && findTitle.max) || 12
              return { name: title + '(' + max + ')', max }
            }
            ),

            radius: '65%',
            name: {
              rich: {
                a: {
                  color: 'green',
                  lineHeight: 10,
                  fontSize: 10,
                  fontWeight: 'bolder'

                }
                // b: {
                //   color: '#fff',
                //   align: 'center',
                //   backgroundColor: '#666',
                //   padding: 2,
                //   borderRadius: 4
                // }
              },
              formatter: (a) => {
                return `{a|${a}}`
              }
            }

          },
          series: [
            {
              type: 'radar',
              lineStyle: {
                width: 5
              },
              name: data.teamCode,
              data: ammInfo.map(amm => {
                let name = amm.legend
                let value = titleAll.map(title => {
                  let ammData = amm.data.find(val => val.title === title)
                  // console.log('aaa======')
                  // console.log(ammData)
                  // console.log(ammData.point)
                  // this.sumpoint += ammData.point
                  return (ammData && ammData.point) || 0
                }
                  // console.log(this.sumpoint)
                )
                let label = {
                  show: true,
                  formatter: { value },
                  textStyle: {
                    color: 'orange',
                    fontSize: 14,
                    fontWeight: 600
                  }
                }
                return { name, value, label }
              })
            }
          ]
        }
        this.optionList.push({ mixLineBarOption, radarOption })
        this.isLoading = false
      })
    },
    handleData (dataList) {
      // this.optionList.shift()
      for (const item of dataList) {
        if (item.teamtopic) {
          this.topiclist.push(item.teamtopic)
        }
      }
      for (var i = 0; i < this.topiclist.length; i++) {
        for (var j = i + 1; j < this.topiclist.length; j++) {
          if (this.topiclist[i] === this.topiclist[j]) {
            this.topiclist.splice(j, 1)
            j--
          }
        }
      }
      // console.log(3)
      // console.log(this.topiclist)
      // console.log(dataList)
      this.topic = this.topiclist[0]
      this.topicsearch(this.topic, this.dataList)
    },
    selecttopic (topic) {
      this.topic = topic
      // console.log(1)
      // console.log(this.topic)
      // console.log(this.dataList)
      if (this.topic === '') {
        this.$Message.info('请选择分组查询')
      } else {
        this.topicsearch(this.topic, this.dataList)
      }
    },
    chartResize (e) {
      // console.log(3.1)
      if (e.type === 'transitionend' && e.target !== e.currentTarget) return
      clearTimeout(this.timer)
      // console.log(3.3)
      this.timer = setTimeout(() => {
        // console.log(3.4)
        console.log(this.$refs.simpleChart)
        if (this.$refs.simpleChart && this.$refs.simpleChart.length > 0) {
          // console.log(3.5)
          this.$refs.simpleChart.forEach(ref => {
            // console.log(3.6)
            ref.resize()
            // console.log(3.7)
          })
        }
      }, 200)
      // console.log(3.2)
    },
    syncInfo () {
      this.isLoading = true
      let params = {
        vers: this.vers
      }
      // console.log(JSON.stringify(params))
      syncScrum(JSON.stringify(params)).then((response) => {
        let res = response.data
        if (res && res.success === 'true') {
          // router.push({ name: 'chart' })
          this.$Message.info('后台数据正在同步中，请3分钟后查看～～')
        } else {
          this.$Message.error('同步数据失败～～')
        }
        this.isLoading = false
      })
    }
  },
  mounted () {
    queryChart().then(res => {
      if (res.data && res.data.data && res.data.data.length > 0) {
        this.dataList = res.data.data
        this.handleData(this.dataList)
      }
    })
    on(window, 'resize', this.chartResize)
    on(
      document.getElementById('left-sider'),
      'transitionend',
      this.chartResize
    )
    // simpleChart.on('click', function (params) { console.log('a') })
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
<style>
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
</style>
