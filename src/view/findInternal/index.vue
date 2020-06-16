
<template>
  <div>
    <i-form ref="formitem" :model="formItem" :rules="ruleValidate" :label-width="100" class="formitem" inline>
      <Row class="row1">
        <Col span="14" style="width: 70%">
          <Form-item label="接口地址：" prop="url"  style="width: 100%" >
            <i-input
              v-model="formItem.url"
              placeholder="请输入接口地址"
              size="large"
              style="width: 85%"
            >
            </i-input>
          </Form-item>
        </Col>
        <!-- <Col span="2">
          <Form-item prop="requestmethod">
            <i-select
              v-model="formItem.requestmethod"
              placeholder="get/post"
              style="width: 100%"
              size="large"
            >
              <i-option value="get">get</i-option>
              <i-option value="post">post</i-option>
            </i-select>
          </Form-item>
        </Col> -->
        <Col span="2" style="width: 12%">
          <Form-item prop="env" class = "selectformitem">
            <i-select
              v-model="formItem.env"
              placeholder="pre/prd/sit"
              style="width: 100%"
              size="large"
            >
              <i-option value="pre">pre</i-option>
              <i-option value="prd">prd</i-option>
              <i-option value="sit">sit</i-option>
            </i-select>
          </Form-item>
        </Col>
        <Col span="4" style="width: 16%">
          <Form-item>
            <i-button type="primary" @click="run('formitem')">运行</i-button>
            <i-button type="primary" @click="handleReset('formitem')" style="margin-left: 5px">重置</i-button>
          </Form-item>
        </Col>
      </Row>
         <Row>
         <Col span="14" style="width: 98%">
          <Form-item label="Post 参数：" prop="postparams" style="width: 98%">
            <i-input v-model="formItem.postparams" type="textarea" :autosize="true" placeholder="请贴入json格式的post请求参数" size="large" style="width: 90%"></i-input>
          </Form-item>
        </Col>
      </Row>
    </i-form>

    <div>
      <Split v-model="split1"  >
        <div slot="left" class="demo-split-pane">
          <h2>Pebble Dependents</h2>
          <Collapse v-model="value1" v-for ="(pebble) in pebbleinterface" v-bind:key ="pebble">
               <Panel>
              <span > {{pebble.pebbleName}}</span>

              <Button class = "button1" type="primary" size = small @click="openmodal( pebble.request)" ghost> 查看参数 </Button>
              <!-- </span> -->
              <!-- <p slot="content" v-text= pebble.response></p> -->
              <p slot="content" class="block">
                <vuejsonpretty
                  v-if="renderOK"
                  :data=pebble.response
                  :path="path"
                  :deep="deep"
                  :show-double-quotes="showDoubleQuotes"
                  :highlight-mouseover-node="highlightMouseoverNode"
                  :highlight-selected-node="highlightSelectedNode"
                  :show-length="showLength"
                  :show-line="showLine"
                  :select-on-click-node="selectOnClickNode"
                  v-model="value"
                  :path-selectable="((path, data) => typeof data !== 'number')"
                  :selectable-type="selectableType"
                  :show-select-controller="showSelectController"
                  @click="handleClick(...arguments, 'complexTree')"
                  @change="handleChange">
                </vuejsonpretty>
              </p>
    <!-- <a style="position: fixed; right: 0; top: 0;" href="https://github.com/leezng/el-form-renderer" target="_blank"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/652c5b9acfaddf3a9c326fa6bde407b87f7be0f4/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6f72616e67655f6666373630302e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png"></a> -->
              <!-- <p slot="content" >{{pebble.response}}</p> -->
              <!-- <p><i-input  type="textarea" :autosize="true"  size="large" :value = JSON.stringify(pebble.response)> </i-input></P> -->
            </Panel>
          </Collapse>
        </div>
        <div slot="right" class="demo-split-pane">
          <h2>Tsp Dependents</h2>
           <Collapse v-model="value1" v-for ="(tsp) in tspinterface" v-bind:key ="tsp">
               <Panel>
              <span > {{tsp.tspName}}
                <Button class="button2" type="primary" size = small  @click="openmodal( tsp.request )" ghost> 查看参数 </Button>
              </span>
              <!-- <p slot="content">{{tsp.response}}</p> -->
               <p slot="content" class="block">
                <vuejsonpretty
                  v-if="renderOK"
                  :data=tsp.response
                  :path="path"
                  :deep="deep"
                  :show-double-quotes="showDoubleQuotes"
                  :highlight-mouseover-node="highlightMouseoverNode"
                  :highlight-selected-node="highlightSelectedNode"
                  :show-length="showLength"
                  :show-line="showLine"
                  :select-on-click-node="selectOnClickNode"
                  v-model="value"
                  :path-selectable="((path, data) => typeof data !== 'number')"
                  :selectable-type="selectableType"
                  :show-select-controller="showSelectController"
                  @click="handleClick(...arguments, 'complexTree')"
                  @change="handleChange">
                </vuejsonpretty>
              </p>
            </Panel>
          </Collapse>
        </div>
      </Split>
    </div>
  </div>
</template>

