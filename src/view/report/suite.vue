<template>
  <Collapse accordion
            v-if="data.name"
            v-model="data.value">
    <Panel :name="String(data.id)">
      <span class="label label_status_passed"
            style="margin:5px;">{{data.type}}</span>
      <span>{{data.name}}</span>
      <span class="node__stats">
        <span style="margin:10px;">{{data.runtime}}ms</span>
        <template v-if="data.type === 'suite'">
          <span class="label label_status_failed"
                style="margin:5px;"
                @click.stop="showAll('fail')">{{data.failNum}}</span>
          <span class="label label_status_passed"
                style="margin:5px;"
                @click.stop="showAll('success')">{{data.successNum}}</span>
        </template>
        <template v-else>
          <span class="el-icon-success"
                style="color:rgb(25, 190, 107);"
                v-if="data.result === 'success'"></span>
          <span class="el-icon-error"
                style="color:rgb(237, 63, 20);"
                v-else></span>
        </template>
      </span>
      <div slot="content">
        <template v-if="data.type==='suite'">
          <suite v-for="item in data.child"
                 :key="item.num"
                 :data="item"></suite>
        </template>
        <template v-else>
          <Collapse @on-change="show(data.num)">
            <Panel>
              <span>参数&校验</span>
              <p slot="content"
                 class="content">
                {{data.rest}}
                {{inparams}}
              </p>
              <p slot="content"
                 class="content"
                 v-html="outparams"></p>
              <p slot="content"
                 class="content">{{checkout}}</p>
            </Panel>
            <!-- <Panel>
              <span>出参</span>
              <p slot="content"
                 class="content"
                 v-html="data.outparams"></p>
            </Panel>
            <Panel>
              <span>检验</span>
              <p slot="content"
                 class="content">{{data.checkout}}</p>
            </Panel> -->
          </Collapse>
        </template>
      </div>
    </Panel>
  </Collapse>
</template>

<script>
import { queryParams } from '@/api/data'
export default {
  name: 'suite',
  data () {
    return {
      inparams: '',
      outparams: '',
      checkout: ''
    }
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    show (id) {
      console.log(id)
      queryParams({ id: id }).then(res => {
        this.inparams = res.data.data.inparams
        this.outparams = res.data.data.outparams
        this.checkout = res.data.data.checkout
      })
    },
    showAll (type) {
      if (['success', 'fail'].includes(type)) {
        this.showSuccessOrFail(this.data, type)
      }
    },
    showSuccessOrFail (data, type) {
      if (data[`${type}Num`] > 0) {
        data.value = String(data.id)
        if (data.child && data.child.length) {
          data.child.forEach(item => {
            this.showSuccessOrFail(item, type)
          })
        }
      } else {
        data.value = ''
      }
    }
  }
}
</script>

<style lang="less">
.node__stats {
  position: absolute;
  right: 0;
}
.label_status_failed {
  background: rgb(237, 63, 20);
}
.label_status_passed {
  background: rgb(25, 190, 107);
}
p.content {
  word-break: break-all;
  white-space: pre-line;
}
// p.constyle {
//   word-break: break-all;
//   white-space: pre-line, line;
//   font-size: 80;
//   font-weight: bold；;
// }
.ivu-collapse-content {
  padding: 0 5px;
  & > .ivu-collapse-content-box {
    padding: 5px 0;
  }
}
.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
  height: 25px;
  line-height: 25px;
}
</style>
