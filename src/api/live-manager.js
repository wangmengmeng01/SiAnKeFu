import { makeAPI } from './httpRequest'

// 正在直播
const onAirListConfig = {
  getList: {
    url: '/console/live/liveBroadcast/selectLivingList',
    method: 'post'
  },
  offLive: {
    url: '/console/live/liveBroadcast/offLive',
    method: 'post'
  },
  selectRoomInfo: {
    url: '/console/live/liveRoomInfo/selectRoomInfo',
    method: 'post'
  }
}

// 直播记录
const liveHistoryConfig = {
  getList: {
    url: '/console/live/liveBroadcast/selectEndList',
    method: 'post'
  }
}

// 直播推荐库
const liveRecommendationConfig = {
  getList: {
    url: '/console/live/liveRoomRecommend/selectPage',
    method: 'post'
  },
  add: {
    url: '/console/live/liveRoomRecommend/add',
    method: 'post'
  },
  remove: {
    url: '/console/live/liveRoomRecommend/remove',
    method: 'post'
  }
}

export default {
  '/live-manager/on-air-list': makeAPI(onAirListConfig),
  '/live-manager/live-history': makeAPI(liveHistoryConfig),
  '/live-manager/live-recommendation': makeAPI(liveRecommendationConfig)
}
