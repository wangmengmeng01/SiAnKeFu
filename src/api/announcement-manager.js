import { makeAPI } from './httpRequest'

// 公告列表
const announcementListConfig = {
  getList: {
    url: '/console/platformNotice/pageList',
    method: 'post'
  },
  update: {
    url: '/console/platformNotice/updateRedirect',
    method: 'post'
  },
  publish: {
    url: '/console/platformNotice/publish',
    method: 'post'
  },
  cancelPublish: {
    url: '/console/platformNotice/cancelPublish',
    method: 'post'
  }
}

// 图文编辑
const imageTextEditConfig = {
  getList: {
    url: '/console/graphicLibrary/pageList',
    method: 'post'
  },
  create: {
    url: '/console/graphicLibrary/create',
    method: 'post'
  },
  update: {
    url: '/console/graphicLibrary/update',
    method: 'post'
  },
  getById: {
    url: '/console/graphicLibrary/getById',
    method: 'get'
  }
}

export default {
  '/announcement-manager/announcement-list': makeAPI(announcementListConfig),
  '/announcement-manager/image-text-edit': makeAPI(imageTextEditConfig)
}
