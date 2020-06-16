<template>
  <div class="tree-pane-wrapper">
    <split-pane v-model="offset"
                :min="minOffset"
                left-can-collapsed
                ref="splitPane">
      <div slot="left"
           class="pane left-pane">
        <div>
          <i-button type="primary"
                    @click="batchRun()">批量运行</i-button>
        </div>
        <el-tree :props="props"
                 :data="treeData"
                 :load="loadNode"
                 node-key="id"
                 show-checkbox
                 highlight-current
                 @check="checkChange()"
                 @node-click="handleNodeClick"
                 lazy
                 draggable
                 @node-drag-start="nodeDragStart"
                 @node-drop="nodeDrop"
                 :allow-drop="allowDrop"
                 :default-expanded-keys="defaultExpandedKeys"
                 class="left-pane-tree"
                 ref="elTree">
          <span slot-scope="{ node, data }"
                class="custom-tree-node"
                v-bind:class="{active:data.color}">
            <!-- v-bind:class="{ active: data.color}" -->
            <!-- <span >
            <i class="el-icon-success" style="color:#67C23A"></i>
            <i class="el-icon-error" style="color:#F56C6C"></i>
          </span> -->
            <span v-show="!data.editing">{{ node.label }} </span>
            <Input v-model="data.editName"
                   size="small"
                   v-show="data.editing"
                   @click.native.stop />
            <div v-show="!data.editing"
                 @click.stop>
              <Poptip trigger="hover"
                      transfer
                      padding="0">
                <Icons type="add"
                       :size="12"
                       v-if="data.dropInner" />
                <ButtonGroup vertical
                             slot="content"
                             style="width: 100%">
                  <Button long
                          @click="addNode(node, false)">用例</Button>
                  <Button long
                          @click="addNode(node, true)">文件夹</Button>
                </ButtonGroup>
              </Poptip>
              <Icons type="edit"
                     :size="12"
                     @click.native="editNode(data)" />
              <Icons type="delete"
                     :size="12"
                     @click.native="deleteNode(node, data)" />
            </div>
            <div v-show="data.editing"
                 @click.stop>
              <Icons type="start"
                     :size="12"
                     @click.native="confirmEdit(data)" />
              <Icons type="del"
                     :size="12"
                     @click.native="cancelEdit(node, data)" />
            </div>
          </span>
        </el-tree>
      </div>
      <div slot="right"
           class="pane right-pane">
        <i-form :model="formItem"
                :label-width="85"
                ref="formItem"
                :rules="ruleValidate">
          <Form-item label="接口类型">
            <Row>
              <Col span="2">
              <Form-item prop="requestType">
                <i-select v-model="formItem.requestType"
                          placeholder="rest/tsp"
                          style="width: 98%"
                          size="large">
                  <i-option value="rest">rest</i-option>
                  <i-option value="tsp">tsp</i-option>
                  <i-option value="pepple">pepple</i-option>
                </i-select>
              </Form-item>
              </Col>
              <Col span="2">
              <Form-item prop="requestmethod">
                <i-select v-model="formItem.requestmethod"
                          placeholder="get/post/put"
                          style="width: 98%"
                          size="large"
                          v-show="formItem.requestType==='rest'">
                  <i-option value="get">get</i-option>
                  <i-option value="post">post</i-option>
                  <i-option value="put">put</i-option>
                </i-select>
              </Form-item>
              </Col>
              <Col span="18">
              <Form-item prop="url">
                <i-input v-model="formItem.url"
                         placeholder="请输入接口地址"
                         size="large"
                         style="width: 75%;;margin-right:5px"
                         v-show="formItem.requestType==='rest'"></i-input>
                <i-input v-model="formItem.url"
                         placeholder="请输入tsp服务名"
                         size="large"
                         style="width: 80%;;margin-right:5px"
                         v-show="formItem.requestType==='tsp'"></i-input>
                <i-input v-model="formItem.url"
                         placeholder="请输入pepple服务名"
                         size="large"
                         style="width:50%;;margin-right:5px"
                         v-show="formItem.requestType==='pepple'"></i-input>
                <Checkbox v-model="formItem.isQueryMethod"
                          v-show="formItem.requestType==='pepple'"
                          @on-change="queryMethodList(formItem)">方法选择</Checkbox>
                <i-input v-model="formItem.queryMethod"
                         placeholder="查询方法"
                         size="large"
                         style="width:20%;;margin-right:5px"
                         v-show="formItem.requestType==='pepple'"></i-input>
                <el-dialog title="查询方法选择"
                           :visible.sync="formItem.isQueryMethod"
                           center
                           width="40%">
                  <Table border
                         highlight-row
                         :columns="methodColumns"
                         :data="methodsList"></Table>
                  <div slot="footer"
                       class="dialog-footer">
                    <el-button @click="formItem.isQueryMethod = false">取消</el-button>
                    <el-button @click="reBackMethod">确定</el-button>
                  </div>
                </el-dialog>
                <!-- <Select v-model="formItem.queryMethod"
                        v-show="formItem.isQueryMethod===true"
                        style="width: 20%;;margin-right:5px"
                        filterable>
                  <Option v-for="item in methodList"
                          :value="item.value"
                          :key="item.value">{{ item.label }}</Option>
                </Select> -->
                <i-button type="primary"
                          @click="run(formItem)">运行</i-button>
                <i-button type="primary"
                          style="margin-left: 5px"
                          @click="save">保存</i-button>
                <!-- <el-button type="primary"
                           @click="
                           true">打开嵌套表单的 Dialog</el-button> -->

              </Form-item>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="Header"
                     style="margin:0">
            <Form-item v-for="(item, index) in formItem.header"
                       :key="'header'+index"
                       inline>
              <i-input v-model="item.key"
                       placeholder="key"
                       size="large"
                       class='minputstyle'></i-input>
              <i-input v-model="item.value"
                       placeholder="value"
                       size="large"
                       class='minputstyle'></i-input>
              <Button type="dashed"
                      long
                      v-if="formItem.header.length>=1"
                      @click="handleAdd('header')"
                      icon="md-add"
                      class='buttonstyle'></Button>
              <Button type="dashed"
                      long
                      v-if="formItem.header.length>1"
                      @click="handleRemove('header',index)"
                      icon="md-remove"
                      class='buttonstyle'></Button>
            </Form-item>
          </Form-item>
          <Form-item style="margin-bottom:3px">
            <Row>
              <Col span="9">
              <Form-item>
                <Radio-group v-model="formItem.env"
                             @on-change="radioChange()">
                  <Radio label="sit">sit</Radio>
                  <Radio label="pre">pre</Radio>
                  <Radio label="prd">prd</Radio>
                </Radio-group>
                （使用参数化时 环境必选）
              </Form-item>
              </Col>
              <Col span="3">
              <Form-item>
                <Checkbox v-model="formItem.isdParam">d参数</Checkbox>
              </Form-item>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="d参数"
                     v-show="formItem.isdParam===true"
                     style="margin-bottom:5px">
            <i-input v-model="formItem.dParam"
                     type="textarea"
                     size="large"
                     :autosize="{minRows:'5', maxRows: '5'}"
                     class='minputstyle'
                     placeholder="请输入d参数"
                     style="width: 70%;margin-bottom:5px"></i-input>
          </Form-item>
          <Form-item style="margin-bottom:0px">
            <Row>
              <Col span="9">
              <Checkbox v-model="formItem.isBase64Encode">入参base64编码</Checkbox>
              </Col>
              <Col span="9">
              <Checkbox v-model="formItem.isBase64Decode"
                        @on-change="base64decode(outparam)">出参base64解码</Checkbox>
              </Col>
            </Row>
          </Form-item>
          <Form-item label=""
                     inline>
            <i-input v-model="formItem.inputparam"
                     type="textarea"
                     size="large"
                     :autosize="{minRows: '20',maxRows: '20'}"
                     class='minputstyle'
                     placeholder="入参"></i-input>
            <i-input v-model="outparam"
                     type="textarea"
                     size="large"
                     :autosize="{minRows: '20',maxRows: '20'}"
                     class='minputstyle'
                     placeholder="出参"></i-input>
          </Form-item>
          </Form-item>
          <Form-item label="全局字段">
            <Form-item v-for="(item, index) in formItem.globalvar"
                       :key="'globalvar'+index"
                       inline>
              <i-input v-model="item.key"
                       placeholder="全局字段名称"
                       size="large"
                       class='minputstyle'></i-input>
              <i-input v-model="item.value"
                       placeholder="全局字段路径"
                       size="large"
                       class='minputstyle'></i-input>
              <Button type="dashed"
                      long
                      v-if="formItem.globalvar.length>=1"
                      @click="handleAdd('globalvar')"
                      icon="md-add"
                      class='buttonstyle'></Button>
              <Button type="dashed"
                      long
                      v-if="formItem.globalvar.length>1"
                      @click="handleRemove('globalvar',index)"
                      icon="md-remove"
                      class='buttonstyle'></Button>
            </Form-item>
          </Form-item>
          <Form-item label="校验值">
            <Form-item v-for="(item, index) in formItem.assertInfo"
                       :key="'assertInfo'+index"
                       inline>
              <i-input v-model="item.key"
                       placeholder="校验值路径"
                       size="large"
                       class='minputstyle-check'></i-input>
              <Select v-model="item.checkType"
                      placeholder="校验类型"
                      style="width: 100px"
                      size="large">
                <i-option value="equal">相等</i-option>
                <i-option value="regex">正则</i-option>
              </Select>
              <i-input v-model="item.value"
                       placeholder="期望值"
                       size="large"
                       class='minputstyle-check'>
              </i-input>
              <Button type="dashed"
                      long
                      v-if="formItem.assertInfo.length>=1"
                      @click="handleAdd('assertInfo')"
                      size="large"
                      icon="md-add"
                      class='buttonstyle'></Button>
              <Button type="dashed"
                      long
                      v-if="formItem.assertInfo.length>1"
                      @click="handleRemove('assertInfo',index)"
                      icon="md-remove"
                      class='buttonstyle'></Button>
            </Form-item>
          </Form-item>

          <Form-item label="预期返回内容">
            <i-input v-model="formItem.expectedcontent"
                     type="textarea"
                     :autosize="{minRows: 5,maxRows: 20}"
                     size="large"
                     style="width: 80%;"
                     placeholder="预期返回内容"></i-input>
          </Form-item>
          <Form-item label="批量正则校验">
            <Form-item v-for="(item, index) in formItem.regex_checklist"
                       :key="'regex_checklist'+index"
                       inline>
              <i-input v-model="item.key"
                       placeholder="校验字段列表，请按 {‘key1':n,'key2':n} 格式填写"
                       size="large"
                       class='minputstyle'></i-input>
              <i-input v-model="item.value"
                       placeholder="预期正则表达式"
                       size="large"
                       class='minputstyle'></i-input>
              <Button type="dashed"
                      long
                      v-if="formItem.regex_checklist.length>=1"
                      @click="handleAdd('regex_checklist')"
                      size="large"
                      icon="md-add"
                      class='buttonstyle'></Button>
              <Button type="dashed"
                      long
                      v-if="formItem.regex_checklist.length>1"
                      @click="handleRemove('regex_checklist',index)"
                      icon="md-remove"
                      class='buttonstyle'></Button>
            </Form-item>
          </Form-item>
        </i-form>
      </div>
      <div slot="trigger"
           class="custom-trigger">
        <div class="custom-line"></div>
      </div>
    </split-pane>
  </div>
