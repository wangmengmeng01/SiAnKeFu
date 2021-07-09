/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return str.length > 4
}

export function validString(v, rule = /^[A-Za-z0-9!\.\?@]{3,20}$/) {
  return rule.test(v)
}

/**
 *
 * @param {string} v
 * @param {Rexp} rule
 */
export function validChineseName(v, rule = /^[\u4e00-\u9fa5]{2,10}$/) {
  return rule.test(v)
}

export function validPassword(v, rule = /^[A-Za-z0-9!\.\?@]{6,16}$/) {
  return rule.test(v) ? undefined : '密码由6-16个大小写字母、数字和英文符号(!.?@)组成'
}

export function validMobile(v, rule = /^1[3456789]\d{9}$/) {
  return rule.test(v)
}

export function validMail(v, rule = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/) {
  return rule.test(v)
}
// element form表单校验
export default {
  required: (val, flag = true) => ({ required: flag, message: `请输入 ${val}`, trigger: 'blur' }),
  length: (min, max) => ({ min, max, message: `长度在 ${min} 到 ${max} 个字符` }),
  // 金额
  money: { pattern: /^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/, message: '金额格式不正确' },
  // 正整数
  integer: { pattern: /^[1-9]\d*$/, message: '请输入正整数(非0)' },
  // 手机号码
  mobile: { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确' },
  // 身份证号
  IdCard: { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '身份证号码格式不正确' },
  // name 中英文数字不含下划线
  name: { pattern: /^[\u4E00-\u9FA5A-Za-z0-9]+$/, message: '只能输入中英文数字' },
  // 密码由6-16个大小写字母、数字和英文符号(!.?@)组成
  password: { pattern: /^[A-Za-z0-9!\.\?@]{6,16}$/, message: '密码由6-16个大小写字母、数字和英文符号(!.?@)' },
  // 链接
  link: { pattern: new RegExp('[a-zA-z]+://[^\\s]*'), message: '链接格式不正确' },
  // 版本号
  version: { pattern: /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/, message: '版本号格式不正确' }
}
