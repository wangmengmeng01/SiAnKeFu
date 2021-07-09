import { makeAPI } from './httpRequest'

// 预约记录
const bookHistoryConfig = {
  getList: {
    url: '/console/identityExperienceCard/findAppointmentPage',
    method: 'post'
  },
  audit: {
    url: '/console/identityExperienceCard/audit',
    method: 'post'
  }
}

// 发放记录
const giveOutHistoryConfig = {
  getList: {
    url: '/console/identityExperienceCard/findByPage',
    method: 'post'
  },
  batchSysProvide: {
    url: '/console/identityExperienceCard/batchSysProvide',
    method: 'post'
  }
}

export default {
  '/experience-card-manager/book-history': makeAPI(bookHistoryConfig),
  '/experience-card-manager/give-out-history': makeAPI(giveOutHistoryConfig)
}
