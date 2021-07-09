import { makeAPI } from './httpRequest'

// 问题列表
const questionListConfig = {
  getList: {
    url: '/console/userQuestionStorage/pageList',
    method: 'post'
  },
  putOff: {
    url: '/console/userQuestionStorage/putOff',
    method: 'post'
  },
  create: {
    url: '/console/userQuestionStorage/create',
    method: 'post'
  }
}

// 问答详情
const questionAnswerDetailConfig = {
  getList: {
    url: '/console/userAnswer/findByPage',
    method: 'post'
  },
  deleteAnswer: {
    url: '/console/userAnswer/deleteAnswer',
    method: 'post'
  },
  getAnswerDetail: {
    url: '/console/userAnswer/getAnswerDetail',
    method: 'post'
  }
}

export default {
  '/question-answer-manager/question-list': makeAPI(questionListConfig),
  '/question-answer-manager/question-answer-detail': makeAPI(questionAnswerDetailConfig)
}
