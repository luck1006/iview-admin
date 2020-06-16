<template>

  <div class="content-wrapper">
    <!-- <Split v-model="split3"> -->
    <div style="margin-bottom: 20px;">
      <Row :gutter="20">
        <i-col span="8">
          <Card shadow>
            <simple-chart text="自动化运行报告"
                          style="height: 200px;"
                          :option="cOption"
                          ref="simpleChart">
            </simple-chart>
          </Card>
        </i-col>
        <i-col span="16">
          <Card shadow>
            <i-table height="200"
                     :columns="columns1"
                     :data="tableData"></i-table>
          </Card>
        </i-col>
      </Row>
    </div>

    <Card shadow>
      <p class="pane__title">Test Execution Log</p>
      <suite :data="collapseData"></suite>
    </Card>
  </div>
</template>
<script>
import { getReportInfo } from '@/api/data'
import simpleChart from '_c/charts/simpleChart.vue'
import suite from './suite.vue'
import { on, off } from '@/libs/tools'
export default {
  components: {
    simpleChart,
    suite
  },
  data () {
    return {
      cOption: {},
      tableData: [],
      // counti: 0,
      columns1: [
        // {
        //   title: '序号',
        //   key: 'numb',
        //   width: 60
        // },
        {
          title: '用例名称',
          key: 'testcase',
          sortable: true,
          width: 150
        },
        {
          title: '接口地址',
          key: 'interface',
          sortable: true
        },
        {
          title: '时长(ms)',
          key: 'duration',
          sortable: true,
          width: 105
        }
        // {
        //   title: '状态',
        //   key: 'result',
        //   sortable: true,
        //   width: 60
        // }
      ],
      data1: [],
      collapseData: {},
      duration: 0,
      rundate: 0

    }
  },
  methods: {
    getReport (data) {
      data.successNum = 0
      data.failNum = 0
      data.value = ''
      if (data && data.child && data.child.length) {
        data.child.forEach(item => {
          if (item.type === 'test') {
            if (item.result === 'success') {
              item.successNum = 1
              item.failNum = 0
              item.value = ''
            } else {
              item.successNum = 0
              item.failNum = 1
              item.value = ''
            }
          } else if (item.type === 'suite') {
            this.getReport(item)
          }
        })
        data.child.forEach(item => {
          data.successNum += item.successNum
          data.failNum += item.failNum
          data.runtime += item.runtime
          if (item.type === 'test') {
            this.data1.push({ testcase: item.name, interface: item.rest, duration: item.runtime })
          }
        })
        this.tableData = this.getMaxSort(this.data1)
        // console.log(this.tableData)
        // console.log(data)
      }
      this.cOption = {
        title: {
          text: '自动化测试报告' + '(' + this.rundate + ')',
          subtext: this.duration,
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          // orient: 'vertical',
          // x: 'right',
          top: 'bottom',
          data: ['Passed', 'Failed']
        },
        graphic: [{ // 环形图中间添加文字

          type: 'text', // 通过不同top值可以设置上下显示
          left: 'center',
          top: 'center',
          style: {
            text: data.successNum + data.failNum,
            textAlign: 'center',
            // fill: 'red', // 文字的颜色
            width: 30,
            height: 30,
            fontSize: 20,
            fontWeight: 'bolder',
            fontFamily: 'Microsoft YaHei'
          }
        }
        ],
        color: ['rgb(25, 190, 107)', 'rgb(237, 63, 20)', '#aaa'],
        series: [
          {
            name: '成功/失败率',
            type: 'pie',
            // center: ['55%', '60%'],
            radius: ['30%', '60%'],
            avoidLabelOverlap: false,
            labelLine: {
              // show: false,
              normal: {
                length: 15,
                length2: 70,
                lineStyle: {
                  color: '#333'
                }
              }

            },
            label: {

              normal: {
                fontSize: 10,
                fontWeight: 'bold',
                // show: false,
                // \n\n可让文字居于牵引线上方，很关键
                //  {b}  代表显示的内容标题
                // {c}代表数据
                formatter: '{c}({d}%) \n',
                borderWidth: 20,
                borderRadius: 4,
                padding: [0, -70],
                rich: {
                  a: {
                    color: '#333',
                    fontSize: 8,
                    lineHeight: 10
                  },
                  b: {
                    fontSize: 8,
                    lineHeight: 10,
                    color: '#333'
                  }
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '12',
                  fontWeight: 'bold'
                }
              }
            },
            data: [
              { value: data.successNum, name: 'Passed' },
              { value: data.failNum, name: 'Failed' }
            ]
          }
        ]
      }
      return data
    },

    chartResize (e) {
      if (e.type === 'transitionend' && e.target !== e.currentTarget) return
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        if (this.$refs.simpleChart) {
          this.$refs.simpleChart.resize()
        }
      }, 200)
    },
    getMaxSort (arr) {
      var max
      for (var i = 0; i < arr.length; i++) {
        for (var j = i; j < arr.length; j++) {
          if (arr[i].duration < arr[j].duration) {
            max = arr[j]
            arr[j] = arr[i]
            arr[i] = max
          }
        }
      }
      return arr
    }

  },
  mounted () {
    getReportInfo({ 'id': this.$route.params.id }).then(res => {
      // console.log(res.data.data)
      if (res.data && res.data.data) {
        this.rundate = res.data.starttime.substring(0, 10)
        this.duration = res.data.starttime.substring(19, 11) + '-' + res.data.endtime.substring(19, 11)
        this.collapseData = this.getReport(res.data.data)
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

<style>
.content-wrapper {
  height: calc(100% - 5px);
  overflow: auto;
}
.widget {
  margin-bottom: 15px;
  position: relative;
}
.island {
  background: #fff;
  border: 1px solid #e5e5e5;
  padding: 15px 15px 0;
}
.widget__flex-line {
  display: flex;
}
.widgets-grid {
  /* position: absolute; */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* padding: 15px 15px 0; */
  max-height: 100%;
  overflow: auto;
  display: flex;
}
.widgets-grid__col {
  flex: 100%;
  width: 50%;
  min-width: 300px;
}
.widgets-grid__col1 {
  flex: 100%;
  width: 50%;
  min-width: 300px;
  padding-left: 15px;
}
.widgets-grid__col2 {
  flex: 100%;
  width: 100%;
  /* min-width: 500px; */
}
.app__content {
  position: relative;
  flex: 1;
  overflow: auto;
}
.node__title {
  overflow: hidden;
  line-height: 1.2em;
  padding: 7px 15px 7px 25px;
  flex: 1;
  display: flex;
  cursor: pointer;
  border-top: 1px solid #eceff1;
  position: relative;
}
/* .tree__strut {
  flex: 1;
} */
.long-line {
  word-break: break-word;
}
.node {
  margin-left: 0;
  position: relative;
  display: block;
  text-decoration: none;
  color: #000;
}

.label {
  vertical-align: baseline;
  letter-spacing: 1px;
  color: #fff;
  padding: 2px 4px 2px 5px;
  font-size: 80%;
  border-radius: 3px;
}
* {
  box-sizing: border-box;
}
/* body {
  color: #000;
  font-family: Helvetica, Arial, sans-serif;
} */
body,
html {
  height: 100%;
  font-size: 14px;
}
.status-toggle__items {
  display: block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  word-break: break-word;
}
.pane__title {
  /* padding: 0 15px 10px; */
  width: 100%;
  display: flex;
  position: relative;
  margin: 2px 0 0;
  /* border-bottom: 1px solid #eceff1; */
  font-size: 18px;
  font-weight: 350;
  font-family: "宋体";
  padding: 3px 0px 0px 0px;
  font-weight: "bolder";
}
</style>
