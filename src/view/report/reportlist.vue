<template>
  <div>
    <Form :label-width="65"
          inline>
      <FormItem label="运行时间:">
        <DatePicker v-model="formInline.time"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="请选择时间(支持到秒)"
                    style="width: 300px"></DatePicker>

      </FormItem>
      <FormItem label="系统:">
        <Col span="30"
             style="padding-right:10px">
        <Select v-model="module"
                filterable
                clearable>
          <Option v-for="item in modules"
                  :value="item.value"
                  :key="item.value">{{ item.label }}</Option>
        </Select>
        </Col>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="queryList(1)">搜索</Button>
      </FormItem>
    </Form>

    <Table style="margin-top: 1px"
           :data="tableData"
           :columns="tableColumns"
           stripe></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: left;">
        <Page :total='totalPage'
              :current="current"
              v-if="ispage"
              @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>
<script>
import { queryReportList, getTag } from '@/api/data'
export default {
  data () {
    return {
      tableData: [],
      totalPage: 1,
      current: 1,
      ispage: false,
      module: '',
      modules: '',
      formInline: {
        time: [],
        tag: ''
      },
      tableColumns: [
        {
          title: '批次',
          key: 'id'
        },
        {
          title: '开始时间',
          key: 'startTime'
        },
        {
          title: '结束时间',
          key: 'endTime'
        },
        {
          title: '系统',
          key: 'tag'
        },
        {
          title: '结果',
          key: 'result'
        },
        {
          title: '操作',
          key: 'operation',
          render: (h, params) => {
            console.log(params)
            return h('a',
              {
                domProps: {
                  target: '_blank',
                  href: 'report/' + params.row.id,
                  innerText: '查看报告'
                }
              }
            )
          }
        }
      ]
    }
  },
  created () {
    this.queryList()
    this.getTag()
  },
  methods: {
    getTag () {
      getTag().then(res => {
        this.modules = res.data
      }
      )
    },
    queryList (pageNum) {
      console.log(this.current)
      let params = this.formInline
      params.tag = this.module
      params.page = pageNum || 1
      params.pageSize = 10
      queryReportList(params).then(res => {
        this.tableData = res.data.data.dataList
        this.totalPage = res.data.data.count
        if (this.totalPage !== 0) {
          this.ispage = true
        } else {
          this.ispage = false
        }
      })
    },
    changePage (pageNum) {
      // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      this.tableData1 = this.queryList(pageNum)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
