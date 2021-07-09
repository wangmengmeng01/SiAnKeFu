import { request } from './httpRequest'
// 得到通话余额不足提醒
export function updateCallBalanceWarnLineConfig(data) {
	return request({
	  method: 'post',
	  url: '/console/config/updateCallBalanceWarnLineConfig',
	  data: data
	});
}
// 设置通话余额不足提醒
export function getCallBalanceWarnLineConfig(data) {
	return request({
	  method: 'post',
	  url: '/console/config/getCallBalanceWarnLineConfig',
	  data: data
	});
}
// 设置个人秀打赏配置
export function updateUserShowLikeAmountConfig(data) {
	return request({
	  method: 'post',
	  url: '/console/config/updateUserShowLikeAmountConfig',
	  data: data
	});
}
// 得到个人秀打赏配置
export function getUserShowLikeAmountConfig(data) {
	return request({
	  method: 'post',
	  url: '/console/config/getUserShowLikeAmountConfig',
	  data: data
	});
}
// 得到非会员私信限制
export function getSendPmLimitConfig(data) {
	return request({
	  method: 'post',
	  url: '/console/config/getSendPmLimitConfig',
	  data: data
	});
}
// 设置非会员私信限制
export function updateSendPmLimitConfig(data) {
	return request({
	  method: 'post',
	  url: '/console/config/updateSendPmLimitConfig',
	  data: data
	});
}
// 得到非会员浏览限制
export function getVisitHomeLimitConfig(data) {
	return request({
	  method: 'post',
	  url: '/console/config/getVisitHomeLimitConfig',
	  data: data
	});
}
// 设置非会员浏览限制
export function updateVisitHomeLimitConfig(data) {
	return request({
	  method: 'post',
	  url: '/console/config/updateVisitHomeLimitConfig',
	  data: data
	});
}
// 语音通话价格列表
export function voiceCallPriceList(data) {
	return request({
	  method: 'post',
	  url: '/console/config/voiceCallPriceList',
	  data: data
	});
}
// 语音通话价-增加
export function voiceCallPriceAdd(data) {
	return request({
	  method: 'post',
	  url: '/console/config/voiceCallPriceAdd',
	  data: data
	});
}
// 语音通话价-编辑
export function voiceCallPriceEdit(data) {
	return request({
	  method: 'post',
	  url: '/console/config/voiceCallPriceEdit',
	  data: data
	});
}
// 视频通话价格列表
export function videoCallPriceList(data) {
	return request({
	  method: 'post',
	  url: '/console/config/videoCallPriceList',
	  data: data
	});
}
// 视频通话价-增加
export function videoCallPriceAdd(data) {
	return request({
	  method: 'post',
	  url: '/console/config/videoCallPriceAdd',
	  data: data
	});
}
// 视频通话价-编辑
export function videoCallPriceEdit(data) {
	return request({
	  method: 'post',
	  url: '/console/config/videoCallPriceEdit',
	  data: data
	});
}
// 语音通话价-删除
export function voiceCallPriceDel(data) {
	return request({
	  method: 'post',
	  url: '/console/config/voiceCallPriceDel',
	  data: data
	});
}
// 视频通话价-删除
export function videoCallPriceDel(data) {
	return request({
	  method: 'post',
	  url: '/console/config/videoCallPriceDel',
	  data: data
	});
}
// 广告配置-列表
export function list(data) {
	return request({
	  method: 'post',
	  url: '/console/config/ad/list',
	  data: data
	});
}
// 广告配置-新增
export function add(data) {
	return request({
	  method: 'post',
	  url: '/console/config/ad/add',
	  data: data
	});
}
// 广告配置-编辑
export function edit(data) {
	return request({
	  method: 'post',
	  url: '/console/config/ad/edit',
	  data: data
	});
}
// 广告配置-下架
export function offLine(data) {
	return request({
	  method: 'post',
	  url: '/console/config/ad/offLine',
	  data: data
	});
}
// VIP-分页列表
export function findByPage(data) {
	return request({
	  method: 'post',
	  url: '/console/userVip/findByPage',
	  data: data
	});
}
// #马甲用户分页列表
export function findVestByPage(data) {
	return request({
	  method: 'post',
	  url: '/console/userPacker/findByPage',
	  data: data
	});
}
// 创建马甲用户
export function createUserPacker(data) {
	return request({
	  method: 'post',
	  url: '/console/userPacker/createUserPacker',
	  data: data
	});
}
// 编辑马甲用户
export function editUserPacker(data) {
	return request({
	  method: 'post',
	  url: '/console/userPacker/editUserPacker',
	  data: data
	});
}
// 发布动态
export function publishDynamic(data) {
	return request({
	  method: 'post',
	  url: '/console/userPacker/publishDynamic',
	  data: data
	});
}
// 获取所有个标签
export function findAllAvailable(data) {
	return request({
	  method: 'post',
	  url: '/console/userTagStorage/findAllAvailable',
	  data: data
	});
}
// 用户-详情
export function findUserDetailByUid(data) {
	return request({
	  method: 'post',
	  url: '/console/user/findUserDetailByUid',
	  data: data
	});
}
// 话题分页查询列表
export function pageList(data) {
	return request({
	  method: 'post',
	  url: '/console/sns/topicMaster/pageList',
	  data: data
	});
}
// 用户来源配置-创建
export function createUserSource(data) {
	return request({
	  method: 'post',
	  url: '/console/userSource/create',
	  data: data
	});
}
// 用户来源配置-列表
export function findAll(data) {
	return request({
	  method: 'post',
	  url: '/console/userSource/findAll',
	  data: data
	});
}
// 用户属性配置-创建
export function createField(data) {
	return request({
	  method: 'post',
	  url: '/console/userAttribute/create',
	  data: data
	});
}
// 用户属性配置-列表
export function findAllField(data) {
	return request({
	  method: 'post',
	  url: '/console/userAttribute/findAll',
	  data: data
	});
}
// 获取开关配置
export function getSwitchConfig(data) {
	return request({
	  method: 'post',
	  url: '/console/config/getSwitchConfig',
	  data: data
	});
}
// 修改开关配置
export function updateSwitchConfig(data) {
	return request({
	  method: 'post',
	  url: '/console/config/updateSwitchConfig',
	  data: data
	});
}
// 短信配置-保存
export function saveNote(data) {
	return request({
	  method: 'post',
	  url: '/console/smsTemplate/save',
	  data: data
	});
}
// 短信配置-获取
export function findOne(data) {
	return request({
	  method: 'post',
	  url: '/console/smsTemplate/findOne',
	  data: data
	});
}
// 用户注册码关系-列表
export function findAllCode(data) {
	return request({
	  method: 'post',
	  url: '/console/user/registration/findAll',
	  data: data
	});
}
// 用户注册码关系-创建
export function createCode(data) {
	return request({
	  method: 'post',
	  url: '/console/user/registration/create',
	  data: data
	});
}
// 版本更新管理-删除
export function deleteVersion(data) {
	return request({
	  method: 'post',
	  url: '/console/versionUpgrade/delete',
	  data: data
	});
}
// 用户-编辑基本信息
export function editByUid(data) {
	return request({
	  method: 'post',
	  url: '/console/user/editByUid',
	  data: data
	});
}
// 用户-编辑自定义属性
export function setAttributeValue(data) {
	return request({
	  method: 'post',
	  url: '/console/user/setAttributeValue',
	  data: data
	});
}
// 用户来源配置-列表
export function findAllSource(data) {
	return request({
	  method: 'post',
	  url: '/console/userSource/findAll',
	  data: data
	});
}


