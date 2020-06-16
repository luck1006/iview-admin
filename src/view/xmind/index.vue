
  <template>
  <!-- <div style="margin-bottom: 6px;width:200px"> -->

  <div id="jsmind_container"
       ref="jsmindContainer"
       @click="clickJsMind">

    <div>
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
    </div>
    <Row>
      <!-- <iCol span="4">
        <div style="margin-top: 8px;margin-left:4px;width:200px">
          <Select v-model="topic" @on-change="selecttopic(topic)">
            <Option v-for="topicitem in topiclist" :value="topicitem" :key="topicitem">
              {{ topicitem }}
            </Option>
          </Select>
        </div>
      </iCol> -->
      <iCol span="12">
        <div style="margin-top: 8px;margin-left:8px;width:400px">
          <Select :label-in-value="true"
                  v-model="epic"
                  filterable
                  @on-change="getInfo">

            <Option v-for="item in epicList"
                    :value='item.value+","+
                +item.issuenum+","+item.project_key+ "," + item.reporter+ "," + item.cnt'
                    :key="item.value">({{item.status}}){{ item.label }}</Option>
          </Select>
        </div>

      </iCol>
      <iCol span="2">
        <div style="margin-top: 10px;width:200px">
          <Button icon="ios-download-outline"
                  type="primary"
                  shape="circle"
                  @click="screen_shot"> Download </Button>
        </div>

      </iCol>

      <iCol span="4">
        <div style="margin-top: 16px;margin-left:8px;width:250px">
          <!-- <CellGroup> -->
          <!-- <Cell title="报告人:" -->
          <!-- :extra='this.arr[3]' /> -->

          <!-- <Cell title="总计storypoint:"
                  extra="100" /> -->
          <!-- <Cell title="累计投入工时（人/日）:"
                  extra="30" /> -->
          <!-- </CellGroup> -->
        </div>
      </iCol>
      <iCol span="4">
        <div style="margin-top: 16px;margin-left:8px;width:250px">
          <!-- <CellGroup> -->

          <!-- <Cell title="总计需求个数:" -->
          <!-- :extra='this.arr[4]' /> -->
          <!-- <Cell title="总计storypoint:"
                  extra="100" /> -->
          <!-- <Cell title="累计投入工时（人/日）:"
                  extra="30" /> -->
          <!-- </CellGroup> -->
        </div>
      </iCol>
    </Row>

    <!-- <div id="jsmind_container"></div> -->
  </div>

</template>
<script>

import JsMind from 'jsmind'
import 'jsmind/js/jsmind.screenshot.js'

import 'jsmind/style/jsmind.css'
import { getXmind, getEpic } from '@/api/data'
import Loading from '@/components/loading'
// import Loading from '@/components/loading'

// import screenshot from 'jsmind.screenshot'

