import { throttle } from 'lodash'
import request from '@/api/httpRequest'

const doFetch = throttle(async function({ state, commit }) {
  const names = Array.from(new Set(state.fetchList))
  commit('fetchListClean')
  const dictsData = await Promise.all(names.map(name => request({
    url: '/console/sysDict/getDetail',
    method: 'get',
    data: { dictTypeCode: name }
  })))
  dictsData.forEach((dictDataSource, dictDataIndex) => {
    const dictName = names[dictDataIndex]
    let dictData = []
    if (dictDataSource && dictDataSource.length > 0) {
      dictData = dictDataSource.map(e => ({
        label: e.dictDetailName,
        value: e.dictDetailCode
      }))
    }
    commit('set', {
      name: dictName,
      value: dictData
    })
  })
}, 1000, {
  leading: false
})

export default context => ({
  namespaced: true,
  state: {
    // 字典数据
    dicts: [
      // {
      //   name: 'sex',
      //   value: [
      //     { label: '男', value: 1 },
      //     { label: '女', value: 2 }
      //   ]
      // }
    ],
    // 请求队列
    fetchList: []
  },
  actions: {
    /**
     * @description 获取字典
     * @param {Object} vuex context
     * @param {String} name 字典名称
     */
    get({ state }, name) {
      const dict = state.dicts.find(e => e.name === name)
      return (dict && dict.value) || []
    },
    /**
     * @description 加载一个字典
     * @param {Object} vuex context
     * @param {String} name 字典名称
     */
    fetch(payload, name = '') {
      if (name) {
        payload.commit('fetchListPush', name)
        doFetch(payload)
      }
    }
  },
  mutations: {
    /**
     * @description 设置字典
     * @param {Object} vuex context
     * @param {Object} payload {String} name 字典名称
     * @param {Object} payload {Array} value 字典数据
     */
    set(state, { name = '', value = [] } = {}) {
      const dictIndex = state.dicts.findIndex(e => e.name === name)
      if (dictIndex < 0) {
        state.dicts.push({ name, value })
      } else {
        state.dicts.splice(dictIndex, 1, { name, value })
      }
    },
    fetchListPush(state, item) {
      state.fetchList.push(item)
    },
    fetchListClean(state) {
      state.fetchList = []
    }
  }
})
