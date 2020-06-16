<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from '_c/charts/theme.json'
import router from '@/router'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'simpleChart',
  props: {
    option: Object
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    isValidOption (option) {
      return this.isObject(option) && !this.isEmptyObject(option) &&
        this.hasSeriesKey(option) &&
        this.isSeriesArray(option) && !this.isSeriesEmpty(option)
    },

    isObject (option) {
      return Object.prototype.isPrototypeOf(option)
    },

    isEmptyObject (option) {
      return Object.keys(option).length === 0
    },

    hasSeriesKey (option) {
      return !!option['series']
    },

    isSeriesArray (option) {
      return Array.isArray(option['series'])
    },

    isSeriesEmpty (option) {
      return option['series'].length === 0
    },
    checkAndSetOption () {
      let option = this.option // 配置等于父组件传过来的数据
      if (this.isValidOption(option)) {
        this.dom.setOption(option) // 渲染出来
        this.dom.hideLoading() // 隐藏加载动画
      } else {
        this.dom.showLoading({ text: '图表数据正在努力加载...' }) // 加载动画
      }
    }
  },
  mounted () {
    this.dom = echarts.init(this.$refs.dom, 'tdTheme')
    this.dom.showLoading()
    this.checkAndSetOption()
    // this.dom.setOption(this.option)
    // this.dom.hideLoading()
    this.dom.on('click', (params) => {
      // console.log(params.seriesType)
      if (params.seriesType === 'radar') {
        let teamName = params.seriesName
        let dataQ = params.name
        router.push({ name: 'ammInfo', params: { team: teamName, dataQ: dataQ } })
      }
    })
  },
  watch: {
    option: {
      handler (val) {
        // this.dom.setOption(this.option)
        this.checkAndSetOption()

        //  option(option){
        //     this.checkAndSetOption()
        // }
      },
      deep: true
    }
  }
}
</script>
