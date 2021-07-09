<template>
  <div class="customer-workbench-contain">
    <top-group :endNum="endNum" :online-status="onlineStatus" :current-select-session="currentSelectSession" @close="onClose" />
    <div class="bottom">
      <left-group :endList.sync="endList" :current-select-session="currentSelectSession" @select="onSelect" />
      <template v-if="currentSelectSession">
        <center-group :current-select-session="currentSelectSession" @close="onClose" />
        <right-group :current-select-session="currentSelectSession" />
      </template>
      <template v-else>
        <div class="empty-group">
          <div class="conversation-group">
            <template v-if="isConversation">
              <div class="name">Mooo 你好</div>
              <div class="tip">该用户正在会话中</div>
            </template>
            <template v-if="!currentSelectSession">
              <img src="@/assets/Home/content-empty.png" width="364px" alt="">
            </template>
          </div>

        </div>
      </template>
    </div>
    <audio id="video" src="@/assets/musics/tip.mp3" muted />

  </div>
</template>

<script>
import topGroup from './top-group'
import leftGroup from './left-group'
import rightGroup from './right-group'
import centerGroup from './center-group'
import mqtt from 'mqtt'
import { removeToken } from '@/utils/auth'
import API from '@/api/customerWorkbench'
export default {
  name: 'CustomerWorkbench',
  components: {
    topGroup, leftGroup, rightGroup, centerGroup
  },
  data() {
    return {
      endNum: 0,
      endList: [],
      // 搜索用户后选择的用户正在会话中提示
      isConversation: false,
      // mqtt实例
      mqttClient: null,
      // 当前选择的会话
      currentSelectSession: null,
      // mqtt在线状态
      onlineStatus: true
    }
  },
  beforeMount() {
    this.initMqtt()
  },
  beforeDestroy() {
    if (this.mqttClient) {
      this.$store.commit('app/SET_CLIENT', null)
      this.$store.commit('app/CLEAR_TOPICS', '')
      this.mqttClient.end()
      this.mqttClient = null
      this.$store.dispatch('user/logout')

      console.log('mqtt close ok')
    }
  },
  methods: {
    initMqtt() {
      var mqttInfo = this.$store.getters.mqttInfo
      // console.log('mqttInfo..', mqttInfo)
      const options = {
        keepalive: 10,
        clientId: mqttInfo.mqttClientId,
        username: mqttInfo.username,
        password: mqttInfo.password,
        clean: true,
        connectTimeout: 30000,
        reconnectPeriod: 6000,
        reconnect: true
      }
      try {
        // 根据当前网络环境适配协议
        const protocol = window.location.protocol
        let connectUrl = ''
        if (protocol === 'http:') {
          connectUrl = mqttInfo.connectionUrls.find(i => i.protocol === 'MQTT_WSS').url
        } else if (protocol === 'https:') {
          connectUrl = mqttInfo.connectionUrls.find(i => i.protocol === 'MQTT_WSS').url
        }
        // 订阅的topic
        const userTopic = mqttInfo.subscribeTopicInfoList
        // 连接mqtt
        this.mqttClient = mqtt.connect(connectUrl, options)

        this.$store.commit('app/SET_CLIENT', this.mqttClient)

        this.mqttClient.on('connect', (e) => {
          console.log('mqtt connect 连接成功')
          userTopic.forEach(item => {
            this.$store.commit('app/SET_TOPICS', item.topicURL)
          })
          this.onlineStatus = true
        })
        this.mqttClient.on('message', (topic, message) => {

          const { body, header } = JSON.parse(message.toString())
          console.log('mqtt message 接收到消息', body, header, topic)
          console.log('messageType接收到消息', JSON.parse(body.extras.biz_content).messageType)
          if (JSON.parse(body.extras.biz_content).messageType === 'LOGIN_EVENT') {
            this.onLogout('您的账号已在其它地方登录,请重新登录')
          }
          if (JSON.parse(body.extras.biz_content).messageType === 'FORCE_ASSISTANT_OFFLINE') {
            this.onLogout(JSON.parse(body.extras.biz_content).assistantName + '已被强制下线')
          }
          if (JSON.parse(body.extras.biz_content).messageType === 'END_SESSION_TASK') {
            if (JSON.parse(body.extras.biz_content).mode === 'timeout') {

              console.log('timeout前会话任务',JSON.parse(body.extras.biz_content), {body, header, topic})
              if (JSON.parse(body.extras.biz_content).sessionTaskId === this.currentSelectSession.sessionTaskId) {
                this.onClose()

              }
              this.endList.push(JSON.parse(body.extras.biz_content))
              API[this.$route.path].expiredTime({ }).then(res => {
                if (res.success) {
                  this.$notify.info({
                    title: '提示',
                    message: JSON.parse(body.extras.biz_content).appUserName + '已超出'+res.data.expiredSeconds/60+'分钟未回复，已帮您自动结束当前会话任务。'
                  });

                }
              })
              this.endNum++;
              // this.$alert(JSON.parse(body.extras.biz_content).appUserName + '已超出三分钟未回复，已帮您自动结束当前会话任务。', '提示', {
              //   confirmButtonText: '确定',
              //   callback: action => {
              //     this.endNum++;
              //     this.onClose()
              //   }
              // })
            }
          }
          if (JSON.parse(body.extras.biz_content).messageType === 'ASSIGN_SESSION_TASK' || JSON.parse(body.extras.biz_content).messageType === 'TEXT') {
            setTimeout(() => {
              document.getElementById('video').play()
            }, 100)
          }
          this.$store.commit('app/SET_MESSAGE', { topic, header, body })
        })
        this.mqttClient.on('reconnect', (error) => {
          console.log('mqtt reconnect 正在重连...', error)
          this.onlineStatus = false
        })
        this.mqttClient.on('error', (error, value) => {
          console.log('mqtt error事件入口')
          console.log(new Date().toLocaleTimeString() + '连接失败:')
          console.log(error, 'table')
          this.onlineStatus = false
          // if (error + '' === 'Error: Connection refused: Not authorized') {
          //   this.mqttClient.end()
          // }
        })
        this.mqttClient.on('close', (error) => {
          console.log('mqtt close', error)
          this.onlineStatus = false
        })
      } catch (error) {
        console.log(error)
      }
    },
    async onLogout(msg) {
      await removeToken()
      this.$message({
        type: 'error',
        message: msg,
        onClose: () => {
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          window.location.reload()
        }
      })
    },
    onSelect(v) {
      this.currentSelectSession = v
      console.log('select', v)
    },
    onClose() {
      this.currentSelectSession = null
    }
  }
}
</script>

<style scoped lang='scss'>
.customer-workbench-contain{
  .bottom{
    display: flex;
    justify-content: space-around;
    margin: 10px 10px;
    border: 1px solid rgb(240,240,240);
    height: calc(100vh - 80px);
    .empty-group{
      flex: 1;
      border-left: 1px solid rgb(240,240,240);
      .conversation-group{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        height: 100%;
        font-size: 14px;
        .name{
          font-weight: bold;
          margin-bottom: 20px;
        }
      }
    }
  }
}

</style>