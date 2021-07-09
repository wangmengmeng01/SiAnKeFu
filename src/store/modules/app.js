import Cookies from 'js-cookie'
import { request } from '@/api/httpRequest'
import { parseTime } from '@/utils'
const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  // mqtt客户端连接
  client: null,
  // 已订阅过的topic
  subscribeTopics: Cookies.get('subscribeTopics') || '',
  // mqtt最新收到的message
  message: {},
  // 需要调用会话人数
  sessionNumber: false,
  // 聊天消息对应到会话列表的最后一条消息
  sessionLastMsg: null
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  // mqtt连接
  SET_CLIENT: (state, client) => {
    state.client = client
  },
  SET_TOPICS: (state, topic) => {
    // const arr = state.subscribeTopics ? state.subscribeTopics.split(',') : []
    // if (!arr.includes(topic)) {
    if (state.client) {
      state.client.subscribe(topic, { qos: 1 }, error => {
        if (!error) {
          console.log('--订阅成功--：' + topic)
        }
      })
    }
  },
  CLEAR_TOPICS: (state, topics) => {
    Cookies.set('subscribeTopics', topics)
    state.subscribeTopics = topics
  },
  SET_MESSAGE: (state, message) => {
    state.message = message
  },
  SET_CURRENTSELECTSESSION: (state, currentSelectSession) => {
    state.currentSelectSession = currentSelectSession
  },
  SET_SESSIONNUMBER: (state, sessionNumber) => {
    state.sessionNumber = sessionNumber
  },
  SET_SESSIONLASTMSG: (state, sessionLastMsg) => {
    state.sessionLastMsg = sessionLastMsg
  }
}

const actions = {
  exportFile({ commit },data) {
    request({
      method: 'post',
      responseType: 'blob',
      url: data.url,
      data: data.data
    }).then(res => {
      let blob = res
      if ('download' in document.createElement('a')) { // 非IE下载
        let eleLink = document.createElement('a')
        let url = window.URL.createObjectURL(new Blob([blob],{type:"application/vnd.ms-excel"}))
        eleLink.href = url
        eleLink.download = data.name + parseTime(new Date);
        document.body.appendChild(eleLink)
        eleLink.click()
        window.URL.revokeObjectURL(url)
      }else{
           navigator.msSaveBlob(blob, data.name + parseTime(new Date));
      }
    }).catch(err => {

    })
  },
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
