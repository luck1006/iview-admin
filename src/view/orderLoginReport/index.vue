<template>
  <div>

    <div style="margin-bottom: 20px;">
      <Collapse hide-arrow=true>
        <Panel name="orderReport">
          下单数据报表分析
          <p slot="content"> <Input v-model="content"
                   type="textarea"
                   :autosize="{minRows:'3', maxRows: '8'}" />
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

    <div style="margin-bottom: 10px;">
      <Card shadow>
        <simple-chart style="height: 300px;"
                      text="下单成功趋势柱状图"
                      :option="barOption"
                      ref="simpleChart2">
        </simple-chart>
      </Card>
    </div>

    <div style="margin-bottom: 20px;">
      <Row :gutter="25">
        <i-col span="12">
          <Card shadow>
            <simple-chart style="height: 300px;"
                          text="度假下单终端分布"
                          :option="pieOption"
                          ref="simpleChart3"></simple-chart>

          </Card>
        </i-col>

        <i-col span="12">
          <Card shadow>
            <simple-chart style="height: 300px;"
                          text="零售下单终端分布"
                          :option="pieOption1"
                          ref="simpleChart4"></simple-chart>

          </Card>
        </i-col>

      </Row>
    </div>

    <div style="margin-bottom: 10px;">

      <Row>
        <Card shadow>
          <simple-chart style="height: 310px;"
                        :option="gridOption"
                        ref="simpleChart"></simple-chart>
        </Card>
      </Row>
    </div>

    <div style="margin-bottom: 10px;">

      <Row>
        <Card shadow>
          <simple-chart style="height: 310px;"
                        :option="lineOption0"
                        ref="simpleChart1"></simple-chart>
        </Card>
      </Row>
    </div>

    <div style="margin-bottom: 10px;">
      <Row>
        <Card shadow>
          <simple-chart style="height: 310px;"
                        :option="lineOption"
                        ref="simpleChart5"></simple-chart>
        </Card>
      </Row>
    </div>

    <div style="margin-bottom: 10px;">
      <Row>
        <Card shadow>
          <simple-chart style="height: 310px;"
                        :option="lineOption1"
                        ref="simpleChart6"></simple-chart>
        </Card>
      </Row>
    </div>
    <Collapse hide-arrow=true>
      <Panel name="orderReport">
        失败原因&下单成功子品类分布
        <div slot="content">
          <div style="margin-bottom: 10px;">

            <Collapse hide-arrow=true>
              <Panel name="orderReport">
                登录失败原因
                <div slot="content">

                  <div style="margin-bottom: 10px;">
                    <Table border
                           stripe
                           :columns="columns6"
                           :data="data6"></Table>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>

          <div style="margin-bottom: 10px;">
            <Collapse hide-arrow=true>
              <Panel name="orderReport">
                零售下单失败原因
                <div slot="content">
                  <Table border
                         stripe
                         :columns="columns7"
                         :data="data7"></Table>
                </div>
              </Panel>
            </Collapse>
          </div>

          <div style="margin-bottom: 10px;">
            <Collapse hide-arrow=true>
              <Panel name="orderReport">
                度假下单失败原因
                <div slot="content">
                  <Table border
                         stripe
                         :columns="columns8"
                         :data="data8"></Table>
                </div>
              </Panel>
            </Collapse>
          </div>

          <div style="margin-bottom: 10px;">
            <Collapse hide-arrow=true>
              <Panel name="orderReport">
                度假子品类下单成功 <div slot="content">
                  <Table border
                         stripe
                         :columns="columns9"
                         :data="data9"></Table>
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
      </Panel>
    </Collapse>

  </div>