</template>

<script>
import SplitPane from '_c/split-pane'
import Icons from '_c/icons'
import { queryTree, addTree, dragTree, modifyTree, deleteTree, runInterface, check, saveCase, queryCaseInfo, getTag, queryPid,
  batchRunByParameter, base64Decode, qeuryMethods, queryPeppleParams } from '@/api/data'
import cloneDeep from 'lodash/cloneDeep'
// import { constants } from 'crypto'
// import { constants } from 'fs'
export default {
  name: 'tree',
  components: {
    SplitPane,
    Icons
  },
  data () {
    return {
      offset: 0.2,
      minOffset: '40px',
      props: {
        label: 'name',
        isLeaf: 'leaf'
      },
      treeData: [],
      casename: '',
      formItem: {
        requestType: 'rest',
        env: '',
        requestmethod: 'get',
        header: [
          {
            key: '',
            value: ''
          }
        ],
        url: '',
        isdParam: false,
        dParam: '',
        inputparam: '',
        isBase64Encode: false,
        isBase64Decode: false,
        globalvar: [
          {
            key: '',
            value: ''
          }
        ],
        assertInfo: [
          {

            key: '',
            value: '',
            checkType: 'equal'

          }
        ],
        regex_checklist: [
          {
            key: '',
            value: ''
          }
        ],
        expectedcontent: '',
        selectedtag: [],
        isQueryMethod: false,
        queryMethod: ''
      },
      outparam: '',
      tags: [],
      ruleValidate: {
        url: [{ required: true, message: '接口地址 不能为空', trigger: 'blur' }]
      },
      treeRoot: {},
      defaultExpandedKeys: [],
      methodList: [],
      currentChoose: '',
      selectedRow: '',
      methodColumns: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '选择',
          key: 'id',
          width: 70,
          align: 'center',
          render: (h, params) => {
            // console.log('params >  :', params)
            let id = params.index
            let values = params.row
            // console.log('the id is : ', id)
            let flag = false
            if (this.currentChoose === id) {
              flag = true
            } else {
              flag = false
            }
            let self = this
            return h('div', [
              h('Radio', {
                props: {
                  value: flag
                },
                on: {
                  'on-change': () => {
                    self.currentChoose = id
                    console.log('id-------: ', self.currentChoose)
                    self.selectedRow = values
                    console.log(values.name)
                  }
                }
              })
            ])
          }
        },
        {
          title: '方法名称',
          key: 'name'
        },
        {
          title: '方法描述',
          key: 'desc'
        }
      ],
      methodsList: []
    }
  },
  created () {
  },
  methods: {
    loadNode (node, resolve) {
      queryTree({ id: node.data.id || 0 }).then(res => {
        if (res.data && res.data.data && res.data.data.length > 0) {
          res.data.data.forEach(val => {
            val.leaf = !val.dropInner
            val.editing = false
            val.editName = val.name
            val.color = false
          })
          resolve(res.data.data)
          if (node.level === 0) {
            this.defaultExpandedKeys = res.data.data.map(val => val.id)
          }
        } else {
          resolve([])
        }
      }).catch(e => {
        this.$Message.error('请求失败')
      })
    },
    toggleCollapsed () {
      this.$refs.splitPane.toggleLeftPaneCollapsed()
    },
    handleNodeClick (obj) {
      if (obj.leaf === true) {
        // 打印出来看哪个值对你有用
        let id = obj.id
        this.queryCase(id, this.formItem.env || 'sit')
      }
    },
    // 批量运行
    batchRun () {
      let batchid = []
      this.$refs.elTree.getCheckedNodes().forEach((val) => {
        //  val.color=true
        if (val.leaf === true) {
          batchid.push(val.id)
        }
      })
      console.log(batchid + '批量运行节点id')

      // 下拉环境枚举
      let envs = ['sit', 'pre', 'prd']
      let env
      this.$Modal.confirm({
        render: (h, params) => {
          return h('Select', {
            props: {
              placeholder: '请选择环境'
              // value: ['sit','pre','prd']
            },
            style: {
              width: '300px'
            },
            on: {
              // 选中下拉框选项
              'on-change': (val) => {
                env = val
              }
            }
          },
          envs.map((val) => {
            return h('Option', {
              props: { value: val }
            }, val)
          })
          )
        },
        // 点击确定按钮
        onOk: () => {
          // 调用批量运行接口   原：batchRunCases  新：batchRunByParameter
          batchRunByParameter({ caseids: batchid, env: env, user: this.$store.state.user.userName }).then(res => {
            this.$refs.elTree.getCheckedNodes().forEach((val) => {
              if (res.data.data.indexOf(val.id) !== -1) {
                val.color = true
              } else {
                val.color = false
              }
            })
            this.$Message.success(res.data.msg)
          })
        },
        onCancel: () => {
        }
      })
    },
    // 树节点勾选是自动展开
    checkChange () {
      let checkobj = this.$refs.elTree.getCheckedNodes()
      this.defaultExpandedKeys = []
      if (checkobj.length !== 0) {
        if (checkobj[0].dropInner) {
          console.log(checkobj[0])
          queryPid({ id: checkobj[0].id }).then(res => {
            if (res.data.success === true) {
              res.data.data.forEach((value) => {
                this.defaultExpandedKeys.push(value)
              })
              console.log(this.defaultExpandedKeys)
            }
          })
        }
      }
    },
    // 封装查询用例信息的方法（用的地方比较多）
    queryCase (id, env) {
      return queryCaseInfo({ treeid: id, env: env }).then(res => {
        console.log(res)
        // if (Object.keys(res.data).length !== 0) {
        if (res.data.success === true) {
          console.log('有返回信息')
          this.formItem.requestmethod = res.data.data.requestmethod
          this.formItem.url = res.data.data.url
          // 处理头信息
          if (res.data.data.header !== null) { this.formItem.header = JSON.parse(res.data.data.header) } else { this.formItem.header = [{ key: '', value: '' }] }
          // 处理校验值
          if (res.data.data.assertInfo !== null) { this.formItem.assertInfo = JSON.parse(res.data.data.assertInfo) } else { this.formItem.assertInfo = [{ key: '', value: '', checkType: 'equal' }] }
          // 处理全局字段信息
          if (res.data.data.globalvar !== null) { this.formItem.globalvar = JSON.parse(res.data.data.globalvar) } else { this.formItem.globalvar = [{ key: '', value: '' }] }
          this.formItem.env = res.data.data.env
          // dff： 把新加的dParm查询出来展示到界面
          if (res.data.data.dParam !== null && res.data.data.dParam !== '') {
            this.formItem.dParam = res.data.data.dParam
            this.formItem.isdParam = true
          } else {
            this.formItem.dParam = ''
            this.formItem.isdParam = false
          }
          // 20190722-dff： 把新加的requestType查询出来展示到界面
          this.formItem.requestType = res.data.data.requestType
          // 20191226-dff: 把新加的pepple的queryMethod查询出来并显示
          this.formItem.queryMethod = res.data.data.queryMethod
          // 20190727-dff：把入参是否base64编码标识查询出并展示到界面
          this.formItem.isBase64Encode = res.data.data.isBase64Encode
          this.formItem.inputparam = res.data.data.inputparam
          // if (res.data.data.inputparam != null) { this.formItem.inputparam = res.data.data.inputparam}
          // else{this.formItem.inputparam = res.data.data.inputparam}
          // 查询之后把之前的返回值清空
          this.outparam = ''
          this.formItem.isBase64Decode = res.data.data.isBase64Decode
          // 把treeid和name放到formItem中，供保存saveCase的时候使用
          this.formItem['treeid'] = res.data.data.treeid
          this.formItem['name'] = res.data.data.name
          this.formItem['id'] = res.data.data.id
          this.formItem['expectedcontent'] = res.data.data.expectedcontent
          this.formItem.selectedtag = res.data.data.selectedtag
          // 20190902dff 新增批量正则校验字段处理
          // console.log('before regex_checklist:', res.data.data.regex_checklist)
          if (res.data.data.regex_checklist !== null) {
            this.formItem.regex_checklist = JSON.parse(res.data.data.regex_checklist)
          } else {
            this.formItem.regex_checklist = [{ key: '', value: '' }]
          }
          // console.log('after regex_checklist:', this.formItem.regex_checklist)
          // if (res.data.data.selectedtag !== null && res.data.data.selectedtag.length !== 0) {
          //   this.formItem.selectedtag = res.data.data.selectedtag
          // }
          if (res.data.data.id === null) {
            this.formItem.assertInfo[0].checkType = 'equal'
            console.log('未查询到用例')
            // this.$Message.info(res.data.msg)
          }
        } else {
          this.$Message.error(res.data.msg)
        }
      })
    },
    // 切换环境是查询用例信息，重新渲染页面
    radioChange () {
      console.log('*******' + this.formItem.treeid + this.formItem.env)
      this.queryCase(this.formItem.treeid, this.formItem.env)
    },
    // 运行用例
    run (formItem) {
      this.$refs.formItem.validate(valid => {
        if (valid) {
          console.log(this.formItem)
          this.formItem.user = this.$store.state.user.userName
          runInterface(JSON.stringify(this.formItem)).then(res => {
            // 初如化base64解码为未选择状态
            // this.formItem.isBase64Decode = false
            this.outparam = JSON.stringify(res.data.data, null, 2)
            if (this.outparam.startsWith('"')) {
              // this.outparam = this.outparam.replace(/\"/g, '')
            }
            if (res.data.data !== '') {
              let assertflag, globalflag, recheckflag
              // 判断全局变量信息是否为空
              for (let x in this.formItem.globalvar) {
                if (this.formItem.globalvar[x].key !== '' && this.formItem.globalvar[x].value !== '') {
                  globalflag = true
                  break
                } else {
                  globalflag = false
                  // this.formItem.globalvar = []
                }
              }

              // 判断校验信息是否为空
              for (let x in this.formItem.assertInfo) {
                if (this.formItem.assertInfo[x].key !== '' && this.formItem.assertInfo[x].value !== '') {
                  assertflag = true
                  break
                } else {
                  assertflag = false
                  // this.formItem.assertInfo = []
                }
              }

              // 判断批量正则校验是否为空
              for (let x in this.formItem.regex_checklist) {
                if (this.formItem.regex_checklist[x].key !== '' && this.formItem.regex_checklist[x].value !== '') {
                  recheckflag = true
                  break
                } else {
                  recheckflag = false
                  // this.formItem.regex_checklist = []
                }
              }
              console.log('assert:', this.formItem.assertInfo, assertflag)
              console.log('global:', this.formItem.globalvar, globalflag)
              console.log('recheck:', this.formItem.regex_checklist, recheckflag)

              if (!globalflag && !assertflag && !recheckflag && (this.formItem.expectedcontent === '' || this.formItem.expectedcontent === null)) {
                this.$Message.success('运程成功，无校验信息')
              } else {
                check(JSON.stringify({ outparam: res.data.data, env: this.formItem.env, globalvar: this.formItem.globalvar, assertInfo: this.formItem.assertInfo, expectedcontent: this.formItem.expectedcontent, user: this.formItem.user, regex_checklist: this.formItem.regex_checklist })).then(res => {
                  if (res.data.success === true || res.data.success === 'true') {
                    this.$Message.success('运行成功并校验成功')
                  } else {
                    this.$Message.error({
                      content: res.data.msg,
                      duration: 6
                    })
                  }
                })
              }
            } else {
              this.$Message.error({
                content: '无返回值',
                duration: 4
              })
            }
            // if (res.data.data !== '') {
            //   // 判断校验信息是否都为空
            //   let assertflag, globalflag
            //   for (let x in this.formItem.globalvar) {
            //     if (this.formItem.globalvar[x].key !== '' && this.formItem.globalvar[x].value !== '') {
            //       globalflag = true
            //       break
            //     } else {
            //       globalflag = false
            //     }
            //   }
            //   // 如果全局变量globalvar的值都为空 即assertflag为false，则循环检查校验字段信息assertInfo是否都为空

            //   for (let x in this.formItem.assertInfo) {
            //     if (this.formItem.assertInfo[x].key !== '' && this.formItem.assertInfo[x].value !== '') {
            //       assertflag = true
            //       break
            //     } else {
            //       assertflag = false
            //     }
            //   }
            //   // 如果globalflag 和assertflag都为false
            //   console.log(assertflag, globalflag)

            //   if (!assertflag && !globalflag && (this.formItem.expectedcontent === null || this.formItem.expectedcontent === '')) {
            //     this.$Message.success('运行成功，无校验信息')
            //   } else if (!assertflag && globalflag) {
            //     // 全局不为空 且校验字段为空
            //     check(JSON.stringify({ outparam: res.data.data, env: this.formItem.env, globalvar: this.formItem.globalvar, assertInfo: [], expectedcontent: this.formItem.expectedcontent, user: this.formItem.user })).then(res => {
            //       if (res.data.success === true || res.data.success === 'true') {
            //         this.$Message.success('运行并校验成功')
            //       } else {
            //         this.$Message.error({
            //           content: res.data.msg,
            //           duration: 4
            //         })
            //       }
            //     })
            //   } else if (assertflag && !globalflag) {
            //     // 全局为空 且校验字段不为空
            //     check(JSON.stringify({ outparam: res.data.data, env: this.formItem.env, globalvar: [], assertInfo: this.formItem.assertInfo, expectedcontent: this.formItem.expectedcontent, user: this.formItem.user })).then(res => {
            //       if (res.data.success === true || res.data.success === 'true') {
            //         this.$Message.success('运行并校验成功')
            //       } else {
            //         this.$Message.error(res.data.msg)
            //       }
            //     })
            //   } else if (assertflag && globalflag) {
            //     // 全局 且校验字段均不为空
            //     check(JSON.stringify({ outparam: res.data.data, env: this.formItem.env, globalvar: this.formItem.globalvar, assertInfo: this.formItem.assertInfo, expectedcontent: this.formItem.expectedcontent, user: this.formItem.user })).then(res => {
            //       if (res.data.success === true || res.data.success === 'true') {
            //         this.$Message.success('运行并校验成功')
            //       } else {
            //         this.$Message.error({ content: res.data.msg, duration: 5 })
            //       }
            //     })
            //   } else {
            //     check(JSON.stringify({ outparam: res.data.data, env: this.formItem.env, globalvar: [], assertInfo: [], expectedcontent: this.formItem.expectedcontent, user: this.formItem.user })).then(res => {
            //       if (res.data.success === true || res.data.success === 'true') {
            //         this.$Message.success('运行并校验成功')
            //       } else {
            //         this.$Message.error({ content: res.data.msg, duration: 5 })
            //       }
            //     })
            //   }
            // } else {
            //   this.$Message.error('无返回值')
            // }
          })
        } else {
          this.$Message.error('必填信息为空')
        }
      })
    },
    // 保存用例
    save () {
      getTag().then(res => {
        this.tags = res.data
      })
      this.$Modal.confirm({
        render: (h, params) => {
          return h('Select', {
            props: {
              multiple: true,
              transfer: true,
              // 'label-in-value': true,
              filterable: true,
              placeholder: '请选择(支持搜索)',
              value: this.formItem.selectedtag
            },
            style: {
              width: '300px'
            },
            on: {
              // 选中下拉框选项
              'on-change': (val) => {
                console.log(val)
                // this.selectedtag = val
                this.formItem.selectedtag = val
              }
            }
          },
          this.tags.map((type) => {
            return h('Option', {
              props: { value: type.value }
            }, type.label)
          })
          )
        },
        // 点击确定按钮
        onOk: () => {
          saveCase(this.formItem).then(res => {
            if (res.data.success === 'true' || res.data.success === true) {
              // this.run(this.formItem)
              this.$Message.success({
                content: res.data.msg,
                duration: 5
              })
            } else {
              this.$Message.error({
                content: res.data.msg,
                duration: 5
              })
            }
          })
        },
        onCancel: () => {
          // this.formItem.selectedtag = []
        }
      })
    },

    // 新增输入框
    handleAdd (name) {
      if (name === 'header') {
        this.formItem.header.push({
          value: '',
          key: ''
        })
        console.log(this.formItem.header)
      } else if (name === 'globalvar') {
        this.formItem.globalvar.push({
          value: '',
          key: ''
        })
        console.log(this.formItem.globalvar)
      } else if (name === 'assertInfo') {
        this.formItem.assertInfo.push({
          value: '',
          key: '',
          checkType: 'equal'
        })
        console.log(this.formItem.assertInfo)
      } else if (name === 'regex_checklist') {
        this.formItem.regex_checklist.push({
          value: '',
          key: ''
        })
        console.log(this.formItem.regex_checklist)
      }
    },
    handleRemove (name, index) {
      // this.formItem.header[index].status = 0
      if (name === 'header') {
        console.log(index)

        this.formItem.header.splice(index, 1)
      } else if (name === 'globalvar') {
        this.formItem.globalvar.splice(index, 1)
      } else if (name === 'assertInfo') {
        this.formItem.assertInfo.splice(index, 1)
      } else if (name === 'regex_checklist') {
        this.formItem.regex_checklist.splice(index, 1)
      }
    },
    // 新增节点
    append (data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    // 移出节点
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },
    nodeDragStart () {
      this.treeRoot = cloneDeep(this.$refs.elTree.root)
    },
    nodeDrop (dragNode, dropNode, type) {
      let positionMap = {
        before: 0,
        inner: 1,
        after: 2
      }
      let params = {
        dragId: dragNode.data.id,
        dropId: dropNode.data.id,
        position: positionMap[type]
      }
      dragTree(params).then(res => {
        if (!res.data || !res.data.success === true) {
          this.$refs.elTree.root = this.treeRoot
          this.$Message.error('拖动失败')
        }
      }).catch(e => {
        this.$refs.elTree.root = this.treeRoot
        this.$Message.error('请求失败')
      })
    },
    allowDrop (dragNode, dropNode, type) {
      return type !== 'inner' || dropNode.data.dropInner
    },
    addNode (node, dropInner) {
      node.expand(() => {
        let newNodeData = {
          data: {
            dropInner,
            id: 'tmp',
            name: '',
            pId: node.data.id,
            treeOrder: null,
            leaf: !dropInner,
            editing: true,
            editName: '',
            color: false
          }
        }
        node.insertChild(newNodeData, undefined, true)
      })
    },
    editNode (data) {
      data.editing = true
    },
    confirmEdit (data) {
      if (data.id === 'tmp') {
        let params = {
          name: data.editName,
          pId: data.pId,
          dropInner: data.dropInner
        }
        addTree(params).then(res => {
          if (res.data && res.data.success === true) {
            data.name = data.editName
            data.editing = false
            data.id = res.data.data.id
            data.treeOrder = res.data.data.order
            // 树新增成功之后调用查询接口，渲染左边的录入页面
            if (!data.dropInner) {
              this.queryCase(data.id, 'sit')
            }
          } else {
            this.$Message.error('新增失败')
          }
        }).catch(e => {
          this.$Message.error('请求失败')
        })
      } else {
        let params = {
          id: data.id,
          name: data.editName
        }
        modifyTree(params).then(res => {
          if (res.data && res.data.success === true) {
            data.name = data.editName
            data.editing = false
          } else {
            this.$Message.error('编辑失败')
          }
        }).catch(e => {
          this.$Message.error('请求失败')
        })
      }
    },
    cancelEdit (node, data) {
      if (data.id === 'tmp') {
        node.remove()
      }
      data.editName = data.name
      data.editing = false
    },
    deleteNode (node, data) {
      let params = {
        id: data.id
      }
      this.$Modal.confirm({
        title: '提醒',
        content: '是否删除此节点？',
        onOk: () => {
          deleteTree(params).then(res => {
            if (res.data && res.data.success === true) {
              node.remove()
              this.$Message.success('删除成功')
            } else {
              this.$Message.error('删除失败')
            }
          }).catch(e => {
            this.$Message.error('请求失败')
          })
        },
        onCancel: () => {
          this.$Message.info('取消删除！')
        }
      })
    },
    base64decode () {
      console.log('出参：', this.outparam)
      if (this.formItem.isBase64Decode === true) {
        return base64Decode({ 'outparam': this.outparam }).then(res => {
          this.outparam = res.data.data
        })
      }
    },
    // 获取对应service的查询方法
    queryMethodList (formItem) {
      console.log('查询方法。。。。', this.formItem.url)
      if (this.formItem.isQueryMethod === true) {
        qeuryMethods({ 'serviceName': this.formItem.url }).then(res => {
          this.methodsList = res.data.data
        })
      }
    },
    // 点击查询方法界面中的确定按钮，则把选择的方法返回到主界面中
    reBackMethod (selectedRow) {
      console.log('当前选择查method 是 ： ', this.selectedRow)
      if (this.selectedRow !== '') {
        this.formItem.queryMethod = this.selectedRow.name
        this.formItem.isQueryMethod = false
        this.getPeppleParams(this.formItem)
      } else {
        this.$Message.error('请选择要使用的查询方法！')
      }
    },
    // 根据serviceName与queryMethod查询请求入参，方便自动带入到入参输入框
    getPeppleParams (formItem) {
      console.log('开始查询请求入参了。。。', this.formItem.queryMethod)
      queryPeppleParams({ 'serviceName': this.formItem.url, 'queryMethod': this.formItem.queryMethod }).then(res => {
        console.log('查询的入参结果为：  ', res.data)
        if (res.data.success === true) {
          this.formItem.inputparam = JSON.stringify(res.data.data, null, 2)
        } else {
          this.formItem.inputparam = ''
          this.$Message.error(res.data.msg)
        }
      })
    }
  }
}
</script>

<style lang="less">
.tree-pane-wrapper {
  height: 100%;
  .pane {
    height: 100%;
    overflow: auto;
    padding: 8px;
  }
  .left-pane {
    .left-pane-tree {
      background-color: #f5f7f9;
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        .iconfont {
          margin-left: 5px;
        }
      }
    }
    .tree-trigger-collapsed {
      position: absolute;
      bottom: 0;
      width: ~"calc(100% - 16px)";
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .custom-trigger {
    height: 100%;
    width: 6px;
    background: #f5f7f9;
    position: absolute;
    cursor: col-resize;
    .custom-line {
      height: 100%;
      width: 1px;
      background: #ccc;
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
}
.minputstyle {
  width: 35%;
  margin-right: 5px;
}
.minputstyle-check {
  width: 30%;
  margin-right: 5px;
  margin-left: 5px;
}

.buttonstyle {
  width: 80px;
  margin: 0px 10px 0px 0px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.active {
  color: #f56c6c;
}

.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: #d3d9f0;
}

// .el-tree-node:focus > .el-tree-node__content > .custom-tree-node > span {
//   background: #d1dfef;
// }
// .el-tree-node:focus > .el-tree-node__content {
//   background: #d1dfef;
// }
</style>
