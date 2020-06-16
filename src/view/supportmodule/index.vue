<template>
  <div>
    <div>
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
    </div>
    <div>
       <Form :label-width="85" inline style="text-align: right">
        <FormItem label="一级系统:">
        <Select style="width:140px" v-on:input="qerysys()"  v-model="fristsys">
          <!-- <Option value="FristALL">请选择</Option> -->
          <Option value="会员">会员</Option>
          <Option value="营销">营销</Option>
          <Option value="订单">订单</Option>
          <Option value="门票">门票</Option>
          <Option value="供应链">供应链</Option>
          <Option value="确认管理">确认管理</Option>
        </Select>
       </FormItem>
       <FormItem label="二级系统:">
        <Select style="width:140px" v-on:input="indexSelect()" v-model="systmd">
          <Option v-for="systm in systmList" :value="systm" :key="systm">{{systm}}</Option>
        </Select>
      </FormItem>
        <Button type="primary" @click="qerymodule()">查询</Button>
      </Form>
    </div>

    <div style="margin-bottom: 20px;">
      <Row :gutter="20">
        <i-col span="11">
          <simple-chart style="height: 350px;" :option="lineOptiontwo1" ref="simpleChart1"></simple-chart>
        </i-col>
        <i-col span="13">
            <simple-chart style="height: 350px;" :option="lineOptionthree2" ref="simpleChart3"></simple-chart>
        </i-col>
      </Row>
    </div>
    <div style="margin-bottom: 20px;">
      <Row>
        <Card shadow>
          <simple-chart style="height: 460px;" :option="lineOption" ref="simpleChart2"></simple-chart>
        </Card>
      </Row>
    </div>
  </div>
</template>