</template>
<script>
import { ChartPie } from '_c/charts'
import { orderLoginReport, shotEmail, saveReportAnalysis, getReportAnalysis, getReceiver } from '@/api/data'
import simpleChart from '_c/charts/simpleChart.vue'
import { on, off } from '@/libs/tools'
// import Loading from '@/components/loading'
export default {
  components: {
    ChartPie,
    simpleChart
    // Loading
  },
  data () {
    return {
      // isLoading: true,
      columns1: [],
      data1: [],
      columns2: [],
      data2: [],
      columns3: [],
      data3: [],
      columns4: [],
      data4: [],
      columns5: [],
      data5: [],
      columns6: [
        {
          title: '失败状态',
          width: 250,
          key: 'failcode'
        },
        {
          title: '失败原因',
          key: 'failreason'
        },
        {
          title: '数量',
          key: 'failnum'
        }
      ],
      data6: [],
      columns7: [
        {
          title: '品类',
          width: 250,
          key: 'producttype'
        },
        {
          title: '下单失败原因',
          key: 'failreason'
        },
        {
          title: '数量',
          key: 'failnum'
        }
      ],
      data7: [],
      columns8: [
        {
          title: '品类',
          width: 250,
          key: 'producttype'
        },
        {
          title: '下单失败原因',
          key: 'failreason'
        },
        {
          title: '数量',
          key: 'failnum'
        }
      ],
      data8: [],
      columns9: [
        {
          title: '品类',
          // width: 250,
          key: 'producttype'
        },
        {
          title: '下单成功数量',
          key: 'successnum'
        }
      ],
      data9: [],
      gridData: {},
      // gridOption: {},
      // 初始化下单失败趋势图
      gridOption: {
        title: {
          text: '下单失败趋势图',
          textStyle: {
            fontSize: 15 // 字体大小
          }
        },
        color: ['#3CB371', '#00CED1', '#6A5ACD', '#00FA9A', '#40E0D0'],
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
          data: ['度假下单失败', '零售下单失败']
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
            data: ['28W', '29W', '30W', '31W', '32W', '33W']
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 0,
            max: 2000
          },
          {
            type: 'value',
            min: 0,
            max: 2000,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#40E0D0'
              }
            }
          }
        ],
        series: [

          {
            name: '度假下单失败',
            type: 'line',
            stack: '总量1',
            label: {
              normal: {
                show: true,
                position: 'top',
                color: '#40E0D0'
              }
            },
            areaStyle: {
              normal: {
                color: '#40E0D0'
              }
            },
            data: ['68', '89', '77', '45', '34', '56']
          },
          {
            name: '零售下单失败',
            type: 'line',
            stack: '总量2',
            label: {
              normal: {
                show: true,
                position: 'top',
                color: '#40E0D0'
              }
            },
            areaStyle: {
              normal: {
                // color: '#00FA9A'
              }
            },
            data: ['234', '456', '236', '667', '122', '345']
          }
        ]
      },
      gridOption1: {},
      // barOption: {}
      // 初始化下单成功柱状图
      barOption: {
        title: {
          text: '下单成功趋势',
          textStyle: {
            fontSize: 15 // 字体大小
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['度假', '零售']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        // grid: { y: 70, y2: 30, x2: 20 },
        xAxis: [
          {
            type: 'category',
            data: ['28W', '29W', '30W', '31W', '32W', '33W']
          },
          {
            type: 'category',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            data: ['28W', '29W', '30W', '31W', '32W', '33W']
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
            name: '度假',
            radius: '100%',
            type: 'bar',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 10, 10],
                color: 'rgba(32,178,170,1)',
                label: { show: true }
              }
            },
            data: [52333, 35555, 57567, 65645, 66456, 33535]
          },
          {
            name: '零售',
            radius: '100%',
            type: 'bar',
            xAxisIndex: 1,
            itemStyle: {
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                barBorderRadius: [10, 10, 10, 10],
                color: 'rgba(255,165,0,1)',
                label: {
                  show: true
                  // formatter: function (p) { return p.value > 0 ? (p.value + '\n') : '' }
                }
              }
            },
            data: [2033, 4144, 3555, 1354, 2756, 2675]
          }
        ]
      },
      // pieOption: {},
      // 初始化度假下单终端分布
      pieOption: {
        title: {
          text: '度假下单终端分布',
          textStyle: {
            fontSize: 15 // 字体大小
          },
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend1: {
          orient: 'vertical',
          left: 'bottom',
          y: 'bottom',
          data: ['pc', 'app', 'm站', '微信', '电话']
        },
        series: [
          {
            name: '终端',
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            data: [
              { value: 1556, name: 'pc' },
              { value: 18273, name: 'app' },
              { value: 3198, name: 'm站' },
              { value: 2037, name: '微信' },
              { value: 24067, name: '电话' }
            ],

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
      },
      // pieOption1: {},
      // 初始化零售下单终端分布
      pieOption1: {
        title: {
          text: '零售下单终端分布',
          textStyle: {
            fontSize: 15 // 字体大小
          },
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend1: {
          // orient: 'vertical',
          // left: 'bottom',
          y: 'bottom',
          data: ['pc', 'app', 'm站', '微信']
        },
        series: [
          {
            name: '终端',
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            data: [
              { value: 1556, name: 'pc' },
              { value: 18273, name: 'app' },
              { value: 3198, name: 'm站' },
              { value: 2037, name: '微信' },
              { value: 24067, name: '电话' }
            ],

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
      },
      // lineOption0: {},
      // 初始化下单失败率趋势
      lineOption0: {
        title: {
          text: '下单失败率趋势',
          textStyle: {
            fontSize: 15 // 字体大小
          }
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
          data: ['度假下单失败率', '零售下单失败率']
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
          data: ['28W', '29W', '30W', '31W', '32W', '33W']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '度假下单失败率',
            type: 'line',
            stack: '总量1',
            label: {
              normal: {
                show: true,
                position: 'top'
                // textStyle: {
                //   color: 'white'
                // }
              }
            },
            data: ['0.23', '0.23', '0.05', '0.56', '1.23', '2.34']
          },
          {
            name: '零售下单失败率',
            type: 'line',
            stack: '总量2',
            label: {
              normal: {
                show: true,
                position: 'top'
                // textStyle: {
                //   color: 'white'
                // }
              }
            },
            data: ['12.3', '5.6', '2.3', '3.4', '3.5', '2.3']
          }]
      },
      // lineOption: {},
      // 初始化会员登录成功趋势
      lineOption: {
        title: {
          text: '会员登录成功趋势',
          textStyle: {
            fontSize: 15 // 字体大小
          }
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
              backgroundColor: '#4169E1'
            }
          }
        },
        legend: {
          data: ['登录成功']
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
          data: ['28W', '29W', '30W', '31W', '32W', '33W']
        },
        yAxis: {
          type: 'value'
        },

        series: [
          {
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
            data: ['314312', '234534', '322223', '243333', '254444', '304434']
          }

        ] },
      // lineOption1: {},
      // 初始化会员登录失败趋势
      lineOption1: {
        title: {
          text: '会员登录失败趋势',
          textStyle: {
            fontSize: 15 // 字体大小
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            color: '#FF00FF'
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
          data: ['登录失败']
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
          data: ['28W', '29W', '30W', '31W', '32W', '33W']
        },
        yAxis: {
          type: 'value'
        },

        series: [
          {
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
            data: ['14312', '34534', '22223', '43333', '54444', '04434']
          }

        ]

      },
      dic: {},
      pieData: [],
      pieData1: [],
      content: '',
      receiverList: [],
      receiver_to: '',
      receiver_cc: ''
    }
  },
  methods: {
    handleData (dataList) {
      this.pieData.splice(0)
      this.pieData1.splice(0)

      // table1
      let thead = ['品类']
      dataList[0].data.forEach(item => {
        thead.push(item.week)
      })
      // 下单趋势图
      let gridData = dataList[0].data
      let xshow = gridData.map(val => val.week)
      let holidayordersuccess = gridData.map(val => val.holidayordersuccess)
      let mallordersuccess = gridData.map(val => val.mallordersuccess)
      let holidayorderfailure = gridData.map(val => val.holidayorderfailure)
      let mallorderfailure = gridData.map(val => val.mallorderfailure)
      let holidayfailurerate = gridData.map(val => val.holidayfailurerate)
      let mallfailurerate = gridData.map(val => val.mallfailurerate)
      // 下单成功柱状图
      this.barOption = {
        title: {
          text: '下单成功趋势',
          // subtext: '各系统自动化覆盖情况'
          textStyle: {
            fontSize: 15 // 字体大小
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['度假', '零售']
        },
        toolbox: {
          show: true
        },
        calculable: true,
        // grid: { y: 70, y2: 30, x2: 20 },
        xAxis: [
          {
            type: 'category',
            data: xshow
          },
          {
            type: 'category',
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { show: false },
            splitArea: { show: false },
            splitLine: { show: false },
            data: xshow
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
            name: '度假',
            radius: '100%',
            type: 'bar',
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 10, 10],
                color: 'rgba(32,178,170,1)',
                label: { show: true }
              }
            },
            data: holidayordersuccess
          },
          {
            name: '零售',
            radius: '100%',
            type: 'bar',
            xAxisIndex: 1,
            itemStyle: {
              emphasis: {
                barBorderRadius: 30
              },
              normal: {
                barBorderRadius: [10, 10, 10, 10],
                color: 'rgba(255,165,0,1)',
                label: {
                  show: true
                  // formatter: function (p) { return p.value > 0 ? (p.value + '\n') : '' }
                }
              }
            },
            data: mallordersuccess
          }
        ]
      }
      // 下单数据终端分布图--度假产品
      let dataArr = dataList[1].data
      let dic0 = { value: dataArr[0].holiday, name: dataArr[0].terminaltype }
      let dic1 = { value: dataArr[1].holiday, name: dataArr[1].terminaltype }
      let dic2 = { value: dataArr[2].holiday, name: dataArr[2].terminaltype }
      let dic3 = { value: dataArr[3].holiday, name: dataArr[3].terminaltype }
      let dic4 = { value: dataArr[4].holiday, name: dataArr[4].terminaltype }
      let dic5 = { value: dataArr[5].holiday, name: dataArr[5].terminaltype }

      this.pieData.push(dic0, dic1, dic2, dic3, dic4, dic5)
      // console.log(this.pieData)
      let legend1 = dataList[1].data.map(val => val.terminaltype)
      // console.log(legend1)

      let colors = ['#5793f3', '#675bba', '#675bba']
      this.pieOption = {
        title: {
          text: '度假下单终端分布',
          textStyle: {
            fontSize: 15 // 字体大小
          },
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend1: {
          // orient: 'vertical',
          // left: 'bottom',
          y: 'bottom',
          data: legend1
        },
        series: [
          {
            name: '终端',
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
      // 下单数据终端分布图--零售产品
      let dic00 = { value: dataArr[0].mall, name: dataArr[0].terminaltype }
      let dic10 = { value: dataArr[1].mall, name: dataArr[1].terminaltype }
      let dic20 = { value: dataArr[2].mall, name: dataArr[2].terminaltype }
      let dic30 = { value: dataArr[3].mall, name: dataArr[3].terminaltype }
      this.pieData1.push(dic00, dic10, dic20, dic30)
      // console.log(this.pieData)
      // let colors2 = ['#5793f3', '#675bba', '#675bba']
      this.pieOption1 = {
        title: {
          text: '零售下单终端分布',
          textStyle: {
            fontSize: 15 // 字体大小
          },
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend1: {
          // orient: 'vertical',
          // left: 'bottom',
          y: 'bottom',
          data: legend1
        },
        series: [
          {
            name: '终端',
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            data: this.pieData1,

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

      // 下单失败趋势图
      this.gridOption = {
        title: {
          text: '下单失败趋势图',
          textStyle: {
            fontSize: 15 // 字体大小
          }
        },
        color: ['#3CB371', '#00CED1', '#6A5ACD', '#00FA9A', '#40E0D0'],
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
          data: ['度假下单失败', '零售下单失败']
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
            max: 2000
          },
          {
            type: 'value',
            min: 0,
            max: 2000,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[4]
              }
            }
          }
        ],
        series: [

          {
            name: '度假下单失败',
            type: 'line',
            stack: '总量1',
            label: {
              normal: {
                show: true,
                position: 'top',
                color: colors[5]
              }
            },
            areaStyle: {
              normal: {
                color: colors[5]
              }
            },
            data: holidayorderfailure
          },
          {
            name: '零售下单失败',
            type: 'line',
            stack: '总量2',
            label: {
              normal: {
                show: true,
                position: 'top',
                color: colors[5]
              }
            },
            areaStyle: {
              normal: {
                // color: '#4608A6'
              }
            },
            data: mallorderfailure
          }
        ]
      }
      // 下单失败率趋势图
      this.lineOption0 = {
        title: {
          text: '下单失败率趋势',
          textStyle: {
            fontSize: 15 // 字体大小
          }
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
          data: ['度假下单失败率', '零售下单失败率']
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
          data: xshow
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '度假下单失败率',
            type: 'line',
            stack: '总量1',
            label: {
              normal: {
                show: true,
                position: 'top'
                // textStyle: {
                //   color: 'white'
                // }
              }
            },
            data: holidayfailurerate
          },
          {
            name: '零售下单失败率',
            type: 'line',
            stack: '总量2',
            label: {
              normal: {
                show: true,
                position: 'top'
                // textStyle: {
                //   color: 'white'
                // }
              }
            },
            data: mallfailurerate
          }]
      }
      // 会员登录成功失败趋势
      this.lineOption = {
        title: {
          text: '会员登录成功趋势',
          textStyle: {
            fontSize: 15 // 字体大小
          }
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
              backgroundColor: '#4169E1'
            }
          }
        },
        legend: {
          data: ['登录成功']
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
          data: xshow
        },
        yAxis: {
          type: 'value'
        },

        series: dataList.map(serie => {
          let obj = {
            // name: serie.data,
            type: 'line',
            stack: serie.data,
            label: {
              normal: {
                show: true,
                position: 'top'
                // textStyle: {
                //   color: 'white'
                // }
              }
            },
            data: serie.data.map(val => val.loginsuccess)
          }
          return obj
        })

      }
      // 会员登录失败趋势
      this.lineOption1 = {
        title: {
          text: '会员登录失败趋势',
          textStyle: {
            fontSize: 15 // 字体大小
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            color: '#FF00FF'
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
          data: ['登录失败']
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
          data: xshow
        },
        yAxis: {
          type: 'value'
        },

        series: dataList.map(serie => {
          let obj = {
            // name: serie.data,
            type: 'line',
            stack: serie.data,
            label: {
              normal: {
                show: true,
                position: 'top'
                // textStyle: {
                //   color: 'white'
                // }
              }
            },
            data: serie.data.map(val => val.loginfailure)
          }
          return obj
        })

      }
      // table2
      let thead2 = ['品类']
      dataList[1].data.forEach(item => {
        thead2.push(item.terminaltype)
      })
      // table5
      let thead5 = ['会员登录']
      dataList[0].data.forEach(item => {
        thead5.push(item.week)
      })
      // table6
      dataList[2].data.forEach(item => {
        this.data6.push({ failcode: item.failcode, failreason: item.failreason, failnum: item.failnum })
      })
      // table7
      dataList[3].data.forEach(item => {
        this.data7.push({ producttype: item.producttype, failreason: item.failreason, failnum: item.failnum })
      })
      // table8
      dataList[4].data.forEach(item => {
        this.data8.push({ producttype: item.producttype, failreason: item.failreason, failnum: item.failnum })
      })
      // table9
      dataList[5].data.forEach(item => {
        this.data9.push({ producttype: item.producttype, successnum: item.successnum })
      })
      // 下单成功数据报表（统计最近10周）
      thead.forEach(item => {
        this.columns1.push({
          title: item,
          key: item
        })
      })
      let holiday = {}
      let mallor = {}
      dataList[0].data.forEach(item => {
        holiday[item.week] = item.holidayordersuccess
        mallor[item.week] = item.mallordersuccess
        holiday.品类 = '度假'
        mallor.品类 = '零售'
      })
      this.data1.push(holiday)
      this.data1.push(mallor)

      // 下单终端数据报表（当周数据）
      thead2.forEach(item => {
        this.columns2.push({
          title: item,
          key: item
        })
      })
      let holiday2 = {}
      let mallor2 = {}
      dataList[1].data.forEach(item => {
        holiday2[item.terminaltype] = item.holiday
        mallor2[item.terminaltype] = item.mall
        holiday2.品类 = '度假'
        mallor2.品类 = '零售'
      })
      this.data2.push(holiday2)
      this.data2.push(mallor2)
      // 下单失败数据报表（统计最近10周）
      thead.forEach(item => {
        this.columns3.push({
          title: item,
          key: item
        })
      })
      let holiday3 = {}
      let mallor3 = {}
      dataList[0].data.forEach(item => {
        holiday3[item.week] = item.holidayorderfailure
        mallor3[item.week] = item.mallorderfailure
        holiday3.品类 = '度假'
        mallor3.品类 = '零售'
      })
      this.data3.push(holiday3)
      this.data3.push(mallor3)
      // 下单失败率数据报表（统计最近10周）
      thead.forEach(item => {
        this.columns4.push({
          title: item,
          key: item
        })
      })
      let holiday4 = {}
      let mallor4 = {}
      dataList[0].data.forEach(item => {
        holiday4[item.week] = item.holidayfailurerate
        mallor4[item.week] = item.mallfailurerate
        holiday4.品类 = '度假'
        mallor4.品类 = '零售'
      })
      this.data4.push(holiday4)
      this.data4.push(mallor4)
      // 会员登录数据报表（统计最近10周）
      thead5.forEach(item => {
        this.columns5.push({
          title: item,
          key: item
        })
      })
      let loginsuccess = {}
      let loginfail = {}
      dataList[0].data.forEach(item => {
        loginsuccess[item.week] = item.loginsuccess
        loginfail[item.week] = item.loginfailure
        loginsuccess.会员登录 = '登录成功'
        loginfail.会员登录 = '登录失败'
      })
      this.data5.push(loginsuccess)
      this.data5.push(loginfail)

      // this.isLoading = false
    },
    chartResize (e) {
      if (e.type === 'transitionend' && e.target !== e.currentTarget) return
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.$refs.simpleChart && this.$refs.simpleChart1 && this.$refs.simpleChart2) {
          this.$refs.simpleChart.resize()
          this.$refs.simpleChart1.resize()
          this.$refs.simpleChart2.resize()
        }
      }, 200)
    },
    sendInfo (msg) {
      // 将邮件接受者的列表转化成字符串格式
      // console.log('receiver_to==', this.receiver_to.join(','))

      let params = {
        url: window.location.href,
        subject: '下单和登录数据报表分析',
        // to: 'g-int-rd@tuniu.com',
        // cc: 'kongqiushi@tuniu.com,tanghaitao@tuniu.com',
        // to: 'huangfang@tuniu.com',
        // cc: 'huangfang@tuniu.com',

        to: this.receiver_to.join(','),
        cc: this.receiver_cc.join(','),
        type: 'orderReport', // 截图类型,
        row: '.content-wrapper', // selector 选择器,
        panel: '.ivu-card', // selector 选择器
        content: this.content
      }
      shotEmail(JSON.stringify(params)).then((response) => {
        let res = response.data
        // console.log(response.data)

        if (res.success === 'true') {
          // alert('保存数据成功～～')
          this.$Message.success(res.msg)
        } else {
          this.$Message.failed(res.msg)
        }
      })
    },
    saveInfo () {
      saveReportAnalysis({ content: this.content, receiver_to: this.receiver_to, receiver_cc: this.receiver_cc }).then(res => {
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
    orderLoginReport().then(res => {
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
    getReportAnalysis().then(res => {
      this.content = res.data.data[0].content
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
