import { makeAPI } from './httpRequest'

// 话题列表
const topicListConfig = {
  getList: {
    url: '/console/sns/topicMaster/pageList',
    method: 'post'
  },
  create: {
    url: '/console/sns/topicMaster/create',
    method: 'post'
  },
  update: {
    url: '/console/sns/topicMaster/update',
    method: 'post'
  },
  putOff: {
    url: '/console/sns/topicMaster/putOff',
    method: 'post'
  }
}

// 话题详情
const topicDetailConfig = {
  getList: {
    url: '/console/sns/app/dynamic/pageList', // 同动态列表
    method: 'post'
  },
  putOff: {
    url: '/console/sns/app/dynamic/putOff', // 同动态上下架
    method: 'post'
  }
}

// 动态列表
const postListConfig = {
  getList: {
    url: '/console/sns/app/dynamic/pageList',
    method: 'post'
  },
  canRecommend: {
    url: '/console/sns/app/dynamic/canRecommend',
    method: 'post'
  },
  putOff: {
    url: '/console/sns/app/dynamic/putOff',
    method: 'post'
  },
  topicCommentList: {
    url: '/console/sns/app/dynamic/topicCommentList',
    method: 'post'
  },
  putOffComment: {
    url: '/console/sns/app/dynamic/putOffComment',
    method: 'post'
  }
}

// 动态推荐库
const postRecommendationConfig = {
  getList: {
    url: '/console/sns/app/dynamic/findDynamics',
    method: 'post'
  },
  recommend: {
    url: '/console/sns/app/dynamic/recommend',
    method: 'post'
  },
  getRecommendationList: { // 查询可以被推荐的动态
    url: '/console/sns/app/dynamic/canRecommend',
    method: 'post'
  }
}

// 关注推荐库
const followRecommendationConfig = {
  getList: {
    url: '/console/user/userRecommendHistory/pageList',
    method: 'post'
  },
  recommend: {
    url: '/console/user/userRecommendHistory/recommend',
    method: 'post'
  }
}

export default {
  '/post-manager/topic-list': makeAPI(topicListConfig),
  '/post-manager/topic-detail': makeAPI(topicDetailConfig),
  '/post-manager/post-list': makeAPI(postListConfig),
  '/post-manager/post-recommendation': makeAPI(postRecommendationConfig),
  '/post-manager/follow-recommendation': makeAPI(followRecommendationConfig)
}
