import { makeAPI } from './httpRequest'

// 用户列表
const userListConfig = {
  // 分页查询用户list
  getList: {
    url: '/console/user/findByPage',
    method: 'post'
  },
  // 封禁解封用户
  ban: {
    url: '/console/user/ban',
    method: 'post'
  }
}

// 用户详情
const userDetailConfig = {
  findUserDetailByUid: {
    url: '/console/user/findUserDetailByUid',
    method: 'post'
  },
  editByUid: {
    url: '/console/user/editByUid',
    method: 'post'
  },
  deleteVoiceSignature: {
    url: '/console/user/deleteVoiceSignature',
    method: 'post'
  },
  deleteAnswer: {
    url: '/console/user/deleteAnswer',
    method: 'post'
  }
}

// 二重世界用户列表
const secondWorldUserListConfig = {
  // 分页查询用户list
  getList: {
    url: '/console/userVipIdentityRole/findByPage',
    method: 'post'
  }
}

// 用户授权
const userAuthorizeConfig = {
  // 分页查询用户list
  getList: {
    url: '/console/userAuthIdentity/findByPage',
    method: 'post'
  },
  // 为用户授权
  grantAuthIdentity: {
    url: '/console/userAuthIdentity/grantAuthIdentity',
    method: 'post'
  },
  // 取消授权
  cancelAuthIdentity: {
    url: '/console/userAuthIdentity/cancelAuthIdentity',
    method: 'post'
  }
}

export default {
  '/user-manager/user-list': makeAPI(userListConfig),
  '/user-manager/user-detail': makeAPI(userDetailConfig),
  '/user-manager/second-world-user-list': makeAPI(secondWorldUserListConfig),
  '/user-manager/user-authorize': makeAPI(userAuthorizeConfig)
}
