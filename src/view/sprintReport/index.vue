<template>
  <Tabs type="card">
    <TabPane label="日报">
      <!--<p style="color:red;font-size:14px;text-align: left"> 请注意：【组织架构】与【迭代组】同时只能选择其一</p>-->
      <Form :label-width="60"
            inline
            :model="selectItem2"
            ref="selectItem2"
            :rules="ruleValidate">
        <FormItem label="开始:"
                  prop="startDate">
          <DatePicker v-model="selectItem2.startDate"
                      type="date"
                      :value="selectItem2.startDate"
                      placement="bottom-end"
                      placeholder="Select start date"
                      :options="startTimeOption"
                      @on-change="onStartTimeChange"
                      style="width: 120px"></DatePicker>
        </FormItem>
        <FormItem label="结束:"
                  prop="endDate">
          <DatePicker v-model="selectItem2.endDate"
                      type="date"
                      :value="selectItem2.endDate"
                      placeholder="Select end date"
                      :options="endTimeOption"
                      @on-change="onEndTimeChange"
                      style="width: 120px"></DatePicker>
        </FormItem>
        <FormItem label="部门:">
          <Select v-model="selectItem2.deptdesc"
                  @on-change="initSelect()"
                  filterable
                  clearable
                  multiple
                  style="width:140px"
                  v-bind:disabled="diasabledSelect1">
            <Option v-for="item in deptDescs"
                    :value="item.value"
                    :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="分组:">
          <Select v-model="selectItem2.sprintTeam2"
                  filterable
                  clearable
                  multiple
                  style="width:120px"
                  v-bind:disabled="diasabledSelect2"
                  @on-change="initSelect()">
            <Option v-for="item in sprintTeams2"
                    :value="item.value"
                    :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="人员:">
          <Select v-model="selectItem2.workerName"
                  filterable
                  clearable
                  multiple
                  style="width:120px"
                  v-bind:disabled="diasabledSelect3"
                  @on-change="initSelect()">
            <Option v-for="item in workers"
                    :value="item.value"
                    :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="getDaysReport()">搜索</Button>
        </FormItem>
        <!--<FormItem>
        <Button type="primary"
            size="large"
            @click="exportData()">
          <Icon type="ios-download-outline"></Icon> 导出
        </Button>
    </FormItem>-->
      </Form>
      <Table style="margin-top: 1px"
             :data="tableData2"
             :columns="tableColumns2"
             stripe
             border
             :loading="loading"
             ref="table"
             show-summary></Table>
    </TabPane>
    <TabPane label="Epic周报">
      <div>
        <Form :label-width="65"
              inline
              :model="selectItem"
              ref="selectItem"
              :rules="ruleValidate">
          <FormItem label="团队:"
                    prop="team">
            <Select v-model="selectItem.team"
                    @on-change="getSprint()"
                    style="width:200px">
              <Option v-for="item in teams"
                      :value="item.value"
                      :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="迭代组:">
            <Select v-model="selectItem.sprintTeam"
                    filterable
                    clearable
                    style="width:200px">
              <Option v-for="item in sprintTeams"
                      :value="item.value"
                      :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary"
                    @click="getSprintWork()">搜索</Button>
          </FormItem>
        </Form>

        <Table style="margin-top: 1px"
               :data="tableData"
               :columns="tableColumns"
               stripe
               border
               :loading="loading"
               ref="table"
               show-summary></Table>
        <br>
        <!--<Button type="primary"
            size="large"
            @click="exportData()">
      <Icon type="ios-download-outline"></Icon> 导出
    </Button>-->
      </div>
    </TabPane>
  </Tabs>
