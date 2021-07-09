import { login, getInfo, getMenu, getOssToken, logout } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    realName: '',
    menus: [],
    role: [],
    ossPrefix: '',
    onlineStatus: '',
    mqttInfo: JSON.parse(localStorage.getItem('mqttInfo')) || {}

  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_LOAD_MENUS: (state, me) => {

  },
  SET_REALNAME(state, realName) {
    state.realName = realName
  },
  SET_MENUS(state, menus) {
    state.menus = menus
  },
  SET_ROLE(state, role) {
    state.role = Array.isArray(role) ? role : []
  },
  SET_OSS_PREFIX(state, ossPrefix) {
    state.ossPrefix = ossPrefix
  },
  SET_MQTTINFO(state, mqttInfo) {
    localStorage.setItem('mqttInfo', JSON.stringify(mqttInfo))
    state.mqttInfo = mqttInfo
  },
  SET_ONLINESTATUS(state, onlineStatus) {
    state.onlineStatus = onlineStatus
  }
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    try {
      const { data } = await login({ username: username.trim(), password: password })
      commit('SET_TOKEN', data.accessToken)
      data.connection.userId = data.user.uid
      commit('SET_MQTTINFO', data.connection)
      setToken(data.accessToken)
    } catch (ex) {
      return Promise.reject(ex)
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { username: name, avatar, realName, roles } = data
        commit('SET_REALNAME', realName)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLE', roles)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  async getMenu({ commit }, menus) {
    try {
      if (this.state.menus && this.state.menus.length > 0) return this.state.menus
      const { data } = await getMenu({})
      console.log(data)
      commit('SET_MENUS', data)
    } catch (ex) {
      console.log(ex)
      commit('SET_MENUS', [])
    }
  },

  // user logout
  async logout({ commit, state }) {
    const { data } = await logout({})
    console.log('logout', data)
    return new Promise((resolve, reject) => {
      // removeToken() // must remove  token  first
      // resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 上传地址
  async getOssPrefix({ commit, state }) {
    try {
      const { data: { ossPrefix }} = await getOssToken()
      commit('SET_OSS_PREFIX', ossPrefix)
    } catch (ex) {
      commit('SET_OSS_PREFIX', '')
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

