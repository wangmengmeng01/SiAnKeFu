/**
 * 判断是否是空值， undefined、 null、 '' 为空
 * @param {Any} val 待判断对象
 * @returns {Boolean} true：空值、false：非空值
 */
export const isBlank = val => {
  return [undefined, null, ''].includes(val)
}

/**
 * 判断对象是否是函数类型
 * @param {Any} val 待判断对象
 * @returns {Boolean} true：函数类型、false：非函数类型
 */
export const isFunction = val => {
  return typeof val === 'function'
}

/**
 * 判断对象是否是 Promise 实例
 * @param {Any} val 待判断对象
 * @returns {Boolean} true：Promise 实例、false：非 Promise 实例
 */
export const isPromise = val => {
  return val && val.constructor === Promise
}

/**
 * 判断对象是否继承自 Error
 * @param {Any} val 待判断对象
 * @returns {Boolean} true：继承 Error、false：未继承 Error
 */
export const instanceOfError = val => {
  return val instanceof Error
}

/**
 * 从配置文件中查找某个配置项，如果存在，则使用这个配置，如果不存在，或者在查找过程中导致空指针异常，则使用默认配置
 * @param {Any} _default 默认配置
 * @param {Object|Null|Undefined} target 目标对象。空值时，target指向运行时的上下文环境
 * @param {String|Number} namespace target 对象的层级
 * @returns {Any} 配置项
 */
export const getValueFromConfig = (_default, target, namespace) => {
  try {
    const value = getValueByNamespace(namespace, target)
    return isBlank(value) ? _default : value
  } catch (e) {
    return _default
  }
}

/**
 * 把任意类型的对象，包装成 Promise 实例
 * @param {Any} handler 待包装对象
 * @returns {Promise} Promise 实例
 */
export const wrapPromise = handler => {
  if (isPromise(handler)) {
    // 是 Promise 实例
    return handler
  } else if (instanceOfError(handler)) {
    // 继承自 Error 类
    return Promise.reject(handler)
  } else if (!isFunction(handler)) {
    // 非函数类型
    return Promise.resolve(handler)
  } else {
    // 函数类型
    let funcReturn
    try {
      funcReturn = handler()
    } catch (e) {
      return Promise.reject(e)
    }
    return isPromise(funcReturn) // 函数返回值是 Promise 实例吗 ？
      ? funcReturn // 是 Promise 实例，则返回这个实例
      : instanceOfError(funcReturn) // 函数返回值是 Error 实例吗 ？
        ? Promise.reject(funcReturn) // 是 Error 实例，则返回这个实例
        : Promise.resolve(funcReturn) // 非 Error 实例，则返回这个函数返回值
  }
}

/**
 * 获取对象指定层级的属性值
 * @param {Object|Null|Undefined} target 目标对象。空值时，target指向运行时的上下文环境
 * @param {String|Number} namespace target的层级
 * @returns {Any} 属性值
 * @example call('a.b', {a: {b: 'value' }}), 返回值是'value'
 */
export const getValueByNamespace = (namespace, target) => {
  // 为了确保target指向特定上下文，勿使用箭头函数包裹函数主体
  typeof namespace === 'number' && (namespace = String(namespace));
  [null, undefined].includes(target) && (target = this)
  const namespaceList = namespace.split('.')
  return namespaceList.reduce((acc, prop, index, array) => {
    return acc ? acc[prop] : undefined
  }, target)
}

/**
 * 深度拷贝（简单版）
 * 注：仅拷贝普通对象或数组中的自身可迭代属性，其他的都不拷贝，拷贝规则如下：
 * boolean、number、string、null、undefined 和 function 、RegExp、Date 类型采用浅拷贝，
 * 除此以外的引用类型（对象和数组），使用深拷贝。
 * @param { Array | Object } source 被拷贝对象
 * @returns 深度拷贝后的对象
 */
export const deepCopy = source => {
  let target
  if (Array.isArray(source)) {
    target = []
  } else if ([RegExp, Date].includes(source.constructor)) {
    return source
  } else if (typeof source === 'object') {
    target = {}
  } else {
    return source
  }
  const deepCopyArray = array => {
    return array.map(item => {
      if (typeof item !== 'object' || item === null) {
        return item
      } else if (item.constructor === Array) {
        return deepCopyArray(item)
      } else {
        return deepCopy(item)
      }
    })
  }
  let once
  for (const key in source) {
    once = true
    if (!source.hasOwnProperty(key)) {
      continue
    }
    const value = source[key]
    if (typeof value !== 'object' || value === null) {
      target[key] = value
    } else if (value.constructor === Array) {
      target[key] = deepCopyArray(value)
    } else {
      target[key] = deepCopy(value)
    }
  }
  if (!once) {
    if (Array.isArray(source)) {
      target = []
    }
  }
  return target
}

