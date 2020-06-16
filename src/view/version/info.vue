<template>

  <div>

    <DatePicker type="daterange"
                split-panels
                placeholder="Select date"
                style="width: 200px"></DatePicker>

    <Button type="primary"
            @click="add ()">新增</Button>
    <a href="https://wiki.tuniu.org/pages/viewpage.action?pageId=86081312"> iOS发包轮流值班表</a>
    <Table border
           :columns='columns'
           :data='data5'>

    </Table>

    <el-dialog title="版本明细"
               :visible.sync="dialogFormVisible"
               center
               width="40%">
      <!-- <el-dialog width="30%"
                 :title="resultTitle"
                 :visible.sync="innerVisible"
                 append-to-body>
        <h4>{{ msgContent }}</h4> -->
      <!-- </el-dialog> -->
      <Form :model="form"
            ref="form">
        <!-- :rules="ruleValidate"> -->
        <FormItem label="版本"
                  prop='version'
                  :label-width=100>
          <Input v-model="form.version" />
          <!-- v-bind:disabled="diasabledInput" /> -->
        </FormItem>
        <FormItem label="开始时间"
                  prop="startTime"
                  :label-width=100>
          <Input v-model="form.startTime" />
        </FormItem>

        <FormItem label="结束时间"
                  prop="endTime"
                  :label-width=100>
          <Input v-model="form.endTime" />
        </FormItem>
        <FormItem label="测试负责人"
                  prop="tester"
                  :label-width=100>
          <Input v-model="form.tester" />
        </FormItem>
        <FormItem label="ios"
                  prop="ios"
                  :label-width=100>
          <Input v-model="form.ios" />
        </FormItem>
        <FormItem label="android"
                  prop="startTime"
                  :label-width=100>
          <Input v-model="form.android" />
        </FormItem>
        <FormItem label="备注"
                  prop="remark"
                  :label-width=100>
          <Input v-model="form.remark"
                 type="textarea"
                 placeholder="延期或小版本原因"
                 :autosize="{minRows: 2,maxRows: 5}" />

        </FormItem>
      </Form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveParams(form) ,this.query()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { versionInfo, save } from '@/api/data'
export default {
  data () {
    return {
      columns: [
        {
          title: '序号',
          key: 'id'
        },
        {
          title: '版本',
          key: 'version'
        },
        {
          title: '开始时间',
          key: 'startTime',
          align: 'center'
        },
        {
          title: '结束时间',
          key: 'endTime'
        },
        {
          title: '测试负责人',
          key: 'tester'
        },
        {
          title: 'ios',
          key: 'ios'
        },
        {
          title: 'android',
          key: 'android'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '操作',
          key: 'operation',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary'
                },
                on: {
                  click: () => {
                    console.log(params)
                    this.edit(params.index)
                  }
                }
              }, '编辑')

            ]
            )
          }
        }
      ],
      data5: [],
      dialogFormVisible: false,
      form: {
        id: 0,
        version: '',
        startTime: '',
        endTime: '',
        ios: '',
        tester: '',
        android: '',
        remark: ''
      }
    }
  },
  mounted () {
    this.query()
  },
  methods: {
    add () {
      this.dialogFormVisible = true
      this.form.id = ''
      this.form.version = ''
      this.form.startTime = ''
      this.form.endTime = ''
      this.form.tester = ''
      this.form.ios = ''
      this.form.android = ''
      this.form.remark = ''
    },

    edit (index) {
      this.dialogFormVisible = true
      this.form.id = this.data5[index].id
      // console.log('1222', this.data5)
      this.form.version = this.data5[index].version
      this.form.startTime = this.data5[index].startTime
      this.form.endTime = this.data5[index].endTime
      this.form.tester = this.data5[index].tester
      this.form.ios = this.data5[index].ios
      this.form.android = this.data5[index].android
      this.form.remark = this.data5[index].remark
    },

    saveParams () {
      console.log(this.form)
      save(this.form).then(res => {
        this.dialogFormVisible = false
        this.$Message.success(res.data.msg)
        this.query()
      })
      //   .
      //     then(res => {
      //       if (res.data.success === true) {
      //         this.dialogFormVisible = false
      //         this.$Message.success(res.data.msg)
      //         this.query() // 重新查询最新记录
      //       } else {
      //         this.msgContent = res.data.msg
      //         this.resultTitle = '保存失败'
      //         this.innerVisible = true
      //         // this.$Message.error(res.data.msg)
      //       }
      //     })
      // }
    },
    query () {
      versionInfo().then(response => {
        let res = response.data
        if (res.code === 720000) {
          this.handleData(res)
        } else {
          this.$Message.error('查询数据失败～～～')
        }
      })
    },
    handleData (response) {
      this.dataList = response.data
      this.isLoading = true
      this.data5 = []
      this.dataList.forEach(data => {
        this.data5.push({
          id: data.id,
          version: data.version,
          startTime: data.startTime,
          endTime: data.endTime,
          tester: data.tester,
          ios: data.ios,
          android: data.android,
          remark: data.remark
        })
      })
    }
  }
}
</script>