<script>
import { ChartPie } from '_c/charts'
import { getmodules, getty, gettyall, gettynew } from '@/api/data'
import { on } from '@/libs/tools'
import simpleChart from '_c/charts/simpleChart.vue'
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
      module1: '',
      week: [],
      show: [],
      xshow: [],
      types: [],
      pieData: [],
      lineOption: {},
      lineOptiontwo1: {},
      lineOptionthree2: {},
      components: {},
      systm: '',
      systmd: '',
      fristsys: '',
      systmList: [
        'crm系统',
        '会员系统',
        'Boss3订单系统',
        '分单系统',
        '门票系统',
        '营销',
        '确认管理',
        '产品系统',
        '资源系统',
        '库存系统',
        '采购系统',
        '投诉质检',
        'NB系统',
        '出团通知',
        '其他',
        'BOH'
      ]
    }
  },
  created () {
    if (window.name) {
      this.fristsys = window.name
    }
    // 获取系统模块
    if (this.fristsys === '会员') {
      this.systmd = '全部'
      this.systmList = ['全部', 'crm系统', '会员系统']
    } else if (this.fristsys === '营销') {
      this.systmd = '全部'
      this.systmList = ['全部', '营销']
    } else if (this.fristsys === '订单') {
      this.systmd = '全部'
      this.systmList = ['全部', 'Boss3订单系统', '分单系统']
    } else if (this.fristsys === '门票') {
      this.systmd = '全部'
      this.systmList = ['全部', '门票系统']
    } else if (this.fristsys === '供应链') {
      this.systmd = '全部'
      this.systmList = ['全部', '产品系统', '资源系统', '库存系统', '采购系统', '投诉质检', 'NB系统', '出团通知', 'BOH']
    } else {
      this.systmd = '全部'
      this.systmList = ['全部', '确认管理']
    }
    let systmselected1 = { modulesystem: this.systmd }
    getmodules(systmselected1).then(res => {
      if (res.data) {
        this.moduleList = res.data.data
        this.qerymodule()
      }
    })
  },

  mounted () {
    this.isLoading = false
    on(window, 'resize', this.chartResize)
    on(
      document.getElementById('left-sider'),
      'transitionend',
      this.chartResize
    )
  },
  beforeDestroy () {
    if (window.name) {
      this.qerymodule()
    }
  },
  methods: {
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    indexSelect () {
      this.systm = this.systmd
      let systmselected1 = { modulesystem: this.systm }
      getmodules(systmselected1).then(res => {
        if (res.data) {
          this.moduleList = res.data.data
          this.module1 = res.data.data[0]
          this.qerymodule()
        }
      })
      // console.log(9999999, this.systm)
    },
    qerysys () {
      this.systmList = []
      if (this.fristsys === '会员') {
        this.systmd = '全部'
        this.systmList = ['全部', 'crm系统', '会员系统']
      } else if (this.fristsys === '营销') {
        this.systmd = '全部'
        this.systmList = ['全部', '营销']
      } else if (this.fristsys === '订单') {
        this.systmd = '全部'
        this.systmList = ['全部', 'Boss3订单系统', '分单系统']
      } else if (this.fristsys === '门票') {
        this.systmd = '全部'
        this.systmList = ['全部', '门票系统']
      } else if (this.fristsys === '供应链') {
        this.systmd = '全部'
        this.systmList = ['全部', '产品系统', '资源系统', '库存系统', '采购系统', '投诉质检', 'NB系统', '出团通知', 'BOH']
      } else {
        this.systmd = '全部'
        this.systmList = ['全部', '确认管理']
      }
    },
    qerymodule () {
      let params = { systemname: this.fristsys, detailsystem: this.systmd }
      this.pieData = []
      if (this.systmd === '全部') {
        this.xshow = this.fristsys
      } else {
        this.xshow = this.systmd
      }
      getty(params).then(res => {
        if (res.data) {
          this.handleDataone(res.data.data)
        }
      })
      gettyall(params).then(res => {
        if (res.data) {
          this.handleData(res.data.data)
        }
      })
      gettynew(params).then(res => {
        if (res.data) {
          this.handleDatatwo(res.data.data)
        }
      })
    },
    // 系统每周问题类型数量
    handleDataone (dataList) {
      dataList.forEach(data => {
        let dataArr = data.data
        this.week = dataArr.map(val => val.week)
      })
      this.isLoading = false
      let legend = dataList.map(val => val.typesname)
      let insteadl = legend
      this.lineOption = {
        title: {
          // text: this.show + '每周问题类型数量'
          text: '每周问题类型曲线'
        },
        label: {
          normal: {
            show: true,
            position: 'top'
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
            name: serie.typesname,
            type: 'line',
            stack: serie.typesname,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: serie.data.map(val => val.num)
          }
          // console.log('serie.name88888', serie.typesname)
          return obj
        })
      }
    },
    // 近一周技术支持总数
    handleData (dataList) {
      dataList.forEach(data => {
        let dataArr = data.data
        this.detailsystem = dataArr.map(val => val.detailsystem)
        this.num = dataArr.map(val => val.num)
      })
      this.isLoading = false

      // 定义图表
      this.lineOptiontwo1 = {
        title: {
          text: this.xshow + '近一周技术支持总量',
          x: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer:
          {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          data: this.detailsystem,
          axisLabel: {
            rotate: 60
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: dataList.map(serie => {
          let obj = {
            name: serie.name,
            type: 'bar',
            stack: serie.name,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            data: serie.data.map(val => val.num)
          }
          return obj
        })
      }

      // 定义图表
    },
    // 近一周系统问题类型占比
    handleDatatwo (dataList) {
      dataList.forEach(data => {
        let dataArr = data.data
        let dic = { value: dataArr[(dataArr.length) - 1].num, name: data.typesname }
        this.pieData.push(dic)
      })
      this.isLoading = false
      let legend = dataList.map(val => val.typesname)
      let insteadl = legend
      console.log('insteadl00000', insteadl)
      this.lineOptionthree2 = {
        title: {
          text: this.xshow + '近一周问题类型占比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          y: 'bottom',
          data: insteadl
        },
        series: [
          {
            name: '问题类型占比',
            type: 'pie',
            radius: '55%',
            data: this.pieData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    },
    chartResize (e) {
      if (e.type === 'transitionend' && e.target !== e.currentTarget) return
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.$refs.simpleChart1 && this.$refs.simpleChart2 && this.$refs.simpleChart3) {
          this.$refs.simpleChart1.resize()
          this.$refs.simpleChart2.resize()
          this.$refs.simpleChart3.resize()
        }
      }, 200)
    }
  }
}
</script>
