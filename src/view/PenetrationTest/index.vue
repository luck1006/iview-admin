<template>
  <Tabs value="page1">
    <TabPane label="文档和工具" name="page1">
      <Form :model="formLeft" label-position="left" :label-width="300">
        <Divider orientation="left" style="font-size: 24px;">官网Community版本下载</Divider>
        <a @click="toResource" style="font-size: 15px;">Burpsuit官网community各版本下载地址连接</a>
        <br><br/>
        <Divider orientation="left" style="font-size: 24px;">V1.7.37 Pro版本（windows版）</Divider>
        <a @click="towiki" style="font-size: 15px;">Burpsuit PRO V1.7.37版本下载地址</a>
        <!-- <FormItem label="BurpSuit_Pro V1.7.37 破解方式" style="padding-left: 16px; padding-right: 16px;">
          <Button icon="ios-download-outline" id="docdown" class="ivu-btn ivu-btn-primary" @click="docdown = true">破解方式下载</Button>
        </FormItem>
        <FormItem label="BurpSuit_Pro V1.7.37（破解版）工具下载" style="padding-left: 16px; padding-right: 16px;">
          <Button icon="ios-download-outline" id="tooldown" class="ivu-btn ivu-btn-primary" @click="tooldown = true">测试工具下载</Button>
        </FormItem> -->
        <Alert type="warning" show-icon>说明：Pro版可进行主动扫描，切勿在生产或灰度环境执行主动扫描，会造成服务器负担，甚至宕机</Alert>
        <!-- <Divider orientation="left" style="font-size: 24px;">文档指南</Divider>
        <FormItem label="BurpSuit实战指南下载" style="padding-left: 16px; padding-right: 16px;">
          <Button icon="ios-download-outline" id="pdfdown" class="ivu-btn ivu-btn-primary" @click="pdfdown = true">实战指南下载</Button>
        </FormItem> -->
        <Divider orientation="left" style="font-size: 24px;">安全培训</Divider>
        <a @click="linkwiki" style="font-size: 15px;">WIKI安全培训链接</a>
      </Form>
      <!-- <Modal v-model="docdown" draggable scrollable title="文件下载确认框" @on-ok="docdown_ok" @on-cancel="cancel">
        <div>是否确定下载破解文档</div>
      </Modal>
      <Modal v-model="pdfdown" draggable scrollable title="指南下载确认框" @on-ok="pdfdown_ok" @on-cancel="cancel">
        <div>是否确定下载BurpSuit实战指南</div>
      </Modal>
      <Modal v-model="tooldown" draggable scrollable title="工具下载确认框" @on-ok="tooldown_ok" @on-cancel="cancel">
        <div>是否确定下载BurpSuit工具</div>
      </Modal> -->
    </TabPane>
    <TabPane label="脚本及用例" name="page2">
      <label style="font-size: 34px;">暂未开发，敬请期待。。。</label>
    </TabPane>
  </Tabs>
</template>

<script>
// import { docfiledownload, pdffiledownload, zipfiledownload } from '@/api/data'
export default {
  data () {
    return {
      url: 'https://portswigger.net/burp/releasesarchive/community',
      wikiurl: 'https://wiki.tuniu.org/pages/viewpage.action?pageId=100251066',
      wikiurl1: 'https://wiki.tuniu.org/pages/viewpage.action?pageId=109431207'
      // docdown: false,
      // pdfdown: false,
      // tooldown: false
    }
  },
  methods: {
    toResource () {
      window.open(this.url)
      // 直接加载
      // window.location.href = this.url
    },
    linkwiki () {
      window.open(this.wikiurl)
    },
    towiki () {
      window.open(this.wikiurl1)
    }
    // docdown_ok () {
    //   this.$Loading.start()
    //   docfiledownload().then(res => {
    //     let blob = new Blob([res.data], { type: res.type })
    //     let downloadElement = document.createElement('a')
    //     let href = window.URL.createObjectURL(blob)
    //     downloadElement.href = href
    //     downloadElement.download = 'BurpSuit破解方式.docx'
    //     document.body.appendChild(downloadElement)
    //     downloadElement.click()
    //     document.body.removeChild(downloadElement)
    //     window.URL.revokeObjectURL(href)
    //   }).catch(function (error) {
    //     console.log(error)
    //     this.$Loading.error()
    //   })
    //   this.$Loading.finish()
    // },
    // pdfdown_ok () {
    //   this.$Loading.start()
    //   pdffiledownload().then(res => {
    //     let blob = new Blob([res.data], { type: res.type })
    //     let downloadElement = document.createElement('a')
    //     let href = window.URL.createObjectURL(blob)
    //     downloadElement.href = href
    //     downloadElement.download = 'burpsuite实战指南.pdf'
    //     document.body.appendChild(downloadElement)
    //     downloadElement.click()
    //     document.body.removeChild(downloadElement)
    //     window.URL.revokeObjectURL(href)
    //   }).catch(function (error) {
    //     console.log(error)
    //     this.$Loading.error()
    //   })
    //   this.$Loading.finish()
    // },
    // tooldown_ok () {
    //   this.$Loading.start()
    //   zipfiledownload().then(res => {
    //     let blob = new Blob([res.data], { type: res.type })
    //     let downloadElement = document.createElement('a')
    //     let href = window.URL.createObjectURL(blob)
    //     downloadElement.href = href
    //     downloadElement.download = 'Burp_Suite_Pro_v1.7.37.zip'
    //     document.body.appendChild(downloadElement)
    //     downloadElement.click()
    //     document.body.removeChild(downloadElement)
    //     window.URL.revokeObjectURL(href)
    //   }).catch(function (error) {
    //     console.log(error)
    //     this.$Loading.error()
    //   })
    //   this.$Loading.finish()
    // }
  }
}
</script>
