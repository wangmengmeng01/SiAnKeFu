import { makeAPI } from './httpRequest'

// 付费消息记录
const payRecord = {
  // 分页查询list
  getList: {
    url: '/console/vipWorld/messageConsumePage',
    method: 'post'
  }
}

// 红包发放记录
const redpacketGrant = {
  // 分页查询list
  getList: {
    url: '/console/vipWorld/redPacketItemPage',
    method: 'post'
  },
  getDetail: {
    url: '/console/vipWorld/groupBagTakeDetail',
    method: 'post'
  }
}

export default {
  '/channel-manager/redpacket-grant': makeAPI(redpacketGrant),
  '/channel-manager/pay-record': makeAPI(payRecord)
}