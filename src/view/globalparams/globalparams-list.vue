<template>
  <div>
    <Form :label-width="65"
          inline>
      <FormItem label="环境:">
        <Select style="width:80px"
                v-model="formInline.env">
          <Option value="">请选择</Option>
          <Option value="sit">sit</Option>
          <Option value="pre">pre</Option>
          <Option value="prd">prd</Option>
        </Select>
      </FormItem>
      <FormItem label="更新人:">
        <Input placeholder="请输入中文姓名"
               v-model="formInline.user"
               style="width:155px" />
      </FormItem>
      <FormItem label="变量名称:">
        <Input placeholder="请输入变量名称"
               v-model="formInline.key"
               style="width:155px" />
      </FormItem>
      <FormItem label="变量值:">
        <Input placeholder="请输入变量值"
               v-model="formInline.value"
               style="width:155px" />
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="queryList(1)">搜索</Button>
      </FormItem>
      <FormItem style="margin-left: -40px">
        <Button type="primary"
                icon='md-add'
                @click="addParam()">新增</Button>
      </FormItem>
    </Form>
    <Table style="margin-top: 1px"
           :data="tableData"
           :columns="tableColumns"
           border>
      <template slot-scope="{ row, index }"
                slot="id">
        <span>{{index+(current - 1) * pageSize + 1}} </span>
      </template>
    </Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: left;">
        <Page :total='totalPage'
              :current="current"
              v-if="ispage"
              @on-change="changePage"></Page>
      </div>
    </div>
    <el-dialog title="全局变量维护界面"
               :visible.sync="dialogFormVisible"
               center
               width="40%">
      <el-dialog width="30%"
                 :title="resultTitle"
                 :visible.sync="innerVisible"
                 append-to-body>
        <h4>{{ msgContent }}</h4>
      </el-dialog>
      <Form :model="form"
            ref="form"
            :rules="ruleValidate">
        <FormItem label="变量名称"
                  prop="paramKey"
                  :label-width="100">
          <Input v-model="form.paramKey"
                 v-bind:disabled="diasabledInput" />
        </FormItem>
        <FormItem label="变量类型"
                  prop="paramType"
                  :label-width="100">
          <Select v-model="form.paramType"
                  v-bind:disabled="diasabledInput"
                  @on-change="initParamValue">
            <Option value="user">user</Option>
            <Option value="sys">sys</Option>
          </Select>
        </FormItem>
        <FormItem label="变量值"
                  prop="paramValue"
                  :label-width="100">
          <Input v-model="form.paramValue"
                 v-show="form.paramType==='user'" />
          <Row v-show="form.paramType==='sys'">
            <Col span="4">
            <Select v-model="form.paramValue"
                    v-show="form.paramType==='sys'">
              <Option v-for="item in sysParamsList"
                      :value="item.value"
                      :key="item.value">{{ item.label }}</Option>
            </Select>
            </Col>
            <Col span="15">
            <Input v-model="form.ExpressionNum"
                   placeholder="请输入整数">
            <Select v-model="form.paramExpression"
                    slot="prepend"
                    style="width: 60px">
              <Option value="add">+</Option>
              <Option value="subtract">-</Option>
            </Select>
            <Select v-model="form.ExpressionUnit"
                    slot="append"
                    style="width: 80px">
              <Option value="d">天</Option>
              <Option value="M">月</Option>
              <Option value="t">时</Option>
              <Option value="m">分</Option>
              <Option value="s">秒</Option>
            </Select>
            </Input>
            </col>
          </Row>
          <p style="color:red;font-size:14px;text-align: left"
             v-show="form.paramType==='sys'">请选择变量名(curr_date,curr_time等),或同时定义早于(+)或晚于(-)当前时间的天数、月数等</p>
        </FormItem>
        <FormItem label="环境"
                  :label-width="100">
          <!-- <Select v-model="form.paramEnv"
                  placeholder="请选择环境"
                  v-bind:disabled="diasabledInput">
            <Option label="sit"
                    value="sit"></Option>
            <Option label="pre"
                    value="pre"></Option>
            <Option label="prd"
                    value="prd"></Option>
          </Select> -->
          <Checkbox :indeterminate="indeterminate"
                    :value="checkAll"
                    v-bind:disabled="diasabledInput"
                    @click.prevent.native="handleCheckAll">全选</Checkbox>
          <CheckboxGroup v-model="form.checkAllGroup"
                         @on-change="checkAllGroupChange">
            <Checkbox label="sit"
                      v-bind:disabled="diasabledsit"></Checkbox>
            <Checkbox label="pre"
                      v-bind:disabled="diasabledpre"></Checkbox>
            <Checkbox label="prd"
                      v-bind:disabled="diasabledprd"></Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button @click="saveParams(form)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryGlobalParamsList, saveGlobalParams, removeGlobalParams, getSysParamsList } from '@/api/data'