</template>
<script>
import { getTeamSprintRelationship, getSprintWorkTime, queryDasyReport, getScrumTeam, getWorkersList } from '@/api/data'
export default {
  data () {
    return {
      loading: false,
      teamSprintRelation: '',
      ruleValidate: {
        team: [{ required: true, message: '必填项', trigger: 'blur' }],
        startDate: [{ required: true, message: '必填项', trigger: 'change', pattern: /.+/ }],
        endDate: [{ required: true, message: '必填项', trigger: 'change', pattern: /.+/ }]
      },
      teams: [],
      startTimeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      endTimeOption: {
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      sprintTeams: [],
      sprintTeams2: [],
      selectItem: {
        team: '',
        sprintTeam: ''
      },
      diasabledSelect1: false,
      diasabledSelect2: false,
      diasabledSelect3: false,
      selectItem2: {
        startDate: '',
        endDate: '',
        deptdesc: [],
        sprintTeam2: [],
        workerName: ''
      },
      workers: [],
      deptDescs: [
        {
          'value': 'IT运维TeamA',
          'label': 'IT运维TeamA'
        },
        {
          'value': 'IT运维TeamB',
          'label': 'IT运维TeamB'
        },
        {
          'value': '产品TeamO',
          'label': '产品TeamO'
        },
        {
          'value': '产品TeamP',
          'label': '产品TeamP'
        },
        {
          'value': '产品TeamQ',
          'label': '产品TeamQ'
        },
        {
          'value': '设计TeamN',
          'label': '设计TeamN'
        },
        {
          'value': '质量TeamS',
          'label': '质量TeamS'
        },
        {
          'value': '质量TeamR',
          'label': '质量TeamR'
        },
        {
          'value': '质量TeamT',
          'label': '质量TeamT'
        },
        {
          'value': '研发TeamC',
          'label': '研发TeamC'
        },
        {
          'value': '研发TeamD',
          'label': '研发TeamD'
        },
        {
          'value': '研发TeamE',
          'label': '研发TeamE'
        },
        {
          'value': '研发TeamF',
          'label': '研发TeamF'
        },
        {
          'value': '研发TeamG',
          'label': '研发TeamG'
        },
        {
          'value': '研发TeamH',
          'label': '研发TeamH'
        },
        {
          'value': '研发TeamI',
          'label': '研发TeamI'
        },
        {
          'value': '研发TeamJ',
          'label': '研发TeamJ'
        },
        {
          'value': '研发TeamK',
          'label': '研发TeamK'
        },
        {
          'value': '研发TeamL',
          'label': '研发TeamL'
        },
        {
          'value': '研发TeamM',
          'label': '研发TeamM'
        }
      ],
      tableData: [],
      tableColumns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: '75%'
        },
        {
          title: 'sprint',
          key: 'Sprint',
          width: '200'
        },
        {
          title: 'Epic',
          key: 'Epic',
          width: '200'
        },
        {
          title: '概述',
          key: '概要'
        },
        {
          title: 'story状态',
          key: 'Story状态',
          width: '120'
        },
        {
          title: '预估工作量(d)',
          key: '预估工作量',
          width: '120'
        },
        {
          title: '完成工作量(d)',
          key: '已完成工作量',
          width: '120'
        },
        {
          title: '剩余工作量(d)',
          key: '剩余工作量',
          width: '120'
        },
        {
          title: '差值(d)',
          key: '超预估工作量',
          width: '120',
          render: (h, params) => {
            // console.log('332323223: ', params)
            if (params.row.超预估工作量 > 0) {
              return h(
                'div',
                {
                  style: {
                    color: '#f00',
                    'font-weight': 700
                  }
                },
                params.row.超预估工作量
              )
            } else if (params.row.超预估工作量 <= 0) {
              return h(
                'div',
                // {
                //   style: {
                //     color: "#0f0",
                //   }
                // },
                params.row.超预估工作量
              )
            }
          }
        }
      ],
      tableData2: [],
      tableColumns2: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: '75%'
        },
        {
          title: '姓名',
          key: 'worker_name',
          width: '100',
          sortable: true
        },
        {
          title: '组织架构',
          key: 'dept_sec',
          width: '120'
        },
        {
          title: '敏捷团队',
          key: 'scrum_team',
          width: '110'
        },
        {
          title: '日期',
          key: 'work_date',
          width: '110'
        },
        {
          title: '工时(h)',
          key: 'work_time',
          width: '90',
          render: (h, params) => {
            return h(
              'div',
              parseFloat(params.row.work_time, 2)
            )
          }
        },
        {
          title: '工作日志',
          key: 'work_log'
        },
        {
          title: '单号',
          key: 'work_id',
          width: '120'
        },
        {
          title: '类型',
          key: 'work_type',
          width: '90'
        },
        {
          title: '任务',
          key: 'task'
        }
        // {
        //  title: '父级jira',
        //  key: 'parent_jira'
        // },
        // {
        //  title: '主题',
        //  key: 'summary'
        // }
      ]
    }
  },
  created () {
    this.queryTeamSprint()
  },
  mounted () {
    // this.getAllSprintWork()
    this.queryScrumTeam()
    const myDate = new Date()
    const year = myDate.getFullYear()
    const month = myDate.getMonth() + 1
    const day = myDate.getDate()
    this.selectItem2.startDate = `${year}-${month}-${day}`
    this.selectItem2.endDate = `${year}-${month}-${day}`
    this.queryWorkerList()
  },
  methods: {
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
        console.log('keys is ....: ', this.teams)
      }
      )
    },
    getSprint (team) {
      console.log('222222----:', this.teamSprintRelation)
      console.log('the select team is : ', this.selectItem.team)
      for (let i in this.teamSprintRelation) {
        if (i === this.selectItem.team) {
          this.sprintTeams = this.teamSprintRelation[i]
          break
        }
      }
      // this.sprintTeams = sprintlist
      console.log('the sprint list is :', this.sprintTeams)
    },
    getSprintWork () {
      this.$refs.selectItem.validate(valid => {
        console.log('this.selectItem is : ', this.selectItem)
        console.log('the valid> :', valid)
        if (valid) {
          this.loading = true
          getSprintWorkTime({ type: 1, sprint: this.selectItem.sprintTeam }).then(res => {
            this.loading = false
            this.tableData = res.data.data
            var auditYuguwork = 0
            var auditWanchengwork = 0
            var auditShengyuwork = 0
            var auditdiscardtotal = 0
            res.data.data.forEach(arr => {
              auditYuguwork += arr.预估工作量
              auditWanchengwork += arr.已完成工作量
              auditShengyuwork += arr.剩余工作量
              auditdiscardtotal += arr.超预估工作量
            })
            let arr = {
              Sprint: '合计',
              Epic: '',
              概述: '',
              Story状态: '',
              预估工作量: auditYuguwork,
              已完成工作量: auditWanchengwork,
              剩余工作量: auditShengyuwork,
              超预估工作量: auditdiscardtotal
            }
            this.tableData.push(arr)
          })
        } else {
          this.$Message.error('必填信息为空')
        }
      })
    },
    getAllSprintWork () {
      this.loading = true
      getSprintWorkTime({ type: 1, sprint: 'all' }).then(res => {
        this.loading = false
        this.tableData = res.data.data
      })
    },
    exportData (type) {
      this.$refs.table.exportCsv({
        filename: '迭代进度'
      })
      // if (type === 1) {
      //   this.$refs.table.exportCsv({
      //     filename: 'The original data'
      //   });
      // } else if (type === 2) {
      //   this.$refs.table.exportCsv({
      //     filename: 'Sorting and filtering data',
      //     original: false
      //   });
      // } else if (type === 3) {
      //   this.$refs.table.exportCsv({
      //     filename: 'Custom data',
      //     columns: this.columns8.filter((col, index) => index < 4),
      //     data: this.data7.filter((data, index) => index < 4)
      //   });
      // }
    },
    getDaysReport () {
      this.$refs.selectItem2.validate(valid => {
        // console.log('the 组织架构 is。。。', this.selectItem2.deptdesc)
        // console.log('the 迭代组 is。。。', this.selectItem2.sprintTeam2)
        // console.log('the valid is ==>', valid)
        // console.log('start date is :', this.selectItem2.startDate)
        // console.log('end date is :', this.selectItem2.endDate)
        console.log('the workers is :>>>>>', this.selectItem2.workerName)
        if (valid) {
          this.loading = true
          // 将中国标准时间转换成yyyy-mm-dd格式，否则传到服务端会显示有误
          var start_time = new Date(this.selectItem2.startDate)
          var end_time = new Date(this.selectItem2.endDate)
          start_time = start_time.getFullYear() + '-' + (start_time.getMonth() + 1) + '-' + start_time.getDate()
          end_time = end_time.getFullYear() + '-' + (end_time.getMonth() + 1) + '-' + end_time.getDate()
          console.log('the new date is ', start_time)

          // 将选择的组织架构数据转成str传递到服务端
          var dept_str = '('
          var deptdesc = this.selectItem2.deptdesc
          if (deptdesc.length > 0) {
            for (var i = 0; i < deptdesc.length; i++) {
              dept_str += "'" + deptdesc[i] + "',"
            }
            dept_str = dept_str.slice(0, -1) + ')'
          } else {
            dept_str = ''
          }
          console.log('the deptTostr is :', dept_str)

          // 将选择的迭代组数据转成str传递到服务端
          var scrum_team_str = ''
          var scrum_team = this.selectItem2.sprintTeam2
          if (scrum_team.length > 0) {
            for (var j = 0; j < scrum_team.length; j++) {
              scrum_team_str += scrum_team[j] + ','
            }
            scrum_team_str = scrum_team_str.slice(0, -1)
          } else {
            scrum_team_str = ''
          }
          console.log('the scrumTeamtoStr is :', scrum_team_str)

          // 将选择的人员信息转成str传递到服务端
          var workers_str = '('
          var workers = this.selectItem2.workerName
          if (workers.length > 0) {
            console.log('11111111111')
            for (var x = 0; x < workers.length; x++) {
              workers_str += "'" + workers[x] + "',"
            }
            workers_str = workers_str.slice(0, -1) + ')'
          } else {
            workers_str = ''
          }
          console.log('the workers_str is :', workers_str)
          queryDasyReport({ 'start_time': start_time, 'end_time': end_time, 'dept_desc': dept_str, 'scrum_team': scrum_team_str, 'worker': workers_str }).then(res => {
            this.loading = false
            this.tableData2 = res.data.data
          })
        } else {
          this.$Message.error('必填信息为空')
        }
      })
    },
    initSelect () {
      console.log('执行是否可选择校验。。。')
      console.log('the 组织架构 is ===>:', this.selectItem2.deptdesc, this.selectItem2.deptdesc.length)
      console.log('the 迭代组 is ===>:', this.selectItem2.sprintTeam2)
      console.log('the 人员 is ===>:', this.selectItem2.workerName)
      if (this.selectItem2.deptdesc.length > 0) {
        this.diasabledSelect2 = true
        this.diasabledSelect1 = false
        this.diasabledSelect3 = true
      } else if (this.selectItem2.sprintTeam2.length > 0) {
        this.diasabledSelect1 = true
        this.diasabledSelect2 = false
        this.diasabledSelect3 = true
      } else if (this.selectItem2.workerName.length > 0) {
        this.diasabledSelect2 = true
        this.diasabledSelect1 = true
        this.diasabledSelect3 = false
      } else {
        this.diasabledSelect1 = false
        this.diasabledSelect2 = false
        this.diasabledSelect3 = false
      }
    },
    queryScrumTeam () {
      getScrumTeam().then(res => {
        if (res.data.data !== []) {
          this.sprintTeams2 = res.data.data
        } else {
          this.sprintTeams2 = []
        }
      })
    },
    onStartTimeChange (startDate, type) {
      this.endTimeOption = {
        disabledDate (endDate) {
          // return date && date.valueOf() > Date.now()
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
    queryWorkerList () {
      // 将选择的迭代组数据转成str传递到服务端
      var scrum_team_str = ''
      var scrum_team = this.selectItem2.sprintTeam2
      if (scrum_team.length > 0) {
        for (var j = 0; j < scrum_team.length; j++) {
          scrum_team_str += scrum_team[j] + ','
        }
        scrum_team_str = scrum_team_str.slice(0, -1)
      } else {
        scrum_team_str = ''
      }
      getWorkersList({ 'scrum_team': scrum_team_str }).then(res => {
        if (res.data.data !== []) {
          this.workers = res.data.data
        } else {
          this.workers = []
        }
        console.log('the worklist is :', this.workers)
      })
    },
    clearallselect () {
      this.selectItem2.deptdesc = []
      this.selectItem2.sprintTeam2 = []
    }
  }
}
</script>
<style lang="less" scoped>
</style>
