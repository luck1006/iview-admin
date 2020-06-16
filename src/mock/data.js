import chartData from './data/chart-data'
import dragTree from './data/drag-tree'
import autoData from './data/auto-complete'
import orderData from './data/order'
import workData from './data/worktime'
import reportData from './data/auto-report'
import supportD from './data/support'
import videoD from './data/video'
import burndowninfo from './data/burndowninfo'

export const queryChartData = req => {
  return chartData
}
export const dragTreeData = req => {
  return dragTree
}
export const autoCompleteData = req => {
  return autoData
}

export const orderInfoData = req => {
  return orderData
}

export const workTimeData = req => {
  return workData
}

export const autoReportData = req => {
  return reportData
}

export const supportData = req => {
  return supportD
}

export const videoData = req => {
  return videoD
}

export const burndowninfoData = req => {
  return burndowninfo
}