export default {
  data () {
    return {
      tableData: [],
      totalPage: 1,
      current: 1,
      pageSize: 10,
      ispage: false,
      formInline: {
        env: '',
        key: '',
        value: '',
        user: ''
      },
      tableColumns: [
        {
          title: '序号',
          // type: 'index',
          width: '100',
          align: 'center',
          slot: 'id'
        },
        {
          title: '环境',
          key: 'env',
          width: '100'
        },
        {
          title: '变量名称',
          key: 'key'
        },
        {
          title: '变量值',
          key: 'value'
        },
        {
          title: '变量类型',
          key: 'type',
          width: '150'
        },
        {
          title: '更新人',
          key: 'user',
          width: '150'
        },
        {
          title: '更新时间',
          key: 'createTime'
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
                style: {
                  'margin-right': '10px'
                },
                on: {
                  click: () => {
                    console.log('点击【编辑】按钮')
                    this.editParam(params.index)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'primary'
                },
                on: {
                  click: () => {
                    // 确认删除提醒
                    this.confirm(params.index)
                    // this.removeParam(params.index)
                  }
                }
              }, '删除')
            ]
            )
          }
        }
      ],
      dialogFormVisible: false,
      form: {
        paramKey: '',
        paramType: 'user',
        paramValue: '',
        checkAllGroup: [],
        ExpressionNum: '',
        ExpressionUnit: '',
        paramExpression: ''
        // paramEnv: ''
      },
      indeterminate: false,
      checkAll: false,
      diasabledsit: false,
      diasabledpre: false,
      diasabledprd: false,
      formLabelWidth: '120px',
      diasabledInput: false,
      innerVisible: false,
      resultTitle: '',
      msgContent: '',
      ruleValidate: {
        paramKey: [{ required: true, message: '变量名称不能为空', trigger: 'blur' }],
        paramValue: [{ required: true, message: '变量值不能为空', trigger: 'blur' }]
      },
      sysParamsList: []
    }
  },
  created () {
    this.queryList()
  },
  mounted () {
    this.querySysParmasList()
  },
  methods: {
    queryList (pageNum) {
      let params = this.formInline
      params.page = pageNum || 1
      params.pageSize = 10
      queryGlobalParamsList(params).then(res => {
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
      this.current = pageNum
      this.tableData1 = this.queryList(pageNum)
    },
    addParam () {
      console.log('点击了【新增】按钮')
      this.dialogFormVisible = true
      this.indeterminate = false
      this.checkAll = false
      this.diasabledsit = false
      this.diasabledpre = false
      this.diasabledprd = false
      this.diasabledInput = false
      this.form.paramKey = ''
      this.form.paramValue = ''
      this.form.paramType = 'user'
      this.form.checkAllGroup = []
    },
    editParam (index) {
      // 初始化编辑框状态
      this.dialogFormVisible = true
      this.diasabledInput = true // 控制编辑时，变量名称 和 环境 信息为只读，只能维护变量值
      this.indeterminate = true
      this.diasabledsit = false
      this.diasabledpre = false
      this.diasabledprd = false
      this.form.paramKey = this.tableData[index].key
      this.form.paramType = this.tableData[index].type
      console.log('type: ', this.form.paramType, 'origin value:', this.tableData[index].value)
      if (this.form.paramType === 'sys') {
        let tmp_paramValue = this.tableData[index].value.split(';')
        console.log('33333333: ', tmp_paramValue)
        this.form.paramValue = tmp_paramValue[0]
        this.form.paramExpression = tmp_paramValue[1]
        this.form.ExpressionNum = tmp_paramValue[2]
        this.form.ExpressionUnit = tmp_paramValue[3]
      } else {
        this.form.paramValue = this.tableData[index].value
      }
      console.log('value:', this.form.paramValue)
      this.form.checkAllGroup = [this.tableData[index].env]
      console.log('当前记录环境： ', this.tableData[index].env)
      // 当前记录所属环境在编辑时不允许取消选择
      if (this.tableData[index].env === 'sit') {
        this.diasabledsit = true
      } else if (this.tableData[index].env === 'pre') {
        this.diasabledpre = true
      } else if (this.tableData[index].env === 'prd') {
        this.diasabledprd = true
      }
    },
    removeParam (index) {
      removeGlobalParams({
        paramKey: this.tableData[index].key,
        paramValue: this.tableData[index].value,
        paramEnv: this.tableData[index].env
      }).then(res => {
        if (res.data.success === true) {
          this.$Message.success(res.data.msg)
          this.queryList() // 重新查询最新记录
        } else {
          this.$Message.error({
            content: res.data.msg,
            duration: 5
          })
        }
      })
    },
    confirm (index) {
      this.$Modal.confirm({
        title: '确认删除提醒',
        content: '<p>是否确认删除该记录？</p>',
        onOk: () => {
          this.removeParam(index)
        },
        onCancel: () => {
          this.$Message.info('取消删除！')
        }
      })
    },
    saveParams (form) {
      console.log('即将保存变量信息...')
      this.$refs.form.validate(valid => {
        if (valid) {
          // 当选择为sys系统变量时，将变量名与表达式组装成一个字段值传到后端
          if (this.form.paramType === 'sys') {
            this.form.paramValue = this.form.paramValue + ';' + this.form.paramExpression + ';' + this.form.ExpressionNum + ';' + this.form.ExpressionUnit
          }
          saveGlobalParams({ paramKey: this.form.paramKey, paramValue: this.form.paramValue, checkAllGroup: this.form.checkAllGroup, user: this.$store.state.user.userName, addOrUpdate: this.diasabledInput, paramType: this.form.paramType }).then(res => {
            if (res.data.success === true) {
              this.dialogFormVisible = false
              this.$Message.success({
                content: res.data.msg,
                duration: 5
              })
              this.queryList() // 重新查询最新记录
            } else {
              this.msgContent = res.data.msg
              this.resultTitle = '变量信息维护失败'
              this.innerVisible = true
              // this.$Message.error(res.data.msg)
            }
          })
        }
      })
    },
    handleCheckAll () {
      console.log('click the 全选 button')
      console.log('this.indeterminate:', this.indeterminate)
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false
      console.log('this.checkAll: ', this.checkAll)
      if (this.checkAll) {
        this.form.checkAllGroup = ['sit', 'pre', 'prd']
      } else {
        this.form.checkAllGroup = []
      }
    },
    checkAllGroupChange (data) {
      if (data.length >= 3) {
        this.indeterminate = false
        this.checkAll = true
      } else if (data.length > 0) {
        this.indeterminate = true
        this.checkAll = false
      } else {
        this.indeterminate = false
        this.checkAll = false
      }
    },
    querySysParmasList () {
      getSysParamsList().then(res => {
        if (res.data.success === true) {
          this.sysParamsList = res.data.data
          console.log('sysParamlist:', this.sysParamsList)
        } else {
          this.sysParamsList = [
            {
              value: 'current_date',
              label: 'current_date'
            },
            {
              value: 'crrent_time',
              label: 'current_time'
            }
          ]
        }
      })
    },
    initParamValue () {
      console.log('init paramValue....')
      console.log(this.form.paramType)
      if (this.form.paramType === 'user') {
        this.form.paramValue = ''
      } else if (this.form.paramType === 'sys') {
        this.form.paramValue = ''
        this.form.ExpressionNum = ''
        this.form.ExpressionUnit = ''
        this.form.paramExpression = ''
      }
    }
  }
}
</script>
