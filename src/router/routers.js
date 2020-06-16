import Main from '@/components/main'
// import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
},
{
  path: '/',
  name: '_home',
  redirect: '/home',
  component: Main,
  meta: {
    hideInMenu: true,
    notCache: true
  },
  children: [{
    path: '/home',
    name: 'home',
    meta: {
      hideInMenu: true,
      title: '首页',
      notCache: true,
      icon: 'md-home'
    },
    component: () => import('@/view/single-page/home')
  }]
},
{
  path: '/automation',
  name: 'automation',
  component: Main,
  meta: {
    hideInBread: true,
    title: '自动化',
    icon: 'md-aperture'
  },
  children: [{
    path: 'inerface',
    name: 'inerface',
    meta: {
      // icon: 'md-aperture',
      title: '接口自动化'
    },
    component: () => import('@/view/tree')
  },
  {
    path: 'globalparamslist',
    name: 'globalparamslist',
    meta: {
      // icon: 'md-aperture',
      title: '全局变量列表'
    },
    component: () => import('@/view/globalparams/globalparams-list')
  },
  {
    path: 'reportlist',
    name: 'reportlist',
    meta: {
      title: '自动化报告列表'
    },
    component: () => import('@/view/report/reportlist.vue')
  }
  ]
},
{
  path: '/automation/report/:id',
  name: 'report',
  meta: {
    hideInMenu: true,
    title: '自动化报告'
    // breadcrumb: false
  },
  component: () => import('@/view/report')
},
{
  path: '/chart',
  name: 'chart',
  component: Main,
  meta: {
    hideInBread: true,
    notCache: true
  },
  children: [{
    path: '',
    name: 'chart',
    meta: {
      icon: 'ios-stats',
      title: 'Scrum数据度量'
    },
    component: () => import('@/view/chart')
  }]
},
{
  path: '/amminfo',
  name: 'amminfo',
  component: Main,
  meta: {
    hideInBread: true
  },
  children: [{
    path: '/amminfo',
    name: 'ammInfo',
    meta: {
      icon: 'md-paper',
      title: '敏捷成熟度模型'
    },
    component: () => import('@/view/amm')
  }]
},
{
  path: '/support1',
  name: 'support1',
  component: Main,
  meta: {
    hideInBread: true,
    title: '度假技术支持',
    icon: 'md-person'
  },
  children: [{
    path: '/support',
    name: 'support',
    meta: {
      // icon: 'md-person',
      title: '度假技术支持统计'
    },
    component: () => import('@/view/support')
  },
  {
    path: '/supportexport',
    name: 'supportexport',
    meta: {
      // icon: 'md-person',
      title: '技术支持导出'
    },
    component: () => import('@/view/supportexport')
  }
  ]
},
{
  path: '/supportmodule',
  name: 'supportmodule',
  component: Main,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: '/supportmodule',
    name: 'supportmodule',
    meta: {
      icon: 'md-person',
      title: '技术支持分析'
    },
    component: () => import('@/view/supportmodule')
  }]
},
{
  path: '/wyVideo',
  name: 'wyVideo',
  component: Main,
  meta: {
    hideInBread: true
  },
  children: [{
    path: '/wyvideo',
    name: 'wyvideo',
    meta: {
      icon: 'md-radio',
      title: 'Scrum演示视频'
    },
    component: () => import('@/view/wyvideo')
  }]
},
  // {
  //   path: '/timeworking',
  //   name: 'timeworking',
  //   component: Main,
  //   meta: {
  //     hideInBread: true
  //   },
  //   children: [{
  //     path: '',
  //     name: 'timeworking',
  //     meta: {
  //       icon: 'md-cog',
  //       title: '资本化工时'
  //     },
  //     component: () => import('@/view/timeworking')
  //   }]
  // },
{
  path: '/orderLoginReport',
  name: 'orderLoginReport',
  component: Main,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: '',
    name: 'orderLoginReport',
    meta: {
      icon: 'md-analytics',
      title: '下单&登录数据报表'
    },
    component: () => import('@/view/orderLoginReport')
  }]
},

{
  path: '/message',
  name: 'message',
  component: Main,
  meta: {
    hideInBread: true,
    hideInMenu: true
  },
  children: [{
    path: '/message',
    name: 'message',
    meta: {
      icon: 'md-notifications',
      title: '消息中心'
    },
    component: () => import('@/view/single-page/message/index.vue')
  }]
},
{
  path: '/401',
  name: 'error_401',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/401.vue')
},
{
  path: '/500',
  name: 'error_500',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/500.vue')
},
{
  path: '*',
  name: 'error_404',
  meta: {
    hideInMenu: true
  },
  component: () => import('@/view/error-page/404.vue')
},
{
  path: '/getXmind',
  name: 'getXmind',
  component: Main,
  meta: {
    hideInBread: true
  },
  children: [{
    path: '',
    name: 'getXmind',
    meta: {
      icon: 'md-git-merge />',
      title: '需求脑图'
    },
    component: () => import('@/view/xmind')
  }]
},

  // {
  //   path: '/getXmind',
  //   name: 'getXmind',
  //   meta: {
  //     hideInMenu: true,
  //     title: '需求脑图'
  //     // breadcrumb: false
  //   },
  //   component: () => import('@/view/xmind')
  // },