export default {
  data () {
    return {
      isLoading: true,
      mindData: [],
      epicList: [],
      // epicList0: [],
      // epicList1: [],
      // epicList2: [],
      dataList: [],
      epic: '',
      arr: [],
      // topiclist: [],
      topic: ''
      // jm: null
      // id: '',
      // issuenum: '',
      // project_key: ''

      // name: '830399'
    }
  },
  components: {
    Loading
  },
  methods: {
    clickJsMind (e) {
      if (e.target.tagName === 'JMNODE') {
        let selectedNode = JsMind.current.get_selected_node()
        // console.log(selectedNode.data)
        if (selectedNode.data.url !== '') {
          window.open(selectedNode.data.url)
        }
        // window.open('https://jira.tuniu.org/browse/MALL-5174')
      }
    },
    // selecttopic (topic) {
    //   this.topic = topic
    //   if (this.topic === this.topiclist[0]) {
    //     this.epicList = this.epicList0
    //     console.log(this.epicList)
    //     console.log(0)
    //   } else if (this.topic === this.topiclist[1]) {
    //     this.epicList = this.epicList1
    //     console.log(this.epicList)
    //     console.log(1)
    //   } else {
    //     this.epicList = this.epicList2
    //     console.log(this.epicList)
    //     console.log(2)
    //   }
    //   let params = {
    //     value: this.epicList[0].value + ',' + this.epicList[0].issuenum + ',' + this.epicList[0].project_key + ',' + this.epicList[0].reporter + ',' + this.epicList[0].cnt,
    //     label: this.epicList[0].label
    //     // issuenum: this.epicList[0].issuenum,
    //     // project_key: this.epicList[0].project_key
    //   }
    //   this.epic = this.epicList[0].value + ',' + this.epicList[0].issuenum + ',' + this.epicList[0].project_key + ',' + this.epicList[0].reporter + ',' + this.epicList[0].cnt
    //   console.log(this.epic)
    //   this.isLoading = false
    //   this.getInfo(params)
    // },
    getInfo (e) {
      // console.log(e)
      this.isLoading = true
      this.arr = e.value.split(',')
      // console.log(this.arr)
      let params = {
        epic: e.label,
        id: this.arr[0],
        issuenum: this.arr[1],
        project_key: this.arr[2]
      }
      // console.log(params)
      getXmind(params).then((response) => {
        let res = response.data
        this.mindData = res.data
        // console.log(this.mindData)
        if (res.success === 'true') {
          this.load_jsmind()
          this.isLoading = true
          // this.$Message.success('xmind 加载成功～～')
        } else {
          // this.$Message.error('xmind 加载成功～～')
        }
        this.isLoading = false
      })
    },
    screen_shot () {
      JsMind.current.screenshot.shootDownload()
      // this.jm.screenshot.shootDownload()
    },

    load_jsmind () {
      let mind = {
        'meta': {
          'name': 'xmind',
          'author': 'zhuhaiyan',
          'version': '0.1'
        },
        'format': 'node_array',
        'data': this.mindData

      }

      let options = {
        container: 'jsmind_container',
        editable: false,
        theme: 'primary'
      }
      let jsmindContainer = this.$refs.jsmindContainer
      let jsmindInner = jsmindContainer.getElementsByClassName('jsmind-inner')
      if (jsmindInner && jsmindInner.length) {
        jsmindContainer.removeChild(jsmindInner[0])
      }
      let jm = new JsMind(options)

      jm.show(mind)

      // jsMind.current
      // var jm = jsMind.show(options, mind)
      // jm.set_readonly(true)
      // var mind_data = jm.get_data()
      // alert(mind_data)
      // jm.add_node('sub2', 'sub23', 'new node', { 'background-color': 'red' })
      // jm.set_node_color('sub21', 'green', '#ccc')
    }
  },
  mounted () {
    getEpic().then(res => {
      if (res.data && res.data.data && res.data.data.length > 0) {
        // this.topiclist = res.data.topiclist
        this.epicList = res.data.data
        // this.dataList = res.data.data
        // for (var i = 0; i < this.dataList.length; i++) {
        //   if (this.dataList[i].teamtopic === this.topiclist[0]) {
        //     this.epicList0.push(this.dataList[i])
        //   } else if (this.dataList[i].teamtopic === this.topiclist[1]) {
        //     this.epicList1.push(this.dataList[i])
        //   } else {
        //     this.epicList2.push(this.dataList[i])
        //   }
        // }
        // 设置默认值
        // this.topic = this.topiclist[0]
        // if (this.topic === this.topiclist[0]) {
        //   this.epicList = this.epicList0
        // }
        // console.log(this.epicList)
        let params = {
          value: this.epicList[0].value + ',' + this.epicList[0].issuenum + ',' + this.epicList[0].project_key + ',' + this.epicList[0].reporter + ',' + this.epicList[0].cnt,
          label: this.epicList[0].label
          // issuenum: this.epicList[0].issuenum,
          // project_key: this.epicList[0].project_key
        }
        this.epic = this.epicList[0].value + ',' + this.epicList[0].issuenum + ',' + this.epicList[0].project_key + ',' + this.epicList[0].reporter + ',' + this.epicList[0].cnt
        console.log(this.epic)
        this.isLoading = false
        this.getInfo(params)
      }
    })
  }
}

</script>
<style>
#jsmind_container {
  width: 100%;
  height: 100%;
  border: solid 1px #ccc;
  /*background:#f4f4f4;*/
  background: #f4f4f4;
}
jmnode {
  max-width: 1200px;
}
</style>
