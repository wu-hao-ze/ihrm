import request from '@/utils/request'

export function getAttendancesList(params) {
  return request({
    url: '/attendances',
    params
  })
}
export function getAtteArchiveDetail(data) {
  return request({
    url: `/attendances/archive/${data.userId}/${data.yearMonth}`
  })
}
export function updateAttendance(data) {
  return request({
    url: `/attendances/${data.userId}`,
    method: 'put',
    data
  })
}
export function getArchivingList(params) {
  return request({
    url: '/attendances/reports/year',
    params
  })
}
export function getArchivingCont(params) {
  return request({
    url: `/attendances/reports/${params.atteArchiveMonthlyId}`,
    params
  })
}
export function importArchive(data) {
  return request({
    url: '/archive/atte/export',
    method: 'post',
    data
  })
}
export function notify() {
  return request({
    url: '/notify/mail',
    method: 'post'
  })
}
export function archives(params) {
  return request({
    url: '/attendances/archives',
    params
  })
}
export function newReports(params) {
  return request({
    url: '/attendances/newReports',
    params
  })
}
export function information() {
  return request({})
}
export function pay() {
  return request({})
}
export function reportFormList(params) {
  return request({
    url: '/attendances/reports',
    params
  })
}
export function leaveSave(data) {
  return request({
    url: '/cfg/leave',
    method: 'put',
    data
  })
}
export function getLeave(data) {
  return request({
    url: '/cfg/leave/list',
    method: 'post',
    data
  })
}
export function deductionsSave(data) {
  return request({
    url: '/cfg/deduction',
    method: 'put',
    data
  })
}
export function getDeductions(data) {
  return request({
    url: '/cfg/ded/list',
    method: 'post',
    data
  })
}
export function overtimeSave(data) {
  return request({
    url: '/cfg/extDuty',
    method: 'put',
    data
  })
}
export function getOvertime(data) {
  return request({
    url: '/cfg/extDuty/item',
    method: 'post',
    data
  })
}
export function attendanceSave(data) {
  return request({
    url: '/cfg/atte',
    method: 'put',
    data
  })
}
export function getAttendance(data) {
  return request({
    url: '/cfg/atte/item',
    method: 'post',
    data
  })
}
export function fileUpdate(data) {
  return request({
    url: `/employee/archives/${data.month}`,
    method: 'put',
    data
  })
}
