<template>
  <div>
    <div>
      <transition name="fade">
        <loading v-if="isLoading"></loading>
      </transition>
    </div>
    <div style="margin-bottom: 6px;width:200px">
      <!-- <Select v-model="name"
              @on-change="querySprint()"> -->
      <Select v-model="name"
              @on-change="querySprint()">

        <Option v-for="item in sprintList"
                :value="item.typeId"
                :key="item.typeId">{{ item.typeName }}</Option>
      </Select>
    </div>
    <div>
      <Table border
             :columns="columns5"
             :data="data5"></Table>
    </div>
  </div>
</template>
<script>
import { wyVideo, getSprint } from '@/api/data'
import Loading from '@/components/loading'
export default {
  data () {
    return {
      isLoading: true,
      name: '',
      sprintList: [],
      columns5: [
        {
          title: '名称',
          // width: 400,
          key: 'name',
          // align: 'center',
          sortable: true,
          render: (h, params) => {
            // console.log(params)
            return h('a',
              {
                domProps: {
                  target: '_blank',
                  href: params.row.address,
                  innerText: params.row.name
                }
              }
            )
          }
        },
        {
          title: '时长',
          key: 'duration',
          align: 'center',
          width: '250'
        },
        {
          title: '上传时间',
          key: 'uploadTime',
          align: 'center',
          width: '250'
        }
      ],
      data5: []
    }
  },
  components: {
    Loading
  },
  mounted () {
    // wyVideo(this.$route.data).then(res => {
    //   if (res.data) {
    //     console.log(res.data)
    //     this.handleData(res.data)
    //   }
    // })

    getSprint(this.$route.data).then(res => {
      if (res.data && res.data.data) {
        this.sprintList = res.data.data
        this.name = res.data.data[0].typeId
        this.querySprint()
      }
    })
    // console.log(res.data.data)
    // this.name = this.printList.typeId
    this.isLoading = false
  },
  methods: {
    fun () { },
    querySprint () {
      let para = {
        'currentPage': 1,
        'pageSize': 100,
        'status': 0,
        'type': this.name
      }
      wyVideo(para).then((response) => {
        let res = response.data
        if (res.code === 200) {
          this.handleData(res)
        } else {
          this.$Message.error('查询数据失败～～～')
        }
      })
    },
    // 时间戳转化为时间格式
    formatDate (value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
    // 秒转成时分秒
    secondToDate (result) {
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
      return h + ':' + m + ':' + s
    },
    handleData (dataList) {
      this.data5.splice(0)
      this.videoData = dataList.ret.list
      this.isLoading = false
      this.videoData.forEach(data => {
        let addr
        if (data.shdMp4Url === undefined) {
          addr = data.origUrl
        } else {
          addr = data.shdMp4Url
        }
        this.data5.push({ name: data.videoName, address: addr, duration: this.secondToDate(data.duration), uploadTime: this.formatDate(data.createTime) })
      })
    }

  }
}
</script>
