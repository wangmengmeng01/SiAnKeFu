import { makeAPI } from './httpRequest'

// 个人秀审核
const personalShowAuditConfig = {
  getList: {
    url: '/console/userShow/findUploadShowByPage',
    method: 'post'
  },
  audit: {
    url: '/console/userShow/auditShow',
    method: 'post'
  }
}

// 个人秀点赞列表
const personalShowLike = {
  getList: {
    url: '/console/userShow/findLikeShowByPage',
    method: 'post'
  }
}

export default {
  '/personal-show-manager/personal-show-audit': makeAPI(personalShowAuditConfig),
  '/personal-show-manager/personal-show-like': makeAPI(personalShowLike)
}
