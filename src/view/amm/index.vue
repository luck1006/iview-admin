
<template>
  <div>
    <div>
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
    </div>

    <Tabs type="card">
      <!-- <template v-for="(item,index) in ammData"
              v-bind="item.layerid"> -->
      <Tab-pane :label="item.title"
                :key="item.layer"
                v-for="(item,index) in ammData"
                v-bind="item.layerid"
                @click="toggleTabs(index)">
        <div>
          <Table border
                 ref="selection"
                 stripe
                 :columns="columns4"
                 :data="item.ammInfo"></Table>
        </div>
      </Tab-pane>

      <!-- </template> -->
    </Tabs>
    <Divider orientation="left">操作</Divider>
    <Row type="flex"
         justify="end"
         class="code-row-bg">
      <i-col span="4">
        <Select v-model="name"
                @on-change="queryInfo()"
                clearable>
          <Option v-for="item in scrumName"
                  :value="item.teamCode"
                  :key="item.teamCode">{{ item.teamName }}</Option>
        </Select>
      </i-col>
      <i-col span="4"> <Select v-model="dataQ"
                @on-change="queryInfo()"
                clearable>
          <Option id="dataQ"
                  v-for="item in dataList"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select></i-col>

      <!-- <i-col span="4"> <Button @click="queryInfo">查询信息</Button></i-col> -->
      <i-col span="4">
        <Button type="primary"
                @click="submitInfo()">提交保存</Button>
      </i-col>
    </Row>

  </div>

</template>

<script>
import { ammInfo, teamName, commitAmm, queryByteam } from '@/api/data'
import Loading from '@/components/loading'
export default {
  data () {
    return {
      isLoading: true,
      scrumName: [],
      ammData: [],
      ammInfo: [],
      self: this,
      checkboxValue: [],
      columns4: [
        {
          title: '成熟度',
          key: 'level',
          width: 300
        },
        {
          title: '成熟度标准',
          key: 'title',
          render: (h, params) => {
            return h('CheckboxGroup', {
              props: {
                value: this.checkboxValue
              },
              on: {
                'on-change': val => {
                  this.checkboxValue = val
                }
              }
            }, params.row.data.map(item => {
              return h('div', [
                h('Checkbox', {
                  props: {
                    label: item.id
                  }
                }, [h('Tooltip', { props: { placement: 'top', transfer: true }
                }, [item.title, h('span', { slot: 'content', style: { whiteSpace: 'normal' } }, item.comment)])])
              ])
            }))
            // return h('div', params.row.title)
          }
        }
      ],

      dataList: [
        {
          value: '2019Q1',
          label: '2019Q1'
        },
        {
          value: '2019Q2',
          label: '2019Q2'
        },
        {
          value: '2019Q3',
          label: '2019Q3'
        }
        // {
        //   value: '2019Q3',
        //   label: '2019Q3'
        // },
        // {
        //   value: '2019Q4',
        //   label: '2019Q4'
        // }

      ],

      name: '',
      dataQ: ''
    }
  },
  components: {
    Loading
  },
  created () {
    // 获取成熟度模型
    ammInfo().then(res => {
      if (res.data && res.data.data && res.data.data.length > 0) {
        this.handleData(res.data.data)
      }
    })
    // 获取teamname信息
    teamName().then(res => {
      if (res.data && res.data.data && res.data.data.length > 0) {
        this.scrumName = res.data.data
      }
    })
  },
  mounted () {
    if (this.$route.params.team && this.$route.params.dataQ) {
      this.name = this.$route.params.team
      this.dataQ = this.$route.params.dataQ
      this.queryInfo()
    }
  },
  methods: {
    handleSelectAll (status) {
      this.$refs.selection.selectAll(status)
    },
    handleData (dataList) {
      this.ammData = dataList
      this.isLoading = false
      // console.log(this.ammData)
    },
    submitInfo () {
      let params = {
        team: this.name,
        quarter: this.dataQ,
        secondId: this.checkboxValue
      }
      commitAmm(JSON.stringify(params)).then((response) => {
        let res = response.data
        if (res.success === 'true') {
          // alert('保存数据成功～～')
          this.$Message.success('保存数据成功～～～')
        } else {
          this.$Message.error('保存数据失败～～～')
        }
      })
    },
    queryInfo () {
      let params = {
        team: this.name,
        quarter: this.dataQ
      }
      queryByteam(params).then((response) => {
        let res = response.data
        if (res.success === 'true') {
          this.checkboxValue = res.data
          // this.$Message.success('查询数据成功～～～')
        } else {
          this.$Message.failed('查询数据失败～～～')
        }
      })
    }

  }
}
</script>

<style>
</style>
