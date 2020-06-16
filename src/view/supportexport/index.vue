<template>
  <div>
    <Form :label-width="80"
            inline
            :model="selectItem2"
            ref="selectItem2"
            :rules="ruleValidate">
      <FormItem label="开始日期:"
                  prop="startDate">
          <DatePicker v-model="selectItem2.startDate"
                      type="date"
                      :value="selectItem2.startDate"
                      placement="bottom-end"
                      placeholder="Select start date"
                      :options="startTimeOption"
                      @on-change="onStartTimeChange"
                      style="width: 120px">
            </DatePicker>
      </FormItem>
      <FormItem label="结束日期:"
                  prop="endDate">
          <DatePicker v-model="selectItem2.endDate"
                      type="date"
                      :value="selectItem2.endDate"
                      placeholder="Select end date"
                      :options="endTimeOption"
                      @on-change="onEndTimeChange"
                      style="width: 120px">
          </DatePicker>
      </FormItem>
      <Button type="primary" shape="circle" icon="ios-search" @click="searchData()">查询</Button>
      <Button type="primary" shape="circle" @click="exportData()"><Icon type="ios-download-outline"></Icon> 导出</Button>
    </Form>
    <Table
      border
      :columns="columns1"
      :data="exportdata"
      ref="myTable">
    </Table>
    <Page
      :total="dataCount"
      :page-size="pageSize"
      show-total
      class="paging"
      @on-change="changepage"
      @on-page-size-change="changepagesize">
    </Page>
  </div>
</template>
<script>
import { exporttechnicalSupport } from '@/api/data'
import { on, off } from '@/libs/tools'
// import { createHash } from 'crypto'
export default {
  data () {
    return {
      dataCount: 0,
      pageSize: 10,
      columns1: [{
        title: '主题',
        key: 'SUMMARY',
        width: 300
      },
      {
        title: '创建人',
        key: 'CREATOR',
        width: 120
      },
      {
        title: '经办人',
        key: 'ASSIGNEE',
        width: 120
      },
      {
        title: '状态',
        key: 'pname',
        width: 140
      },
      {
        title: '归属系统',
        key: 'customvalue',
        width: 140
      },
      {
        title: '创建时间',
        key: 'CREATED'
      }],
      exportdata: [],
      ajaxExportdata: [],
      ruleValidate: {
        startDate: [{ required: true, message: '必填项', trigger: 'change', pattern: /.+/ }],
        endDate: [{ required: true, message: '必填项', trigger: 'change', pattern: /.+/ }]
      },
      selectItem2: {
        startDate: '',
        endDate: ''
      },
      startTimeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      endTimeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      }
    }
  },
  methods: {
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
    convertToDate (date) {
      var date1 = new Date(date)
      var y = date1.getFullYear()
      var m = date1.getMonth() + 1
      var d = date1.getDate()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      return y + '-' + m + '-' + d
    },
    onStartTimeChange (startDate, type) {
      this.endTimeOption = {
        disabledDate (endDate) {
          var curr_startDate = new Date(startDate)
          return endDate < new Date(curr_startDate.getTime() - 24 * 60 * 60 * 1000) || endDate > Date.now()
        }
      }
    },
    onEndTimeChange (endDate, type) {
      this.startTimeOption = {
        disabledDate (startDate) {
          return startDate > new Date(endDate)
        }
      }
    },
    searchData () {
      var s = this.convertToDate(this.selectItem2.startDate)
      var e = this.convertToDate(this.selectItem2.endDate)
      let params = { startdate: s, enddate: e }
      exporttechnicalSupport(params).then(res => {
        if (res.data.success === 'true') {
          this.ajaxExportdata = res.data.data
          this.dataCount = res.data.data.length
          if (this.dataCount < this.pageSize) {
            this.exportdata = this.ajaxExportdata
          } else {
            this.exportdata = this.ajaxExportdata.slice(0, this.pageSize)
          }
          this.$Message.success(res.data.msg)
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    changepage (index) {
      var _start = (index - 1) * this.pageSize
      var _end = index * this.pageSize
      this.exportdata = this.ajaxExportdata.slice(_start, _end)
    },
    changepagesize (pageSize) {
      this.pageSize = pageSize
      this.searchData()
    },
    exportData () {
      var s = this.convertToDate(this.selectItem2.startDate)
      var e = this.convertToDate(this.selectItem2.endDate)
      if (this.ajaxExportdata.length > 0) {
        this.$refs.myTable.exportCsv({
          filename: s + '至' + e + '新增技术支持数据',
          original: false,
          columns: this.columns1,
          data: this.ajaxExportdata.map(k => {
            k.SUMMARY = '"' + k.SUMMARY + '"'
            return k
          })
        })
      } else {
        this.$Message.error('先查询出数据哦~')
      }
    }
    // exportData() {
    //   var s = this.convertToDate(this.selectItem2.startDate)
    //   var e = this.convertToDate(this.selectItem2.endDate)
    //   let params = { startdate: s, enddate: e }
    //   exporttechnicalSupport(params).then(res => {
    //     if(res.data.success === 'true'){
    //       this.exportdata = res.data.data;
    //       this.$refs.myTable.exportCsv({
    //         filename: s + '至' + e + '新增技术支持数据',
    //         original: false,
    //         columns: this.columns1,
    //         data: this.exportdata.map(k => {
    //           k.SUMMARY = '\"' + k.SUMMARY + '\"';
    //           return k;
    //           })
    //         })
    //       this.$Message.success(res.data.msg)
    //     }else{
    //       this.$Message.error(res.data.msg)
    //     }
    //     })

    // }
  },
  mounted () {
    const myDate = new Date()
    const year = myDate.getFullYear()
    const month = myDate.getMonth() + 1
    const day = myDate.getDate()
    this.selectItem2.startDate = `${year}-${month}-${day}`
    this.selectItem2.endDate = `${year}-${month}-${day}`

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
