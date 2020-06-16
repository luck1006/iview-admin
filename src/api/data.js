import axios from '@/libs/api.request'

export const queryTree = params => {
  return axios.request({
    url: 'queryTree',
    method: 'get',
    params
  })
}

export const queryCaseInfo = params => {
  return axios.request({
    url: '/queryCaseInfo',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const runInterface = params => {
  return axios.request({
    url: '/runCase',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const check = params => {
  return axios.request({
    url: '/check',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const saveCase = params => {
  return axios.request({
    url: '/saveCase',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getTag = params => {
  return axios.request({
    url: '/getTag',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const queryPid = params => {
  return axios.request({
    url: '/queryPid',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const dragTree = data => {
  return axios.request({
    url: 'dragTree',
    method: 'post',
    data
  })
}
export const addTree = data => {
  return axios.request({
    url: 'addTree',
    method: 'post',
    data
  })
}
export const modifyTree = data => {
  return axios.request({
    url: 'modifyTree',
    method: 'post',
    data
  })
}
export const deleteTree = data => {
  return axios.request({
    url: 'deleteTree',
    method: 'post',
    data
  })
}

export const batchRunCases = data => {
  return axios.request({
    url: 'batchRunCases',
    method: 'post',
    data
  })
}

// 实现参数化批量运行用例-dfftest
export const batchRunByParameter = data => {
  return axios.request({
    url: 'batchRunByParameter',
    method: 'post',
    data
  })
}
// 全局变量列表查询
export const queryGlobalParamsList = data => {
  return axios.request({
    url: 'queryGlobalParamsList',
    method: 'post',
    data
  })
}
// 自动化报告变量列表查询
export const queryReportList = data => {
  return axios.request({
    url: 'queryReportList',
    method: 'post',
    data
  })
}

// ScrumTeam信息
export const queryChart = params => {
  return axios.request({
    url: 'queryChart',
    method: 'get',
    params
  })
}
// 成熟度信息
export const ammInfo = params => {
  return axios.request({
    url: 'ammInfo',
    method: 'get',
    params
  })
}
// scrumteam信息
export const teamName = params => {
  return axios.request({
    url: 'teamName',
    method: 'get',
    params
  })
}
// 提交成熟度选项
export const commitAmm = params => {
  return axios.request({
    url: 'commitAmm',
    method: 'post',
    data: params,
    header: {
      'Content-Type': 'application/json'
    }
  })
}
// 根据团队名称获取成熟度信息
export const queryByteam = params => {
  return axios.request({
    url: 'queryByteam',
    method: 'get',
    params
  })
}

// 根据版本号，同步scrumteam的point、缺陷信息等
export const syncScrum = params => {
  return axios.request({
    url: 'syncScrum',
    method: 'post',
    data: params,
    header: {
      'Content-Type': 'application/json'
    }
  })
}

// 自动化覆盖率统计
export const autoComplete = params => {
  return axios.request({
    url: 'interfaceCoverage',
    method: 'get',
    params
  })
}

// 下单+登陆统计
export const orderLogin = params => {
  return axios.request({
    url: 'orderLogin',
    method: 'get',
    params
  })
}
// 下单+登陆统计报表
export const orderLoginReport = params => {
  return axios.request({
    url: 'orderLoginReport',
    method: 'get',
    params
  })
}

// 工时统计
export const timeStatistic = params => {
  return axios.request({
    url: 'timeStatistic',
    method: 'get',
    params
  })
}

// 自动化报告
export const getReportInfo = params => {
  return axios.request({
    url: 'getReportInfo',
    method: 'get',
    params
  })
}

//  查看出入参校验信息
export const queryParams = params => {
  return axios.request({
    url: 'queryParams',
    method: 'get',
    params
  })
}

// 技术支持
export const technicalSupport = params => {
  return axios.request({
    url: 'technicalSupport',
    method: 'get',
    params
  })
}

export const resolutionRate = params => {
  return axios.request({
    url: 'resolutionRate',
    method: 'get',
    params
  })
}

// 导出时查询的技术支持
export const exporttechnicalSupport = params => {
  return axios.request({
    url: 'exporttechnicalSupport',
    method: 'get',
    params
  })
}

// 网易云盘录制视频
export const wyVideo = params => {
  return axios.request({
    url: 'wangyi/app/vod/video/list',
    method: 'post',
    data: params
  })
}

// 获取网易云盘sprint
export const getSprint = params => {
  return axios.request({
    url: 'wangyi/app/vod/type/list',
    method: 'post',
    data: {
      currentPage: 1,
      pageSize: 100
    }
  })
}
// 资本化数据
export const timeworking = params => {
  return axios.request({
    url: 'timeworking',
    method: 'get',
    params,
    header: {
      'Content-Type': 'application/json'
    }
  })
}

// 资本化数据的周数
export const getweek = params => {
  return axios.request({
    url: 'getweek',
    method: 'get',
    params,
    header: {
      'Content-Type': 'application/json'
    }
  })
}

// 截图并发送邮件
export const shotEmail = params => {
  return axios.request({
    url: 'shotEmail',
    method: 'post',
    data: params,
    header: {
      'Content-Type': 'application/json'
    }
  })
}
// 对出参进行base64解码
export const base64Decode = params => {
  return axios.request({
    url: 'base64Decode',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 新增编辑全局变量信息接口
export const saveGlobalParams = params => {
  return axios.request({
    url: 'saveGlobalParams',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 新增删除全局变量信息接口
export const removeGlobalParams = params => {
  return axios.request({
    url: 'deleteParam',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 保存技术支持分析内容
export const saveAnalysis = params => {
  return axios.request({
    url: 'saveAnalysis',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 查询技术支持内容
export const getAnalysis = params => {
  return axios.request({
    url: 'getAnalysis',
    method: 'get',
    params
  })
}
// 保存下单和登录报表分析内容
export const saveReportAnalysis = params => {
  return axios.request({
    url: 'saveReportAnalysis',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 查询下单和登录报表内容
export const getReportAnalysis = params => {
  return axios.request({
    url: 'getReportAnalysis',
    method: 'get',
    params
  })
}
// 查询邮件接受者列表
export const getReceiver = params => {
  return axios.request({
    url: 'getReceiver',
    method: 'get',
    params
  })
}

// 获取内部pebble接口内容
export const FindPebble = params => {
  return axios.request({
    url: 'FindPebble',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 迭代版本信息
export const versionInfo = params => {
  return axios.request({
    url: 'sprint/version',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const save = params => {
  return axios.request({
    url: '/sprint/save',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 需求xmind展示
export const getXmind = params => {
  return axios.request({
    url: 'getXmind',
    method: 'get',
    params
  })
}

// 测试报告运行趋势详情
export const queryRunDetail = params => {
  return axios.request({
    url: 'queryRunDetail',
    method: 'get',
    params
  })
}

// 机酒打包一键下单
export const FHQuicklyOrder = params => {
  return axios.request({
    url: 'FHQuicklyOrder',
    method: 'get',
    params
  })
}

// 取消订单
export const CancelOrder = params => {
  return axios.request({
    url: 'CancelOrder',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 渗透测试文档和工具
// const定义的方法在vue文件methos中调用到
// export const docfiledownload = params => {
//   return axios.request({
//     // 对应后台route中定义的路径信息
//     url: '/penetration/download/doc',
//     method: 'get',
//     params,
//     responseType: 'blob'
//   })
// }
// export const pdffiledownload = params => {
//   return axios.request({
//     // 对应后台route中定义的路径信息
//     url: '/penetration/download/pdf',
//     method: 'get',
//     params,
//     responseType: 'blob'
//   })
// }
// export const zipfiledownload = params => {
//   return axios.request({
//     // 对应后台route中定义的路径信息
//     url: '/penetration/download/zip',
//     method: 'get',
//     params,
//     responseType: 'blob'

//   })
// }
// export const pptfiledownload = params => {
//   return axios.request({
//     // 对应后台route中定义的路径信息
//     url: '/penetration/download/ppt',
//     method: 'get',
//     params,
//     responseType: 'blob'
//   })
// }

// scrum迭代过程需求信息
export const searchreqinfo = params => {
  return axios.request({
    url: '/reqinfo/searchreqinfo',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// scrum迭代过程需求团队信息
export const getreqteaminfo = params => {
  return axios.request({
    url: '/reqinfo/getreqteaminfo',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取epic
export const getEpic = params => {
  return axios.request({
    url: 'getEpic',
    method: 'get',
    params
  })
}

// 技术支持分析 start
export const getmodules = params => {
  return axios.request({
    url: 'getmodules',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// export const getanalysisdatas = params => {
//   return axios.request({
//     url: 'getanalysisdatas',
//     method: 'get',
//     params,
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
// }

// export const getanalysiscplete = params => {
//   return axios.request({
//     url: 'getanalysiscplete',
//     method: 'get',
//     params,
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
// }

// 获取机票资源信息
export const GetFlightDataByMonth = params => {
  return axios.request({
    url: 'GetFlightDataByMonth',
    method: 'get',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取酒店资源信息
export const GetHotelDataByMonth = params => {
  return axios.request({
    url: 'GetHotelDataByMonth',
    method: 'get',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取门票资源信息
export const GetTicketDataByMonth = params => {
  return axios.request({
    url: 'GetTicketDataByMonth',
    method: 'get',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取预定信息
export const GetBookDataByMonth = params => {
  return axios.request({
    url: 'GetBookDataByMonth',
    method: 'get',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 获取境外机票资源信息
export const GetForeignFlightDataByMonth = params => {
  return axios.request({
    url: 'GetForeignFlightDataByMonth',
    method: 'get',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取境外酒店资源信息
export const GetForeignHotelDataByMonth = params => {
  return axios.request({
    url: 'GetForeignHotelDataByMonth',
    method: 'get',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取境外门票资源信息
export const GetForeignTicketDataByMonth = params => {
  return axios.request({
    url: 'GetForeignTicketDataByMonth',
    method: 'get',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 获取境外预定信息
export const GetForeignBookDataByMonth = params => {
  return axios.request({
    url: 'GetForeignBookDataByMonth',
    method: 'get',
    data: params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const getanalysisdatas = params => {
  return axios.request({
    url: 'getanalysisdatas',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const getty = params => {
  return axios.request({
    url: 'getty',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// export const getnewallnum = params => {
//   return axios.request({
//     url: 'getnewallnum',
//     method: 'get',
//     params,
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
// }

export const gettyall = params => {
  return axios.request({
    url: 'gettyall',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const gettynew = params => {
  return axios.request({
    url: 'gettynew',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 技术支持分析 end
// 获取可用系统变量列表
export const getSysParamsList = params => {
  return axios.request({
    url: '/getSysParamsList',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 查询pepple服务可用的查询方法
export const qeuryMethods = params => {
  return axios.request({
    url: '/queryMethods',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// queryPeppleParams 查询pepple服务对应方法下的请求入参
export const queryPeppleParams = params => {
  return axios.request({
    url: '/queryPeppleParams',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 查询团队与sprint对应关系
export const getTeamSprintRelationship = params => {
  return axios.request({
    url: '/getTeamSprintRelationship',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 查询全量sprint下工作时间数据
export const getSprintWorkTime = params => {
  return axios.request({
    url: '/tnj/worktime',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 查询jira日报
export const queryDasyReport = params => {
  return axios.request({
    url: '/queryDaysReport',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 查询jira日报
export const getScrumTeam = params => {
  return axios.request({
    url: '/getScrumTeam',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 查询人员信息
export const getWorkersList = params => {
  return axios.request({
    url: '/getWorkersList',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 获取某一迭代组下的燃尽图数据
export const getburndownchart = params => {
  return axios.request({
    url: '/scopechangeburndownchart',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 统计信息epic
export const queryByEpic = params => {
  return axios.request({
    url: '/tnj/queryByEpic',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 统计信息epic,按月
export const queryEpicbyMonth = params => {
  return axios.request({
    url: '/tnj/queryEpicbyMonth',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 查询已激活的sprint
export const queryActiveSprint = params => {
  return axios.request({
    url: '/queryActiveSprint',
    method: 'get',
    params,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
