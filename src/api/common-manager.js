import { makeAPI } from './httpRequest'

// 版本更新管理
const versionUpdateConfig = {
  // 分页查询list
  getList: {
    url: '/console/versionUpgrade/pageList',
    method: 'post'
  },
  // 新增tag
  create: {
    url: '/console/versionUpgrade/create',
    method: 'post'
  }
}

// 协议管理
const agreementConfig = {
  // 分页查询list
  getList: {
    url: '/console/platformProtocolManage/findAll',
    method: 'post'
  },
  // 编辑
  update: {
    url: '/console/platformProtocolManage/update',
    method: 'post'
  }
}

// 用户个性标签库
const userIndividualityTagConfig = {
  // 分页查询list
  getList: {
    url: '/console/userTagStorage/pageList',
    method: 'post'
  },
  // 新增tag
  create: {
    url: '/console/userTagStorage/create',
    method: 'post'
  },
  // 上架下架标签
  putOff: {
    url: '/console/userTagStorage/putOff',
    method: 'post'
  }
}

// 用户印象标签库
const userImpressionTagConfig = {
  // 分页查询list
  getList: {
    url: '/console/impressionLibrary/pageList',
    method: 'post'
  },
  // 新增tag
  create: {
    url: '/console/impressionLibrary/create',
    method: 'post'
  },
  // 上架下架标签
  putOff: {
    url: '/console/impressionLibrary/putOff',
    method: 'post'
  }
}

// 语音签名库
const audioSignConfig = {
  // 分页查询list
  getList: {
    url: '/console/contentLibrary/pageList',
    method: 'post'
    /**
     * type => 3 (固定)
     * status => 状态，0 下架；1 上架
     * data: { type: '', status: ''}
     */
  },
  // 新增
  create: {
    url: '/console/contentLibrary/create',
    method: 'post'
    /**
     * type => 3 (固定)
     * content => 文案内容
     * status => 状态，0 下架；1 上架
     * data: { type: '', content: '', status: ''}
     */
  },
  // 上架下架
  putOff: {
    url: '/console/contentLibrary/putOff',
    method: 'post'
    /**
     * status => 状态，0 下架；1 上架
     * data: { id: '', status: ''}
     */
  }
}

// 搭讪库
const accostConfig = {
  // 分页查询list
  getList: {
    url: '/console/contentLibrary/pageList',
    method: 'post'
    /**
     * type => 2 (固定)
     * status => 状态，0 下架；1 上架
     * data: { type: '', status: ''}
     */
  },
  // 新增
  create: {
    url: '/console/contentLibrary/create',
    method: 'post'
    /**
     * type => 2 (固定)
     * content => 文案内容
     * status => 状态，0 下架；1 上架
     * data: { type: '', content: '', status: ''}
     */
  },
  // 上架下架
  putOff: {
    url: '/console/contentLibrary/putOff',
    method: 'post'
    /**
     * status => 状态，0 下架；1 上架
     * data: { id: '', status: ''}
     */
  }
}

// 下拉文案库
const pullRefreshTextConfig = {
  // 分页查询list
  getList: {
    url: '/console/contentLibrary/pageList',
    method: 'post'
    /**
     * type => 1 (固定)
     * status => 状态，0 下架；1 上架
     * data: { type: '', status: ''}
     */
  },
  // 新增
  create: {
    url: '/console/contentLibrary/create',
    method: 'post'
    /**
     * type => 1 (固定)
     * content => 文案内容
     * status => 状态，0 下架；1 上架
     * data: { type: '', content: '', status: ''}
     */
  },
  // 上架下架
  putOff: {
    url: '/console/contentLibrary/putOff',
    method: 'post'
    /**
     * status => 状态，0 下架；1 上架
     * data: { id: '', status: ''}
     */
  }
}

// 配置管理
const configManager = {
  // 获取个人秀点赞金额配置
  getLikeConfig: {
    url: '/console/config/getUserShowLikeAmountConfig',
    method: 'post'
  },
  // 设置个人秀点赞金额配置
  saveLikeConfig: {
    url: '/console/config/updateUserShowLikeAmountConfig',
    method: 'post'
  },
  // 获取世界频道发言金额配置
  getChannelConfig: {
    url: '/console/config/getVipWorldPublishMsgAmountConfig',
    method: 'post'
  },
  // 设置世界频道发言金额配置
  saveChannelConfig: {
    url: '/console/config/updateVipWorldPublishMsgAmountConfig',
    method: 'post'
  },
  // 获取每日红包金额配置
  getRedpacketConfig: {
    url: '/console/config/getDailyRedBagGoldNumberConfig',
    method: 'post'
  },
  // 设置每日红包金额配置
  saveRedpacketConfig: {
    url: '/console/config/updateDailyRedBagGoldNumberConfig',
    method: 'post'
  },
  // 获取俱乐部任务打赏金额配置
  getTaskConfig: {
    url: '/console/config/getTaskAmountConfig',
    method: 'post'
  },
  // 设置俱乐部任务打赏金额配置
  saveTaskConfig: {
    url: '/console/config/updateTaskAmountConfig',
    method: 'post'
  },
  // 获取俱乐部心情打赏金额配置
  getMoodConfig: {
    url: '/console/config/getMoodRewardAmountConfig',
    method: 'post'
  },
  // 设置俱乐部心情打赏金额配置
  saveMoodConfig: {
    url: '/console/config/updateMoodRewardAmountConfig',
    method: 'post'
  },
  // 获取直播间广告位入口配置
  getLiveRoomConfig: {
    url: '/console/config/getLiveAdEntranceConfig',
    method: 'post'
  },
  // 设置直播间广告位入口配置
  saveLiveRoomConfig: {
    url: '/console/config/updateLiveAdEntranceConfig',
    method: 'post'
  },
  // 获取联系方式配置
  getContactConfig: {
    url: '/console/config/getAppContactConfig',
    method: 'post'
  },
  // 设置联系方式配置
  saveContactConfig: {
    url: '/console/config/updateAppContactConfig',
    method: 'post'
  }
}

export default {
  '/common-manager/version-update': makeAPI(versionUpdateConfig),
  '/common-manager/agreement': makeAPI(agreementConfig),
  '/common-manager/user-individuality-tag': makeAPI(userIndividualityTagConfig),
  '/common-manager/user-impression-tag': makeAPI(userImpressionTagConfig),
  '/common-manager/audio-sign': makeAPI(audioSignConfig),
  '/common-manager/accost': makeAPI(accostConfig),
  '/common-manager/pull-refresh-text': makeAPI(pullRefreshTextConfig),
  '/common-manager/config-manager': makeAPI(configManager)
}
