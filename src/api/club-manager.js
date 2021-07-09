import { makeAPI } from './httpRequest'

// 俱乐部列表
const clubList = {
  // 分页查询list
  getList: {
    url: '/console/club/clubPageList',
    method: 'post'
  }
}

// 俱乐部详情
const clubDetail = {
  getClubDetail: {
    url: '/console/club/consoleClubDetail',
    method: 'post'
  }
}

// 新人申请推荐库
const recommendLib = {
  // 分页查询list
  getList: {
    url: '/console/user/userRecommendToClub/findByPage',
    method: 'post'
  },
  // 新增用户
  create: {
    url: '/console/user/userRecommendToClub/batch',
    method: 'post'
  },
  // 移出推荐
  putOff: {
    url: '/console/user/userRecommendToClub/remove',
    method: 'post'
  }
}

// 任务发布记录
const taskRecord = {
  // 分页查询list
  getList: {
    url: '/console/club/task/findBackstageClubTaskList',
    method: 'post'
  },
  getDetail: {
    url: '/console/club/task/findBackstageClubTaskDetailed',
    method: 'post'
  }
}

// 心情发布记录
const moodRecord = {
  // 分页查询list
  getList: {
    url: '/console/club/mood/getMoodResourceList',
    method: 'post'
  },
  getDetail: {
    url: '/console/club/mood/getMoodResourceDetail',
    method: 'post'
  }
}

// 俱乐部红包记录
const redpacket = {
  // 分页查询list
  getList: {
    url: '/console/club/redPacketItemPage',
    method: 'post'
  },
  getDetail: {
    url: '/console/club/groupBagTakeDetail',
    method: 'post'
  }
}

// 新人申请记录
const applicationRecord = {
  // 分页查询list
  getList: {
    url: '/console/club/consoleApplyPageList',
    method: 'post'
  }
}
// 绑定记录
const bindRecord = {
  // 分页查询list
  getList: {
    url: '/console/bringIn/anchorBringInStatisticsPage',
    method: 'post'
  }
}
// 绑定记录
const bindManNum = {
  // 分页查询list
  getList: {
    url: '/console/bringIn/consumptionPage',
    method: 'post'
  }
}
export default {
  '/club-manager/club-list': makeAPI(clubList),
  '/club-manager/club-detail': makeAPI(clubDetail),
  '/club-manager/recommend-lib': makeAPI(recommendLib),
  '/club-manager/task-record': makeAPI(taskRecord),
  '/club-manager/mood-record': makeAPI(moodRecord),
  '/club-manager/red-packet': makeAPI(redpacket),
  '/club-manager/application-record': makeAPI(applicationRecord),
  '/club-manager/bind-record': makeAPI(bindRecord),
  '/club-manager/bind-man-num': makeAPI(bindManNum)
}