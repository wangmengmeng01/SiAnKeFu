import { makeAPI } from './httpRequest'

// 动态审核
const postAuditConfig = {
  getList: {
    url: '/console/sns/app/dynamic/auditPageList',
    method: 'post'
  },
  audit: {
    url: '/console/sns/app/dynamic/audit',
    method: 'post'
  },
  getRefuseList: {
    url: '/console/sns/app/dynamic/auditRefusePageList',
    method: 'post'
  }
}

// 直播封面审核
const frontCoverAuditConfig = {
  getList: {
    url: '/console/live/liveCoverAppRecord/auditList',
    method: 'post'
  },
  audit: {
    url: '/console/live/liveCoverAppRecord/audit',
    method: 'post'
  }
}

// 实名审核
const realNameAuditConfig = {
  getList: {
    url: '/console/acl/role/userRealNameAuthPageList',
    method: 'post'
  },
  audit: {
    url: '/console/acl/role/auditUserRealNameAuthorize',
    method: 'post'
  }
}

// 直播权限审核
const livePermissionAuditConfig = {
  getList: {
    url: '/console/user/userLivePermission/pageList',
    method: 'post'
  },
  audit: {
    url: '/console/user/userLivePermission/audit',
    method: 'post'
  }
}

export default {
  '/audit-manager/post-audit': makeAPI(postAuditConfig),
  '/audit-manager/front-cover-audit': makeAPI(frontCoverAuditConfig),
  '/audit-manager/real-name-audit': makeAPI(realNameAuditConfig),
  '/audit-manager/live-permission-audit': makeAPI(livePermissionAuditConfig)
}
