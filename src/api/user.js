import request from '@/api/httpRequest'

export function login(data) { // 登录
  return request({
    url: '/console/user/login',
    method: 'post',
    data,
    quiet: true
  })
}

export function getInfo(token) { // 获取用户信息
  return request({
    url: '/console/user/search',
    method: 'post',
    data: {}
  })
}

export function modifyPassword(data) { // 修改密码
  return request({
    url: '/console/user/modifyPassword',
    method: 'post',
    data
  })
}

export function getMenu(token) { // 获取用户菜单
  return request({
    url: '/console/acl/resource/build',
    method: 'post',
    data: {}
  })
}

export function logout(data) { // 退出
  return request({
    url: '/console/user/exit',
    method: 'post',
    data
  })
}
export function getOssToken(data) { // 获取上传使用的OssToken
  return request({
    url: '/console/common/getOssToken',
    method: 'post',
    data
  })
}

export function getOssPrefix() { // 获取上传文件路径前缀
  return request({
    url: '/console/common/getOssPrefix',
    method: 'post'
  })
}
