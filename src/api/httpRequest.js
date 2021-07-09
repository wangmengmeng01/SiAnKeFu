import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'
const AXIOS_CFG = {
  baseURL: process.env.VUE_APP_URL,
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
}
Object.assign(axios.defaults, AXIOS_CFG)
// request拦截器
axios.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['X-ACCESS-TOKEN'] = getToken()
    }
    config.headers['platform'] = 'PLATFORM'
    config.headers['route'] = 'console'
    config.headers['source-type'] = 'csr'
    // config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
axios.interceptors.response.use(response => {
  const { status, statusText, data, message, config: { quiet, resolve } = {}} = response
  const res = (typeof data === 'object' && data) || {}
  const { code, msg } = res
  if (status < 200 || status > 300 || code < 200 || code > 300) {
    const error = new Error(message || msg || statusText)
    error.status = status
    error.code = code
    error.quiet = quiet
    error.resolve = resolve
    return handlerResponse(error)
  }
  return res
  /* const status = response.status
  const code = response.data.code
  if (status < 200 || status > 300) {
    Message.error(response.message)
    return Promise.reject('error')
  }
  if (code < 200 || code > 300) {
    Message.error(response.data.msg)
    return Promise.reject('error')
  }
  return response.data */
},
error => {
  return handlerResponse(error)
  /* let status = 0
  try {
    status = error.response.data.status
  } catch (e) {
    if (error.toString().indexOf('Error: timeout') !== -1) {
      Message.error('网络请求超时,请稍候再试')
      return Promise.reject(error)
    }
  }
  if (status) {
    if (status === 401) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (status === 403) {
      router.push({ path: '/401' })
    } else {
      const errorMsg = error.response.data.message
      if (errorMsg !== undefined) {
        Message.error(errorMsg)
      }
    }
  } else {
    Message.error(('接口请求失败'))
  } */
})
export default axios

export function makeAPI(config, namespace = {}) {
  return Object.keys(config).reduce((ns, name) => {
    const { url, ...cfg } = config[name]
    if (typeof url === 'string') {
      ns[name] = async function(params, ...args) {
        try {
          const option = Object.assign(JSON.parse(JSON.stringify(config[name])), {
            [cfg.method === 'post' ? 'data' : 'params']: params
          })
          args.forEach(arg => {
            Object.assign(option, arg)
          })
          const res = await axios(option)
          return res
        } catch (ex) {
          return Promise.reject(ex)
        }
      }
    } else if (typeof cfg === 'object' && cfg) {
      ns[name] = {}
      makeAPI(cfg, ns[name])
    }
    return ns
  }, namespace)
}
export function request(data) {
  return axios(data)
}

function handlerResponse(error) {
  console.log(error)
  let { message, status, code, quiet, resolve, config, response: { data } = {}} = error
  data = (typeof data === 'object' && data) || {}
  config = (typeof config === 'object' && config) || {}
  message = data.message || data.msg || message
  status = status || data.status
  code = code || data.status
  quiet = quiet || config.quiet
  resolve = resolve || config.resolve
  console.log(
    'message = ', message,
    'status = ', status,
    'code = ', code,
    'quiet = ', quiet,
    'resolve = ', resolve,
    'data = ', data
  )
  if (status === 401) {
    MessageBox.confirm(
      '登录状态已过期，您可以继续留在该页面，或者重新登录',
      '系统提示',
      {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    })
  } else if (status === 403) {
    router.push({ path: '/401' })
  } else {
    if (!quiet) {
      // 静默模式下，失败后不弹框提示
      Message.error(message)
    }
  }
  if (resolve) {
    // 强制resolved
    return Promise.resolve(error)
  }
  return Promise.reject(error)
}