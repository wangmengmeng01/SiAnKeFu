import { request } from './httpRequest'
// 通话记录-分页
export function recordPage(data) {
	return request({
	  method: 'post',
	  url: '/console/call/recordPage',
	  data: data
	});
}