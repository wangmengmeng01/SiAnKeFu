import { makeAPI } from './httpRequest'

// 礼物列表
const giftListConfig = {
  getList: {
    url: '/console/member/gift/page',
    method: 'post'
  },
  putOff: {
    url: '/console/member/gift/status',
    method: 'post'
  },
  create: {
    url: '/console/member/gift/add',
    method: 'post'
  },
  update: {
    url: '/console/member/gift/modify',
    method: 'post'
  }
}

// 礼物赠送记录
const giftHistoryConfig = {
  getList: {
    url: '/console/member/gift/giveGiftPage',
    method: 'post'
  }
}

export default {
  '/gift-manager/gift-list': makeAPI(giftListConfig),
  '/gift-manager/gift-history': makeAPI(giftHistoryConfig)
}
