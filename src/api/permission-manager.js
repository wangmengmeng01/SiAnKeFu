import { makeAPI } from './httpRequest'

// 角色配置
const roleConfig = {
  // 查询当前登录用户配置的角色
  search: {
    url: '/console/acl/role/search',
    method: 'post'
  },
  // 分页查询角色list
  getList: {
    url: '/console/acl/role/page',
    method: 'post'
  },
  // 创建角色
  create: {
    url: '/console/acl/role/create',
    method: 'post',
    quiet: true
    /**
     * status => 角色状态，0 正常；1 锁定
     * data: { roleName: '', description: '', status: 0}
     */
  },
  // 更新角色
  update: {
    url: '/console/acl/role/update',
    method: 'post',
    quiet: true
    /**
     * id => 角色id
     * status => 角色状态
     * data: { id: -1, roleName: '', description: '', status: 0 }
     */
  },
  // 角色授权
  auth: {
    url: '/console/acl/role/authorization',
    method: 'post'
    /**
     * id => 角色id
     * resourceIds => 权限id
     * data: { id: -1, resourceIds: [] }
     */
  },
  // 删除角色
  remove: {
    url: '/console/acl/role/delete',
    method: 'post'
    /**
     * id => 角色id
     * data: { id: -1 }
     */
  }
}

// 操作员管理
const operatorConfig = {
  // 当前登录用户修改密码
  modifyPassword: {
    url: '/console/user/modifyPassword',
    method: 'post'
  },
  // 当前用户登录
  login: {
    url: '/console/user/login',
    method: 'post'
  },
  // 当前用户刷新token
  refreshToken: {
    url: '/console/user/refreshToken',
    method: 'post'
  },
  // 当前登录用户注销登录
  logout: {
    url: '/console/user/logout',
    method: 'post'
  },
  // 查询当前登录用户信息
  getInfo: {
    url: '/console/user/search',
    method: 'post'
  },
  // 分页查询操作员list
  getList: {
    url: '/console/user/page',
    method: 'post'
  },
  // 创建操作员
  create: {
    url: '/console/user/create',
    method: 'post'
    /**
     * data: {"realName": "","password": "","roleIds": [],"mobile": "","username": ""}
     */
  },
  // 更新操作员
  update: {
    url: '/console/user/update',
    method: 'post'
  },
  // 操作员禁用启用状态切换 0正常 1锁定
  updateStatus: {
    url: '/console/user/updateStatus',
    method: 'post'
  },
  // 重置操作员的密码
  resetPassword: {
    url: '/console/user/resetPassword',
    method: 'post'
  }
}

// 菜单管理
const menuConfig = {
  // 查询所有菜单
  getList: {
    url: '/console/acl/resource/build',
    method: 'post'
  },
  // 创建菜单
  create: {
    url: '/console/acl/resource/create',
    method: 'post',
    quiet: true
    /**
     * data: {}
     */
  },
  // 修改菜单
  update: {
    url: '/console/acl/resource/update',
    method: 'post',
    quiet: true
    /**
     * data: { id: -1, ... }
     */
  },
  // 删除菜单
  remove: {
    url: '/console/acl/resource/delete',
    method: 'post'
    /**
     * data: { id: -1 }
     */
  }
}

export default {
  '/permission-manager/role': makeAPI(roleConfig),
  '/permission-manager/operator': makeAPI(operatorConfig),
  '/permission-manager/menu': makeAPI(menuConfig)
}
