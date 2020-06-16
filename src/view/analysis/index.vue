<template>
  <div>
    <Tabs type="card">
      <TabPane label="epic部门投入">

        <Table :columns="team"
               :data="data1"
               border
               show-summary
               :summary-method="handleSummary"></Table>
        <br>
        <Card shadow>
          <simple-chart style="height: 310px;"
                        :option="lineOption"
                        ref="simpleChart"></simple-chart>
        </Card>
      </TabPane>

      <TabPane label="epic团队投入">

        <Table :columns="scrum"
               :data="data2"
               border
               show-summary
               :summary-method="handleSummary"></Table>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { queryByEpic, queryEpicbyMonth } from '@/api/data'
import simpleChart from '_c/charts/simpleChart.vue'
// import Loading from '@/components/loading'
export default {
  components: {
    simpleChart
  },
  data () {
    return {
      team: [], // 部门
      data1: [],
      scrum: [], // scrumteam
      data2: [],
      lineOption: {}, // epic按月投入
      epicInfo: [], // epic
      spendTime: [], // 工时
      uniqueArr: [],
      arr: []
    }
  },
  mounted () { // 获取epic信息
    queryByEpic().then(res => {
      if (res.data && res.data.data) {
        this.data1 = res.data.data.dict_by_oa
        this.data2 = res.data.data.dic_by_st
        let teams = res.data.data.dict_by_oa[0]
        let scrums = res.data.data.dic_by_st[0]
        for (var key in teams) {
          var column = {
            title: key.replace('Team', ''),
            key: key
          }
          if (key === 'epic') {
            var link1 = {
              render: (h, params) => {
                // console.log(params)
                var jiraNo = params.row.epic
                var jiraKey = jiraNo.substring(0, jiraNo.indexOf(' '))
                var jiraText = jiraNo.substring(jiraNo.indexOf(' '))
                return h('a',
                  {
                    domProps: {
                      target: '_blank',
                      href: 'https://jira.tuniu.org/browse/' + jiraKey,
                      innerText: jiraText
                    }
                  }
                )
              }
            }
            Object.assign(column, { width: 170 }, link1)
          }
          this.team.push(column)
        }
        for (var key1 in scrums) {
          var column1 = {
            title: key1,
            key: key1
          }
          if (key1 === 'epic') {
            var link2 = {
              render: (h, params) => {
                // console.log(params)
                var jiraNo = params.row.epic
                var jiraKey = jiraNo.substring(0, jiraNo.indexOf(' '))
                var jiraText = jiraNo.substring(jiraNo.indexOf(' '))
                return h('a',
                  {
                    domProps: {
                      target: '_blank',
                      href: 'https://jira.tuniu.org/browse/' + jiraKey,
                      innerText: jiraText
                    }
                  }
                )
              }
            }
            Object.assign(column1, { width: 170 }, link2)
          }
          this.scrum.push(column1)
        }
      }
    },
    queryEpicbyMonth().then(res => {
      if (res.data && res.data.data) {
        this.handleData(res.data.data)
      }
    })

    )
  },
  methods: {
    handleSummary ({ columns, data }) {
      const sums = {}
      columns.forEach((column, index) => {
        const key = column.key
        if (index === 0) {
          sums[key] = {
            key,
            value: '总工时(d)'
          }
          return
        }
        const values = data.map(item => Number(item[key]))
        if (!values.every(value => isNaN(value))) {
          const v = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[key] = {
            key,
            value: v
          }
        } else {
          sums[key] = {
            key,
            value: 'N/A'
          }
        }
      })

      return sums
    },
    handleData (dataList) {
      // console.log(dataList)
      this.month = dataList.map(val => val.month)
      // colorarrays = ['#2F9323', '#D9B63A', '#2E2AA4', '#9F2E61', '#4D670C', '#BF675F', '#1F814A', '#357F88', '#673509', '#310937', '#1B9637', '#F7393C']
      console.log(this.month)
      dataList.forEach(data => {
        for (var tmp in data) {
          if (tmp === 'null') {
            // tmp = '无epic'
          }
          if (tmp !== 'month') {
            this.epicInfo.push(tmp)
            // let value = data[tmp]
            // this.newNum = this.newNum.concat(newD)
          }
          // alert(data[tmp])//“键值'
        }

        // this.month = data.map(val => val.month)
        // console.log(this.month)
      }

      )
      this.uniqueArr = [...new Set(this.epicInfo)]
      // console.log(this.uniqueArr)
      this.uniqueArr.forEach(item => {
        let data = dataList.map(val => val[item] === undefined ? 0 : val[item])
        if (item === null) {
          item = '无'
        }
        this.arr.push({ name: item, data })
        // console.log(this.arr)
      })

      this.lineOption = {
        title: {
          text: 'epic月投入'
        },
        color: ['#2F9323', '#D9B63A', '#2E2AA4', '#9F2E61', '#4D670C', '#BF675F', '#1F814A', '#357F88', '#673509', '#310937', '#1B9637', '#F7393C'],
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
          data: this.uniqueArr,
          left: 'right'
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
          data: this.month
        },
        yAxis: {
          type: 'value'
        },

        series: this.arr.map(serie => {
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
            data: serie.data
          }
          // console.log(obj)
          return obj
        })
      }
    }

  }
}
</script>

<style lang="less">
.small-table .ivu-table-cell {
  padding: 0px;
}
.small-table td {
  height: 0px;
}
</style>
