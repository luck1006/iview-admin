<template>
  <div>
    <div>
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
    </div>
    <Row type="flex"
         justify="end"
         class="code-row-bg">
      <i-col span="4">
        <Select v-model="week"
                clearable>
          <Option v-for="item in weekList"
                  :value="item.week"
                  :key="item.week">{{ item.week }}</Option>
        </Select>
      </i-col>

      <!-- <i-col span="4"> <Button @click="queryInfo">查询信息</Button></i-col> -->
      <i-col span="4">
        <Button type="primary"
                @click="queryweek()">一键生成资本化数据</Button>
      </i-col>
    </Row>

    <Card style="width:120px;height:40px">
      <div style="text-align:center">
        <h5>部门信息</h5>
      </div>
    </Card>

    <div style="margin-bottom: 10px;">
      <Table border
             stripe
             :columns="columns1"
             :data="data1"></Table>
    </div>

    <Card style="width:120px;height:40px">
      <div style="text-align:center">
        <h5>项目工作量</h5>
      </div>
    </Card>
    <div style="margin-bottom: 10px;">

      <Table border
             stripe
             :columns="columns2"
             :data="data2"></Table>
    </div>

    <Card style="width:120px;height:40px">
      <div style="text-align:center">
        <h5>需求/技术支持</h5>
      </div>
    </Card>
    <div style="margin-bottom: 10px;">

      <Table border
             stripe
             :columns="columns3"
             :data="data3"></Table>
    </div>
    <div style="margin-bottom: 20px;">
      <Row :gutter="25">
        <i-col span="9">
          <Card shadow>
            <simple-chart style="height: 300px;"
                          text="资本化数据统计"
                          :option="pieOption"
                          ref="simpleChart"></simple-chart>

          </Card>
        </i-col>
        <i-col span="15">
          <Card shadow>
            <simple-chart style="height: 300px;"
                          :option="gridOption"
                          ref="simpleChart1"></simple-chart>
          </Card>
        </i-col>

      </Row>
    </div>
  </div>
