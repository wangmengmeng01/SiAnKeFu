import { makeAPI } from './httpRequest'

// 充值配置
const rechargeConfigConfig = {
  getList: {
    url: '/console/member/recharge/list',
    method: 'post'
  },
  create: {
    url: '/console/member/recharge/create',
    method: 'post'
  },
  update: {
    url: '/console/member/recharge/update',
    method: 'post'
  },
  putOff: {
    url: '/console/member/recharge/putOff',
    method: 'post'
  }
}

// 充值记录
const rechargeHistoryConfig = {
  getList: {
    url: '/console/member/recharge/backendPageList',
    method: 'post'
  }
}

// 系统充值
const systemRechargeConfig = {
  getList: {
    url: '/console/member/recharge/systemRechargePageList',
    method: 'post'
  },
  create: {
    url: '/console/member/recharge/sysRecharge',
    method: 'post'
  }
}

export default {
  '/currency-manager/recharge-config': makeAPI(rechargeConfigConfig),
  '/currency-manager/recharge-history': makeAPI(rechargeHistoryConfig),
  '/currency-manager/system-recharge': makeAPI(systemRechargeConfig)
}