<script>
// import { FindPebble, FindTsp } from '@/api/data'
import { FindPebble } from '@/api/data'
import vuejsonpretty from './../../components/JsonTree/components/app'
export default {
  name: 'app',
  components: {
    vuejsonpretty
  },
  data () {
    return {
      renderOK: true,
      val: '',
      data: '',
      value: 'res.error',
      selectableType: 'single',
      showSelectController: true,
      showLength: false,
      showLine: true,
      showDoubleQuotes: true,
      highlightMouseoverNode: true,
      highlightSelectedNode: true,
      selectOnClickNode: true,
      path: 'res',
      deep: 5,
      itemData: {},
      itemPath: '',
      split1: 0.5,
      modal1: false,
      formItem: {
        url: '',
        // requestmethod: "",
        env: '',
        postparams: ''

      },
      pebbleinterface: {},
      tspinterface: {},

      ruleValidate: {
        url: [
          { required: true, message: 'Please enter the url ', trigger: 'blur' }
        ],
        requestmethod: [
          {
            required: true,
            message: 'Please choose request method get or post',
            trigger: 'blur'
          }
        ],
        env: [
          {
            required: true,
            message: 'Please choose test environment sit/pre/prd',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.val = JSON.stringify(this.data)
  },

  // computed: {
  //   json () {
  //     try {
  //       this.cache = JSON.parse(this.val)
  //       return this.cache
  //     } catch (err) {
  //       return this.cache || this.data
  //     }
  //   }
  // },
  methods: {
    run (url) {
      this.$refs.formitem.validate(valid => {
        if (valid) {
          console.log(this.formItem)
          FindPebble({ url: this.formItem.url, env: this.formItem.env, postparams: this.formItem.postparams }).then(res => {
            if (res.data.success === true || res.data.success === 'true') {
              // 写死第一个pebble的出入参和名称
              this.tspinterface = res.data.tsp
              this.pebbleinterface = res.data.pebble
              this.$Message.success(res)
            } else {
              this.$Message.error({
                content: '查询缓存失败或者方法执行失败，没有返回内部接口',
                duration: 3
              })
            }
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (url) {
      this.$refs[url].resetFields()
    },
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$Message.info('Clicked cancel')
    },
    openmodal (request) {
      // this.FindPebble()
      const content = request
      // this.$Modal.confirm({
      //   title: '查看请求参数',
      //   cancelText: '取消',
      //   okText: '复制参数',
      //   content: content,
      //   width: 850,
      //   scrollable: true
      // })
      this.$Modal.confirm({
        render: (h, params) => {
          return h(vuejsonpretty, {
            class: ' ivu-moadl-content ',
            props: {
              data: content,
              value: 'res.error',
              selectableType: '',
              showSelectController: false,
              showLength: false,
              showLine: false,
              showDoubleQuotes: true,
              highlightMouseoverNode: false,
              highlightSelectedNode: false,
              selectOnClickNode: false,
              deep: 4
            },
            on: {}
          }
          )
        }
      })
    },
    // openJsonTree (request)
    // {
    //   this.vuejsonpretty({
    //      v-if:"renderOK",
    //      data : request,
    //      path:'path',
    //      deep:"deep",
    //      show-double-quotes:"showDoubleQuotes",
    //      highlight-mouseover-node:"highlightMouseoverNode",
    //      highlight-selected-node:"highlightSelectedNode",
    //      show-length:"showLength",
    //      show-line:"showLine",
    //      select-on-click-node:"selectOnClickNode",
    //      v-model:"value",
    //      path-selectable:"((path, data) => typeof data !== 'number')",
    //      selectable-type:"selectableType",
    //      show-select-controller:"showSelectController",
    //      @click="handleClick(...arguments, 'complexTree')",
    //      @change="handleChange"

    //   })
    // }

    handleClick (path, data, treeName = '') {
      console.log('click: ', path, data, treeName)
      this.itemPath = path
      this.itemData = !data ? data + '' : data // 处理 data = null 的情况
    },
    handleChange (newVal, oldVal) {
      console.log('newVal: ', newVal, ' oldVal: ', oldVal)
    }

  }
}
</script>
<style lang="less">
@import './../../components/JsonTree/assets/less/index.less';
@import './../../components/JsonTree/assets/less/tree.less';
 .ivu-form-item-content{
   margin-left: 20px !important
 }
   .formitem{
  margin-left: 20px;
  }
.ivu-modal-content{
  width: 600px;
}
.split1{
        height: 800px;
        border: 100px solid #dcdee2;
    }
    .demo-split-pane{
        padding: 10px;
    }
  .button1{
  border: 1px solid #dcdee2;
  margin-left: 30px;
  }
  .button2{
    border: 1px solid #dcdee2;
    margin-right: 0px;
  }
  html, body {
    margin: 0;
    background-color: #f9f9f9;
  }
  .findInternal {
    position: relative;
    padding: 0 15px;
    margin: 0 auto;
    width: 1200px;
  }
  .findInternal-box {
    margin: 0 -15px;
    overflow: hidden;
    h3 {
      display: inline-block;
    }
    .title {
      text-align: center;
    }
    .block {
      float: left;
      padding: 0 15px;
      width: 50%;
      box-sizing: border-box;
    }
    input,
    select,
    textarea {
      padding: 3px 8px;
      box-sizing: border-box;
      border-radius: 5px;
      border: 1px solid #bbb;
      font-family: inherit;
      &:focus {
        outline: none;
        border-color: #1d8ce0;
        box-shadow: 0 0 3px #1d8ce0;
      }
    }
    textarea {
      width: 100%;
      height: 150px;
      resize: vertical;
    }
    pre {
      margin: 0;
      font-family: Consolas;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .options {
      font-size: 14px;
    }
  }
</style>
