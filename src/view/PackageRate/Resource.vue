<template>
  <div id="app">
    <ul class ="resourceul">
      <li class ="resourceli" v-for="(tab,index) in tabs" v-bind:key ="tab" @click="toggle(index,tab.view)" :class="{active:active==index}">
        {{tab.type}}
      </li>
    </ul>
    <Divider type="horizontal " class="divider" />
    <!--:is实现多个组件实现同一个挂载点-->
    <component :is="currentView"></component>
  </div>
</template>

<script>
import tab1 from './index.vue'
import tab2 from './ForeignResource.vue'
export default {
  name: 'app',
  data () {
    return {
      active: 0,
      currentView: 'tab1',
      tabs: [
        {
          type: '国内资源预定趋势图',
          view: 'tab1'
        },
        {
          type: '境外资源预定趋势图',
          view: 'tab2'
        }
      ]
    }
  },
  methods: {
    toggle (i, v) {
      this.active = i
      this.currentView = v
    }
  },
  components: {
    tab1,
    tab2
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 0px;

}
.resourceul{
  width:400px;
  display:flex;
  margin-bottom: 0px;
}
.resourceli{
  width:200px;
  height:40px;
  background: rgb(248, 247, 247);
  display: inline-flex;
  /* display: inline-block; */
  border-right:1px solid #ddd;
  justify-content: center;
  align-items: center;
  cursor:pointer;
  font-size: 14px;
  border: 1px solid #D3D3D3;
}
.resourceli.active{
 background:#FFFFFF(248, 246, 246);
 color: #1E90FF;
 border: 1px solid #1E90FF;
}
.divider{
    margin-top: 0%;
    color: #D3D3D3;

}
</style>
