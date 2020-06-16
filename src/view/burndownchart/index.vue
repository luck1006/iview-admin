<template>
    <div>
    <Row :gutter="10"
         type="flex"
         justify="center"
         align="middle"
         class="code-row-bg">
      <div>
        <transition name="fade">
          <loading v-if="isLoading"></loading>
        </transition>
      </div>
      <i-col>
        <h3>以下燃尽图数据为：已激活且未关闭状态下的所有sprint</h3>
      </i-col>
      <!--
      <i-col span="3">
        <Select v-model="team" @on-change="getSprintByTeam(team)">
          <Option v-for="item in teams"
            :value="item.value"
            :key="item.value">
            {{ item.label }}
          </Option>
        </Select>
      </i-col>
      <i-col span="4">
        <Select v-model="sprintTeam" @on-change="getSprint(sprintTeam)"
          placeholder="迭代组，默认为团队下所有组">
          <Option v-for="item in sprintTeams"
            :value="item.value"
            :key="item.value">
            {{ item.label }}
          </Option>
        </Select>
      </i-col>
      -->
    </Row>
     <br>
    <div v-for="(option, index) in optionList" :key="index">
        <i-col :md="24"
                :lg="22"

                style="margin-bottom: 20px;">
            <Card shadow>
                <simple-chart style="height: 360px;"
                            :option="option.mixLineBarOption"
                            ref="simpleChart"></simple-chart>
            </Card>
        </i-col>
    </div>
    </div>
</template>

<script>
import simpleChart from './simpleChart.vue'
import { getTeamSprintRelationship, getburndownchart, queryActiveSprint } from '@/api/data'
import { on, off } from '@/libs/tools'
import Loading from '@/components/loading'

