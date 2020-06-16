<template>
  <div style="margin-bottom: 20px;">
     <!-- <Row >
    <Col  class="demo-tabs-style1" style="padding:16px;">
            <Tabs type="card">
                <li  label="国内资源预定" @click="toggleTabs(0)" :class="{active:active==this.num}" >国内资源预定</li>
                <li  label="境外资源预定" @click="toggleTabs(1)" :class="{active:active==this.num}">{{index}}境外资源预定</li>
    </Tabs>
    </Col>
    </Row> -->

<!-- <ul class="tabs">
                <li class="li-tab" label="国内资源预定" @click="toggleTabs(0)" :class="{active:num==0}" >国内资源预定</li>
                <li class="li-tab" label="境外资源预定" @click="toggleTabs(1)" :class="{active:num==1}">境外资源预定</li>
</ul> -->

    <!-- <ul class="tabs" >
      <li @click="num=0" :class="{active:num==0}" > 国内资源预定 </li>
      <li @click="num=1" :class="{active:num==1}" > 境外资源预定 </li>
    </ul>  -->
<!-- <Tabs class="Tabs">
      <el-tab-pane class="Tab-pane" v-for="(item,index) in tabsParam"
            @click="toggleTabs(index)"
            v-bind:key ="item"
            :class="{active:index===nowIndex}">{{item}}
      </el-tab-pane>
</Tabs> -->
<!-- <Tabs type="card">
      <Tab-pane
                :label="tabsParam[index]"
                :key ="index"
                v-for="(item,index) in tabsParam"
                @click="toggleTabs(index)"
                :class="{active:index===nowIndex}">{{item}}>
       </Tab-pane>
</Tabs> -->
  <!-- <div class="tab-box">
    <div v-for="(l,index) in tabsParam" :key="index+l" @click="num=index" :class="{active:num==index}">{{l}} </div>
    </div> -->
    <div>
      <P name="PackageRate">

        <Row type="flex"
             justify="end"
             class="code-row-bg">
          <i-col span="4"
                 style="width: 14%">
            <Select v-model="receiver_to"
                    multiple
                    placeholder="email to"
                    clearable>
              <Option v-for="item in receiverList"
                      :value="item.receiver_name"
                      :key="item.receiver_name">{{ item.receiver_name }}</Option>
            </Select>
          </i-col>
          <i-col span="4"
                 style="width: 14%">
            <Select v-model="receiver_cc"
                    multiple
                    placeholder="email cc"
                    clearable>
              <Option v-for="item in receiverList"
                      :value="item.receiver_name"
                      :key="item.receiver_name">{{ item.receiver_name }}</Option>
            </Select>
          </i-col>
          <i-col style="width: 4%">
            <Button style="float:right"
                    type="primary"
                    @click="sendInfo()">send</Button>
          </i-col>
        </Row>
      </p>
    </div>
    <div style="margin-bottom: 20px;">
      <Card shadow v-show="num===0">
        <simple-chart style="height: 320px;"
                      text="技术支持统计"
                      :option="lineOption"
                      ref="FlightRate"></simple-chart>

      </Card>
      <Card shadow v-show="num===0">
        <simple-chart style="height: 320px;"
                      text="技术支持统计"
                      :option="lineOption1"
                      ref="FlightResource"></simple-chart>

      </Card>
      <Card shadow v-show="num===0">
        <simple-chart style="height: 320px;"
                      text="技术支持统计"
                      :option="lineOption2"
                      ref="HotelRate"></simple-chart>

      </Card>
      <Card shadow v-show="num===0">
        <simple-chart style="height: 320px;"
                      text="技术支持统计"
                      :option="lineOption3"
                      ref="HotelResource"></simple-chart>

      </Card>
      <Card shadow v-show="num===0">
        <simple-chart style="height: 320px;"
                      text="技术支持统计"
                      :option="lineOption4"
                      ref="TickectRate"></simple-chart>

      </Card>
      <Card shadow v-show="num===0">
        <simple-chart style="height: 320px;"
                      text="技术支持统计"
                      :option="lineOption5"
                      ref="TicketResource"></simple-chart>

      </Card>
      <Card shadow v-show="num===0">
        <simple-chart style="height: 320px;"
                      text="技术支持统计"
                      :option="lineOption6"
                      ref="BookRate"></simple-chart>

      </Card>
      <Card shadow v-show="num===0">
        <simple-chart style="height: 320px;"
                      text="技术支持统计"
                      :option="lineOption7"
                      ref="BookResource"></simple-chart>

      </Card>
    </div>
  </div>