</template>
<script>
import { ChartPie } from '_c/charts'
import { timeworking, getweek } from '@/api/data'
import simpleChart from '_c/charts/simpleChart.vue'
import { on, off } from '@/libs/tools'
import Loading from '@/components/loading'
export default {
  components: {
    ChartPie,
    simpleChart,
    Loading
  },
  data () {
    return {
      isLoading: true,
      columns1: [
        {
          title: '部门总人数',
          width: 250,
          key: 'totalnum'
        },
        {
          title: '项目统计人数',
          // width: 240,
          key: 'statisticsnum'
        },
        {
          title: '本期参与项目人数',
          // width: 240,
          key: 'participationnum'
        },
        {
          title: '部门理论人天',
          // width: 240,
          key: 'theorytime'
        }
      ],
      columns2: [
        {
          title: '在行项目实际人天',
          width: 250,
          key: 'inlinetime'
        },
        {
          title: '项目理论人天',
          // width: 250,
          key: 'projecttheorytime'
        },
        {
          title: '项目人员利用率',
          // width: 250,
          key: 'utilization'
        },
        {
          title: '项目人天占比',
          // width: 250,
          key: 'proportion'
        }
      ],
      columns3: [
        {
          title: '需求实际每周人天',
          width: 250,
          key: 'requiretime'
        },
        {
          title: '需求人天占比',
          // width: 250,
          key: 'rproportion'
        },
        {
          title: '技术支持每周人天',
          // width: 250,
          key: 'support'
        },
        {
          title: '技术支持占比',
          // width: 250,
          key: 'sproportion'
        }
      ],
      data1: [],
      data2: [],
      data3: [],
      weekList: [],
      week: '',
      pieOption: {},
      gridOption: {},
      dic1: {},
      dic2: {},
      dic3: {},
      pieData: [],
      gridData: [],
      legend: [],
      series: []

    }
  },
  created () {
    // 获取资本化统计的周数
    getweek(this.$route.data).then(res => {
      if (res.data && res.data.data) {
        this.weekList = res.data.data.week
        // console.log(res.data.data.week)

        this.week = res.data.data.week[0].week

        // console.log(this.name)

        this.queryweek()
      }
    })
  },
  mounted () {
    if (this.$route.params.week) {
      this.week = this.$route.params.week
      this.queryweek()
    }
    this.isLoading = false
    on(window, 'resize', this.chartResize)
    on(
      document.getElementById('left-sider'),
      'transitionend',
      this.chartResize
    )
  },

  methods: {
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    queryweek () {
      let params = {
        week: this.week
      }
      timeworking(params).then((response) => {
        this.pieData.splice(0)
        this.gridData.splice(0)
        // this.pieOption.series.pieData = []

        let res = response.data
        // console.log(res)
        if (res.success === 'true') {
          this.data1.splice(0)
          this.data2.splice(0)
          this.data3.splice(0)

          // table1
          let totalnum = res.data.DepartmentInfo.totalnum
          let statisticsnum = res.data.DepartmentInfo.statisticsnum
          let participationnum = res.data.DepartmentInfo.participationnum
          let theorytime = res.data.DepartmentInfo.theorytime
          // table2
          let inlinetime = res.data.ProjectInfo.inlinetime
          let projecttheorytime = res.data.ProjectInfo.projecttheorytime
          let utilization = res.data.ProjectInfo.utilization
          let proportion = res.data.ProjectInfo.proportion

          // table3
          let requiretime = res.data.RtsupportInfo.requiretime
          let rproportion = res.data.RtsupportInfo.rproportion
          let support = res.data.RtsupportInfo.support
          let sproportion = res.data.RtsupportInfo.sproportion
          // simpleChart1
          let lingshouTime = res.data.ModuleInfo.lingshouTime
          let zhuanhuaTime = res.data.ModuleInfo.zhuanhuaTime
          let xinkeTime = res.data.ModuleInfo.xinkeTime
          let yunyingTime = res.data.ModuleInfo.yunyingTime
          let jiagouTime = res.data.ModuleInfo.jiagouTime
          let dabaoTime = res.data.ModuleInfo.dabaoTime
          let juheTime = res.data.ModuleInfo.juheTime
          let huiyuanTime = res.data.ModuleInfo.huiyuanTime
          let gongyinglianTime = res.data.ModuleInfo.gongyinglianTime
          let dingdanTime = res.data.ModuleInfo.dingdanTime

          this.data1.push({ totalnum: totalnum, statisticsnum: statisticsnum, participationnum: participationnum, theorytime: theorytime })
          this.data2.push({ inlinetime: inlinetime, projecttheorytime: projecttheorytime, utilization: utilization, proportion: proportion })
          this.data3.push({ requiretime: requiretime, rproportion: rproportion, support: support, sproportion: sproportion })

          let dic1 = { value: requiretime, name: '需求工时' }
          let dic2 = { value: inlinetime, name: '项目工时' }
          let dic3 = { value: support, name: '技术支持工时' }
          this.pieData.push(dic1, dic2, dic3)
          this.gridData.push(lingshouTime, zhuanhuaTime, xinkeTime, yunyingTime, jiagouTime, dabaoTime, juheTime, huiyuanTime, gongyinglianTime, dingdanTime)

          console.log(this.pieData)
          console.log(this.gridData)

          let legend = ['需求工时', '项目工时', '技术支持工时']
          // 项目，资本化，技术支持占比饼图
          this.pieOption = {
            title: {
              text: '资本化数据占比统计',
              subtext: this.week,
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
              data: legend
            },
            series: [
              {
                name: '资本化数据占比',
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
          // 内部资本化工时占比

          this.gridOption = {
            title: {
              text: '资本化项目工时一览',
              subtext: this.week
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['工时']
            },
            toolbox: {
              show: true
            },
            calculable: true,
            // grid: { y: 70, y2: 30, x2: 20 },
            xAxis: [
              {
                type: 'category',
                data: ['零售转化', '度假转化', '新客转化', '老客运营', '框架', '打包预定', '聚合转化', '会员订单', '供应链', '大数据']
                // data: ['1', '2', '3', '4', '5', '6', '7', '8']

              },
              {
                type: 'category',
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false },
                splitArea: { show: false },
                splitLine: { show: false },
                data: ['零售', '度假', '新客', '老客', '框架', '打包', '聚合', '会员订单', '供应链', '大数据']
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
                name: '工时',
                radius: '100%',
                type: 'bar',
                itemStyle: {
                  normal: {
                    barBorderRadius: [10, 10, 10, 10],
                    color: 'rgba(193,35,43,0.5)',
                    label: { show: true }
                  }
                },
                // data: [36, 31, 60, 81, 90, 33, 89, 34]
                data: this.gridData

              }
            ]
          }
        }
      }
      )
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
