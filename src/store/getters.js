const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  realName: state => state.user.realName,
  menus: state => state.user.menus,
  dicts: state => state.dicts.dicts,
  ossPrefix: state => state.user.ossPrefix, // 阿里云上传路径前缀域名
  mqttInfo: state => state.user.mqttInfo,
  onlineStatus: state => state.user.onlineStatus,
  message: state => state.app.message,
  currentSelectSession: state => state.app.currentSelectSession,
  sessionNumber: state => state.app.sessionNumber,
  sessionLastMsg: state => state.app.sessionLastMsg
}
export default getters