{
  path: '/PenetrationTest',
  name: 'PenetrationTest',
  component: Main,
  meta: {
    hideInBread: false,
    notCache: true,
    hideInMenu: true
  },
  children: [{
    path: '',
    name: 'PenetrationTest',
    meta: {
      icon: 'md-document />',
      title: '渗透测试'
    },
    component: () => import('@/view/PenetrationTest')
  }]
},

{
  path: '/reqinfo',
  name: 'reqinfo',
  component: Main,
  meta: {
    hideInBread: false,
    notCache: true,
    hideInMenu: true
  },
  children: [{
    path: '',
    name: '_reqinfo',
    meta: {
      icon: 'md-document />',
      title: 'Scrum迭代过程'
    },
    component: () => import('@/view/reqinfo')
  }]
},

{
  path: '/findInternal',
  name: 'findInternal',
  component: Main,
  meta: {
    hideInBread: false,
    notCache: true,
    hideInMenu: true
  },
  children: [{
    path: '',
    name: 'findInternal',
    meta: {
      icon: 'md-search',
      title: '内部接口debug'
    },
    component: () => import('@/view/findInternal/index.vue')
  }]
},
{
  component: Main,
  path: '/version',
  name: 'version',
  title: '版本相关',
  meta: {
    hideInBread: true,
    hideInMenu: true
  },
  children: [{
    path: '/version',
    name: 'version',
    meta: {
      icon: 'md-radio',
      title: '版本相关'
    },
    component: () => import('@/view/version/info.vue')
  }]
},

{
  component: Main,
  path: '/QuicklyOrder',
  name: 'QuicklyOrder',
  title: '一键下单',
  meta: {
    hideInBread: false,
    notCache: true,
    hideInMenu: true
  },
  children: [{
    path: '',
    name: 'QuicklyOrder',
    meta: {
      icon: 'ios-flash',
      title: '一键下单'
    },
    component: () => import('@/view/quicklyOrder/index.vue')
  }]
},

  //   // 打包资源技术支持统计
  // {
  //   path: '/getPackageData',
  //   name: 'getPackageData',
  //   component: Main,
  //   meta: {
  //     hideInBread: true
  //   },
  //   children: [{
  //     path: '',
  //     name: 'getPackageData',
  //     meta: {
  //       icon: 'md-cart',
  //       title: '打包订资源和订单趋势图'
  //     },
  //     component: () => import('@/view/PackageRate/index.vue')
  //   }]
  // },

  // {
  //   path: '/getForeignPackageData',
  //   name: 'getForeignPackageData',
  //   component: Main,
  //   meta: {
  //     hideInBread: true
  //   },
  //   children: [{
  //     path: '',
  //     name: 'getForeignPackageData',
  //     meta: {
  //       icon: 'md-cart',
  //       title: '境外打包订资源和订单趋势图'
  //     },
  //     component: () => import('@/view/PackageRate/ForeignResource.vue')
  //   }]
  // },

{
  path: '/getresource',
  name: 'getresource',
  component: Main,
  meta: {
    hideInBread: true,
    notCache: true,
    hideInMenu: true
  },
  children: [{
    path: '',
    name: 'getresource',
    meta: {
      icon: 'md-cart',
      title: '打包资源预定趋势图'
    },
    component: () => import('@/view/PackageRate/Resource.vue')
  }]
},

{
  path: '/reportDetail',
  name: 'reportDetail',
  component: Main,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: '',
    name: 'reportDetail',
    meta: {
      icon: 'md-analytics',
      title: '测试报告详情'
    },
    component: () => import('@/view/report/reportdetail.vue')
  }]
},
  // 迭代进度报告
{
  path: '/sprintReport',
  name: '_sprintReport',
  component: Main,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: '/sprintReport',
    name: '_sprintReport',
    meta: {
      icon: 'md-person',
      title: '迭代进度'
    },
    component: () => import('@/view/sprintReport')
  }]
},
  // 燃尽图
{
  path: '/burndownChart',
  name: 'burndownChart',
  component: Main,
  meta: {
    hideInMenu: true
  },
  children: [{
    path: '/burndownChart',
    name: '_burndownChart',
    meta: {
      icon: 'md-person',
      title: '燃尽图'
    },
    component: () => import('@/view/burndownchart')
  }]
},
  // 统计分析
{
  path: '/analysis',
  name: 'analysis',
  component: Main,
  meta: {
    hideInBread: true,
    title: '统计分析',
    icon: 'md-cog'
  },
  children: [{
    path: '/analysis',
    name: '_analysis',
    meta: {
      // icon: 'md-person',
      title: 'epic分析'
    },
    component: () => import('@/view/analysis')
  }, {
    path: 'sprintReport',
    name: 'sprintReport',
    meta: {
      // icon: 'md-person',
      title: '迭代进度'
    },
    component: () => import('@/view/sprintReport')
  }, {
    path: ' timeworking',
    name: 'timeworking',
    meta: {
      // icon: 'md-cog',
      title: '资本化工时'
    },
    component: () => import('@/view/timeworking')
  }]
}]
