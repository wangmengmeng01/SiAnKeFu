import { request } from './httpRequest'
// 客服分类-分页
export function findByPage(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/category/findByPage',
	  data: data
	});
}
// 客服分类-有效列表
export function findEffective(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/category/findEffective',
	  data: data
	});
}
// 客服分类-创建
export function create(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/category/create',
	  data: data
	});
}
// 客服分类-编辑
export function edit(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/category/edit',
	  data: data
	});
}
// 客服分类-默认消息模板增加
export function defaultAdd(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/category/messageTemplate/add',
	  data: data
	});
}
// 客服分类-默认消息模板编辑
export function defaultEdit(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/category/messageTemplate/edit',
	  data: data
	});
}
// 客服分类-默认消息模板删除
export function del(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/category/messageTemplate/del',
	  data: data
	});
}
// 客服分类-针对于目前已注册的老用户Push消息
export function pushMessageToAppUserByCsCategory(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/category/pushMessageToAppUserByCsCategory',
	  data: data
	});
}
// 客服分类-模板消息列表
export function pushMessagelist(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/category/messageTemplate/list',
	  data: data
	});
}
// 客服分类-模板消息详情
export function messageDetail(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/category/messageTemplate/detail',
	  data: data
	});
}
// 客服马甲-列表
export function vestByPage(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/packer/findByPage',
	  data: data
	});
}
// 客服马甲-创建
export function vestCreate(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/packer/create',
	  data: data
	});
}
// 客服马甲-编辑
export function vestEdit(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/packer/edit',
	  data: data
	});
}
// 客服马甲-绑定用户列表
export function findBindViewUser(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/packer/findBindViewUser',
	  data: data
	});
}
// 获取客服工作记录
export function findStatisticsByPage(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/desk/cs/findStatisticsByPage',
	  data: data
	});
}
// 获取客服监控记录
export function findMonitor(data) {
	return request({
	  method: 'post',
	  url: '/console/csr/desk/cs/findMonitor',
	  data: data
	});
}