/**
 * 把值赋给对象指定的层级下
 * @param {Any} value 值
 * @param {String|Number} namespace 层级
 * @param {Object|Null|Undefined} target 目标对象。空值时，target指向运行时的上下文环境
 * @returns {Boolean} 赋值成功或失败
 * @example call('a.b', {a: {b: 'value' }}), 返回值是'value'
 */
export const setValueByNamespace = function(value, namespace, target) {
  // 为了确保target指向特定上下文，勿使用箭头函数包裹函数主体
  if (['string', 'number', 'boolean', 'undefined'].includes(typeof target) || target === null) {
    return false
  }
  typeof namespace === 'number' && (namespace = String(namespace));
  [null, undefined].includes(target) && (target = this)
  const namespaceList = namespace.split('.')
  let result
  try {
    result = namespaceList.reduce((acc, prop, index, array) => {
      const isNull = [null, undefined].includes(acc)
      if (!isNull && array.length - 1 === index) {
        acc[prop] = value
        return true
      } else if (!isNull) {
        return acc[prop]
      } else {
        throw new Error()
      }
    }, target)
  } catch (e) {
    result = false
  }
  return result
}

/**
 * 过滤掉对象空元素
 * @param {Object} target 目标对象
 * @returns {Object} 过滤后的对象
 */
export const filterObject = function(target) {
  return Object.keys(target).reduce((acc, key) => {
    !isBlank(target[key]) && (acc[key] = target[key])
    return acc
  }, {})
}

/**
 * 过滤掉数组空元素
 * @param {Array} target 目标对象
 * @returns {Array} 过滤后的对象
 */
export const filterArray = function(target) {
  return target.reduce((acc, item) => {
    !isBlank(item) && acc.push(item)
    return acc
  }, [])
}
/**
 * 获取当前日期前N天后N天日期
 */
export const GetDateStr = (AddDayCount) => {
  var dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
  var y = dd.getFullYear()
  var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1) // 获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
  return y + '-' + m + '-' + d
}

/**
 * @param {*} date 具体日期变量
 * @param {string} dateType 需要返回类型
 * @return {string} dateText 返回为指定格式的日期字符串
 */
function getFormatDate(date, dateType) {
  const dateObj = new Date(date)
  let month = dateObj.getMonth() + 1
  let strDate = dateObj.getDate()
  let hours = dateObj.getHours()
  let minutes = dateObj.getMinutes()
  let seconds = dateObj.getSeconds()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  if (hours >= 0 && hours <= 9) {
    hours = '0' + hours
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = '0' + minutes
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = '0' + seconds
  }

  let dateText = dateObj.getFullYear() + '年' + (dateObj.getMonth() + 1) + '月' + dateObj.getDate() + '日'
  if (dateType === 'yyyy-mm-dd') {
    dateText = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate()
  }
  if (dateType === 'yyyy.mm.dd') {
    dateText = dateObj.getFullYear() + '.' + (dateObj.getMonth() + 1) + '.' + dateObj.getDate()
  }
  if (dateType === 'yyyy-mm-dd MM:mm:ss') {
    dateText = dateObj.getFullYear() + '-' + month + '-' + strDate + ' ' + hours + ':' + minutes + ':' + seconds
  }
  if (dateType === 'mm-dd MM:mm:ss') {
    dateText = month + '-' + strDate + ' ' + hours + ':' + minutes + ':' + seconds
  }
  if (dateType === 'yyyy年mm月dd日 MM:mm:ss') {
    dateText = dateObj.getFullYear() + '年' + month + '月' + strDate + '日' + ' ' + hours + ':' + minutes + ':' + seconds
  }
  if (dateType === 'MM:mm') {
    dateText = hours + ':' + minutes
  }
  return dateText
}

export default {
  install(Vue) {
    Vue.prototype.$tool = {
      isBlank,
      isFunction,
      isPromise,
      instanceOfError,
      wrapPromise,
      deepCopy,
      getValueByNamespace,
      getValueFromConfig,
      setValueByNamespace,
      filterObject,
      filterArray,
      getFormatDate,
      GetDateStr
    }
  }
}
