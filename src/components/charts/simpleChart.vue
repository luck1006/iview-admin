<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from '_c/charts/theme.json'
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
      this.dom && this.dom.resize()
    },
    pieclick (fn) {
      this.$nextTick(() => {
        this.dom.on('click', function (param) {
          fn(param)
        })
      })
    }
  },
  mounted () {
    // let router = this.$router
    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      // this.dom.on('click', function (param) {
      // router.push({ path: '/supportmodule' })
      // router.push({ path: '/supportmodule' })
      // })
      this.dom.setOption(this.option)
    })
  },
  watch: {
    option: {
      handler (val) {
        this.dom.setOption(val)
      },
      deep: true
    }
  }
}
</script>