export default {
  name: 'chart',
  data () {
    return {
      isLoading: true,
      optionList: [],
      timer: null,
      dataList: [],
      teams: [],
      team: '',
      // sumpoint: 0,
      sprintTeam: '',
      sprintTeams: [],
      teamSprintRelation: ''
    }
  },
  components: {
    simpleChart,
    Loading
  },
  mounted () {
    // this.queryTeamSprint()
    this.getAllActiveSprint()
    on(window, 'resize', this.chartResize)
    on(
      document.getElementById('left-sider'),
      'transitionend',
      this.chartResize
    )
  },
  methods: {
    topicsearch (dataList) {
      let searchdatalist = []
      // console.log('the dataList is : ', dataList, dataList.length)
      for (var i = 0; i < dataList.length; i++) {
        searchdatalist.push(dataList[i])
      }
      console.log('the searchdatalist is >:', searchdatalist)
      this.optionList.splice(0)
      searchdatalist.forEach(data => {
        // 获取迭代开始、结束时间
        let beginDate = this.utc2standdate(data.startTime)
        let endDate = ''
        if (data.hasOwnProperty('completeTime')) {
          // console.log('aaaaaa')
          endDate = this.utc2standdate(data.completeTime)
        } else if (data.now >= data.endTime) {
          // console.log('bbbbbb')
          endDate = this.utc2standdate(data.now)
        } else {
          endDate = this.utc2standdate(data.endTime)
        }
        // console.log('the begin day is :', beginDate)
        // console.log('the end day is :', endDate)

        let xdays = this.getAllDate(beginDate, endDate)
        // console.log('the xdays is ::::', xdays)

        let mixLineBarOption = {
          title: {
            text: data.sprintName
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
          /*
          formatter: params => {
            console.log('the formatter params is :', params)
            let arr = params.map(val => {
              let symbol = `<span style='display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  val.color};'></span>`
                let text = `${val.seriesName}: ${val.value[1]}<br/>`
                if (val.value.length === 3) {
                  if (val.seriesName === 'Time Spent') {
                    for (let i in  val.value[2]) {
                      let timeSpentHour = (val.value[2][i].timeC.timeSpent/(60*60)).toFixed(2)
                      //text = text + `${val.value[2][i].key} : ${val.value[2][i].timeC.timeSpent}<br/>`
                      text = text + `${val.value[2][i].key} : ${timeSpentHour}H<br/>`
                    }
                  } else if (val.seriesName === 'Remaining Values') {
                    for (let j in val.value[2]) {
                      let timeEstimatetHour = (val.value[2][i].timeC.newEstimate/(60*60)).toFixed(2)
                      //text = text + `${val.value[2][j].key} : ${val.value[2][j].timeC.newEstimate}<br/>`
                      text = text + `${val.value[2][j].key} : ${timeEstimatetHour}H<br/>`
                    }
                  }

                  let changDate = this.utc2standtime(val.value[0])
                  text  += `${changDate}<br/>`
                }
                return symbol + text
            })
            return arr.join('<br />')
          }
          */
          },
          legend: {
          // data: dataList.map(val => val.xdays).map(val => val)
            data: ['Time Spent', 'Remaining Values']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            name: '时间',
            nameLocation: 'center',
            nameTextStyle: {
              color: 'black',
              fontStyle: 'italic',
              fontWeight: 'bold'
            },
            type: 'time',
            boundaryGap: ['20%', '20%'],
            show: true,
            maxInterval: 3600 * 24 * 1000 * 3,
            min: xdays[0],
            max: xdays[xdays.length - 1],
            axisLabel: {
              // interval: 1,
              align: 'center',
              showMaxLabel: true
              // formatter: xdays.map(val => val)
            }
          // data: xdays
          // data: data.changes.spent.map(val => val[0])
          },
          yAxis: {
            type: 'value',
            name: '工时',
            nameLocation: 'end',
            nameTextStyle: {
              color: 'black',
              fontStyle: 'italic',
              fontWeight: 'bold'
            }
          },
          dataset: {
            source: data.spent
          },
          series: [
            {
              name: 'Time Spent',
              type: 'line',
              step: true, // 设置为梯度拆线
              data: data.spent,
              // encode: {
              //    x:[0],
              //    y:[1]
              // },
              itemStyle: {
                normal: {
                  color: 'green',
                  lineStyle: {
                    color: 'green'
                  }
                }
              },
              smooth: false // 用于设置拆线不为平滑曲线，而为直线
            },
            {
              name: 'Remaining Values',
              type: 'line',
              step: true,
              data: data.estimate,
              itemStyle: {
                normal: {
                  color: 'red',
                  lineStyle: {
                    color: 'red'
                  }
                }
              },
              smooth: false
            }
          ]

        }
        this.optionList.push({ mixLineBarOption })
        this.isLoading = false
        console.log('the optionList is :', this.optionList)
      })
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
    // 获取团队列表
    queryTeamSprint () {
      getTeamSprintRelationship().then(res => {
        this.teamSprintRelation = res.data.data
        var data1 = res.data.data
        // console.log('aaaa: ', this.teamSprintRelation)
        var data2 = []
        for (let i in data1) {
          let o = {}
          o['label'] = i
          o['value'] = i
          data2.push(o)
        }
        this.teams = data2
        // console.log('keys is ....: ', this.teams)
        this.team = data2[0].label
        this.getSprintByTeam(this.team)
      }
      )
    },
    // 获取已激活的所有sprint
    getAllActiveSprint () {
      queryActiveSprint().then(res => {
        if (res.data.data.length > 0) {
          this.sprintTeams = res.data.data
          this.getAllSprintChart(this.sprintTeams)
        } else {
          this.$Message.error('目前无有效的sprint')
        }
      })
    },
    // 获取所有迭代组的燃尽图数据
    getAllSprintChart (sprintTeams) {
      console.log('All active sprint is :', sprintTeams)
      // 查询所有sprint下的燃尽图数据
      if (sprintTeams.length > 0) {
        let sprintParams = []
        let singleSprint = {}
        for (let sprint in this.sprintTeams) {
          singleSprint = {}
          singleSprint['sprintid'] = this.sprintTeams[sprint].id
          singleSprint['sprintname'] = this.sprintTeams[sprint].name
          sprintParams.push(singleSprint)
        }
        // console.log('the params is :', sprintParams)
        getburndownchart({ sprintid: JSON.stringify(sprintParams) }).then(res => {
          this.dataList = res.data.data
          this.topicsearch(this.dataList) // 将获取到的燃尽图数据处理成图表形式展示在界面
        })
      } else {
        this.$Message.error('该团队下暂无有效的sprint')
      }
    },
    // 获取团队下的sprint 以及 分别获取各个sprint下的燃尽图数据
    getSprintByTeam (team) {
      console.log('222222----:', this.teamSprintRelation)
      console.log('the select team is : ', this.team)
      for (let i in this.teamSprintRelation) {
        if (i === this.team) {
          this.sprintTeams = this.teamSprintRelation[i]
          break
        } else {
          this.sprintTeams = []
        }
      }
      // console.log('the sprint list is :', this.sprintTeams, this.sprintTeams.length)
      // 如果获取到了对应的sprint，则分别查询sprint下的燃尽图数据
      if (this.sprintTeams.length > 0) {
        let sprintParams = []
        let singleSprint = {}
        for (let sprint in this.sprintTeams) {
          singleSprint = {}
          singleSprint['sprintid'] = this.sprintTeams[sprint].value
          singleSprint['sprintname'] = this.sprintTeams[sprint].label
          sprintParams.push(singleSprint)
        }
        // console.log('the params is :', sprintParams)
        getburndownchart({ sprintid: JSON.stringify(sprintParams) }).then(res => {
          this.dataList = res.data.data
          this.topicsearch(this.dataList) // 将获取到的燃尽图数据处理成图表形式展示在界面
        })
      } else {
        this.$Message.error('该团队下暂无有效的sprint')
      }
    },
    // 获取单个sprint下的燃尽图数据
    getSprint (sprintTeam) {
      // console.log('the teamSprintRelation is ---->:', this.teamSprintRelation)
      // console.log('the select sprint is : ', this.sprintTeam)
      let tmpTeam = this.teamSprintRelation[this.team]
      // 查询sprint下的燃尽图数据
      let spirntinfo = []
      let sprintName = ''
      for (let id in tmpTeam) {
        if (tmpTeam[id].value === this.sprintTeam) {
          sprintName = tmpTeam[id].label
        }
      }
      spirntinfo.push({ 'sprintid': this.sprintTeam, 'sprintname': sprintName })
      getburndownchart({ sprintid: JSON.stringify(spirntinfo) }).then(res => {
        this.dataList = res.data.data
        this.topicsearch(this.dataList)
      })
    },
    utc2standdate (utcdate) {
      let date = new Date(utcdate)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      month = month < 10 ? ('0' + month) : month
      let newday = year + '-' + month + '-' + day
      console.log('the new Days is :', newday)
      return newday
    },
    utc2standtime (utcdate) {
      let date = new Date(utcdate)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let min = date.getMinutes()
      let sec = date.getSeconds()
      month = month < 10 ? ('0' + month) : month
      hour = hour < 10 ? ('0' + hour) : hour
      min = min < 10 ? ('0' + min) : min
      sec = sec < 10 ? ('0' + sec) : sec
      let newday = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec
      console.log('the new Days is :', newday)
      return newday
    },
    getAllDate (start, end) {
      var arr = []
      var ab = start.split('-')
      var ae = end.split('-')
      var db = new Date()
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
      var de = new Date()
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
      var unixDb = db.getTime() - 24 * 60 * 60 * 1000
      var unixDe = de.getTime() - 24 * 60 * 60 * 1000
      for (var k = unixDb; k <= unixDe;) {
        k = k + 24 * 60 * 60 * 1000
        let tmpdate = new Date(parseInt(k))
        let standDate = tmpdate.getFullYear() + '-' + (tmpdate.getMonth() + 1) + '-' + tmpdate.getDate()
        arr.push(standDate)
      }
      return arr
    }
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