</template>
<script>
import { ChartPie } from '_c/charts'
import { GetFlightDataByMonth, GetHotelDataByMonth, GetTicketDataByMonth, GetBookDataByMonth, shotEmail, getReceiver } from '@/api/data'
// import { on, off } from '@/libs/tools'
import simpleChart from '_c/charts/simpleChart.vue'
import Loading from '@/components/loading'
// import { createHash } from 'crypto'
export default {
  name: 'newCreate',
  components: {
    ChartPie,
    simpleChart,
    Loading
  },
  data () {
    return {
      receiverList: [],
      receiver_to: '',
      receiver_cc: '',
      isLoading: true,
      lineOption: {},
      lineOption1: {},
      lineOption2: {},
      lineOption3: {},
      lineOption4: {},
      lineOption5: {},
      lineOption6: {},
      lineOption7: {},
      num: 0,
      isshow: false
      // tabsParam:['国内资源','境外资源'],
      //           nowIndex:0,
      //           isShow:false,
    }
  },
  methods: {
    toggleTabs (index) {
      this.num = index
      console.log('this is some test code for my debug' + this.num)
      $(window).resize()
    },
    sendInfo (msg) {
      let params = {
        url: window.location.href,
        subject: '打包订资源预定趋势图',
        to: this.receiver_to.join(','),
        cc: this.receiver_cc.join(','),
        type: 'PackageRate', // 截图类型,
        row: '.content-wrapper', // selector 选择器,
        panel: '.ivu-card', // selector 选择器
        content: '最近30天打包订资源预定趋势详情如下:'

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
    handlelineoption (datalist) {
      var XName = datalist[3]
      var data1 = datalist

      var Line = ['机票默认推荐失败率', '机票系统打包产品默认推荐失败率', '机票验价失败率']
      var color = ['#3b6291', '#943c39', '#779043', '#624c7c']

      // 数据处理
      var datas = []
      Line.map((item, index) => {
        datas.push({
          symbolSize: 3,
          // symbol: 'md-radio',
          name: item,
          type: 'line',
          yAxisIndex: 1,
          data: data1[index],
          itemStyle: {
            normal: {
              borderWidth: 5,
              color: color[index]
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (val) {
                return val.data + '%'
              }
            } }
        })
      })

      this.lineOption = {
        title: {
          text: '机票资源失败率趋势图',
          x: 'left',
          textStyle: {
            fontSize: 18
            // fontStyle: 'normal',
            // fontWeight: 'normal',
          }
        },
        backgroundColor: '#FFFFFF',
        grid: {
          left: '10%',
          top: '30%',
          bottom: '10%',
          right: '10%'
        },
        legend: {
          top: '12%',
          type: 'scroll',
          data: Line,
          itemWidth: 50,
          itemHeight: 15,
          textStyle: {
            //   上部线段颜色标志
            color: '#000000',
            fontSize: 15
          }
        },
        yAxis: [{
          type: 'value',
          position: 'right',
          splitLine: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          }
        },
        {
          type: 'value',
          position: 'left',
          nameTextStyle: {
            color: '#0000000'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(135,140,147,0.8)'
            }
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            formatter: '{value}',
            color: '#000000',
            fontSize: 14
          }
        }
        ],
        xAxis: [{
          type: 'category',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000000'
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#000000', // x轴颜色
              fontWeight: 'normal',
              fontSize: '13',
              lineHeight: 5
            }

          },
          data: XName
        },
        {
          type: 'category',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: true
          },
          // -----
          data: []
        }
        ],
        series: datas
      }
    },
    handlelineoption1 (datalist) {
      var XName = datalist.ratedata[3]
      var data1 = datalist.numberdata

      var Line = ['机票默认推荐次数          ', '机票默认推荐失败次数', '机票系统打包产品默认推荐次数', '机票系统打包产品默认推荐失败次数', '机票验价次数', '机票验价失败次数', '机票购物车验价次数', '机票购物车验价失败次数', '机票预定页验价次数    ', '机票预定页验价失败次数']
      var color = ['#3b6291', '#943c39', '#779043', '#624c7c', '#388498', '#bf7334', '#3f6899', '#9c403d', '#7d9847', '#675083']

      // 数据处理
      var datas = []
      Line.map((item, index) => {
        datas.push({
          symbolSize: 1,
          // symbol: 'md-radio',
          name: item,
          type: 'line',
          yAxisIndex: 1,
          data: data1[index],
          itemStyle: {
            normal: {
              borderWidth: 5,
              color: color[index]
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top'
            } }
        })
      })

      this.lineOption1 = {
        title: {
          text: '机票资源预定数量趋势图',
          x: 'left',
          textStyle: {
            fontSize: 18
            // fontStyle: 'normal',
            // fontWeight: 'normal',
          }
        },
        backgroundColor: '#FFFFFF',
        grid: {
          left: '10%',
          top: '35%',
          bottom: '10%',
          right: '10%'
        },
        legend: {
          top: '12%',
          type: 'plain',
          data: Line,
          itemWidth: 50,
          itemHeight: 15,
          textStyle: {
            color: '#000000',
            fontSize: 15
          }
        },
        yAxis: [{
          type: 'value',
          position: 'right',
          splitLine: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          }
        },
        {
          type: 'value',
          position: 'left',
          nameTextStyle: {
            color: '#000000'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(135,140,147,0.8)'
            }
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {

            color: '#000000',
            fontSize: 14

          }
        }
        ],
        xAxis: [{
          type: 'category',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#6A989E'
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#000000', // x轴颜色
              fontWeight: 'normal',
              fontSize: '13',
              lineHeight: 5
            }

          },
          data: XName
        },
        {
          type: 'category',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: true
          },
          // -----
          data: []
        }
        ],
        series: datas
      }
    },
    handlelineoption2 (datalist) {
      var XName = datalist[3]
      var data1 = datalist

      var Line = ['酒店默认推荐失败率', '酒店系统打包产品默认推荐失败率', '酒店验价失败率']
      var color = ['#3b6291', '#943c39', '#779043', '#624c7c']

      // 数据处理
      var datas = []
      Line.map((item, index) => {
        datas.push({
          symbolSize: 3,
          // symbol: 'md-radio',
          name: item,
          type: 'line',
          yAxisIndex: 1,
          data: data1[index],
          itemStyle: {
            normal: {
              borderWidth: 5,
              color: color[index]
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (val) {
                return val.data + '%'
              }
            } }
        })
      })

      this.lineOption2 = {
        title: {
          text: '酒店资源失败率趋势图',
          x: 'left',
          textStyle: {
            fontSize: 18
            // fontStyle: 'normal',
            // fontWeight: 'normal',
          }
        },
        backgroundColor: '#ffffff',
        grid: {
          left: '10%',
          top: '25%',
          bottom: '10%',
          right: '10%'
        },
        legend: {
          top: '12%',
          type: 'plain',
          data: Line,
          itemWidth: 50,
          itemHeight: 15,
          textStyle: {
            color: '#000000',
            fontSize: 15
          }
        },
        yAxis: [{
          type: 'value',
          position: 'right',
          splitLine: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          }
        },
        {
          type: 'value',
          position: 'left',
          nameTextStyle: {
            color: '#000000'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(135,140,147,0.8)'
            }
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {

            color: '#000000',
            fontSize: 14
          }
        }
        ],
        xAxis: [{
          type: 'category',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000000'
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#000000', // x轴颜色
              fontWeight: 'normal',
              fontSize: '13',
              lineHeight: 5
            }

          },
          data: XName
        },
        {
          type: 'category',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: true
          },
          // -----
          data: []
        }
        ],
        series: datas
      }
    },
    handlelineoption3 (datalist) {
      var XName = datalist.ratedata[3]
      var data1 = datalist.numberdata

      var Line = ['酒店默认推荐次数         ', '酒店默认推荐失败次数   ', '酒店系统打包产品默认推荐次数', '酒店系统打包产品默认推荐失败次数', '酒店验价次数', '酒店验价失败次数', '酒店购物车验价次数', '酒店购物车验价失败次数', '酒店预定页验价次数     ', '酒店预定页验价失败次数']
      var color = ['#3b6291', '#943c39', '#779043', '#624c7c', '#388498', '#bf7334', '#3f6899', '#9c403d', '#7d9847', '#675083']

      // 数据处理
      var datas = []
      Line.map((item, index) => {
        datas.push({
          symbolSize: 1,
          // symbol: 'md-radio',
          name: item,
          type: 'line',
          yAxisIndex: 1,
          data: data1[index],
          itemStyle: {
            normal: {
              borderWidth: 5,
              color: color[index]
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top'
            } }
        })
      })

      this.lineOption3 = {
        title: {
          text: '酒店资源预定数目趋势图',
          x: 'left',
          textStyle: {
            fontSize: 18
            // fontStyle: 'normal',
            // fontWeight: 'normal',
          }
        },
        backgroundColor: '#ffffff',
        grid: {
          left: '10%',
          top: '35%',
          bottom: '10%',
          right: '10%'
        },
        legend: {
          // orient: 'horizontal', // 'vertical' 'horizontal'
          // x: 'center', // 'center' | 'left' | {number},
          // y: 'center', // 'center' | 'bottom' |  top| {number}
          // align:'top',
          top: '12%',
          type: 'plain',
          // itemGap: 15,
          data: Line,
          itemWidth: 50,
          itemHeight: 15,
          textStyle: {
            color: '#000000',
            fontSize: 15
          }
        },
        yAxis: [{
          type: 'value',
          position: 'right',
          splitLine: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          }
        },
        {
          type: 'value',
          position: 'left',
          nameTextStyle: {
            color: '#000000'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(135,140,147,0.8)'
            }
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            formatter: '{value}',
            color: '#000000',
            fontSize: 14
          }
        }
        ],
        xAxis: [{
          type: 'category',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000000'
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#000000', // x轴颜色
              fontWeight: 'normal',
              fontSize: '13',
              lineHeight: 5
            }

          },
          data: XName
        },
        {
          type: 'category',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: true
          },
          // -----
          data: []
        }
        ],
        series: datas
      }
    },
    handlelineoption4 (datalist) {
      var XName = datalist[2]
      var data1 = datalist

      var Line = ['门票默认推荐失败率', '门票验价失败率']
      var color = ['#3b6291', '#943c39']

      // 数据处理
      var datas = []
      Line.map((item, index) => {
        datas.push({
          symbolSize: 3,
          // symbol: 'md-radio',
          name: item,
          type: 'line',
          yAxisIndex: 1,
          data: data1[index],
          itemStyle: {
            normal: {
              borderWidth: 5,
              color: color[index]
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (val) {
                return val.data + '%'
              }
            } }
        })
      })

      this.lineOption4 = {
        title: {
          text: '门票资源失败率趋势图',
          x: 'left',
          textStyle: {
            fontSize: 18
            // fontStyle: 'normal',
            // fontWeight: 'normal',
          }
        },
        backgroundColor: '#ffffff',
        grid: {
          left: '10%',
          top: '25%',
          bottom: '10%',
          right: '10%'
        },
        legend: {
          top: '12%',
          type: 'scroll',
          data: Line,
          itemWidth: 50,
          itemHeight: 15,
          textStyle: {
            color: '#000000',
            fontSize: 15
          }
        },
        yAxis: [{
          type: 'value',
          position: 'right',
          formatter: '{value} %',
          splitLine: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          }
        },
        {
          type: 'value',
          position: 'left',
          nameTextStyle: {
            color: '#000000'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(135,140,147,0.8)'
            }
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {

            color: '#000000',
            fontSize: 14
          }
        }
        ],
        xAxis: [{
          type: 'category',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000000'
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#000000', // x轴颜色
              fontWeight: 'normal',
              fontSize: '13',
              lineHeight: 5
            }

          },
          data: XName
        },
        {
          type: 'category',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: false
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: true
          },
          // -----
          data: []
        }
        ],
        series: datas
      }
    },
    handlelineoption5 (datalist) {
      var XName = datalist.ratedata[2]
      var data1 = datalist.numberdata

      var Line = ['门票默认推荐次数', '门票默认推荐失败次数', '门票验价次数', '门票验价失败次数', '门票购物车验价次数', '门票购物车验价失败次数', '门票预定页验价次数', '门票预定页验价失败次数']
      var color = ['#3b6291', '#943c39', '#779043', '#624c7c', '#388498', '#bf7334', '#3f6899', '#9c403d']

      // 数据处理
      var datas = []
      Line.map((item, index) => {
        datas.push({
          symbolSize: 1,
          // symbol: 'md-radio',
          name: item,
          type: 'line',
          yAxisIndex: 1,
          data: data1[index],
          itemStyle: {
            normal: {
              borderWidth: 5,
              color: color[index]
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top'
            } }
        })
      })

      this.lineOption5 = {
        title: {
          text: '门票资源预定数目趋势图',
          x: 'left',
          textStyle: {
            fontSize: 18
            // fontStyle: 'normal',
            // fontWeight: 'normal',
          }
        },
        backgroundColor: '#ffffff',
        grid: {
          left: '10%',
          top: '35%',
          bottom: '10%',
          right: '10%'
        },
        legend: {
          top: '12%',
          type: 'plain',
          data: Line,
          itemWidth: 50,
          itemHeight: 15,
          textStyle: {
            color: '#000000',
            fontSize: 15
          }
        },
        yAxis: [{
          type: 'value',
          position: 'right',
          splitLine: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          }
        },
        {
          type: 'value',
          position: 'left',
          nameTextStyle: {
            color: '#000000'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(135,140,147,0.8)'
            }
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            formatter: '{value}',
            color: '#000000',
            fontSize: 14
          }
        }
        ],
        xAxis: [{
          type: 'category',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000000'
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#000000', // x轴颜色
              fontWeight: 'normal',
              fontSize: '13',
              lineHeight: 5
            }

          },
          data: XName
        },
        {
          type: 'category',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: true
          },
          // -----
          data: []
        }
        ],
        series: datas
      }
    },
    handlelineoption6 (datalist) {
      var XName = datalist[1]
      var data1 = datalist

      var Line = ['打包接口调用失败百分率']
      var color = ['#3b6291', '#943c39']

      // 数据处理
      var datas = []
      Line.map((item, index) => {
        datas.push({
          symbolSize: 3,
          // symbol: 'md-radio',
          name: item,
          type: 'line',
          yAxisIndex: 1,
          data: data1[index],
          itemStyle: {
            normal: {
              borderWidth: 5,
              color: color[index]
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: function (val) {
                return val.data + '%'
              }

            } }

        })
      })

      this.lineOption6 = {
        title: {
          text: '打包接口失败率趋势图',
          x: 'left',
          textStyle: {
            fontSize: 18
            // fontStyle: 'normal',
            // fontWeight: 'normal',
          }
        },
        backgroundColor: '#ffffff',
        grid: {
          left: '10%',
          top: '25%',
          bottom: '10%',
          right: '10%'
        },
        legend: {
          top: '12%',
          type: 'scroll',
          data: Line,
          itemWidth: 50,
          itemHeight: 15,
          textStyle: {
            color: '#000000',
            fontSize: 15
          }
        },
        yAxis: [{
          type: 'value',
          show: true,
          position: 'right',
          splitLine: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true,
            interval: 'auto',
            formatter: '{value} %'

          }
        },
        {
          type: 'value',
          position: 'left',
          nameTextStyle: {
            color: '#000000'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(135,140,147,0.8)'
            }
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {

            color: '#000000',
            fontSize: 14
          }
        }
        ],
        xAxis: [{
          type: 'category',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#6A989E'
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#000000', // x轴颜色
              fontWeight: 'normal',
              fontSize: '15',
              lineHeight: 5
            }

          },
          data: XName
        },
        {
          type: 'category',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: true
          },
          // -----
          data: []
        }
        ],
        series: datas
      }
    },
    handlelineoption7 (datalist) {
      var XName = datalist.ratedata[1]
      var data1 = datalist.numberdata

      var Line = ['打包接口调用次数', '进入预定页次数', '机酒打包下单次数', '机酒打包签约数', '酒景打包下单次数', '酒景打包签约数']
      var color = ['#3b6291', '#943c39', '#779043', '#624c7c', '#388498', '#bf7334', '#3f6899', '#9c403d']

      // 数据处理
      var datas = []
      Line.map((item, index) => {
        datas.push({
          symbolSize: 1,
          // symbol: 'md-radio',
          name: item,
          type: 'line',
          yAxisIndex: 1,
          data: data1[index],
          itemStyle: {
            normal: {
              borderWidth: 5,
              color: color[index]
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        })
      })

      this.lineOption7 = {
        title: {
          text: '下单数量趋势图',
          x: 'left',
          textStyle: {
            fontSize: 18
            // fontStyle: 'normal',
            // fontWeight: 'normal',
          }
        },
        backgroundColor: '#ffffff',
        grid: {
          left: '10%',
          top: '25%',
          bottom: '10%',
          right: '10%'
        },
        legend: {
          top: '12%',
          type: 'scroll',
          data: Line,
          itemWidth: 50,
          itemHeight: 15,
          textStyle: {
            color: '#000000',
            fontSize: 15
          }
        },
        yAxis: [{
          type: 'value',
          position: 'right',
          splitLine: {
            show: true
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          }
        },
        {
          type: 'value',
          position: 'left',
          nameTextStyle: {
            color: '#000000'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: 'rgba(135,140,147,0.8)'
            }
          },
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {

            color: '#000000',
            fontSize: 14
          }
        }
        ],
        xAxis: [{
          type: 'category',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#000000'
            }
          },
          axisLabel: {
            inside: false,
            textStyle: {
              color: '#000000', // x轴颜色
              fontWeight: 'normal',
              fontSize: '13',
              lineHeight: 5
            }

          },
          data: XName
        },
        {
          type: 'category',
          axisLine: {
            show: true
          },
          axisTick: {
            show: true
          },
          axisLabel: {
            show: true
          },
          splitArea: {
            show: true
          },
          splitLine: {
            show: true
          }
          // -----

        }
        ],
        series: datas
      }
    },
    chartResize (e) {
      if (e.type === 'transitionend' && e.target !== e.currentTarget) return
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.$refs.FlightRate) {
          this.$refs.FlightRate.resize()
        }
      }, 200)
      this.timer = setTimeout(() => {
        if (this.$refs.FlightResource) {
          this.$refs.FlightResource.resize()
        }
      }, 200)
      this.timer = setTimeout(() => {
        if (this.$refs.HotelRate) {
          this.$refs.HotelRate.resize()
        }
      }, 200)
      this.timer = setTimeout(() => {
        if (this.$refs.HotelResource) {
          this.$refs.HotelResource.resize()
        }
      }, 200)
      this.timer = setTimeout(() => {
        if (this.$refs.TicketRate) {
          this.$refs.TicketRate.resize()
        }
      }, 200)
      this.timer = setTimeout(() => {
        if (this.$refs.TicketResource) {
          this.$refs.TicketResource.resize()
        }
      }, 200)
      this.timer = setTimeout(() => {
        if (this.$refs.BookRate) {
          this.$refs.BookRate.resize()
        }
      }, 200)
      this.timer = setTimeout(() => {
        if (this.$refs.BookResource) {
          this.$refs.BookResource.resize()
        }
      }, 200)
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
    GetFlightDataByMonth().then(res => {
      if (res.data && res.data.ratedata && res.data.ratedata.length > 0) {
        // console.log(res.data.ratedata)
        this.handlelineoption(res.data.ratedata)
        this.handlelineoption1(res.data)
      }
    })
    GetHotelDataByMonth().then(res => {
      if (res.data && res.data.ratedata && res.data.ratedata.length > 0) {
        // console.log(res.data)
        this.handlelineoption2(res.data.ratedata)
        this.handlelineoption3(res.data)
      }
    })
    GetTicketDataByMonth().then(res => {
      if (res.data && res.data.ratedata && res.data.ratedata.length > 0) {
        console.log(res.data)
        this.handlelineoption4(res.data.ratedata)
        this.handlelineoption5(res.data)
      }
    })
    GetBookDataByMonth().then(res => {
      if (res.data && res.data.ratedata && res.data.ratedata.length > 0) {
        console.log(res.data)
        this.handlelineoption6(res.data.ratedata)
        this.handlelineoption7(res.data)
      }
    })
  }
}
</script>
<style>
.labelstyle {
  color: "red";
  /*font-size:  "16px"; */
  margin-left: 20px;
}
</style>
